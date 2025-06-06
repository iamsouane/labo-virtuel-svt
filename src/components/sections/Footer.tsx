const Footer = () => {
  return (
    <footer id="footer" className="bg-gray-900 text-gray-300 py-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Laboratoire Virtuel SVT. Tous droits réservés.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="https://github.com/tonprofil" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition"
            aria-label="GitHub"
          >
            GitHub
          </a>
          <a
            href="mailto:contact@labovirtuelsvt.fr"
            className="hover:text-white transition"
            aria-label="Email"
          >
            contact@labovirtuelsvt.fr
          </a>
          <a
            href="/mentions-legales"
            className="hover:text-white transition"
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