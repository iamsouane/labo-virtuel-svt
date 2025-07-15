//src/components/auth/RequirePasswordChange
import { Navigate } from "react-router-dom";
import type { Profil } from "../../types";
import type { ReactNode } from "react";

interface RequirePasswordChangeProps {
  user: Profil | null;
  children: ReactNode;
}

/**
 * Redirige l'utilisateur vers la page de changement de mot de passe
 * s'il est connecté et que le champ `must_change_password` est activé.
 */
const RequirePasswordChange = ({ user, children }: RequirePasswordChangeProps) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.must_change_password) {
    return <Navigate to="/change-password" replace />;
  }

  return <>{children}</>;
};

export default RequirePasswordChange;