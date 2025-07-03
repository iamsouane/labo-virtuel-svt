"use client"

import { useState } from "react"
import QuizOverlay from "../components/QuizPhotosynthese"
import type { QuizResult, QuizQuestion } from "../components/QuizPhotosynthese"

const selectionQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Quel trait est considéré comme dominant chez les lapins ?",
    options: ["Blanc", "Brun", "Court", "Tombant"],
    correctAnswer: 1,
    explanation: "Le brun (B) est dominant sur le blanc (b) pour la couleur de la fourrure.",
    difficulty: "facile" as const,
    category: "facteurs" as const,
  },
  {
    id: 2,
    question: "Quel facteur environnemental favorise les dents longues ?",
    options: ["Présence de loups", "Nourriture molle", "Nourriture dure", "Manque de lumière"],
    correctAnswer: 2,
    explanation: "La nourriture dure requiert des dents longues pour être mâchée efficacement.",
    difficulty: "moyen" as const,
    category: "application" as const,
  },
  {
    id: 3,
    question: "Quelle est la conséquence directe de la sélection naturelle ?",
    options: [
      "Apparition d'espèces nouvelles",
      "Extinction immédiate",
      "Adaptation des individus",
      "Mutation génétique ciblée",
    ],
    correctAnswer: 2,
    explanation: "La sélection naturelle favorise les individus les plus adaptés, qui survivent et se reproduisent.",
    difficulty: "difficile" as const,
    category: "processus" as const,
  },
]

export default function QuizzSelection({ onClose }: { onClose: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ questionId: number; userAnswer: number; correct: boolean }[]>([])
  const [startTime] = useState(Date.now())
  const [showQuiz, setShowQuiz] = useState(true)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleNext = () => {
    if (selectedAnswer === null) return

    const question = selectionQuestions[currentQuestion]
    const correct = selectedAnswer === question.correctAnswer
    const newAnswers = [...answers, { questionId: question.id, userAnswer: selectedAnswer, correct }]

    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuestion === selectionQuestions.length - 1) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      const score = newAnswers.filter((a) => a.correct).length
      setQuizResult({
        score,
        totalQuestions: selectionQuestions.length,
        timeSpent,
        answers: newAnswers,
      })
      setQuizCompleted(true)
    } else {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers([])
    setQuizCompleted(false)
    setShowQuiz(true)
    setQuizResult(null)
  }

  if (!showQuiz) return null

  return (
    <QuizOverlay
      questions={selectionQuestions}
      currentQuestion={currentQuestion}
      selectedAnswer={selectedAnswer}
      onAnswerSelect={handleAnswerSelect}
      onNext={handleNext}
      onClose={() => {
        setShowQuiz(false)
        onClose()
      }}
      result={quizResult}
      completed={quizCompleted}
      onRestart={handleRestart}
    />
  )
}