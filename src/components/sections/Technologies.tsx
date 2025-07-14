const technologiesList = [
  {
    name: "HTML5 & CSS3",
    description: "Technologies standards pour structurer et styliser les pages web modernes.",
  },
  {
    name: "React",
    description: "Bibliothèque JavaScript pour construire des interfaces utilisateur interactives et réactives.",
  },
  {
    name: "Three.js",
    description: "Bibliothèque JS pour créer et afficher des animations 3D dans le navigateur via WebGL.",
  },
  {
    name: "TypeScript",
    description: "Superset de JavaScript ajoutant le typage statique pour un code plus robuste et maintenable.",
  },
  {
    name: "Tailwind CSS",
    description: "Framework CSS utilitaire permettant une stylisation rapide et responsive.",
  },
  {
    name: "Supabase",
    description: "Backend open-source fournissant base de données, authentification, et API temps réel.",
  },
];

const Technologies = () => (
  <section
    id="technologies"
    className="py-20 px-6 bg-light text-center text-dark max-w-full w-full"
  >
    <h2 className="text-3xl font-heading font-bold text-primary mb-10">Technologies utilisées</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
      {technologiesList.map(({ name, description }) => (
        <div
          key={name}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition cursor-default"
          title={description} // Affiche la description au survol
        >
          <h3 className="text-xl font-semibold text-secondary mb-2">{name}</h3>
          <p className="text-gray-700 text-sm">{description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Technologies;