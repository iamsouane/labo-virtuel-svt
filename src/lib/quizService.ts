// src/lib/quizService.ts
import { supabase } from "../lib/supabaseClient";
import type { LocalQuizResult, QuizResult } from "../types/simulationPhotosyntheseTypes";

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