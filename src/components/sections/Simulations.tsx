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

  useEffect(() => {
    if (!user) {
      // Utilisateur non connecté : liste statique des simulations publiques
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
      // Chargement des simulations depuis la base pour utilisateur connecté
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

  // Charge les simulations autorisées pour l'utilisateur selon son rôle
  const reloadAuthorizedSimulations = async () => {
    if (!user) return;

    if (user.role === "ADMIN") {
      setAuthorizedSimulations(["*"]); // Admin a accès à tout
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

  // Demande d'accès à une simulation
  const handleAccessRequest = async (simulationId: string, titre: string) => {
    if (!user) return;
    setLoading(true);

    let destinataireId: string | null = null;

    if (user.role === "ELEVE") {
      // L'élève : récupère le prof de sa classe via fonction RPC
      const { data: profId, error } = await supabase.rpc("get_professeur_de_eleve", {
        p_eleve_id: user.id,
      });

      if (error || !profId) {
        setLoading(false);
        notifyError(
          "Impossible de trouver le professeur de votre classe : " + (error?.message || "")
        );
        return;
      }

      destinataireId = profId;
    } else if (user.role === "PROFESSEUR") {
      // Le prof : envoie la demande à un admin
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
      // Autres rôles (ex: ADMIN) : pas d'accès à cette fonctionnalité
      setLoading(false);
      notifyError("Vous n'êtes pas autorisé à faire cette demande.");
      return;
    }

    // Envoi de la demande d'accès via fonction RPC
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
    <section className="py-20 px-6 bg-gray-50 text-center max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-12">Simulations</h2>

      {!activeSimCode ? (
        <div className="grid gap-8 md:grid-cols-3">
          {simulations.map((sim) => {
            const simId = sim.id || sim.code;
            const isAuthorized =
              authorizedSimulations.includes("*") ||
              (sim.id && authorizedSimulations.includes(sim.id.toString()));

            const slug = sim.code;
            const icon = iconMap[slug] || <Zap />;

            return (
              <div
                key={simId}
                className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center justify-center text-5xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold mb-2">{sim.titre}</h3>
                <p className="text-gray-600 mb-4">{sim.description}</p>
                {/*afficher l'obetif si l'utilisateur est connecté eleve*/}
                {user && user.role === "ELEVE" && sim.objectifs && (
                  <p className="text-gray-500 italic mb-4">Objectif : {sim.objectifs}</p>
                )}
                {/*resultats attendus si l'utilisateur est connecté eleve*/}
                {user && user.role === "ELEVE" && sim.resultats_attendus && (
                  <p className="text-gray-500 italic mb-4">Résultats attendus : {sim.resultats_attendus}</p>
                )}
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