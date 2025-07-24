// src/components/views/SimulationPollution.tsx
import { useState, useEffect } from "react";
import { TutorialOverlayPollution } from "../ui/TutorialOverlayPollution";
import GuideOverlayPollution from "../ui/GuideOverlayPollution";
import QuizPollution from "../ui/QuizPollutionOverlay";
import type { PollutionData, Solution, Vehicle, QuizResult, TooltipData, QuizQuestion } from "../../types/simulationPollutionTypes";
import { INITIAL_POLLUTION_DATA, INITIAL_SOLUTIONS } from "../../data/initialPollutionState";
import { calculatePollution } from "../../hooks/calculatePollution";
import { usePollutionParticles } from "../../hooks/usePollutionParticles";
import { usePollutionVehicles } from "../../hooks/usePollutionVehicles";
import { getAQIStatus } from "../utils/aqiUtils";
import { POLLUTION_TUTORIAL_STEPS } from "../../data/pollutionTutorial";
import {
  GraduationCap, Brain, HelpCircle,
  Factory, Car, RotateCw, Play, Pause,
  Clock, FlaskConical,
  BarChart3, Target,
} from "lucide-react";
import { notifySuccess, notifyInfo, notifyError } from "../../lib/notifications";
import PollutionScene from "../pollution/PollutionScene";
import TooltipFloating from "../ui/TooltipFloating";
import { FullscreenContainer } from "../ui/FullscreenContainer";
import { FullscreenButton } from "../ui/FullscreenButton";
import EnvironmentModal from "../pollution/EnvironmentModal";
import HealthEffects from "../pollution/HealthEffects";
import CarCountControl from "../pollution/CarCountControl";
import IndustryCountControl from "../pollution/IndustryCountControl";
import { usePollutionShortcuts } from "../../hooks/usePollutionShortcuts";
import { supabase } from "../../lib/supabaseClient";

interface Classe {
  id: string;
  created_by: string;
}

interface UserClasseData {
  classe: Classe | null;
}

