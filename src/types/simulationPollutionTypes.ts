// src/types/simulationPollutionTypes.ts
import type { JSX, ReactNode } from "react"

/* ==================== DONNÉES DE POLLUTION ==================== */

export interface PollutionData {
  level: number
  source: string
  co2: number
  nox: number
  pm25: number
  aqi: number
}

export interface AQIStatus {
  label: string;
  color: string;
  textColor: string;
  icon: React.ReactNode;
  effects: {
    icon: ReactNode;
    text: string;
  }[];
  environmentalEffects: {
    icon: ReactNode;
    text: string;
  }[];
  recommendations: string[];
}


/* ==================== SOLUTIONS ENVIRONNEMENTALES ==================== */

export interface Solution {
  id: string;
  name: string;
  icon: ReactNode
  description: string;
  impact: number;
  active: boolean;
}

/* ==================== PARTICULES DE POLLUTION ==================== */

export interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  type: "pollution" | "clean" | "analysis"
}

/* ==================== VÉHICULES ==================== */

export interface Vehicle {
  id: number
  x: number
  type: "car" | "electric" | "bike"
  color: string
  speed: number
}

/* ==================== TYPES QUIZ ==================== */
export interface QuizQuestion {
  id: number
  quiz_id: string
  question: string
  options: string[]
  reponse_correcte: string
  explication: string
  difficulty: "facile" | "moyen" | "difficile"
  category: "equation" | "facteurs" | "processus" | "application" | "adaptation"
}

export interface QuizAnswer {
  questionId: number
  userAnswer: number
  correct: boolean
  timeSpent: number
}

export interface QuizResult {
  score: number
  totalQuestions: number
  timeSpent: number
  answers: QuizAnswer[]
}

export interface LocalQuizAnswer {
  questionId: number;
  userAnswer: number;
  correct: boolean;
  timeSpent: number;
}

export interface LocalQuizResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: LocalQuizAnswer[];
}

/* ==================== TOOLTIP ==================== */

export interface TooltipData {
  title: string | ReactNode
  description: string
  x: number
  y: number
}

/* ==================== TYPES TUTORIEL ==================== */
export interface TutorialStep {
  id: number
  title: string | JSX.Element
  content: string
  icon?: ReactNode
  target?: string
  position: "top" | "bottom" | "left" | "right" | "center"
  action?: "click" | "hover" | "wait" | "adjust"
  actionTarget?: string
  actionValue?: number
  highlight?: boolean
  skippable?: boolean
  autoAdvance?: number
  tips?: string[]
}