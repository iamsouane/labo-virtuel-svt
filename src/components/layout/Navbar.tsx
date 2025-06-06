import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-700">
          Sunu-Labo
        </Link>
        <div className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">
            Accueil
          </Link>
          <Link to="/simulations" className="text-gray-700 hover:text-green-600 font-medium">
            Simulations
          </Link>
          <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow">
            Connexion
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;