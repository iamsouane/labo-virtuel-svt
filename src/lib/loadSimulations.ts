// src/lib/loadSimulations.ts
import { supabase } from "./supabaseClient";
import { notifyError } from "./notifications";
import type { Profil } from "../types";

type ClasseWithProf = {
  classe?: { created_by?: string | null };
};

export async function loadSimulationsForUser(
  user: Profil | null,
  setSimulations: (sims: any[]) => void,
  setAuthorizedSimulations: (ids: string[]) => void
) {
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
    return;
  }

  try {
    if (user.role === "ADMIN") {
      const { data, error } = await supabase
        .from("simulation")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      setSimulations(data || []);
      return;
    }

    if (user.role === "PROFESSEUR") {
      const { data: admins, error: adminsError } = await supabase
        .from("users")
        .select("id")
        .eq("role", "ADMIN");
      if (adminsError) throw adminsError;
      const adminIds = admins?.map((a) => a.id) || [];

      const { data: adminSims, error: adminSimsError } = await supabase
        .from("simulation")
        .select("*")
        .in("created_by", adminIds);
      if (adminSimsError) throw adminSimsError;

      const { data: profSims, error: profSimsError } = await supabase
        .from("simulations_professeurs")
        .select("simulation_id")
        .eq("professeur_id", user.id)
        .eq("est_autorisee", true);
      if (profSimsError) throw profSimsError;
      const authorizedSimIds = profSims.map((s) => s.simulation_id);

      const { data: authorizedSimsDetails, error: authDetailsError } = await supabase
        .from("simulation")
        .select("*")
        .in("id", authorizedSimIds);
      if (authDetailsError) throw authDetailsError;

      const mergedSimulations = [...(adminSims || [])];
      (authorizedSimsDetails || []).forEach((authSim) => {
        if (!mergedSimulations.find((s) => s.id === authSim.id)) {
          mergedSimulations.push(authSim);
        }
      });

      setSimulations(mergedSimulations);
      setAuthorizedSimulations(authorizedSimIds.map((id) => id.toString()));
      return;
    }

    if (user.role === "ELEVE") {
      const { data: rawData, error: profsError } = await supabase
        .from("users_classe")
        .select("classe_id, classe:classe_id ( created_by )")
        .eq("users_id", user.id);
      if (profsError) throw profsError;

      const profIds = (rawData as ClasseWithProf[]).map((item) => item.classe?.created_by).filter(Boolean);

      if (profIds.length === 0) {
        setSimulations([]);
        setAuthorizedSimulations([]);
        return;
      }

      const { data: sims, error: simsError } = await supabase
        .from("view_simulations_professeur")
        .select("*")
        .in("professeur_id", profIds)
        .eq("est_autorisee", true)
        .order("created_at", { ascending: true });
      if (simsError) throw simsError;

      setSimulations(sims);
      setAuthorizedSimulations(sims.map((s) => s.id.toString()));
      return;
    }
  } catch (error) {
    notifyError("Erreur chargement simulations : " + (error as Error).message);
    setSimulations([]);
    setAuthorizedSimulations([]);
  }
}