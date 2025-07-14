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
    title: "Visualisation du système nerveux",
    description: "Comprends le fonctionnement du système nerveux central et périphérique.",
    icon: <Brain className="w-10 h-10 text-primary" />,
  },
  {
    id: 2,
    title: "Cycle de l'eau",
    description: "Observe les différentes étapes du cycle de l'eau dans la nature.",
    icon: <Droplets className="w-10 h-10 text-secondary" />,
  },
  {
    id: 3,
    title: "Collision de plaques tectoniques",
    description: "Visualise le mouvement des plaques terrestres et leurs collisions.",
    icon: <Globe className="w-10 h-10 text-accent" />,
  },
  {
    id: 4,
    title: "Visualisation du cœur humain",
    description: "Explore le cœur humain en 3D et découvre son anatomie.",
    icon: <Heart className="w-10 h-10 text-secondary" />,
  },
  {
    id: 5,
    title: "Anatomie de l’abdomen",
    description: "Explore les organes internes situés dans la cavité abdominale.",
    icon: <User className="w-10 h-10 text-primary" />,
  },
  {
    id: 6,
    title: "Formation d’un volcan",
    description: "Observe les différentes étapes de formation d’un volcan.",
    icon: <Flame className="w-10 h-10 text-secondary" />,
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
      case "Anatomie de l’abdomen":
        return <AbdomenViewer />;
      case "Formation d’un volcan":
        return <VolcanViewer />;
      default:
        return null;
    }
  };

  return (
    <section className="py-20 px-6 bg-light text-center text-dark w-full max-w-full">
      <h2 className="text-3xl font-heading font-bold text-primary mb-12">Visualisations</h2>

      {!activeViewer && (
        <div className="grid gap-8 md:grid-cols-3 w-full">
          {visualisationsData.map(({ id, title, description, icon }) => (
            <div
              key={id}
              onClick={() => setActiveViewer(title)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer select-none p-6"
            >
              <div className="flex items-center justify-center mb-4">{icon}</div>
              <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
              <p className="text-secondary">{description}</p>
            </div>
          ))}
        </div>
      )}

      {activeViewer && (
        <>
          <button
            onClick={() => setActiveViewer(null)}
            className="mb-6 px-6 py-3 bg-primary text-light rounded-xl hover:bg-secondary transition flex items-center justify-center gap-2 mx-auto font-semibold font-sans shadow-md"
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