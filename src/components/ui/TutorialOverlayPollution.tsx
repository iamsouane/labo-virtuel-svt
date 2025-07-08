// src/components/ui/TutorialOverlayPollution.tsx
import React, { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react"
import type { TutorialStep } from "../../types/simulationPollutionTypes"

type TutorialOverlayPollutionProps = {
    currentStep: TutorialStep
    totalSteps: number
    onNext: () => void
    onPrevious: () => void
    onSkip: () => void
    onComplete: () => void
}

export const TutorialOverlayPollution: React.FC<TutorialOverlayPollutionProps> = ({
    currentStep,
    totalSteps,
    onNext,
    onPrevious,
    onSkip,
    onComplete,
}) => {
    const [, setActionCompleted] = useState(true)

    // Handle auto-advance
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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 pointer-events-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-red-500 animate-fade-in pointer-events-auto">
                {/* Header with step number */}
                <div className="p-6 pb-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                                {currentStep.id}
                            </div>
                            <span className="text-sm text-gray-500 font-medium">
                                Étape {currentStep.id}/{totalSteps}
                            </span>
                        </div>
                        <button
                            onClick={onSkip}
                            className="text-gray-400 hover:text-red-500 transition-colors text-xl font-bold"
                            aria-label="Fermer le tutoriel"
                        >
                            &times;
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-4 mb-6 overflow-hidden">
                        <div
                            className="h-full bg-red-500 transition-all duration-500 ease-out"
                            style={{ width: `${(currentStep.id / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Main content */}
                <div className="p-6 pt-0">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center justify-center text-center gap-2">
                        {currentStep.icon && <span className="text-2xl">{currentStep.icon}</span>}
                        <span>{currentStep.title}</span>
                    </h3>

                    {/* Content with line break handling */}
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

                    {/* Tips section (if present) */}
                    {currentStep.tips && (
                        <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200 animate-pulse">
                            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-red-600" />
                                <span>Conseils pratiques</span>
                            </h4>
                            <ul className="space-y-2 pl-1">
                                {currentStep.tips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-red-700">
                                        <span className="text-red-500 mt-1">•</span>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Navigation buttons */}
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
                                    className="px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-red-500 text-white hover:bg-red-600 shadow-sm flex items-center gap-1"
                                >
                                    <span>Suivant</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onComplete}
                                className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium flex items-center gap-1 shadow-sm"
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