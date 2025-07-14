// src/lib/quizService.ts
import { supabase } from "../lib/supabaseClient";
import type { LocalQuizResult, QuizQuestion, QuizResult } from "../types/simulationPhotosyntheseTypes";

// lib/quizService.ts
export function transformLocalToQuizResult(local: LocalQuizResult): QuizResult {
  return {
    score: local.score,
    totalQuestions: local.totalQuestions,
    timeSpent: local.timeSpent,
    answers: local.answers.map((ans) => ({
      questionId: ans.questionId,
      userAnswer: ans.userAnswer,
      correct: ans.correct,
      timeSpent: ans.timeSpent ?? 0,
    })),
  }
}

/**
 * Charge les questions d'un quiz depuis Supabase en fonction de l'id du quiz.
 * Retourne un tableau typé QuizQuestion[]
 * 
 * @param quizId - id du quiz dont on veut récupérer les questions
 * @returns Tableau des questions ou erreur
 */
export async function loadQuizQuestionsFromDB(
  quizId: string
): Promise<{ success: boolean; questions?: QuizQuestion[]; error?: any }> {
  // Requête pour récupérer les questions filtrées par quiz_id
  const { data, error } = await supabase
    .from("question")
    .select("*")        // Ou sélectionner seulement les champs nécessaires
    .eq("quiz_id", quizId)
    .order("id", { ascending: true }); // Optionnel : ordre des questions

  if (error) {
    console.error("Erreur lors du chargement des questions :", error);
    return { success: false, error };
  }

  // data est du type any[], on cast en QuizQuestion[]
  // Attention : assure-toi que les champs dans ta table 'question' correspondent bien au type QuizQuestion
  const questions = data as QuizQuestion[];

  return { success: true, questions };
}

export async function saveQuizResult(
  localResult: LocalQuizResult,
  quizId: string
): Promise<{ success: boolean; data?: QuizResult[] | null; error?: any }> {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    console.error("Utilisateur non connecté ou erreur:", userError);
    return { success: false, error: userError || "Utilisateur non connecté" };
  }

  // Transformer les réponses en objet avec clés string questionId
  // en supprimant timeSpent car on ne le stocke pas en base
  const answersObject = localResult.answers.reduce<Record<string, unknown>>((acc, answer) => {
    acc[answer.questionId.toString()] = {
      userAnswer: answer.userAnswer,
      correct: answer.correct,
      // tu peux stocker timeSpent ici si tu veux (ajoute-le ici si utile)
      timeSpent: answer.timeSpent ?? 0,
    };
    return acc;
  }, {});

  const transformedResult = {
    id: crypto.randomUUID(),
    users_id: userData.user.id,
    quiz_id: quizId,
    note: localResult.score,
    reponses: answersObject,
    completed_at: new Date().toISOString(),
    time_spent: localResult.timeSpent, 
  };

  const { data, error } = await supabase
    .from("quiz_result")
    .insert([transformedResult]);

  if (error) {
    console.error("Erreur insertion quiz result:", error);
    return { success: false, error };
  } else {
    console.log("Résultat quiz sauvegardé", data);
    return { success: true, data };
  }
}