//src/components/ui/QuizPhotosynthese.tsx
import { useEffect, useState } from "react"
import QuizOverlay from "./QuizPhotosyntheseOverlay"
import { supabase } from "../../lib/supabaseClient"
import type { QuizQuestion } from "../../types/simulationPhotosyntheseTypes"

export default function QuizPhotosynthese({
  simulationCode,
  onClose,
}: {
  simulationCode: string
  onClose: () => void
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const fetchQuizFromSimulation = async () => {
      // 1. On récupère la simulation via son code
      const { data: simulation, error: simError } = await supabase
        .from("simulation")
        .select("quiz_id")
        .eq("code", simulationCode)
        .single()

      if (simError || !simulation?.quiz_id) {
        console.error("Quiz non trouvé pour la simulation :", simError)
        return
      }

      // 2. On récupère les questions du quiz lié
      const { data: questionData, error: questionError } = await supabase
        .from("question")
        .select("*")
        .eq("quiz_id", simulation.quiz_id)

      if (questionData) {
        setQuestions(questionData)
      } else {
        console.error("Erreur chargement questions :", questionError)
      }
    }

    fetchQuizFromSimulation()
  }, [simulationCode])

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setCompleted(false)
  }

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setCurrentQuestion((prev) => prev + 1)
  }

  return (
    <QuizOverlay
    questions={questions}
    currentQuestion={currentQuestion}
    selectedAnswer={selectedAnswer}
    onClose={onClose}
    onRestart={handleRestart}
    onAnswerSelect={handleAnswerSelect}
    onNext={handleNext}
    completed={completed}
    simulationCode={simulationCode} 
  />
  )
}