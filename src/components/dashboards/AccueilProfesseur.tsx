// src/components/dashboards/AccueilProfesseur.tsx
import type { ActivityLogWithUser } from "../../types";
import StatsChartEleves from "../users/StatsChartEleves";
import UpcomingSimulations from "../admin/UpcomingSimulations";
import { Loader2, Users, Folder, FileText, BarChart2, Activity, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { useProfesseurDashboardData } from "../../hooks/useProfesseurDashboardData";

export const AccueilProfesseur = () => {
  const {
    loading,
    stats,
    recentActivities,
    userStatsByDay,
  } = useProfesseurDashboardData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-secondary">
        <Loader2 className="animate-spin mr-2 h-6 w-6" />
        <span className="font-medium">Chargement du tableau de bord...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-heading font-bold text-dark">Tableau de bord</h1>
          <p className="text-dark/70 mt-1">Aperçu de votre activité pédagogique</p>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          label="Élèves"
          value={stats.eleves}
          icon={<Users className="h-5 w-5" />}
          trend="up"
        />
        <StatCard
          label="Classes"
          value={stats.classes}
          icon={<Folder className="h-5 w-5" />}
        />
        <StatCard
          label="Quiz créés"
          value={stats.quizzes}
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Simulations"
          value={stats.simulationsAutorisees}
          icon={<BarChart2 className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique d'activité */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-heading font-semibold text-dark">Activité des élèves (7 jours)</h2>
          </div>
          <StatsChartEleves data={userStatsByDay} />
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

const StatCard = ({
  label,
  value,
  icon,
  trend
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}) => (
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

export default AccueilProfesseur;