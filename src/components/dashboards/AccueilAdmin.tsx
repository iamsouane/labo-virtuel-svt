//src/components/dashboards/AccueilAdmin
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { ActivityLogWithUser } from "../../types";
import StatsChart from "../admin/StatsChart";
import UpcomingSimulations from "../admin/UpcomingSimulations";
import { Loader2 } from "lucide-react";

export const AccueilAdmin = () => {
  const [stats, setStats] = useState({
    professeurs: 0,
    eleves: 0,
    classes: 0,
    simulations: 0,
  });

  const [recentActivities, setRecentActivities] = useState<ActivityLogWithUser[]>([]);
  const [userStatsByDay, setUserStatsByDay] = useState<{ jour: string; utilisateurs: number }[]>([]);
  const [loading, setLoading] = useState(true); // Nouveau

  useEffect(() => {
    const fetchStatsAndActivities = async () => {
      const [prof, eleve, classe, simu] = await Promise.all([
        supabase.from("users").select("id", { count: "exact" }).eq("role", "PROFESSEUR"),
        supabase.from("users").select("id", { count: "exact" }).eq("role", "ELEVE"),
        supabase.from("classe").select("id", { count: "exact" }),
        supabase.from("simulation").select("id", { count: "exact" }),
      ]);

      const { data: logs } = await supabase
        .from("activity_logs")
        .select("*, users (nom, prenom, role)")
        .order("created_at", { ascending: false })
        .limit(8);

      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);

      const { data: usersCreated } = await supabase
        .from("users")
        .select("id, created_at")
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      const countsByDay: Record<string, number> = {};
      if (usersCreated) {
        usersCreated.forEach((user) => {
          const key = user.created_at.slice(0, 10);
          countsByDay[key] = (countsByDay[key] || 0) + 1;
        });
      }

      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const key = date.toISOString().slice(0, 10);
        chartData.push({
          jour: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
          utilisateurs: countsByDay[key] || 0,
        });
      }

      setUserStatsByDay(chartData);

      setStats({
        professeurs: prof.count || 0,
        eleves: eleve.count || 0,
        classes: classe.count || 0,
        simulations: simu.count || 0,
      });

      setRecentActivities(logs || []);
      setLoading(false); // Fin du chargement
    };

    fetchStatsAndActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center text-secondary">
        <Loader2 className="animate-spin mr-2" /> Chargement des donnees du tableau de bord...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-8">
      <h1 className="text-3xl font-bold text-dark mb-6">Tableau de bord administrateur</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-6">
          <StatCard label="Professeurs" value={stats.professeurs} />
          <StatCard label="Élèves" value={stats.eleves} />
          <StatCard label="Classes" value={stats.classes} />
          <StatCard label="Simulations" value={stats.simulations} />
        </div>

        {/* Graphique */}
        <StatsChart data={userStatsByDay} />

        {/* Activités récentes */}
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

        {/* Simulations à venir */}
        <UpcomingSimulations />
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-accent/30 p-6 rounded-xl shadow-sm border border-accent flex flex-col items-center justify-center text-center min-h-[120px] hover:scale-[1.02] transition-transform duration-200 ease-in-out">
    <div className="text-sm font-medium text-dark mb-1 uppercase tracking-wide">
      {label}
    </div>
    <div className="text-3xl font-bold text-primary">{value}</div>
  </div>
);

export default AccueilAdmin;