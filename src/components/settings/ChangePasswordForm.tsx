// src/components/settings/ChangePasswordForm.tsx
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { notifyError, notifySuccess } from "../../lib/notifications";

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

const ChangePasswordForm = ({ onSuccess }: ChangePasswordFormProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validation manuelle
    if (!newPassword || newPassword.trim().length < 6) {
      return notifyError("Le mot de passe doit contenir au moins 6 caractères.");
    }

    setIsLoading(true);

    try {
      // 🔐 Mise à jour dans Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({ password: newPassword });
      if (authError) {
        throw new Error(authError.message);
      }

      // 👤 Récupération de l'utilisateur courant
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Utilisateur non authentifié.");
      }

      // ✅ Mise à jour de `must_change_password` dans la table `users`
      const { error: dbError } = await supabase
        .from("users")
        .update({ must_change_password: false })
        .eq("id", user.id);
      if (dbError) {
        throw new Error("Erreur lors de la mise à jour du profil.");
      }

      setNewPassword("");
      notifySuccess("Mot de passe mis à jour avec succès !");
      onSuccess();
    } catch (error: any) {
      notifyError("Erreur : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-left font-medium text-gray-700">
        Nouveau mot de passe :
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="******"
          className="block mt-2 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
      </label>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full disabled:opacity-50"
      >
        {isLoading ? "Mise à jour..." : "Mettre à jour"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;