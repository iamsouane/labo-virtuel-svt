// src/hooks/useSimulationPhotosyntheseEffects.ts
import { useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import type { QuizQuestion, DataPoint, LabEnvironment } from "../types/simulationPhotosyntheseTypes"

type UseSimulationPhotosyntheseEffectsParams = {
  simulationCode: string
  isRunning: boolean
  environment: LabEnvironment
  setIsLoaded: (loaded: boolean) => void
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>
  setDataHistory: React.Dispatch<React.SetStateAction<DataPoint[]>>
  setQuizQuestions: React.Dispatch<React.SetStateAction<QuizQuestion[]>>
  getEnvironmentStatus: () => { status: string }
}

export function useSimulationPhotosyntheseEffects({
  simulationCode,
  isRunning,
  environment,
  setIsLoaded,
  setTimeElapsed,
  setDataHistory,
  setQuizQuestions,
  getEnvironmentStatus,
}: UseSimulationPhotosyntheseEffectsParams) {

  // Chargement initial (timer 1s)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [setIsLoaded])

  // Intervalle mise à jour temps et données
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => {
          const newTime = prevTime + 1

          if (newTime % 5 === 0) {
            const { status } = getEnvironmentStatus()

            let photosynthesisRate = 0.4
            if (status === "Excellent") photosynthesisRate = 1.0
            else if (status === "Bon") photosynthesisRate = 0.6
            else if (status === "Difficile") photosynthesisRate = 0.2

            const avgHealth = Math.min(1, Math.max(0, 0.4 + (photosynthesisRate - 0.4)))
            const avgOxygen = parseFloat((photosynthesisRate * avgHealth).toFixed(2))
            const avgGlucose = parseFloat((photosynthesisRate * avgHealth * 0.7).toFixed(2))

            setDataHistory((prev) => [
              ...prev.slice(-19),
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
  }, [isRunning, environment, getEnvironmentStatus, setTimeElapsed, setDataHistory])

  // Chargement dynamique des questions du quiz (vérification accès identique à SelectionNaturelle)
  useEffect(() => {
    const fetchAuthorizedQuizQuestions = async () => {
      try {
        // 1. Récupérer l'utilisateur courant
        const { data: userData, error: userError } = await supabase.auth.getUser();
        const user = userData?.user;
        if (userError || !user) {
          console.error("Utilisateur non authentifié :", userError);
          return;
        }
        const userId = user.id;

        // 2. Récupérer les classes de l'utilisateur avec créateurs
        const { data: userClassesData, error: ucError } = await supabase
          .from("users_classe")
          .select("classe:classe_id(id, created_by)")
          .eq("users_id", userId);

        const userClasses = userClassesData as { classe: { id: string; created_by: string } | null }[] | null;

        if (ucError || !userClasses || userClasses.length === 0) {
          console.warn("Aucune classe associée à cet utilisateur.");
          return;
        }

        const classIds = userClasses.map((uc) => uc.classe?.id).filter((id): id is string => !!id);
        const profIds = userClasses.map((uc) => uc.classe?.created_by).filter((id): id is string => !!id);

        // 3. Récupérer la simulation par code et son id
        const { data: simulation, error: simError } = await supabase
          .from("simulation")
          .select("id")
          .eq("code", simulationCode)
          .single();

        if (simError || !simulation) {
          console.warn("Simulation introuvable.");
          return;
        }

        const simulationId = simulation.id;

        // 4. Récupérer les quizzes liés à la simulation via simulation_quiz
        const { data: simQuizData, error: simQuizError } = await supabase
          .from("simulation_quiz")
          .select("quiz_id")
          .eq("simulation_id", simulationId);

        if (simQuizError || !simQuizData || simQuizData.length === 0) {
          console.warn("Aucun quiz associé à cette simulation.");
          return;
        }

        // 5. Trouver un quiz assigné à une classe de l'élève
        let authorizedQuizId: string | null = null;

        for (const simQuiz of simQuizData) {
          const quizIdCandidate = simQuiz.quiz_id;

          const { data: classeQuiz, error: cqError } = await supabase
            .from("classe_quiz")
            .select("classe_id")
            .eq("quiz_id", quizIdCandidate);

          if (!cqError && classeQuiz?.some((cq) => classIds.includes(cq.classe_id))) {
            authorizedQuizId = quizIdCandidate;
            break;
          }
        }

        if (!authorizedQuizId) {
          console.warn("Aucun quiz assigné à votre classe.");
          return;
        }

        // 6. Vérifier que le quiz a été créé par le professeur d'une des classes de l'élève
        const { data: quiz, error: quizError } = await supabase
          .from("quiz")
          .select("id, created_by")
          .eq("id", authorizedQuizId)
          .single();

        if (quizError || !quiz) {
          console.warn("Quiz introuvable.");
          return;
        }

        if (!profIds.includes(quiz.created_by)) {
          console.warn("Ce quiz n’a pas été créé par un de vos professeurs.");
          return;
        }

        // 7. Charger les questions du quiz
        const { data: questions, error: questionsError } = await supabase
          .from("question")
          .select("*")
          .eq("quiz_id", authorizedQuizId)
          .order("created_at", { ascending: true });

        if (questionsError || !questions) {
          console.error("Erreur lors du chargement des questions :", questionsError);
          return;
        }

        setQuizQuestions(questions as QuizQuestion[]);
      } catch (error) {
        console.error("Erreur dans useSimulationPhotosyntheseEffects :", error);
      }
    };

    fetchAuthorizedQuizQuestions();
  }, [simulationCode, setQuizQuestions]);
}