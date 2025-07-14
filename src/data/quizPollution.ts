// src/data/quizPollution.ts
import type { Question, Quiz } from "../types";
import { supabase } from "../lib/supabaseClient";

export const QUIZ_QUESTIONS_POLLUTION: Omit<Question, "id" | "quiz_id" | "created_at" | "updated_at">[] = [
  {
    question: "Quelle est la concentration normale de CO₂ dans l'atmosphère ?",
    options: ["280 ppm", "350 ppm", "420 ppm", "500 ppm"],
    reponse_correcte: "420 ppm",
    explication:
      "En 2023, la concentration de CO₂ atmosphérique dépasse 420 ppm, soit une augmentation de 50% depuis l'ère préindustrielle (280 ppm).",
  },
  {
    question: "Combien de CO₂ émet une voiture moyenne par kilomètre ?",
    options: ["50g", "120g", "200g", "300g"],
    reponse_correcte: "120g",
    explication:
      "Une voiture thermique émet en moyenne 120g de CO₂ par kilomètre parcouru, variant selon le type de carburant et l'efficacité du moteur.",
  },
  {
    question: "Que signifie PM2.5 ?",
    options: [
      "Particules de 2,5 mm",
      "Particules de 2,5 µm",
      "Pollution Majeure 2.5",
      "Pression Maximale 2.5",
    ],
    reponse_correcte: "Particules de 2,5 µm",
    explication:
      "PM2.5 désigne les particules fines d'un diamètre inférieur à 2,5 micromètres, soit 100 fois plus fines qu'un cheveu humain.",
  },
  {
    question: "À partir de quel AQI l'air est-il considéré comme dangereux ?",
    options: ["100", "150", "200", "300"],
    reponse_correcte: "300",
    explication:
      "Un AQI supérieur à 300 indique un air dangereux pour tous, nécessitant d'éviter toute activité extérieure.",
  },
  {
    question: "Quel polluant cause principalement les pluies acides ?",
    options: ["CO₂", "NOx", "PM2.5", "O₃"],
    reponse_correcte: "NOx",
    explication:
      "Les oxydes d'azote (NOx) se transforment en acide nitrique dans l'atmosphère, contribuant aux pluies acides qui endommagent les écosystèmes.",
  },
];

/// Fonction pour créer un quiz et insérer les questions prédéfinies
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
  const questionsToInsert = QUIZ_QUESTIONS_POLLUTION.map((q) => ({
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