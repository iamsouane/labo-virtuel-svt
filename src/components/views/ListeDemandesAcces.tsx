//src/components/admin/ListeDemandesAcces.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  MessagesSquare,
} from "lucide-react";
import { notifySuccess, notifyError, notifyInfo } from "../../lib/notifications";
import type { Profil } from "../../types";

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

const ListeDemandesAcces = ({ user }: { user: Profil }) => {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user.role === "ADMIN";
  const isProf = user.role === "PROFESSEUR";

  const loadDemandes = async () => {
    setLoading(true);

    let query = supabase
      .from("simulation_access_requests")
      .select(`
        id, simulation_id, demandeur_id, role_demandeur, message, created_at, statut,
        simulation:simulation_id (titre),
        demandeur:demandeur_id (prenom, nom),
        destinataire_id
      `);

    if (isProf) {
      query = query.eq("destinataire_id", user.id);
    } else if (isAdmin) {
      query = query.eq("role_demandeur", "PROFESSEUR");
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

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
        simulation_titre: d.simulation?.titre ?? "Inconnue",
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

const handleDecision = async (
  demande: Demande,
  decision: "APPROUVE" | "REJETE"
) => {
  const { error: updateError } = await supabase
    .from("simulation_access_requests")
    .update({ statut: decision })
    .eq("id", demande.id);

  if (updateError) {
    notifyError("Erreur lors de la mise à jour de la demande.");
    return;
  }

  if (decision === "APPROUVE") {
    if (demande.role_demandeur === "PROFESSEUR") {
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
        console.error("Erreur insertion simulation_professeur:", insertError);
        notifyInfo("Demande approuvée, mais erreur lors de l'autorisation.");
        return;
      }

    } else if (demande.role_demandeur === "ELEVE") {
      // Cherche le professeur de l'élève
      const { data: professeurData, error: profError } = await supabase.rpc("get_professeur_de_eleve", {
        p_eleve_id: demande.demandeur_id,
      });

      if (profError || !professeurData) {
        console.error("Erreur lors de la récupération du professeur :", profError);
        notifyInfo("Demande approuvée, mais impossible de retrouver le professeur de l’élève.");
        return;
      }

      // Vérifie si une autorisation existe déjà
      const { data: existing, error: existError } = await supabase
        .from("simulations_eleves")
        .select("id")
        .eq("eleve_id", demande.demandeur_id)
        .eq("simulation_id", demande.simulation_id)
        .maybeSingle();

      if (existError) {
        console.error("Erreur vérification existence:", existError);
        notifyInfo("Demande approuvée, mais erreur lors de la vérification.");
        return;
      }

      if (!existing) {
        const { error: insertError } = await supabase
          .from("simulations_eleves")
          .insert({
            simulation_id: demande.simulation_id,
            eleve_id: demande.demandeur_id,
            professeur_id: professeurData,
            est_autorisee: true,
            autorisee_at: new Date().toISOString(),
            demande_envoyee: false,
          });

        if (insertError) {
          console.error("Erreur insertion simulation_eleve:", insertError);
          notifyInfo("Demande approuvée, mais erreur lors de l'autorisation.");
          return;
        }
      }
    }
  }

  await loadDemandes();
  notifySuccess(`Demande ${decision === "APPROUVE" ? "approuvée" : "rejetée"} avec succès.`);
};

  const renderDemande = (demande: Demande) => {
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
            <span className="font-semibold">{demande.nom_demandeur}</span>{" "}
            demande l'accès à la simulation :{" "}
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
            {demandes.filter((d) => d.statut === "EN_ATTENTE").map(renderDemande)}
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Demandes approuvées</h3>
            {demandes.filter((d) => d.statut === "APPROUVE").map(renderDemande)}
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Demandes rejetées</h3>
            {demandes.filter((d) => d.statut === "REJETE").map(renderDemande)}
          </section>
        </>
      )}
    </div>
  );
};

export default ListeDemandesAcces;