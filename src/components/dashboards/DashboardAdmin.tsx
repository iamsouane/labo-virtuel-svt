// src/components/dashboards/DashboardAdmin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import Simulations from "../sections/Simulations";
import Visualisations from "../sections/Visualisations";
import UserList from "../admin/UserList";
import { Users, Cpu, MonitorPlay, LogOut, Mail } from "lucide-react";
import SimulationForm from "../admin/SimulationForm";
import ListeDemandesAcces from "../admin/ListeDemandesAcces";

interface DashboardAdminProps {
  user: Profil;
  onLogout: () => void;
}

type Section = "users" | "simulations" | "visualisations" | "demandes";

const DashboardAdmin = ({ user, onLogout }: DashboardAdminProps) => {
  const [localUser] = useState(user);
  const [currentSection, setCurrentSection] = useState<Section>("users");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    navigate("/");
  };

  const renderContent = () => {
    switch (currentSection) {
      case "users":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Gestion des utilisateurs</h2>
            <UserList />
          </div>
        );
      case "simulations":
        return (
          <div className="mt-4 space-y-8">
            <h2 className="text-2xl font-semibold">Simulations disponibles</h2>

            {/* Formulaire d'ajout */}
            <SimulationForm createdBy={localUser.id} />

            {/* Liste des simulations existantes */}
            <Simulations user={localUser} />
          </div>
        );
      case "visualisations":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Visualisations interactives</h2>
            <Visualisations />
          </div>
        );
      case "demandes":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Demandes d'accès</h2>
            <ListeDemandesAcces /> {/* Un composant à créer */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <aside className="md:w-64 w-full md:h-full h-auto bg-green-700 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">
          👋 Bonjour {localUser.prenom} {localUser.nom}
        </h1>

        <nav className="flex flex-col space-y-4 flex-grow">
          <button
            onClick={() => setCurrentSection("users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${currentSection === "users"
                ? "bg-white text-green-700 font-bold"
                : "hover:bg-green-600"
              }`}
          >
            <Users size={18} /> Utilisateurs
          </button>

          <button
            onClick={() => setCurrentSection("simulations")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${currentSection === "simulations"
                ? "bg-white text-green-700 font-bold"
                : "hover:bg-green-600"
              }`}
          >
            <Cpu size={18} /> Simulations
          </button>

          <button
            onClick={() => setCurrentSection("visualisations")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${currentSection === "visualisations"
                ? "bg-white text-green-700 font-bold"
                : "hover:bg-green-600"
              }`}
          >
            <MonitorPlay size={18} /> Visualisations
          </button>

          <button
            onClick={() => setCurrentSection("demandes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${currentSection === "demandes"
                ? "bg-white text-green-700 font-bold"
                : "hover:bg-green-600"
              }`}
          >
            <Mail size={18} /> Demandes d'accès
          </button>

        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 mt-auto bg-red-600 hover:bg-red-700 rounded-md transition"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-6 overflow-y-auto bg-white">{renderContent()}</main>
    </div>
  );
};

export default DashboardAdmin;