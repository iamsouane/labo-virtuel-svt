// src/data/quizSelection.ts
import type { QuizQuestion } from "../types/selectionNaturelleTypes"

export const QUIZ_QUESTIONS_SELECTION: QuizQuestion[] = [
    {
        id: 1,
        question: "Quel trait est considéré comme dominant chez les lapins ?",
        options: [
            "Fourrure blanche", 
            "Fourrure brune", 
            "Oreilles courtes", 
            "Oreilles tombantes"
        ],
        correctAnswer: 1,
        explanation: "Le gène pour la fourrure brune (B) est dominant sur le gène pour la fourrure blanche (b) selon les lois de Mendel.",
        difficulty: "facile",
        category: "genetique",
    },
    {
        id: 2,
        question: "Quel facteur environnemental favorise le développement de dents plus longues chez les lapins ?",
        options: [
            "Présence de prédateurs", 
            "Abondance de nourriture molle", 
            "Prédominance de végétaux durs", 
            "Climat très humide"
        ],
        correctAnswer: 2,
        explanation: "Les végétaux durs nécessitent des dents plus longues et résistantes pour être mastiqués efficacement, ce qui confère un avantage sélectif.",
        difficulty: "moyen",
        category: "adaptation",
    },
    {
        id: 3,
        question: "Quelle est la conséquence principale de la sélection naturelle sur une population ?",
        options: [
            "Augmentation de la diversité génétique",
            "Adaptation progressive aux conditions environnementales",
            "Apparition soudaine de nouveaux traits",
            "Uniformisation de toutes les caractéristiques"
        ],
        correctAnswer: 1,
        explanation: "La sélection naturelle favorise les traits avantageux dans un environnement donné, conduisant à une adaptation progressive de la population.",
        difficulty: "moyen",
        category: "processus",
    },
    {
        id: 4,
        question: "Quel mécanisme introduit de nouvelles variations génétiques dans une population ?",
        options: [
            "La sélection naturelle",
            "Les mutations aléatoires",
            "L'adaptation physiologique",
            "La reproduction asexuée"
        ],
        correctAnswer: 1,
        explanation: "Les mutations aléatoires dans l'ADN sont la source première de nouvelles variations génétiques sur laquelle agit la sélection naturelle.",
        difficulty: "difficile",
        category: "genetique",
    },
    {
        id: 5,
        question: "Dans un environnement froid, quel trait serait avantageux pour les lapins ?",
        options: [
            "Fourrure plus épaisse",
            "Oreilles plus longues",
            "Taille plus petite",
            "Couleur plus vive"
        ],
        correctAnswer: 0,
        explanation: "Une fourrure plus épaisse offre une meilleure isolation thermique dans les climats froids, ce qui améliore les chances de survie.",
        difficulty: "facile",
        category: "adaptation",
    },
    {
        id: 6,
        question: "Combien de générations faut-il généralement pour observer un changement évolutif significatif ?",
        options: [
            "1-2 générations",
            "5-10 générations",
            "Des dizaines à centaines de générations",
            "Le changement est immédiat"
        ],
        correctAnswer: 2,
        explanation: "L'évolution opère sur des échelles de temps longues, nécessitant généralement de nombreuses générations pour des changements visibles.",
        difficulty: "moyen",
        category: "processus",
    },
    {
        id: 7,
        question: "Qu'est-ce que le 'fitness' en biologie évolutive ?",
        options: [
            "La capacité physique d'un organisme",
            "Le succès reproductif relatif d'un individu",
            "La longévité d'un organisme",
            "La résistance aux maladies"
        ],
        correctAnswer: 1,
        explanation: "Le fitness mesure la contribution relative d'un individu au pool génétique des générations suivantes.",
        difficulty: "difficile",
        category: "concepts",
    },
    {
        id: 8,
        question: "Quelle situation illustre le mieux la sélection naturelle ?",
        options: [
            "Des lapins apprennent à mieux se cacher",
            "Les lapins à meilleur camouflage survivent et se reproduisent davantage",
            "Tous les lapins développent progressivement un meilleur camouflage",
            "Des lapins mutent intentionnellement pour mieux se camoufler"
        ],
        correctAnswer: 1,
        explanation: "La sélection naturelle agit sur les variations existantes - les individus avec des traits avantageux (comme un bon camouflage) ont plus de descendants.",
        difficulty: "moyen",
        category: "application",
    },
    {
        id: 9,
        question: "Quelle est l'importance de la diversité génétique dans l'évolution ?",
        options: [
            "Elle est inutile car la sélection élimine les variations",
            "Elle permet à la population de s'adapter à des changements environnementaux",
            "Elle garantit que tous les individus soient identiques",
            "Elle accélère artificiellement l'évolution"
        ],
        correctAnswer: 1,
        explanation: "Une diversité génétique importante offre plus de possibilités d'adaptation face à des conditions changeantes.",
        difficulty: "moyen",
        category: "genetique",
    },
    {
        id: 10,
        question: "Quel phénomène peut contrebalancer la sélection naturelle ?",
        options: [
            "La dérive génétique",
            "Les flux génétiques",
            "Les mutations neutres",
            "Toutes ces réponses"
        ],
        correctAnswer: 3,
        explanation: "D'autres mécanismes évolutifs comme la dérive génétique (aléatoire), les migrations (flux génétique) et les mutations neutres peuvent influencer l'évolution indépendamment de la sélection naturelle.",
        difficulty: "difficile",
        category: "processus",
    }
]