//src/components/views/SimulationEnergie.tsx
import { useState, useEffect } from "react";
import { useEnergyShortcuts } from "../../hooks/useEnergyShortcuts";
import GuideOverlayEnergie from "../ui/GuideOverlayEnergie";
import { TutorialOverlayEnergie } from "../ui/TutorialOverlayEnergie";
import { ENERGIE_TUTORIAL_STEPS } from "../../data/energieTutorial";
import { QuizEnergieOverlay } from "../ui/QuizEnergieOverlay";
import { FullscreenContainer } from "../../components/ui/FullscreenContainer";
import { FullscreenButton } from "../../components/ui/FullscreenButton";
import { useFullscreen } from "../../hooks/useFullscreen";
import { GraduationCap, Brain, HelpCircle, Play, Pause, Clock, Zap, Sun, Bike, BatteryCharging, Lightbulb, Info } from "lucide-react";
import type {
  EnergyData,
  OutputDevice,
  EnergySource,
  GeneratorType,
  QuizResult,
  QuizQuestion
} from "../../types/simulationEnergieTypes";
import { DEVICES } from "../../types/simulationEnergieTypes";
import { useEnergySimulation } from "../../hooks/useEnergySimulation";
import { useEnergyHandlers } from "../../hooks/useEnergyHandlers";
import RenderEnergySource from "../energie/RenderEnergySource";
import RenderGenerator from "../energie/RenderGenerator";
import RenderOutputDevice from "../energie/RenderOutputDevice";
import RenderEnergyParticles from "../energie/RenderEnergyParticles";
import RenderEnergySymbolsLegend from "../energie/RenderEnergySymbolsLegend";
import Tooltip from "../ui/Tooltip";
import { supabase } from "../../lib/supabaseClient";
import { notifyError, notifyInfo, notifySuccess } from "../../lib/notifications";
import { useActivityLogger } from "../../hooks/useActivityLogger";

interface Classe {
  id: string;
  created_by: string;
}

interface UserClasseData {
  classe: Classe | null;
}

