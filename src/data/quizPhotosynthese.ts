// src/data/quizPhotosynthese.ts
import type { Question, Quiz } from "../types";
import { supabase } from "../lib/supabaseClient";

export const QUIZ_QUESTIONS_PHOTOSYNTHESE: Omit<Question, "id" | "quiz_id" | "created_at" | "updated_at">[] = [
  {
    question: "Quelle est l'équation chimique correcte de la photosynthèse ?",
    options: [
      "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
      "6CO₂ + 6H₂O + lumière → C₆H₁₂O₆ + 6O₂",
      "CO₂ + H₂O + lumière → glucose + O₂",
      "6CO₂ + 12H₂O + lumière → C₆H₁₂O₆ + 6O₂ + 6H₂O",
    ],
    reponse_correcte: "6CO₂ + 12H₂O + lumière → C₆H₁₂O₆ + 6O₂ + 6H₂O",
    explication: "L'équation complète inclut 12 molécules d'eau en entrée et 6 en sortie, car l'eau participe à deux réactions distinctes.",
  },
  {
    question: "Quel est le facteur limitant principal de la photosynthèse en faible luminosité ?",
    options: ["La température", "Le CO₂", "La lumière", "L'humidité"],
    reponse_correcte: "La lumière",
    explication: "En conditions de faible luminosité, c'est la lumière qui devient le facteur limitant car elle fournit l'énergie nécessaire aux réactions.",
  },
  {
    question: "À quelle température la photosynthèse est-elle généralement optimale ?",
    options: ["15-20°C", "20-30°C", "30-40°C", "40-50°C"],
    reponse_correcte: "20-30°C",
    explication: "La plupart des plantes ont une photosynthèse optimale entre 20-30°C, température à laquelle les enzymes fonctionnent le mieux.",
  },
  {
    question: "Que produit principalement la photosynthèse pour la plante ?",
    options: ["De l'oxygène uniquement", "Du glucose uniquement", "Du glucose et de l'oxygène", "De l'eau et du CO₂"],
    reponse_correcte: "Du glucose et de l'oxygène",
    explication: "La photosynthèse produit du glucose (source d'énergie pour la plante) et de l'oxygène (rejeté dans l'atmosphère).",
  },
  {
    question: "Pourquoi les plantes ont-elles besoin de CO₂ pour la photosynthèse ?",
    options: [
      "Pour respirer",
      "Comme source de carbone pour le glucose",
      "Pour produire de l'oxygène",
      "Pour réguler la température",
    ],
    reponse_correcte: "Comme source de carbone pour le glucose",
    explication: "Le CO₂ fournit le carbone nécessaire à la synthèse du glucose (C₆H₁₂O₆). C'est la matière première carbonée.",
  },
  {
    question: "Dans quelles conditions une plante produit-elle le plus d'oxygène ?",
    options: [
      "Faible lumière, peu de CO₂",
      "Forte lumière, beaucoup de CO₂, température optimale",
      "Température élevée uniquement",
      "Humidité élevée uniquement",
    ],
    reponse_correcte: "Forte lumière, beaucoup de CO₂, température optimale",
    explication: "La production d'oxygène est maximale quand tous les facteurs sont optimaux : lumière intense, CO₂ suffisant et température idéale.",
  },
  {
    question: "Que se passe-t-il si on augmente seulement la lumière sans CO₂ ?",
    options: [
      "La photosynthèse augmente proportionnellement",
      "Rien ne change car le CO₂ devient limitant",
      "La plante meurt",
      "Seule la température augmente",
    ],
    reponse_correcte: "Rien ne change car le CO₂ devient limitant",
    explication: "C'est le principe du facteur limitant : si le CO₂ manque, augmenter la lumière ne sert à rien car le CO₂ limite la réaction.",
  },
  {
    question: "Quelle est l'importance écologique de la photosynthèse ?",
    options: [
      "Elle produit de la nourriture pour les plantes",
      "Elle produit l'oxygène que nous respirons",
      "Elle absorbe le CO₂ de l'atmosphère",
      "Toutes les réponses ci-dessus",
    ],
    reponse_correcte: "Toutes les réponses ci-dessus",
    explication: "La photosynthèse est cruciale : elle nourrit les plantes, produit notre oxygène et absorbe le CO₂, régulant le climat.",
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
  const questionsToInsert = QUIZ_QUESTIONS_PHOTOSYNTHESE.map((q) => ({
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