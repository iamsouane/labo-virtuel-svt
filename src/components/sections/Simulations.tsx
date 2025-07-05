//src/components/sections/Simulation
import { useState } from 'react';
import SimulationSelectionNaturelle from '../views/simulations/SimulationSelectionNaturelle';
import SimulationPhotosynthese from '../views/SimulationPhotosynthese';
import SimulationEnergie from '../views/simulations/SimulationEnergie';
import SimulationPollution from '../views/simulations/SimulationPollution';
import { Leaf, Rabbit, Zap, Factory } from "lucide-react"

const simulationsData = [
  {
    id: 1,
    title: 'Expérience sur la photosynthèse',
    description: "Simule la photosynthèse et observe l'impact de la lumière sur les plantes.",
    icon: <Leaf className="w-6 h-6 text-green-600" />,
  },
  {
    id: 2,
    title: 'Sélection naturelle',
    description: "Explore l'évolution des populations avec cette simulation interactive PhET.",
    icon: <Rabbit className="w-6 h-6 text-amber-600" />,
  },
  {
    id: 3,
    title: "Formes et transformations de l'énergie",
    description: "Observe comment l'énergie circule et change dans différents systèmes avec cette simulation interactive PhET.",
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
  },
  {
    id: 4,
    title: "Pollution de l'air",
    description: "Analyse les effets des activités humaines sur la qualité de l'air avec cette simulation interactive Go-Lab.",
    icon: <Factory className="w-6 h-6 text-gray-500" />,
  },
];

const Simulations = () => {
  const [activeSim, setActiveSim] = useState<string | null>(null);

  const renderActiveSimulation = () => {
    switch (activeSim) {
      case 'Sélection naturelle':
        return <SimulationSelectionNaturelle />;
      case 'Expérience sur la photosynthèse':
        return <SimulationPhotosynthese />;
      case "Formes et transformations de l'énergie":
        return <SimulationEnergie />;
      case "Pollution de l'air":
        return <SimulationPollution />;
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
              onClick={() => setActiveSim(title)}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer select-none"
            >
              <div className="flex items-center justify-center text-5xl mb-4">
                {icon}
              </div>
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