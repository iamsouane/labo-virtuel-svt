// src/components/dashboards/AccueilProfesseur.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { ActivityLogWithUser } from "../../types";
import StatsChartEleves from "../users/StatsChartEleves";
import UpcomingSimulations from "../admin/UpcomingSimulations";
import { Loader2 } from "lucide-react";

export const AccueilProfesseur = () => {
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
        // Récupération des classes
        const { data: classesData, error: classesError } = await supabase
          .from("classe")
          .select("id")
          .eq("created_by", professeurId);
        if (classesError) throw classesError;
        const classeIds = classesData?.map((c) => c.id) || [];
        const classesCount = classeIds.length;

        // Récupération du nombre d'élèves via RPC
        const { data: elevesData, error: elevesError } = await supabase.rpc(
          "get_nombre_eleves_professeur",
          { prof_id: professeurId }
        );
        if (elevesError) throw elevesError;
        let elevesCount = 0;
        if (Array.isArray(elevesData)) elevesCount = elevesData[0]?.nombre_eleves ?? 0;
        else if (typeof elevesData === "number") elevesCount = elevesData;
        else if (elevesData?.nombre_eleves !== undefined) elevesCount = elevesData.nombre_eleves;

        // Récupération du nombre de quizzes créés
        const { count: quizzesCount, error: quizzesError } = await supabase
          .from("quiz")
          .select("id", { count: "exact", head: true })
          .eq("created_by", professeurId);
        if (quizzesError) throw quizzesError;

        // Récupération du nombre de simulations autorisées via RPC
        const { data: simAutoData, error: simAutoError } = await supabase.rpc(
          "get_nombre_simulations_autorisees_admin",
          { prof_id: professeurId }
        );
        if (simAutoError) throw simAutoError;
        let simulationsAutorisees = 0;
        if (Array.isArray(simAutoData)) simulationsAutorisees = simAutoData[0]?.count ?? 0;
        else if (typeof simAutoData === "number") simulationsAutorisees = simAutoData;
        else simulationsAutorisees = simAutoData?.count ?? 0;

        // Récupération des logs d'activités
        const { data: logs, error: logsError } = await supabase
          .from("activity_logs")
          .select("*, user:user_id (nom, prenom, role)")
          .eq("user_id", professeurId)
          .order("created_at", { ascending: false })
          .limit(8);
        if (logsError) throw logsError;

        // Statistiques journalières sur les ajouts d'élèves
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
          classes: classesCount,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center text-secondary">
        <Loader2 className="animate-spin mr-2" /> Chargement des données du tableau de bord...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-8">
      <h1 className="text-3xl font-bold text-dark mb-6">Tableau de bord professeur</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-6">
          <StatCard label="Élèves" value={stats.eleves} />
          <StatCard label="Classes" value={stats.classes} />
          <StatCard label="Quiz créés" value={stats.quizzes} />
          <StatCard label="Simulations autorisées" value={stats.simulationsAutorisees} />
        </div>

        <StatsChartEleves data={userStatsByDay} />

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 max-h-[450px] overflow-auto">
          <h2 className="text-2xl font-semibold text-dark mb-4">Activités récentes</h2>
          {recentActivities.length === 0 ? (
            <p className="text-gray-500">Aucune activité récente.</p>
          ) : (
            <ul className="space-y-3">
              {recentActivities.map((log) => (
                <li key={log.id} className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-primary">
                    {log.users?.prenom} {log.users?.nom}
                  </span>{" "}
                  a effectué l’action{" "}
                  <span className="italic text-dark">{log.action}</span> sur{" "}
                  <span className="font-medium text-secondary">{log.target_type}</span>{" "}
                  <span className="text-xs text-gray-500">
                    ({new Date(log.created_at).toLocaleString()})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <UpcomingSimulations />
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-accent/30 p-6 rounded-xl shadow-sm border border-accent flex flex-col items-center justify-center text-center min-h-[120px] hover:scale-[1.02] transition-transform duration-200 ease-in-out">
    <div className="text-sm font-medium text-dark mb-1 uppercase tracking-wide">{label}</div>
    <div className="text-3xl font-bold text-primary">{value}</div>
  </div>
);

export default AccueilProfesseur;