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

/**
 * Hook personnalisé pour gérer les effets liés à la simulation Photosynthèse.
 */
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

  // Intervalle pour mise à jour du temps et des données
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

  // Chargement dynamique des questions du quiz
  useEffect(() => {
    const fetchLatestQuizQuestions = async () => {
      try {
        const { data: simulation, error: simError } = await supabase
          .from("simulation")
          .select("id")
          .eq("code", simulationCode)
          .single()

        if (simError || !simulation) {
          console.error("Erreur récupération simulation :", simError)
          return
        }

        const simulationId = simulation.id

        const { data: latestQuiz, error: quizError } = await supabase
          .rpc("get_latest_quiz_for_simulation", { simulation_uuid: simulationId })

        if (quizError || !latestQuiz || latestQuiz.length === 0) {
          console.warn("Aucun quiz trouvé pour cette simulation.", quizError)
          return
        }

        const quiz = latestQuiz[0]

        const { data: questions, error: questionsError } = await supabase
          .from("question")
          .select("*")
          .eq("quiz_id", quiz.quiz_id)

        if (questionsError) {
          console.error("Erreur récupération questions :", questionsError)
          return
        }

        if (questions) {
          setQuizQuestions(questions as QuizQuestion[])
        }
      } catch (error) {
        console.error("Erreur globale lors du chargement du quiz :", error)
      }
    }

    fetchLatestQuizQuestions()
  }, [simulationCode, setQuizQuestions])
}
