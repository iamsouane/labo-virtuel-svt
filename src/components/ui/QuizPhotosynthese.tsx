// src/components/ui/QuizPhotosynthese.tsx
import { useEffect, useState } from "react"
import QuizOverlay from "./QuizPhotosyntheseOverlay"
import { supabase } from "../../lib/supabaseClient"
import type { QuizQuestion } from "../../types/simulationPhotosyntheseTypes"

interface Classe {
  id: string
  created_by: string
}

interface UserClasseData {
  classe: Classe | null
}

export default function QuizPhotosynthese({
  simulationCode,
  onClose,
}: {
  simulationCode: string
  onClose: () => void
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    const fetchQuizFromSimulation = async () => {
      try {
        // 1. Récupérer la simulation et le quiz_id
        const { data: simulation, error: simError } = await supabase
          .from("simulation")
          .select("id, quiz_id")
          .eq("code", simulationCode)
          .single()

        if (simError || !simulation?.quiz_id) {
          console.error("Quiz non trouvé pour la simulation :", simError)
          setAccessDenied(true)
          return
        }

        // 2. Récupérer l'utilisateur connecté
        const { data: userData, error: userError } = await supabase.auth.getUser()
        const user = userData?.user

        if (userError || !user) {
          console.error("Utilisateur non connecté")
          setAccessDenied(true)
          return
        }

        const eleveId = user.id

        // 3. Récupérer les classes de l'élève avec infos sur le professeur
        const { data: userClassesData, error: errClasse } = await supabase
          .from("users_classe")
          .select("classe:classe_id(id, created_by)")
          .eq("users_id", eleveId)

        const userClasses = userClassesData as UserClasseData[] | null

        if (errClasse || !userClasses || userClasses.length === 0) {
          console.error("Erreur chargement classes :", errClasse)
          setAccessDenied(true)
          return
        }

        const classeIds = userClasses
          .map((uc) => uc.classe?.id)
          .filter((id): id is string => !!id)

        const profIds = userClasses
          .map((uc) => uc.classe?.created_by)
          .filter((id): id is string => !!id)

        // 4. Vérifier si ce quiz est assigné à l’une des classes
        const { data: quizAssocies, error: errQuiz } = await supabase
          .from("classe_quiz")
          .select("quiz_id")
          .in("classe_id", classeIds)

        if (errQuiz) {
          console.error("Erreur récupération des quiz assignés :", errQuiz)
          setAccessDenied(true)
          return
        }

        const quizIds = quizAssocies?.map(q => q.quiz_id) || []

        if (!quizIds.includes(simulation.quiz_id)) {
          setAccessDenied(true)
          return
        }

        // 5. Vérifier que le professeur qui a créé le quiz est bien celui de la classe
        const { data: quizData, error: errQuizInfo } = await supabase
          .from("quiz")
          .select("id, created_by")
          .eq("id", simulation.quiz_id)
          .single()

        if (errQuizInfo || !quizData) {
          console.error("Erreur récupération quiz :", errQuizInfo)
          setAccessDenied(true)
          return
        }

        if (!profIds.includes(quizData.created_by)) {
          console.warn("Le professeur ayant créé ce quiz ne correspond pas à votre classe.")
          setAccessDenied(true)
          return
        }

        // 6. Récupérer les questions du quiz
        const { data: questionData, error: questionError } = await supabase
          .from("question")
          .select("*")
          .eq("quiz_id", simulation.quiz_id)

        if (questionError || !questionData || questionData.length === 0) {
          console.error("Erreur récupération questions :", questionError)
          setAccessDenied(true)
          return
        }

        setQuestions(questionData as QuizQuestion[])
      } catch (error) {
        console.error("Erreur inattendue :", error)
        setAccessDenied(true)
      }
    }

    fetchQuizFromSimulation()
  }, [simulationCode])

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setCompleted(false)
  }

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setCurrentQuestion((prev) => prev + 1)
  }

  if (accessDenied) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold bg-white shadow rounded-md border border-red-300 max-w-xl mx-auto mt-10">
        Ce quiz n’est pas disponible pour votre classe.
      </div>
    )
  }

  if (questions.length === 0) {
    return <div className="p-4 text-center">Chargement du quiz...</div>
  }

  return (
    <QuizOverlay
      questions={questions}
      currentQuestion={currentQuestion}
      selectedAnswer={selectedAnswer}
      onClose={onClose}
      onRestart={handleRestart}
      onAnswerSelect={handleAnswerSelect}
      onNext={handleNext}
      completed={completed}
      simulationCode={simulationCode}
    />
  )
}