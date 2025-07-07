//src/components/views/SimulationPhotosynthese
import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import type { LabEnvironment, DataPoint, Preset, QuizResult, } from "../../types/simulationPhotosyntheseTypes"
import { PHOTOSYNTHESE_TUTORIAL_STEPS } from "../../data/photosyntheseTutorial"
import { TutorialOverlayPhotosynthese } from "../ui/TutorialOverlayPhotosynthese"
import { QUIZ_QUESTIONS_PHOTOSYNTHESE } from "../../data/quizPhotosynthese"
import QuizOverlay from "../ui/QuizPhotosyntheseOverlay"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { notifySuccess, notifyInfo } from "../../lib/notifications"
import { usePhotosyntheseShortcuts } from "../../hooks/usePhotosyntheseShortcuts"
import GuideOverlayPhotosynthese from "../ui/GuideOverlayPhotosynthese"
import { FullscreenContainer } from "../../components/ui/FullscreenContainer"
import { FullscreenButton } from "../../components/ui/FullscreenButton"
import { useFullscreen } from "../../hooks/useFullscreen"
import { PRESETS } from "../../data/presetsPhotosynthese"
import { SimplePhotosynthesisScene } from "../photosynthese/SimplePhotosynthesisScene"
import EnvironmentControlCard from "../ui/EnvironmentControlCard"
import { GraduationCap, Brain, HelpCircle, Star, ThumbsUp, AlertCircle, Settings, RotateCw, CheckCircle, Leaf, Play, Pause, Clock, Target, SunMedium, CloudDrizzle, ThermometerSun, Droplets, FlaskConical, BarChart3, Thermometer } from "lucide-react"

