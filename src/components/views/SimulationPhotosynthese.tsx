// src/components/views/SimulationPhotosynthese.tsx
import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import type {
  LabEnvironment,
  DataPoint,
  Preset,
  QuizResult,
  QuizQuestion,
} from "../../types/simulationPhotosyntheseTypes"
import { PHOTOSYNTHESE_TUTORIAL_STEPS } from "../../data/photosyntheseTutorial"
import { TutorialOverlayPhotosynthese } from "../ui/TutorialOverlayPhotosynthese"
import QuizOverlay from "../ui/QuizPhotosyntheseOverlay"
import { notifySuccess, notifyInfo } from "../../lib/notifications"
import { usePhotosyntheseShortcuts } from "../../hooks/usePhotosyntheseShortcuts"
import GuideOverlayPhotosynthese from "../ui/GuideOverlayPhotosynthese"
import { FullscreenContainer } from "../../components/ui/FullscreenContainer"
import { FullscreenButton } from "../../components/ui/FullscreenButton"
import { useFullscreen } from "../../hooks/useFullscreen"
import { PRESETS } from "../../data/presetsPhotosynthese"
import { SimplePhotosynthesisScene } from "../photosynthese/SimplePhotosynthesisScene"
import EnvironmentControlCard from "../ui/EnvironmentControlCard"
import {
  GraduationCap,
  Brain,
  HelpCircle,
  Star,
  ThumbsUp,
  AlertCircle,
  Settings,
  RotateCw,
  Leaf,
  Play,
  Pause,
  Clock,
  Target,
  SunMedium,
  CloudDrizzle,
  ThermometerSun,
  Droplets,
} from "lucide-react"
import { useSimulationPhotosyntheseEffects } from "../../hooks/useSimulationPhotosyntheseEffects"
import PhotosyntheseInfos from "../ui/PhotosyntheseInfos"

