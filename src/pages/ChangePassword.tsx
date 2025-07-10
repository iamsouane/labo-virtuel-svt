// src/pages/ChangePassword.tsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { notifyError } from "../lib/notifications";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

const ChangePasswordForm = ({ onSuccess }: ChangePasswordFormProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Vérification basique
    if (newPassword.trim().length < 6) {
      notifyError("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    // 2. Mise à jour dans Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (authError) {
      notifyError("Erreur : " + authError.message);
      setLoading(false);
      return;
    }

    // 3. Récupérer l'utilisateur
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      notifyError("Erreur lors de la récupération de l'utilisateur.");
      setLoading(false);
      return;
    }

    // 4. Mise à jour du champ `must_change_password`
    const { error: dbError } = await supabase
      .from("users")
      .update({ must_change_password: false })
      .eq("id", user.id);

    if (dbError) {
      notifyError("Erreur de mise à jour : " + dbError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess?.(); // Appelé une seule fois, aucune notification ici
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

export default ChangePasswordForm;