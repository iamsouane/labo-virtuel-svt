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
import { notifyError, notifySuccess } from "../../lib/notifications";
import "react-toastify/dist/ReactToastify.css";

interface SimulationsProps {
  user: Profil | null;
}

const iconMap: Record<string, JSX.Element> = {
  photosynthese: <Trees className="w-6 h-6 text-primary" />,
  "selection-naturelle": <Rabbit className="w-6 h-6 text-secondary" />,
  energie: <Zap className="w-6 h-6 text-yellow-500" />,
  pollution: <Factory className="w-6 h-6 text-dark" />,
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

  useEffect(() => {
    if (!user) {
      setSimulations([
        {
          id: "photosynthese",
          code: "photosynthese",
          titre: "Expérience sur la photosynthèse",
          description: "Simulation de la photosynthèse",
        },
        {
          id: "selection-naturelle",
          code: "selection-naturelle",
          titre: "Sélection naturelle",
          description: "Simulation de la sélection naturelle",
        },
        {
          id: "energie",
          code: "energie",
          titre: "Formes et transformations de l'énergie",
          description: "Simulation sur les formes d'énergie",
        },
        {
          id: "pollution",
          code: "pollution",
          titre: "Pollution de l'air",
          description: "Simulation sur la pollution de l'air",
        },
      ]);
    } else {
      const loadSimulations = async () => {
        const { data, error } = await supabase
          .from("simulation")
          .select("*")
          .not("created_by", "is", null)
          .order("created_at", { ascending: true });

        if (!error && data) {
          setSimulations(data);
        } else {
          notifyError("Erreur chargement simulations : " + (error?.message || "inconnue"));
        }
      };
      loadSimulations();
    }
  }, [user]);

  const reloadAuthorizedSimulations = async () => {
    if (!user) return;

    if (user.role === "ADMIN") {
      setAuthorizedSimulations(["*"]);
      return;
    }

    const table = user.role === "PROFESSEUR" ? "simulations_professeurs" : "simulations_eleves";
    const idField = user.role === "PROFESSEUR" ? "professeur_id" : "eleve_id";

    const { data, error } = await supabase
      .from(table)
      .select("simulation_id, est_autorisee")
      .eq(idField, user.id)
      .eq("est_autorisee", true);

    if (error) {
      notifyError("Erreur lors du chargement des autorisations : " + (error?.message || "inconnue"));
      setAuthorizedSimulations([]);
    } else {
      const autorisees = data.map((sim) => sim.simulation_id.toString());
      setAuthorizedSimulations(autorisees);
    }
  };

  useEffect(() => {
    reloadAuthorizedSimulations();
  }, [user]);

  const handleAccessRequest = async (simulationId: string, titre: string) => {
    if (!user) return;
    setLoading(true);

    let destinataireId: string | null = null;

    if (user.role === "ELEVE") {
      const { data: profId, error } = await supabase.rpc("get_professeur_de_eleve", {
        p_eleve_id: user.id,
      });

      if (error || !profId) {
        setLoading(false);
        notifyError("Impossible de trouver le professeur de votre classe : " + (error?.message || ""));
        return;
      }

      destinataireId = profId;
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
    } else {
      setLoading(false);
      notifyError("Vous n'êtes pas autorisé à faire cette demande.");
      return;
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
      notifyError("Erreur lors de l'envoi de la demande : " + requestError.message);
    } else {
      notifySuccess("Demande envoyée !");
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
    <section className="py-20 px-6 bg-light text-center w-full">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-12">
        Simulations
      </h2>

      {!activeSimCode ? (
        <div className="grid gap-8 md:grid-cols-3">
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
                className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent"
              >
                <div className="flex items-center justify-center text-6xl mb-4 text-primary">
                  {icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary font-heading">
                  {sim.titre}
                </h3>
                <p className="text-dark mb-4 font-sans leading-relaxed">{sim.description}</p>
                {user && user.role === "ELEVE" && sim.objectifs && (
                  <p className="text-secondary italic mb-4 font-sans">
                    Objectif : {sim.objectifs}
                  </p>
                )}
                {user && user.role === "ELEVE" && sim.resultats_attendus && (
                  <p className="text-secondary italic mb-4 font-sans">
                    Résultats attendus : {sim.resultats_attendus}
                  </p>
                )}
                {user ? (
                  isAuthorized ? (
                    <button
                      onClick={() => setActiveSimCode(slug)}
                      className="bg-primary text-white px-5 py-2 rounded-xl hover:bg-secondary transition-colors font-semibold"
                    >
                      Accéder
                    </button>
                  ) : user.role !== "ADMIN" ? (
                    <button
                      onClick={() => handleAccessRequest(sim.id, sim.titre)}
                      disabled={loading}
                      className="bg-yellow-500 text-white px-5 py-2 rounded-xl hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                      <Lock size={18} />
                      Demander l'accès
                    </button>
                  ) : null
                ) : (
                  <div className="absolute inset-0 bg-white/30 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm text-center px-4">
                    <Lock className="w-8 h-8 text-dark mb-2" />
                    <p className="text-dark font-semibold">
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
            className="mb-6 px-6 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors flex items-center justify-center gap-2 mx-auto font-semibold"
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