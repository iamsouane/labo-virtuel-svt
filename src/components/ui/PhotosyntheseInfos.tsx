//src/components/ui/PhotosyntheseInfos
import {
  FlaskConical,
  BarChart3,
  SunMedium,
  CloudDrizzle,
  Thermometer,
  Droplets,
} from "lucide-react";

const PhotosyntheseInfos = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto font-sans text-dark">
      {/* Équation de la photosynthèse */}
      <div
        className="bg-light p-6 rounded-2xl shadow-lg text-left border border-accent"
        data-tutorial="equation"
      >
        <h3 className="font-heading font-bold text-xl mb-4 text-primary flex items-center gap-2">
          <FlaskConical size={20} /> Équation de la photosynthèse
        </h3>
        <div className="bg-accent/10 p-4 rounded-lg text-center mb-4 border border-accent">
          <code className="text-lg font-mono text-primary">
            6CO₂ + 6H₂O + lumière → C₆H₁₂O₆ + 6O₂
          </code>
        </div>
        <p className="leading-relaxed">
          La photosynthèse convertit le CO₂ et l'eau en glucose et oxygène grâce à l'énergie
          lumineuse. Ce processus est vital pour la vie sur Terre et produit l'oxygène que nous
          respirons.
        </p>
      </div>

      {/* Facteurs limitants */}
      <div className="bg-light p-6 rounded-2xl shadow-lg text-left border border-accent">
        <h3 className="font-heading font-bold text-xl mb-4 text-secondary flex items-center gap-2">
          <BarChart3 size={20} /> Facteurs limitants
        </h3>
        <div className="space-y-3">
          {[
            {
              icon: <SunMedium size={20} />,
              factor: "Lumière",
              desc: "Fournit l'énergie nécessaire à la photosynthèse (optimal : 60-80%).",
              color: "primary",
            },
            {
              icon: <CloudDrizzle size={20} />,
              factor: "CO₂",
              desc: "Gaz absorbé par la plante pour fabriquer du glucose (optimal : 30-60%).",
              color: "secondary",
            },
            {
              icon: <Thermometer size={20} />,
              factor: "Température",
              desc: "Influe sur l'activité des enzymes (optimal : 20-30°C).",
              color: "accent",
            },
            {
              icon: <Droplets size={20} />,
              factor: "Humidité",
              desc: "Favorise les échanges gazeux au niveau des feuilles (optimal : 50-80%).",
              color: "dark",
            },
          ].map(({ icon, factor, desc, color }) => (
            <div
              key={factor}
              className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/30"
            >
              <span className="text-xl">{icon}</span>
              <div>
                <strong className={`text-${color}`}>
                  {factor} :
                </strong>
                <p className="text-sm text-dark/70 mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotosyntheseInfos;