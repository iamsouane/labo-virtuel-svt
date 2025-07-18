// src/lib/quizService.ts
import { supabase } from "../lib/supabaseClient";
import type { LocalQuizResult, QuizQuestion, QuizResult } from "../types/simulationPhotosyntheseTypes";

// Ajout de la fonction de log d'activité ici
async function logActivity(userId: string, action: string, targetType: string) {
  const { error } = await supabase.rpc("log_activity", {
    p_user_id: userId,
    p_action: action,
    p_target_type: targetType,
  });
  if (error) {
    console.error("Erreur lors du log d'activité :", error);
  }
}

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
  };
}

export async function loadQuizQuestionsFromDB(
  quizId: string
): Promise<{ success: boolean; questions?: QuizQuestion[]; error?: any }> {
  const { data, error } = await supabase
    .from("question")
    .select("*")
    .eq("quiz_id", quizId)
    .order("id", { ascending: true });

  if (error) {
    console.error("Erreur lors du chargement des questions :", error);
    return { success: false, error };
  }

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

  const answersObject = localResult.answers.reduce<Record<string, unknown>>((acc, answer) => {
    acc[answer.questionId.toString()] = {
      userAnswer: answer.userAnswer,
      correct: answer.correct,
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
  }

  // ✅ Log de l'activité : "Terminer un quiz"
  await logActivity(userData.user.id, "Terminer un quiz", "quiz_result");

  console.log("Résultat quiz sauvegardé", data);
  return { success: true, data };
}