import { useState } from 'react';
import WaterCycleViewer from '../views/WaterCycleViewer';
import TectonicViewer from '../views/TectonicViewer';
import HeartViewer from '../views/HeartViewer';
import BrainViewer from '../views/BrainViewer';
import AbdomenViewer from '../views/AbdomenViewer';
import VolcanViewer from '../views/VolcanViewer';
import { ArrowLeft, Flame, Brain, Droplets, Globe, Heart, User } from 'lucide-react';

const visualisationsData = [
  {
    id: 1,
    title: 'Visualisation du système nerveux',
    description: 'Comprends le fonctionnement du système nerveux central et périphérique.',
    icon: <Brain className="w-10 h-10 text-blue-600" />,
  },
  {
    id: 2,
    title: "Cycle de l'eau",
    description: "Observe les différentes étapes du cycle de l'eau dans la nature.",
    icon: <Droplets className="w-10 h-10 text-sky-500" />,
  },
  {
    id: 3,
    title: 'Collision de plaques tectoniques',
    description: 'Visualise le mouvement des plaques terrestres et leurs collisions.',
    icon: <Globe className="w-10 h-10 text-emerald-600" />,
  },
  {
    id: 4,
    title: 'Visualisation du cœur humain',
    description: 'Explore le cœur humain en 3D et découvre son anatomie.',
    icon: <Heart className="w-10 h-10 text-red-600" />,
  },
  {
    id: 5,
    title: 'Anatomie de l’abdomen',
    description: 'Explore les organes internes situés dans la cavité abdominale.',
    icon: <User className="w-10 h-10 text-indigo-600" />,
  },
  {
    id: 6,
    title: 'Formation d’un volcan',
    description: 'Observe les différentes étapes de formation d’un volcan.',
    icon: <Flame className="w-10 h-10 text-orange-600" />,
  },
];

const Visualisations = () => {
  const [activeViewer, setActiveViewer] = useState<string | null>(null);

  const renderViewer = () => {
    switch (activeViewer) {
      case "Cycle de l'eau":
        return <WaterCycleViewer />;
      case 'Collision de plaques tectoniques':
        return <TectonicViewer />;
      case 'Visualisation du cœur humain':
        return <HeartViewer />;
      case 'Visualisation du système nerveux':
        return <BrainViewer />;
      case 'Anatomie de l’abdomen':
        return <AbdomenViewer />;
      case 'Formation d’un volcan':
        return <VolcanViewer />;
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
              className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer select-none"
            >
              <div className="flex items-center justify-center mb-4">
                {icon}
              </div>
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
            className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux visualisations
          </button>
          {renderViewer()}
        </>
      )}
    </section>
  );
};

export default Visualisations;