// src/lib/reloadAuthorizedSimulations.ts
import { supabase } from "./supabaseClient";
import { notifyError } from "./notifications";
import type { Profil } from "../types";

type ClasseWithProf = {
  classe?: { created_by?: string | null };
};

export async function reloadAuthorizedSimulationsForUser(
  user: Profil | null,
  setAuthorizedSimulations: (ids: string[]) => void
) {
  if (!user) return;

  if (user.role === "ADMIN") {
    setAuthorizedSimulations(["*"]);
    return;
  }

  try {
    if (user.role === "PROFESSEUR") {
      const { data, error } = await supabase
        .from("simulations_professeurs")
        .select("simulation_id")
        .eq("professeur_id", user.id)
        .eq("est_autorisee", true);

      if (error) throw error;

      const simIds = data.map((d) => d.simulation_id.toString());
      setAuthorizedSimulations(simIds);
    }

    if (user.role === "ELEVE") {
      const { data: rawData, error: profsError } = await supabase
        .from("users_classe")
        .select("classe_id, classe:classe_id ( created_by )")
        .eq("users_id", user.id);

      if (profsError) throw profsError;

      const profIds = (rawData as ClasseWithProf[])
        .map((item) => item.classe?.created_by)
        .filter(Boolean);

      if (profIds.length === 0) {
        setAuthorizedSimulations([]);
        return;
      }

      const { data: profSims, error: simError } = await supabase
        .from("simulations_professeurs")
        .select("simulation_id")
        .in("professeur_id", profIds)
        .eq("est_autorisee", true);

      if (simError) throw simError;

      const simIds = profSims.map((s) => s.simulation_id.toString());
      setAuthorizedSimulations(simIds);
    }
  } catch (error) {
    console.error(error);
    notifyError("Erreur chargement autorisations : " + (error as Error).message);
    setAuthorizedSimulations([]);
  }
}