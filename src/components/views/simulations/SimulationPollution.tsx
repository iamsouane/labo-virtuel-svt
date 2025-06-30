"use client"

import type React from "react"
import { useState, useEffect } from "react"
import GuideTutorielPollution from "./GuideTutorielPollution"
import AidePollution from "../../AidePollution"
import QuizPollution from "../../QuizPollution"

// Composant Badge inline
const Badge = ({
  children,
  className,
  style,
}: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    style={style}
  >
    {children}
  </span>
)

// Composant Button inline
const Button = ({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
  >
    {children}
  </button>
)

interface PollutionData {
  level: number
  source: string
  co2: number
  nox: number
  pm25: number
  aqi: number
}

interface Solution {
  id: string
  name: string
  icon: string
  active: boolean
  impact: number
}

interface Particle {
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

interface Vehicle {
  id: number
  x: number
  type: "car" | "electric" | "bike"
  color: string
  speed: number
}

// Interface pour les réponses du quiz
interface QuizAnswer {
  questionId: number
  userAnswer: number // Changed from selectedAnswer to userAnswer
  correct: boolean
  timeSpent: number
}

// Interface pour le résultat du quiz
interface QuizResult {
  score: number
  totalQuestions: number
  timeSpent: number
  answers: QuizAnswer[]
}

export default function SimulationPollution() {
  const [pollutionData, setPollutionData] = useState<PollutionData>({
    level: 50,
    source: "voiture",
    co2: 400,
    nox: 30,
    pm25: 25,
    aqi: 75,
  })

  const [carCount, setCarCount] = useState(1)
  const [industryCount, setIndustryCount] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [particles, setParticles] = useState<Particle[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [animationTime, setAnimationTime] = useState(0)
  const [solutions, setSolutions] = useState<Solution[]>([
    { id: "electric", name: "Voiture électrique", icon: "🚗", active: false, impact: 20 },
    { id: "filter", name: "Filtre industriel", icon: "🏭", active: false, impact: 25 },
    { id: "bike", name: "Piste cyclable", icon: "🚴", active: false, impact: 15 },
    { id: "solar", name: "Énergie solaire", icon: "☀️", active: false, impact: 30 },
    { id: "trees", name: "Plantation d'arbres", icon: "🌳", active: false, impact: 10 },
  ])

  const [tooltip, setTooltip] = useState<{
    title: string
    description: string
    x: number
    y: number
  } | null>(null)

  const [showQuiz, setShowQuiz] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [quizCurrentQuestion, setQuizCurrentQuestion] = useState(0)
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<number | null>(null)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizStartTime, setQuizStartTime] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]) // État pour stocker les réponses
  const [questionStartTime, setQuestionStartTime] = useState(0) // Temps de début de chaque question

  const handleQuizStart = () => {
    setShowQuiz(true)
    setQuizStartTime(Date.now())
    setQuestionStartTime(Date.now())
    setQuizCurrentQuestion(0)
    setQuizSelectedAnswer(null)
    setQuizResult(null)
    setQuizCompleted(false)
    setQuizAnswers([]) // Réinitialiser les réponses
  }

  const handleQuizAnswerSelect = (answerIndex: number) => {
    setQuizSelectedAnswer(answerIndex)
  }

  const handleQuizNext = () => {
    if (quizSelectedAnswer === null) return

    const currentQuestion = quizQuestions[quizCurrentQuestion]
    const isCorrect = quizSelectedAnswer === currentQuestion.correctAnswer
    const questionTimeSpent = Math.floor((Date.now() - questionStartTime) / 1000)

    // Ajouter la réponse actuelle au tableau des réponses
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      userAnswer: quizSelectedAnswer, // Changed from selectedAnswer to userAnswer
      correct: isCorrect,
      timeSpent: questionTimeSpent,
    }

    const updatedAnswers = [...quizAnswers, newAnswer]
    setQuizAnswers(updatedAnswers)

    if (quizCurrentQuestion < quizQuestions.length - 1) {
      setQuizCurrentQuestion(quizCurrentQuestion + 1)
      setQuizSelectedAnswer(null)
      setQuestionStartTime(Date.now()) // Nouveau temps de début pour la prochaine question
    } else {
      const totalTimeSpent = Math.floor((Date.now() - quizStartTime) / 1000)
      const score = updatedAnswers.filter((a) => a.correct).length

      setQuizResult({
        score,
        totalQuestions: quizQuestions.length,
        timeSpent: totalTimeSpent,
        answers: updatedAnswers,
      })
      setQuizCompleted(true)
    }
  }

  const handleQuizRestart = () => {
    setQuizCurrentQuestion(0)
    setQuizSelectedAnswer(null)
    setQuizResult(null)
    setQuizCompleted(false)
    setQuizStartTime(Date.now())
    setQuestionStartTime(Date.now())
    setQuizAnswers([]) // Réinitialiser les réponses
  }

  const quizQuestions = [
    {
      id: 1,
      question: "Quelle est la concentration normale de CO₂ dans l'atmosphère ?",
      options: ["280 ppm", "350 ppm", "420 ppm", "500 ppm"],
      correctAnswer: 2,
      explanation:
        "En 2023, la concentration de CO₂ atmosphérique dépasse 420 ppm, soit une augmentation de 50% depuis l'ère préindustrielle (280 ppm).",
      difficulty: "moyen" as const,
      category: "concepts" as const,
    },
    {
      id: 2,
      question: "Combien de CO₂ émet une voiture moyenne par kilomètre ?",
      options: ["50g", "120g", "200g", "300g"],
      correctAnswer: 1,
      explanation:
        "Une voiture thermique émet en moyenne 120g de CO₂ par kilomètre parcouru, variant selon le type de carburant et l'efficacité du moteur.",
      difficulty: "facile" as const,
      category: "emissions" as const,
    },
    {
      id: 3,
      question: "Que signifie PM2.5 ?",
      options: ["Particules de 2,5 mm", "Particules de 2,5 µm", "Pollution Majeure 2.5", "Pression Maximale 2.5"],
      correctAnswer: 1,
      explanation:
        "PM2.5 désigne les particules fines d'un diamètre inférieur à 2,5 micromètres, soit 100 fois plus fines qu'un cheveu humain.",
      difficulty: "moyen" as const,
      category: "concepts" as const,
    },
    {
      id: 4,
      question: "À partir de quel AQI l'air est-il considéré comme dangereux ?",
      options: ["100", "150", "200", "300"],
      correctAnswer: 3,
      explanation:
        "Un AQI supérieur à 300 indique un air dangereux pour tous, nécessitant d'éviter toute activité extérieure.",
      difficulty: "difficile" as const,
      category: "sante" as const,
    },
    {
      id: 5,
      question: "Quel polluant cause principalement les pluies acides ?",
      options: ["CO₂", "NOx", "PM2.5", "O₃"],
      correctAnswer: 1,
      explanation:
        "Les oxydes d'azote (NOx) se transforment en acide nitrique dans l'atmosphère, contribuant aux pluies acides qui endommagent les écosystèmes.",
      difficulty: "moyen" as const,
      category: "environnement" as const,
    },
  ]

  // Animation principale
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((prev) => prev + 1)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Calcul des polluants selon le nombre de voitures/industries
  useEffect(() => {
    const activeSolutionsImpact = solutions.filter((s) => s.active).reduce((sum, s) => sum + s.impact, 0)
    const reductionFactor = Math.max(0.1, 1 - activeSolutionsImpact / 100)

    let baseCo2, baseNox, basePm25

    if (pollutionData.source === "voiture") {
      // Données réelles : Une voiture émet en moyenne 120g CO₂/km, 0.4g NOx/km, 0.005g PM2.5/km
      // Simulation pour 1000 voitures sur 10km par jour
      baseCo2 = 350 + carCount * 32 // ppm (base atmosphérique + émissions)
      baseNox = 15 + carCount * 12 // µg/m³
      basePm25 = 8 + carCount * 4 // µg/m³
    } else {
      // Données réelles : Une usine moyenne émet 50 000 tonnes CO₂/an, 150 tonnes NOx/an, 25 tonnes PM2.5/an
      baseCo2 = 350 + industryCount * 85 // ppm
      baseNox = 15 + industryCount * 35 // µg/m³
      basePm25 = 8 + industryCount * 18 // µg/m³
    }

    const newCo2 = Math.round(baseCo2 * reductionFactor)
    const newNox = Math.round(baseNox * reductionFactor)
    const newPm25 = Math.round(basePm25 * reductionFactor)

    // Calcul AQI selon la formule EPA officielle (simplifié)
    const aqiCo2 = Math.min(500, (newCo2 - 350) / 2) // Base 350ppm normale
    const aqiNox = Math.min(500, newNox * 2.5) // Seuil 40µg/m³ = 100 AQI
    const aqiPm25 = Math.min(500, newPm25 * 2.8) // Seuil 35µg/m³ = 100 AQI

    const newAqi = Math.round(Math.max(aqiCo2, aqiNox, aqiPm25))
    const newLevel = Math.min(100, Math.round((newAqi / 200) * 100))

    setPollutionData((prev) => ({
      ...prev,
      level: newLevel,
      co2: newCo2,
      nox: newNox,
      pm25: newPm25,
      aqi: Math.min(500, newAqi),
    }))
  }, [carCount, industryCount, pollutionData.source, solutions])

  // Animation des particules
  useEffect(() => {
    const solutionImpact = solutions.filter((s) => s.active).reduce((sum, s) => sum + s.impact, 0)
    const effectivePollution = Math.max(0, pollutionData.level - solutionImpact)

    const interval = setInterval(() => {
      setParticles((prev) => {
        let newParticles = [...prev]

        // Supprimer les particules anciennes
        newParticles = newParticles.filter((p) => p.opacity > 0)

        // Ajouter de nouvelles particules de pollution
        if (effectivePollution > 20) {
          const particleCount = Math.floor(effectivePollution / 15)
          for (let i = 0; i < particleCount; i++) {
            if (Math.random() < 0.3) {
              newParticles.push({
                id: Date.now() + Math.random(),
                x: Math.random() * 100,
                y: 80 + Math.random() * 20,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -Math.random() * 0.3 - 0.1,
                size: Math.random() * 3 + 1,
                opacity: 0.6,
                color: effectivePollution > 60 ? "#666" : "#999",
                type: "pollution",
              })
            }
          }
        }

        // Ajouter des particules propres si solutions actives
        if (solutionImpact > 30) {
          if (Math.random() < 0.2) {
            newParticles.push({
              id: Date.now() + Math.random(),
              x: Math.random() * 100,
              y: 85,
              vx: (Math.random() - 0.5) * 0.3,
              vy: -Math.random() * 0.2 - 0.05,
              size: Math.random() * 2 + 1,
              opacity: 0.4,
              color: "#4ade80",
              type: "clean",
            })
          }
        }

        // Ajouter des particules d'analyse
        if (isAnalyzing) {
          for (let i = 0; i < 3; i++) {
            newParticles.push({
              id: Date.now() + Math.random(),
              x: 50 + (Math.random() - 0.5) * 30,
              y: 50 + (Math.random() - 0.5) * 30,
              vx: (Math.random() - 0.5) * 1,
              vy: (Math.random() - 0.5) * 1,
              size: Math.random() * 4 + 2,
              opacity: 0.8,
              color: "#3b82f6",
              type: "analysis",
            })
          }
        }

        // Mettre à jour les positions
        return newParticles.map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          opacity: particle.type === "analysis" ? particle.opacity - 0.02 : particle.opacity - 0.005,
          vy: particle.type === "pollution" ? particle.vy - 0.001 : particle.vy,
        }))
      })
    }, 50)

    return () => clearInterval(interval)
  }, [pollutionData.level, solutions, isAnalyzing])

  // Animation des véhicules
  useEffect(() => {
    const hasElectric = solutions.find((s) => s.id === "electric")?.active
    const hasBike = solutions.find((s) => s.id === "bike")?.active

    const interval = setInterval(() => {
      setVehicles((prev) => {
        let newVehicles = [...prev]

        // Supprimer les véhicules sortis de l'écran (côté gauche maintenant)
        newVehicles = newVehicles.filter((v) => v.x > -10)

        // Ajouter de nouveaux véhicules selon le nombre de voitures
        const vehicleSpawnRate = Math.min(0.3, carCount * 0.05)

        if (Math.random() < vehicleSpawnRate) {
          const vehicleTypes = []

          if (!hasElectric) {
            vehicleTypes.push(
              { type: "car" as const, color: "#ef4444", speed: -0.8 },
              { type: "car" as const, color: "#3b82f6", speed: -0.7 },
              { type: "car" as const, color: "#6b7280", speed: -0.9 },
            )
          } else {
            vehicleTypes.push(
              { type: "electric" as const, color: "#10b981", speed: -0.6 },
              { type: "electric" as const, color: "#06b6d4", speed: -0.7 },
            )
          }

          if (hasBike) {
            vehicleTypes.push({ type: "bike" as const, color: "#f59e0b", speed: -0.4 })
          }

          const randomVehicle = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)]

          newVehicles.push({
            id: Date.now() + Math.random(),
            x: 105, // Commencer du côté droit
            ...randomVehicle,
          })
        }

        // Mettre à jour les positions
        return newVehicles.map((vehicle) => ({
          ...vehicle,
          x: vehicle.x + vehicle.speed,
        }))
      })
    }, 100)

    return () => clearInterval(interval)
  }, [solutions, carCount])

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => setIsAnalyzing(false), 3000)
  }

  const handleSolutionToggle = (solutionId: string) => {
    setSolutions((prev) => prev.map((s) => (s.id === solutionId ? { ...s, active: !s.active } : s)))
  }

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { label: "Bon", color: "bg-green-500", textColor: "text-green-700" }
    if (aqi <= 100) return { label: "Modéré", color: "bg-yellow-500", textColor: "text-yellow-700" }
    if (aqi <= 150) return { label: "Mauvais", color: "bg-orange-500", textColor: "text-orange-700" }
    if (aqi <= 200) return { label: "Très mauvais", color: "bg-red-500", textColor: "text-red-700" }
    return { label: "Dangereux", color: "bg-purple-500", textColor: "text-purple-700" }
  }

  const aqiStatus = getAQIStatus(pollutionData.aqi)
  const solutionImpact = solutions.filter((s) => s.active).reduce((sum, s) => sum + s.impact, 0)
  const effectivePollution = Math.max(0, pollutionData.level - solutionImpact)

  const sources = [
    { value: "voiture", label: "🚗 Transport", color: "text-red-600" },
    { value: "industrie", label: "🏭 Industrie", color: "text-gray-600" },
  ]

  return (
    <div className="h-screen bg-gradient-to-br from-gray-100 to-blue-50 overflow-hidden">
      {/* Header fixe avec animations */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4 relative overflow-hidden">
        {/* Particules de fond dans le header */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${10 + i * 20}%`,
                top: `${20 + Math.sin(animationTime * 0.1 + i) * 10}px`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>

        <div className="flex justify-between items-center max-w-7xl mx-auto relative z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 animate-pulse">
              🌫️ Pollution de l'air – Laboratoire Virtuel
            </h1>
            <p className="text-sm text-gray-600">Explorez les causes et solutions de la pollution atmosphérique</p>
          </div>

          <div className="flex items-center gap-4">
            <Badge
              className={`${aqiStatus.color} text-white px-3 py-1 animate-bounce`}
              style={{ animationDuration: "2s" }}
            >
              AQI: {pollutionData.aqi} - {aqiStatus.label}
            </Badge>

            <Button
              onClick={() => setShowTutorial(true)}
              className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105 text-sm px-3 py-1"
            >
              📚 Guide
            </Button>

            <Button
              onClick={handleQuizStart}
              className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 hover:scale-105 text-sm px-3 py-1"
            >
              🧠 Quiz
            </Button>

            <Button
              onClick={() => setShowHelp(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white transition-all duration-300 hover:scale-105 text-sm px-3 py-1"
            >
              ❓ Aide
            </Button>

            <Button
              onClick={() => setShowControls(!showControls)}
              className="bg-gray-500 hover:bg-gray-600 text-white transition-all duration-300 hover:scale-105 text-sm px-3 py-1"
            >
              {showControls ? "🔧 Masquer" : "🔧 Afficher"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Panneau de contrôle latéral avec animations */}
        <div
          className={`transition-all duration-500 ${showControls ? "w-80" : "w-0"} overflow-hidden bg-white border-r border-gray-200 shadow-lg`}
        >
          <div className="p-4 h-full overflow-y-auto">
            <div className="space-y-6">
              {/* Source avec animation */}
              <div className="transform transition-all duration-300 hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">🏭 Source de pollution</label>
                <select
                  value={pollutionData.source}
                  onChange={(e) => setPollutionData((prev) => ({ ...prev, source: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-300"
                >
                  {sources.map((source) => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contrôle du nombre de voitures */}
              {pollutionData.source === "voiture" && (
                <div
                  className="transform transition-all duration-300 hover:scale-105"
                  onMouseEnter={(e) =>
                    setTooltip({
                      title: "🚗 Nombre de voitures",
                      description: "Plus de voitures = plus de pollution atmosphérique",
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🚗 Nombre de voitures: {carCount}
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => setCarCount(Math.max(0, carCount - 1))}
                      disabled={carCount <= 0}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
                    >
                      -
                    </Button>
                    <div className="flex-1 text-center">
                      <div className="bg-blue-50 p-2 rounded border border-blue-200">
                        <span className="text-lg font-bold text-blue-700">{carCount}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => setCarCount(Math.min(20, carCount + 1))}
                      disabled={carCount >= 20}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm"
                    >
                      +
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Impact: +{carCount * 32} CO₂ ppm, +{carCount * 12} NOx µg/m³
                  </div>
                </div>
              )}

              {/* Contrôle du nombre d'industries */}
              {pollutionData.source === "industrie" && (
                <div
                  className="transform transition-all duration-300 hover:scale-105"
                  onMouseEnter={(e) =>
                    setTooltip({
                      title: "🏭 Nombre d'industries",
                      description: "Plus d'industries = plus de pollution industrielle",
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏭 Nombre d'industries: {industryCount}
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => setIndustryCount(Math.max(0, industryCount - 1))}
                      disabled={industryCount <= 0}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
                    >
                      -
                    </Button>
                    <div className="flex-1 text-center">
                      <div className="bg-gray-50 p-2 rounded border border-gray-200">
                        <span className="text-lg font-bold text-gray-700">{industryCount}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => setIndustryCount(Math.min(10, industryCount + 1))}
                      disabled={industryCount >= 10}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm"
                    >
                      +
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Impact: +{industryCount * 85} CO₂ ppm, +{industryCount * 35} NOx µg/m³
                  </div>
                </div>
              )}

              {/* Bouton analyse avec animation */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`w-full transition-all duration-300 transform hover:scale-105 ${
                  isAnalyzing ? "bg-yellow-500 animate-pulse scale-110" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <span className="animate-spin mr-2">🔄</span>
                    Analyse en cours...
                  </>
                ) : (
                  <>🔬 Analyser</>
                )}
              </Button>

              {/* Mesures avec animations */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "CO₂",
                    value: pollutionData.co2,
                    color: "red",
                    delay: "0s",
                    tooltip: {
                      title: "💨 Dioxyde de Carbone (CO₂)",
                      description:
                        "Gaz à effet de serre principal. Concentration normale : 350-420 ppm. Cause le réchauffement climatique. Sources : combustion fossile, déforestation.",
                    },
                  },
                  {
                    label: "NOx",
                    value: pollutionData.nox,
                    color: "orange",
                    delay: "0.1s",
                    tooltip: {
                      title: "🔥 Oxydes d'Azote (NOx)",
                      description:
                        "Gaz toxiques (NO, NO₂). Seuil OMS : 40 µg/m³. Causent asthme, pluies acides. Sources : véhicules, centrales thermiques.",
                    },
                  },
                  {
                    label: "PM2.5",
                    value: pollutionData.pm25,
                    color: "purple",
                    delay: "0.2s",
                    tooltip: {
                      title: "🫁 Particules Fines (PM2.5)",
                      description:
                        "Particules < 2,5 µm. Seuil OMS : 15 µg/m³. Pénètrent dans le sang, causent cancers, AVC. Sources : diesel, industrie, feux.",
                    },
                  },
                  {
                    label: "AQI",
                    value: pollutionData.aqi,
                    color: aqiStatus.color.includes("green")
                      ? "green"
                      : aqiStatus.color.includes("yellow")
                        ? "yellow"
                        : aqiStatus.color.includes("orange")
                          ? "orange"
                          : aqiStatus.color.includes("red")
                            ? "red"
                            : "purple",
                    delay: "0.3s",
                    tooltip: {
                      title: "📊 Indice de Qualité de l'Air (AQI)",
                      description:
                        "Échelle 0-500. Bon: 0-50, Modéré: 51-100, Mauvais: 101-150, Très mauvais: 151-200, Dangereux: 201-300, Urgence: >300.",
                    },
                  },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className={`bg-${item.color}-50 p-2 rounded border border-${item.color}-200 transform transition-all duration-300 hover:scale-110 animate-pulse cursor-pointer`}
                    style={{ animationDelay: item.delay, animationDuration: "2s" }}
                    onMouseEnter={(e) =>
                      setTooltip({
                        title: item.tooltip.title,
                        description: item.tooltip.description,
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <div className={`text-xs text-${item.color}-600`}>{item.label}</div>
                    <div className={`font-bold text-${item.color}-700`}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Solutions avec animations */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 animate-bounce" style={{ animationDuration: "3s" }}>
                  🛠️ Solutions (-{solutionImpact}%)
                </h3>
                <div className="space-y-2">
                  {solutions.map((solution, index) => (
                    <button
                      key={solution.id}
                      onClick={() => handleSolutionToggle(solution.id)}
                      className={`w-full p-2 rounded-lg border text-left transition-all duration-300 transform hover:scale-105 ${
                        solution.active
                          ? "border-green-400 bg-green-50 text-green-800 animate-pulse"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                            {solution.icon}
                          </span>
                          <span className="text-sm font-medium">{solution.name}</span>
                        </div>
                        <span className="text-xs text-green-600 animate-pulse">-{solution.impact}%</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Effets santé avec animation */}
              <div className="bg-red-50 p-3 rounded-lg border border-red-200 transform transition-all duration-300 hover:scale-105">
                <h4 className="font-semibold text-red-800 mb-2 animate-pulse">🏥 Effets Santé</h4>
                <div className="text-sm text-red-700">
                  {pollutionData.aqi <= 50 && <span className="animate-bounce">😊 Aucun effet néfaste</span>}
                  {pollutionData.aqi > 50 && pollutionData.aqi <= 100 && (
                    <span className="animate-pulse">😐 Léger inconfort</span>
                  )}
                  {pollutionData.aqi > 100 && pollutionData.aqi <= 150 && (
                    <span className="animate-bounce">😷 Irritation respiratoire</span>
                  )}
                  {pollutionData.aqi > 150 && pollutionData.aqi <= 200 && (
                    <span className="animate-pulse">🤒 Problèmes de santé</span>
                  )}
                  {pollutionData.aqi > 200 && <span className="animate-bounce">🚨 Urgence sanitaire</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone de simulation principale avec animations avancées */}
        <div className="flex-1 relative">
          {/* Background de laboratoire animé */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300">
              <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute border-gray-400 border-r border-b transition-all duration-1000"
                    style={{
                      left: `${(i % 10) * 10}%`,
                      top: `${Math.floor(i / 10) * 33}%`,
                      width: "10%",
                      height: "33%",
                      opacity: 0.3 + Math.sin(animationTime * 0.05 + i) * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Équipements animés */}
            {[
              { icon: "🔬", x: 8, y: 8, rotation: Math.sin(animationTime * 0.02) * 5 },
              { icon: "💻", x: 92, y: 8, rotation: Math.sin(animationTime * 0.03) * 3 },
              { icon: "⚗️", x: 8, y: 92, rotation: Math.sin(animationTime * 0.025) * 4 },
              { icon: "📊", x: 92, y: 92, rotation: Math.sin(animationTime * 0.035) * 6 },
            ].map((item, i) => (
              <div
                key={i}
                className="absolute text-4xl opacity-20 transition-all duration-100"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: `rotate(${item.rotation}deg) scale(${1 + Math.sin(animationTime * 0.04 + i) * 0.1})`,
                }}
              >
                {item.icon}
              </div>
            ))}
          </div>

          {/* Écran de simulation avec animations */}
          <div className="absolute inset-4 bg-black rounded-xl border-8 border-gray-800 shadow-2xl overflow-hidden">
            {/* Indicateurs d'écran animés */}
            <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse z-10"></div>
            <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping z-10"></div>
            <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-70 px-2 py-1 rounded z-10 animate-pulse">
              SIMULATION LIVE • {new Date().toLocaleTimeString()}
            </div>

            {/* Scène urbaine avec animations complexes */}
            <div className="relative w-full h-full overflow-hidden">
              {/* Ciel avec pollution animée */}
              <div
                className={`absolute inset-0 transition-all duration-1000 ${
                  effectivePollution < 20
                    ? "bg-gradient-to-b from-blue-400 to-blue-200"
                    : effectivePollution < 40
                      ? "bg-gradient-to-b from-blue-300 to-gray-200"
                      : effectivePollution < 60
                        ? "bg-gradient-to-b from-gray-300 to-gray-400"
                        : effectivePollution < 80
                          ? "bg-gradient-to-b from-gray-400 to-gray-500"
                          : "bg-gradient-to-b from-gray-500 to-gray-600"
                }`}
              >
                {/* Nuages de pollution animés */}
                {effectivePollution > 20 && (
                  <div className="absolute inset-0" style={{ opacity: Math.min(0.8, effectivePollution / 100) }}>
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute bg-gray-600 rounded-full animate-pulse"
                        style={{
                          left: `${5 + i * 12 + Math.sin(animationTime * 0.02 + i) * 3}%`,
                          top: `${5 + (i % 4) * 8 + Math.cos(animationTime * 0.015 + i) * 2}%`,
                          width: `${15 + i * 3 + Math.sin(animationTime * 0.03 + i) * 2}px`,
                          height: `${10 + i * 2 + Math.cos(animationTime * 0.025 + i) * 1}px`,
                          animationDelay: `${i * 0.3}s`,
                          animationDuration: "4s",
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Soleil animé */}
                <div
                  className={`absolute top-8 right-8 w-16 h-16 rounded-full transition-all duration-1000 ${
                    effectivePollution > 60 ? "bg-orange-300 opacity-30" : "bg-yellow-400 opacity-90"
                  }`}
                  style={{
                    transform: `scale(${1 + Math.sin(animationTime * 0.05) * 0.1})`,
                    boxShadow:
                      effectivePollution < 40
                        ? `0 0 ${20 + Math.sin(animationTime * 0.1) * 10}px rgba(255, 255, 0, 0.6)`
                        : "none",
                  }}
                >
                  {effectivePollution < 40 && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-6 bg-yellow-400 origin-bottom transition-all duration-100"
                          style={{
                            left: "50%",
                            top: "50%",
                            transform: `translateX(-50%) translateY(-50%) rotate(${i * 45 + animationTime * 0.5}deg) translateY(-40px)`,
                            opacity: 0.7 + Math.sin(animationTime * 0.1 + i) * 0.3,
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>

                {/* Pluie acide si pollution élevée */}
                {effectivePollution > 70 && (
                  <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-0.5 h-4 bg-gray-400 opacity-60"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${-10 + ((animationTime * 2 + i * 10) % 120)}%`,
                          transform: `rotate(10deg)`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Sol de la ville avec route animée */}
              <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-gray-700 to-gray-600">
                {/* Route avec marquage animé */}
                <div className="absolute bottom-0 w-full h-8 bg-gray-800">
                  <div
                    className="absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-400 opacity-60"
                    style={{
                      background: `repeating-linear-gradient(to right, #fbbf24 0px, #fbbf24 20px, transparent 20px, transparent 40px)`,
                      transform: `translateX(${animationTime % 40}px)`, // Inversé pour aller avec les voitures
                    }}
                  ></div>
                </div>

                {/* Bâtiments avec lumières animées */}
                {[
                  {
                    x: 8,
                    w: 16,
                    h: 24,
                    lights: [
                      [2, 2],
                      [2, 6],
                      [2, 10],
                    ],
                    tooltip: {
                      title: "🏢 Bâtiment résidentiel",
                      description: "Consomme de l'énergie, peut être équipé de panneaux solaires",
                    },
                  },
                  {
                    x: 28,
                    w: 20,
                    h: 32,
                    lights: [
                      [2, 2],
                      [6, 6],
                      [2, 10],
                    ],
                    tooltip: {
                      title: "🏬 Immeuble de bureaux",
                      description: "Grande consommation énergétique, potentiel pour l'efficacité énergétique",
                    },
                  },
                  {
                    x: 52,
                    w: 14,
                    h: 20,
                    lights: [
                      [2, 2],
                      [2, 6],
                    ],
                    tooltip: {
                      title: "🏠 Petit bâtiment",
                      description: "Habitat individuel, impact environnemental modéré",
                    },
                  },
                ].map((building, i) => (
                  <div
                    key={i}
                    className="absolute bottom-8 cursor-pointer"
                    style={{ left: `${building.x}%`, width: `${building.w}%`, height: `${building.h}%` }}
                    onMouseEnter={(e) =>
                      setTooltip({
                        title: building.tooltip.title,
                        description: building.tooltip.description,
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <div className="w-full h-full bg-gray-600 border-r-2 border-gray-700">
                      {building.lights.map((light, j) => (
                        <div
                          key={j}
                          className="absolute w-2 h-2 bg-yellow-400 transition-all duration-1000"
                          style={{
                            left: `${light[0]}%`,
                            top: `${light[1]}%`,
                            opacity: 0.3 + Math.sin(animationTime * 0.1 + i + j) * 0.3,
                          }}
                        />
                      ))}
                      {/* Panneaux solaires si solution active */}
                      {solutions.find((s) => s.id === "solar")?.active && (
                        <div
                          className="absolute -top-2 left-0 right-0 h-2 bg-blue-900 animate-pulse cursor-pointer"
                          style={{
                            boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                          }}
                          onMouseEnter={(e) =>
                            setTooltip({
                              title: "☀️ Panneaux solaires",
                              description: "Génèrent de l'énergie propre, réduisent les émissions de CO₂",
                              x: e.clientX,
                              y: e.clientY,
                            })
                          }
                          onMouseLeave={() => setTooltip(null)}
                        />
                      )}
                    </div>
                  </div>
                ))}

                {/* Industries multiples selon le nombre */}
                {[...Array(industryCount)].map((_, industryIndex) => (
                  <div
                    key={industryIndex}
                    className="absolute bottom-8 w-20 h-16 bg-red-800 border-l-2 border-red-900 cursor-pointer"
                    style={{
                      right: `${16 + industryIndex * 25}%`,
                    }}
                    onMouseEnter={(e) =>
                      setTooltip({
                        title: `🏭 Usine ${industryIndex + 1}`,
                        description: solutions.find((s) => s.id === "filter")?.active
                          ? "Équipée de filtres anti-pollution, émissions réduites"
                          : "Source majeure de pollution atmosphérique",
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <div className="absolute -top-6 left-2 w-3 h-6 bg-gray-700"></div>
                    <div className="absolute -top-6 right-2 w-3 h-6 bg-gray-700"></div>

                    {/* Fumée selon pollution et filtres */}
                    {effectivePollution > 30 && !solutions.find((s) => s.id === "filter")?.active && (
                      <>
                        {[...Array(2)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute text-sm opacity-70 animate-pulse cursor-pointer"
                            style={{
                              left: `${25 + i * 30}%`,
                              top: `${-50 - i * 8}%`,
                              transform: `translateX(${Math.sin(animationTime * 0.05 + i + industryIndex) * 8}px)`,
                              animationDuration: `${2 + i * 0.3}s`,
                            }}
                          >
                            ☁️
                          </div>
                        ))}
                      </>
                    )}

                    {/* Vapeur propre avec filtres */}
                    {solutions.find((s) => s.id === "filter")?.active && (
                      <div
                        className="absolute text-sm opacity-40 animate-pulse cursor-pointer"
                        style={{
                          left: "35%",
                          top: "-40%",
                          transform: `translateX(${Math.sin(animationTime * 0.03 + industryIndex) * 5}px)`,
                          animationDuration: "1.5s",
                        }}
                      >
                        💨
                      </div>
                    )}
                  </div>
                ))}

                {/* Véhicules animés avec vraies voitures - SENS INVERSE */}
                <div className="absolute bottom-0 left-0 w-full h-8">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="absolute bottom-0 transition-all duration-100 cursor-pointer"
                      style={{
                        left: `${vehicle.x}%`,
                        transform: `translateY(-2px) ${vehicle.type === "bike" ? `scale(0.8) rotate(${Math.sin(animationTime * 0.2) * 2}deg)` : ""} scaleX(-1)`, // scaleX(-1) pour inverser l'orientation
                      }}
                      onMouseEnter={(e) =>
                        setTooltip({
                          title:
                            vehicle.type === "car"
                              ? "🚗 Voiture thermique"
                              : vehicle.type === "electric"
                                ? "⚡ Voiture électrique"
                                : "🚴 Vélo",
                          description:
                            vehicle.type === "car"
                              ? "Émet du CO₂ et des particules fines"
                              : vehicle.type === "electric"
                                ? "Transport propre, zéro émission locale"
                                : "Transport écologique, zéro pollution",
                          x: e.clientX,
                          y: e.clientY,
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <div className="text-2xl">
                        {vehicle.type === "car" && "🚗"}
                        {vehicle.type === "electric" && "🚙"}
                        {vehicle.type === "bike" && "🚴"}
                      </div>

                      {/* Échappement pour voitures thermiques - maintenant à droite car inversé */}
                      {vehicle.type === "car" && effectivePollution > 20 && (
                        <div className="absolute -top-1 right-0 text-xs opacity-60 animate-ping">💨</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Piste cyclable animée */}
                {solutions.find((s) => s.id === "bike")?.active && (
                  <div className="absolute bottom-8 left-72 w-16 h-2 bg-green-400 rounded animate-pulse">
                    <div
                      className="absolute -top-1 text-sm animate-bounce"
                      style={{
                        left: `${20 + Math.sin(animationTime * 0.1) * 30}%`,
                        animationDuration: "2s",
                        transform: "scaleX(-1)",
                      }}
                    >
                      🚴
                    </div>
                    <div
                      className="absolute -top-1 text-sm animate-bounce"
                      style={{
                        right: `${20 + Math.cos(animationTime * 0.08) * 30}%`,
                        animationDelay: "1s",
                        animationDuration: "2s",
                        transform: "scaleX(-1)",
                      }}
                    >
                      🚴
                    </div>
                  </div>
                )}

                {/* Arbres animés - CORRECTEMENT POSITIONNÉS */}
                {[
                  { x: 72, health: effectivePollution < 30 ? "🌳" : effectivePollution < 60 ? "🌲" : "🌿" },
                  { x: 80, health: effectivePollution < 30 ? "🌳" : effectivePollution < 60 ? "🌲" : "🌿" },
                  { x: 88, health: effectivePollution < 30 ? "🌳" : effectivePollution < 60 ? "🌲" : "🌿" },
                ].map((tree, i) => (
                  <div
                    key={i}
                    className="absolute bottom-8 text-2xl opacity-60 transition-all duration-1000 cursor-pointer"
                    style={{
                      left: `${tree.x}%`,
                      transform: `rotate(${Math.sin(animationTime * 0.05 + i) * 3}deg) scale(${1 + Math.sin(animationTime * 0.03 + i) * 0.1})`,
                      filter: effectivePollution > 60 ? "grayscale(0.5)" : "none",
                    }}
                    onMouseEnter={(e) =>
                      setTooltip({
                        title:
                          effectivePollution < 30
                            ? "🌳 Arbre en bonne santé"
                            : effectivePollution < 60
                              ? "🌲 Arbre affaibli"
                              : "🌿 Arbre en détresse",
                        description:
                          effectivePollution < 30
                            ? "Absorbe efficacement le CO₂ et produit de l'oxygène"
                            : effectivePollution < 60
                              ? "Capacité d'absorption réduite par la pollution"
                              : "Fortement impacté par la pollution, absorption limitée",
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {tree.health}
                  </div>
                ))}

                {/* Arbres supplémentaires avec solution */}
                {solutions.find((s) => s.id === "trees")?.active && (
                  <>
                    {[
                      { x: 96, icon: "🌳", delay: 0 },
                      { x: 64, icon: "🌳", delay: 0.5 },
                      { x: 68, icon: "🌿", delay: 1 },
                      { x: 84, icon: "🌲", delay: 1.5 },
                    ].map((tree, i) => (
                      <div
                        key={i}
                        className="absolute bottom-8 text-2xl animate-bounce"
                        style={{
                          left: `${tree.x}%`,
                          animationDelay: `${tree.delay}s`,
                          animationDuration: "2s",
                          transform: `scale(${1.2 + Math.sin(animationTime * 0.04 + i) * 0.1})`,
                        }}
                      >
                        {tree.icon}
                      </div>
                    ))}
                  </>
                )}

                {/* Éolienne animée */}
                {solutions.find((s) => s.id === "solar")?.active && (
                  <div
                    className="absolute bottom-8 right-8 text-4xl"
                    style={{
                      transform: `rotate(${animationTime * 2}deg)`,
                      filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))",
                    }}
                  >
                    🌀
                  </div>
                )}
              </div>

              {/* Particules animées */}
              <div className="absolute inset-0 pointer-events-none">
                {particles.map((particle) => (
                  <div
                    key={particle.id}
                    className="absolute rounded-full transition-all duration-100"
                    style={{
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      backgroundColor: particle.color,
                      opacity: particle.opacity,
                      boxShadow: particle.type === "analysis" ? `0 0 ${particle.size * 2}px ${particle.color}` : "none",
                    }}
                  />
                ))}
              </div>

              {/* Effet d'analyse spectaculaire */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 animate-pulse">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-6xl animate-spin" style={{ animationDuration: "1s" }}>
                      🔬
                    </div>

                    {/* Cercles d'analyse */}
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-blue-400 rounded-full animate-ping"
                        style={{
                          width: `${(i + 1) * 60}px`,
                          height: `${(i + 1) * 60}px`,
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: "2s",
                        }}
                      />
                    ))}
                  </div>

                  {/* Texte d'analyse */}
                  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold animate-bounce">
                    🧪 ANALYSE EN COURS... 📊
                  </div>
                </div>
              )}

              {/* Infobulle d'analyse au centre */}
              {isAnalyzing && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-20">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-blue-300 animate-pulse">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">📊 Analyse en temps réel</h3>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <div className="font-semibold text-red-700">CO₂</div>
                        <div className="text-2xl font-bold text-red-600">{pollutionData.co2}</div>
                        <div className="text-xs text-red-500">ppm</div>
                      </div>

                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <div className="font-semibold text-orange-700">NOx</div>
                        <div className="text-2xl font-bold text-orange-600">{pollutionData.nox}</div>
                        <div className="text-xs text-orange-500">µg/m³</div>
                      </div>

                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <div className="font-semibold text-purple-700">PM2.5</div>
                        <div className="text-2xl font-bold text-purple-600">{pollutionData.pm25}</div>
                        <div className="text-xs text-purple-500">µg/m³</div>
                      </div>

                      <div
                        className={`p-3 rounded-lg border ${
                          pollutionData.aqi <= 50
                            ? "bg-green-50 border-green-200"
                            : pollutionData.aqi <= 100
                              ? "bg-yellow-50 border-yellow-200"
                              : pollutionData.aqi <= 150
                                ? "bg-orange-50 border-orange-200"
                                : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div
                          className={`font-semibold ${
                            pollutionData.aqi <= 50
                              ? "text-green-700"
                              : pollutionData.aqi <= 100
                                ? "text-yellow-700"
                                : pollutionData.aqi <= 150
                                  ? "text-orange-700"
                                  : "text-red-700"
                          }`}
                        >
                          AQI
                        </div>

                        <div
                          className={`text-2xl font-bold ${
                            pollutionData.aqi <= 50
                              ? "text-green-600"
                              : pollutionData.aqi <= 100
                                ? "text-yellow-600"
                                : pollutionData.aqi <= 150
                                  ? "text-orange-600"
                                  : "text-red-600"
                          }`}
                        >
                          {pollutionData.aqi}
                        </div>

                        <div
                          className={`text-xs ${
                            pollutionData.aqi <= 50
                              ? "text-green-500"
                              : pollutionData.aqi <= 100
                                ? "text-yellow-500"
                                : pollutionData.aqi <= 150
                                  ? "text-orange-500"
                                  : "text-red-500"
                          }`}
                        >
                          {aqiStatus.label}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <div className="text-sm text-gray-600">🔬 Capteurs actifs</div>
                      <div className="flex justify-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-ping"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-ping"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Indicateurs de qualité d'air flottants */}
              <div className="absolute top-4 right-4 space-y-2">
                {[
                  { label: "CO₂", value: pollutionData.co2, color: "#ef4444" },
                  { label: "NOx", value: pollutionData.nox, color: "#f97316" },
                  { label: "PM2.5", value: pollutionData.pm25, color: "#a855f7" },
                ].map((indicator, i) => (
                  <div
                    key={indicator.label}
                    className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs animate-pulse"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: "3s",
                      borderLeft: `3px solid ${indicator.color}`,
                    }}
                  >
                    {indicator.label}: {indicator.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            maxWidth: "250px",
          }}
        >
          <div className="font-semibold">{tooltip.title}</div>
          <div className="text-xs opacity-90">{tooltip.description}</div>
        </div>
      )}

      {/* Modales éducatives */}
      {showTutorial && <GuideTutorielPollution onClose={() => setShowTutorial(false)} />}
      {showHelp && <AidePollution onClose={() => setShowHelp(false)} />}
      {showQuiz && (
        <QuizPollution
          questions={quizQuestions}
          currentQuestion={quizCurrentQuestion}
          selectedAnswer={quizSelectedAnswer}
          onAnswerSelect={handleQuizAnswerSelect}
          onNext={handleQuizNext}
          onClose={() => setShowQuiz(false)}
          result={quizResult}
          completed={quizCompleted}
          onRestart={handleQuizRestart}
        />
      )}
    </div>
  )
}