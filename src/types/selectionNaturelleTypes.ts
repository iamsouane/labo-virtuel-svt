// src/types/selectionNaturelleTypes.ts

/* ==================== TYPES DE BASE ==================== */

export type RabbitGenetics = {
  id: string
  name: string
  furColor: "brown" | "white"
  earType: "straight" | "floppy"
  toothLength: "long" | "short"
  
  // Génétique mendélienne
  furAlleles: [string, string]  // ["B", "b"] - B=brun (dominant), b=blanc (récessif)
  earAlleles: [string, string]  // ["E", "e"] - E=droit (dominant), e=tombant (récessif)
  toothAlleles: [string, string] // ["L", "l"] - L=long (dominant), l=court (récessif)
  
  // Facteurs de survie (phénotype étendu)
  survivalFactors: {
    speed: number              // 0-100 - Vitesse de course
    camouflage: number         // 0-100 - Capacité de camouflage
    chewingEfficiency: number  // 0-100 - Efficacité mastication
  }
  
  // Généalogie
  parents?: [string, string]   // IDs des parents
  generation: number           // Génération actuelle
  isAlive: boolean             // Statut de vie
  birthGeneration: number      // Génération de naissance
}

/* ==================== TYPES ENVIRONNEMENT ==================== */

export type EnvironmentalFactors = {
  wolvesPresent: boolean      // Présence de prédateurs
  foodHardness: boolean       // Nourriture dure nécessitant de longues dents
  foodScarcity: boolean       // Pénurie alimentaire
  temperature: "cold" | "moderate" | "hot" // Influence la fourrure
}

/* ==================== TYPES STATISTIQUES ==================== */

export type GenerationStats = {
  totalPopulation: number
  traitFrequencies: Record<string, number> // Ex: { "brown": 0.75, "white": 0.25 }
  generationNumber: number
  survivalRate: number        // Taux de survie (0-1)
}

export type StatsDataPoint = {
  generation: number
  population: number
  traits?: {
    fur: { brown: number; white: number }
    ears: { straight: number; floppy: number }
    teeth: { long: number; short: number }
  }
}

/* ==================== TYPES EXPLICATIONS ==================== */

export type TraitExplanation = {
  alleles: [string, string]   // Allèles hérités
  phenotype: string           // Phénotype résultant
  advantage?: string          // Avantage évolutif
}

export type GenerationExplanation = {
  generation: number
  parentInfo: {
    parent1: RabbitGenetics
    parent2: RabbitGenetics
  }
  offspringCount: number
  traitExplanations: {
    fur: TraitExplanation
    ear: TraitExplanation
    tooth: TraitExplanation
  }
  environmentalEffects: string[]
  selectionPressures: string[] // Pressions sélectives appliquées
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

/* ==================== TYPES SIMULATION ==================== */

export type SimulationState = {
  rabbits: RabbitGenetics[]
  environment: EnvironmentalFactors
  currentGeneration: number
  isRunning: boolean
  timeElapsed: number         // Temps écoulé en secondes
}

/* ==================== TYPES COMPOSANTS ==================== */

export type RabbitDisplayProps = {
  genetics: RabbitGenetics
  size?: "small" | "medium" | "large"
  selected?: boolean
  onClick?: () => void
}

export type EnvironmentControlProps = {
  environment: EnvironmentalFactors
  onEnvironmentChange: (newEnv: EnvironmentalFactors) => void
}

/* ==================== TYPES FONCTIONS ==================== */

export type CreateRabbitFn = (options?: {
  generation?: number
  parents?: [RabbitGenetics, RabbitGenetics]
  traits?: Partial<RabbitGenetics>
}) => RabbitGenetics

export type SimulateGenerationFn = (
  currentRabbits: RabbitGenetics[],
  environment: EnvironmentalFactors,
  generation: number
) => {
  newGeneration: RabbitGenetics[]
  explanation: GenerationExplanation
}