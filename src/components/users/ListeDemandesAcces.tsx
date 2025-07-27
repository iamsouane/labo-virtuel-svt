// src/components/users/ListeDemandesAcces.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { MessagesSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { notifyError, notifySuccess, notifyInfo } from "../../lib/notifications";
import { useActivityLogger } from "../../hooks/useActivityLogger";
import type { Profil } from "../../types";
import { PrimaryLoader } from "../ui/Loader";

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
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <PrimaryLoader size="lg" />
        <span className="text-dark font-medium text-lg">
          Chargement des demandes...
        </span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary mb-2">Demandes d'accès</h1>
        <p className="text-dark/80">Gestion des demandes d'accès aux simulations</p>
      </div>

      {demandes.length === 0 ? (
        <div className="bg-light rounded-lg p-8 text-center">
          <p className="text-secondary">Aucune demande trouvée</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                      Demandeur
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                      Simulation
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                      Message
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-dark uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {demandes.map((demande) => (
                    <tr key={demande.id} className="hover:bg-accent/10">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                        {demande.nom_demandeur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm italic text-dark/80">
                        {demande.simulation_titre}
                      </td>
                      <td className="px-6 py-4 text-sm text-dark">
                        {demande.message ? (
                          <div className="flex items-center gap-2">
                            <MessagesSquare className="h-4 w-4 text-dark/40" />
                            <span className="line-clamp-1">{demande.message}</span>
                          </div>
                        ) : (
                          <span className="text-dark/40 italic">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {demande.statut === "EN_ATTENTE" ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            En attente
                          </span>
                        ) : demande.statut === "APPROUVE" ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Approuvée
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Rejetée
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {demande.statut === "EN_ATTENTE" ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleDecision(demande, "APPROUVE")}
                              className="px-3 py-1 text-xs font-medium rounded-lg bg-primary text-white hover:bg-green-700"
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => handleDecision(demande, "REJETE")}
                              className="px-3 py-1 text-xs font-medium rounded-lg bg-danger text-white hover:bg-red-700"
                            >
                              Rejeter
                            </button>
                          </div>
                        ) : (
                          <span className="text-dark/40 text-xs">Terminée</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-dark/70">
              {totalDemandes} demande{demandes.length > 1 ? 's' : ''} au total
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev < Math.ceil(totalDemandes / pageSize) ? prev + 1 : prev)}
                disabled={currentPage >= Math.ceil(totalDemandes / pageSize)}
                className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListeDemandesAcces;