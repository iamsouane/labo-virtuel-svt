// src/types/simulationEnergieTypes.ts

import type { ReactNode } from "react"

/* ==================== TYPES DE BASE ==================== */

export interface EnergyData {
  pedalingIntensity: number      // Intensité du pédalage (0-100)
  solarIntensity: number         // Intensité lumineuse du soleil (0-100)
  electricalPower: number        // Puissance électrique générée (W)
  outputPower: number            // Puissance délivrée aux appareils (W)
  isActive: boolean              // Simulation en cours
}

export type OutputDevice = "ampoule" | "ventilateur" | "chauffe-eau"
export type EnergySource = "velo" | "soleil"
export type GeneratorType = "panneau-solaire" | "generatrice"

/* ==================== CONFIGURATION DES APPAREILS ==================== */

export interface DeviceConfig {
  name: string
  icon: string
  description: string
  energyType: string
  efficiency: number
}

export const DEVICES: Record<OutputDevice, DeviceConfig> = {
  ampoule: {
    name: "Ampoule LED",
    icon: "",
    description: "Convertit l'électricité en lumière",
    energyType: "lumineuse",
    efficiency: 0.9,
  },
  ventilateur: {
    name: "Ventilateur",
    icon: "",
    description: "Convertit l'électricité en énergie cinétique",
    energyType: "cinétique",
    efficiency: 0.85,
  },
  "chauffe-eau": {
    name: "Chauffe-eau",
    icon: "",
    description: "Convertit l'électricité en chaleur",
    energyType: "thermique",
    efficiency: 0.95,
  },
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

export type ParticleType = "mechanical" | "solar" | "electrical" | "output"

export interface EnergyParticle {
  id: number
  x: number
  y: number
  type: ParticleType
  progress: number
}

/* ==================== TYPES TUTORIEL ==================== */

export type TutorialStep = {
  id: number
  title: ReactNode
  content: string
  tips?: string[]
  position?: "top" | "bottom" | "center" | "left" | "right"
  target?: string
  highlight?: boolean
  action?: "wait" | "adjust"
  actionValue?: number
  autoAdvance?: number
  skippable?: boolean
  icon?: ReactNode
}