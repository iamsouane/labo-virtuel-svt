"use client"

import type React from "react"
import { useState, useEffect } from "react"
import QuizEnergie from "../simulations/QuizEnergie"
import GuideTutoriel from "../simulations/GuideTutoriel"
import Aide from "../simulations/Aide"

interface EnergyData {
  pedalingIntensity: number
  solarIntensity: number
  electricalPower: number
  outputPower: number
  isActive: boolean
}

type OutputDevice = "ampoule" | "ventilateur" | "chauffe-eau"
type EnergySource = "velo" | "soleil"
type GeneratorType = "generateur" | "panneau-solaire"

interface DeviceConfig {
  name: string
  icon: string
  description: string
  energyType: string
  efficiency: number
}

const DEVICES: Record<OutputDevice, DeviceConfig> = {
  ampoule: {
    name: "Ampoule LED",
    icon: "💡",
    description: "Convertit l'électricité en lumière",
    energyType: "lumineuse",
    efficiency: 0.9,
  },
  ventilateur: {
    name: "Ventilateur",
    icon: "🌀",
    description: "Convertit l'électricité en énergie cinétique",
    energyType: "cinétique",
    efficiency: 0.85,
  },
  "chauffe-eau": {
    name: "Chauffe-eau",
    icon: "🔥",
    description: "Convertit l'électricité en chaleur",
    energyType: "thermique",
    efficiency: 0.95,
  },
}

