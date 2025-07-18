//src/hooks/useActivityLogger
import { supabase } from "../lib/supabaseClient";
import { useCallback } from "react";

export function useActivityLogger() {
  const logActivity = useCallback(
    async (userId: string, action: string, targetType: string) => {
      if (!userId) {
        console.warn("userId manquant, impossible de logger l'activité");
        return;
      }
      const { error } = await supabase.rpc("log_activity", {
        p_user_id: userId,
        p_action: action,
        p_target_type: targetType,
      });
      if (error) {
        console.error("Erreur lors de l'enregistrement de l'activité :", error.message);
      }
    },
    []
  );

  return logActivity;
}