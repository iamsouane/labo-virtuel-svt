// src/components/sections/APropos.tsx
import { Github, Linkedin, Twitter } from "lucide-react";

const APropos = () => (
  <section id="a-propos" className="py-20 px-6 bg-light text-center text-dark">
    <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-10">
      À propos du projet
    </h2>
    <p className="max-w-3xl mx-auto text-lg font-sans leading-relaxed mb-12">
      Ce laboratoire virtuel permet aux élèves de Seconde de réaliser des simulations interactives en SVT,
      encadrés par leurs enseignants. Il facilite l’apprentissage grâce à une approche visuelle, pratique et
      accessible à distance.
    </p>

    <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-5xl mx-auto">
      {/* Carte 1 - Toi */}
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border-2 border-transparent hover:border-primary/80 hover:scale-105 transform transition-all duration-300">
        <img
          src="/sis.jpeg"
          alt="Ismaïla"
          className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
        />
        <h3 className="text-xl font-bold text-primary">Serigne Ismaïla SOUANE</h3>
        <p className="text-sm text-secondary mb-3">Développeur Fullstack</p>
        <p className="text-sm mb-4">
          Spécialisé dans la logique serveur, l’authentification et la gestion des données pédagogiques.        
        </p>
        <div className="flex justify-center gap-4 text-primary">
          <a
            href="https://github.com/iamsouane"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-800 transition"
          >
            <Github size={24} />
          </a>
          <a
            href="https://twitter.com/iamsouane"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-800 transition"
          >
            <Twitter size={24} />
          </a>
        </div>
      </div>

      {/* Carte 2 - Binôme */}
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border-2 border-transparent hover:border-secondary hover:scale-105 transform transition-all duration-300">
        <img
          src="/hrs.jpeg"
          alt="Hadia Rougui SOW"
          className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
        />
        <h3 className="text-xl font-bold text-primary">Hadia Rougui SOW</h3>
        <p className="text-sm text-secondary mb-3">Développeur Frontend</p>
        <p className="text-sm mb-4">
          Spécialisée dans le design, la conception graphique et l'intégration de maquette.
        </p>
        <div className="flex justify-center gap-4 text-primary">
          <a
            href="https://github.com/binome"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-800 transition"
          >
            <Github size={24} />
          </a>
          <a
            href="https://linkedin.com/in/binome"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-800 transition"
          >
            <Linkedin size={24} />
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default APropos;