// src/data/quizEnergie.ts
import type { QuizQuestionEnergie } from "../types/simulationEnergieTypes"

export const QUIZ_QUESTIONS_ENERGIE: QuizQuestionEnergie[] = [
  {
    id: 1,
    question: "Quelle est l'efficacité d'un panneau solaire dans cette simulation ?",
    options: ["75%", "80%", "85%", "90%"],
    correctAnswer: 2,
    explanation:
      "Le panneau solaire a une efficacité de 85%, ce qui est supérieur à la génératrice classique (80%).",
    difficulty: "facile",
    category: "efficacite",
  },
  {
    id: 2,
    question: "Que se passe-t-il lors de la transformation d'énergie mécanique en électricité ?",
    options: ["Aucune perte", "Perte de 20%", "Perte de 15%", "Gain d'énergie"],
    correctAnswer: 1,
    explanation:
      "La génératrice a une efficacité de 80%, ce qui signifie une perte de 20% lors de la conversion.",
    difficulty: "moyen",
    category: "transformation",
  },
  {
    id: 3,
    question: "Quel appareil a la meilleure efficacité énergétique ?",
    options: ["Ampoule LED (90%)", "Ventilateur (85%)", "Chauffe-eau (95%)", "Tous égaux"],
    correctAnswer: 2,
    explanation:
      "Le chauffe-eau a la meilleure efficacité avec 95%, car la conversion électricité-chaleur est très efficace.",
    difficulty: "facile",
    category: "application",
  },
  {
    id: 4,
    question: "Pourquoi y a-t-il des pertes d'énergie dans les transformations ?",
    options: ["Erreur de calcul", "Lois de la physique", "Mauvais équipement", "Hasard"],
    correctAnswer: 1,
    explanation:
      "Les pertes d'énergie sont dues aux lois de la thermodynamique : toute transformation implique des pertes sous forme de chaleur.",
    difficulty: "difficile",
    category: "processus",
  },
  {
    id: 5,
    question: "Quelle source d'énergie est renouvelable dans cette simulation ?",
    options: ["Le vélo seulement", "Le soleil seulement", "Les deux", "Aucune"],
    correctAnswer: 2,
    explanation:
      "Les deux sources sont renouvelables : l'énergie humaine (vélo) et l'énergie solaire se régénèrent naturellement.",
    difficulty: "moyen",
    category: "sources",
  },
]