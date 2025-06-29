"\"use client"

import { useState } from "react"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "facile" | "moyen" | "difficile"
  category: "equation" | "facteurs" | "processus" | "application"
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

export default function QuizOverlay({
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
    return <QuizResults result={result} questions={questions} onRestart={onRestart} onClose={onClose} />
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facile":
        return "bg-green-100 text-green-800"
      case "moyen":
        return "bg-yellow-100 text-yellow-800"
      case "difficile":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "equation":
        return "🧪"
      case "facteurs":
        return "⚖️"
      case "processus":
        return "🔄"
      case "application":
        return "🌍"
      default:
        return "❓"
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">🧠 Quiz Photosynthèse</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
              ✕
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Question {currentQuestion + 1} sur {questions.length}
              </span>
              <span>{Math.round(progress)}% complété</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question metadata */}
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {getCategoryIcon(question.category)} {question.category}
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-gray-800 leading-relaxed">{question.question}</h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? "border-blue-500 bg-blue-50 text-blue-800"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                      selectedAnswer === index ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Explanation toggle */}
          {selectedAnswer !== null && (
            <div className="mb-4">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showExplanation ? "🔼 Masquer l'explication" : "🔽 Voir l'explication"}
              </button>

              {showExplanation && (
                <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm leading-relaxed">
                    <strong>Explication :</strong> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">💡 Sélectionnez une réponse pour continuer</div>

            <button
              onClick={onNext}
              disabled={selectedAnswer === null}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedAnswer !== null
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {currentQuestion < questions.length - 1 ? "Suivant →" : "Terminer 🎯"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant pour les résultats
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
    if (percentage >= 90) return "🏆 Excellent ! Vous maîtrisez parfaitement la photosynthèse !"
    if (percentage >= 80) return "🌟 Très bien ! Vous avez de bonnes connaissances."
    if (percentage >= 60) return "👍 Pas mal ! Quelques révisions seraient utiles."
    if (percentage >= 40) return "📚 Il faut réviser les bases de la photosynthèse."
    return "🔄 Recommencez après avoir revu le cours !"
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🎯 Résultats du Quiz</h2>
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(percentage)}`}>
            {result.score}/{result.totalQuestions}
          </div>
          <div className={`text-xl font-semibold ${getScoreColor(percentage)}`}>{percentage}%</div>
          <p className="text-gray-600 mt-2">
            Temps: {minutes}m {seconds}s
          </p>
        </div>

        {/* Message */}
        <div className="p-6 text-center">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">{getScoreMessage(percentage)}</p>
          </div>

          {/* Statistiques détaillées */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{result.answers.filter((a) => a.correct).length}</div>
              <div className="text-sm text-green-700">Correctes</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{result.answers.filter((a) => !a.correct).length}</div>
              <div className="text-sm text-red-700">Incorrectes</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {minutes}m{seconds}s
              </div>
              <div className="text-sm text-blue-700">Temps total</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(result.timeSpent / result.totalQuestions)}s
              </div>
              <div className="text-sm text-purple-700">Par question</div>
            </div>
          </div>
        </div>

        {/* Révision des réponses */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">📋 Révision des réponses</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {result.answers.map((answer, index) => {
              const question = questions[index]
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    answer.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        answer.correct ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {answer.correct ? "✓" : "✗"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-1">
                        Q{index + 1}: {question.question}
                      </p>
                      <p className="text-sm text-gray-600">Votre réponse: {question.options[answer.userAnswer]}</p>
                      {!answer.correct && (
                        <p className="text-sm text-green-600 font-medium">
                          Bonne réponse: {question.options[question.correctAnswer]}
                        </p>
                      )}
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
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            🔄 Recommencer
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
          >
            ✓ Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
