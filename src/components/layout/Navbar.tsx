// src/components/layout/Navbar.tsx
import { Link } from "react-scroll";

const Navbar = () => {
  return (
    <nav className="w-full absolute top-0 left-0 z-50 px-6 py-4 flex items-center justify-between bg-transparent text-primary font-heading">
      {/* Logo */}
      <div>
        <img
          src="/logo.png"
          alt="Logo SVT Lab"
          className="h-10 md:h-20 object-contain"
        />
      </div>

      {/* Liens de navigation */}
      <div className="space-x-6 hidden md:flex text-base md:text-lg">
        <Link
          to="simulations"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-secondary transition-colors"
        >
          Simulations
        </Link>
        <Link
          to="visualisations"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-secondary transition-colors"
        >
          Visualisations
        </Link>
        <Link
          to="a-propos"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-secondary transition-colors"
        >
          À propos
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;