import Hero from '../components/sections/Hero';
import APropos from '../components/sections/APropos';
import Fonctionnalites from '../components/sections/Fonctionnalites';
import Simulations from '../components/sections/Simulations';
import Visualisations from '../components/sections/Visualisations';
import Technologies from '../components/sections/Technologies';
import CTA from '../components/sections/CTA';
import MainLayout from '../components/layout/MainLayout';
import AuthForm from '../components/sections/AuthForm';
import Footer from '../components/sections/Footer';

const Accueil = () => {
  return (
    <MainLayout>
      <Hero />
      <APropos />
      <Fonctionnalites />
      <Simulations />
      <Visualisations />
      <Technologies />
      <CTA />
      <AuthForm />
      <Footer />
    </MainLayout>
  );
};

export default Accueil;