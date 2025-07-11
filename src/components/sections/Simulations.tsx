// src/components/sections/Simulations.tsx
import { useEffect, useState, type JSX } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Rabbit,
  Zap,
  Factory,
  ArrowLeft,
  Trees,
  Lock,
} from "lucide-react";
import type { Profil } from "../../types";

import SimulationSelectionNaturelle from "../views/SimulationSelectionNaturelle";
import SimulationPhotosynthese from "../views/SimulationPhotosynthese";
import SimulationEnergie from "../views/SimulationEnergie";
import SimulationPollution from "../views/SimulationPollution";

interface SimulationsProps {
  user: Profil | null;
}

const iconMap: Record<string, JSX.Element> = {
  photosynthese: <Trees className="w-6 h-6 text-green-600" />,
  "selection-naturelle": <Rabbit className="w-6 h-6 text-amber-600" />,
  energie: <Zap className="w-6 h-6 text-yellow-500" />,
  pollution: <Factory className="w-6 h-6 text-gray-500" />,
};

const componentMap: Record<string, JSX.Element> = {
  photosynthese: <SimulationPhotosynthese />,
  "selection-naturelle": <SimulationSelectionNaturelle />,
  energie: <SimulationEnergie />,
  pollution: <SimulationPollution />,
};

const Simulations = ({ user }: SimulationsProps) => {
  const [simulations, setSimulations] = useState<any[]>([]);
  const [authorizedSimulations, setAuthorizedSimulations] = useState<string[]>([]);
  const [activeSimCode, setActiveSimCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Charger toutes les simulations
  useEffect(() => {
    const loadSimulations = async () => {
      const { data, error } = await supabase
        .from("simulation")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) setSimulations(data);
      else console.error("Erreur chargement simulations:", error);
    };

    loadSimulations();
  }, []);

  // Fonction pour charger les simulations autorisées
  const reloadAuthorizedSimulations = async () => {
    if (!user) return;

    if (user.role === "ADMIN") {
      setAuthorizedSimulations(["*"]);
      return;
    }

    if (user.role === "PROFESSEUR") {
      const { data, error } = await supabase
        .from("simulations_professeurs")
        .select("simulation_id, est_autorisee")
        .eq("professeur_id", user.id)
        .eq("est_autorisee", true);

      if (error) {
        console.error("Erreur chargement autorisations:", error);
        setAuthorizedSimulations([]);
      } else if (data) {
        const autorisees = data.map((sim) => sim.simulation_id.toString());
        setAuthorizedSimulations(autorisees);
      }
    }
  };

  // Charger autorisations au chargement user
  useEffect(() => {
    reloadAuthorizedSimulations();
  }, [user]);

  const handleAccessRequest = async (simulationId: string, titre: string) => {
    if (!user) return;
    setLoading(true);

    const { data: adminData, error: adminError } = await supabase
      .from("users")
      .select("id")
      .eq("role", "ADMIN")
      .limit(1)
      .single();

    if (adminError || !adminData) {
      setLoading(false);
      alert("Impossible de trouver un administrateur.");
      return;
    }

    const { error: requestError } = await supabase.rpc("request_simulation_access", {
      p_simulation_id: simulationId,
      p_demandeur_id: user.id,
      p_destinataire_id: adminData.id,
      p_role_demandeur: "PROFESSEUR",  // Attention au nom exact selon ta fonction RPC
      p_message: `Demande d'accès à la simulation "${titre}"`,
    });

    setLoading(false);

    if (requestError) {
      alert("Erreur lors de l'envoi de la demande : " + requestError.message);
      console.error(requestError);
    } else {
      alert("Demande envoyée !");
      // Rafraîchir la liste des autorisations (en cas d’évolution possible)
      await reloadAuthorizedSimulations();
    }
  };

  const renderActiveSimulation = () => {
    if (!activeSimCode) return null;
    return componentMap[activeSimCode] || (
      <p className="text-gray-500">Simulation non disponible pour ce code.</p>
    );
  };

  return (
    <section className="py-20 px-6 bg-gray-50 text-center max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-12">Simulations</h2>

      {!activeSimCode ? (
        <div className="grid gap-8 md:grid-cols-3">
          {simulations.map((sim) => {
            const isAuthorized =
              authorizedSimulations.includes("*") || authorizedSimulations.includes(sim.id.toString());
            const slug = sim.code;
            const icon = iconMap[slug] || <Zap />;

            return (
              <div
                key={sim.id}
                className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-center text-5xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold mb-2">{sim.titre}</h3>
                <p className="text-gray-600 mb-4">{sim.description}</p>

                {user ? (
                  isAuthorized ? (
                    <button
                      onClick={() => setActiveSimCode(slug)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Accéder
                    </button>
                  ) : user.role !== "ADMIN" ? (
                    <button
                      onClick={() => handleAccessRequest(sim.id, sim.titre)}
                      disabled={loading}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition flex items-center justify-center gap-2"
                    >
                      <Lock size={18} />
                      Demander l'accès
                    </button>
                  ) : null
                ) : (
                  <div className="absolute inset-0 bg-white/20 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm text-center px-4">
                    <Lock className="w-8 h-8 text-gray-800 mb-2" />
                    <p className="text-gray-800 font-semibold">
                      Connectez-vous pour accéder aux simulations
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <button
            onClick={() => setActiveSimCode(null)}
            className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux simulations
          </button>
          {renderActiveSimulation()}
        </>
      )}
    </section>
  );
};

export default Simulations;