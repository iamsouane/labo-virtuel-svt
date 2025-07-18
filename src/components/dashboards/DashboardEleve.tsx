// src/components/dashboards/DashboardEleve.tsx
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import type { Profil } from "../../types";
import Simulations from "../sections/Simulations";
import MesTPs from "../users/MesTPs";
import EtatDemandesSimulation from "../users/EtatDemandesSimulation";
import Visualisations from "../sections/Visualisations";
import ProfilEditor from "../users/ProfilEditor";
import {
  Cpu,
  BookOpenCheck,
  CheckCircle,
  MonitorPlay,
  LogOut,
  UserCircle,
  Menu,
} from "lucide-react";
import AccueilEleve from "./AccueilEleve";

type Section = "accueil" | "simulations" | "visualisations" | "tps" | "demandes" | "profil";

interface DashboardEleveProps {
  user: Profil;
  onLogout: () => void;
}

const DashboardEleve = ({ user, onLogout }: DashboardEleveProps) => {
  const [localUser, setLocalUser] = useState<Profil>(user);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [currentSection, setCurrentSection] = useState<Section>("simulations");
  const [nbDemandesEnAttente, setNbDemandesEnAttente] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingUser(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        console.error("Erreur récupération profil:", error?.message);
        setLocalUser(user);
      } else {
        setLocalUser(data);
      }

      setIsLoadingUser(false);
    };

    fetchUser();
  }, [user.id]);

  useEffect(() => {
    const updatePhotoUrl = () => {
      if (!localUser.photo_profil) return setPhotoUrl(null);
      if (!localUser.photo_profil.startsWith("http")) {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(localUser.photo_profil);
        setPhotoUrl(data?.publicUrl ?? null);
      } else {
        setPhotoUrl(localUser.photo_profil);
      }
    };

    updatePhotoUrl();
  }, [localUser.photo_profil]);

  const fetchNbDemandes = async () => {
    const { count, error } = await supabase
      .from("simulation_access_requests")
      .select("id", { count: "exact", head: true })
      .eq("statut", "EN_ATTENTE")
      .eq("demandeur_id", localUser.id);

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
        () => {
          fetchNbDemandes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [localUser.id]);

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
          <div className="mt-6">
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">
              Simulations
            </h2>
            <Simulations user={localUser} />
          </div>
        );
      case "visualisations":
        return (
          <div className="mt-6">
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">
              Visualisations interactives
            </h2>
            <Visualisations />
          </div>
        );
      case "tps":
        return (
          <div className="mt-6">
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">
              Mes Travaux Pratiques
            </h2>
            <MesTPs />
          </div>
        );
      case "demandes":
        return (
          <div className="mt-6">
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">
              Mes demandes d’accès
            </h2>
            <EtatDemandesSimulation user={localUser} />
          </div>
        );
      case "profil":
        return (
          <div className="mt-6">
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">
              Mon profil
            </h2>
            <ProfilEditor user={localUser} onUpdate={setLocalUser} />
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
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Photo de profil"
              className="w-9 h-9 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <UserCircle size={28} />
          )}
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
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:flex md:flex-col md:w-72 w-full bg-primary text-white p-6 md:h-screen h-auto z-30 shadow-lg`}
      >
        <div className="flex flex-col items-center mb-10">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profil"
              className="w-20 h-20 rounded-full object-cover border-2 border-white mb-3"
            />
          ) : (
            <UserCircle className="w-20 h-20 text-white mb-3" />
          )}
          <h1 className="text-2xl font-heading font-bold text-center whitespace-normal">
            {localUser.prenom} {localUser.nom}
          </h1>
        </div>

        <nav className="flex flex-col space-y-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-primary-light scrollbar-track-primary-dark">
          {[
                { label: "Accueil", icon: <Cpu size={20} />, value: "accueil" }, // Tu peux changer l'icône

            { label: "Simulations", icon: <Cpu size={20} />, value: "simulations" },
            {
              label: "Visualisations",
              icon: <MonitorPlay size={20} />,
              value: "visualisations",
            },
            { label: "Mes TPs", icon: <BookOpenCheck size={20} />, value: "tps" },
            {
              label: "Demandes",
              icon: <CheckCircle size={20} />,
              value: "demandes",
              badge: nbDemandesEnAttente,
            },
            { label: "Mon profil", icon: <UserCircle size={20} />, value: "profil" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setCurrentSection(item.value as Section);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-4 px-6 py-3 rounded-3xl transition text-base font-semibold select-none
                ${
                  currentSection === item.value
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
        {isLoadingUser ? (
          <p className="text-gray-600">Chargement du profil...</p>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
};

export default DashboardEleve;