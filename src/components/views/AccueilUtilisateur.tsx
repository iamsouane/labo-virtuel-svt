// src/components/views/AccueilUtilisateur.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Profil } from "../../types";
import ChangePasswordForm from "../settings/ChangePasswordForm";
import { supabase } from "../../lib/supabaseClient";

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
    navigate("/"); // Redirige vers la page d'accueil
  };

  const handlePasswordChanged = () => {
    // Mise à jour locale du statut une fois le mot de passe changé
    setLocalUser({ ...localUser, must_change_password: false });
  };

  return (
    <section className="py-20 px-6 text-center max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Bienvenue</h1>
      <p className="text-2xl text-gray-700 mb-6">
        {localUser.role === "ADMIN" && "Administrateur : "}
        {localUser.role === "PROFESSEUR" && "Professeur : "}
        {localUser.role === "ELEVE" && "Élève : "}
        <span className="font-semibold">
          {localUser.prenom} {localUser.nom}
        </span>
      </p>

      {localUser.must_change_password ? (
        <>
          <p className="mb-4 text-red-600 font-semibold">
            Vous devez changer votre mot de passe avant de continuer.
          </p>
          <ChangePasswordForm onSuccess={handlePasswordChanged} />
        </>
      ) : (
        <p className="text-green-600 font-medium mb-6">
          Votre mot de passe a été mis à jour avec succès !
        </p>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
      >
        Se déconnecter
      </button>
    </section>
  );
};

export default AccueilUtilisateur;