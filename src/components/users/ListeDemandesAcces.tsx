// src/components/users/ListeDemandesAcces.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Loader2,
  MessagesSquare,
} from "lucide-react";
import { notifyError, notifySuccess, notifyInfo } from "../../lib/notifications";
import { useActivityLogger } from "../../hooks/useActivityLogger";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDemandes, setTotalDemandes] = useState(0);
  const pageSize = 6;

  const isAdmin = user.role === "ADMIN";
  const isProf = user.role === "PROFESSEUR";
  const logActivity = useActivityLogger();

  const loadDemandes = async () => {
    setLoading(true);
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("simulation_access_requests")
      .select(
        `
        id, simulation_id, demandeur_id, role_demandeur, message, created_at, statut,
        simulation:simulation_id (titre),
        demandeur:demandeur_id (prenom, nom),
        destinataire_id
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (isProf) {
      query = query.eq("destinataire_id", user.id);
    } else if (isAdmin) {
      query = query.eq("role_demandeur", "PROFESSEUR");
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Erreur chargement demandes:", error);
      notifyError("Impossible de charger les demandes.");
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

    if (count !== null) setTotalDemandes(count);
    setLoading(false);
  };

  useEffect(() => {
    loadDemandes();
  }, [currentPage]);

  const handleDecision = async (demande: Demande, decision: "APPROUVE" | "REJETE") => {
    const { error: updateError } = await supabase
      .from("simulation_access_requests")
      .update({ statut: decision })
      .eq("id", demande.id);

    if (updateError) {
      notifyError("Erreur lors de la mise à jour.");
      return;
    }

    if (decision === "APPROUVE") {
      if (demande.role_demandeur === "PROFESSEUR") {
        await supabase.from("simulations_professeurs").insert({
          simulation_id: demande.simulation_id,
          professeur_id: demande.demandeur_id,
          est_autorisee: true,
          demande_envoyee: false,
          autorisee_at: new Date().toISOString(),
        });
      } else if (demande.role_demandeur === "ELEVE") {
        const { data: professeurData } = await supabase.rpc("get_professeur_de_eleve", {
          p_eleve_id: demande.demandeur_id,
        });

        if (!professeurData) {
          notifyInfo("Professeur introuvable.");
          return;
        }

        const { data: existing } = await supabase
          .from("simulations_eleves")
          .select("id")
          .eq("eleve_id", demande.demandeur_id)
          .eq("simulation_id", demande.simulation_id)
          .maybeSingle();

        if (!existing) {
          await supabase.from("simulations_eleves").insert({
            simulation_id: demande.simulation_id,
            eleve_id: demande.demandeur_id,
            professeur_id: professeurData,
            est_autorisee: true,
            autorisee_at: new Date().toISOString(),
            demande_envoyee: false,
          });
        }
      }
    }

    await loadDemandes();
    notifySuccess(`Demande ${decision === "APPROUVE" ? "approuvée" : "rejetée"} avec succès.`);
    await logActivity(
      user.id,
      `Demande "${demande.simulation_titre}" ${decision.toLowerCase()}`,
      "ListeDemandesAcces"
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center text-secondary mt-8">
        <Loader2 className="animate-spin mr-2" /> Chargement des demandes...
      </div>
    );
  }

  return (
    <section className="mt-10 px-4">
      <h2 className="text-2xl font-heading font-bold text-primary mb-6">
        Demandes d'accès aux simulations
      </h2>

      {demandes.length === 0 ? (
        <p className="text-secondary">Aucune demande trouvée.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-light rounded-xl shadow-md">
            <table className="min-w-full table-auto text-left text-sm">
              <thead className="bg-secondary text-light font-semibold">
                <tr>
                  <th className="px-4 py-3 border-b border-secondary">Demandeur</th>
                  <th className="px-4 py-3 border-b border-secondary">Simulation</th>
                  <th className="px-4 py-3 border-b border-secondary">Message</th>
                  <th className="px-4 py-3 border-b border-secondary">Statut</th>
                  <th className="px-4 py-3 border-b border-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {demandes.map((demande) => {
                  const getStatut = () => {
                    switch (demande.statut) {
                      case "EN_ATTENTE":
                        return <span className="text-yellow-700 text-sm font-medium">En attente</span>;
                      case "APPROUVE":
                        return <span className="text-green-600 text-sm font-medium">Approuvée</span>;
                      case "REJETE":
                        return <span className="text-red-600 text-sm font-medium">Rejetée</span>;
                    }
                  };

                  return (
                    <tr key={demande.id} className="hover:bg-accent border-b border-secondary">
                      <td className="px-4 py-2">{demande.nom_demandeur}</td>
                      <td className="px-4 py-2 italic text-dark/80">{demande.simulation_titre}</td>
                      <td className="px-4 py-2">
                        {demande.message ? (
                          <span className="flex items-center gap-1 text-sm">
                            <MessagesSquare className="w-4 h-4 text-dark/50" />
                            {demande.message}
                          </span>
                        ) : (
                          <span className="text-dark/40 italic">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2">{getStatut()}</td>
                      <td className="px-4 py-2">
                        {demande.statut === "EN_ATTENTE" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDecision(demande, "APPROUVE")}
                              className="bg-primary hover:bg-primary/90 text-light px-3 py-1 rounded-xl text-xs font-semibold transition"
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => handleDecision(demande, "REJETE")}
                              className="bg-danger hover:bg-dangerHover text-light px-3 py-1 rounded-xl text-xs font-semibold transition"
                            >
                              Rejeter
                            </button>
                          </div>
                        ) : (
                          <span className="text-dark/40 italic text-xs">Aucune action</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-secondary text-sm bg-white shadow hover:bg-secondary hover:text-light disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} / {Math.ceil(totalDemandes / pageSize)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(totalDemandes / pageSize) ? prev + 1 : prev
                )
              }
              disabled={currentPage >= Math.ceil(totalDemandes / pageSize)}
              className="px-4 py-2 rounded-xl border border-secondary text-sm bg-white shadow hover:bg-secondary hover:text-light disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default ListeDemandesAcces;