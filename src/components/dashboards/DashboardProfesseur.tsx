// src/components/dashboards/DashboardProfesseur.tsx
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Profil } from "../../types";
import Simulations from "../sections/Simulations";
import Visualisations from "../sections/Visualisations";
import { Users, Cpu, MonitorPlay, LogOut, CheckCircle } from "lucide-react";
import EtatDemandesSimulation from "../admin/EtatDemandesSimulation";
import CreateClasseForm from "../admin/CreateClasseForm"; // renommé pour être plus logique

interface DashboardProfesseurProps {
  user: Profil;
  onLogout: () => void;
}

type Section = "simulations" | "visualisations" | "classes" | "demandes";

const DashboardProfesseur = ({ user, onLogout }: DashboardProfesseurProps) => {
  const [localUser] = useState(user);
  const [currentSection, setCurrentSection] = useState<Section>("simulations");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    navigate("/");
  };

  const renderContent = () => {
    switch (currentSection) {
      case "simulations":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Mes simulations</h2>
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
      case "classes":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Mes classes</h2>
            <CreateClasseForm user={localUser} />
          </div>
        );
      case "demandes":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Mes demandes d'accès</h2>
            <EtatDemandesSimulation user={localUser} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <aside className="md:w-64 w-full md:h-full h-auto bg-blue-700 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">
          👨‍🏫 Bonjour {localUser.prenom} {localUser.nom}
        </h1>

        <nav className="flex flex-col space-y-4 flex-grow">
          <button
            onClick={() => setCurrentSection("simulations")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${currentSection === "simulations"
              ? "bg-white text-blue-700 font-bold"
              : "hover:bg-blue-600"
              }`}
          >
            <Cpu size={18} /> Simulations
          </button>

          <button
            onClick={() => setCurrentSection("visualisations")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${currentSection === "visualisations"
              ? "bg-white text-blue-700 font-bold"
              : "hover:bg-blue-600"
              }`}
          >
            <MonitorPlay size={18} /> Visualisations
          </button>

          <button
            onClick={() => setCurrentSection("classes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${currentSection === "classes"
              ? "bg-white text-blue-700 font-bold"
              : "hover:bg-blue-600"
              }`}
          >
            <Users size={18} /> Classes
          </button>

          <button
            onClick={() => setCurrentSection("demandes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${currentSection === "demandes"
              ? "bg-white text-blue-700 font-bold"
              : "hover:bg-blue-600"
              }`}
          >
            <CheckCircle size={18} /> Demandes
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

export default DashboardProfesseur;