// src/data/energieTutorial.tsx
import type { TutorialStep } from "../types/simulationEnergieTypes"
import {
  Bolt,
  Bike,
  Settings,
  Zap,
  Plug,
  Flame,
  GraduationCap,
  FlaskConical,
} from "lucide-react"

export const ENERGIE_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: (
      <span className="flex items-center gap-2">
        <Bolt size={20} /> Bienvenue dans le labo d'énergie !
      </span>
    ),
    content:
      "Explorez comment l'énergie est produite, convertie et utilisée. Cette simulation vous permet de manipuler différentes sources, générateurs et appareils.",
    tips: [
      "Comparez les sources d'énergie disponibles",
      "Observez les pertes à chaque étape",
      "Testez différents scénarios énergétiques",
    ],
    position: "center",
    autoAdvance: 7000,
    skippable: true,
  },
  {
    id: 2,
    title: (
      <span className="flex items-center gap-2">
        <Settings size={20} /> Contrôles énergétiques
      </span>
    ),
    content:
      "Utilisez les contrôles pour ajuster :\n- La source (vélo ou soleil)\n- L'intensité produite\n- Le générateur\n- L'appareil de sortie",
    tips: [
      "Le vélo génère de l'énergie mécanique",
      "Le soleil génère de l'énergie lumineuse",
      "Chaque combinaison influence l’efficacité",
    ],
    target: "controls",
    position: "bottom",
    highlight: true,
  },
  {
    id: 3,
    title: (
      <span className="flex items-center gap-2">
        <Bike size={20} /> Sources d'énergie
      </span>
    ),
    content:
      "Vous pouvez choisir entre deux sources : le vélo (énergie mécanique) ou le soleil (énergie lumineuse).",
    tips: [
      "Le vélo dépend du pédalage (effort humain)",
      "Le soleil dépend de l'intensité lumineuse",
      "Les deux sont renouvelables",
    ],
    target: "source-control",
    position: "top",
    highlight: true,
  },
  {
    id: 4,
    title: (
      <span className="flex items-center gap-2">
        <Zap size={20} /> Le générateur
      </span>
    ),
    content:
      "Le générateur convertit l’énergie initiale en électricité. Deux types sont disponibles :\n- Génératrice (pour le vélo)\n- Panneau solaire (pour la lumière)",
    tips: [
      "La génératrice est efficace à 80%",
      "Le panneau solaire est efficace à 85%",
      "Il y a toujours des pertes d'énergie",
    ],
    target: "generator-control",
    position: "top",
    highlight: true,
  },
  {
    id: 5,
    title: (
      <span className="flex items-center gap-2">
        <Plug size={20} /> Appareils de sortie
      </span>
    ),
    content:
      "L’électricité alimente un appareil : ampoule, ventilateur ou chauffe-eau.\nChaque appareil transforme l’énergie de façon différente.",
    tips: [
      "Ampoule → lumière (90%)",
      "Ventilateur → mouvement (85%)",
      "Chauffe-eau → chaleur (95%)",
    ],
    target: "device-control",
    position: "top",
    highlight: true,
  },
  {
    id: 6,
    title: (
      <span className="flex items-center gap-2">
        <Flame size={20} /> Suivez les pertes d’énergie
      </span>
    ),
    content:
      "Chaque conversion d’énergie génère des pertes. Observez les particules qui changent de forme et diminuent en nombre.",
    tips: [
      "L’énergie électrique est au centre de la chaîne",
      "Observez les couleurs des particules pour chaque type",
      "Optimisez votre chaîne pour réduire les pertes",
    ],
    target: "particles",
    position: "bottom",
    highlight: true,
  },
  {
    id: 7,
    title: (
      <span className="flex items-center gap-2">
        <FlaskConical size={20} /> Comparaison d’efficacité
      </span>
    ),
    content:
      "Comparez les rendements de différentes combinaisons. Certaines sont plus efficaces selon la source choisie.",
    tips: [
      "Le chauffe-eau a le meilleur rendement global",
      "Un panneau solaire + ampoule est très réaliste",
      "Le vélo demande plus d'effort mais fonctionne partout",
    ],
    position: "center",
  },
  {
    id: 8,
    title: (
      <span className="flex items-center gap-2">
        <GraduationCap size={20} /> À vous de jouer !
      </span>
    ),
    content:
      "Vous avez les clés pour comprendre les transformations d'énergie. Lancez une simulation, testez et optimisez !",
    tips: [
      "Alternez entre les presets pour gagner du temps",
      "Testez chaque combinaison source + générateur + appareil",
      "Analysez les résultats et le rendement",
    ],
    position: "center",
  },
]