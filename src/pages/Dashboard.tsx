//src/pages/Dashboard.tsx
import AccueilUtilisateur from "../components/views/AccueilUtilisateur";
import type { Profil } from "../types";

const Dashboard = ({ user, onLogout }: { user: Profil; onLogout: () => void }) => {
  return <AccueilUtilisateur user={user} onLogout={onLogout} />;
};

export default Dashboard;