// Composant principal avec tutoriel intégré
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
  const { isFullscreen } = useFullscreen();

  // États du tutoriel
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0)
  const [tutorialCompleted, setTutorialCompleted] = useState(false)
  const currentStep = PHOTOSYNTHESE_TUTORIAL_STEPS[currentTutorialStep]

  // États du quiz
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizStartTime, setQuizStartTime] = useState<number>(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const QUIZ_QUESTIONS = QUIZ_QUESTIONS_PHOTOSYNTHESE



  // Vérifier si c'est la première visite
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("photosynthesis-tutorial-completed")
    if (!hasSeenTutorial) {
      setShowTutorial(true)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => {
          const newTime = prevTime + 1

          // Chaque 5 secondes, on enregistre une nouvelle entrée
          if (newTime % 5 === 0) {
            const { status } = getEnvironmentStatus()

            // Taux de photosynthèse selon la qualité de l'environnement
            let photosynthesisRate = 0.4
            if (status === "Excellent") photosynthesisRate = 1.0
            else if (status === "Bon") photosynthesisRate = 0.6
            else if (status === "Difficile") photosynthesisRate = 0.2

            // Calculs des valeurs produites
            const avgHealth = Math.min(1, Math.max(0, 0.4 + (photosynthesisRate - 0.4)))
            const avgOxygen = parseFloat((photosynthesisRate * avgHealth).toFixed(2))
            const avgGlucose = parseFloat((photosynthesisRate * avgHealth * 0.7).toFixed(2))

            // Mise à jour des données
            setDataHistory((prev) => [
              ...prev.slice(-19), // Garde les 20 dernières entrées
              {
                time: newTime,
                oxygen: avgOxygen,
                glucose: avgGlucose,
                health: avgHealth,
              },
            ])
          }

          return newTime
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, environment])



  const [resetKey, setResetKey] = useState(0)

  const resetSimulation = () => {
    setTimeElapsed(0)
    setIsRunning(false)
    setDataHistory([])
    setEnvironment({ lightIntensity: 60, co2Level: 40, temperature: 25, humidity: 60 })
    setSelectedPreset(null)

    // Changer la clé pour forcer un reset dans SimplePhotosynthesisScene
    setResetKey(prev => prev + 1)

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
    console.log("Next step called, current:", currentTutorialStep, "moving to:", currentTutorialStep + 1)
    setCurrentTutorialStep((prev) => {
      const newStep = prev + 1
      console.log("Setting new step:", newStep)
      return newStep
    })
  }

  const previousTutorialStep = () => {
    if (currentTutorialStep > 0) {
      setCurrentTutorialStep(currentTutorialStep - 1)
    }
  }

  const skipTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem("photosynthesis-tutorial-completed", "true")
  }

  const completeTutorial = () => {
    setShowTutorial(false)
    setTutorialCompleted(true)
    localStorage.setItem("photosynthesis-tutorial-completed", "true")
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <span> Tutoriel terminé ! Vous êtes prêt à expérimenter !</span>
      </div>
    )
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

    if (currentQuizQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1)
    } else {
      completeQuiz(newAnswers)
    }
  }

  const completeQuiz = (answers: number[]) => {
    const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000)
    const results = answers.map((answer, index) => ({
      questionId: QUIZ_QUESTIONS[index].id,
      userAnswer: answer,
      correct: answer === QUIZ_QUESTIONS[index].correctAnswer,
      timeSpent,
    }))

    const score = results.filter((r) => r.correct).length

    const result: QuizResult = {
      score,
      totalQuestions: QUIZ_QUESTIONS.length,
      timeSpent,
      answers: results,
    }

    setQuizResult(result)
    setQuizCompleted(true)

    // Notification de fin
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100)
    notifySuccess(`🎯 Quiz terminé ! Score: ${score}/${QUIZ_QUESTIONS.length} (${percentage}%)`)
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
      <section id="photosynthese" className="py-20 px-6 bg-gray-50 max-w-7xl mx-auto text-center rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Expérience sur la photosynthèse</h2>
        <div className="flex items-center justify-center h-96 bg-gradient-to-br from-green-50 via-blue-50 to-green-100 rounded-lg">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf size={32} className="text-green-600" />
              </div>

            </div>
            <p className="text-gray-700 font-medium">Préparation du laboratoire...</p>
          </div>
        </div>
      </section>
    )
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
          questions={QUIZ_QUESTIONS}
          currentQuestion={currentQuizQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={answerQuestion}
          onNext={nextQuestion}
          onClose={closeQuiz}
          result={quizResult}
          completed={quizCompleted}
          onRestart={restartQuiz}
        />
      )}

      {/* Aide contextuelle */}
      {showHelp && (
        <GuideOverlayPhotosynthese onClose={() => setShowHelp(false)} />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Expérience sur la photosynthèse</h2>
        <div className="flex gap-2">
          <button
            onClick={startTutorial}
            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center"
            title="Tutoriel (T)"
            aria-label="Tutoriel"
          >
            <GraduationCap className="w-5 h-5" />
          </button>
          <button
            onClick={startQuiz}
            className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center justify-center"
            title="Quiz (Q)"
            aria-label="Quiz"
          >
            <Brain className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
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
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium ${envStatus.color === "green" ? "bg-green-500" : envStatus.color === "yellow" ? "bg-yellow-500" : "bg-red-500"
            }`}
        >
          <span>{envStatus.icon}</span>
          <span>Conditions: {envStatus.status}</span>
        </div>
      </div>

      {/* Contrôles principaux */}
      <div className="mb-6 flex flex-wrap justify-center gap-4" data-tutorial="controls">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-center ${isRunning
            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            }`}
          aria-label={isRunning ? "Pause" : "Démarrer"}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
          <span className="ml-2">{isRunning ? "Pause" : "Démarrer"}</span>
        </button>

        <button
          onClick={resetSimulation}
          className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-center"
          aria-label="Réinitialiser la simulation"
        >
          <RotateCw className="w-5 h-5 mr-2" />
          Reset
        </button>
        <div
          className="px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-lg"
          data-tutorial="timer"
        >
          <span className="font-bold text-blue-800 flex items-center gap-1">
            <Clock size={20} />
            {formatTime(timeElapsed)}
          </span>

        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center"
          data-tutorial="advanced-btn"
          aria-label={showAdvanced ? "Mode Simple" : "Mode Avancé"}
        >
          <Settings className="w-5 h-5 mr-2" />
          {showAdvanced ? "Simple" : "Avancé"}
        </button>
      </div>

      {/* Presets */}
      <div className="mb-6" data-tutorial="presets">
        <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
          <Target size={20} />
          Scénarios prédéfinis
        </h3>

        <div className="flex flex-wrap justify-center gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${selectedPreset === preset.name
                ? `bg-${preset.color}-500 text-white shadow-lg`
                : `bg-${preset.color}-100 text-${preset.color}-700 hover:bg-${preset.color}-200`
                }`}
              title={preset.description}
              data-tutorial={preset.name === "Conditions Optimales" ? "preset-optimal" : undefined}
            >
              <div className="flex items-center gap-2">
                {preset.icon}
                <span>{preset.name}</span>
              </div>
            </button>
          ))}

        </div>
      </div>

      {/* Contrôles environnementaux */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {[
          {
            key: "lightIntensity",
            label: (
              <span className="flex items-center gap-1">
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
              <span className="flex items-center gap-1">
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
              <span className="flex items-center gap-1">
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
              <span className="flex items-center gap-1">
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
          const value = environment[key as keyof LabEnvironment]
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
              onChange={(newValue) => setEnvironment((prev) => ({ ...prev, [key]: newValue }))}
              tutorialId={tutorial}
            />
          )
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg text-left border border-gray-100" data-tutorial="equation">
          <h3 className="font-bold text-xl mb-4 text-green-700 flex items-center gap-2">
            <FlaskConical size={20} /> Équation de la photosynthèse
          </h3>
          <div className="bg-green-50 p-4 rounded-lg text-center mb-4 border border-green-200">
            <code className="text-lg font-mono text-green-800">6CO₂ + 6H₂O + lumière → C₆H₁₂O₆ + 6O₂</code>
          </div>
          <p className="text-gray-700 leading-relaxed">
            La photosynthèse convertit le CO₂ et l'eau en glucose et oxygène grâce à l'énergie lumineuse. Ce processus
            est vital pour la vie sur Terre et produit l'oxygène que nous respirons.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg text-left border border-gray-100">
          <h3 className="font-bold text-xl mb-4 text-blue-700 flex items-center gap-2">
            <BarChart3 size={20} /> Facteurs limitants
          </h3>          <div className="space-y-3">
            {[
              {
                icon: <SunMedium size={20} />,
                factor: "Lumière",
                desc: "Fournit l'énergie nécessaire à la photosynthèse (optimal : 60-80%).",
                color: "yellow",
              },
              {
                icon: <CloudDrizzle size={20} />,
                factor: "CO₂",
                desc: "Gaz absorbé par la plante pour fabriquer du glucose (optimal : 30-60%).",
                color: "gray",
              },
              {
                icon: <Thermometer size={20} />,
                factor: "Température",
                desc: "Influe sur l'activité des enzymes (optimal : 20-30°C).",
                color: "red",
              },
              {
                icon: <Droplets size={20} />,
                factor: "Humidité",
                desc: "Favorise les échanges gazeux au niveau des feuilles (optimal : 50-80%).",
                color: "blue",
              },
            ].map(({ icon, factor, desc, color }) => (
              <div key={factor} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <span className="text-xl">{icon}</span>
                <div>
                  <strong className={`text-${color}-600`}>{factor} :</strong>
                  <p className="text-sm text-gray-600 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <p className="mt-8 text-gray-700 max-w-3xl mx-auto leading-relaxed text-center" data-tutorial="completion">
        Cette simulation interactive vous permet d'expérimenter avec les facteurs qui influencent la photosynthèse.
        {!tutorialCompleted && (
          <>
            {" "}Cliquez sur le bouton
            <button
              onClick={startTutorial}
              className="inline-flex items-center gap-1 px-2 py-1 ml-2 mr-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition"
              title="Lancer le tutoriel (T)"
            >
              <GraduationCap className="w-4 h-4" />
            </button>
            pour commencer le tutoriel !
          </>
        )}
      </p>



      {/* Conteneur React-Toastify qui affiche toutes les notifications */}
      <ToastContainer
        position="top-right"       // Position par défaut (peut être redondant avec options toast)
        autoClose={4000}           // Durée fermeture par défaut
        hideProgressBar={false}    // Affiche la barre de progression
        newestOnTop={false}        // L'ordre des notifications (les anciennes en haut)
        closeOnClick               // Ferme la notif au clic
        rtl={false}                // Texte non RTL (sens normal)
        pauseOnFocusLoss           // Pause si la fenêtre perd le focus
        draggable                  // Peut glisser la notification
        pauseOnHover              // Pause au survol
        theme="colored"            // Thème coloré (correspond aux appels toast.success/error)
      />
    </FullscreenContainer>
  )
}

export default SimulationPhotosynthese