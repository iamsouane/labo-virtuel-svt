// src/data/selectionNaturelleTutorial.tsx
import type { TutorialStep } from "../types/tutorialSelection"
import {
  Rabbit,
  Thermometer,
  Dna,
  HeartPulse,
  RefreshCw,
  Search,
  GraduationCap,
} from "lucide-react"

export const SELECTION_NATURELLE_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <Rabbit size={20} /> Simulation de Sélection Naturelle
      </span>
    ),
    content:
      "Cette simulation vous permet d'observer comment les caractéristiques des lapins évoluent en fonction des pressions environnementales (température, prédateurs, nourriture).",
    tips: [
      "Réglez l’environnement avec les paramètres",
      "Observez l’adaptation des lapins au fil du temps",
      "Notez les variations génétiques et la survie",
    ],
    position: "center",
    autoAdvance: 8000,
    skippable: true,
  },
  {
    id: 2,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <Thermometer size={20} /> Facteurs de l’Environnement
      </span>
    ),
    content:
      "Les conditions environnementales influencent les chances de survie. Par exemple, un climat froid favorise les lapins à fourrure épaisse.",
    tips: [
      "Modifiez la température pour voir les adaptations",
      "Ajoutez des prédateurs pour observer la sélection",
      "Variez la nourriture disponible",
    ],
    target: "environment-controls",
    position: "bottom",
    highlight: true,
  },
  {
    id: 3,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <Dna size={20} /> Génétique et Hérédité
      </span>
    ),
    content:
      "Chaque lapin hérite d’un patrimoine génétique de ses parents. Certains gènes offrent un avantage de survie, d’autres non.",
    tips: [
      "Les gènes sont transmis avec des variations",
      "Certains phénotypes disparaissent progressivement",
      "La sélection favorise les traits les plus adaptés",
    ],
    target: "genetics-panel",
    position: "right",
    highlight: true,
  },
  {
    id: 4,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <HeartPulse size={20} /> Survie et Reproduction
      </span>
    ),
    content:
      "Seuls les lapins survivants peuvent se reproduire. Plus un trait est avantageux, plus il se répandra dans la population.",
    tips: [
      "Les mieux adaptés ont plus de descendants",
      "Suivez les générations pour voir les tendances",
      "La pression réduit parfois la diversité génétique",
    ],
    target: "statistics-panel",
    position: "left",
    highlight: true,
  },
  {
    id: 5,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <RefreshCw size={20} /> Expérimentez !
      </span>
    ),
    content:
      "Essayez différents scénarios pour mieux comprendre l’évolution. Vous pouvez relancer la simulation avec de nouvelles conditions.",
    tips: [
      "Comparez deux environnements : chaud vs froid",
      "Testez des populations de départ différentes",
      "Observez les effets sur plusieurs générations",
    ],
    target: "reset-button",
    position: "top",
  },
  {
    id: 6,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <Search size={20} /> Mode Observation
      </span>
    ),
    content:
      "Sélectionnez un lapin pour voir :\n- Son patrimoine génétique\n- Ses ancêtres\n- Son adaptation à l'environnement",
    tips: [
      "Comparez les lapins survivants et disparus",
      "Tracez l'hérédité des traits sur 3 générations",
      "Les mutations aléatoires créent de la variabilité",
    ],
    target: "canvas",
    position: "bottom",
    highlight: true,
  },
  {
    id: 7,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <GraduationCap size={20} /> À vous de jouer !
      </span>
    ),
    content:
      "Vous maîtrisez maintenant tous les outils !\n\nCréez vos propres expériences et observez comment la sélection naturelle sculpte les populations.",
    tips: [
      "Combinez plusieurs pressions à la fois",
      "Notez vos observations dans le journal",
      "Relancez pour tester la reproductibilité",
    ],
    position: "center",
  },
]