"use client"

import { useState } from "react"

interface AidePollutionProps {
  onClose: () => void
}

export default function AidePollution({ onClose }: AidePollutionProps) {
  const [activeSection, setActiveSection] = useState("general")

  const sections = {
    general: {
      title: "🎯 Utilisation Générale",
      content: [
        {
          question: "Comment utiliser la simulation ?",
          answer:
            "Choisissez une source de pollution (Transport ou Industrie), ajustez le nombre avec les boutons +/-, puis observez l'impact sur l'atmosphère et les données de qualité de l'air.",
        },
        {
          question: "Comment changer de source de pollution ?",
          answer:
            "Utilisez le menu déroulant 'Source de pollution' pour basculer entre Transport (voitures) et Industrie (usines).",
        },
        {
          question: "Que signifient les chiffres affichés ?",
          answer:
            "Les valeurs représentent les concentrations de polluants : CO₂ en ppm, NOx et PM2.5 en µg/m³, et l'AQI sur une échelle de 0 à 500.",
        },
      ],
    },
    polluants: {
      title: "🧪 Polluants Atmosphériques",
      content: [
        {
          question: "Qu'est-ce que le CO₂ ?",
          answer:
            "Le dioxyde de carbone est le principal gaz à effet de serre. Concentration normale : 350-420 ppm. Au-delà de 500 ppm, il contribue significativement au réchauffement climatique.",
        },
        {
          question: "Que sont les NOx ?",
          answer:
            "Les oxydes d'azote (NO, NO₂) sont des gaz toxiques émis par la combustion. Seuil OMS : 40 µg/m³. Ils causent l'asthme, les pluies acides et la formation d'ozone.",
        },
        {
          question: "Qu'est-ce que les PM2.5 ?",
          answer:
            "Particules fines de diamètre < 2,5 µm. Seuil OMS : 15 µg/m³. Elles pénètrent dans le sang et causent cancers, AVC, et maladies cardiovasculaires.",
        },
      ],
    },
    sources: {
      title: "🚗 Sources de Pollution",
      content: [
        {
          question: "Impact d'une voiture ?",
          answer:
            "Une voiture émet ~120g CO₂/km, soit +32 ppm par jour dans la simulation. Elle produit aussi des NOx (+12 µg/m³) et des PM2.5 (+4 µg/m³).",
        },
        {
          question: "Impact d'une industrie ?",
          answer:
            "Une usine émet ~50 000 tonnes CO₂/an, soit +85 ppm par jour dans la simulation. Impact 3x supérieur aux voitures : +35 NOx et +18 PM2.5 µg/m³.",
        },
        {
          question: "Pourquoi les industries polluent plus ?",
          answer:
            "Les industries concentrent la combustion de grandes quantités de combustibles fossiles et de matières premières, créant des émissions massives sur un point géographique.",
        },
      ],
    },
    sante: {
      title: "🏥 Effets sur la Santé",
      content: [
        {
          question: "Comment interpréter l'AQI ?",
          answer:
            "AQI 0-50 : Bon (vert), 51-100 : Modéré (jaune), 101-150 : Mauvais (orange), 151-200 : Très mauvais (rouge), 201-300 : Dangereux (violet), >300 : Urgence.",
        },
        {
          question: "Quand éviter les activités extérieures ?",
          answer:
            "AQI > 100 : limiter les efforts intenses. AQI > 150 : porter un masque. AQI > 200 : rester à l'intérieur et fermer les fenêtres.",
        },
        {
          question: "Qui est le plus à risque ?",
          answer:
            "Enfants, personnes âgées, asthmatiques, et personnes avec maladies cardiovasculaires sont plus sensibles à la pollution atmosphérique.",
        },
      ],
    },
    solutions: {
      title: "🛠️ Solutions Anti-Pollution",
      content: [
        {
          question: "Efficacité des voitures électriques ?",
          answer:
            "Réduction de 20% des émissions de transport. Zéro émission locale, mais impact dépend de la source d'électricité (renouvelable vs fossile).",
        },
        {
          question: "Comment fonctionnent les filtres industriels ?",
          answer:
            "Réduction de 25% des émissions industrielles. Ils capturent les particules et neutralisent certains gaz avant leur rejet dans l'atmosphère.",
        },
        {
          question: "Impact des arbres sur la pollution ?",
          answer:
            "Un arbre mature absorbe ~22 kg CO₂/an et filtre les particules. Réduction de 10% de la pollution locale, plus effet rafraîchissant urbain.",
        },
      ],
    },
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">❓ Aide Pollution</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <nav className="space-y-2">
            {Object.entries(sections).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  activeSection === key ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {sections[activeSection as keyof typeof sections].title}
          </h3>

          <div className="space-y-6">
            {sections[activeSection as keyof typeof sections].content.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">Q:</span>
                  {item.question}
                </h4>
                <p className="text-gray-700 leading-relaxed pl-6">
                  <span className="text-green-500 font-semibold">R:</span> {item.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Données scientifiques */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Données Scientifiques</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Sources : OMS, EPA, ADEME, CITEPA</p>
              <p>• Émissions voiture : 120g CO₂/km (moyenne européenne 2023)</p>
              <p>• Émissions industrie : 50 000 tonnes CO₂/an (usine moyenne)</p>
              <p>• Seuils OMS 2021 : PM2.5 ≤ 15 µg/m³, NO₂ ≤ 40 µg/m³</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}