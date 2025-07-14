// src/data/quizEnergie.ts
import type { Question, Quiz } from "../types";
import { supabase } from "../lib/supabaseClient";

export const QUIZ_QUESTIONS_ENERGIE: Omit<Question, "id" | "quiz_id" | "created_at" | "updated_at">[] = [
  {
    question: "Quelle est l'efficacité d'un panneau solaire dans cette simulation ?",
    options: ["75%", "80%", "85%", "90%"],
    reponse_correcte: "85%",
    explication:
      "Le panneau solaire a une efficacité de 85%, ce qui est supérieur à la génératrice classique (80%).",
  },
  {
    question: "Que se passe-t-il lors de la transformation d'énergie mécanique en électricité ?",
    options: ["Aucune perte", "Perte de 20%", "Perte de 15%", "Gain d'énergie"],
    reponse_correcte: "Perte de 20%",
    explication:
      "La génératrice a une efficacité de 80%, ce qui signifie une perte de 20% lors de la conversion.",
  },
  {
    question: "Quel appareil a la meilleure efficacité énergétique ?",
    options: ["Ampoule LED (90%)", "Ventilateur (85%)", "Chauffe-eau (95%)", "Tous égaux"],
    reponse_correcte: "Chauffe-eau (95%)",
    explication:
      "Le chauffe-eau a la meilleure efficacité avec 95%, car la conversion électricité-chaleur est très efficace.",
  },
  {
    question: "Pourquoi y a-t-il des pertes d'énergie dans les transformations ?",
    options: ["Erreur de calcul", "Lois de la physique", "Mauvais équipement", "Hasard"],
    reponse_correcte: "Lois de la physique",
    explication:
      "Les pertes d'énergie sont dues aux lois de la thermodynamique : toute transformation implique des pertes sous forme de chaleur.",
  },
  {
    question: "Quelle source d'énergie est renouvelable dans cette simulation ?",
    options: ["Le vélo seulement", "Le soleil seulement", "Les deux", "Aucune"],
    reponse_correcte: "Les deux",
    explication:
      "Les deux sources sont renouvelables : l'énergie humaine (vélo) et l'énergie solaire se régénèrent naturellement.",
  },
];

// Fonction pour créer un quiz et insérer les questions prédéfinies
export async function insertQuizWithQuestions(
  quizData: Omit<Quiz, "id" | "created_at" | "updated_at" | "titre"> & { titre: string }
): Promise<{ success: boolean; quizId?: string; error?: any }> {
  // 1. Créer le quiz
  const { data: quizCreated, error: quizError } = await supabase
    .from("quiz")
    .insert({
      titre: quizData.titre,
      description: quizData.description ?? null,
      duree: quizData.duree,
      image: quizData.image ?? null,
      created_by: quizData.created_by ?? null,
    })
    .select()
    .single();

  if (quizError || !quizCreated) {
    console.error("Erreur création quiz :", quizError);
    return { success: false, error: quizError };
  }

  // 2. Préparer les questions avec le quiz_id du quiz créé
  const questionsToInsert = QUIZ_QUESTIONS_ENERGIE.map((q) => ({
    ...q,
    quiz_id: quizCreated.id,
  }));

  // 3. Insérer les questions
  const { error: questionsError } = await supabase.from("question").insert(questionsToInsert);

  if (questionsError) {
    console.error("Erreur insertion questions :", questionsError);
    return { success: false, error: questionsError };
  }

  return { success: true, quizId: quizCreated.id };
}