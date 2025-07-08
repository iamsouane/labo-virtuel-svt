// src/data/quizPollution.ts
import type { QuizQuestionPollution } from "../types/simulationPollutionTypes"

export const QUIZ_QUESTIONS_POLLUTION: QuizQuestionPollution[] = [
  {
    id: 1,
    question: "Quelle est la concentration normale de CO₂ dans l'atmosphère ?",
    options: ["280 ppm", "350 ppm", "420 ppm", "500 ppm"],
    correctAnswer: 2,
    explanation:
      "En 2023, la concentration de CO₂ atmosphérique dépasse 420 ppm, soit une augmentation de 50% depuis l'ère préindustrielle (280 ppm).",
    difficulty: "moyen",
    category: "concepts",
  },
  {
    id: 2,
    question: "Combien de CO₂ émet une voiture moyenne par kilomètre ?",
    options: ["50g", "120g", "200g", "300g"],
    correctAnswer: 1,
    explanation:
      "Une voiture thermique émet en moyenne 120g de CO₂ par kilomètre parcouru, variant selon le type de carburant et l'efficacité du moteur.",
    difficulty: "facile",
    category: "emissions",
  },
  {
    id: 3,
    question: "Que signifie PM2.5 ?",
    options: [
      "Particules de 2,5 mm",
      "Particules de 2,5 µm",
      "Pollution Majeure 2.5",
      "Pression Maximale 2.5",
    ],
    correctAnswer: 1,
    explanation:
      "PM2.5 désigne les particules fines d'un diamètre inférieur à 2,5 micromètres, soit 100 fois plus fines qu'un cheveu humain.",
    difficulty: "moyen",
    category: "concepts",
  },
  {
    id: 4,
    question: "À partir de quel AQI l'air est-il considéré comme dangereux ?",
    options: ["100", "150", "200", "300"],
    correctAnswer: 3,
    explanation:
      "Un AQI supérieur à 300 indique un air dangereux pour tous, nécessitant d'éviter toute activité extérieure.",
    difficulty: "difficile",
    category: "sante",
  },
  {
    id: 5,
    question: "Quel polluant cause principalement les pluies acides ?",
    options: ["CO₂", "NOx", "PM2.5", "O₃"],
    correctAnswer: 1,
    explanation:
      "Les oxydes d'azote (NOx) se transforment en acide nitrique dans l'atmosphère, contribuant aux pluies acides qui endommagent les écosystèmes.",
    difficulty: "moyen",
    category: "environnement",
  },
]
