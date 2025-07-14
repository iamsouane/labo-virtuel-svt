// src/components/ui/QuizSelection.tsx
import { useEffect, useState } from "react"
import QuizSelectionOverlay from "./QuizSelectionOverlay"
import { supabase } from "../../lib/supabaseClient"
import type { QuizQuestion, QuizAnswer, QuizResult } from "../../types/simulationPhotosyntheseTypes"

export default function QuizzSelection({
  simulationCode,
  onClose,
}: {
  simulationCode: string
  onClose: () => void
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime, setStartTime] = useState(Date.now())
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      const { data: simulation, error: simError } = await supabase
        .from("simulation")
        .select("quiz_id")
        .eq("code", simulationCode)
        .single()

      if (simError || !simulation?.quiz_id) {
        console.error("Erreur récupération quiz_id :", simError)
        return
      }

      const { data: questionData, error: questionError } = await supabase
        .from("question")
        .select("*")
        .eq("quiz_id", simulation.quiz_id)

      if (questionError) {
        console.error("Erreur récupération questions :", questionError)
      } else if (questionData) {
        setQuestions(questionData as QuizQuestion[])
        setStartTime(Date.now())
        setQuestionStartTime(Date.now())
      }
    }

    fetchQuizQuestions()
  }, [simulationCode])

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleNext = () => {
    if (selectedAnswer === null || questions.length === 0) return

    const question = questions[currentQuestion]
    const now = Date.now()
    const isCorrect = question.options[selectedAnswer] === question.reponse_correcte

    const newAnswer: QuizAnswer = {
      questionId: question.id, // number
      userAnswer: selectedAnswer,
      correct: isCorrect,
      timeSpent: Math.floor((now - questionStartTime) / 1000),
    }

    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)
    setSelectedAnswer(null)

    if (currentQuestion === questions.length - 1) {
      completeQuiz(updatedAnswers)
    } else {
      setCurrentQuestion((prev) => prev + 1)
      setQuestionStartTime(now)
    }
  }

  const completeQuiz = (userAnswers: QuizAnswer[]) => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000)
    const score = userAnswers.filter((a) => a.correct).length

    setResult({
      score,
      totalQuestions: questions.length,
      timeSpent: totalTime,
      answers: userAnswers,
    })
    setCompleted(true)
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers([])
    setCompleted(false)
    setResult(null)
    setStartTime(Date.now())
    setQuestionStartTime(Date.now())
  }

  if (questions.length === 0) {
    return <div className="p-4 text-center">Chargement du quiz...</div>
  }

  return (
    <QuizSelectionOverlay
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