const SimulationPhotosynthese = () => {
  const [environment, setEnvironment] = useState<LabEnvironment>({
    lightIntensity: 60,
    co2Level: 40,
    temperature: 25,
    humidity: 60,
  })

  const [isRunning, setIsRunning] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [, setDataHistory] = useState<DataPoint[]>([])
  const [showHelp, setShowHelp] = useState(false)
  const { isFullscreen } = useFullscreen()

  // Tutoriel
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0)
  const [tutorialCompleted, setTutorialCompleted] = useState(false)
  const currentStep = PHOTOSYNTHESE_TUTORIAL_STEPS[currentTutorialStep]

  // Quiz
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizStartTime, setQuizStartTime] = useState<number>(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [, setQuizResult] = useState<QuizResult | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [simulationCode] = useState("photosynthese")
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])

  const [resetKey, setResetKey] = useState(0)

  const resetSimulation = () => {
    setTimeElapsed(0)
    setIsRunning(false)
    setDataHistory([])
    setEnvironment({
      lightIntensity: 60,
      co2Level: 40,
      temperature: 25,
      humidity: 60,
    })
    setSelectedPreset(null)
    setResetKey((prev) => prev + 1)
    notifyInfo("Simulation réinitialisée")
  }

  const applyPreset = (preset: Preset) => {
    setEnvironment(preset.environment)
    setSelectedPreset(preset.name)
    notifyInfo(`Preset "${preset.name}" appliqué`)
  }

  const startTutorial = () => {
    setShowTutorial(true)
    setCurrentTutorialStep(0)
    setTutorialCompleted(false)
  }

  const nextTutorialStep = () => {
    setCurrentTutorialStep((prev) => Math.min(prev + 1, PHOTOSYNTHESE_TUTORIAL_STEPS.length - 1))
  }

  const previousTutorialStep = () => {
    setCurrentTutorialStep((prev) => Math.max(prev - 1, 0))
  }

  const skipTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem("photosynthesis-tutorial-completed", "true")
  }

  const completeTutorial = () => {
    setShowTutorial(false)
    setTutorialCompleted(true)
    localStorage.setItem("photosynthesis-tutorial-completed", "true")
    notifySuccess("Tutoriel Photosynthèse terminé ! Vous êtes prêt à expérimenter !")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getEnvironmentStatus = () => {
    const { lightIntensity, co2Level, temperature } = environment
    const lightOk = lightIntensity >= 50
    const co2Ok = co2Level >= 30
    const tempOk = temperature >= 20 && temperature <= 30

    if (lightOk && co2Ok && tempOk)
      return { status: "Excellent", color: "green", icon: <Star size={20} /> }
    if ((lightOk && co2Ok) || (lightOk && tempOk) || (co2Ok && tempOk))
      return { status: "Bon", color: "yellow", icon: <ThumbsUp size={20} /> }
    return { status: "Difficile", color: "red", icon: <AlertCircle size={20} /> }
  }

  const envStatus = getEnvironmentStatus()

  useSimulationPhotosyntheseEffects({
    simulationCode,
    isRunning,
    environment,
    setIsLoaded,
    setTimeElapsed,
    setDataHistory,
    setQuizQuestions,
    getEnvironmentStatus,
  })

  const startQuiz = () => {
    setShowQuiz(true)
    setCurrentQuizQuestion(0)
    setQuizAnswers([])
    setQuizStartTime(Date.now())
    setQuizCompleted(false)
    setQuizResult(null)
    setSelectedAnswer(null)
  }

  const answerQuestion = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const nextQuestion = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...quizAnswers, selectedAnswer]
    setQuizAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1)
    } else {
      completeQuiz(newAnswers)
    }
  }

  const completeQuiz = (answers: number[]) => {
    const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000)
    // Utilisation de quizQuestions dynamiques (pas de constante dure)
    const results = answers.map((answer, index) => {
      const question = quizQuestions[index]
      const userAnswerText = question.options[answer]
      const isCorrect = userAnswerText === question.reponse_correcte
      return {
        questionId: question.id, // bonne clé ici
        userAnswer: answer,
        correct: isCorrect,
        timeSpent,
      }
    })

    const score = results.filter((r) => r.correct).length

    const result: QuizResult = {
      score,
      totalQuestions: quizQuestions.length,
      timeSpent,
      answers: results,
    }

    setQuizResult(result)
    setQuizCompleted(true)

    const percentage = Math.round((score / quizQuestions.length) * 100)
    notifySuccess(`Quiz terminé ! Score: ${score}/${quizQuestions.length} (${percentage}%)`)
  }

  const restartQuiz = () => {
    startQuiz()
  }

  const closeQuiz = () => {
    setShowQuiz(false)
    setQuizCompleted(false)
    setQuizResult(null)
  }

  usePhotosyntheseShortcuts({
    isRunning,
    setIsRunning,
    showTutorial,
    showHelp,
    setShowHelp,
    startTutorial,
    resetSimulation,
    startQuiz,
  })

  if (!isLoaded) {
  return (
    <section
      id="photosynthese"
      className="py-20 px-6 bg-light max-w-5xl mx-auto text-center rounded-2xl shadow-xl border border-accent font-sans"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
        Chargement de l’expérience
      </h2>

      <div className="flex items-center justify-center h-80 bg-accent/20 rounded-xl">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="animate-spin rounded-full h-full w-full border-4 border-accent border-t-primary"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf size={28} className="text-primary" />
            </div>
          </div>
          <p className="text-sm text-dark font-medium">
            Préparation du laboratoire virtuel...
          </p>
        </div>
      </div>
    </section>
  );
}

  return (
    <FullscreenContainer className="bg-gray-50 py-20 px-6 text-center rounded-xl shadow-lg">
      {/* Tutoriel interactif */}
      {showTutorial && (
        <TutorialOverlayPhotosynthese
          currentStep={currentStep}
          totalSteps={PHOTOSYNTHESE_TUTORIAL_STEPS.length}
          onNext={nextTutorialStep}
          onPrevious={previousTutorialStep}
          onSkip={skipTutorial}
          onComplete={completeTutorial}
        />
      )}

      {/* Quiz interactif */}
      {showQuiz && (
        <QuizOverlay
          questions={quizQuestions}
          currentQuestion={currentQuizQuestion}
          selectedAnswer={selectedAnswer}
          onClose={closeQuiz}
          onRestart={restartQuiz}
          onAnswerSelect={answerQuestion}
          onNext={nextQuestion}
          completed={quizCompleted}
          simulationCode={simulationCode}
        />
      )}

      {/* Aide contextuelle */}
      {showHelp && <GuideOverlayPhotosynthese onClose={() => setShowHelp(false)} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-green-700">
          Expérience sur la Photosynthèse
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={startTutorial}
            className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow transition"
            title="Tutoriel (T)"
            aria-label="Tutoriel"
          >
            <GraduationCap className="w-5 h-5" />
          </button>

          <button
            onClick={startQuiz}
            className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl shadow transition"
            title="Quiz (Q)"
            aria-label="Quiz"
          >
            <Brain className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow transition"
            title="Aide (H)"
            aria-label="Aide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <FullscreenButton className="ml-2" />
        </div>
      </div>

      {/* Statut de l'environnement */}
      <div className="mb-6" data-tutorial="env-status">
        <div
          className={`
      inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-white shadow transition
      ${envStatus.color === "green"
              ? "bg-green-600"
              : envStatus.color === "yellow"
                ? "bg-yellow-500"
                : "bg-red-600"
            }
    `}
        >
          <span>{envStatus.icon}</span>
          <span>Conditions : {envStatus.status}</span>
        </div>
      </div>

      {/* Contrôles principaux */}
      <div
        className="mb-8 flex flex-wrap justify-center gap-4"
        data-tutorial="controls"
      >
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`
      px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2
      ${isRunning
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:to-red-700 text-white"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:to-green-700 text-white"
            }
    `}
          aria-label={isRunning ? "Pause" : "Démarrer"}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          <span>{isRunning ? "Pause" : "Démarrer"}</span>
        </button>

        <button
          onClick={resetSimulation}
          className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:to-gray-700 text-white rounded-2xl font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          aria-label="Réinitialiser la simulation"
        >
          <RotateCw className="w-5 h-5" />
          Reset
        </button>

        <div
          className="px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl shadow"
          data-tutorial="timer"
        >
          <span className="font-bold text-blue-800 flex items-center gap-2">
            <Clock size={20} />
            {formatTime(timeElapsed)}
          </span>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-lg transition-all flex items-center gap-2"
          data-tutorial="advanced-btn"
          aria-label={showAdvanced ? "Mode Simple" : "Mode Avancé"}
        >
          <Settings className="w-5 h-5" />
          {showAdvanced ? "Mode Simple" : "Mode Avancé"}
        </button>
      </div>

      {/* Presets */}
      <div className="mb-8" data-tutorial="presets">
        <h3 className="text-xl font-semibold text-center text-gray-800 mb-4 flex items-center justify-center gap-2">
          <Target size={20} />
          Scénarios prédéfinis
        </h3>

        <div className="flex flex-wrap justify-center gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={`px-4 py-2 rounded-2xl font-medium transition transform hover:scale-105 shadow ${selectedPreset === preset.name
                ? `bg-${preset.color}-600 text-white`
                : `bg-${preset.color}-100 text-${preset.color}-700 hover:bg-${preset.color}-200`
                }`}
              title={preset.description}
              data-tutorial={
                preset.name === "Conditions Optimales" ? "preset-optimal" : undefined
              }
            >
              <div className="flex items-center gap-2">{preset.icon}<span>{preset.name}</span></div>
            </button>
          ))}
        </div>
      </div>

      {/* Contrôles environnementaux */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {[
          {
            key: "lightIntensity",
            label: (
              <span className="flex items-center gap-2">
                <SunMedium size={18} /> Intensité Lumineuse
              </span>
            ),
            unit: "%",
            min: 0,
            max: 100,
            color: "yellow",
            optimal: [60, 80],
            tutorial: "light-control",
          },
          {
            key: "co2Level",
            label: (
              <span className="flex items-center gap-2">
                <CloudDrizzle size={18} /> Niveau CO₂
              </span>
            ),
            unit: "%",
            min: 0,
            max: 100,
            color: "gray",
            optimal: [30, 60],
            tutorial: "co2-control",
          },
          {
            key: "temperature",
            label: (
              <span className="flex items-center gap-2">
                <ThermometerSun size={18} /> Température
              </span>
            ),
            unit: "°C",
            min: 0,
            max: 50,
            color: "red",
            optimal: [20, 30],
            tutorial: "temp-control",
          },
          {
            key: "humidity",
            label: (
              <span className="flex items-center gap-2">
                <Droplets size={18} /> Humidité
              </span>
            ),
            unit: "%",
            min: 0,
            max: 100,
            color: "blue",
            optimal: [50, 80],
            tutorial: "humidity-control",
          },
        ].map(({ key, label, unit, min, max, color, optimal, tutorial }) => {
          const value = environment[key as keyof LabEnvironment];
          return (
            <EnvironmentControlCard
              key={key}
              label={label}
              value={value}
              unit={unit}
              min={min}
              max={max}
              color={color}
              optimalRange={optimal as [number, number]}
              showAdvanced={showAdvanced}
              onChange={(newValue) =>
                setEnvironment((prev) => ({ ...prev, [key]: newValue }))
              }
              tutorialId={tutorial}
            />
          );
        })}
      </div>

      {/* Scène 3D */}
      <div
        className={`rounded-xl border-2 border-gray-200 overflow-hidden bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 mb-8 shadow-xl ${isFullscreen ? "h-[calc(100vh-300px)]" : "h-[500px]"
          }`}
        data-tutorial="canvas"
      >
        <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
          <SimplePhotosynthesisScene
            environment={environment}
            isRunning={isRunning}
            selectedPreset={selectedPreset}
            timeElapsed={timeElapsed}
            resetKey={resetKey}
          />
        </Canvas>
      </div>

      {/* Informations scientifiques */}
      <PhotosyntheseInfos />

      <p
        className="mt-8 text-dark max-w-3xl mx-auto leading-relaxed text-center font-sans"
        data-tutorial="completion"
      >
        Cette simulation interactive vous permet d'expérimenter avec les facteurs qui influencent la photosynthèse.
        {!tutorialCompleted && (
          <>
            {" "}
            Cliquez sur le bouton
            <button
              onClick={startTutorial}
              className="inline-flex items-center gap-1 px-2 py-1 ml-2 mr-2 bg-primary text-light text-sm font-medium rounded-md hover:bg-primary/90 transition"
              title="Lancer le tutoriel (T)"
            >
              <GraduationCap className="w-4 h-4" />
            </button>
            pour commencer le tutoriel !
          </>
        )}
      </p>
    </FullscreenContainer>
  )
}

export default SimulationPhotosynthese