import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import Simulations from "../sections/Simulations";
import Visualisations from "../sections/Visualisations";
import UserList from "../admin/UserList";
import {
  Users,
  Cpu,
  MonitorPlay,
  LogOut,
  Mail,
  UserCircle,
  Menu,
} from "lucide-react";
import SimulationForm from "../admin/SimulationForm";
import ListeDemandesAcces from "../users/ListeDemandesAcces";

interface DashboardAdminProps {
  user: Profil;
  onLogout: () => void;
}

type Section = "users" | "simulations" | "visualisations" | "demandes";

const DashboardAdmin = ({ user, onLogout }: DashboardAdminProps) => {
  const [localUser] = useState(user);
  const [currentSection, setCurrentSection] = useState<Section>("users");
  const [nbDemandesEnAttente, setNbDemandesEnAttente] = useState<number>(0);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchNbDemandes = async () => {
    const { count, error } = await supabase
      .from("simulation_access_requests")
      .select("id", { count: "exact", head: true })
      .eq("statut", "EN_ATTENTE")
      .eq("destinataire_id", localUser.id);

    if (error) {
      console.error("Erreur chargement demandes en attente:", error.message);
      setNbDemandesEnAttente(0);
    } else {
      setNbDemandesEnAttente(count || 0);
    }
  };

  useEffect(() => {
    fetchNbDemandes();
    const subscription = supabase
      .channel("public:simulation_access_requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "simulation_access_requests" },
        () => fetchNbDemandes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    navigate("/");
  };

  const renderContent = () => {
    switch (currentSection) {
      case "users":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-primary">
              Gestion des utilisateurs
            </h2>
            <UserList />
          </div>
        );
      case "simulations":
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-heading font-bold text-primary">
              Simulations disponibles
            </h2>
            <SimulationForm createdBy={localUser.id} />
            <Simulations user={localUser} />
          </div>
        );
      case "visualisations":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-primary">
              Visualisations interactives
            </h2>
            <Visualisations />
          </div>
        );
      case "demandes":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-primary">
              Demandes d'accès
            </h2>
            <ListeDemandesAcces user={localUser} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-light">
      {/* Header mobile */}
      <header className="md:hidden flex items-center justify-between bg-primary text-white px-5 py-3 shadow-md">
        <div className="flex items-center gap-3 font-bold text-lg">
          <UserCircle size={28} />
          <span>
            {localUser.prenom} {localUser.nom}
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Ouvrir le menu"
          className="p-1 hover:bg-primary-dark rounded-md transition"
        >
          <Menu size={28} />
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "block" : "hidden"
          } md:flex md:flex-col md:w-72 w-full bg-primary text-white p-5 md:h-screen h-auto z-30 shadow-lg`}
      >
        <h1 className="text-2xl font-heading font-bold mb-8 flex flex-col items-center gap-1">
          <UserCircle className="w-10 h-10" />
          <span className="truncate text-center">
            {localUser.prenom} {localUser.nom}
          </span>
        </h1>

        <nav className="flex flex-col space-y-3 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-primary-light scrollbar-track-primary-dark">
          {[
            { label: "Utilisateurs", icon: <Users size={20} />, value: "users" },
            { label: "Simulations", icon: <Cpu size={20} />, value: "simulations" },
            { label: "Visualisations", icon: <MonitorPlay size={20} />, value: "visualisations" },
            {
              label: "Demandes d'accès",
              icon: <Mail size={20} />,
              value: "demandes",
              badge: nbDemandesEnAttente,
            },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setCurrentSection(item.value as Section);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-4 px-5 py-3 rounded-3xl transition text-base font-semibold select-none
                ${currentSection === item.value
                  ? "bg-light text-primary shadow-md"
                  : "hover:bg-primary-dark/80"
                }`}
            >
              {item.icon}
              <span className="flex-grow text-left">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-600 text-white text-xs font-semibold px-3 py-0.5 rounded-full shadow-sm select-none">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-3 mt-8 md:mt-auto bg-red-600 hover:bg-red-700 text-white font-semibold rounded-3xl shadow-md transition select-none"
        >
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-6 bg-white overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardAdmin;