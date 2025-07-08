// src/components/pollution/HealthEffects.tsx
import { FlaskConical, Globe, Lightbulb, Users } from "lucide-react";

interface HealthEffectsProps {
  aqiStatus: {
    effects: { icon: React.ReactNode; text: string }[];
    environmentalEffects: { icon: React.ReactNode; text: string }[];
    recommendations: string[];
  };
}

export default function HealthEffects({ aqiStatus }: HealthEffectsProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex-1">
      <h3 className="flex items-center gap-2 text-red-700 font-bold text-xl mb-6">
        <FlaskConical size={24} />
        Effets sur la Santé et l'Environnement
      </h3>

      <section className="mb-6">
        <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
          <Users className="w-5 h-5 text-gray-600" />
          Effets sur la santé humaine
        </h4>
        <ul className="space-y-2 text-gray-700">
          {aqiStatus.effects.map((effect, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-[3px]">{effect.icon}</span>
              <p className="leading-relaxed">{effect.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
          <Globe size={20} className="text-gray-600" />
          Effets sur l'environnement
        </h4>
        <ul className="space-y-2 text-gray-700">
          {aqiStatus.environmentalEffects.map((effect, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-[3px]">{effect.icon}</span>
              <p className="leading-relaxed">{effect.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
          <Lightbulb size={20} className="text-gray-600" />
          Recommandations
        </h4>
        <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
          {aqiStatus.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3">{rec}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}