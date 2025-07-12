// src/components/sections/EtatDemandesSimulation.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import { ClipboardList } from "lucide-react";

interface Demande {
  id: string;
  simulation_titre: string;
  statut: string;
  message: string | null;
  created_at: string;
}

const EtatDemandesSimulation = ({ user }: { user: Profil }) => {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("simulation_access_requests")
        .select(
          `id, statut, message, created_at, simulation:simulation_id (titre)`
        )
        .eq("demandeur_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          simulation_titre: d.simulation?.titre ?? "Inconnu",
          statut: d.statut,
          message: d.message,
          created_at: d.created_at,
        }));
        setDemandes(mapped);
      }

      setLoading(false);
    };

    load();
  }, [user]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-blue-600" />
        État de mes demandes d'accès
      </h3>
      {loading ? (
        <p>Chargement...</p>
      ) : demandes.length === 0 ? (
        <p className="text-gray-500">Aucune demande envoyée.</p>
      ) : (
        <ul className="space-y-4">
          {demandes.map((d) => (
            <li
              key={d.id}
              className="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-start"
            >
              <div>
                <p>
                  <strong className="text-blue-700">{d.simulation_titre}</strong>
                </p>
                <p className="text-sm text-gray-600">{d.message}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${d.statut === "EN_ATTENTE"
                    ? "bg-yellow-100 text-yellow-700"
                    : d.statut === "APPROUVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {d.statut}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EtatDemandesSimulation;