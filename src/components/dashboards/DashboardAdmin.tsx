//src/components/dashboards/DashboardAdmin
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
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
  Home,
} from "lucide-react";
import SimulationForm from "../admin/SimulationForm";
import ListeDemandesAcces from "../users/ListeDemandesAcces";
import { AccueilAdmin } from "./AccueilAdmin";
import { useFullUserProfile } from "../../hooks/useFullUserProfile";
import ConfirmDialog from "../ui/ConfirmDialog";

interface DashboardAdminProps {
  user: Profil;
  onLogout: () => void;
}

type Section = "accueil" | "users" | "simulations" | "visualisations" | "demandes";

const DashboardAdmin = ({ user, onLogout }: DashboardAdminProps) => {
  const { localUser, photoUrl, isLoadingUser } = useFullUserProfile(user);
  const [currentSection, setCurrentSection] = useState<Section>("accueil");
  const [nbDemandesEnAttente, setNbDemandesEnAttente] = useState<number>(0);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const fetchNbDemandes = async () => {
    const { count, error } = await supabase
      .from("simulation_access_requests")
      .select("id", { count: "exact", head: true })
      .eq("statut", "EN_ATTENTE")
      .eq("role_demandeur", "PROFESSEUR");

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
      case "accueil":
        return <AccueilAdmin />;
      case "users":
        return <UserList />;
      case "simulations":
        return <SimulationForm createdBy={localUser.id} />;
      case "visualisations":
        return <Visualisations />;
      case "demandes":
        return <ListeDemandesAcces user={localUser} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-light font-sans">
      {/* Header mobile */}
      <header className="md:hidden flex items-center justify-between bg-primary text-white px-4 py-3 shadow-md">
        <div className="flex items-center gap-2 font-semibold">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profil"
              className="w-8 h-8 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <UserCircle size={24} />
          )}
          <span>{localUser.prenom} {localUser.nom}</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Ouvrir le menu"
          className="p-1 hover:bg-primary/80 rounded-md transition"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "block" : "hidden"} md:flex md:flex-col md:w-64 w-full bg-primary text-white p-4 md:h-screen z-30 shadow-lg`}
      >
        <div className="flex flex-col items-center mb-8 pt-4">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profil"
              className="w-20 h-20 rounded-full object-cover border-4 border-white mb-3"
            />
          ) : (
            <UserCircle className="w-20 h-20 text-white mb-3" strokeWidth={1.5} />
          )}
          <h1 className="text-xl font-heading font-bold text-center text-white">
            {localUser.prenom} {localUser.nom}
          </h1>
          <p className="text-white/80 text-sm mt-1">Administrateur</p>
        </div>

        <nav className="flex flex-col space-y-2 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
          {[
            { label: "Accueil", icon: <Home size={20} />, value: "accueil" },
            { label: "Utilisateurs", icon: <Users size={20} />, value: "users" },
            { label: "Simulations", icon: <Cpu size={20} />, value: "simulations" },
            { label: "Visualisations", icon: <MonitorPlay size={20} />, value: "visualisations" },
            { 
              label: "Demandes", 
              icon: <Mail size={20} />, 
              value: "demandes",
              badge: nbDemandesEnAttente > 0 ? nbDemandesEnAttente : undefined
            },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setCurrentSection(item.value as Section);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${currentSection === item.value
                  ? "bg-white text-primary shadow-md"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
            >
              <span className={`${currentSection === item.value ? "text-primary" : "text-white/90"}`}>
                {item.icon}
              </span>
              <span className="flex-grow text-left">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-danger text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 mt-4 md:mt-auto bg-danger hover:bg-dangerHover text-white font-medium rounded-xl shadow transition w-full"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-white">
        {isLoadingUser ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Confirmer la déconnexion"
        message="Voulez-vous vraiment vous déconnecter ?"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={async () => {
          setShowLogoutConfirm(false);
          await handleLogout();
        }}
        confirmLabel="Se déconnecter"
      />
    </div>
  );
};

export default DashboardAdmin;