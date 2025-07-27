// src/components/users/AccueilEleve.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { BookOpen, BarChart2, FileText, Users, Activity, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { useEleveStats } from "../../hooks/useEleveStats";
import StatsChartQuiz from "../users/StatsChartQuiz";
import UpcomingSimulations from "../admin/UpcomingSimulations";
import type { ActivityLogWithUser } from "../../types";
import { PrimaryLoader } from "../ui/Loader";

export const AccueilEleve = () => {
  const [eleveId, setEleveId] = useState<string | null>(null);
  const { loading, stats, quizTerminesByDay, recentActivities } = useEleveStats(eleveId);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setEleveId(user.id);
    };
    fetchUser();
  }, []);

  if (loading || !eleveId) {
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
          <h1 className="text-3xl font-heading font-bold text-dark">Tableau de bord</h1>
          <p className="text-dark/70 mt-1">Aperçu de votre activité d'apprentissage</p>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          label="Quiz disponibles"
          value={stats.quizTotal}
          icon={<BookOpen className="h-5 w-5" />}
          trend={stats.quizTotal > 0 ? "up" : "neutral"}
        />
        <StatCard
          label="Simulations"
          value={stats.simulationsProf}
          icon={<BarChart2 className="h-5 w-5" />}
        />
        <StatCard
          label="Quiz terminés"
          value={stats.quizTermines}
          icon={<FileText className="h-5 w-5" />}
          trend={stats.quizTermines > 0 ? "up" : "neutral"}
        />
        <StatCard
          label="Classes"
          value={stats.classesAssociees}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique d'activité */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-heading font-semibold text-dark">Quiz terminés (7 jours)</h2>
          </div>
          <StatsChartQuiz data={quizTerminesByDay} />
        </div>

        {/* Activités récentes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-heading font-semibold text-dark mb-4">Activités récentes</h2>
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
        <h2 className="text-xl font-heading font-semibold text-dark mb-4">Simulations à venir</h2>
        <UpcomingSimulations />
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard = ({ label, value, icon, trend }: StatCardProps) => (
  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-dark/70 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-primary mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${icon ? 'bg-accent/20 text-primary' : ''}`}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className={`mt-3 text-sm flex items-center ${trend === 'up' ? 'text-green-600' :
        trend === 'down' ? 'text-danger' : 'text-gray-500'
        }`}>
        {trend === 'up' ? (
          <ArrowUp className="h-4 w-4 mr-1" />
        ) : trend === 'down' ? (
          <ArrowDown className="h-4 w-4 mr-1" />
        ) : (
          <Minus className="h-4 w-4 mr-1" />
        )}
        {trend === 'up' ? 'Hausse' : trend === 'down' ? 'Baisse' : 'Stable'}
      </div>
    )}
  </div>
);

interface ActivityItemProps {
  log: ActivityLogWithUser;
}

const ActivityItem = ({ log }: ActivityItemProps) => (
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
        <span className="italic text-dark">{log.action?.toLowerCase()}</span>{" "}
        {log.target_type && (
          <>
            sur <span className="font-medium text-secondary">{log.target_type?.toLowerCase()}</span>
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

export default AccueilEleve;