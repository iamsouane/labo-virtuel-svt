// src/components/ui/QuizPhotosyntheseOverlay.tsx
import { useState, useEffect } from "react"
import type { LocalQuizResult, QuizQuestion, QuizResult } from "../../types/simulationPhotosyntheseTypes"
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
import { notifyError, notifySuccess } from "../../lib/notifications"

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

  const getScoreMessage = (pct: number) => {
    if (pct >= 90) {
      return (
        <span className="flex items-center gap-2 text-primary">
          <Trophy className="w-5 h-5 text-primary" />
          Excellent ! Vous maîtrisez parfaitement la photosynthèse !
        </span>
      );
    }
    if (pct >= 80) {
      return (
        <span className="flex items-center gap-2 text-secondary">
          <Star className="w-5 h-5 text-secondary" />
          Très bien ! Vous avez de bonnes connaissances.
        </span>
      );
    }
    if (pct >= 60) {
      return (
        <span className="flex items-center gap-2 text-dark">
          <ThumbsUp className="w-5 h-5 text-dark" />
          Pas mal ! Quelques révisions seraient utiles.
        </span>
      );
    }
    if (pct >= 40) {
      return (
        <span className="flex items-center gap-2 text-orange-500">
          <BookOpen className="w-5 h-5 text-orange-500" />
          Il faut réviser les bases de la photosynthèse.
        </span>
      );
    }
    return (
      <span className="flex items-center gap-2 text-red-500">
        <RotateCcw className="w-5 h-5 text-red-500" />
        Recommencez après avoir revu le cours !
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark/50 flex items-center justify-center p-4">
      <div className="bg-light rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-primary">
        {/* Header résultats */}
        <div className="p-6 border-b border-accent text-center bg-light rounded-t-xl">
          <h2 className="text-3xl font-bold text-primary mb-2 flex justify-center items-center gap-2 font-heading">
            <Leaf className="w-7 h-7 text-primary" />
            Résultats du Quiz Photosynthèse
          </h2>
          <div className={`text-4xl font-bold mb-2 text-primary`}>
            {result.score} / {result.totalQuestions}
          </div>
          <div className={`text-xl font-semibold text-secondary`}>{percentage}%</div>
          <p className="text-dark/70 mt-2 text-sm font-medium">
            Temps : {minutes}m {seconds}s
          </p>
        </div>

        {/* Message performance */}
        <div className="p-6 text-center">
          <div className="bg-accent/30 rounded-lg p-4 mb-6 border border-accent flex justify-center items-center min-h-[80px]">
            <p className="text-primary font-medium">{getScoreMessage(percentage)}</p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-accent/50 p-4 rounded-lg border border-primary/30">
              <div className="text-2xl font-bold text-primary">
                {result.answers.filter((a) => a.correct).length}
              </div>
              <div className="text-sm text-dark font-medium">Réponses correctes</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-300">
              <div className="text-2xl font-bold text-secondary">
                {result.answers.filter((a) => !a.correct).length}
              </div>
              <div className="text-sm text-secondary font-medium">Réponses incorrectes</div>
            </div>
            <div className="bg-light p-4 rounded-lg border border-primary/20">
              <div className="text-2xl font-bold text-primary">
                {minutes}m{seconds}s
              </div>
              <div className="text-sm text-dark font-medium">Temps total</div>
            </div>
            <div className="bg-accent/20 p-4 rounded-lg border border-secondary/30">
              <div className="text-2xl font-bold text-secondary">
                {Math.round(result.timeSpent / result.totalQuestions)}s
              </div>
              <div className="text-sm text-secondary font-medium">Par question</div>
            </div>
          </div>
        </div>

        {/* Révision détaillée */}
        <div className="p-6 border-t border-accent/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary font-heading">
            <Search className="w-5 h-5 text-primary" />
            Détail des réponses
          </h3>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {result.answers.map((answer, index) => {
              const question = questions[index];
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${answer.correct
                    ? "bg-accent/30 border-primary/50"
                    : "bg-secondary/20 border-secondary/50"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${answer.correct ? "bg-primary" : "bg-secondary"
                        }`}
                    >
                      {answer.correct ? "✓" : "✗"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-dark mb-1 font-heading">
                        Q{index + 1}: {question.question}
                      </p>
                      <p className="text-sm text-primary/80">
                        Votre réponse: {question.options[answer.userAnswer]}
                      </p>
                      {!answer.correct && (
                        <p className="text-sm text-primary font-medium mt-1">
                          <span className="font-semibold">Réponse correcte:</span> {question.reponse_correcte}
                        </p>
                      )}
                      <p className="text-sm text-dark mt-2 italic font-sans">{question.explication}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-accent/50 flex gap-4 justify-center">
          <button
            onClick={onRestart}
            className="px-6 py-2 bg-primary text-light rounded-lg hover:bg-primary/90 transition-colors font-heading flex items-center gap-2 shadow-md"
            aria-label="Recommencer le quiz"
          >
            <RotateCcw className="w-5 h-5 text-light" />
            Recommencer
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-secondary text-light rounded-lg hover:bg-secondary/90 transition-colors font-heading flex items-center gap-2 shadow-md"
            aria-label="Terminer et fermer le quiz"
          >
            <Check className="w-5 h-5 text-light" />
            Terminer
          </button>
        </div>
      </div>
    </div>
  )
}

export default function QuizOverlay({
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
          notifySuccess(`Quiz terminé ! Score: ${quizResultToSave.score}/${quizResultToSave.totalQuestions}`);

        setIsCompleted(true)
      } else {
        alert("Erreur lors de la sauvegarde du résultat.")
          notifyError("Erreur lors de la sauvegarde du résultat.");

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
            Quiz Photosynthèse
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