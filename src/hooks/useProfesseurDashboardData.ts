// src/hooks/useProfesseurDashboardData.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { ActivityLogWithUser } from "../types";

export const useProfesseurDashboardData = () => {
  const [professeurId, setProfesseurId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    eleves: 0,
    classes: 0,
    quizzes: 0,
    simulationsAutorisees: 0,
  });
  const [recentActivities, setRecentActivities] = useState<ActivityLogWithUser[]>([]);
  const [userStatsByDay, setUserStatsByDay] = useState<{ jour: string; eleves: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Erreur récupération utilisateur:", error);
        setLoading(false);
        return;
      }
      if (user) setProfesseurId(user.id);
      else setLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!professeurId) return;

    const fetchStatsAndActivities = async () => {
      setLoading(true);
      try {
        const { data: classesData, error: classesError } = await supabase
          .from("classe")
          .select("id")
          .eq("created_by", professeurId);
        if (classesError) throw classesError;
        const classeIds = classesData?.map((c) => c.id) || [];

        const { data: elevesData, error: elevesError } = await supabase.rpc(
          "get_nombre_eleves_professeur",
          { prof_id: professeurId }
        );
        if (elevesError) throw elevesError;
        let elevesCount = 0;
        if (Array.isArray(elevesData)) elevesCount = elevesData[0]?.nombre_eleves ?? 0;
        else if (typeof elevesData === "number") elevesCount = elevesData;
        else if (elevesData?.nombre_eleves !== undefined) elevesCount = elevesData.nombre_eleves;

        const { count: quizzesCount, error: quizzesError } = await supabase
          .from("quiz")
          .select("id", { count: "exact", head: true })
          .eq("created_by", professeurId);
        if (quizzesError) throw quizzesError;

        const { data: simAutoData, error: simAutoError } = await supabase.rpc(
          "get_nombre_simulations_autorisees_admin",
          { prof_id: professeurId }
        );
        if (simAutoError) throw simAutoError;
        let simulationsAutorisees = 0;
        if (Array.isArray(simAutoData)) simulationsAutorisees = simAutoData[0]?.count ?? 0;
        else if (typeof simAutoData === "number") simulationsAutorisees = simAutoData;
        else simulationsAutorisees = simAutoData?.count ?? 0;

        const { data: logs, error: logsError } = await supabase
          .from("activity_logs")
          .select("*, user:user_id (nom, prenom, role)")
          .eq("user_id", professeurId)
          .order("created_at", { ascending: false })
          .limit(8);
        if (logsError) throw logsError;

        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);

        const { data: ajoutsRecents, error: ajoutsError } = await supabase
          .from("users_classe")
          .select("id, assigned_at")
          .in("classe_id", classeIds)
          .gte("assigned_at", sevenDaysAgo.toISOString())
          .order("assigned_at", { ascending: true });
        if (ajoutsError) throw ajoutsError;

        const countsByDay: Record<string, number> = {};
        ajoutsRecents?.forEach((ajout) => {
          const key = ajout.assigned_at?.slice(0, 10);
          if (key) countsByDay[key] = (countsByDay[key] || 0) + 1;
        });

        const chartData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const key = date.toISOString().slice(0, 10);
          chartData.push({
            jour: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
            eleves: countsByDay[key] || 0,
          });
        }

        setUserStatsByDay(chartData);
        setStats({
          eleves: elevesCount,
          classes: classeIds.length,
          quizzes: quizzesCount ?? 0,
          simulationsAutorisees,
        });
        setRecentActivities(logs || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsAndActivities();
  }, [professeurId]);

  return {
    loading,
    stats,
    recentActivities,
    userStatsByDay,
  };
};