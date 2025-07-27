// src/components/sections/Simulations.tsx
import { useEffect, useState, type JSX } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Rabbit, Zap, Factory, ArrowLeft, Trees, Lock } from "lucide-react";
import type { Profil } from "../../types";
import SimulationSelectionNaturelle from "../views/SimulationSelectionNaturelle";
import SimulationPhotosynthese from "../views/SimulationPhotosynthese";
import SimulationEnergie from "../views/SimulationEnergie";
import SimulationPollution from "../views/SimulationPollution";
import { notifyError, notifySuccess } from "../../lib/notifications";
import "react-toastify/dist/ReactToastify.css";
import { loadSimulationsForUser } from "../../lib/loadSimulations";
import { reloadAuthorizedSimulationsForUser } from "../../lib/reloadAuthorizedSimulations";
import { PrimaryLoader } from "../ui/Loader";

interface SimulationsProps {
  user: Profil | null;
}

const iconMap: Record<string, JSX.Element> = {
  photosynthese: <Trees className="w-8 h-8 text-primary" />,
  "selection-naturelle": <Rabbit className="w-8 h-8 text-primary" />,
  energie: <Zap className="w-8 h-8 text-primary" />,
  pollution: <Factory className="w-8 h-8 text-primary" />,
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
  const [isLoadingSimulations, setIsLoadingSimulations] = useState(true);

  useEffect(() => {
    const fetchSimulations = async () => {
      setIsLoadingSimulations(true);
      try {
        await loadSimulationsForUser(user, (sims: any[]) => {
          const uniqueSimulationsMap = new Map();
          sims.forEach((sim) => {
            if (sim && !uniqueSimulationsMap.has(sim.id)) {
              uniqueSimulationsMap.set(sim.id, sim);
            }
          });
          setSimulations(Array.from(uniqueSimulationsMap.values()));
        }, setAuthorizedSimulations);
      } finally {
        setIsLoadingSimulations(false);
      }
    };

    fetchSimulations();
  }, [user]);

  useEffect(() => {
    reloadAuthorizedSimulationsForUser(user, setAuthorizedSimulations);
  }, [user]);

  const handleAccessRequest = async (simulationId: string, titre: string) => {
    if (!user) return;
    setLoading(true);

    let destinataireId: string | null = null;

    if (user.role === "ELEVE") {
      setLoading(false);
      notifyError("Les élèves ne peuvent pas demander d'accès.");
      return;
    } else if (user.role === "PROFESSEUR") {
      const { data: adminData, error: adminError } = await supabase
        .from("users")
        .select("id")
        .eq("role", "ADMIN")
        .limit(1)
        .single();
      if (adminError || !adminData) {
        setLoading(false);
        notifyError("Impossible de trouver un administrateur.");
        return;
      }
      destinataireId = adminData.id;
    }

    const { error: requestError } = await supabase.rpc("request_simulation_access", {
      p_simulation_id: simulationId,
      p_demandeur_id: user.id,
      p_destinataire_id: destinataireId,
      p_role_demandeur: user.role,
      p_message: `Demande d'accès à la simulation "${titre}"`,
    });

    setLoading(false);

    if (requestError) {
      notifyError("Erreur lors de la demande : " + requestError.message);
    } else {
      notifySuccess("Demande envoyée !");
      await reloadAuthorizedSimulationsForUser(user, setAuthorizedSimulations);
    }
  };

  const renderActiveSimulation = () => {
    if (!activeSimCode) return null;
    return componentMap[activeSimCode] || <p>Simulation non disponible.</p>;
  };

  const renderSimulationList = () => {
    if (isLoadingSimulations) {
      return (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <PrimaryLoader size="lg" />
                    <span className="text-dark font-medium text-lg">
                      Chargement des simulations...
                    </span>
                  </div>
                );
    }

    if (simulations.length === 0) {
      return (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <p className="text-dark/70">Aucune simulation disponible actuellement.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {simulations.map((sim) => {
          const simId = sim.id || sim.code;
          const isAuthorized =
            authorizedSimulations.includes("*") ||
            (sim.id && authorizedSimulations.includes(sim.id.toString()));
          const slug = sim.code;
          const icon = iconMap[slug] || <Zap className="text-primary" />;

          return (
            <div
              key={simId}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-center bg-accent/20 rounded-full w-16 h-16 mx-auto mb-4">
                  {icon}
                </div>
                <h3 className="text-xl font-heading font-semibold text-dark mb-3 text-center">
                  {sim.titre}
                </h3>
                <p className="text-dark/80 mb-4 text-center font-sans">
                  {sim.description}
                </p>

                {user && user.role === "ELEVE" && (
                  <>
                    {sim.objectifs && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-dark/70 mb-1">Objectif</p>
                        <p className="text-dark/80 text-sm font-sans">{sim.objectifs}</p>
                      </div>
                    )}
                    {sim.resultats_attendus && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-dark/70 mb-1">Résultats attendus</p>
                        <p className="text-dark/80 text-sm font-sans">{sim.resultats_attendus}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="px-6 pb-6">
                {user ? (
                  isAuthorized ? (
                    <button
                      onClick={() => setActiveSimCode(slug)}
                      className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      Lancer la simulation
                    </button>
                  ) : user.role === "PROFESSEUR" ? (
                    <button
                      onClick={() => handleAccessRequest(sim.id, sim.titre)}
                      disabled={loading}
                      className="w-full bg-secondary text-white py-2.5 rounded-lg hover:bg-secondary/90 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Lock size={18} />
                      {loading ? "Envoi en cours..." : "Demander l'accès"}
                    </button>
                  ) : null
                ) : (
                  <div className="bg-white/90 border border-gray-200 rounded-lg p-4 text-center">
                    <Lock className="w-6 h-6 text-dark mx-auto mb-2" />
                    <p className="text-dark font-medium">
                      Connectez-vous pour accéder
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-heading font-bold text-primary mb-8">
          {activeSimCode ? "Simulation en cours" : "Simulations"}
        </h2>

        {!activeSimCode ? (
          renderSimulationList()
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setActiveSimCode(null)}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Retour à la liste des simulations
            </button>

            <div className="bg-white rounded-xl shadow-sm p-6">
              {renderActiveSimulation()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulations;