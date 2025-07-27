//src/components/views/AccueilUtilisateur
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Profil } from "../../types";
import { supabase } from "../../lib/supabaseClient";
import { notifySuccess, notifyError } from "../../lib/notifications";
import { Eye, EyeOff, Lock } from "lucide-react";
import DashboardAdmin from "../dashboards/DashboardAdmin";
import DashboardProfesseur from "../dashboards/DashboardProfesseur";
import DashboardEleve from "../dashboards/DashboardEleve";

const ChangePasswordForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.trim().length < 6) {
      notifyError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    // Exemples de mots de passe à éviter
    const forbiddenPasswords = ["123456", "password", "motdepasse", "azerty", "000000"];
    if (forbiddenPasswords.includes(newPassword.trim().toLowerCase())) {
      notifyError("Le mot de passe est trop simple. Veuillez en choisir un plus sécurisé.");
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({ password: newPassword });
      if (authError) throw new Error(authError.message);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Erreur lors de la récupération de l'utilisateur.");

      const { error: dbError } = await supabase
        .from("users")
        .update({ must_change_password: false })
        .eq("id", user.id);
      if (dbError) throw new Error(dbError.message);

      notifySuccess("Mot de passe mis à jour avec succès !");
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        notifyError(error.message);
      } else {
        notifyError("Une erreur inconnue est survenue lors de la mise à jour du mot de passe.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-heading font-semibold text-dark">Changement de mot de passe</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-dark mb-1">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Saisissez votre nouveau mot de passe"
              disabled={loading}
              className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-primary transition"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center py-3 px-6 rounded-xl font-medium transition-all ${
            loading ? "bg-primary/80 cursor-wait" : "bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md"
          } text-white`}
        >
          {loading ? "Enregistrement..." : "Mettre à jour"}
        </button>
      </form>
    </div>
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
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) throw new Error(authError?.message || "Utilisateur non trouvé");

      const { data: profil, error: dbError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (dbError || !profil) throw new Error(dbError?.message || "Profil non trouvé");

      setLocalUser(profil);
      notifySuccess("Mot de passe mis à jour avec succès !");
    } catch (error: unknown) {
      if (error instanceof Error) {
        notifyError(error.message);
      } else {
        notifyError("Erreur inconnue lors de la mise à jour du profil");
      }
    }
  };

  const renderDashboard = () => {
    switch (localUser.role) {
      case "ADMIN":
        return <DashboardAdmin user={localUser} onLogout={handleLogout} />;
      case "PROFESSEUR":
        return <DashboardProfesseur user={localUser} onLogout={handleLogout} />;
      case "ELEVE":
        return <DashboardEleve user={localUser} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-light">
      {renderDashboard()}
      {localUser.must_change_password && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <ChangePasswordForm onSuccess={handlePasswordChanged} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AccueilUtilisateur;