import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Loader2, CheckCircle, XCircle, Clock, MessagesSquare } from "lucide-react";
import { notifySuccess, notifyError, notifyInfo } from "../../lib/notifications";
import "react-toastify/dist/ReactToastify.css";

interface Demande {
  id: string;
  simulation_id: string;
  demandeur_id: string;
  simulation_titre: string;
  nom_demandeur: string;
  role_demandeur: string;
  message?: string | null;
  created_at: string;
  statut: "EN_ATTENTE" | "APPROUVE" | "REJETE";
}

const ListeDemandesAcces = () => {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDemandes = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("simulation_access_requests")
      .select(
        `id, simulation_id, demandeur_id, role_demandeur, message, created_at, statut,
         simulation:simulation_id (titre),
         demandeur:demandeur_id (nom, prenom)`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur chargement demandes:", error);
      setLoading(false);
      return;
    }

    if (data) {
      const mapped: Demande[] = data.map((d: any) => ({
        id: d.id,
        simulation_id: d.simulation_id,
        demandeur_id: d.demandeur_id,
        simulation_titre: d.simulation?.titre ?? "Inconnu",
        nom_demandeur: `${d.demandeur?.prenom ?? ""} ${d.demandeur?.nom ?? ""}`.trim(),
        role_demandeur: d.role_demandeur,
        message: d.message,
        created_at: d.created_at,
        statut: d.statut,
      }));
      setDemandes(mapped);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDemandes();
  }, []);

  const handleDecision = async (demande: Demande, decision: "APPROUVE" | "REJETE") => {
    const { error: updateError } = await supabase
      .from("simulation_access_requests")
      .update({ statut: decision })
      .eq("id", demande.id);

    if (updateError) {
      notifyError("❌ Erreur lors de la mise à jour de la demande.");
      return;
    }

    if (decision === "APPROUVE") {
      const { error: insertError } = await supabase
        .from("simulations_professeurs")
        .insert({
          simulation_id: demande.simulation_id,
          professeur_id: demande.demandeur_id,
          est_autorisee: true,
          demande_envoyee: false,
          autorisee_at: new Date().toISOString(),
        });

      if (insertError) {
        notifyInfo("Demande approuvée, mais une erreur est survenue lors de l'autorisation.");
        return;
      }
    }

    await loadDemandes();
    notifySuccess(`Demande ${decision === "APPROUVE" ? "approuvée" : "rejetée"} avec succès.`);
  };

  // Regrouper par statut
  const demandesEnAttente = demandes.filter(d => d.statut === "EN_ATTENTE");
  const demandesApprouvees = demandes.filter(d => d.statut === "APPROUVE");
  const demandesRejetees = demandes.filter(d => d.statut === "REJETE");

  const renderDemande = (demande: Demande) => {
    // Choix icône + couleur selon statut
    let statutColor = "";
    let StatutIcon = null;

    switch (demande.statut) {
      case "EN_ATTENTE":
        statutColor = "text-yellow-600";
        StatutIcon = Clock;
        break;
      case "APPROUVE":
        statutColor = "text-green-600";
        StatutIcon = CheckCircle;
        break;
      case "REJETE":
        statutColor = "text-red-600";
        StatutIcon = XCircle;
        break;
    }

    return (
      <div
        key={demande.id}
        className="border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div className="mb-4 md:mb-0">
          <p>
            <span className="font-semibold">{demande.nom_demandeur}</span> demande l'accès à la simulation :{" "}
            <span className="italic">{demande.simulation_titre}</span>
          </p>
          {demande.message && (
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <MessagesSquare className="w-4 h-4 text-gray-500" />
              {demande.message}
            </p>
          )}
          <p className={`flex items-center gap-1 mt-2 font-semibold ${statutColor}`}>
            <StatutIcon className="w-5 h-5" /> {demande.statut.replace("_", " ")}
          </p>
        </div>

        {/* Boutons uniquement si en attente */}
        {demande.statut === "EN_ATTENTE" && (
          <div className="flex gap-2">
            <button
              onClick={() => handleDecision(demande, "APPROUVE")}
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition"
            >
              <CheckCircle size={18} /> Approuver
            </button>
            <button
              onClick={() => handleDecision(demande, "REJETE")}
              className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition"
            >
              <XCircle size={18} /> Rejeter
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {loading ? (
        <div className="flex justify-center items-center text-gray-600">
          <Loader2 className="animate-spin mr-2" /> Chargement des demandes...
        </div>
      ) : demandes.length === 0 ? (
        <p className="text-gray-500">Aucune demande trouvée.</p>
      ) : (
        <>
          <section>
            <h3 className="text-xl font-semibold mb-4">Demandes en attente</h3>
            {demandesEnAttente.length > 0 ? (
              demandesEnAttente.map(renderDemande)
            ) : (
              <p className="text-gray-500">Aucune demande en attente.</p>
            )}
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Demandes approuvées</h3>
            {demandesApprouvees.length > 0 ? (
              demandesApprouvees.map(renderDemande)
            ) : (
              <p className="text-gray-500">Aucune demande approuvée.</p>
            )}
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Demandes rejetées</h3>
            {demandesRejetees.length > 0 ? (
              demandesRejetees.map(renderDemande)
            ) : (
              <p className="text-gray-500">Aucune demande rejetée.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default ListeDemandesAcces;