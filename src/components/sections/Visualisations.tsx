const visualisationsData = [
  {
    id: 1,
    title: 'Visualisation du système nerveux',
    description: 'Comprends le fonctionnement du système nerveux central et périphérique.',
    icon: '🧠',
  },
  {
    id: 2,
    title: 'Cycle de l\'eau',
    description: 'Observe les différentes étapes du cycle de l\'eau dans la nature.',
    icon: '💧',
  },
  {
    id: 3,
    title: 'Écosystèmes et biodiversité',
    description: 'Explore les interactions entre espèces dans différents écosystèmes.',
    icon: '🌳',
  },
];

const Visualisations = () => {
  return (
    <section className="py-20 px-6 bg-white text-center max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-12">Visualisations</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {visualisationsData.map(({ id, title, description, icon }) => (
          <div
            key={id}
            className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer"
          >
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Visualisations;