// src/data/quizSelection.ts
import type { Question, Quiz } from "../types"
import { supabase } from "../lib/supabaseClient"

// Questions de sélection naturelle (sans ID ni quiz_id pour insertion)
export const QUIZ_QUESTIONS_SELECTION: Omit<Question, "id" | "quiz_id" | "created_at" | "updated_at">[] = [
  {
    question: "Quel trait est considéré comme dominant chez les lapins ?",
    options: ["Fourrure blanche", "Fourrure brune", "Oreilles courtes", "Oreilles tombantes"],
    reponse_correcte: "Fourrure brune",
    explication: "Le gène pour la fourrure brune (B) est dominant sur le gène pour la fourrure blanche (b) selon les lois de Mendel.",
  },
  {
    question: "Quel facteur environnemental favorise le développement de dents plus longues chez les lapins ?",
    options: ["Présence de prédateurs", "Abondance de nourriture molle", "Prédominance de végétaux durs", "Climat très humide"],
    reponse_correcte: "Prédominance de végétaux durs",
    explication: "Les végétaux durs nécessitent des dents plus longues et résistantes pour être mastiqués efficacement, ce qui confère un avantage sélectif.",
  },
  {
    question: "Quelle est la conséquence principale de la sélection naturelle sur une population ?",
    options: ["Augmentation de la diversité génétique", "Adaptation progressive aux conditions environnementales", "Apparition soudaine de nouveaux traits", "Uniformisation de toutes les caractéristiques"],
    reponse_correcte: "Adaptation progressive aux conditions environnementales",
    explication: "La sélection naturelle favorise les traits avantageux dans un environnement donné, conduisant à une adaptation progressive de la population.",
  },
  {
    question: "Quel mécanisme introduit de nouvelles variations génétiques dans une population ?",
    options: ["La sélection naturelle", "Les mutations aléatoires", "L'adaptation physiologique", "La reproduction asexuée"],
    reponse_correcte: "Les mutations aléatoires",
    explication: "Les mutations aléatoires dans l'ADN sont la source première de nouvelles variations génétiques sur laquelle agit la sélection naturelle.",
  },
  {
    question: "Dans un environnement froid, quel trait serait avantageux pour les lapins ?",
    options: ["Fourrure plus épaisse", "Oreilles plus longues", "Taille plus petite", "Couleur plus vive"],
    reponse_correcte: "Fourrure plus épaisse",
    explication: "Une fourrure plus épaisse offre une meilleure isolation thermique dans les climats froids, ce qui améliore les chances de survie.",
  },
  {
    question: "Combien de générations faut-il généralement pour observer un changement évolutif significatif ?",
    options: ["1-2 générations", "5-10 générations", "Des dizaines à centaines de générations", "Le changement est immédiat"],
    reponse_correcte: "Des dizaines à centaines de générations",
    explication: "L'évolution opère sur des échelles de temps longues, nécessitant généralement de nombreuses générations pour des changements visibles.",
  },
  {
    question: "Qu'est-ce que le 'fitness' en biologie évolutive ?",
    options: ["La capacité physique d'un organisme", "Le succès reproductif relatif d'un individu", "La longévité d'un organisme", "La résistance aux maladies"],
    reponse_correcte: "Le succès reproductif relatif d'un individu",
    explication: "Le fitness mesure la contribution relative d'un individu au pool génétique des générations suivantes.",
  },
  {
    question: "Quelle situation illustre le mieux la sélection naturelle ?",
    options: ["Des lapins apprennent à mieux se cacher", "Les lapins à meilleur camouflage survivent et se reproduisent davantage", "Tous les lapins développent progressivement un meilleur camouflage", "Des lapins mutent intentionnellement pour mieux se camoufler"],
    reponse_correcte: "Les lapins à meilleur camouflage survivent et se reproduisent davantage",
    explication: "La sélection naturelle agit sur les variations existantes - les individus avec des traits avantageux (comme un bon camouflage) ont plus de descendants.",
  },
  {
    question: "Quelle est l'importance de la diversité génétique dans l'évolution ?",
    options: ["Elle est inutile car la sélection élimine les variations", "Elle permet à la population de s'adapter à des changements environnementaux", "Elle garantit que tous les individus soient identiques", "Elle accélère artificiellement l'évolution"],
    reponse_correcte: "Elle permet à la population de s'adapter à des changements environnementaux",
    explication: "Une diversité génétique importante offre plus de possibilités d'adaptation face à des conditions changeantes.",
  },
  {
    question: "Quel phénomène peut contrebalancer la sélection naturelle ?",
    options: ["La dérive génétique", "Les flux génétiques", "Les mutations neutres", "Toutes ces réponses"],
    reponse_correcte: "Toutes ces réponses",
    explication: "D'autres mécanismes évolutifs comme la dérive génétique (aléatoire), les migrations (flux génétique) et les mutations neutres peuvent influencer l'évolution indépendamment de la sélection naturelle.",
  },
]

// Fonction pour insérer le quiz + ses questions
export async function insertQuizSelectionNaturelle(
  quizData: Omit<Quiz, "id" | "created_at" | "updated_at" | "titre"> & { titre: string }
): Promise<{ success: boolean; quizId?: string; error?: any }> {
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

  const questionsToInsert = QUIZ_QUESTIONS_SELECTION.map((q) => ({
    ...q,
    quiz_id: quizCreated.id,
  }));

  const { error: questionsError } = await supabase.from("question").insert(questionsToInsert);

  if (questionsError) {
    console.error("Erreur insertion questions :", questionsError);
    return { success: false, error: questionsError };
  }

  return { success: true, quizId: quizCreated.id };
}

// Fonction pour récupérer dynamiquement les questions d’un quiz
export async function fetchQuestionsForQuiz(quizId: string): Promise<Question[]> {
  const { data, error } = await supabase
    .from("question")
    .select("*")
    .eq("quiz_id", quizId);

  if (error) {
    console.error("Erreur récupération questions :", error);
    return [];
  }

  return data as Question[];
}