"use client"

interface HealthEffectsProps {
  aqi: number
}

export default function HealthEffects({ aqi }: HealthEffectsProps) {
  const getHealthEffects = (aqi: number) => {
    if (aqi <= 50) {
      return {
        level: "Bon",
        color: "green",
        effects: [
          { icon: "😊", text: "Aucun effet sur la santé", severity: "low" },
          { icon: "🏃", text: "Activités extérieures recommandées", severity: "low" },
          { icon: "🌱", text: "Air de qualité satisfaisante", severity: "low" },
        ],
        environment: [
          { icon: "🌳", text: "Végétation en bonne santé", severity: "low" },
          { icon: "🐦", text: "Faune préservée", severity: "low" },
        ],
      }
    } else if (aqi <= 100) {
      return {
        level: "Modéré",
        color: "yellow",
        effects: [
          { icon: "😐", text: "Léger inconfort pour personnes sensibles", severity: "medium" },
          { icon: "🤧", text: "Possible irritation des yeux", severity: "medium" },
          { icon: "🚶", text: "Activités extérieures acceptables", severity: "medium" },
        ],
        environment: [
          { icon: "🍃", text: "Légère réduction de la photosynthèse", severity: "medium" },
          { icon: "🌫️", text: "Visibilité réduite", severity: "medium" },
        ],
      }
    } else if (aqi <= 150) {
      return {
        level: "Mauvais",
        color: "orange",
        effects: [
          { icon: "😷", text: "Irritation respiratoire", severity: "high" },
          { icon: "🤒", text: "Aggravation de l'asthme", severity: "high" },
          { icon: "⚠️", text: "Éviter les activités intenses", severity: "high" },
        ],
        environment: [
          { icon: "🍂", text: "Stress des végétaux", severity: "high" },
          { icon: "🌧️", text: "Risque de pluies acides", severity: "high" },
        ],
      }
    } else if (aqi <= 200) {
      return {
        level: "Très mauvais",
        color: "red",
        effects: [
          { icon: "🤢", text: "Nausées et maux de tête", severity: "critical" },
          { icon: "💔", text: "Problèmes cardiovasculaires", severity: "critical" },
          { icon: "🏠", text: "Rester à l'intérieur", severity: "critical" },
        ],
        environment: [
          { icon: "💀", text: "Mortalité de la faune", severity: "critical" },
          { icon: "🌡️", text: "Contribution au réchauffement", severity: "critical" },
        ],
      }
    } else {
      return {
        level: "Dangereux",
        color: "purple",
        effects: [
          { icon: "🚨", text: "Urgence sanitaire", severity: "critical" },
          { icon: "🫁", text: "Dommages pulmonaires graves", severity: "critical" },
          { icon: "🚫", text: "Éviter toute sortie", severity: "critical" },
        ],
        environment: [
          { icon: "☠️", text: "Écosystème en danger", severity: "critical" },
          { icon: "🌍", text: "Impact climatique majeur", severity: "critical" },
        ],
      }
    }
  }

  const healthData = getHealthEffects(aqi)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="shadow-lg border-2 border-red-200 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-red-50 px-6 py-4 border-b border-red-200">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>🏥</span>
          <span>Effets sur la Santé et l'Environnement</span>
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Niveau de qualité */}
        <div className={`p-4 rounded-lg border-2 ${getSeverityColor(healthData.effects[0]?.severity || "low")}`}>
          <h3 className="font-bold text-lg mb-2">Qualité de l'air: {healthData.level}</h3>
          <div className="text-sm opacity-80">AQI: {aqi}</div>
        </div>

        {/* Effets sur la santé */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>👥</span>
            <span>Effets sur la santé humaine</span>
          </h4>
          <div className="space-y-2">
            {healthData.effects.map((effect, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getSeverityColor(effect.severity)} flex items-center gap-3`}
              >
                <span className="text-2xl">{effect.icon}</span>
                <span className="text-sm font-medium">{effect.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Effets sur l'environnement */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>🌍</span>
            <span>Effets sur l'environnement</span>
          </h4>
          <div className="space-y-2">
            {healthData.environment.map((effect, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getSeverityColor(effect.severity)} flex items-center gap-3`}
              >
                <span className="text-2xl">{effect.icon}</span>
                <span className="text-sm font-medium">{effect.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommandations */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <span>💡</span>
            <span>Recommandations</span>
          </h4>
          <div className="text-sm text-blue-700">
            {aqi <= 50 && "Profitez des activités extérieures ! L'air est de bonne qualité."}
            {aqi > 50 && aqi <= 100 && "Personnes sensibles : limitez les efforts prolongés à l'extérieur."}
            {aqi > 100 && aqi <= 150 && "Portez un masque lors des sorties et évitez les exercices intenses."}
            {aqi > 150 && aqi <= 200 && "Restez à l'intérieur autant que possible et fermez les fenêtres."}
            {aqi > 200 && "Urgence sanitaire : évitez absolument les sorties non essentielles."}
          </div>
        </div>
      </div>
    </div>
  )
}