//src/types/simulationPhotosyntheseTypes
import type { ReactNode } from "react"

export interface PlantState {
  health: number
  size: number
  oxygenProduction: number
  glucoseProduction: number
}

export interface LabEnvironment {
  lightIntensity: number
  co2Level: number
  temperature: number
  humidity: number
}

export interface DataPoint {
  time: number
  oxygen: number
  glucose: number
  health: number
}

export interface Preset {
  name: string
  description: string
  icon: ReactNode
  environment: LabEnvironment
  color: string
}

export interface TutorialStep {
  id: number
  title: string
  content: string
  target: string
  position: "top" | "bottom" | "left" | "right" | "center"
  action?: "click" | "hover" | "wait" | "adjust"
  actionTarget?: string
  actionValue?: number
  highlight?: boolean
  skippable?: boolean
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "facile" | "moyen" | "difficile"
  category: "equation" | "facteurs" | "processus" | "application"
}

export interface QuizAnswer {
  questionId: number
  userAnswer: number
  correct: boolean
}

export interface QuizResult {
  score: number
  totalQuestions: number
  timeSpent: number
  answers: QuizAnswer[]
}

