const Fonctionnalites = () => (
  <section id="fonctionnalites" className="py-20 px-6 bg-gray-100 text-center">
    <h2 className="text-3xl font-semibold mb-10">Fonctionnalités principales</h2>
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {[
        {
          title: 'Simulations interactives',
          desc: 'Utilisation de Unity, HTML5 ou ThreeJS pour simuler des expériences scientifiques.',
        },
        {
          title: 'Gestion des classes',
          desc: 'Les administrateurs peuvent créer des classes et assigner professeurs et élèves.',
        },
        {
          title: 'Suivi de progression',
          desc: 'Les professeurs peuvent suivre l\'activité et les résultats des élèves.',
        },
      ].map((item, idx) => (
        <div key={idx} className="p-6 bg-white rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Fonctionnalites;