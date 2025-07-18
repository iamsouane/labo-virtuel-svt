import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { ActivityLogWithUser } from "../../types";
import StatsChartEleves from "../users/StatsChartEleves";
import UpcomingSimulations from "../admin/UpcomingSimulations";

export const AccueilProfesseur = () => {
  const [professeurId, setProfesseurId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    eleves: 0,
    classes: 0,
    quizzes: 0,
    demandesAcces: 0,
  });

  const [recentActivities, setRecentActivities] = useState<ActivityLogWithUser[]>([]);
  const [userStatsByDay, setUserStatsByDay] = useState<{ jour: string; eleves: number }[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setProfesseurId(user.id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!professeurId) return;

    const fetchStatsAndActivities = async () => {
      // 1. Récupérer les classes du prof
      const { data: classesData, error: classesError } = await supabase
        .from("classe")
        .select("id")
        .eq("created_by", professeurId);

      if (classesError) {
        console.error("Erreur récupération classes:", classesError);
        return;
      }
      const classeIds = classesData?.map((c) => c.id) || [];
      const classesCount = classeIds.length;

      // 2. Nombre d'élèves via RPC ou requête
      let elevesCount = 0;
      const { data: elevesData, error: elevesError } = await supabase.rpc(
        "get_nombre_eleves_professeur",
        { prof_id: professeurId }
      );

      if (elevesError) {
        console.error("Erreur RPC nombre élèves:", elevesError);
      } else {
        if (Array.isArray(elevesData)) {
          elevesCount = elevesData[0]?.nombre_eleves ?? 0;
        } else if (typeof elevesData === "number") {
          elevesCount = elevesData;
        } else if (elevesData?.nombre_eleves !== undefined) {
          elevesCount = elevesData.nombre_eleves;
        }
      }

      // 3. Quiz créés par ce prof
      const { count: quizzesCount = 0, error: quizError } = await supabase
        .from("quiz")
        .select("id", { count: "exact", head: true })
        .eq("created_by", professeurId);

      if (quizError) {
        console.error("Erreur récupération quizzes:", quizError);
      }

      // 4. Demandes d'accès approuvées
      let demandesCount = 0;
      const { data: demandesData, error: demandesError } = await supabase.rpc(
        "get_nombre_demandes_acces_professeur",
        { prof_id: professeurId }
      );

      if (demandesError) {
        console.error("Erreur RPC demandes accès:", demandesError);
      } else {
        if (Array.isArray(demandesData)) {
          demandesCount = demandesData[0]?.count ?? 0;
        } else if (typeof demandesData === "number") {
          demandesCount = demandesData;
        } else if (demandesData?.count !== undefined) {
          demandesCount = demandesData.count;
        }
      }

      // 5. Activités récentes du prof (activity_logs)
      const { data: logs, error: logsError } = await supabase
        .from("activity_logs")
        .select("*, user:user_id (nom, prenom, role)")
        .eq("user_id", professeurId)
        .order("created_at", { ascending: false })
        .limit(8);

      if (logsError) {
        console.error("Erreur récupération logs d'activités :", logsError);
      }

      // 6. Élèves ajoutés aux classes du prof dans les 7 derniers jours
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);

      const { data: ajoutsRecents, error: ajoutError } = await supabase
        .from("users_classe")
        .select("id, assigned_at")
        .in("classe_id", classeIds)
        .gte("assigned_at", sevenDaysAgo.toISOString())
        .order("assigned_at", { ascending: true });

      if (ajoutError) {
        console.error("Erreur récupération ajouts users_classe:", ajoutError);
      }

      // Compter les ajouts par jour
      const countsByDay: Record<string, number> = {};
      ajoutsRecents?.forEach((ajout) => {
        const key = ajout.assigned_at?.slice(0, 10);
        if (key) countsByDay[key] = (countsByDay[key] || 0) + 1;
      });

      // Préparer les données pour le graphique
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
        quizzes: quizzesCount || 0,
        demandesAcces: demandesCount || 0,
      });

      setRecentActivities(logs || []);
    };

    fetchStatsAndActivities();
  }, [professeurId]);

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-8">
      <h1 className="text-3xl font-bold text-dark mb-6">Tableau de bord professeur</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-6">
          <StatCard label="Élèves" value={stats.eleves} />
          <StatCard label="Classes" value={stats.classes} />
          <StatCard label="Quiz créés" value={stats.quizzes} />
          <StatCard label="Demandes accès validées" value={stats.demandesAcces} />
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