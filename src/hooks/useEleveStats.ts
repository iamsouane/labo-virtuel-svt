// src/hooks/useEleveStats.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { ActivityLogWithUser } from "../types";

export const useEleveStats = (eleveId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    quizTotal: 0,
    simulationsProf: 0,
    quizTermines: 0,
    classesAssociees: 0,
  });

  const [recentActivities, setRecentActivities] = useState<ActivityLogWithUser[]>([]);
  const [quizTerminesByDay, setQuizTerminesByDay] = useState<
    { jour: string; quizCount: number }[]
  >([]);

  useEffect(() => {
    if (!eleveId) {
      setLoading(false);
      return;
    }

    const fetchStatsAndActivities = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);

        // 1. Classes
        const { data: classesData } = await supabase
          .from("users_classe")
          .select("classe_id")
          .eq("users_id", eleveId);

        const classeIds = classesData?.map((c) => c.classe_id) || [];

        // 2. Quiz total
        const { count: quizCount } = await supabase
          .from("classe_quiz")
          .select("quiz_id", { count: "exact", head: true })
          .in("classe_id", classeIds);

        // 3. Simulations autorisées
        const { data: profs } = await supabase
          .from("classe")
          .select("created_by")
          .in("id", classeIds);

        const profIds = profs?.map((p) => p.created_by).filter(Boolean) || [];

        const { data: simulationsAut } = await supabase
          .from("simulations_professeurs")
          .select("simulation_id")
          .in("professeur_id", profIds)
          .eq("est_autorisee", true);

        // 4. Quiz terminés
        const { count: quizTerminesCount } = await supabase
          .from("quiz_result")
          .select("id", { count: "exact", head: true })
          .eq("users_id", eleveId);

        // 5. Quiz récents
        const { data: quizTerminesRecents } = await supabase
          .from("quiz_result")
          .select("completed_at")
          .eq("users_id", eleveId)
          .gte("completed_at", sevenDaysAgo.toISOString())
          .order("completed_at", { ascending: true });

        const countsByDay: Record<string, number> = {};
        quizTerminesRecents?.forEach((quiz) => {
          if (quiz.completed_at) {
            const key = new Date(quiz.completed_at).toDateString();
            countsByDay[key] = (countsByDay[key] || 0) + 1;
          }
        });

        const chartData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const key = date.toDateString();
          chartData.push({
            jour: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
            quizCount: countsByDay[key] || 0,
          });
        }

        // 6. Logs d'activités
        const { data: logs } = await supabase
          .from("activity_logs")
          .select("*, users:user_id (nom, prenom, role)")
          .eq("user_id", eleveId)
          .order("created_at", { ascending: false })
          .limit(8);

        setStats({
          quizTotal: quizCount || 0,
          simulationsProf: simulationsAut?.length || 0,
          quizTermines: quizTerminesCount || 0,
          classesAssociees: classeIds.length,
        });

        setQuizTerminesByDay(chartData);
        setRecentActivities(logs || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsAndActivities();
  }, [eleveId]);

  return { loading, stats, recentActivities, quizTerminesByDay };
};