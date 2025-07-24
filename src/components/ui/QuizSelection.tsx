// src/components/ui/QuizSelection.tsx
import { useEffect, useState } from "react"
import QuizSelectionOverlay from "./QuizSelectionOverlay"
import { supabase } from "../../lib/supabaseClient"
import type { QuizQuestion, QuizAnswer, QuizResult } from "../../types/simulationPhotosyntheseTypes"

export default function QuizzSelection({
  simulationCode,
  onClose,
}: {
  simulationCode: string
  onClose: () => void
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [completed, setCompleted] = useState(false)
  const [, setResult] = useState<QuizResult | null>(null)
  const [startTime, setStartTime] = useState(Date.now())
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [accessDenied, setAccessDenied] = useState(false)

 useEffect(() => {
  const fetchQuizQuestions = async () => {
    try {
      // 1. Récupérer la simulation correspondant au code passé en prop
      const { data: simulation, error: simError } = await supabase
        .from("simulation")
        .select("id, quiz_id")
        .eq("code", simulationCode)
        .single();

      if (simError || !simulation?.quiz_id) {
        console.error("Erreur récupération quiz_id :", simError);
        setAccessDenied(true);
        return;
      }

      // 2. Récupérer l'utilisateur connecté
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;

      if (userError || !user) {
        console.error("Utilisateur non connecté");
        setAccessDenied(true);
        return;
      }

      const eleveId = user.id;

      // 3. Récupérer les classes auxquelles appartient l'élève
      const { data: classesEleve, error: errClasse } = await supabase
        .from("users_classe")
        .select("classe_id")
        .eq("users_id", eleveId);

      if (errClasse) {
        console.error("Erreur chargement des classes :", errClasse);
        setAccessDenied(true);
        return;
      }

      const classeIds = classesEleve?.map(c => c.classe_id) || [];

      if (classeIds.length === 0) {
        console.error("L'élève n'appartient à aucune classe.");
        setAccessDenied(true);
        return;
      }

      // 4. Vérifier que le quiz lié à la simulation est assigné à une des classes de l'élève
      const { data: quizAssocies, error: errQuiz } = await supabase
        .from("classe_quiz")
        .select("quiz_id")
        .in("classe_id", classeIds);

      if (errQuiz) {
        console.error("Erreur récupération des quiz assignés aux classes :", errQuiz);
        setAccessDenied(true);
        return;
      }

      const quizIds = quizAssocies?.map(q => q.quiz_id) || [];

      if (!quizIds.includes(simulation.quiz_id)) {
        setAccessDenied(true);
        return;
      }

      // 5. Charger les questions du quiz
      const { data: questionData, error: questionError } = await supabase
        .from("question")
        .select("*")
        .eq("quiz_id", simulation.quiz_id);

      if (questionError) {
        console.error("Erreur récupération questions :", questionError);
      } else if (questionData) {
        setQuestions(questionData);
        setStartTime(Date.now());
        setQuestionStartTime(Date.now());
      }
    } catch (err) {
      console.error("Erreur inattendue :", err);
      setAccessDenied(true);
    }
  };

  fetchQuizQuestions();
}, [simulationCode]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleNext = () => {
    if (selectedAnswer === null || questions.length === 0) return

    const question = questions[currentQuestion]
    const now = Date.now()
    const isCorrect = question.options[selectedAnswer] === question.reponse_correcte

    const newAnswer: QuizAnswer = {
      questionId: question.id,
      userAnswer: selectedAnswer,
      correct: isCorrect,
      timeSpent: Math.floor((now - questionStartTime) / 1000),
    }

    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)
    setSelectedAnswer(null)

    if (currentQuestion === questions.length - 1) {
      completeQuiz(updatedAnswers)
    } else {
      setCurrentQuestion((prev) => prev + 1)
      setQuestionStartTime(now)
    }
  }

  const completeQuiz = (userAnswers: QuizAnswer[]) => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000)
    const score = userAnswers.filter((a) => a.correct).length

    setResult({
      score,
      totalQuestions: questions.length,
      timeSpent: totalTime,
      answers: userAnswers,
    })
    setCompleted(true)
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers([])
    setCompleted(false)
    setResult(null)
    setStartTime(Date.now())
    setQuestionStartTime(Date.now())
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
    <QuizSelectionOverlay
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