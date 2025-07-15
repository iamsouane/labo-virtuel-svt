import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { notifyError, notifySuccess } from "../lib/notifications";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

const ChangePasswordForm = ({ onSuccess }: ChangePasswordFormProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      notifyError("Erreur de mise à jour : " + dbError.message);
      setLoading(false);
      return;
    }

    notifySuccess("Mot de passe mis à jour avec succès.");
    setLoading(false);
    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 mx-auto mt-10"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Changer le mot de passe</h2>
        <p className="text-sm text-gray-600">Entrez un nouveau mot de passe sécurisé.</p>
      </div>

      <div className="relative">
        <label htmlFor="password" className="block text-left font-semibold text-primary mb-1">
          Nouveau mot de passe
        </label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="******"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-9 right-3 text-gray-600 hover:text-primary"
          aria-label="Afficher le mot de passe"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl text-white font-semibold transition ${
          loading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-green-700"
        }`}
      >
        {loading ? "Mise à jour..." : "Mettre à jour"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;