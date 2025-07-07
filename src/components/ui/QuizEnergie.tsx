//src/components/ui/QuizEnergie
import {
  Trophy,
  Star,
  ThumbsUp,
  BookOpen,
  RotateCcw,
  Search,
  Check,
  Info,
  Zap,
  Battery,
  RefreshCw,
  Home,
} from "lucide-react"

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

export function QuizEnergieResults({
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

  const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "facile":
      return "bg-green-100 text-green-800";
    case "moyen":
      return "bg-yellow-100 text-yellow-800";
    case "difficile":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};


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
          Excellent ! Vous maîtrisez parfaitement les transformations d'énergie !
        </span>
      )
    }
    if (percentage >= 80) {
      return (
        <span className="flex items-center gap-2 text-green-600">
          <Star className="w-5 h-5" />
          Très bien ! Vous avez de bonnes connaissances en énergie.
        </span>
      )
    }
    if (percentage >= 60) {
      return (
        <span className="flex items-center gap-2 text-blue-600">
          <ThumbsUp className="w-5 h-5" />
          Pas mal ! Quelques révisions seraient utiles.
        </span>
      )
    }
    if (percentage >= 40) {
      return (
        <span className="flex items-center gap-2 text-orange-600">
          <BookOpen className="w-5 h-5" />
          Il faut réviser les bases des transformations d'énergie.
        </span>
      )
    }
    return (
      <span className="flex items-center gap-2 text-red-600">
        <RotateCcw className="w-5 h-5" />
        Recommencez après avoir revu le cours !
      </span>
    )
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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-500">
        {/* Header avec résultats */}
        <div className="p-6 border-b border-gray-200 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex justify-center items-center gap-2">
            <Zap className="w-7 h-7 text-blue-600" />
            Résultats du Quiz Énergie
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
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200 flex justify-center items-center min-h-[80px]">
            <p className="text-blue-800 font-medium">
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
            <Search className="w-5 h-5 text-gray-700" />
            Détail des réponses
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
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">
                          Q{index + 1}: {question.question}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
                          {getCategoryIcon(question.category)}
                          {question.category}
                        </span>
                      </div>
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
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium flex items-center gap-2"
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