"use client"

import { useState } from "react"

interface TutorialStep {
  id: number
  title: string
  content: string
  image?: string
  tips: string[]
}

interface GuideTutorielProps {
  onClose: () => void
}

export default function GuideTutoriel({ onClose }: GuideTutorielProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: "🎯 Bienvenue dans la Simulation d'Énergie",
      content:
        "Cette simulation vous permet d'explorer les transformations d'énergie de manière interactive. Vous pouvez choisir différentes sources d'énergie et observer comment elles sont converties.",
      tips: [
        "Utilisez les contrôles pour ajuster l'intensité",
        "Observez les animations en temps réel",
        "Lisez les informations dans le panneau de droite",
      ],
    },
    {
      id: 2,
      title: "🔋 Choisir une Source d'Énergie",
      content:
        "Vous pouvez sélectionner entre deux sources d'énergie principales : le vélo (énergie mécanique) et le soleil (énergie solaire). Chaque source a ses propres caractéristiques.",
      tips: [
        "Le vélo produit de l'énergie mécanique par pédalage",
        "Le soleil fournit de l'énergie lumineuse constante",
        "L'intensité peut être ajustée avec le curseur",
      ],
    },
    {
      id: 3,
      title: "⚡ Types de Générateurs",
      content:
        "Les générateurs convertissent l'énergie primaire en électricité. Vous pouvez choisir entre une génératrice classique et un panneau solaire, chacun ayant une efficacité différente.",
      tips: [
        "La génératrice a une efficacité de 80%",
        "Le panneau solaire a une efficacité de 85%",
        "L'efficacité affecte la puissance finale",
      ],
    },
    {
      id: 4,
      title: "🏠 Appareils de Sortie",
      content:
        "L'électricité produite alimente différents appareils : ampoule LED, ventilateur, ou chauffe-eau. Chaque appareil convertit l'électricité en une forme d'énergie utile.",
      tips: [
        "L'ampoule produit de la lumière (90% d'efficacité)",
        "Le ventilateur crée du mouvement (85% d'efficacité)",
        "Le chauffe-eau génère de la chaleur (95% d'efficacité)",
      ],
    },
    {
      id: 5,
      title: "🎮 Utiliser les Contrôles",
      content:
        "Utilisez les contrôles pour expérimenter avec différentes configurations. Ajustez l'intensité, changez les appareils, et observez les effets sur l'efficacité globale.",
      tips: [
        "Le bouton Start/Stop active la simulation",
        "Les symboles E montrent le flux d'énergie",
        "Les indicateurs affichent les puissances en temps réel",
      ],
    },
    {
      id: 6,
      title: "📊 Comprendre les Données",
      content:
        "Le panneau d'information montre les transformations d'énergie étape par étape, avec les efficacités et les calculs. Utilisez ces données pour comprendre les pertes d'énergie.",
      tips: [
        "Observez les pourcentages d'efficacité",
        "Comparez les différentes configurations",
        "Notez l'impact des pertes énergétiques",
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
            <h2 className="text-2xl font-bold text-gray-800">📚 Guide Tutoriel</h2>
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
              <h4 className="font-semibold text-blue-800 mb-2">💡 Conseils :</h4>
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