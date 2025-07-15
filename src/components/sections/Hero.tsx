// src/components/sections/Hero.tsx
import { Link } from "react-scroll";
import Navbar from "../layout/Navbar";

const Hero = () => (
  <section
    id="hero"
    className="min-h-screen bg-gradient-to-br from-accent via-white to-secondary flex flex-col items-center justify-center text-center px-6 md:px-12 relative"
  >
    {/* Navbar intégrée en haut */}
    <Navbar />

    {/* Contenu principal du Hero */}
    <div className="mt-16 md:mt-24 max-w-2xl px-4 md:px-0">
      <h1 className="text-3xl md:text-6xl font-heading font-bold text-primary mb-6">
        Laboratoire Virtuel SVT
      </h1>
      <p className="text-base md:text-xl text-dark mb-8 font-sans">
        Une plateforme interactive pour les classes de Seconde
      </p>
      <Link
        to="auth-form"
        smooth={true}
        duration={500}
        className="inline-block bg-primary hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition cursor-pointer"
      >
        Accéder au labo
      </Link>
    </div>
  </section>
);

export default Hero;