const SimulationEnergie = () => {
  // États principaux
  const [energyData, setEnergyData] = useState<EnergyData>({
    pedalingIntensity: 0,
    solarIntensity: 75,
    electricalPower: 0,
    outputPower: 0,
    isActive: false,
  });
  const [selectedDevice, setSelectedDevice] = useState<OutputDevice>("ampoule");
  const [energySource, setEnergySource] = useState<EnergySource>("velo");
  const [generatorType, setGeneratorType] = useState<GeneratorType>("generatrice");
  const [showEnergySymbols, setShowEnergySymbols] = useState(false);
  const { } = useFullscreen();
  const [isLoaded, setIsLoaded] = useState(false);

  // États tutoriel et quiz
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [, setTutorialCompleted] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [, setQuestionTimes] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const logActivity = useActivityLogger();

  // Fonctions du tutoriel
  const nextTutorialStep = () => {
    if (currentTutorialStep < ENERGIE_TUTORIAL_STEPS.length - 1) {
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
    localStorage.setItem("energy-tutorial-completed", "true");
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    setTutorialCompleted(true);
    localStorage.setItem("energy-tutorial-completed", "true");
    notifySuccess(
      "Tutoriel Energie terminé ! Vous êtes prêt à expérimenter !"
    );
  };

  const startTutorial = () => {
    setShowTutorial(true);
    setCurrentTutorialStep(0);
    setTutorialCompleted(false);
  };

  // Fonctions du quiz
useEffect(() => {
  const fetchQuizQuestions = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    if (userError || !user) {
      notifyError("Utilisateur non authentifié");
      return;
    }
    const userId = user.id;

    // 1. Obtenir toutes les classes de l’élève
    const { data: userClassesData, error: ucError } = await supabase
      .from("users_classe")
      .select("classe:classe_id(id, created_by)")
      .eq("users_id", userId);

    const userClasses = userClassesData as UserClasseData[] | null;

    if (ucError || !userClasses || userClasses.length === 0) {
      notifyError("Vous n'appartenez à aucune classe.");
      return;
    }

    const classIds = userClasses
      .map((uc) => uc.classe?.id)
      .filter((id): id is string => !!id);

    const profIds = userClasses
      .map((uc) => uc.classe?.created_by)
      .filter((id): id is string => !!id);

    // 2. Récupérer la simulation "energie"
    const { data: simulation, error: simError } = await supabase
      .from("simulation")
      .select("id")
      .eq("code", "energie")
      .single();

    if (simError || !simulation) {
      notifyError("Simulation introuvable.");
      return;
    }

    const simulationId = simulation.id;

    // 3. Trouver le quiz assigné à la simulation ET à une classe de l’élève
    const { data: simQuizClasseData, error: simQuizClasseError } = await supabase
      .from("simulation_quiz")
      .select("quiz_id")
      .eq("simulation_id", simulationId);

    if (simQuizClasseError || !simQuizClasseData) {
      notifyError("Aucun quiz associé à cette simulation.");
      return;
    }

    // Chercher le premier quiz qui correspond à une classe de l’élève
    let quizId: string | null = null;

    for (const simQuiz of simQuizClasseData) {
      const quizIdCandidate = simQuiz.quiz_id;

      const { data: classeQuiz, error: cqError } = await supabase
        .from("classe_quiz")
        .select("classe_id")
        .eq("quiz_id", quizIdCandidate);

      if (!cqError && classeQuiz?.some((cq) => classIds.includes(cq.classe_id))) {
        quizId = quizIdCandidate;
        break;
      }
    }

    if (!quizId) {
      notifyError("Ce quiz n’est pas assigné à votre classe.");
      return;
    }

    // 4. Vérifier que le créateur du quiz est bien un prof de la classe
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

   const completeQuiz = async (answers: number[]) => {
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
     // Récupération user connectée (nouvelle API)
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (user) {
    try {
      await logActivity(user.id, "quiz_termine", "simulation_energie");
    } catch (error) {
      console.error("Erreur lors du log d'activité:", error);
    }
  }
   }

  const restartQuiz = () => startQuiz();
  const closeQuiz = () => {
    setShowQuiz(false);
    setQuizCompleted(false);
    setQuizResult(null);
  };

  // Gestion de l'énergie
  useEffect(() => {
    const generatorEfficiency = generatorType === "panneau-solaire" ? 0.85 : 0.8;
    const deviceEfficiency = DEVICES[selectedDevice].efficiency;

    const inputIntensity = energySource === "velo" ? energyData.pedalingIntensity : energyData.solarIntensity;
    const electricalPower = (inputIntensity * generatorEfficiency) / 100;
    const outputPower = electricalPower * deviceEfficiency;

    setEnergyData(prev => ({
      ...prev,
      electricalPower: electricalPower * 100,
      outputPower: outputPower * 100,
    }));

    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, [energyData.pedalingIntensity, energyData.solarIntensity, selectedDevice, energySource, generatorType]);

  // Animation et simulation
  const { pedalRotation, fanRotation, energyParticles } = useEnergySimulation({
    energyData,
    selectedDevice,
    energySource,
    generatorType,
    showEnergySymbols,
  });

  // Gestion des interactions
  const {
    handleIntensityChange,
    toggleActivity,
    handleDeviceChange,
    handleEnergySourceChange,
    handleGeneratorTypeChange,
  } = useEnergyHandlers({
    energySource,
    setEnergyData,
    setSelectedDevice,
    setEnergySource,
    setGeneratorType,
  });

  useEnergyShortcuts({
    showTutorial,
    showGuide,
    showQuiz,
    setShowTutorial,
    setShowGuide,
    startTutorial,
    startQuiz
  });

  const currentIntensity = energySource === "velo" ? energyData.pedalingIntensity : energyData.solarIntensity;

  if (!isLoaded) {
    return (
      <section id="simulation-energie" className="py-20 px-6 bg-gray-50 max-w-7xl mx-auto text-center rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Simulation de transformation d'énergie</h2>
        <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 rounded-lg">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-700 font-medium">Chargement de la simulation...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <FullscreenContainer className="bg-gradient-to-br from-blue-50 to-green-50 py-20 px-6 text-center rounded-xl shadow-lg">
      {/* Overlays */}
      {showGuide && <GuideOverlayEnergie onClose={() => setShowGuide(false)} />}
      {showTutorial && (
        <TutorialOverlayEnergie
          currentStep={ENERGIE_TUTORIAL_STEPS[currentTutorialStep]}
          totalSteps={ENERGIE_TUTORIAL_STEPS.length}
          onNext={nextTutorialStep}
          onPrevious={previousTutorialStep}
          onSkip={skipTutorial}
          onComplete={completeTutorial}
          onClose={() => setShowTutorial(false)}
        />
      )}
      {showQuiz && (
        <QuizEnergieOverlay
          questions={quizQuestions}
          currentQuestion={currentQuizQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={answerQuestion}
          onNext={nextQuestion}
          onClose={closeQuiz}
          completed={quizCompleted}
          onRestart={restartQuiz}
          simulationCode={"energie"} // si nécessaire
        />
      )}

      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Simulation de transformation d'énergie</h2>
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

      {/* Contrôles principaux */}
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={toggleActivity}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg transform flex items-center justify-center gap-2
            ${energyData.isActive
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:scale-105"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105"
            }`}
        >
          {energyData.isActive ? <Pause size={24} /> : <Play size={24} />}
          <span>
            {energyData.isActive
              ? energySource === "velo" ? "Arrêter" : "Pause"
              : energySource === "velo" ? "Démarrer" : "Activer"}
          </span>
        </button>

        <button
          onClick={() => setShowEnergySymbols(!showEnergySymbols)}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-center
            ${showEnergySymbols
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
              : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
            }`}
        >
          <Zap className="w-5 h-5 mr-2" />
          {showEnergySymbols ? "Masquer symboles" : "Afficher symboles"}
        </button>

        <div className="px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-lg">
          <span className="font-bold text-blue-800 flex items-center gap-1">
            <Clock size={20} />
            {Math.floor(energyData.electricalPower)}W
          </span>
        </div>
      </div>

      {/* Simulation principale */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {/* Zone de simulation principale */}
        <div className="lg:col-span-3">
          <div className="relative bg-gradient-to-b from-sky-100 to-green-100 rounded-xl p-0 h-[500px] overflow-hidden border-2 border-gray-200">
            {/* Source d'énergie */}
            <RenderEnergySource
              energySource={energySource}
              pedalRotation={pedalRotation}
              energyData={energyData}
            />


            {/* Câble de transmission */}
            <div className="relative left-32 top-1/2 transform -translate-y-1/2">
              <div
                className="w-40 h-1 bg-gray-800 transition-all duration-300"
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
            <RenderGenerator generatorType={generatorType} energyData={energyData} />


            {/* Câble vers l'appareil */}
            <div className="relative left-96 top-1/2 transform -translate-y-1/2">
              <div
                className="w-60 h-1 bg-gray-800 transition-all duration-300"
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
            <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
              <div className="flex flex-col items-center">
                <RenderOutputDevice
                  selectedDevice={selectedDevice}
                  energyData={energyData}
                  fanRotation={fanRotation}
                />
                <div className="mt-6 text-sm font-medium text-gray-700 text-center relative top-[25px]">
                  {/* Ligne avec icône + nom alignés */}
                  <div className="flex items-center justify-center gap-2">
                    <Lightbulb className="w-6 h-6 text-purple-600" />
                    <span>{DEVICES[selectedDevice].name}</span>
                  </div>
                  {/* Ligne en dessous avec le pourcentage */}
                  <div className="text-purple-600 mt-1 relative top-[10px]">
                    {energyData.outputPower.toFixed(1)}% d'énergie
                  </div>
                </div>
              </div>
            </div>

            {/* Particules d'énergie symboliques */}
            <RenderEnergyParticles
              showEnergySymbols={showEnergySymbols}
              energyParticles={energyParticles}
              selectedDevice={selectedDevice}
            />
            {/* Légende des symboles d'énergie */}
            <RenderEnergySymbolsLegend
              showEnergySymbols={showEnergySymbols}
              energySource={energySource}
              selectedDevice={selectedDevice}
              DEVICES={DEVICES}
            />
          </div>

          {/* Contrôles */}
          <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
            <div className="space-y-4">
              {/* Sélecteurs de source et générateur */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex justify-center gap-1">
                    <BatteryCharging className="w-4 h-4 text-blue-500" />
                    Source d'énergie
                  </label>

                  <select
                    value={energySource}
                    onChange={handleEnergySourceChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="velo">
                      Vélo
                    </option>
                    <option value="soleil">
                      Soleil
                    </option>
                  </select>
                </div>

                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex justify-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Générateur
                  </label>

                  <select
                    value={generatorType}
                    onChange={handleGeneratorTypeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="generateur">Génératrice</option>
                    <option value="panneau-solaire">Panneau Solaire</option>
                  </select>
                </div>

                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex justify-center gap-1">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    Appareil
                  </label>
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
                  {energySource === "velo" ? "Intensité de pédalage" : "Intensité solaire"}: {currentIntensity}%
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
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${energyData.isActive
                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    }`}
                >
                  {energyData.isActive ? (
                    <>
                      <Pause className="w-5 h-5" />
                      {energySource === "velo" ? "Arrêter le pédalage" : "Masquer le soleil"}
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      {energySource === "velo" ? "Commencer à pédaler" : "Faire briller le soleil"}
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowEnergySymbols(!showEnergySymbols)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${showEnergySymbols
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                    : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
                    }`}
                >
                  <Zap className="w-5 h-5" />
                  {showEnergySymbols ? "Masquer les symboles E" : "Afficher les symboles E"}
                </button>
              </div>

              {/* Indicateurs de puissance */}
              <div className="grid grid-cols-3 gap-4 text-center">

                {/* Énergie mécanique ou solaire */}
                <div
                  className={`p-3 rounded-lg border ${energySource === "velo" ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200"}`}
                >
                  <div className={`flex items-center justify-center gap-1 text-2xl font-bold ${energySource === "velo" ? "text-blue-600" : "text-yellow-600"}`}>
                    {currentIntensity}%
                    <Tooltip content={
                      energySource === "velo"
                        ? "Pourcentage d’énergie mécanique disponible issue du pédalage (force exercée)."
                        : "Pourcentage d’énergie lumineuse captée par le panneau solaire."
                    }>
                      <Info className="w-4 h-4 cursor-pointer text-bleu-400 hover:text-gray-600" />
                    </Tooltip>
                  </div>
                  <div className={`text-xs ${energySource === "velo" ? "text-blue-700" : "text-yellow-700"}`}>
                    {energySource === "velo" ? "Énergie Mécanique" : "Énergie Solaire"}
                  </div>
                </div>

                {/* Énergie électrique */}
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
                    {energyData.electricalPower.toFixed(1)}%
                    <Tooltip content="Pourcentage d’énergie électrique produite après conversion de l’énergie mécanique ou lumineuse, tenant compte des pertes (rendement du générateur).">
                      <Info className="w-4 h-4 cursor-pointer text-green-400 hover:text-gray-600" />
                    </Tooltip>
                  </div>
                  <div className="text-xs text-green-700">Énergie Électrique</div>
                </div>

                {/* Énergie utile en sortie */}
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-purple-600">
                    {energyData.outputPower.toFixed(1)}%
                    <Tooltip content={`Énergie réellement utilisée par l'appareil (${DEVICES[selectedDevice].energyType}), après pertes liées au stockage, transport ou conversion finale.`}>
                      <Info className="w-4 h-4 cursor-pointer text-purple-400 hover:text-gray-600" />
                    </Tooltip>
                  </div>
                  <div className="text-xs text-purple-700">Énergie {DEVICES[selectedDevice].energyType}</div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Panneau d'information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full">
            <div className="p-2 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Transformations d'Énergie
              </h3>
            </div>
            <div className="p-1 space-y-8">
              {/* Étapes de transformation */}
              {[
                {
                  step: 1,
                  icon: energySource === "velo" ? <Bike className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-yellow-500" />,
                  title: energySource === "velo" ? "Énergie Mécanique" : "Énergie Solaire",
                  description: energySource === "velo"
                    ? "Le cycliste convertit l'énergie chimique provenant du métabolisme musculaire en énergie mécanique, entraînant le mouvement de rotation des pédales."
                    : "Le Soleil produit de la lumière en envoyant des petites particules d'énergie appelées photons.",
                  color: energySource === "velo" ? "blue" : "yellow"
                },
                {
                  step: 2,
                  icon: <Zap className="w-5 h-5 text-green-500" />,
                  title: "Énergie Électrique",
                  description: generatorType === "panneau-solaire"
                    ? "Le panneau solaire transforme la lumière du Soleil en électricité avec une efficacité d’environ 85%."
                    : "Le générateur transforme le mouvement en électricité avec une efficacité d’environ 80%.",
                  color: "green"
                },
                {
                  step: 3,
                  icon: <Sun className="w-5 h-5 text-purple-500" />,
                  title: `Énergie ${DEVICES[selectedDevice].energyType}`,
                  description: DEVICES[selectedDevice].description,
                  color: "purple"
                }
              ].map((step, index) => (
                <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border bg-${step.color}-50 border-${step.color}-200`}>
                  <div className={`w-8 h-8 bg-${step.color}-500 text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                    {step.step}
                  </div>
                  <div>
                    <h4 className={`font-semibold text-${step.color}-800 flex items-center gap-1`}>
                      {step.icon}
                      {step.title}
                    </h4>
                    <p className={`text-sm mt-1 text-${step.color}-700`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}

              {/* Efficacité */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Efficacités
                </h4>
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
                        (generatorType === "panneau-solaire" ? 0.85 : 0.8) *
                        DEVICES[selectedDevice].efficiency * 100
                      )}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FullscreenContainer>
  );
};

export default SimulationEnergie;