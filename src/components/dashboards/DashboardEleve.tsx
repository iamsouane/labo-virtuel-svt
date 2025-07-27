// src/components/dashboards/DashboardEleve.tsx
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import type { Profil } from "../../types";
import Simulations from "../sections/Simulations";
import MesTPs from "../users/MesTPs";
import Visualisations from "../sections/Visualisations";
import ProfilEditor from "../users/ProfilEditor";
import {
  Cpu,
  BookOpenCheck,
  MonitorPlay,
  LogOut,
  UserCircle,
  Menu,
  Home,
} from "lucide-react";
import AccueilEleve from "./AccueilEleve";
import { useFullUserProfile } from "../../hooks/useFullUserProfile";
import ConfirmDialog from "../ui/ConfirmDialog";

type Section = "accueil" | "simulations" | "visualisations" | "tps" | "profil";

interface DashboardEleveProps {
  user: Profil;
  onLogout: () => void;
}

const DashboardEleve = ({ user, onLogout }: DashboardEleveProps) => {
  const { localUser, setLocalUser, photoUrl, isLoadingUser } = useFullUserProfile(user);
  const [currentSection, setCurrentSection] = useState<Section>("accueil");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    navigate("/");
  };

  const renderContent = () => {
    switch (currentSection) {
      case "accueil":
        return <AccueilEleve />;
      case "simulations":
        return (
          <section className="space-y-1">
            <Simulations user={localUser} />
          </section>
        );
      case "visualisations":
        return (
          <section className="space-y-1">
            <Visualisations />
          </section>
        );
      case "tps":
        return (
          <section className="space-y-1">
            <MesTPs />
          </section>
        );
      case "profil":
        return (
          <section className="space-y-6">
            <ProfilEditor user={localUser} onUpdate={setLocalUser} />
          </section>
        );
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
          <p className="text-white/80 text-sm mt-1">Élève</p>
        </div>

        <nav className="flex flex-col space-y-2 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
          {[
            { label: "Accueil", icon: <Home size={20} />, value: "accueil" },
            { label: "Simulations", icon: <Cpu size={20} />, value: "simulations" },
            { label: "Visualisations", icon: <MonitorPlay size={20} />, value: "visualisations" },
            { label: "Mes TPs", icon: <BookOpenCheck size={20} />, value: "tps" },
            { label: "Mon profil", icon: <UserCircle size={20} />, value: "profil" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setCurrentSection(item.value as Section);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                currentSection === item.value
                  ? "bg-white text-primary shadow-md"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={`${currentSection === item.value ? "text-primary" : "text-white/90"}`}>
                {item.icon}
              </span>
              <span className="flex-grow text-left">{item.label}</span>
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

export default DashboardEleve;