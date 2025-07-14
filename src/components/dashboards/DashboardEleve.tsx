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
} from "lucide-react";

type Section = "simulations" | "visualisations" | "tps" | "demandes" | "profil";

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
  const navigate = useNavigate();

  // Recharge le profil
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

  // Photo de profil
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

  // Nombre de demandes en attente envoyées par l'élève
  const fetchNbDemandes = async () => {
    const { count, error } = await supabase
      .from("simulation_access_requests")
      .select("id", { count: "exact", head: true })
      .eq("statut", "EN_ATTENTE")
      .eq("demandeur_id", localUser.id); // <== Correction ici

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
            <h2 className="text-2xl font-semibold mb-4">
              Visualisations interactives
            </h2>
            <Visualisations />
          </div>
        );
      case "tps":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Mes Travaux Pratiques</h2>
            <MesTPs />
          </div>
        );
      case "demandes":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Mes demandes d’accès</h2>
            <EtatDemandesSimulation user={localUser} />
          </div>
        );
      case "profil":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Mon profil</h2>
            <ProfilEditor user={localUser} onUpdate={setLocalUser} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <aside className="md:w-64 w-full md:h-full h-auto bg-blue-700 text-white p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Photo de profil"
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <UserCircle className="w-10 h-10 text-white" />
          )}
          <h1 className="text-2xl font-bold">
            {localUser.prenom} {localUser.nom}
          </h1>
        </div>

        <nav className="flex flex-col space-y-4 flex-grow">
          <button
            onClick={() => setCurrentSection("simulations")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              currentSection === "simulations"
                ? "bg-white text-blue-700 font-bold"
                : "hover:bg-blue-600"
            }`}
          >
            <Cpu size={18} /> Simulations
          </button>

          <button
            onClick={() => setCurrentSection("visualisations")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              currentSection === "visualisations"
                ? "bg-white text-blue-700 font-bold"
                : "hover:bg-blue-600"
            }`}
          >
            <MonitorPlay size={18} /> Visualisations
          </button>

          <button
            onClick={() => setCurrentSection("tps")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              currentSection === "tps"
                ? "bg-white text-blue-700 font-bold"
                : "hover:bg-blue-600"
            }`}
          >
            <BookOpenCheck size={18} /> Mes TPs
          </button>

          <button
            onClick={() => setCurrentSection("demandes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              currentSection === "demandes"
                ? "bg-white text-blue-700 font-bold"
                : "hover:bg-blue-600"
            }`}
          >
            <CheckCircle size={18} /> Demandes
            {nbDemandesEnAttente > 0 && (
              <span className="ml-auto inline-block bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {nbDemandesEnAttente}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentSection("profil")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              currentSection === "profil"
                ? "bg-white text-blue-700 font-bold"
                : "hover:bg-blue-600"
            }`}
          >
            <UserCircle size={18} /> Mon profil
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 mt-auto bg-red-600 hover:bg-red-700 rounded-md transition"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto bg-white">
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