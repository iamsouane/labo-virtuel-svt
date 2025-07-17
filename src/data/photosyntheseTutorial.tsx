// src/data/photosyntheseTutorial.ts
import type { TutorialStep } from "../types/simulationPhotosyntheseTypes"
import {
  Leaf,
  Microscope,
  Settings,
  Sun,
  Cloud,
  FlaskConical,
  GraduationCap,
  ThermometerSun,
} from "lucide-react"

export const PHOTOSYNTHESE_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: (
      <span className="flex items-center gap-2 text-green-700 font-semibold">
        <Leaf size={20} />
        Laboratoire de photosynthèse !
      </span>
    ),
    content:
      "Cette simulation interactive vous permet d'explorer le processus de photosynthèse en manipulant différents paramètres environnementaux.",
    tips: [
      "Manipulez les paramètres pour voir leur impact",
      "Voir les résultats en temps réel sur les plantes",
      "Comparez différentes conditions expérimentales",
    ],
    position: "center",
    autoAdvance: 7000,
    skippable: true,
  },
  {
    id: 2,
    title: (
      <span className="flex items-center gap-2 text-green-700 font-semibold">
        <Microscope size={20} />
        Votre espace expérimental 3D
      </span>
    ),
    content:
      "Votre laboratoire contient 3 plantes, une source lumineuse et divers instruments de mesure.\n\nInteragissez avec l'environnement pour commencer.",
    tips: [
      "Faites pivoter la vue en cliquant-glissant",
      "Zoomez avec la molette de la souris",
      "Survolez les éléments pour plus d'informations",
    ],
    target: "canvas",
    position: "bottom",
    action: "wait",
  },
  {
    id: 3,
    title: (
      <span className="flex items-center gap-2 text-green-700 font-semibold">
        <Settings size={20} />
        Contrôles expérimentaux
      </span>
    ),
    content:
      "Ces paramètres vous permettent de modifier les conditions environnementales :\n- Intensité lumineuse\n- Concentration en CO₂\n- Température\n- Humidité",
    tips: [
      "Chaque paramètre a une plage optimale",
      "Les indicateurs visuels vous guident",
      "Presets disponibles pour démarrer rapidement",
    ],
    target: "controls",
    position: "bottom",
    highlight: true,
  },
  {
    id: 4,
    title: (
      <span className="flex items-center gap-2 text-green-700 font-semibold">
        <Sun size={20} />
        Le rôle crucial de la lumière
      </span>
    ),
    content:
      "La lumière fournit l'énergie nécessaire à la photosynthèse. Sans lumière, pas de production d'oxygène ni de glucose !",
    tips: [
      "Essayez des intensités extrêmes (faible/forte)",
      "Observez le point de saturation lumineuse",
      "Notez le délai avant réponse des plantes",
    ],
    target: "light-control",
    position: "top",
    action: "adjust",
    actionValue: 80,
    highlight: true,
  },
  {
    id: 5,
    title: (
      <span className="flex items-center gap-2 text-green-700 font-semibold">
        <Cloud size={20} />
        Le dioxyde de carbone (CO₂)
      </span>
    ),
    content:
      "Le CO₂ est la matière première de la photosynthèse. Sa concentration influence directement le taux de production.",
    tips: [
      "En absence de CO₂, la photosynthèse s'arrête",
      "Un excès de CO₂ peut limiter d'autres facteurs.",
      "Les plantes ont des seuils de tolérance variables",
    ],
    target: "co2-control",
    position: "top",
    highlight: true,
  },
  {
    id: 6,
    title: (
      <span className="flex items-center gap-2 text-green-700 font-semibold">
        <ThermometerSun size={20} />
        L'impact de la température
      </span>
    ),
    content:
      "La température affecte l'activité enzymatique. Trop basse ou trop haute, elle peut inhiber la photosynthèse.",
    tips: [
      "25°C est optimal pour la plupart des plantes",
      "Les températures extrêmes abîment les plantes.",
      "Certaines plantes tolèrent des climats précis.",
    ],
    target: "temp-control",
    position: "top",
    highlight: true,
  },
  {
    id: 7,
    title: (
      <span className="flex items-center gap-2 text-green-700 font-semibold">
        <FlaskConical size={20} />
        L'équation fondamentale
      </span>
    ),
    content:
      "6CO₂ + 6H₂O + lumière → C₆H₁₂O₆ + 6O₂\n\nCette équation résume le processus de photosynthèse.",
    tips: [
      "Les réactifs sont à gauche, les produits à droite",
      "L'énergie lumineuse devient énergie chimique",
      "Tous les facteurs doivent agir ensemble.",
    ],
    target: "equation",
    position: "center",
    highlight: true,
  },
  {
    id: 8,
    title: (
      <span className="flex items-center gap-2 text-pgreen-700 font-semibold">
        <GraduationCap size={20} />
        À vous d'expérimenter !
      </span>
    ),
    content:
      "Vous disposez maintenant de toutes les connaissances nécessaires pour mener vos propres investigations scientifiques !",
    tips: [
      "Testez des scénarios extrêmes",
      "Essayez de trouver la combinaison optimale",
      "Documentez vos observations et conclusions",
    ],
    position: "center",
  },
]