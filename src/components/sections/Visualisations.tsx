import { useState } from 'react';
import DNAViewer from '../views/visualisations/DNAViewer';
import WaterCycleViewer from '../views/visualisations/WaterCycleViewer';
import TectonicViewer from '../views/visualisations/TectonicViewer';

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
    title: 'Collision de plaques tectoniques',
    description: 'Visualise le mouvement des plaques terrestres et leurs collisions.',
    icon: '🌍',
  },
  {
    id: 4,
    title: 'Molécule d\'ADN',
    description: 'Visualise la structure 3D d\'une molécule d\'ADN.',
    icon: '🧬',
  },
];

const Visualisations = () => {
  const [activeViewer, setActiveViewer] = useState<string | null>(null);

  const renderViewer = () => {
    switch (activeViewer) {
      case 'Molécule d\'ADN':
        return <DNAViewer />;
      case 'Cycle de l\'eau':
        return <WaterCycleViewer />;
      case 'Collision de plaques tectoniques':
        return <TectonicViewer />;
      default:
        return null;
    }
  };

  return (
    <section className="py-20 px-6 bg-white text-center max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-12">Visualisations</h2>

      {!activeViewer && (
        <div className="grid gap-8 md:grid-cols-3">
          {visualisationsData.map(({ id, title, description, icon }) => (
            <div
              key={id}
              onClick={() => setActiveViewer(title)}
              className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer"
            >
              <div className="text-5xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      )}

      {activeViewer && (
        <>
          <button
            onClick={() => setActiveViewer(null)}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ← Retour aux visualisations
          </button>
          {renderViewer()}
        </>
      )}
    </section>
  );
};

export default Visualisations;