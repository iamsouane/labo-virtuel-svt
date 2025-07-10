// src/components/settings/ChangePasswordForm.tsx
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface ChangePasswordFormProps {
  onSuccess: () => void; // Appelé après succès
}

const ChangePasswordForm = ({ onSuccess }: ChangePasswordFormProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Mise à jour du mot de passe dans Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (authError) {
      setMessage("Erreur : " + authError.message);
      return;
    }

    // Récupérer l'utilisateur courant
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Erreur lors de la récupération de l'utilisateur.");
      return;
    }

    // Mise à jour du champ must_change_password
    const { error: dbError } = await supabase
      .from("users")
      .update({ must_change_password: false })
      .eq("id", user.id);

    if (dbError) {
      setMessage("Erreur lors de la mise à jour du statut : " + dbError.message);
      return;
    }

    setMessage("Mot de passe mis à jour avec succès !");
    setNewPassword("");
    onSuccess(); // ✅ Notifie le parent
  };

  return (
    <form onSubmit={handlePasswordUpdate} className="space-y-4">
      <label className="block">
        Nouveau mot de passe :
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="block mt-1 border px-3 py-2 rounded w-full"
          required
        />
      </label>
      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-4 rounded"
      >
        Mettre à jour
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
};

export default ChangePasswordForm;