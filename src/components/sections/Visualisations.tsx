//srccomponents/sections/Visualisations
import { useState } from "react";
import WaterCycleViewer from "../views/WaterCycleViewer";
import TectonicViewer from "../views/TectonicViewer";
import HeartViewer from "../views/HeartViewer";
import BrainViewer from "../views/BrainViewer";
import AbdomenViewer from "../views/AbdomenViewer";
import VolcanViewer from "../views/VolcanViewer";
import { ArrowLeft, Flame, Brain, Droplets, Globe, Heart, User } from "lucide-react";

const visualisationsData = [
  {
    id: 1,
    title: "Système nerveux",
    description: "Explorez le fonctionnement du système nerveux central et périphérique en 3D.",
    icon: <Brain className="w-6 h-6" />,
    viewer: "Visualisation du système nerveux",
    color: "bg-purple-100 text-purple-800"
  },
  {
    id: 2,
    title: "Cycle de l'eau",
    description: "Visualisez les différentes étapes du cycle hydrologique.",
    icon: <Droplets className="w-6 h-6" />,
    viewer: "Cycle de l'eau",
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: 3,
    title: "Tectonique des plaques",
    description: "Observez le mouvement des plaques terrestres et leurs interactions.",
    icon: <Globe className="w-6 h-6" />,
    viewer: "Collision de plaques tectoniques",
    color: "bg-green-100 text-green-800"
  },
  {
    id: 4,
    title: "Cœur humain",
    description: "Découvrez l'anatomie cardiaque en détail.",
    icon: <Heart className="w-6 h-6" />,
    viewer: "Visualisation du cœur humain",
    color: "bg-red-100 text-red-800"
  },
  {
    id: 5,
    title: "Abdomen",
    description: "Explorez les organes de la cavité abdominale.",
    icon: <User className="w-6 h-6" />,
    viewer: "Anatomie de l'abdomen",
    color: "bg-yellow-100 text-yellow-800"
  },
  {
    id: 6,
    title: "Volcanologie",
    description: "Comprenez les mécanismes de formation volcanique.",
    icon: <Flame className="w-6 h-6" />,
    viewer: "Formation d'un volcan",
    color: "bg-orange-100 text-orange-800"
  },
];

const Visualisations = () => {
  const [activeViewer, setActiveViewer] = useState<string | null>(null);

  const renderViewer = () => {
    switch (activeViewer) {
      case "Cycle de l'eau":
        return <WaterCycleViewer />;
      case "Collision de plaques tectoniques":
        return <TectonicViewer />;
      case "Visualisation du cœur humain":
        return <HeartViewer />;
      case "Visualisation du système nerveux":
        return <BrainViewer />;
      case "Anatomie de l'abdomen":
        return <AbdomenViewer />;
      case "Formation d'un volcan":
        return <VolcanViewer />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-primary">
            {activeViewer ? activeViewer : "Visualisations scientifiques"}
          </h1>
          <p className="text-dark/70 mt-2">
            {activeViewer ? "Explorez en détail" : "Sélectionnez une visualisation interactive"}
          </p>
        </div>

        {!activeViewer ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visualisationsData.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveViewer(item.viewer)}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group`}
              >
                <div className="p-6">
                  <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-dark mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-dark/80 font-sans">{item.description}</p>
                </div>
                <div className="px-6 pb-6">
                  <button className="text-primary font-medium text-sm flex items-center gap-1 group-hover:underline">
                    Explorer
                    <ArrowLeft className="w-4 h-4 transform rotate-180" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setActiveViewer(null)}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Retour aux visualisations
            </button>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              {renderViewer()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualisations;