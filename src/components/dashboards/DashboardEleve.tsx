// src/components/dashboards/DashboardEleve.tsx
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Profil } from "../../types";

interface DashboardEleveProps {
  user: Profil;
  onLogout: () => void;
}

const DashboardEleve = ({ user, onLogout }: DashboardEleveProps) => {
  const [localUser] = useState(user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    navigate("/");
  };

  return (
    <div className="py-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Bienvenue</h1>
      <p className="text-2xl text-gray-700 mb-6">
        {localUser.role === "ADMIN" && "Administrateur : "}
        <span className="font-semibold">
          {localUser.prenom} {localUser.nom}
        </span>
      </p>

      <button
        onClick={handleLogout}
        className="mt-4 mb-8 bg-red-600 text-white px-4 py-2 rounded"
      >
        Se déconnecter
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Tableau de bord Administrateur</h2>
        <p>Ici, vous pouvez gérer les utilisateurs, surveiller l'activité, etc.</p>
      </div>
    </div>
  );
};

export default DashboardEleve;