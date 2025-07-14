// src/components/ui/PhotosyntheseInfos.tsx
import { FlaskConical, BarChart3, SunMedium, CloudDrizzle, Thermometer, Droplets } from "lucide-react"

const PhotosyntheseInfos = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Équation de la photosynthèse */}
      <div className="bg-white p-6 rounded-xl shadow-lg text-left border border-gray-100" data-tutorial="equation">
        <h3 className="font-bold text-xl mb-4 text-green-700 flex items-center gap-2">
          <FlaskConical size={20} /> Équation de la photosynthèse
        </h3>
        <div className="bg-green-50 p-4 rounded-lg text-center mb-4 border border-green-200">
          <code className="text-lg font-mono text-green-800">
            6CO₂ + 6H₂O + lumière → C₆H₁₂O₆ + 6O₂
          </code>
        </div>
        <p className="text-gray-700 leading-relaxed">
          La photosynthèse convertit le CO₂ et l'eau en glucose et oxygène grâce à l'énergie lumineuse.
          Ce processus est vital pour la vie sur Terre et produit l'oxygène que nous respirons.
        </p>
      </div>

      {/* Facteurs limitants */}
      <div className="bg-white p-6 rounded-xl shadow-lg text-left border border-gray-100">
        <h3 className="font-bold text-xl mb-4 text-blue-700 flex items-center gap-2">
          <BarChart3 size={20} /> Facteurs limitants
        </h3>
        <div className="space-y-3">
          {[
            {
              icon: <SunMedium size={20} />,
              factor: "Lumière",
              desc: "Fournit l'énergie nécessaire à la photosynthèse (optimal : 60-80%).",
              color: "yellow",
            },
            {
              icon: <CloudDrizzle size={20} />,
              factor: "CO₂",
              desc: "Gaz absorbé par la plante pour fabriquer du glucose (optimal : 30-60%).",
              color: "gray",
            },
            {
              icon: <Thermometer size={20} />,
              factor: "Température",
              desc: "Influe sur l'activité des enzymes (optimal : 20-30°C).",
              color: "red",
            },
            {
              icon: <Droplets size={20} />,
              factor: "Humidité",
              desc: "Favorise les échanges gazeux au niveau des feuilles (optimal : 50-80%).",
              color: "blue",
            },
          ].map(({ icon, factor, desc, color }) => (
            <div key={factor} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <span className="text-xl">{icon}</span>
              <div>
                <strong className={`text-${color}-600`}>{factor} :</strong>
                <p className="text-sm text-gray-600 mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PhotosyntheseInfos