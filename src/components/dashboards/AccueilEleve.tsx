// src/components/users/AccueilEleve.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { ActivityLogWithUser } from "../../types";
import StatsChartQuiz from "../users/StatsChartQuiz";
import UpcomingSimulations from "../admin/UpcomingSimulations";

export const AccueilEleve = () => {
  const [eleveId, setEleveId] = useState<string | null>(null);
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
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setEleveId(user.id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!eleveId) return;

    const fetchStatsAndActivities = async () => {
      // 1. Récupérer les classes de l'élève
      const { data: classesData, error: classesError } = await supabase
        .from("users_classe")
        .select("classe_id")
        .eq("users_id", eleveId);

      if (classesError) {
        console.error("Erreur récupération classes élève:", classesError);
        return;
      }

      const classeIds = classesData?.map((c) => c.classe_id) || [];

      // 2. Nombre total de quiz liés aux classes de l'élève
      const { count: quizCount, error: quizError } = await supabase
        .from("classe_quiz")
        .select("quiz_id", { count: "exact", head: true })
        .in("classe_id", classeIds);

      if (quizError) {
        console.error("Erreur récupération quiz total:", quizError);
      }

      // 3. Nombre de simulations autorisées à l'élève via profs de ses classes
      const { data: profs, error: profsError } = await supabase
        .from("classe")
        .select("created_by")
        .in("id", classeIds);

      if (profsError) {
        console.error("Erreur récupération professeurs des classes:", profsError);
      }

      const profIds = profs?.map((p) => p.created_by).filter(Boolean) || [];

      const { data: simulationsAut, error: simuError } = await supabase
        .from("simulations_professeurs")
        .select("simulation_id")
        .in("professeur_id", profIds)
        .eq("est_autorisee", true);

      if (simuError) {
        console.error("Erreur récupération simulations autorisées:", simuError);
      }

      const simuCount = simulationsAut?.length || 0;

      // 4. Nombre de quiz terminés
      const { count: quizTerminesCount, error: quizTerminesError } = await supabase
        .from("quiz_result")
        .select("id", { count: "exact", head: true })
        .eq("users_id", eleveId);

      if (quizTerminesError) {
        console.error("Erreur récupération quiz terminés:", quizTerminesError);
      }

      // 5. Nombre de classes associées
      const classesCount = classeIds.length;

      // 6. Quiz terminés sur les 7 derniers jours
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);

      const { data: quizTerminesRecents, error: quizTerminesRecentsError } = await supabase
        .from("quiz_result")
        .select("completed_at")
        .eq("users_id", eleveId)
        .gte("completed_at", sevenDaysAgo.toISOString())
        .order("completed_at", { ascending: true });

      if (quizTerminesRecentsError) {
        console.error("Erreur récupération quiz récents:", quizTerminesRecentsError);
      }

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

      // 7. Activités récentes
      const { data: logs, error: logsError } = await supabase
        .from("activity_logs")
        .select("*, users:user_id (nom, prenom, role)")
        .eq("user_id", eleveId)
        .order("created_at", { ascending: false })
        .limit(8);

      if (logsError) {
        console.error("Erreur récupération logs d'activités :", logsError);
      }

      setStats({
        quizTotal: quizCount || 0,
        simulationsProf: simuCount || 0,
        quizTermines: quizTerminesCount || 0,
        classesAssociees: classesCount || 0,
      });

      setQuizTerminesByDay(chartData);
      setRecentActivities(logs || []);
    };

    fetchStatsAndActivities();
  }, [eleveId]);

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-8">
      <h1 className="text-3xl font-bold text-dark mb-6">Tableau de bord élève</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-6">
          <StatCard label="Quiz disponibles" value={stats.quizTotal} />
          <StatCard label="Simulations disponibles" value={stats.simulationsProf} />
          <StatCard label="Quiz terminés" value={stats.quizTermines} />
          <StatCard label="Classes associées" value={stats.classesAssociees} />
        </div>

        <StatsChartQuiz data={quizTerminesByDay} />

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

export default AccueilEleve;