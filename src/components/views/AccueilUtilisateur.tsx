// src/components/views/AccueilUtilisateur.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Profil } from "../../types";
import ChangePasswordForm from "../settings/ChangePasswordForm";
import { supabase } from "../../lib/supabaseClient";
import { notifySuccess } from "../../lib/notifications";

import DashboardAdmin from "../dashboards/DashboardAdmin";
import DashboardProfesseur from "../dashboards/DashboardProfesseur";
import DashboardEleve from "../dashboards/DashboardEleve";

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

  const handlePasswordChanged = () => {
    setLocalUser({ ...localUser, must_change_password: false });
    notifySuccess("Votre mot de passe a été mis à jour avec succès !");
    if (window.location.pathname !== "/dashboard") {
      navigate("/dashboard");
    }
  };

  if (localUser.must_change_password) {
    return (
      <section className="py-20 px-6 text-center max-w-xl mx-auto">
        <p className="mb-4 text-red-600 font-semibold">
          Vous devez changer votre mot de passe avant de continuer.
        </p>
        <ChangePasswordForm onSuccess={handlePasswordChanged} />
      </section>
    );
  }

  return (
    <section className="py-20 px-6 text-center max-w-5xl mx-auto">
      {localUser.role === "ADMIN" && (
        <DashboardAdmin user={localUser} onLogout={handleLogout} />
      )}
      {localUser.role === "PROFESSEUR" && (
        <DashboardProfesseur user={localUser} onLogout={handleLogout} />
      )}
      {localUser.role === "ELEVE" && (
        <DashboardEleve user={localUser} onLogout={handleLogout} />
      )}
    </section>
  );
};

export default AccueilUtilisateur;