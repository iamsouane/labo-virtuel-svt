// src/components/dashboards/DashboardProfesseur.tsx
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import type { Profil } from "../../types";
import Simulations from "../sections/Simulations";
import Visualisations from "../sections/Visualisations";
import {
  Users,
  Cpu,
  MonitorPlay,
  LogOut,
  CheckCircle,
  UserCircle,
  FileCheck,
  Menu,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EtatDemandesSimulation from "../users/EtatDemandesSimulation";
import CreateClasseForm from "../users/CreateClasseForm";
import MesClasses from "../users/MesClasses";
import CreateTPForm from "../users/CreateTPForm";
import ResultatsEleves from "../users/ResultatsEleves";
import ProfilEditor from "../users/ProfilEditor";
import AccueilProfesseur from "./AccueilProfesseur";
import { useFullUserProfile } from "../../hooks/useFullUserProfile";

interface DashboardProfesseurProps {
  user: Profil;
  onLogout: () => void;
}

type Section =
  | "accueil"
  | "simulations"
  | "visualisations"
  | "classes"
  | "demandes"
  | "tps"
  | "resultats"
  | "profil";

const DashboardProfesseur = ({ user, onLogout }: DashboardProfesseurProps) => {
  const { localUser, setLocalUser, photoUrl, isLoadingUser } = useFullUserProfile(user);
  const [currentSection, setCurrentSection] = useState<Section>("accueil");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [classes, setClasses] = useState<any[]>([]);
  const navigate = useNavigate();

  // Charger les classes
  useEffect(() => {
    if (currentSection === "classes") {
      const fetchClasses = async () => {
        const { data, error } = await supabase
          .from("classe")
          .select("*")
          .eq("created_by", user.id)
          .order("created_at", { ascending: false });
        
        if (!error && data) {
          setClasses(data);
        }
      };
      fetchClasses();
    }
  }, [currentSection, user.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    navigate("/");
  };

  const renderClassesView = () => {
    const classesPerPage = 2;
    const pageCount = Math.ceil(classes.length / classesPerPage);
    const currentClasses = classes.slice(
      currentPage * classesPerPage,
      (currentPage + 1) * classesPerPage
    );

    return (
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-heading font-semibold text-primary mb-4">
            Création de classe
          </h3>
          <CreateClasseForm 
            user={localUser} 
            onCreated={() => {
              setCurrentSection("classes");
              setCurrentPage(0);
            }} 
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-heading font-semibold text-primary">
              Mes classes
            </h3>
            {pageCount > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
                  className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5 text-dark" />
                </button>
                <span className="text-sm text-dark/80">
                  Page {currentPage + 1} sur {pageCount}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1))}
                  disabled={currentPage === pageCount - 1}
                  className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronRight className="w-5 h-5 text-dark" />
                </button>
              </div>
            )}
          </div>

          {currentClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentClasses.map((classe) => (
                <div key={classe.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-heading font-medium text-primary mb-3">
                    {classe.code_classe}
                  </h4>
                  <MesClasses user={localUser} singleClasseId={classe.id} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-dark/70 py-8">Aucune classe disponible</p>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentSection) {
      case "accueil":
        return <AccueilProfesseur />;
      case "simulations":
        return (
          <section className="space-y-6">
            <Simulations user={localUser} />
          </section>
        );
      case "visualisations":
        return (
          <section className="space-y-6">
            <Visualisations />
          </section>
        );
      case "classes":
        return renderClassesView();
      case "demandes":
        return (
          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-dark mb-4">Demandes de simulation</h2>
            <EtatDemandesSimulation user={localUser} />
          </section>
        );
      case "tps":
        return (
          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-dark mb-4">Création de TP</h2>
            <CreateTPForm user={localUser} />
          </section>
        );
      case "resultats":
        return (
          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-dark mb-4">Résultats des élèves</h2>
            <ResultatsEleves professeur={localUser} />
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
          <p className="text-white/80 text-sm mt-1">Professeur</p>
        </div>

        <nav className="flex flex-col space-y-2 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
          {[
            { label: "Accueil", icon: <Home size={20} />, value: "accueil" },
            { label: "Simulations", icon: <Cpu size={20} />, value: "simulations" },
            { label: "Visualisations", icon: <MonitorPlay size={20} />, value: "visualisations" },
            { label: "Classes", icon: <Users size={20} />, value: "classes" },
            { label: "Créer un TP", icon: <Cpu size={20} />, value: "tps" },
            { label: "Demandes", icon: <CheckCircle size={20} />, value: "demandes" },
            { label: "Résultats élèves", icon: <FileCheck size={20} />, value: "resultats" },
            { label: "Mon profil", icon: <UserCircle size={20} />, value: "profil" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setCurrentSection(item.value as Section);
                setSidebarOpen(false);
                setCurrentPage(0);
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
          onClick={handleLogout}
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
            {currentSection === "classes" ? (
              <>
                {renderContent()}
              </>
            ) : (
              renderContent()
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardProfesseur;