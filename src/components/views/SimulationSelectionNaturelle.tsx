// src/components/views/SimulationSelectionNaturelle.tsx
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyInfo, notifyError, notifySuccess } from "../../lib/notifications";
import { useSelectionNaturelleShortcuts } from "../../hooks/useSelectionNaturelleShortcuts";
import GuideOverlaySelection from "../ui/GuideOverlaySelection";
import TutorialOverlaySelection from "../ui/TutorialOverlaySelection";
import { SELECTION_NATURELLE_TUTORIAL_STEPS } from "../../data/selectionNaturelleTutorial";
import { QUIZ_QUESTIONS_SELECTION } from "../../data/quizSelection";
import QuizOverlay from "../ui/QuizSelectionOverlay";
import { FullscreenContainer } from "../../components/ui/FullscreenContainer";
import { FullscreenButton } from "../../components/ui/FullscreenButton";
import { useFullscreen } from "../../hooks/useFullscreen";
import { GraduationCap, Brain, HelpCircle, RotateCw, Play, Pause, Clock, Cat, Bone, Leaf, WandSparkles, Dna, AlertTriangle, Paintbrush, Ear, Star, ThumbsUp, AlertCircle } from "lucide-react";
import type {
  RabbitGenetics,
  EnvironmentalFactors,
  GenerationStats,
  StatsDataPoint,
  GenerationExplanation,
  QuizResult,
  QuizAnswer,
  QuizQuestion
} from "../../types/selectionNaturelleTypes";
import { createRandomRabbit } from "../utils/naturalSelection";
import { simulationSelectionNaturelle } from "../utils/simulationSelectionNaturelle";
import { updateStatistics } from "../utils/updateStatistics";
import Rabbit, { SimpleRabbit } from "../selection/Rabbit";
import RabbitInfo from "../selection/RabbitInfo";
import Wolf from "../selection/Wolf";
import Food from "../selection/Food";
import RabbitCreator from "../selection/RabbitCreator";
import QuizSelectionOverlay from "../ui/QuizSelectionOverlay";
import { supabase } from "../../lib/supabaseClient";

const DEFAULT_ENVIRONMENT: EnvironmentalFactors = {
  wolvesPresent: false,
  foodHardness: false,
  foodScarcity: false,
  temperature: "moderate"
};

const MAX_GENERATIONS = 4;

const SimulationSelectionNaturelle = () => {
  // États principaux
  const [allLivingRabbits, setAllLivingRabbits] = useState<RabbitGenetics[]>([]);
  const [allRabbitsHistory, setAllRabbitsHistory] = useState<RabbitGenetics[]>([]);
  const [selectedRabbit, setSelectedRabbit] = useState<RabbitGenetics | null>(null);
  const [lastExplanation, setLastExplanation] = useState<GenerationExplanation | null>(null);
  const [, setExplanationByGeneration] = useState<Map<number, GenerationExplanation>>(new Map());
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const [environment, setEnvironment] = useState<EnvironmentalFactors>(DEFAULT_ENVIRONMENT);
  const [stats, setStats] = useState<GenerationStats>({
    totalPopulation: 0,
    traitFrequencies: {},
    generationNumber: 0,
    survivalRate: 1.0
  });
  const [, setGenerationHistory] = useState<StatsDataPoint[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { isFullscreen } = useFullscreen();
  const [isLoaded, setIsLoaded] = useState(false);

  // États tutoriel et quiz
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [, setTutorialCompleted] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);


  // Fonction pour calculer la distribution des traits
  const calculateTraitsDistribution = (rabbits: RabbitGenetics[]): StatsDataPoint['traits'] => {
    return rabbits.reduce((acc, rabbit) => {
      acc.fur[rabbit.furColor] += 1;
      acc.ears[rabbit.earType] += 1;
      acc.teeth[rabbit.toothLength] += 1;
      return acc;
    }, {
      fur: { brown: 0, white: 0 },
      ears: { straight: 0, floppy: 0 },
      teeth: { long: 0, short: 0 }
    });
  };

  // Fonction pour obtenir les effets environnementaux actifs
  const getActiveEnvironmentalEffects = (): string[] => {
    const effects: string[] = [];

    if (environment.wolvesPresent) {
      effects.push("Présence de loups : cela exerce une pression de sélection en faveur des lapins rapides, qui échappent plus facilement aux prédateurs.");
    }
    if (environment.foodHardness) {
      effects.push("Aliments durs disponibles : sélection naturelle en faveur des lapins aux dents longues, mieux adaptés à la mastication.");
    }
    if (environment.foodScarcity) {
      effects.push("Rareté des ressources alimentaires : pression sélective accrue, seuls les individus les plus compétitifs survivent.");
    }

    return effects;
  };

  // Initialisation
  useEffect(() => {
    const initializeSimulation = () => {
      const firstRabbit = createRandomRabbit(0, 0);
      setAllLivingRabbits([firstRabbit]);
      setAllRabbitsHistory([firstRabbit]);

      const initialStats = updateStatistics([firstRabbit]);
      setStats(initialStats);

      setGenerationHistory([{
        generation: 0,
        population: 1,
        traits: calculateTraitsDistribution([firstRabbit])
      }]);
    };

    initializeSimulation();
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Simulation en temps réel
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && allLivingRabbits.length >= 2 && currentGeneration < MAX_GENERATIONS - 1) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        simulateNextGeneration();
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isRunning, allLivingRabbits, currentGeneration]);

  const simulateNextGeneration = () => {
    if (allLivingRabbits.length < 2) {
      notifyError("Il faut au moins deux lapins vivants pour lancer une nouvelle génération.");
      return;
    }

    if (currentGeneration >= MAX_GENERATIONS - 1) {
      notifyError(`Nombre maximum de générations atteint (${MAX_GENERATIONS}).`);
      setIsRunning(false);
      return;
    }

    const nextGeneration = currentGeneration + 1;
    const result = simulationSelectionNaturelle(allLivingRabbits, environment, nextGeneration);
    const { newLivingRabbits, explanation, newDeadRabbits } = result;

    const newTraits = calculateTraitsDistribution(newLivingRabbits);

    if (!newTraits) {
      notifyError("Erreur dans le calcul des traits");
      return;
    }

    if (explanation) {
      const updatedExplanation = {
        ...explanation,
        generation: nextGeneration,
        environmentalEffects: getActiveEnvironmentalEffects(),
        traitExplanations: {
          fur: {
            alleles: explanation.traitExplanations.fur.alleles,
            phenotype: `${newTraits.fur.brown} bruns, ${newTraits.fur.white} blancs`,
            advantage: explanation.traitExplanations.fur.advantage
          },
          ear: {
            alleles: explanation.traitExplanations.ear.alleles,
            phenotype: `${newTraits.ears.straight} droites, ${newTraits.ears.floppy} tombantes`,
            advantage: explanation.traitExplanations.ear.advantage
          },
          tooth: {
            alleles: explanation.traitExplanations.tooth.alleles,
            phenotype: `${newTraits.teeth.long} longues, ${newTraits.teeth.short} courtes`,
            advantage: explanation.traitExplanations.tooth.advantage
          }
        }
      };

      setExplanationByGeneration(prev => {
        const updated = new Map(prev);
        updated.set(nextGeneration, updatedExplanation);
        return updated;
      });
      setLastExplanation(updatedExplanation);
    }

    setAllLivingRabbits(newLivingRabbits);
    setAllRabbitsHistory(prev => [...prev, ...newDeadRabbits, ...newLivingRabbits]);
    setCurrentGeneration(nextGeneration);
    setStats(updateStatistics(newLivingRabbits));
  };

  // Fonctions du tutoriel
  const nextTutorialStep = () => {
    if (currentTutorialStep < SELECTION_NATURELLE_TUTORIAL_STEPS.length - 1) {
      setCurrentTutorialStep(currentTutorialStep + 1);
    } else {
      completeTutorial();
    }
  };

  const previousTutorialStep = () => {
    if (currentTutorialStep > 0) {
      setCurrentTutorialStep(currentTutorialStep - 1);
    }
  };

  const skipTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("selection-tutorial-completed", "true");
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    setTutorialCompleted(true);
    localStorage.setItem("selection-tutorial-completed", "true");
    notifySuccess(
      "Tutoriel terminé ! Vous êtes prêt à expérimenter !"
    );
  };

  const startTutorial = () => {
    setShowTutorial(true);
    setCurrentTutorialStep(0);
    setTutorialCompleted(false);
  };

  // Chargement dynamique des questions depuis Supabase
  // Chargement dynamique des questions depuis Supabase
