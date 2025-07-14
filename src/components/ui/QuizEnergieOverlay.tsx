// src/components/ui/QuizPhotosyntheseOverlay.tsx
import { useState, useEffect } from "react"
import type { LocalQuizResult, QuizQuestion, QuizResult } from "../../types/simulationEnergieTypes"
import {
  Trophy,
  Star,
  ThumbsUp,
  BookOpen,
  RotateCcw,
  Leaf,
  Search,
  Check,
  FlaskConical,
  Globe,
  HelpCircle,
  Scale,
  ChevronUp,
  ChevronDown,
  Info,
  ArrowRight,
} from "lucide-react"
import { saveQuizResult, transformLocalToQuizResult } from "../../lib/quizService"

interface QuizOverlayProps {
  questions: QuizQuestion[]
  currentQuestion: number
  selectedAnswer: number | null
  onClose: () => void
  result?: QuizResult | null
  onRestart: () => void
  onAnswerSelect: (answerIndex: number) => void
  onNext: () => void
  completed: boolean
  simulationCode: string;
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

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "text-green-600"
    if (pct >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = (pct: number) => {
    if (pct >= 90) {
      return (
        <span className="flex items-center gap-2 text-yellow-600">
          <Trophy className="w-5 h-5" />
          Excellent ! Vous maîtrisez parfaitement la photosynthèse !
        </span>
      )
    }
    if (pct >= 80) {
      return (
        <span className="flex items-center gap-2 text-green-600">
          <Star className="w-5 h-5" />
          Très bien ! Vous avez de bonnes connaissances.
        </span>
      )
    }
    if (pct >= 60) {
      return (
        <span className="flex items-center gap-2 text-blue-600">
          <ThumbsUp className="w-5 h-5" />
          Pas mal ! Quelques révisions seraient utiles.
        </span>
      )
    }
    if (pct >= 40) {
      return (
        <span className="flex items-center gap-2 text-orange-600">
          <BookOpen className="w-5 h-5" />
          Il faut réviser les bases de la photosynthèse.
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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-green-500">
        {/* Header résultats */}
        <div className="p-6 border-b border-gray-200 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex justify-center items-center gap-2">
            <Leaf className="w-7 h-7 text-green-600" />
            Résultats du Quiz Photosynthèse
          </h2>
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(percentage)}`}>
            {result.score} / {result.totalQuestions}
          </div>
          <div className={`text-xl font-semibold ${getScoreColor(percentage)}`}>{percentage}%</div>
          <p className="text-gray-600 mt-2">
            Temps: {minutes}m {seconds}s
          </p>
        </div>

        {/* Message performance */}
        <div className="p-6 text-center">
          <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200 flex justify-center items-center min-h-[80px]">
            <p className="text-green-800 font-medium">{getScoreMessage(percentage)}</p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{result.answers.filter((a) => a.correct).length}</div>
              <div className="text-sm text-green-700">Réponses correctes</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{result.answers.filter((a) => !a.correct).length}</div>
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
                  className={`p-3 rounded-lg border ${answer.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
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
                      <p className="text-sm text-gray-600">Votre réponse: {question.options[answer.userAnswer]}</p>
                      {!answer.correct && (
                        <p className="text-sm text-green-600 font-medium mt-1">
                          <span className="font-semibold">Réponse correcte:</span> {question.reponse_correcte}
                        </p>
                      )}
                      <p className="text-sm text-gray-700 mt-2 italic">{question.explication}</p>
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
            aria-label="Recommencer le quiz"
          >
            <RotateCcw className="w-5 h-5" />
            Recommencer
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium flex items-center gap-2"
            aria-label="Terminer et fermer le quiz"
          >
            <Check className="w-5 h-5" />
            Terminer
          </button>
        </div>
      </div>
    </div>
  )
}

export function QuizEnergieOverlay({
  questions,
  currentQuestion,
  selectedAnswer,
  onClose,
}: QuizOverlayProps) {
  const [localCurrentQuestion, setLocalCurrentQuestion] = useState<number>(currentQuestion)
    const [localSelectedAnswer, setLocalSelectedAnswer] = useState<number | null>(null)
    const [answers, setAnswers] = useState<
      { questionId: number; userAnswer: number; correct: boolean; timeSpent: number }[]
    >([])
    const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [startTime] = useState(Date.now())
    const [showExplanation, setShowExplanation] = useState(false)
    const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  useEffect(() => {
    setLocalCurrentQuestion(currentQuestion)
  }, [currentQuestion])

  useEffect(() => {
    setLocalSelectedAnswer(selectedAnswer)
  }, [selectedAnswer])

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-8 text-center">
          <p className="text-gray-700 font-semibold">Aucune question disponible.</p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    )
  }

  // Fonction appelée quand on clique sur "Suivant" ou "Terminer"
  const handleNext = async () => {
    if (localSelectedAnswer === null) return

    const currentQ = questions[localCurrentQuestion]
    const isCorrect = currentQ.reponse_correcte === currentQ.options[localSelectedAnswer]
    const timeSpentForQuestion = Math.floor((Date.now() - questionStartTime) / 1000) // exemple: gérer ce temps dynamiquement si tu veux

    const newAnswer = {
      questionId: localCurrentQuestion,
      userAnswer: localSelectedAnswer,
      correct: isCorrect,
      timeSpent: timeSpentForQuestion as number,
    }

    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)
    setLocalSelectedAnswer(null)
    setShowExplanation(false)

    if (localCurrentQuestion < questions.length - 1) {
      setLocalCurrentQuestion(localCurrentQuestion + 1)
      setQuestionStartTime(Date.now())
    } else {
      // Fin du quiz
      const score = newAnswers.filter((a) => a.correct).length
      const totalQuestions = questions.length
      const timeSpent = Math.floor((Date.now() - startTime) / 1000) // en secondes

      const localResult: LocalQuizResult = {
        score,
        totalQuestions,
        timeSpent,
        answers: newAnswers,
      }

      // Transforme localResult en QuizResult complet
      const quizResultToSave = transformLocalToQuizResult(localResult)

      setIsSaving(true)
      const saveRes = await saveQuizResult(localResult, questions[0].quiz_id)

      if (saveRes.success) {
        setQuizResult(quizResultToSave)
        setIsCompleted(true)
      } else {
        alert("Erreur lors de la sauvegarde du résultat.")
      }
      setIsSaving(false)
    }
  }