export default function SimulationPollution() {
  // États de la simulation
  const [pollutionData, setPollutionData] = useState<PollutionData>(INITIAL_POLLUTION_DATA);
  const [carCount, setCarCount] = useState(1);
  const [industryCount, setIndustryCount] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [animationTime, setAnimationTime] = useState(0);
  const [solutions, setSolutions] = useState<Solution[]>(INITIAL_SOLUTIONS);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // États du tutoriel
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [, setTutorialCompleted] = useState(false);

  // États du quiz
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [, setQuestionTimes] = useState<number[]>([]);


  // États d'aide
  const [showHelp, setShowHelp] = useState(false);

  // Animation et données
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [particles, setParticles] = useState<any[]>([]);

  const currentStep = POLLUTION_TUTORIAL_STEPS[currentTutorialStep];
  const aqiStatus = getAQIStatus(pollutionData.aqi);
  const solutionImpact = solutions.filter((s) => s.active).reduce((sum, s) => sum + s.impact, 0);
  const effectivePollution = Math.max(0, pollutionData.level - solutionImpact);

  // Sources de pollution
  const sources = [
    { value: "voiture", label: "Transport", color: "text-red-600" },
    { value: "industrie", label: "Industrie", color: "text-gray-600" },
  ];

  // Initialisation
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("pollution-tutorial-completed");
    if (!hasSeenTutorial) setShowTutorial(true);

    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Animation principale
  useEffect(() => {
    const interval = setInterval(() => setAnimationTime(prev => prev + 1), 100);
    return () => clearInterval(interval);
  }, []);

  // Calcul de la pollution
  useEffect(() => {
    const result = calculatePollution({
      source: pollutionData.source,
      carCount,
      industryCount,
      solutions,
    });
    setPollutionData(prev => ({ ...prev, ...result }));
  }, [carCount, industryCount, pollutionData.source, solutions]);

  // Gestion du temps
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Animations
  usePollutionParticles({ pollutionLevel: pollutionData.level, solutions, isAnalyzing, setParticles });
  usePollutionVehicles({ carCount, solutions, setVehicles, isRunning });

  // Actions
  const handleAnalyze = () => {
    setIsAnalyzing(true);
  };


  const handleSolutionToggle = (solutionId: string) => {
    setSolutions(prev => prev.map(s => s.id === solutionId ? { ...s, active: !s.active } : s));
  };

  const resetSimulation = () => {
    setPollutionData(INITIAL_POLLUTION_DATA);
    setCarCount(1);
    setIndustryCount(1);
    setIsRunning(false);
    setTimeElapsed(0);
    setSolutions(INITIAL_SOLUTIONS);
    notifyInfo("Simulation réinitialisée");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Tutoriel
  const startTutorial = () => {
    setShowTutorial(true);
    setCurrentTutorialStep(0);
    setTutorialCompleted(false);
  };

  const nextTutorialStep = () => setCurrentTutorialStep(prev => prev + 1);
  const previousTutorialStep = () => currentTutorialStep > 0 && setCurrentTutorialStep(prev => prev - 1);

  const skipTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("pollution-tutorial-completed", "true");
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    setTutorialCompleted(true);
    localStorage.setItem("pollution-tutorial-completed", "true");
    notifySuccess(
      "Tutoriel Pollution terminé ! Vous êtes prêt à expérimenter !"
    );
  };

  // Chargement dynamique des questions depuis Supabase
useEffect(() => {
  const fetchQuizQuestions = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    if (userError || !user) {
      notifyError("Utilisateur non authentifié");
      return;
    }

    const userId = user.id;

    const { data: userClassesData, error: ucError } = await supabase
      .from("users_classe")
      .select("classe:classe_id(id, created_by)")
      .eq("users_id", userId);

    const userClasses = userClassesData as UserClasseData[] | null;
    if (ucError || !userClasses || userClasses.length === 0) {
      notifyError("Vous n'appartenez à aucune classe.");
      return;
    }

    const classIds = userClasses.map((uc) => uc.classe?.id).filter((id): id is string => !!id);
    const profIds = userClasses.map((uc) => uc.classe?.created_by).filter((id): id is string => !!id);

    // 1. Trouver la simulation "pollution"
    const { data: simulation, error: simError } = await supabase
      .from("simulation")
      .select("id")
      .eq("code", "pollution")
      .single();

    if (simError || !simulation) {
      notifyError("Simulation introuvable.");
      return;
    }

    const simulationId = simulation.id;

    // 2. Trouver les quiz associés à cette simulation
    const { data: simQuizClasseData, error: simQuizClasseError } = await supabase
      .from("simulation_quiz")
      .select("quiz_id")
      .eq("simulation_id", simulationId);

    if (simQuizClasseError || !simQuizClasseData || simQuizClasseData.length === 0) {
      notifyError("Aucun quiz associé à cette simulation.");
      return;
    }

    // 3. Pour chaque quiz, vérifier s’il est assigné à une classe de l’élève
    let quizId: string | null = null;

    for (const simQuiz of simQuizClasseData) {
      const { data: classeQuiz, error: cqError } = await supabase
        .from("classe_quiz")
        .select("classe_id")
        .eq("quiz_id", simQuiz.quiz_id);

      if (!cqError && classeQuiz?.some((cq) => classIds.includes(cq.classe_id))) {
        quizId = simQuiz.quiz_id;
        break;
      }
    }

    if (!quizId) {
      notifyError("Ce quiz n’est pas assigné à votre classe.");
      return;
    }

    // 4. Vérifier que le quiz a été créé par le professeur de la classe
    const { data: quiz, error: quizError } = await supabase
      .from("quiz")
      .select("id, created_by")
      .eq("id", quizId)
      .single();

    if (quizError || !quiz) {
      notifyError("Quiz introuvable.");
      return;
    }

    if (!profIds.includes(quiz.created_by)) {
      notifyInfo("Ce quiz n’a pas été créé par le professeur de votre classe.");
      return;
    }

    // 5. Charger les questions du quiz
    const { data: questions, error: questionsError } = await supabase
      .from("question")
      .select("*")
      .eq("quiz_id", quizId)
      .order("created_at", { ascending: true });

    if (questionsError || !questions) {
      notifyError("Erreur lors du chargement des questions.");
      return;
    }

    setQuizQuestions(questions as QuizQuestion[]);
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

  usePollutionShortcuts({
    isRunning,
    setIsRunning,
    showTutorial,
    showHelp,
    setShowHelp,
    startTutorial,
    resetSimulation,
    startQuiz,
  });

  if (!isLoaded) {
    return (
      <section
        id="pollution"
        className="py-20 px-8 max-w-5xl mx-auto bg-light rounded-xl shadow-lg text-center font-sans"
        aria-live="polite"
        aria-busy="true"
      >
        <h2 className="text-4xl font-heading font-semibold mb-8 text-primary">
          Simulation de Pollution Atmosphérique
        </h2>

        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-inner">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-light border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Factory size={32} className="text-primary" aria-hidden="true" />
            </div>
          </div>
          <p className="text-lg font-medium text-dark">
            Chargement de l'environnement...
          </p>
        </div>
      </section>
    );
  }

  return (
    <FullscreenContainer className="bg-gray-50 py-20 px-6 text-center rounded-xl shadow-lg">
      {/* Overlays */}
      {showTutorial && (
        <TutorialOverlayPollution
          currentStep={currentStep}
          totalSteps={POLLUTION_TUTORIAL_STEPS.length}
          onNext={nextTutorialStep}
          onPrevious={previousTutorialStep}
          onSkip={skipTutorial}
          onComplete={completeTutorial}
        />
      )}

      {showQuiz && (
        <QuizPollution
          questions={quizQuestions}
          currentQuestion={currentQuizQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={answerQuestion}
          onNext={nextQuestion}
          onClose={closeQuiz}
          completed={quizCompleted}
          onRestart={restartQuiz}
          simulationCode={"pollution"}
        />
      )}

      {showHelp && <GuideOverlayPollution onClose={() => setShowHelp(false)} />}

      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-heading font-semibold text-primary">
          Simulation de Pollution Atmosphérique
        </h2>
        <div className="flex gap-3">
          <button
            onClick={startTutorial}
            className="px-4 py-2 bg-primary text-light rounded-lg hover:bg-primary/90 transition flex items-center justify-center"
            aria-label="Démarrer le tutoriel"
          >
            <GraduationCap className="w-5 h-5" />
          </button>

          <button
            onClick={startQuiz}
            className="px-4 py-2 bg-secondary text-light rounded-lg hover:bg-secondary/90 transition flex items-center justify-center"
            aria-label="Démarrer le quiz"
          >
            <Brain className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="px-4 py-2 bg-accent text-dark rounded-lg hover:bg-accent/90 transition flex items-center justify-center"
            aria-label="Afficher l’aide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <FullscreenButton className="ml-3" />
        </div>
      </div>

      {/* Statut de la qualité de l'air */}
      <div className="mb-6">
        <div
          className={`
      inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold 
      shadow-sm transition-all duration-300 ${aqiStatus.color} ${aqiStatus.textColor}
    `}
        >
          {aqiStatus.icon}
          <span className="text-white">Qualité de l'air : {aqiStatus.label}</span>
        </div>
      </div>

      {/* Contrôles principaux */}
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          aria-label={isRunning ? "Mettre en pause" : "Démarrer la simulation"}
          className={`
      px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg 
      transform hover:scale-105 flex items-center justify-center
      ${isRunning ? "bg-secondary text-white hover:bg-opacity-90" : "bg-primary text-white hover:bg-opacity-90"}
    `}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
          <span className="ml-2">{isRunning ? "Pause" : "Démarrer"}</span>
        </button>

        <button
          onClick={handleAnalyze}
          aria-label="Analyser la qualité de l'air"
          className="px-8 py-3 bg-accent text-dark hover:bg-green-200 rounded-xl font-semibold transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-center"
        >
          <FlaskConical className="w-5 h-5 mr-2" />
          Analyser
        </button>

        <button
          onClick={resetSimulation}
          aria-label="Réinitialiser la simulation"
          className="px-8 py-3 bg-dark text-white hover:bg-black rounded-xl font-semibold transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-center"
        >
          <RotateCw className="w-5 h-5 mr-2" />
          Reset
        </button>

        <div className="px-6 py-3 bg-light rounded-xl shadow-lg">
          <span className="font-bold text-dark flex items-center gap-1">
            <Clock size={20} />
            {formatTime(timeElapsed)}
          </span>
        </div>
      </div>

      {/* Sélecteur de source */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2 text-dark">
          <Target size={20} />
          Source de pollution
        </h3>

        <div className="flex flex-wrap justify-center gap-3">
          {sources.map((source) => {
            const isSelected = pollutionData.source === source.value
            const isVoiture = source.value === "voiture"

            const baseBg = isVoiture ? "bg-secondary" : "bg-dark"
            const baseText = "text-white"
            const inactiveBg = isVoiture ? "bg-secondary/10" : "bg-dark/10"
            const inactiveText = isVoiture ? "text-secondary" : "text-dark"
            const hoverBg = isVoiture ? "hover:bg-secondary/20" : "hover:bg-dark/20"

            return (
              <button
                key={source.value}
                onClick={() =>
                  setPollutionData((prev) => ({
                    ...prev,
                    source: source.value as "voiture" | "industrie",
                  }))
                }
                aria-label={`Choisir la source : ${source.label}`}
                className={`
            px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 
            flex items-center gap-2
            ${isSelected ? `${baseBg} ${baseText} shadow-lg` : `${inactiveBg} ${inactiveText} ${hoverBg}`}
          `}
              >
                {isVoiture ? <Car size={20} /> : <Factory size={20} />}
                <span>{source.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Contrôles d'environnement */}
      <EnvironmentModal
        isOpen={isAnalyzing}
        onClose={() => setIsAnalyzing(false)}
        pollutionData={pollutionData}
        isAnalyzing={isAnalyzing}
      />

      {/* Contrôles spécifiques */}
      {pollutionData.source === "voiture" && (
        <CarCountControl
          carCount={carCount}
          setCarCount={setCarCount}
          setTooltip={setTooltip}
        />
      )}

      {pollutionData.source === "industrie" && (
        <IndustryCountControl
          industryCount={industryCount}
          setIndustryCount={setIndustryCount}
          setTooltip={setTooltip}
        />
      )}

      {/* Scène de pollution */}
      <div className="relative w-full mb-8" style={{ height: '500px' }}>
        <div className="absolute inset-0 rounded-xl border-2 border-gray-200 overflow-hidden bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 shadow-xl">
          <PollutionScene
            animationTime={animationTime}
            effectivePollution={effectivePollution}
            industryCount={industryCount}
            vehicles={vehicles}
            particles={particles}
            isAnalyzing={isAnalyzing}
            pollutionData={pollutionData}
            aqiStatus={aqiStatus}
            solutions={solutions}
            setTooltip={setTooltip}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-8 max-w-6xl mx-auto">
        {/* Solutions - Colonne de gauche */}
        <div className="bg-light p-6 rounded-xl shadow-lg text-left border border-accent flex-1">
          <h3 className="font-bold text-xl mb-4 text-primary flex items-center gap-2">
            <BarChart3 size={20} /> Solutions (-{solutionImpact}%)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {solutions.map((solution) => {
              const isActive = solution.active

              return (
                <div
                  key={solution.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${isActive
                    ? 'bg-accent/20 border-primary'
                    : 'bg-light border-gray-200 hover:bg-accent/10'
                    }`}
                  onClick={() => handleSolutionToggle(solution.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-primary">{solution.icon}</span>
                    <div>
                      <h4 className="font-semibold text-dark">{solution.name}</h4>
                      <p className="text-sm text-dark/70">{solution.description}</p>
                      <p
                        className={`text-xs mt-1 ${isActive ? 'text-primary font-medium' : 'text-gray-500'
                          }`}
                      >
                        {isActive ? 'Activée' : 'Désactivée'} – Impact : -{solution.impact}%
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Effets sur la santé - Colonne de droite */}
        <HealthEffects aqiStatus={aqiStatus} />
      </div>

      {/* Tooltip */}
      <TooltipFloating tooltip={tooltip} />

    </FullscreenContainer>
  )

}