"use client"

import { useState } from "react"

interface TutorialStep {
  id: number
  title: string
  content: string
  tips: string[]
}

interface GuideTutorielPollutionProps {
  onClose: () => void
}

export default function GuideTutorielPollution({ onClose }: GuideTutorielPollutionProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: "🌫️ Bienvenue dans le Laboratoire de Pollution",
      content:
        "Cette simulation vous permet d'explorer les causes et effets de la pollution atmosphérique. Vous pouvez ajuster le nombre de sources polluantes et observer leur impact sur la qualité de l'air en temps réel.",
      tips: [
        "Utilisez les contrôles pour modifier le nombre de voitures ou d'industries",
        "Observez les changements dans l'atmosphère et les données",
        "Testez différentes solutions pour réduire la pollution",
      ],
    },
    {
      id: 2,
      title: "🚗 Sources de Pollution : Transport",
      content:
        "Le transport routier est une source majeure de pollution urbaine. Chaque voiture émet en moyenne 120g de CO₂ par kilomètre, plus des oxydes d'azote (NOx) et des particules fines (PM2.5).",
      tips: [
        "Une voiture émet ~32 ppm de CO₂ supplémentaire par jour",
        "Les NOx causent l'asthme et les pluies acides",
        "Les particules PM2.5 pénètrent dans le système sanguin",
      ],
    },
    {
      id: 3,
      title: "🏭 Sources de Pollution : Industrie",
      content:
        "Les industries sont des sources concentrées de pollution. Une usine moyenne émet 50 000 tonnes de CO₂ par an, soit l'équivalent de 400 voitures. Elles produisent aussi des NOx et particules en grandes quantités.",
      tips: [
        "Une industrie émet ~85 ppm de CO₂ par jour",
        "Impact 3x supérieur aux voitures individuelles",
        "Les filtres industriels peuvent réduire les émissions de 80%",
      ],
    },
    {
      id: 4,
      title: "📊 Comprendre les Polluants",
      content:
        "Quatre indicateurs clés mesurent la qualité de l'air : CO₂ (effet de serre), NOx (toxique respiratoire), PM2.5 (particules cancérigènes), et l'AQI (indice global de 0 à 500).",
      tips: [
        "CO₂ normal : 350-420 ppm, dangereux au-delà de 500 ppm",
        "NOx seuil OMS : 40 µg/m³, toxique au-delà de 100 µg/m³",
        "PM2.5 seuil OMS : 15 µg/m³, cancérigène au-delà de 50 µg/m³",
      ],
    },
    {
      id: 5,
      title: "🛠️ Solutions Anti-Pollution",
      content:
        "Plusieurs solutions existent pour réduire la pollution : véhicules électriques, filtres industriels, pistes cyclables, énergies renouvelables, et plantation d'arbres. Chaque solution a un impact mesurable.",
      tips: [
        "Voitures électriques : -20% d'émissions de transport",
        "Filtres industriels : -25% d'émissions industrielles",
        "Arbres : absorption naturelle de CO₂",
      ],
    },
    {
      id: 6,
      title: "🏥 Impact sur la Santé",
      content:
        "La pollution atmosphérique cause 7 millions de morts prématurées par an selon l'OMS. L'AQI indique le niveau de risque : bon (0-50), modéré (51-100), mauvais (101-150), très mauvais (151-200), dangereux (201-300).",
      tips: [
        "AQI > 100 : éviter les activités extérieures intenses",
        "AQI > 150 : porter un masque à l'extérieur",
        "AQI > 200 : rester à l'intérieur, fermer les fenêtres",
      ],
    },
  ]

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const step = tutorialSteps[currentStep]
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">📚 Guide Pollution Atmosphérique</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
              ✕
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Étape {currentStep + 1} sur {tutorialSteps.length}
              </span>
              <span>{Math.round(progress)}% complété</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{step.title}</h3>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">{step.content}</p>

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Points clés :</h4>
              <ul className="space-y-1">
                {step.tips.map((tip, index) => (
                  <li key={index} className="text-blue-700 text-sm flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentStep === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-500 text-white hover:bg-gray-600"
              }`}
            >
              ← Précédent
            </button>

            <div className="flex gap-2">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentStep ? "bg-green-500" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {currentStep < tutorialSteps.length - 1 ? (
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
              >
                Suivant →
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                Terminer ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}