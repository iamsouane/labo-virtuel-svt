// src/pages/ChangePassword.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

    // Mise à jour du champ must_change_password dans la table users
    const { error: dbError } = await supabase
      .from("users")
      .update({ must_change_password: false })
      .eq("id", user.id);

    if (dbError) {
      setMessage("Erreur lors de la mise à jour du statut : " + dbError.message);
      return;
    }

    // Redirection vers le dashboard après succès
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handlePasswordUpdate}
        className="space-y-6 bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Changer votre mot de passe
        </h2>

        <label className="block">
          <span className="text-gray-700 font-medium">Nouveau mot de passe</span>
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
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
        >
          Mettre à jour
        </button>

        {message && (
          <p className={`text-sm text-center mt-2 ${message.startsWith("Erreur") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;