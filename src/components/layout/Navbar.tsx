// src/components/layout/Navbar.tsx
import { useState } from "react";
import { Link } from "react-scroll";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { id: "simulations", label: "Simulations" },
    { id: "visualisations", label: "Visualisations" },
    { id: "a-propos", label: "À propos" },
  ];

  return (
    <nav
      className={`
        w-full
        relative bottom-20 left-0
        z-50
        px-6 py-4
        flex items-center justify-between
        bg-transparent text-primary font-heading

        md:relative
        md:-translate-y-4
        md:px-8 md:py-3
        transition-transform
      `}
    >
      {/* Logo */}
      <div>
        <img
          src="/logo.png"
          alt="Logo SVT Lab"
          className="h-10 md:h-20 object-contain"
        />
      </div>

      {/* Liens desktop */}
      <div className="hidden md:flex space-x-6 text-base md:text-lg">
        {sections.map(({ id, label }) => (
          <Link
            key={id}
            to={id}
            smooth={true}
            duration={500}
            className="cursor-pointer hover:text-secondary transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Hamburger mobile */}
      <button
        className="md:hidden focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menu mobile */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col md:hidden">
          {sections.map(({ id, label }) => (
            <Link
              key={id}
              to={id}
              smooth={true}
              duration={500}
              className="py-4 text-lg cursor-pointer hover:text-secondary text-center border-b border-gray-200"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;