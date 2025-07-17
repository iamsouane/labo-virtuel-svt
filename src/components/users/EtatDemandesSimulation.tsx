// src/components/users/EtatDemandesSimulation.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import { ClipboardList } from "lucide-react";

interface Demande {
  id: string;
  simulation_titre: string;
  statut: string;
  message: string | null;
  destinataire_nom: string | null;
  created_at: string;
}

const EtatDemandesSimulation = ({ user }: { user: Profil }) => {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("simulation_access_requests")
          .select(`
            id,
            statut,
            message,
            created_at,
            simulation:simulation_id (titre),
            destinataire:destinataire_id (prenom, nom)
          `)
          .eq("demandeur_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const mapped = (data || []).map((d: any): Demande => ({
          id: d.id,
          simulation_titre: d.simulation?.titre ?? "Inconnue",
          statut: d.statut,
          message: d.message,
          destinataire_nom: d.destinataire
            ? `${d.destinataire.prenom} ${d.destinataire.nom}`
            : null,
          created_at: d.created_at,
        }));

        setDemandes(mapped);
      } catch (err) {
        console.error("Erreur lors du chargement des demandes :", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user.id]);

  const formatStatut = (statut: string) => {
    switch (statut) {
      case "EN_ATTENTE":
        return "En attente";
      case "APPROUVE":
        return "Approuvée";
      case "REJETE":
        return "Rejetée";
      default:
        return statut;
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
        <ClipboardList className="w-5 h-5 text-secondary" />
        État de mes demandes d'accès
      </h3>

      {loading ? (
        <p className="text-dark/60">Chargement...</p>
      ) : demandes.length === 0 ? (
        <p className="text-dark/60">Aucune demande envoyée.</p>
      ) : (
        <ul className="space-y-4">
          {demandes.map((d) => (
            <li
              key={d.id}
              className="bg-light p-4 border rounded-2xl shadow flex justify-between items-start"
            >
              <div className="flex-1">
                <p className="font-semibold text-primary">
                  Simulation : {d.simulation_titre}
                </p>

                {d.message && (
                  <p className="text-sm text-dark mt-1">{d.message}</p>
                )}

                {d.destinataire_nom && (
                  <p className="text-xs italic text-dark/60 mt-1">
                    Destinataire : {d.destinataire_nom}
                  </p>
                )}

                <p className="text-xs text-dark/40 mt-1">
                  Envoyée le : {new Date(d.created_at).toLocaleString()}
                </p>
              </div>

              <span
                className={`ml-4 px-3 py-1 rounded-full text-sm font-medium self-center ${
                  d.statut === "EN_ATTENTE"
                    ? "bg-yellow-100 text-yellow-700"
                    : d.statut === "APPROUVE"
                    ? "bg-accent text-primary"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {formatStatut(d.statut)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EtatDemandesSimulation;