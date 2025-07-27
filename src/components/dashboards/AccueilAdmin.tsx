import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { ActivityLogWithUser } from "../../types";
import StatsChart from "../admin/StatsChart";
import UpcomingSimulations from "../admin/UpcomingSimulations";
import { Users, UserCog, BookOpen, BarChart2, Activity, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { PrimaryLoader } from "../ui/Loader";

type TrendType = 'up' | 'down' | 'neutral';

export const AccueilAdmin = () => {
  const [stats, setStats] = useState({
    professeurs: 0,
    eleves: 0,
    classes: 0,
    simulations: 0,
  });

  const [recentActivities, setRecentActivities] = useState<ActivityLogWithUser[]>([]);
  const [userStatsByDay, setUserStatsByDay] = useState<{ jour: string; utilisateurs: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsTrend, setStatsTrend] = useState<Record<string, TrendType>>({
    professeurs: 'neutral',
    eleves: 'neutral',
    classes: 'neutral',
    simulations: 'neutral',
  });

  useEffect(() => {
    const fetchStatsAndActivities = async () => {
      try {
        // Récupérer les stats actuelles et historiques
        const [prof, eleve, classe, simu, prevStats] = await Promise.all([
          supabase.from("users").select("id", { count: "exact" }).eq("role", "PROFESSEUR"),
          supabase.from("users").select("id", { count: "exact" }).eq("role", "ELEVE"),
          supabase.from("classe").select("id", { count: "exact" }),
          supabase.from("simulation").select("id", { count: "exact" }),
          supabase.from("historical_stats").select("*").order("created_at", { ascending: false }).limit(1),
        ]);

        // Calculer les tendances
        if (prevStats.data && prevStats.data.length > 0) {
          const prev = prevStats.data[0];
          setStatsTrend({
            professeurs: (prof.count ?? 0) > (prev.professeurs ?? 0) ? 'up' : (prof.count ?? 0) < (prev.professeurs ?? 0) ? 'down' : 'neutral',
            eleves: (eleve.count ?? 0) > (prev.eleves ?? 0) ? 'up' : (eleve.count ?? 0) < (prev.eleves ?? 0) ? 'down' : 'neutral',
            classes: (classe.count ?? 0) > (prev.classes ?? 0) ? 'up' : (classe.count ?? 0) < (prev.classes ?? 0) ? 'down' : 'neutral',
            simulations: (simu.count ?? 0) > (prev.simulations ?? 0) ? 'up' : (simu.count ?? 0) < (prev.simulations ?? 0) ? 'down' : 'neutral',
          });
        }

        // Enregistrer les nouvelles stats
        await supabase.from("historical_stats").insert([{
          professeurs: prof.count ?? 0,
          eleves: eleve.count ?? 0,
          classes: classe.count ?? 0,
          simulations: simu.count ?? 0,
        }]);

        // Récupérer les activités récentes
        const { data: logs } = await supabase
          .from("activity_logs")
          .select("*, users (nom, prenom, role)")
          .order("created_at", { ascending: false })
          .limit(8);

        // Récupérer les stats utilisateurs par jour
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);

        const { data: usersCreated } = await supabase
          .from("users")
          .select("id, created_at")
          .gte("created_at", sevenDaysAgo.toISOString())
          .order("created_at", { ascending: true });

        // Préparer les données pour le graphique
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

        // Mettre à jour l'état
        setStats({
          professeurs: prof.count ?? 0,
          eleves: eleve.count ?? 0,
          classes: classe.count ?? 0,
          simulations: simu.count ?? 0,
        });

        setUserStatsByDay(chartData);
        setRecentActivities(logs || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsAndActivities();
  }, []);

  if (loading) {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <PrimaryLoader size="lg" />
      <span className="text-dark font-medium text-lg">
        Chargement du tableau de bord...
      </span>
    </div>
  );
}

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-heading font-bold text-dark">Tableau de bord administrateur</h1>
          <p className="text-dark/70 mt-1">Vue d'ensemble de la plateforme</p>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          label="Professeurs"
          value={stats.professeurs}
          icon={<UserCog className="h-5 w-5" />}
          trend={statsTrend.professeurs}
        />
        <StatCard
          label="Élèves"
          value={stats.eleves}
          icon={<Users className="h-5 w-5" />}
          trend={statsTrend.eleves}
        />
        <StatCard
          label="Classes"
          value={stats.classes}
          icon={<BookOpen className="h-5 w-5" />}
          trend={statsTrend.classes}
        />
        <StatCard
          label="Simulations"
          value={stats.simulations}
          icon={<BarChart2 className="h-5 w-5" />}
          trend={statsTrend.simulations}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique d'activité */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-heading font-semibold text-dark">
              Nouveaux utilisateurs (7 jours)
            </h2>
          </div>
          <StatsChart data={userStatsByDay} />
        </div>

        {/* Activités récentes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-heading font-semibold text-dark mb-4">
            Activités récentes
          </h2>
          {recentActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Activity className="h-8 w-8 mb-2" />
              <p>Aucune activité récente</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {recentActivities.slice(0, 6).map((log) => (
                <ActivityItem key={log.id} log={log} />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Simulations à venir */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-heading font-semibold text-dark mb-4">
          Simulations à venir
        </h2>
        <UpcomingSimulations />
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  trend?: TrendType;
}

const StatCard = ({ label, value, icon, trend = 'neutral' }: StatCardProps) => {
  const trendConfig = {
    up: { color: 'text-green-600', icon: <ArrowUp className="h-4 w-4" />, text: 'Hausse' },
    down: { color: 'text-danger', icon: <ArrowDown className="h-4 w-4" />, text: 'Baisse' },
    neutral: { color: 'text-gray-500', icon: <Minus className="h-4 w-4" />, text: 'Stable' },
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-dark/70 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-3xl font-bold text-primary mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-accent/20 text-primary">
          {icon}
        </div>
      </div>
      <div className={`mt-3 text-sm flex items-center ${trendConfig[trend].color}`}>
        {trendConfig[trend].icon}
        <span className="ml-1">{trendConfig[trend].text}</span>
      </div>
    </div>
  );
};

const ActivityItem = ({ log }: { log: ActivityLogWithUser }) => (
  <li className="flex items-start">
    <div className="flex-shrink-0 mt-1">
      <div className="h-2 w-2 rounded-full bg-primary"></div>
    </div>
    <div className="ml-3 text-sm">
      <p className="text-dark">
        <span className="font-medium text-primary">
          {log.users?.prenom} {log.users?.nom}
        </span>{" "}
        a effectué l'action{" "}
        <span className="italic text-dark">{log.action.toLowerCase()}</span>{" "}
        {log.target_type && (
          <>
            sur <span className="font-medium text-secondary">{log.target_type.toLowerCase()}</span>
          </>
        )}
      </p>
      <p className="text-dark/50 text-xs mt-1">
        {new Date(log.created_at).toLocaleString('fr-FR', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
    </div>
  </li>
);

export default AccueilAdmin;