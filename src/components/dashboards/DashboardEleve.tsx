//src/components/dashboards/DashboardEleve.tsx
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Profil } from "../../types";
import Simulations from "../sections/Simulations";
import MesTPs from "../users/MesTPs";
import EtatDemandesSimulation from "../users/EtatDemandesSimulation";
import Visualisations from "../sections/Visualisations";
import {
  Cpu,
  BookOpenCheck,
  CheckCircle,
  MonitorPlay,
  LogOut,
  UserCircle
} from "lucide-react";

type Section = "simulations" | "visualisations" | "tps" | "demandes";

interface DashboardEleveProps {
  user: Profil;
  onLogout: () => void;
}

const DashboardEleve = ({ user, onLogout }: DashboardEleveProps) => {
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
            <h2 className="text-2xl font-semibold mb-4">Simulations</h2>
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
      case "tps":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Mes Travaux Pratiques</h2>
            <MesTPs/>
          </div>
        );
      case "demandes":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Mes demandes d’accès</h2>
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
          <UserCircle className="w-6 h-6 text-white inline-block mr-2" />
          {localUser.prenom} {localUser.nom}
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
            onClick={() => setCurrentSection("tps")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${currentSection === "tps"
              ? "bg-white text-blue-700 font-bold"
              : "hover:bg-blue-600"
              }`}
          >
            <BookOpenCheck size={18} /> Mes TPs
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

export default DashboardEleve;