// src/types/simulationPhotosyntheseTypes.ts
import type { ReactNode, JSX } from "react"

/* ==================== TYPES DE BASE ==================== */
export interface PlantState {
  health: number
  size: number
  oxygenProduction: number
  glucoseProduction: number
}

export type PlantGenetics = {
  id: string
  name: string
  species: "default" | "c3" | "c4" | "cam"
  leafSize: "small" | "medium" | "large"
  pigmentType: "chlorophyllA" | "chlorophyllB" | "both"
  
  // Génétique
  sizeAlleles: [string, string]
  pigmentAlleles: [string, string]
  
  photosyntheticFactors: {
    lightEfficiency: number
    co2FixationRate: number
    waterUseEfficiency: number
  }
  
  generation: number
  parentIds?: [string, string]
  createdAt: number
}

/* ==================== TYPES ENVIRONNEMENT ==================== */
export interface LabEnvironment {
  lightIntensity: number
  co2Level: number
  temperature: number
  humidity: number
}

export type PhotosynthesisEnvironment = LabEnvironment & {
  waterAvailability: number
}

/* ==================== TYPES DONNÉES ==================== */
export interface DataPoint {
  time: number
  oxygen: number
  glucose: number
  health: number
}

export type ExperimentDataPoint = DataPoint & {
  stats: PhotosynthesisStats
  environment: PhotosynthesisEnvironment
}

export type PhotosynthesisStats = {
  oxygenProduction: number
  glucoseProduction: number
  waterUsage: number
  quantumYield: number
  healthStatus: number
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

/* ==================== TYPES QUIZ ==================== */
export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
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

/* ==================== TYPES SIMULATION ==================== */
export type PhotosynthesisSimulationState = {
  plants: PlantGenetics[]
  environment: PhotosynthesisEnvironment
  currentExperimentTime: number
  isRunning: boolean
  dataPoints: ExperimentDataPoint[]
  activePreset?: string
}

/* ==================== TYPES COMPOSANTS ==================== */
export interface Preset {
  id: string
  name: string
  description: string
  icon: ReactNode
  environment: PhotosynthesisEnvironment
  color: string
}

export type PlantDisplayProps = {
  genetics: PlantGenetics
  size?: "small" | "medium" | "large"
  selected?: boolean
  onClick?: () => void
  environment?: PhotosynthesisEnvironment
}

export type EnvironmentControlProps = {
  environment: PhotosynthesisEnvironment
  onEnvironmentChange: (newEnv: Partial<PhotosynthesisEnvironment>) => void
  presets?: Preset[]
}

/* ==================== TYPES FONCTIONS ==================== */
export type CreatePlantFn = (options?: {
  species?: PlantGenetics['species']
  parentIds?: [string, string]
  traits?: Partial<PlantGenetics>
}) => PlantGenetics

export type SimulatePhotosynthesisFn = (
  plants: PlantGenetics[],
  environment: PhotosynthesisEnvironment,
  timeElapsed: number
) => {
  updatedPlants: PlantGenetics[]
  stats: PhotosynthesisStats
  explanation: PhotosynthesisExplanation
}

export type PhotosynthesisExplanation = {
  lightReactions: {
    psiiActivity: number
    atpProduction: number
    nadphProduction: number
  }
  calvinCycle: {
    rubiscoActivity: number
    co2Fixation: number
    glucoseOutput: number
  }
  limitingFactors: string[]
  efficiencyMetrics: {
    lightUseEfficiency: number
    waterUseEfficiency: number
    quantumYield: number
  }
}