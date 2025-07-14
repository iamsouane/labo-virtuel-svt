// src/components/sections/Fonctionnalites.tsx
const Fonctionnalites = () => (
  <section
    id="fonctionnalites"
    className="py-20 px-6 bg-light text-center text-dark"
  >
    <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-12">
      Fonctionnalités principales
    </h2>
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {[
        {
          title: 'Simulations interactives',
          desc: 'Utilisation de HTML5 et ThreeJS pour simuler des expériences scientifiques.',
        },
        {
          title: 'Visualisations 3D',
          desc: 'Exploration de modèles 3D interactifs pour une meilleure compréhension des concepts.',
        },
        {
          title: 'Gestion des classes',
          desc: 'Les administrateurs peuvent créer des classes et assigner professeurs et élèves.',
        },
        {
          title: 'Suivi de progression',
          desc: "Les professeurs peuvent suivre l'activité et les résultats des élèves.",
        },
      ].map((item, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent"
        >
          <h3 className="text-xl font-semibold mb-3 text-primary font-heading">
            {item.title}
          </h3>
          <p className="text-base font-sans leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Fonctionnalites;