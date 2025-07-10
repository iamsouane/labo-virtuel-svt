// src/pages/Accueil.tsx
import Hero from "../components/sections/Hero";
import APropos from "../components/sections/APropos";
import Fonctionnalites from "../components/sections/Fonctionnalites";
import Simulations from "../components/sections/Simulations";
import Visualisations from "../components/sections/Visualisations";
import Technologies from "../components/sections/Technologies";
import CTA from "../components/sections/CTA";
import AuthForm from "../components/sections/AuthForm";
import Footer from "../components/sections/Footer";
import AccueilUtilisateur from "../components/views/AccueilUtilisateur";
import type { Profil } from "../types";

interface AccueilProps {
  user: Profil | null;
}

const Accueil = ({ user }: AccueilProps) => {
  // Si connecté, afficher uniquement le dashboard
  if (user) {
    return <AccueilUtilisateur user={user} onLogout={() => window.location.reload()} />;
  }

  // Sinon afficher toutes les sections de la page d’accueil
  return (
    <>
      <Hero />
      <APropos />
      <Fonctionnalites />
      <Simulations user={user} />
      <Visualisations />
      <Technologies />
      <CTA />
      <section id="auth-form">
        <AuthForm onAuthSuccess={() => window.location.reload()} />
      </section>
      <Footer />
    </>
  );
};

export default Accueil;