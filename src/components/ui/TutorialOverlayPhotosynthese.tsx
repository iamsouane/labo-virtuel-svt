//src/components/ui/TutorialOverlayPhotosynthese
import React, { useEffect, useState } from "react"
import type { TutorialStep } from "../../types/tutorialPhotosynthese"

type TutorialOverlayPhotosyntheseProps = {
    currentStep: Omit<TutorialStep, "totalSteps">
    totalSteps: number
    onNext: () => void
    onPrevious: () => void
    onSkip: () => void
    onComplete: () => void
}

export const TutorialOverlayPhotosynthese: React.FC<TutorialOverlayPhotosyntheseProps> = ({
    currentStep,
    totalSteps,
    onNext,
    onPrevious,
    onSkip,
    onComplete,
}) => {
    const [/*actionCompleted*/, setActionCompleted] = useState(true)

    useEffect(() => {
        setActionCompleted(true)
    }, [currentStep.id])

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/50 pointer-events-auto" />

            {/* Carte tutoriel */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 max-w-md pointer-events-auto border-2 border-blue-500">
                {/* Bouton de fermeture */}
                <button
                    onClick={onSkip}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg font-bold"
                    aria-label="Fermer le tutoriel"
                >
                    ✕
                </button>

                {/* Indicateur de progression */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {currentStep.id}
                        </div>
                    </div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${(currentStep.id / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Contenu */}
                <h3 className="text-lg font-bold mb-3 text-gray-800">{currentStep.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{currentStep.content}</p>

                {/* Boutons de navigation */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        {currentStep.id > 1 && (
                            <button
                                onClick={onPrevious}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                            >
                                ← Précédent
                            </button>
                        )}
                        {currentStep.skippable && (
                            <button
                                onClick={onSkip}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Passer le tutoriel
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {currentStep.id < totalSteps ? (
                            <button
                                onClick={onNext}
                                className="px-6 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Suivant →
                            </button>
                        ) : (
                            <button
                                onClick={onComplete}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                            >
                                Terminer 🎉
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}