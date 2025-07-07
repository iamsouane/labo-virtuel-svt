// src/components/ui/TutorialOverlayEnergie.tsx
import React, { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, Lightbulb, X } from "lucide-react"
import type { TutorialStep } from "../../types/simulationEnergieTypes"

interface TutorialOverlayEnergieProps {
  currentStep: TutorialStep
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  onSkip: () => void
  onComplete: () => void
  onClose: () => void
}

export const TutorialOverlayEnergie: React.FC<TutorialOverlayEnergieProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
  onClose,
}) => {
  const [, setActionCompleted] = useState(true)

  useEffect(() => {
    setActionCompleted(true)
    let timeout: NodeJS.Timeout
    if (currentStep.autoAdvance) {
      timeout = setTimeout(() => {
        if (currentStep.id < totalSteps) onNext()
        else onComplete()
      }, currentStep.autoAdvance)
    }
    return () => clearTimeout(timeout)
  }, [currentStep.id, currentStep.autoAdvance])

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-green-500 animate-fade-in relative">
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fermer le tutoriel"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* En-tête */}
        <div className="p-6 pb-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                {currentStep.id}
              </div>
              <span className="text-sm text-gray-500 font-medium">
                Étape {currentStep.id}/{totalSteps}
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full mt-4 mb-6 overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep.id / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Contenu */}
        <div className="px-6 pt-0 pb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
            {currentStep.icon && <span className="text-2xl">{currentStep.icon}</span>}
            <span>{currentStep.title}</span>
          </h3>

          <div className="text-gray-600 mb-6 space-y-3">
            {currentStep.content.split('\n').map((paragraph, i) => (
              paragraph ? (
                <p key={i} className="leading-relaxed">
                  {paragraph}
                </p>
              ) : (
                <br key={i} />
              )
            ))}
          </div>

          {currentStep.tips && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200 animate-pulse">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <span className="text-blue-600 text-lg flex items-center">
                  <Lightbulb className="w-5 h-5" />
                </span>
                <span>Conseils pratiques</span>
              </h4>
              <ul className="space-y-2 pl-1">
                {currentStep.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-blue-700">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex justify-between items-center border-t border-gray-100">
          <div className="flex gap-3">
            {currentStep.id > 1 && (
              <button
                onClick={onPrevious}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>
            )}
            {currentStep.skippable && !(currentStep.id > 1) && (
              <button
                onClick={onSkip}
                className="px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-red-500 text-white hover:bg-red-600 shadow-sm flex items-center gap-1"
              >
                <span>Passer</span>
              </button>
            )}
          </div>

          <div>
            {currentStep.id < totalSteps ? (
              <div className="flex gap-3">
                {currentStep.skippable && currentStep.id > 1 && (
                  <button
                    onClick={onSkip}
                    className="px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-red-500 text-white hover:bg-red-600 shadow-sm flex items-center gap-1"
                  >
                    <span>Passer</span>
                  </button>
                )}
                <button
                  onClick={onNext}
                  className="px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-green-500 text-white hover:bg-green-600 shadow-sm flex items-center gap-1"
                >
                  <span>Suivant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onComplete}
                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium flex items-center gap-1 shadow-sm"
              >
                <span>Commencer</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}