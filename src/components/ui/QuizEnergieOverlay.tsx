import { useState } from "react"
import { Zap, Battery, RefreshCw, Home, Info, ChevronUp, ChevronDown, ArrowRight } from "lucide-react"
import { QuizEnergieResults } from "./QuizEnergie"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "facile" | "moyen" | "difficile"
  category: "transformation" | "efficacite" | "sources" | "application" | "processus" | "facteurs"
}

interface QuizResult {
  score: number
  totalQuestions: number
  timeSpent: number
  answers: { questionId: number; userAnswer: number; correct: boolean }[]
}

interface QuizOverlayProps {
  questions: QuizQuestion[]
  currentQuestion: number
  selectedAnswer: number | null
  onAnswerSelect: (answerIndex: number) => void
  onNext: () => void
  onClose: () => void
  result?: QuizResult | null
  completed: boolean
  onRestart: () => void
}

export function QuizEnergieOverlay({
  questions,
  currentQuestion,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onClose,
  result,
  completed,
  onRestart,
}: QuizOverlayProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  if (completed && result) {
    return <QuizEnergieResults result={result} questions={questions} onRestart={onRestart} onClose={onClose} />
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facile": return "bg-green-100 text-green-800"
      case "moyen": return "bg-yellow-100 text-yellow-800"
      case "difficile": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "transformation":
        return <RefreshCw className="w-5 h-5 text-blue-500" />
      case "efficacite":
        return <Zap className="w-5 h-5 text-yellow-500" />
      case "sources":
        return <Battery className="w-5 h-5 text-green-500" />
      case "application":
        return <Home className="w-5 h-5 text-teal-500" />
      default:
        return <Info className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 pointer-events-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border-2 border-blue-500">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200 relative">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            Quiz Énergie
          </h2>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
            aria-label="Fermer le quiz"
          >
            ✕
          </button>

          {/* Barre de progression */}
          <div className="mt-4 mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Question {currentQuestion + 1} sur {questions.length}</span>
              <span>{Math.round(progress)}% complété</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Métadonnées */}
          <div className="flex gap-2 mt-3 justify-center">
            <span
              className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}
            >
              {question.difficulty}
            </span>
            <span className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {getCategoryIcon(question.category)} <span className="ml-1">{question.category}</span>
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-gray-800 leading-relaxed">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${selectedAnswer === index
                  ? "border-blue-500 bg-blue-50 text-blue-800"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${selectedAnswer === index
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300"
                      }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Explication */}
          {selectedAnswer !== null && (
            <div className="mb-4">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                {showExplanation ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Masquer
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Afficher
                  </>
                )}{" "}
                l'explication
              </button>
              {showExplanation && (
                <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-800 text-sm">
                  <p className="flex items-center gap-2 text-sm text-gray-800">
                    <strong className="flex items-center gap-1">
                      <Info className="w-4 h-4 text-blue-600" />
                      Explication
                    </strong>
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-yellow-500" />
              Sélectionnez une réponse pour continuer
            </div>
            <button
              onClick={onNext}
              disabled={selectedAnswer === null}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${selectedAnswer !== null
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  <span className="flex items-center gap-1">
                    Suivant
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </>
              ) : (
                <>
                  Terminer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}