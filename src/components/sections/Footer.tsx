import { Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer id="footer" className="bg-dark text-light py-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <p className="text-sm font-sans text-center md:text-left">
          &copy; {new Date().getFullYear()} Laboratoire Virtuel SVT. Tous droits réservés.
        </p>
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-3 md:space-y-0 font-medium text-center md:text-left">
          <a
            href="https://github.com/iamsouane"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center md:justify-start gap-1 hover:text-secondary transition-colors"
            aria-label="GitHub"
          >
            <Github size={20} />
            GitHub
          </a>
          <a
            href="mailto:contact@labovirtuelsvt.fr"
            className="flex items-center justify-center md:justify-start gap-1 hover:text-secondary transition-colors"
            aria-label="Email"
          >
            <Mail size={20} />
            contact@labovirtuelsvt.com
          </a>
          <a
            href="/#"
            className="hover:text-secondary transition-colors"
            aria-label="Mentions légales"
          >
            Mentions légales
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;