  const handleRestart = () => {
    setLocalCurrentQuestion(0)
    setLocalSelectedAnswer(null)
    setAnswers([])
    setQuizResult(null)
    setIsCompleted(false)
    setShowExplanation(false)
  }

 if (isCompleted && quizResult) {
    return (
      <QuizResults
        result={quizResult}
        questions={questions}
        onRestart={handleRestart}
        onClose={onClose}
      />
    )
  }

  const question = questions[localCurrentQuestion]
  const progress = ((localCurrentQuestion + 1) / questions.length) * 100

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
        return <FlaskConical className="w-5 h-5 text-blue-500" />
      case "facteurs":
        return <Scale className="w-5 h-5 text-green-500" />
      case "processus":
        return <RotateCcw className="w-5 h-5 text-yellow-500" />
      case "application":
        return <Globe className="w-5 h-5 text-teal-500" />
      default:
        return <HelpCircle className="w-5 h-5 text-gray-400" />
    }
  }

    return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 pointer-events-none"
      aria-modal="true"
      role="dialog"
      aria-labelledby="quiz-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border-2 border-green-500">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200 relative">
          <h2 id="quiz-title" className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" />
            Quiz Energie
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
              <span>
                Question {localCurrentQuestion + 1} sur {questions.length}
              </span>
              <span>{Math.round(progress)}% complété</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Métadonnées */}
          <div className="flex gap-2 mt-3 justify-center">
            <span className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {getCategoryIcon(question.category)} <span className="ml-1">{question.category}</span>
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
                onClick={() => setLocalSelectedAnswer(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${localSelectedAnswer === index
                    ? "border-green-500 bg-green-50 text-green-800"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                aria-pressed={localSelectedAnswer === index}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${localSelectedAnswer === index ? "border-green-500 bg-green-500 text-white" : "border-gray-300"
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
          {localSelectedAnswer !== null && (
            <div className="mb-4">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
                aria-expanded={showExplanation}
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
                    {question.explication}
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
              onClick={handleNext}
              disabled={localSelectedAnswer === null || isSaving}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${localSelectedAnswer !== null && !isSaving
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              aria-disabled={localSelectedAnswer === null || isSaving}
            >
              {localCurrentQuestion < questions.length - 1 ? (
                <>
                  <span className="flex items-center gap-1">
                    Suivant
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </>
              ) : (
                <>Terminer</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}