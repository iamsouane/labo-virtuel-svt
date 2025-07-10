// src/components/views/AccueilUtilisateur.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Profil } from "../../types";
import { supabase } from "../../lib/supabaseClient";
import { notifySuccess, notifyError } from "../../lib/notifications";

import DashboardAdmin from "../dashboards/DashboardAdmin";
import DashboardProfesseur from "../dashboards/DashboardProfesseur";
import DashboardEleve from "../dashboards/DashboardEleve";

// Inline ChangePasswordForm
const ChangePasswordForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword.trim().length < 6) {
      notifyError("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (authError) {
      notifyError("Erreur : " + authError.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      notifyError("Erreur lors de la récupération de l'utilisateur.");
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase
      .from("users")
      .update({ must_change_password: false })
      .eq("id", user.id);

    if (dbError) {
      notifyError("Erreur lors de la mise à jour du statut : " + dbError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess(); // Appel unique
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-left font-medium text-sm text-gray-700">
        Nouveau mot de passe
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 block w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
          minLength={6}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white transition ${
          loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Mise à jour..." : "Mettre à jour"}
      </button>
    </form>
  );
};

interface AccueilUtilisateurProps {
  user: Profil;
  onLogout: () => void;
}

const AccueilUtilisateur = ({ user, onLogout }: AccueilUtilisateurProps) => {
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(user);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    navigate("/");
  };

const handlePasswordChanged = async () => {
  try {
    // 🔄 Recharge l'utilisateur depuis Supabase pour s'assurer qu'il est à jour
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      notifyError("Impossible de récupérer l'utilisateur mis à jour.");
      return;
    }

    const { data: profil, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (dbError || !profil) {
      notifyError("Erreur lors de la récupération du profil mis à jour.");
      return;
    }

    // ✅ Met à jour l'état local
    setLocalUser(profil);
    notifySuccess("Votre mot de passe a été mis à jour avec succès !");
  } catch (error) {
    notifyError("Erreur inattendue.");
  }
};


  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Dashboard avec blur si changement de mot de passe requis */}
      <div className={localUser.must_change_password ? "blur-sm opacity-60 pointer-events-none h-full" : "h-full"}>
        {localUser.role === "ADMIN" && (
          <DashboardAdmin user={localUser} onLogout={handleLogout} />
        )}
        {localUser.role === "PROFESSEUR" && (
          <DashboardProfesseur user={localUser} onLogout={handleLogout} />
        )}
        {localUser.role === "ELEVE" && (
          <DashboardEleve user={localUser} onLogout={handleLogout} />
        )}
      </div>

      {/* Overlay de changement de mot de passe */}
      {localUser.must_change_password && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <p className="mb-4 text-red-600 font-semibold text-center">
              Vous devez changer votre mot de passe avant de continuer.
            </p>
            <ChangePasswordForm onSuccess={handlePasswordChanged} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AccueilUtilisateur;