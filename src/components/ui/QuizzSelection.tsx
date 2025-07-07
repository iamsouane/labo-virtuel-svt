// src/components/ui/QuizzSelection.tsx
import { useState } from "react"
import { QUIZ_QUESTIONS_SELECTION } from "../../data/quizSelection"
import type { QuizResult } from "../../types/selectionNaturelleTypes"
import QuizSelectionOverlay from "./QuizSelectionOverlay"

interface QuizAnswer {
  questionId: number
  userAnswer: number
  correct: boolean
}

export default function QuizzSelection({ onClose }: { onClose: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime] = useState<number>(Date.now())

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNext = () => {
    if (selectedAnswer === null) return

    const question = QUIZ_QUESTIONS_SELECTION[currentQuestion]
    const newAnswer: QuizAnswer = {
      questionId: question.id,
      userAnswer: selectedAnswer,
      correct: selectedAnswer === question.correctAnswer
    }

    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (isLastQuestion) {
      completeQuiz(newAnswers)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const completeQuiz = (userAnswers: QuizAnswer[]) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const score = userAnswers.filter(a => a.correct).length

    setResult({
      score,
      totalQuestions: QUIZ_QUESTIONS_SELECTION.length,
      timeSpent,
      answers: userAnswers
    })
    setCompleted(true)
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers([])
    setCompleted(false)
    setResult(null)
  }

  const isLastQuestion = currentQuestion === QUIZ_QUESTIONS_SELECTION.length - 1

  return (
    <QuizSelectionOverlay
      questions={QUIZ_QUESTIONS_SELECTION}
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