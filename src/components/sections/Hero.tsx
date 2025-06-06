import { Link } from 'react-router-dom';

const Hero = () => (
  <section id="hero" className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 flex items-center justify-center text-center px-4">
    <div>
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Laboratoire Virtuel SVT</h1>
      <p className="text-lg md:text-xl mb-6">
        Une plateforme interactive pour les classes de Seconde
      </p>
      <Link
        to="/login"
        className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition"
      >
        Accéder au labo
      </Link>
    </div>
  </section>
);

export default Hero;