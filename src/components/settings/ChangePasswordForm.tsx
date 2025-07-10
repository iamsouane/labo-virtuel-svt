// src/components/settings/ChangePasswordForm.tsx
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

const ChangePasswordForm = ({ onSuccess }: ChangePasswordFormProps) => {
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔐 Mise à jour du mot de passe dans Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({ password: newPassword });
    if (authError) return;

    // 👤 Récupération de l'utilisateur courant
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return;

    // ✅ Mise à jour de must_change_password
    const { error: dbError } = await supabase
      .from("users")
      .update({ must_change_password: false })
      .eq("id", user.id);
    if (dbError) return;

    setNewPassword("");
    onSuccess(); // 👌 notify le parent
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
        Mettre à jour
      </button>
    </form>
  );
};

export default ChangePasswordForm;