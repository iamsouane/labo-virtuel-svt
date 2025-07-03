"use client"

import { useState } from "react"

interface TutorialStep {
  id: number
  title: string
  content: string
  tips: string[]
}

interface GuideTutorielSelectionProps {
  onClose: () => void
}

export default function GuideTutorielSelection({ onClose }: GuideTutorielSelectionProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: "🐇 Bienvenue dans la Simulation de Sélection Naturelle",
      content:
        "Cette simulation vous permet d'observer comment les caractéristiques des lapins évoluent en fonction des pressions environnementales (température, prédateurs, nourriture).",
      tips: [
        "Utilisez les réglages pour ajuster l’environnement",
        "Observez l’adaptation des lapins sur plusieurs générations",
        "Notez les variations génétiques et la survie",
      ],
    },
    {
      id: 2,
      title: "🌿 Facteurs de l’Environnement",
      content:
        "Les conditions environnementales influencent les chances de survie. Par exemple, un climat froid favorise les lapins à fourrure épaisse.",
      tips: [
        "Changez la température pour voir les adaptations",
        "Ajoutez des prédateurs pour observer la sélection naturelle",
        "Variez la disponibilité de nourriture",
      ],
    },
    {
      id: 3,
      title: "🧬 Génétique et Hérédité",
      content:
        "Chaque lapin hérite d’un patrimoine génétique de ses parents. Certains gènes offrent un avantage de survie, d’autres non.",
      tips: [
        "Les gènes sont transmis avec variations (mutations possibles)",
        "Certains phénotypes disparaissent avec le temps",
        "La sélection favorise les traits les plus adaptés",
      ],
    },
    {
      id: 4,
      title: "📈 Survie et Reproduction",
      content:
        "Seuls les lapins survivants peuvent se reproduire. Plus un trait est avantageux, plus il se répandra dans la population.",
      tips: [
        "Les lapins avec de bonnes adaptations ont plus de descendants",
        "Vous pouvez suivre les générations et observer les tendances",
        "La diversité génétique diminue parfois avec la pression",
      ],
    },
    {
      id: 5,
      title: "🔁 Expérimentez",
      content:
        "Essayez différents scénarios pour mieux comprendre l’évolution. Vous pouvez relancer la simulation avec de nouvelles conditions.",
      tips: [
        "Comparez deux environnements : chaud vs froid",
        "Testez des populations de départ différentes",
        "Observez les effets sur plusieurs générations",
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
            <h2 className="text-2xl font-bold text-gray-800">📚 Guide Sélection Naturelle</h2>
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