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
} from "lucide-react";
import EtatDemandesSimulation from "../users/EtatDemandesSimulation";
import CreateClasseForm from "../users/CreateClasseForm";
import MesClasses from "../users/MesClasses";
import CreateTPForm from "../users/CreateTPForm";
import ListeDemandesAcces from "../views/ListeDemandesAcces";
import ResultatsEleves from "../users/ResultatsEleves";
import ProfilEditor from "../users/ProfilEditor";

interface DashboardProfesseurProps {
  user: Profil;
  onLogout: () => void;
}

type Section =
  | "simulations"
  | "visualisations"
  | "classes"
  | "demandes"
  | "tps"
  | "resultats"
  | "profil";

const DashboardProfesseur = ({ user, onLogout }: DashboardProfesseurProps) => {
  const [localUser, setLocalUser] = useState<Profil>(user);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [currentSection, setCurrentSection] = useState<Section>("simulations");
  const [nbDemandesEnAttente, setNbDemandesEnAttente] = useState<number>(0);
  const navigate = useNavigate();

  // Recharge le profil complet au montage
  useEffect(() => {
    const fetchFullUserProfile = async () => {
      setIsLoadingUser(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        console.error("Erreur chargement profil:", error?.message);
        setLocalUser(user); // fallback
      } else {
        setLocalUser(data);
      }

      setIsLoadingUser(false);
    };

    fetchFullUserProfile();
  }, [user.id]);

  // Met à jour l'URL publique de la photo de profil
  useEffect(() => {
    const fetchPublicUrl = () => {
      if (!localUser.photo_profil) {
        setPhotoUrl(null);
        return;
      }

      if (!localUser.photo_profil.startsWith("http")) {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(localUser.photo_profil);
        setPhotoUrl(data.publicUrl);
      } else {
        setPhotoUrl(localUser.photo_profil);
      }
    };

    fetchPublicUrl();
  }, [localUser.photo_profil]);

  // Charger le nombre de demandes en attente adressées au prof connecté
  const fetchNbDemandes = async () => {
    if (!localUser?.id) {
      setNbDemandesEnAttente(0);
      return;
    }

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
            <h2 className="text-2xl font-semibold mb-4">Mes simulations</h2>
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

      case "classes":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Mes classes</h2>
            <CreateClasseForm
              user={localUser}
              onCreated={() => setCurrentSection("classes")}
            />
            <MesClasses user={localUser} />
          </div>
        );

      case "demandes":
        return (
          <div className="mt-4 space-y-10">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Mes demandes d'accès (envoyées aux administrateurs)
              </h2>
              <EtatDemandesSimulation user={localUser} />
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Demandes d'accès des élèves (à valider)
              </h2>
              <ListeDemandesAcces user={localUser} />
            </section>
          </div>
        );

      case "tps":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Créer un TP</h2>
            <CreateTPForm user={localUser} />
          </div>
        );

      case "resultats":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Résultats des élèves</h2>
            <ResultatsEleves professeur={localUser} />
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
            onClick={() => setCurrentSection("classes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              currentSection === "classes"
                ? "bg-white text-blue-700 font-bold"
                : "hover:bg-blue-600"
            }`}
          >
            <Users size={18} /> Classes
          </button>

          <button
            onClick={() => setCurrentSection("tps")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              currentSection === "tps"
                ? "bg-white text-blue-700 font-bold"
                : "hover:bg-blue-600"
            }`}
          >
            <Cpu size={18} /> Créer un TP
          </button>

          <button
            onClick={() => setCurrentSection("demandes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              currentSection === "demandes"
                ? "bg-white text-green-700 font-bold"
                : "hover:bg-green-600"
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
            onClick={() => setCurrentSection("resultats")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
              currentSection === "resultats"
                ? "bg-white text-blue-700 font-bold"
                : "hover:bg-blue-600"
            }`}
          >
            <FileCheck size={18} /> Résultats élèves
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

      {isLoadingUser ? (
        <main className="flex-1 p-6 overflow-y-auto bg-white">
          <p className="text-gray-600">Chargement du profil...</p>
        </main>
      ) : (
        <main className="flex-1 p-6 overflow-y-auto bg-white">{renderContent()}</main>
      )}
    </div>
  );
};

export default DashboardProfesseur;