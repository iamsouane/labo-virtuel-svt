//src/components/auth/RequirePasswordChange.tsx
import { Navigate } from "react-router-dom";
import type { Profil } from "../../types";
import type { JSX } from "react";

interface Props {
  user: Profil | null;
  children: JSX.Element;
}

/**
 * Si l'utilisateur est connecté mais doit changer son mot de passe,
 * on le redirige vers la page de changement de mot de passe.
 */
const RequirePasswordChange = ({ user, children }: Props) => {
  if (!user) return <Navigate to="/" replace />;
  if (user.must_change_password) return <Navigate to="/change-password" replace />;
  return children;
};

export default RequirePasswordChange;