const SimulationEnergie = () => {
  const [energyData, setEnergyData] = useState<EnergyData>({
    pedalingIntensity: 0,
    solarIntensity: 75,
    electricalPower: 0,
    outputPower: 0,
    isActive: false,
  })
  const [selectedDevice, setSelectedDevice] = useState<OutputDevice>("ampoule")
  const [energySource, setEnergySource] = useState<EnergySource>("velo")
  const [generatorType, setGeneratorType] = useState<GeneratorType>("generateur")
  const [pedalRotation, setPedalRotation] = useState(0)
  const [fanRotation, setFanRotation] = useState(0)
  const [showEnergySymbols, setShowEnergySymbols] = useState(false)
  const [energyParticles, setEnergyParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      type: "mechanical" | "solar" | "electrical" | "output"
      progress: number
    }>
  >([])

  const [showQuiz, setShowQuiz] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [quizCurrentQuestion, setQuizCurrentQuestion] = useState(0)
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<number | null>(null)
  const [quizResult, setQuizResult] = useState<any>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizStartTime, setQuizStartTime] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([])

  const quizQuestions = [
    {
      id: 1,
      question: "Quelle est l'efficacité d'un panneau solaire dans cette simulation ?",
      options: ["75%", "80%", "85%", "90%"],
      correctAnswer: 2,
      explanation: "Le panneau solaire a une efficacité de 85%, ce qui est supérieur à la génératrice classique (80%).",
      difficulty: "facile" as const,
      category: "efficacite" as const,
    },
    {
      id: 2,
      question: "Que se passe-t-il lors de la transformation d'énergie mécanique en électricité ?",
      options: ["Aucune perte", "Perte de 20%", "Perte de 15%", "Gain d'énergie"],
      correctAnswer: 1,
      explanation: "La génératrice a une efficacité de 80%, ce qui signifie une perte de 20% lors de la conversion.",
      difficulty: "moyen" as const,
      category: "transformation" as const,
    },
    {
      id: 3,
      question: "Quel appareil a la meilleure efficacité énergétique ?",
      options: ["Ampoule LED (90%)", "Ventilateur (85%)", "Chauffe-eau (95%)", "Tous égaux"],
      correctAnswer: 2,
      explanation:
        "Le chauffe-eau a la meilleure efficacité avec 95%, car la conversion électricité-chaleur est très efficace.",
      difficulty: "facile" as const,
      category: "application" as const,
    },
    {
      id: 4,
      question: "Pourquoi y a-t-il des pertes d'énergie dans les transformations ?",
      options: ["Erreur de calcul", "Lois de la physique", "Mauvais équipement", "Hasard"],
      correctAnswer: 1,
      explanation:
        "Les pertes d'énergie sont dues aux lois de la thermodynamique : toute transformation implique des pertes sous forme de chaleur.",
      difficulty: "difficile" as const,
      category: "processus" as const,
    },
    {
      id: 5,
      question: "Quelle source d'énergie est renouvelable dans cette simulation ?",
      options: ["Le vélo seulement", "Le soleil seulement", "Les deux", "Aucune"],
      correctAnswer: 2,
      explanation:
        "Les deux sources sont renouvelables : l'énergie humaine (vélo) et l'énergie solaire se régénèrent naturellement.",
      difficulty: "moyen" as const,
      category: "sources" as const,
    },
  ]

  const handleQuizStart = () => {
    setShowQuiz(true)
    setQuizStartTime(Date.now())
    setQuizCurrentQuestion(0)
    setQuizSelectedAnswer(null)
    setQuizResult(null)
    setQuizCompleted(false)
  }

  const handleQuizAnswerSelect = (answerIndex: number) => {
    setQuizSelectedAnswer(answerIndex)
  }

  interface QuizAnswer {
    questionId: number
    userAnswer: number
    correct: boolean
  }

  const handleQuizNext = () => {
    if (quizSelectedAnswer === null) return

    const currentQuestionData = quizQuestions[quizCurrentQuestion]
    const isCorrect = quizSelectedAnswer === currentQuestionData.correctAnswer

    // Enregistrer cette réponse dans le state
    setQuizAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestionData.id,
        userAnswer: quizSelectedAnswer,
        correct: isCorrect,
      },
    ])

    if (quizCurrentQuestion < quizQuestions.length - 1) {
      setQuizCurrentQuestion(quizCurrentQuestion + 1)
      setQuizSelectedAnswer(null)
    } else {
      const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000)

      const finalAnswers = [
        ...quizAnswers,
        {
          questionId: currentQuestionData.id,
          userAnswer: quizSelectedAnswer,
          correct: isCorrect,
        },
      ]

      const score = finalAnswers.filter((a) => a.correct).length

      setQuizResult({
        score,
        totalQuestions: quizQuestions.length,
        timeSpent,
        answers: finalAnswers,
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
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
  }

  // Calcul de l'énergie électrique et de sortie
  useEffect(() => {
    const generatorEfficiency = generatorType === "panneau-solaire" ? 0.85 : 0.8
    const deviceEfficiency = DEVICES[selectedDevice].efficiency

    const inputIntensity = energySource === "velo" ? energyData.pedalingIntensity : energyData.solarIntensity
    const electricalPower = (inputIntensity * generatorEfficiency) / 100
    const outputPower = electricalPower * deviceEfficiency

    setEnergyData((prev) => ({
      ...prev,
      electricalPower: electricalPower * 100,
      outputPower: outputPower * 100,
    }))
  }, [energyData.pedalingIntensity, energyData.solarIntensity, selectedDevice, energySource, generatorType])

  // Animation des pédales
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (energyData.isActive && energySource === "velo" && energyData.pedalingIntensity > 0) {
      interval = setInterval(() => {
        setPedalRotation((prev) => prev + energyData.pedalingIntensity / 5)
      }, 50)
    }
    return () => clearInterval(interval)
  }, [energyData.isActive, energyData.pedalingIntensity, energySource])

  // Animation du ventilateur
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (energyData.isActive && energyData.outputPower > 0 && selectedDevice === "ventilateur") {
      interval = setInterval(() => {
        setFanRotation((prev) => prev + energyData.outputPower / 3)
      }, 50)
    }
    return () => clearInterval(interval)
  }, [energyData.isActive, energyData.outputPower, selectedDevice])

  // Animation des particules d'énergie
  useEffect(() => {
    if (!showEnergySymbols || !energyData.isActive) {
      setEnergyParticles([])
      return
    }

    const inputIntensity = energySource === "velo" ? energyData.pedalingIntensity : energyData.solarIntensity
    if (inputIntensity === 0) {
      setEnergyParticles([])
      return
    }

    const interval = setInterval(() => {
      setEnergyParticles((prev) => {
        // Supprimer les particules terminées
        const activeParticles = prev.filter((p) => p.progress < 100)

        // Ajouter de nouvelles particules selon l'intensité
        const newParticles = []
        const particleCount = Math.floor(inputIntensity / 25)

        for (let i = 0; i < particleCount; i++) {
          if (Math.random() < 0.3) {
            newParticles.push({
              id: Date.now() + Math.random(),
              x: energySource === "velo" ? 120 : 120, // Position de la source
              y: energySource === "velo" ? 250 : 150,
              type: energySource === "velo" ? ("mechanical" as const) : ("solar" as const),
              progress: 0,
            })
          }
        }

        // Mettre à jour les positions des particules existantes
        const updatedParticles = activeParticles.map((particle) => {
          const newProgress = particle.progress + 2
          let newX = particle.x
          const newY = particle.y

          if ((particle.type === "mechanical" || particle.type === "solar") && newProgress > 30) {
            // Transformer en énergie électrique
            return {
              ...particle,
              type: "electrical" as const,
              x: 290, // Position du générateur
              progress: 0,
            }
          } else if (particle.type === "electrical" && newProgress > 30) {
            // Transformer en énergie de sortie
            return {
              ...particle,
              type: "output" as const,
              x: 450, // Position de l'appareil
              progress: 0,
            }
          } else {
            // Déplacer la particule
            if (particle.type === "mechanical" || particle.type === "solar") {
              newX = 120 + (170 * newProgress) / 100 // De la source au générateur
            } else if (particle.type === "electrical") {
              newX = 290 + (160 * newProgress) / 100 // Du générateur à l'appareil
            }
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            progress: newProgress,
          }
        })

        return [...updatedParticles, ...newParticles]
      })
    }, 100)

    return () => clearInterval(interval)
  }, [showEnergySymbols, energyData.isActive, energyData.pedalingIntensity, energyData.solarIntensity, energySource])

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (energySource === "velo") {
      setEnergyData((prev) => ({
        ...prev,
        pedalingIntensity: Number.parseInt(e.target.value),
      }))
    } else {
      setEnergyData((prev) => ({
        ...prev,
        solarIntensity: Number.parseInt(e.target.value),
      }))
    }
  }

  const toggleActivity = () => {
    setEnergyData((prev) => ({ ...prev, isActive: !prev.isActive }))
  }

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevice(e.target.value as OutputDevice)
  }

  const handleEnergySourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSource = e.target.value as EnergySource
    setEnergySource(newSource)
    // Adapter le type de générateur selon la source
    if (newSource === "soleil") {
      setGeneratorType("panneau-solaire")
    } else {
      setGeneratorType("generateur")
    }
  }

  const handleGeneratorTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGeneratorType(e.target.value as GeneratorType)
  }

  const renderEnergySource = () => {
    if (energySource === "velo") {
      return (
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
          {/* Corps du cycliste */}
          <div className="relative">
            {/* Tête */}
            <div className="w-8 h-8 bg-pink-300 rounded-full mb-2 mx-auto" />
            {/* Corps */}
            <div className="w-6 h-12 bg-blue-400 rounded mx-auto mb-2" />
            {/* Bras */}
            <div className="absolute top-8 -left-2 w-8 h-2 bg-pink-300 rounded transform -rotate-12" />
            <div className="absolute top-8 -right-2 w-8 h-2 bg-pink-300 rounded transform rotate-12" />
            {/* Jambes animées */}
            <div
              className="absolute top-16 left-1 w-2 h-8 bg-blue-600 rounded origin-top transition-transform duration-100"
              style={{
                transform: `rotate(${Math.sin((pedalRotation * Math.PI) / 180) * 20}deg)`,
              }}
            />
            <div
              className="absolute top-16 right-1 w-2 h-8 bg-blue-600 rounded origin-top transition-transform duration-100"
              style={{
                transform: `rotate(${Math.sin(((pedalRotation + 180) * Math.PI) / 180) * 20}deg)`,
              }}
            />
          </div>

          {/* Vélo d'appartement */}
          <div className="relative mt-4">
            {/* Cadre */}
            <div className="w-20 h-12 border-4 border-gray-600 rounded-lg" />
            {/* Siège */}
            <div className="absolute -top-2 left-2 w-8 h-3 bg-black rounded" />
            {/* Guidon */}
            <div className="absolute -top-4 right-2 w-8 h-2 bg-gray-600 rounded" />
            {/* Pédales */}
            <div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-gray-700 rounded-full transition-transform duration-100"
              style={{ transform: `translateX(-50%) rotate(${pedalRotation}deg)` }}
            >
              <div className="absolute top-1/2 left-0 w-2 h-1 bg-gray-800 transform -translate-y-1/2" />
              <div className="absolute top-1/2 right-0 w-2 h-1 bg-gray-800 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Étiquette */}
          <div className="mt-4 text-sm font-medium text-gray-700">
            🚴 Cycliste
            <br />
            <span className="text-blue-600">{energyData.pedalingIntensity}% d'effort</span>
          </div>
        </div>
      )
    } else {
      return (
        <div className="absolute left-8 top-16">
          {/* Soleil */}
          <div className="relative">
            {/* Corps du soleil */}
            <div
              className="w-20 h-20 bg-yellow-400 rounded-full transition-all duration-500 relative"
              style={{
                boxShadow: `0 0 ${energyData.solarIntensity / 2}px rgba(255, 255, 0, 0.8)`,
                filter: `brightness(${1 + energyData.solarIntensity / 200})`,
              }}
            >
              {/* Visage du soleil */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-2xl">😊</div>
              </div>
            </div>

            {/* Rayons du soleil */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-yellow-400 origin-bottom transition-all duration-500"
                style={{
                  width: "3px",
                  height: `${15 + energyData.solarIntensity / 8}px`,
                  left: "50%",
                  top: "50%",
                  transform: `translateX(-50%) translateY(-50%) rotate(${i * 30}deg) translateY(-${40 + energyData.solarIntensity / 10}px)`,
                  opacity: energyData.solarIntensity / 100,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}

            {/* Rayons lumineux animés */}
            {energyData.isActive && energyData.solarIntensity > 30 && (
              <>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`ray-${i}`}
                    className="absolute w-1 bg-yellow-300 origin-bottom animate-pulse"
                    style={{
                      height: `${20 + energyData.solarIntensity / 6}px`,
                      left: "50%",
                      top: "50%",
                      transform: `translateX(-50%) translateY(-50%) rotate(${i * 60 + 15}deg) translateY(-${50 + energyData.solarIntensity / 8}px)`,
                      opacity: energyData.solarIntensity / 150,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: "1.5s",
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Étiquette */}
          <div className="mt-4 text-sm font-medium text-gray-700 text-center">
            ☀️ Soleil
            <br />
            <span className="text-yellow-600">{energyData.solarIntensity}% d'intensité</span>
          </div>
        </div>
      )
    }
  }

  const renderGenerator = () => {
    if (generatorType === "panneau-solaire") {
      return (
        <div className="absolute left-72 top-1/2 transform -translate-y-1/2">
          <div
            className="relative w-16 h-20 bg-blue-900 rounded-lg transition-all duration-500 border-2 border-gray-300"
            style={{
              boxShadow: `0 0 ${energyData.electricalPower / 3}px rgba(0, 100, 255, 0.5)`,
            }}
          >
            {/* Cellules photovoltaïques */}
            <div className="absolute inset-1 grid grid-cols-3 gap-0.5">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="bg-blue-800 rounded-sm transition-all duration-300"
                  style={{
                    backgroundColor: `rgba(30, 58, 138, ${0.8 + energyData.electricalPower / 500})`,
                  }}
                />
              ))}
            </div>

            {/* Reflets sur le panneau */}
            {energyData.electricalPower > 20 && (
              <div
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded opacity-30 animate-pulse"
                style={{ animationDuration: "2s" }}
              />
            )}

            {/* Indicateur d'activité */}
            {energyData.electricalPower > 5 && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>

          {/* Étiquette */}
          <div className="mt-4 text-sm font-medium text-gray-700 text-center">
            🔋 Panneau Solaire
            <br />
            <span className="text-green-600">{energyData.electricalPower.toFixed(1)}% de puissance</span>
          </div>
        </div>
      )
    } else {
      return (
        <div className="absolute left-72 top-1/2 transform -translate-y-1/2">
          <div
            className="relative w-16 h-20 bg-gray-700 rounded-lg transition-all duration-500"
            style={{
              boxShadow: `0 0 ${energyData.electricalPower / 3}px rgba(255, 255, 0, 0.5)`,
            }}
          >
            {/* Bobines */}
            <div className="absolute inset-2 bg-copper-500 rounded" style={{ backgroundColor: "#B87333" }} />
            {/* Indicateur d'activité */}
            {energyData.electricalPower > 5 && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
            {/* Étincelles */}
            {energyData.electricalPower > 50 && (
              <>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                    style={{
                      top: `${20 + i * 20}%`,
                      right: "-4px",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Étiquette */}
          <div className="mt-4 text-sm font-medium text-gray-700 text-center">
            ⚡ Génératrice
            <br />
            <span className="text-green-600">{energyData.electricalPower.toFixed(1)}% de puissance</span>
          </div>
        </div>
      )
    }
  }

  const renderOutputDevice = () => {
    //const device = DEVICES[selectedDevice]
    const intensity = energyData.outputPower

    switch (selectedDevice) {
      case "ampoule":
        return (
          <div className="relative">
            {/* Halo lumineux */}
            {intensity > 5 && (
              <div
                className="absolute -inset-8 rounded-full bg-yellow-300 animate-pulse transition-all duration-500"
                style={{
                  opacity: intensity / 200,
                  transform: `scale(${1 + intensity / 200})`,
                }}
              />
            )}
            {/* Corps de l'ampoule */}
            <div
              className="relative w-16 h-20 rounded-full transition-all duration-500 border-2 border-gray-300"
              style={{
                backgroundColor: `rgba(255, 255, ${100 + intensity}, ${0.3 + intensity / 150})`,
                boxShadow: `0 0 ${intensity}px rgba(255, 255, 0, 0.8)`,
              }}
            >
              {/* Filament */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: `rgba(255, ${200 + intensity / 2}, 0, ${intensity / 100})`,
                }}
              />
              {/* Culot */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-gray-400 rounded-b-lg" />
            </div>
            {/* Rayons lumineux */}
            {intensity > 20 && (
              <>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 bg-yellow-400 origin-bottom animate-pulse transition-all duration-500"
                    style={{
                      height: `${15 + intensity / 8}px`,
                      left: "50%",
                      bottom: "50%",
                      transform: `translateX(-50%) rotate(${i * 45}deg)`,
                      opacity: intensity / 150,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </>
            )}
          </div>
        )
      case "ventilateur":
        return (
          <div className="relative">
            {/* Base du ventilateur */}
            <div className="w-4 h-12 bg-gray-600 mx-auto rounded-b-lg" />
            {/* Moteur */}
            <div className="w-8 h-8 bg-gray-700 rounded-full mx-auto -mt-2 relative z-10" />
            {/* Pales du ventilateur */}
            <div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 transition-all duration-100"
              style={{
                transform: `translateX(-50%) rotate(${fanRotation}deg)`,
              }}
            >
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-16 h-2 bg-gray-400 rounded-full origin-left transition-all duration-300"
                  style={{
                    transform: `rotate(${i * 120}deg)`,
                    opacity: 0.8 + intensity / 500,
                  }}
                />
              ))}
            </div>
            {/* Effet de vent */}
            {intensity > 30 && (
              <div className="absolute -right-8 top-8 flex flex-col gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-0.5 bg-blue-300 rounded animate-pulse"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      opacity: intensity / 150,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )
      case "chauffe-eau":
        return (
          <div className="relative">
            {/* Corps du chauffe-eau */}
            <div
              className="w-12 h-20 rounded-lg border-2 border-gray-400 transition-all duration-500"
              style={{
                backgroundColor: `rgb(${Math.min(255, 100 + intensity * 1.5)}, ${Math.max(
                  100,
                  255 - intensity * 1.5,
                )}, ${Math.max(100, 255 - intensity * 2)})`,
              }}
            >
              {/* Indicateur de niveau de chaleur */}
              <div
                className="absolute bottom-2 left-1 right-1 bg-red-500 rounded transition-all duration-500"
                style={{
                  height: `${(intensity / 100) * 70}%`,
                  opacity: intensity / 100,
                }}
              />
              {/* Thermomètre */}
              <div className="absolute -right-6 top-2 w-2 h-16 bg-gray-300 rounded-full">
                <div
                  className="absolute bottom-0 w-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ height: `${intensity}%` }}
                />
              </div>
            </div>
            {/* Vapeur */}
            {intensity > 60 && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-gray-300 rounded-full animate-bounce opacity-60"
                    style={{
                      left: `${i * 8 - 8}px`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: "1.5s",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  const renderEnergyParticles = () => {
    if (!showEnergySymbols) return null

    return energyParticles.map((particle) => {
      const getParticleColor = (type: string) => {
        switch (type) {
          case "mechanical":
            return "text-blue-500"
          case "solar":
            return "text-yellow-500"
          case "electrical":
            return "text-green-500"
          case "output":
            if (selectedDevice === "ampoule") return "text-yellow-500"
            if (selectedDevice === "ventilateur") return "text-cyan-500"
            return "text-red-500"
          default:
            return "text-gray-500"
        }
      }

      return (
        <div
          key={particle.id}
          className={`absolute text-lg font-bold ${getParticleColor(particle.type)} animate-pulse transition-all duration-100 pointer-events-none`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: "translate(-50%, -50%)",
            opacity: Math.max(0.3, 1 - particle.progress / 100),
          }}
        >
          E
        </div>
      )
    })
  }

  const renderEnergySymbolsLegend = () => {
    if (!showEnergySymbols) return null

    return (
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-lg">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">🔤 Symboles d'Énergie</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className={energySource === "velo" ? "text-blue-500 font-bold" : "text-yellow-500 font-bold"}>E</span>
            <span className="text-gray-700">{energySource === "velo" ? "Énergie Mécanique" : "Énergie Solaire"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500 font-bold">E</span>
            <span className="text-gray-700">Énergie Électrique</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-bold ${selectedDevice === "ampoule"
                  ? "text-yellow-500"
                  : selectedDevice === "ventilateur"
                    ? "text-cyan-500"
                    : "text-red-500"
                }`}
            >
              E
            </span>
            <span className="text-gray-700">Énergie {DEVICES[selectedDevice].energyType}</span>
          </div>
        </div>
      </div>
    )
  }

  const currentIntensity = energySource === "velo" ? energyData.pedalingIntensity : energyData.solarIntensity

  return (
    <div>
      <section
        className={`py-20 px-6 bg-gradient-to-br from-blue-50 to-green-50 max-w-7xl mx-auto rounded-xl shadow-lg ${isFullscreen ? "max-w-full h-screen" : ""}`}
      >
        {/* Header avec titre à gauche et boutons à droite */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">🔄 Transformation de l'Énergie</h2>

          <div className="flex gap-2">
            <button
              onClick={() => setShowTutorial(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-sm"
              title="Guide tutoriel"
            >
              📚 Guide
            </button>
            <button
              onClick={handleQuizStart}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-sm"
              title="Quiz sur l'énergie"
            >
              🧠 Quiz
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-medium text-sm"
              title="Aide"
            >
              ❓ Aide
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium text-sm"
              title="Mode plein écran"
            >
              {isFullscreen ? "🗗 Quitter" : "⛶ Plein écran"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Zone de simulation principale */}
          <div className="lg:col-span-3">
            <div className="relative bg-gradient-to-b from-sky-100 to-green-100 rounded-xl p-8 h-[500px] overflow-hidden border-2 border-gray-200">
              {/* Source d'énergie */}
              {renderEnergySource()}

              {/* Câble de transmission */}
              <div className="absolute left-32 top-1/2 transform -translate-y-1/2">
                <div
                  className="w-32 h-1 bg-gray-800 transition-all duration-300"
                  style={{
                    boxShadow: `0 0 ${energyData.electricalPower / 10}px rgba(0, 255, 255, 0.6)`,
                  }}
                />
                {/* Flux d'énergie dans le câble */}
                {energyData.electricalPower > 10 && (
                  <div className="absolute top-0 left-0 w-3 h-1 bg-cyan-400 animate-pulse">
                    <div
                      className="w-full h-full bg-cyan-300 animate-ping"
                      style={{ animationDuration: `${2 - energyData.electricalPower / 100}s` }}
                    />
                  </div>
                )}
              </div>

              {/* Générateur */}
              {renderGenerator()}

              {/* Câble vers l'appareil */}
              <div className="absolute left-96 top-1/2 transform -translate-y-1/2">
                <div
                  className="w-24 h-1 bg-gray-800 transition-all duration-300"
                  style={{
                    boxShadow: `0 0 ${energyData.outputPower / 10}px rgba(255, 0, 255, 0.6)`,
                  }}
                />
                {/* Flux d'énergie */}
                {energyData.outputPower > 10 && (
                  <div className="absolute top-0 left-0 w-3 h-1 bg-purple-400 animate-pulse">
                    <div
                      className="w-full h-full bg-purple-300 animate-ping"
                      style={{ animationDuration: `${2 - energyData.outputPower / 100}s` }}
                    />
                  </div>
                )}
              </div>

              {/* Appareil de sortie */}
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                <div className="flex flex-col items-center">
                  {renderOutputDevice()}
                  <div className="mt-4 text-sm font-medium text-gray-700 text-center">
                    {DEVICES[selectedDevice].icon} {DEVICES[selectedDevice].name}
                    <br />
                    <span className="text-purple-600">{energyData.outputPower.toFixed(1)}% d'énergie</span>
                  </div>
                </div>
              </div>

              {/* Particules d'énergie symboliques */}
              {renderEnergyParticles()}

              {/* Légende des symboles d'énergie */}
              {renderEnergySymbolsLegend()}
            </div>

            {/* Contrôles */}
            <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="space-y-4">
                {/* Sélecteurs de source et générateur */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">🔋 Source d'énergie:</label>
                    <select
                      value={energySource}
                      onChange={handleEnergySourceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="velo">🚴 Vélo</option>
                      <option value="soleil">☀️ Soleil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">⚡ Générateur:</label>
                    <select
                      value={generatorType}
                      onChange={handleGeneratorTypeChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="generateur">⚡ Génératrice</option>
                      <option value="panneau-solaire">🔋 Panneau Solaire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">🔌 Appareil:</label>
                    <select
                      value={selectedDevice}
                      onChange={handleDeviceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(DEVICES).map(([key, device]) => (
                        <option key={key} value={key}>
                          {device.icon} {device.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contrôle d'intensité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {energySource === "velo" ? "🚴 Intensité de pédalage" : "☀️ Intensité solaire"}: {currentIntensity}%
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentIntensity}
                      onChange={handleIntensityChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${currentIntensity}%, #e5e7eb ${currentIntensity}%, #e5e7eb 100%)`,
                      }}
                    />
                    <style
                      dangerouslySetInnerHTML={{
                        __html: `
                        input[type="range"]::-webkit-slider-thumb {
                          appearance: none;
                          height: 20px;
                          width: 20px;
                          border-radius: 50%;
                          background: #3b82f6;
                          cursor: pointer;
                          border: 2px solid #ffffff;
                          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                        }
                        input[type="range"]::-moz-range-thumb {
                          height: 20px;
                          width: 20px;
                          border-radius: 50%;
                          background: #3b82f6;
                          cursor: pointer;
                          border: 2px solid #ffffff;
                          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                          border: none;
                        }
                      `,
                      }}
                    />
                  </div>
                </div>

                {/* Boutons de contrôle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={toggleActivity}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${energyData.isActive
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                        : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      }`}
                  >
                    {energyData.isActive
                      ? energySource === "velo"
                        ? "⏸️ Arrêter le pédalage"
                        : "⏸️ Masquer le soleil"
                      : energySource === "velo"
                        ? "▶️ Commencer à pédaler"
                        : "▶️ Faire briller le soleil"}
                  </button>

                  <button
                    onClick={() => setShowEnergySymbols(!showEnergySymbols)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${showEnergySymbols
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
                      }`}
                  >
                    {showEnergySymbols ? "🔤 Masquer les symboles E" : "🔤 Afficher les symboles E"}
                  </button>
                </div>

                {/* Indicateurs de puissance */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div
                    className={`p-3 rounded-lg border ${energySource === "velo" ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200"}`}
                  >
                    <div
                      className={`text-2xl font-bold ${energySource === "velo" ? "text-blue-600" : "text-yellow-600"}`}
                    >
                      {currentIntensity}%
                    </div>
                    <div className={`text-xs ${energySource === "velo" ? "text-blue-700" : "text-yellow-700"}`}>
                      {energySource === "velo" ? "Énergie Mécanique" : "Énergie Solaire"}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{energyData.electricalPower.toFixed(1)}%</div>
                    <div className="text-xs text-green-700">Énergie Électrique</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">{energyData.outputPower.toFixed(1)}%</div>
                    <div className="text-xs text-purple-700">Énergie {DEVICES[selectedDevice].energyType}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panneau d'information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2">🔄 Transformations d'Énergie</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Étape 1 */}
                <div
                  className={`flex items-start gap-3 p-3 rounded-lg border ${energySource === "velo" ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200"}`}
                >
                  <div
                    className={`w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold ${energySource === "velo" ? "bg-blue-500" : "bg-yellow-500"}`}
                  >
                    1
                  </div>
                  <div>
                    <h4 className={`font-semibold ${energySource === "velo" ? "text-blue-800" : "text-yellow-800"}`}>
                      {energySource === "velo" ? "Énergie Mécanique" : "Énergie Solaire"}
                    </h4>
                    <p className={`text-sm mt-1 ${energySource === "velo" ? "text-blue-700" : "text-yellow-700"}`}>
                      {energySource === "velo"
                        ? "Le cycliste transforme l'énergie chimique de ses muscles en mouvement de rotation des pédales."
                        : "Le soleil émet de l'énergie lumineuse sous forme de photons qui frappent le panneau solaire."}
                    </p>
                  </div>
                </div>

                {/* Étape 2 */}
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">Énergie Électrique</h4>
                    <p className="text-sm text-green-700 mt-1">
                      {generatorType === "panneau-solaire"
                        ? "Le panneau solaire convertit la lumière en électricité grâce à l'effet photovoltaïque avec une efficacité de 85%."
                        : "La génératrice convertit le mouvement mécanique en électricité avec une efficacité de 80%."}
                    </p>
                  </div>
                </div>

                {/* Étape 3 */}
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Énergie {DEVICES[selectedDevice].energyType}</h4>
                    <p className="text-sm text-purple-700 mt-1">{DEVICES[selectedDevice].description}</p>
                  </div>
                </div>

                {/* Efficacité */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">⚡ Efficacités</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{generatorType === "panneau-solaire" ? "Panneau solaire:" : "Génératrice:"}</span>
                      <span className="font-medium">{generatorType === "panneau-solaire" ? "85%" : "80%"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{DEVICES[selectedDevice].name}:</span>
                      <span className="font-medium">{Math.round(DEVICES[selectedDevice].efficiency * 100)}%</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-green-600">
                        {Math.round(
                          (generatorType === "panneau-solaire" ? 0.85 : 0.8) * DEVICES[selectedDevice].efficiency * 100,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informations sur l'appareil */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    {DEVICES[selectedDevice].icon} {DEVICES[selectedDevice].name}
                  </h4>
                  <p className="text-sm text-yellow-700">{DEVICES[selectedDevice].description}</p>
                  <div className="mt-2 text-xs text-yellow-600">
                    Efficacité: {Math.round(DEVICES[selectedDevice].efficiency * 100)}%
                  </div>
                </div>

                {/* Conseil */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">💡 Le saviez-vous ?</h4>
                  <p className="text-sm text-orange-700">
                    {energySource === "velo"
                      ? "Un cycliste moyen peut produire environ 100-200 watts d'énergie, soit assez pour alimenter 2-3 ampoules LED !"
                      : "Un panneau solaire de 1m² peut produire jusqu'à 200 watts par heure de plein soleil, soit l'équivalent d'un cycliste entraîné !"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modales */}
        {showTutorial && <GuideTutoriel onClose={() => setShowTutorial(false)} />}

        {showHelp && <Aide onClose={() => setShowHelp(false)} />}

        {showQuiz && (
          <QuizEnergie
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
      </section>
    </div>
  )
}

export default SimulationEnergie