useEffect(() => {
  const fetchQuizQuestions = async () => {
    try {
      // 1. Récupérer l'ID de la simulation à partir de son code
      const { data: simulation, error: simError } = await supabase
        .from("simulation")
        .select("id")
        .eq("code", "selection-naturelle") // adapte si le code est passé en prop
        .single();

      if (simError || !simulation) {
        notifyError("Erreur lors de la récupération de la simulation.");
        console.error("Erreur simulation:", simError);
        return;
      }

      const simulationId = simulation.id;

      // 2. Récupérer le dernier quiz associé à cette simulation
      const { data: latestQuiz, error: quizError } = await supabase
        .rpc("get_latest_quiz_for_simulation", { simulation_uuid: simulationId });

      if (quizError || !latestQuiz || latestQuiz.length === 0) {
        notifyError("Aucun quiz disponible pour cette simulation.");
        console.warn("Aucun quiz lié à cette simulation.", quizError);
        return;
      }

      const quizId = latestQuiz[0].quiz_id;

      // 3. Récupérer les questions du quiz
      const { data: questions, error: questionsError } = await supabase
        .from("question")
        .select("*")
        .eq("quiz_id", quizId)
        .order("created_at", { ascending: true });

      if (questionsError) {
        notifyError("Erreur lors du chargement des questions.");
        console.error("Erreur questions:", questionsError);
        return;
      }

      if (!questions || questions.length === 0) {
        notifyError("Aucune question disponible pour ce quiz.");
        return;
      }

      // 4. Mise à jour de l'état local
      setQuizQuestions(questions as QuizQuestion[]);
    } catch (error) {
      notifyError("Erreur inattendue lors du chargement du quiz.");
      console.error("Erreur globale :", error);
    }
  };

  fetchQuizQuestions();
}, []);

  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentQuizQuestion(0);
    setQuizAnswers([]);
    setQuizStartTime(Date.now());
    setQuestionTimes([Date.now()]);
    setQuizCompleted(false);
    setQuizResult(null);
    setSelectedAnswer(null);
  };

  const answerQuestion = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (selectedAnswer === null) return;

    setQuestionTimes(prev => [...prev, Date.now()]);
    const newAnswers = [...quizAnswers, selectedAnswer];
    setQuizAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      completeQuiz(newAnswers);
    }
  };

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

  const restartQuiz = () => startQuiz();
  const closeQuiz = () => {
    setShowQuiz(false);
    setQuizCompleted(false);
    setQuizResult(null);
  };

  const resetSimulation = () => {
    const firstRabbit = createRandomRabbit(0, 0);
    setAllLivingRabbits([firstRabbit]);
    setAllRabbitsHistory([firstRabbit]);
    setCurrentGeneration(0);
    setEnvironment(DEFAULT_ENVIRONMENT);
    setGenerationHistory([{
      generation: 0,
      population: 1,
      traits: calculateTraitsDistribution([firstRabbit])
    }]);
    setSelectedRabbit(null);
    setLastExplanation(null);
    setExplanationByGeneration(new Map());
    setIsRunning(false);
    setTimeElapsed(0);
    notifyInfo("Simulation réinitialisée");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getEnvironmentStatus = () => {
    const factors = [
      environment.wolvesPresent ? "Prédateurs" : null,
      environment.foodHardness ? "Nourriture dure" : null,
      environment.foodScarcity ? "Nourriture rare" : null
    ].filter(Boolean);

    if (factors.length > 1) {
      return { status: "Conditions difficiles", color: "text-red-600", icon: <AlertCircle size={20} /> }
    }
    if (factors.length > 0) {
      return { status: "Conditions modérées", color: "text-yellow-600", icon: <ThumbsUp size={20} /> }
    }
    return { status: "Conditions optimales", color: "text-green-600", icon: <Star size={20} /> }
  };

  useSelectionNaturelleShortcuts({
    showTutorial,
    showGuide,
    showQuiz,
    setShowTutorial,
    setShowGuide,
    resetSimulation,
    simulateNextGeneration,
    setIsRunning,
    isRunning,
    startTutorial,
    startQuiz
  });

  const envStatus = getEnvironmentStatus();

  if (!isLoaded) {
    return (
      <section id="selection-naturelle" className="py-20 px-6 bg-gray-50 max-w-7xl mx-auto text-center rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Simulation de sélection naturelle</h2>
        <div className="flex items-center justify-center h-96 bg-gradient-to-br from-green-50 via-blue-50 to-green-100 rounded-lg">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <SimpleRabbit size={32} className="text-green-600" />
              </div>
            </div>
            <p className="text-gray-700 font-medium">Préparation de l'environnement...</p>
            <p className="text-sm text-gray-500 mt-2">
              Simulation limitée à {MAX_GENERATIONS} générations
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <FullscreenContainer className="bg-gray-50 py-20 px-6 text-center rounded-xl shadow-lg">
      {/* Overlays*/}
      {showGuide && <GuideOverlaySelection onClose={() => setShowGuide(false)} />}
      {showTutorial && (
        <TutorialOverlaySelection
          currentStep={SELECTION_NATURELLE_TUTORIAL_STEPS[currentTutorialStep]}
          totalSteps={SELECTION_NATURELLE_TUTORIAL_STEPS.length}
          onNext={nextTutorialStep}
          onPrevious={previousTutorialStep}
          onSkip={skipTutorial}
          onComplete={completeTutorial}
        />
      )}

      {showQuiz && (
        <QuizSelectionOverlay
          questions={quizQuestions}
          currentQuestion={currentQuizQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={answerQuestion}
          onNext={nextQuestion}
          onClose={closeQuiz}
          completed={quizCompleted}
          onRestart={restartQuiz}
          simulationCode={"selection-naturelle"} // si nécessaire
        />
      )}

      {/* En-tête amélioré */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Simulation de sélection naturelle</h2>
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
            onClick={() => setShowGuide(true)}
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
      <div className="mb-6">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${envStatus.color === "text-red-600" ? "bg-red-100" : envStatus.color === "text-yellow-600" ? "bg-yellow-100" : "bg-green-100"} ${envStatus.color}`}
        >
          <span>{envStatus.icon}</span>
          <span>{envStatus.status}</span>
        </div>
      </div>

      {/* Contrôles principaux */}
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => {
            if (allLivingRabbits.length < 2) {
              notifyError("Il faut au moins deux lapins vivants pour lancer une simulation.");
              return;
            }
            if (currentGeneration >= MAX_GENERATIONS - 1) {
              notifyError(`Dernière génération atteinte (${MAX_GENERATIONS}).`);
              setIsRunning(false);
              return;
            }
            setIsRunning(!isRunning);
          }}
          disabled={currentGeneration >= MAX_GENERATIONS || allLivingRabbits.length < 2}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg transform flex items-center justify-center gap-2
            ${isRunning
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:scale-105"
              : currentGeneration >= MAX_GENERATIONS - 1 || allLivingRabbits.length < 2
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105"
            }`}
          title={
            currentGeneration >= MAX_GENERATIONS - 1
              ? "Dernière génération atteinte"
              : allLivingRabbits.length < 2
                ? "Il faut au moins deux lapins vivants"
                : isRunning
                  ? "Mettre en pause la simulation"
                  : "Démarrer la simulation"
          }
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
          <span>{isRunning ? "Pause" : "Démarrer"}</span>
        </button>

        <button
          onClick={resetSimulation}
          className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-center"
          aria-label="Réinitialiser la simulation"
        >
          <RotateCw className="w-5 h-5 mr-2" />
          Reset
        </button>

        <div className="px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-lg">
          <span className="font-bold text-blue-800 flex items-center gap-1">
            <Clock size={20} />
            {formatTime(timeElapsed)}
          </span>
        </div>

        <button
          onClick={simulateNextGeneration}
          disabled={currentGeneration >= MAX_GENERATIONS - 1 || allLivingRabbits.length < 2}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg transform flex items-center justify-center
            ${currentGeneration >= MAX_GENERATIONS - 1 || allLivingRabbits.length < 2
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:scale-105"
            }`}
          title={
            currentGeneration >= MAX_GENERATIONS
              ? "Dernière génération atteinte"
              : allLivingRabbits.length < 2
                ? "Il faut au moins deux lapins vivants"
                : "Passer à la génération suivante"
          }
        >
          Génération suivante
        </button>
      </div>

      {/* Facteurs environnementaux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
        {[
          {
            key: "wolvesPresent",
            label: "Prédateurs",
            description: "Favorise les lapins rapides et discrets",
            activeDescription: "Les loups chassent les lapins les plus lents",
            icon: <Cat className="w-5 h-5 text-gray-700" />,
          },
          {
            key: "foodHardness",
            label: "Nourriture dure",
            description: "Favorise les dents longues",
            activeDescription: "Seuls les lapins aux dents longues peuvent manger",
            icon: <Bone className="w-5 h-5 text-gray-700" />,
          },
          {
            key: "foodScarcity",
            label: "Nourriture rare",
            description: "Augmente la compétition",
            activeDescription: "Les lapins doivent lutter pour se nourrir",
            icon: <Leaf className="w-5 h-5 text-gray-700" />,
          },
        ].map(({ key, label, description, activeDescription, icon }) => {
          const isActive = environment[key as keyof EnvironmentalFactors] as boolean;
          return (
            <div key={key} className={`bg-white p-4 rounded-xl shadow border transition-all ${isActive ? "border-yellow-400 bg-yellow-50" : "border-gray-200"}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-semibold">{label}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {isActive ? activeDescription : description}
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setEnvironment(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition transform ${isActive ? 'translate-x-4' : ''}`}></div>
                </div>
                <span className="text-sm font-medium">{isActive ? "Activé" : "Désactivé"}</span>
              </label>
            </div>
          );
        })}
      </div>

      {/* Scène 3D */}
      <div className={`relative rounded-xl border-2 border-gray-200 overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 mb-8 shadow-xl ${isFullscreen ? "h-[calc(100vh-300px)]" : "h-[500px]"}`}>
        <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
        </Canvas>

        {/* Couche HTML/SVG */}
        <div className="absolute inset-0 z-10">
          {/* Overlay de statistiques en haut */}
          <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-lg shadow border border-gray-200">
            <p className="text-sm font-semibold">Population: {stats.totalPopulation}</p>
            <p className="text-sm">Génération: {currentGeneration + 1}/{MAX_GENERATIONS}</p>
          </div>

          {/* Légende des générations en bas */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            {Array.from({ length: MAX_GENERATIONS }, (_, i) => i)
              .filter(gen => allLivingRabbits.some(r => r.generation === gen && r.isAlive))
              .map(generation => (
                <div key={generation} className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-full">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: [
                        "#3B82F6", "#10B981", "#F59E0B",
                        "#EF4444", "#8B5CF6"
                      ][generation]
                    }}
                  />
                  <span className="text-xs">G{generation + 1}</span>
                </div>
              ))}
          </div>

          {/* Éléments interactifs */}
          <Food environment={environment} />
          {allLivingRabbits
            .filter(r => r.isAlive)
            .map((rabbit, index) => (
              <Rabbit
                key={rabbit.id}
                genetics={rabbit}
                index={index}
                isSelected={selectedRabbit?.id === rabbit.id}
                onSelect={() => setSelectedRabbit(rabbit)}
              />
            ))}
          {environment.wolvesPresent && <Wolf />}

          {selectedRabbit && (
            <RabbitInfo
              rabbit={selectedRabbit}
              allRabbits={allRabbitsHistory}
              onClose={() => setSelectedRabbit(null)}
            />
          )}
        </div>
      </div>

      {/* Créateur de lapins */}
      {allLivingRabbits.length < 2 && (
        <div className="bg-green-50 p-6 rounded-xl border border-green-200 mb-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center justify-center gap-2">
            <WandSparkles className="w-5 h-5 text-green-600" />
            Création de Lapins
          </h3>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Créez au moins 2 lapins pour commencer la simulation
          </p>
          <RabbitCreator
            onCreateRabbit={(rabbit) => {
              if (currentGeneration >= MAX_GENERATIONS) {
                notifyError("Simulation terminée, impossible d'ajouter de nouveaux lapins.");
                return;
              }
              const newRabbits = [...allLivingRabbits, rabbit];
              setAllLivingRabbits(newRabbits);
              setAllRabbitsHistory(prev => [...prev, rabbit]);
              setStats(updateStatistics(newRabbits));
            }}
            isCompanion={false}
            canCreate={currentGeneration < MAX_GENERATIONS}
          />
        </div>
      )}

      {/* Explications et statistiques */}
      {lastExplanation && (
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center justify-center gap-2">
            <Dna className="w-5 h-5 text-blue-600" />
            Explication Génération {currentGeneration + 1}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloc des traits hérités */}
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium mb-3 text-blue-700 border-b pb-2">Traits hérités</h4>
              <ul className="space-y-3">
                {Object.entries(lastExplanation.traitExplanations).map(
                  ([trait, explanation]) => {
                    const currentTraits = calculateTraitsDistribution(allLivingRabbits);
                    if (!currentTraits) return null;

                    const phenotypeText = (() => {
                      switch (trait) {
                        case "fur": return `${currentTraits.fur.brown} bruns, ${currentTraits.fur.white} blancs`;
                        case "ear": return `${currentTraits.ears.straight} droites, ${currentTraits.ears.floppy} tombantes`;
                        case "tooth": return `${currentTraits.teeth.long} longues, ${currentTraits.teeth.short} courtes`;
                        default: return "";
                      }
                    })();

                    const traitName = (() => {
                      switch (trait) {
                        case "fur": return "Fourrure";
                        case "ear": return "Oreilles";
                        case "tooth": return "Dents";
                        default: return trait;
                      }
                    })();

                    return (
                      <li key={trait} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {trait === "fur" && <Paintbrush className="w-5 h-5 text-pink-600" />}
                          {trait === "ear" && <Ear className="w-5 h-5 text-yellow-600" />}
                          {trait === "tooth" && <Bone className="w-5 h-5 text-gray-700" />}
                        </div>
                        <div>
                          <strong className="text-gray-800">{traitName}:</strong>
                          <p className="text-gray-600 text-sm mt-1">
                            Allèles: {explanation.alleles.join(", ")} <br />
                            Phénotype: {phenotypeText}
                            {explanation.advantage && (
                              <>
                                <br />
                                Avantage: {explanation.advantage}
                              </>
                            )}
                          </p>
                        </div>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>

            {/* Bloc effets environnementaux */}
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium mb-3 text-blue-700 border-b pb-2">
                Effets environnementaux actifs
              </h4>
              {getActiveEnvironmentalEffects().length > 0 ? (
                <ul className="space-y-2">
                  {getActiveEnvironmentalEffects().map((effect, i) => (
                    <li key={i} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="flex-shrink-0 w-4 h-4 mt-1 text-yellow-600" />
                      <span className="text-sm text-yellow-800">{effect}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 italic">
                    Aucun effet environnemental actif
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </FullscreenContainer>
  );
};

export default SimulationSelectionNaturelle;