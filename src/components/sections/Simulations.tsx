import { useState } from 'react';

const simulationsData = [
  {
    id: 1,
    title: 'Simulation de la cellule',
    description: "Explore la structure et le fonctionnement d'une cellule en 3D interactive.",
    icon: '🧬',
  },
  {
    id: 2,
    title: 'Visualisation du système digestif',
    description: "Découvre le trajet des aliments dans le corps humain grâce à une animation fluide.",
    icon: '🦠',
  },
  {
    id: 3,
    title: 'Expérience sur la photosynthèse',
    description: "Simule la photosynthèse et observe l'impact de la lumière sur les plantes.",
    icon: '🌿',
  },
  {
    id: 4,
    title: 'Sélection naturelle',
    description: "Explore l'évolution des populations avec cette simulation interactive PhET.",
    icon: '🦎',
  },
];

const SimulationSelectionNaturelle = () => (
  <section className="py-10">
    <h3 className="text-2xl font-semibold mb-4">Simulation : Sélection naturelle</h3>
    <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg border border-gray-300 overflow-hidden">
      <iframe
        src="https://phet.colorado.edu/sims/html/natural-selection/latest/natural-selection_fr.html"
        allowFullScreen
        title="Simulation Sélection Naturelle"
        className="w-full h-full"
      />
    </div>
  </section>
);

const SimulationPhotosynthese = () => (
  <section className="py-10">
    <h3 className="text-2xl font-semibold mb-4">Expérience sur la photosynthèse</h3>
    <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg border border-gray-300 overflow-hidden">
      <iframe
        src="https://leosiiman.neocities.org/lab-rate-of-photosynthesis/photolab-individual"
        allowFullScreen
        title="Simulation Photosynthèse"
        className="w-full h-full"
      />
    </div>
  </section>
);

const Simulations = () => {
  const [activeSim, setActiveSim] = useState<string | null>(null);

  const renderActiveSimulation = () => {
    switch (activeSim) {
      case 'Sélection naturelle':
        return <SimulationSelectionNaturelle />;
      case 'Expérience sur la photosynthèse':
        return <SimulationPhotosynthese />;
      default:
        return null;
    }
  };

  return (
    <section className="py-20 px-6 bg-gray-50 text-center max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-12">Simulations</h2>

      {!activeSim && (
        <div className="grid gap-8 md:grid-cols-3">
          {simulationsData.map(({ id, title, description, icon }) => (
            <div
              key={id}
              onClick={() => {
                if (title === 'Sélection naturelle' || title === 'Expérience sur la photosynthèse') {
                  setActiveSim(title);
                }
              }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer select-none"
            >
              <div className="text-5xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      )}

      {activeSim && (
        <>
          <button
            onClick={() => setActiveSim(null)}
            className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            ← Retour aux simulations
          </button>

          {renderActiveSimulation()}
        </>
      )}
    </section>
  );
};

export default Simulations;