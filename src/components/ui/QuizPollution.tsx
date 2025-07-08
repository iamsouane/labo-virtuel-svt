// src/components/ui/QuizPollution.tsx
import { useEffect, useState } from "react"
import { QUIZ_QUESTIONS_POLLUTION } from "../../data/quizPollution"
import type { QuizResult } from "../../types/simulationPollutionTypes"
import QuizOverlay from "./QuizPollutionOverlay"

export default function QuizzPollution({ onClose }: { onClose: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<
    { questionId: number; userAnswer: number; correct: boolean }[]
  >([])
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime, setStartTime] = useState<number>(Date.now())

  useEffect(() => {
    setStartTime(Date.now())
  }, [])

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNext = () => {
    if (selectedAnswer === null) return

    const question = QUIZ_QUESTIONS_POLLUTION[currentQuestion]
    const isCorrect = selectedAnswer === question.correctAnswer

    const updatedAnswers = [
      ...answers,
      {
        questionId: question.id,
        userAnswer: selectedAnswer,
        correct: isCorrect,
      },
    ]
    setAnswers(updatedAnswers)
    setSelectedAnswer(null)

    if (currentQuestion < QUIZ_QUESTIONS_POLLUTION.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      const score = updatedAnswers.filter((a) => a.correct).length

      const finalResult: QuizResult = {
        score,
        totalQuestions: QUIZ_QUESTIONS_POLLUTION.length,
        timeSpent,
        answers: updatedAnswers,
      }

      setResult(finalResult)
      setCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers([])
    setCompleted(false)
    setResult(null)
    setStartTime(Date.now())
  }

  return (
    <QuizOverlay
      questions={QUIZ_QUESTIONS_POLLUTION}
      currentQuestion={currentQuestion}
      selectedAnswer={selectedAnswer}
      onAnswerSelect={handleAnswerSelect}
      onNext={handleNext}
      onClose={onClose}
      result={result}
      completed={completed}
      onRestart={handleRestart}
    />
  )
}
