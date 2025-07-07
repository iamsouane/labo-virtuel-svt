// src/components/ui/QuizSelectionOverlay.tsx
import { useState } from "react"
import type { QuizQuestion, QuizResult } from "../../types/selectionNaturelleTypes"
import {
  Trophy,
  Star,
  ThumbsUp,
  BookOpen,
  RotateCcw,
  Rabbit,
  Search,
  Check,
  Dna,
  Thermometer,
  RefreshCw,
  Book,
  Globe,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  Info,
  ArrowRight,
} from "lucide-react"

interface QuizSelectionOverlayProps {
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

function QuizResults({
  result,
  questions,
  onRestart,
  onClose,
}: {
  result: QuizResult
  questions: QuizQuestion[]
  onRestart: () => void
  onClose: () => void
}) {
  const percentage = Math.round((result.score / result.totalQuestions) * 100)
  const minutes = Math.floor(result.timeSpent / 60)
  const seconds = result.timeSpent % 60

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) {
      return (
        <span className="flex items-center gap-2 text-yellow-600">
          <Trophy className="w-5 h-5" />
          Bravo ! Vous êtes un expert en sélection naturelle !
        </span>
      )
    }
    if (percentage >= 80) {
      return (
        <span className="flex items-center gap-2 text-green-600">
          <Star className="w-5 h-5" />
          Excellent ! Vous comprenez bien les mécanismes évolutifs.
        </span>
      )
    }
    if (percentage >= 60) {
      return (
        <span className="flex items-center gap-2 text-blue-600">
          <ThumbsUp className="w-5 h-5" />
          Pas mal ! Quelques notions à revoir pour perfectionner vos connaissances.
        </span>
      )
    }
    if (percentage >= 40) {
      return (
        <span className="flex items-center gap-2 text-orange-600">
          <BookOpen className="w-5 h-5" />
          À étudier : révisez les principes de base de l'évolution.
        </span>
      )
    }
    return (
      <span className="flex items-center gap-2 text-red-600">
        <RotateCcw className="w-5 h-5" />
        Recommencez après avoir revu les concepts clés.
      </span>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-green-500">
        {/* Header avec résultats */}
        <div className="p-6 border-b border-gray-200 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex justify-center items-center gap-2">
            <Rabbit className="w-7 h-7 text-green-600" />
            Résultats du Quiz Sélection Naturelle
          </h2>
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(percentage)}`}>
            {result.score}/{result.totalQuestions}
          </div>
          <div className={`text-xl font-semibold ${getScoreColor(percentage)}`}>
            {percentage}%
          </div>
          <p className="text-gray-600 mt-2">
            Temps: {minutes}m {seconds}s
          </p>
        </div>

        {/* Message de performance */}
        <div className="p-6 text-center">
          <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200 flex justify-center items-center min-h-[80px]">
            <p className="text-green-800 font-medium">
              {getScoreMessage(percentage)}
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{result.answers.filter(a => a.correct).length}</div>
              <div className="text-sm text-green-700">Réponses correctes</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{result.answers.filter(a => !a.correct).length}</div>
              <div className="text-sm text-red-700">Réponses incorrectes</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {minutes}m{seconds}s
              </div>
              <div className="text-sm text-blue-700">Temps total</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(result.timeSpent / result.totalQuestions)}s
              </div>
              <div className="text-sm text-purple-700">Par question</div>
            </div>
          </div>
        </div>

        {/* Révision détaillée */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-700" />
              Détail des réponses
            </span>
          </h3>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {result.answers.map((answer, index) => {
              const question = questions[index]
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${answer.correct
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${answer.correct ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                      {answer.correct ? "✓" : "✗"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-1">
                        Q{index + 1}: {question.question}
                      </p>
                      <p className="text-sm text-gray-600">
                        Votre réponse: {question.options[answer.userAnswer]}
                      </p>
                      {!answer.correct && (
                        <p className="text-sm text-green-600 font-medium mt-1">
                          <span className="font-semibold">Réponse correcte:</span> {question.options[question.correctAnswer]}
                        </p>
                      )}
                      <p className="text-sm text-gray-700 mt-2 italic">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex gap-4 justify-center">
          <button
            onClick={onRestart}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Recommencer
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            Terminer
          </button>
        </div>
      </div>
    </div>
  )
}

export default function QuizSelectionOverlay({
  questions,
  currentQuestion,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onClose,
  result,
  completed,
  onRestart,
}: QuizSelectionOverlayProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  if (completed && result) {
    return <QuizResults result={result} questions={questions} onRestart={onRestart} onClose={onClose} />
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
      case "genetique":
        return <Dna className="w-5 h-5 text-blue-500" />
      case "adaptation":
        return <Thermometer className="w-5 h-5 text-green-500" />
      case "processus":
        return <RefreshCw className="w-5 h-5 text-yellow-500" />
      case "concepts":
        return <Book className="w-5 h-5 text-teal-500" />
      case "application":
        return <Globe className="w-5 h-5 text-purple-500" />
      default:
        return <HelpCircle className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 pointer-events-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border-2 border-green-500">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200 relative">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Rabbit className="w-6 h-6 text-green-600" />
            Quiz Sélection Naturelle
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
                className="h-full bg-green-500 transition-all duration-300"
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
            <span className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
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
                  ? "border-green-500 bg-green-50 text-green-800"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${selectedAnswer === index
                      ? "border-green-500 bg-green-500 text-white"
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
                className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
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
                <div className="mt-3 p-4 bg-green-50 rounded-lg border border-green-200 text-green-800 text-sm">
                  <p className="flex items-center gap-2 text-sm text-gray-800">
                    <strong className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-blue-600" />
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
                ? "bg-green-500 text-white hover:bg-green-600"
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