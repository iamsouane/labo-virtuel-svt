//src/components/ui/TutorialOverlayEnergie
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
    <div className="fixed inset-0 z-50 bg-dark/60 flex items-center justify-center p-4 font-sans">
      <div className="bg-light rounded-2xl shadow-2xl max-w-md w-full border-2 border-primary animate-fade-in relative">
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-accent transition-colors"
          aria-label="Fermer le tutoriel"
        >
          <X className="w-5 h-5 text-dark" />
        </button>

        {/* En-tête */}
        <div className="p-6 pb-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow">
                {currentStep.id}
              </div>
              <span className="text-sm text-dark font-medium">
                Étape {currentStep.id}/{totalSteps}
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-accent rounded-full mt-4 mb-6 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(currentStep.id / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Contenu */}
        <div className="px-6 pt-0 pb-6">
          <h3 className="text-xl font-bold text-dark mb-4 flex items-center justify-center gap-2">
            {currentStep.icon && <span className="text-2xl">{currentStep.icon}</span>}
            <span>{currentStep.title}</span>
          </h3>

          <div className="text-gray-700 mb-6 space-y-3">
            {currentStep.content.split('\n').map((paragraph, i) =>
              paragraph ? (
                <p key={i} className="leading-relaxed">
                  {paragraph}
                </p>
              ) : (
                <br key={i} />
              )
            )}
          </div>

          {currentStep.tips && (
            <div className="bg-accent rounded-lg p-4 mb-6 border border-primary/20 animate-pulse">
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-secondary" />
                <span>Conseils pratiques</span>
              </h4>
              <ul className="space-y-2 pl-1 text-dark">
                {currentStep.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex justify-between items-center border-t border-accent">
          <div className="flex gap-3">
            {currentStep.id > 1 && (
              <button
                onClick={onPrevious}
                className="px-4 py-2 bg-light text-dark rounded-lg hover:bg-accent transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>
            )}
            {currentStep.skippable && !(currentStep.id > 1) && (
              <button
                onClick={onSkip}
                className="px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-secondary text-white hover:bg-secondary/80 shadow flex items-center gap-1"
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
                    className="px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-secondary text-white hover:bg-secondary/80 shadow flex items-center gap-1"
                  >
                    <span>Passer</span>
                  </button>
                )}
                <button
                  onClick={onNext}
                  className="px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-primary text-white hover:bg-primary/80 shadow flex items-center gap-1"
                >
                  <span>Suivant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onComplete}
                className="px-5 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/80 transition font-medium flex items-center gap-1 shadow"
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