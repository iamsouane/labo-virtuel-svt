// src/data/pollutionTutorial.ts
import type { TutorialStep } from "../types/simulationPollutionTypes";
import {
  CloudDrizzle,
  Car,
  Factory,
  CircleAlert,
  Leaf,
  HeartPulse,
  GraduationCap,
} from "lucide-react";

export const POLLUTION_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: (
      <span className="flex items-center gap-2">
        <CloudDrizzle size={20} /> Bienvenue
      </span>
    ),
    content:
      "Cette simulation vous permet d'explorer les causes et effets de la pollution atmosphérique. Vous pouvez ajuster les sources polluantes et observer leur impact en temps réel.",
    tips: [
      "Utilisez les contrôles pour modifier le nombre de voitures ou d'industries",
      "Observez les changements dans l'atmosphère et les données",
      "Testez différentes solutions pour réduire la pollution",
    ],
    position: "center",
    autoAdvance: 7000,
    skippable: true,
  },
  {
    id: 2,
    title: (
      <span className="flex items-center gap-2">
        <Car size={20} /> Sources de Pollution : Transport
      </span>
    ),
    content:
      "Le transport routier est une source majeure de pollution urbaine. Chaque voiture émet environ 120g de CO₂/km, plus du NOx et des PM2.5.",
    tips: [
      "Une voiture émet ~32 ppm de CO₂ par jour",
      "Les NOx causent l'asthme et les pluies acides",
      "Les PM2.5 pénètrent dans le sang et causent des maladies",
    ],
    target: "car-control",
    position: "top",
    highlight: true,
  },
  {
    id: 3,
    title: (
      <span className="flex items-center gap-2">
        <Factory size={20} /> Sources de Pollution : Industrie
      </span>
    ),
    content:
      "Les industries émettent des quantités massives de CO₂, NOx et particules. Une usine moyenne produit autant de CO₂ que 400 voitures.",
    tips: [
      "Une industrie émet ~85 ppm de CO₂ par jour",
      "Impact 3x supérieur à celui d’une voiture",
      "Les filtres industriels réduisent jusqu’à 80% des émissions",
    ],
    target: "industry-control",
    position: "top",
    highlight: true,
  },
  {
    id: 4,
    title: (
      <span className="flex items-center gap-2">
        <CircleAlert size={20} /> Comprendre les Polluants
      </span>
    ),
    content:
      "Quatre indicateurs mesurent la qualité de l'air :\n- CO₂ (effet de serre)\n- NOx (toxique respiratoire)\n- PM2.5 (particules fines)\n- AQI (indice global 0-500).",
    tips: [
      "CO₂ normal: 350-420 ppm, dangereux > 500 ppm",
      "NOx seuil OMS : 40 µg/m³, toxique > 100 µg/m³",
      "PM2.5 seuil OMS : 15 µg/m³, cancérigène > 50 µg/m³",
    ],
    target: "pollution-indicators",
    position: "bottom",
    highlight: true,
  },
  {
    id: 5,
    title: (
      <span className="flex items-center gap-2">
        <Leaf size={20} /> Solutions Anti-Pollution
      </span>
    ),
    content:
      "Des solutions existent : véhicules électriques, filtres industriels, pistes cyclables, énergies renouvelables, arbres. Chacune réduit la pollution de façon mesurable.",
    tips: [
      "Voitures électriques : -20% d’émissions",
      "Filtres industriels : -25% d’émissions",
      "Les arbres absorbent naturellement le CO₂",
    ],
    target: "solutions-panel",
    position: "top",
    highlight: true,
  },
  {
    id: 6,
    title: (
      <span className="flex items-center gap-2">
        <HeartPulse size={20} /> Impact sur la Santé
      </span>
    ),
    content:
      "La pollution cause 7 millions de morts prématurées par an. L'AQI indique le niveau de danger : Bon (0-50), Modéré (51-100), Mauvais (101-150), Dangereux (200+).",
    tips: [
      "AQI > 100 : éviter le sport extérieur",
      "AQI > 150 : porter un masque",
      "AQI > 200 : rester à l'intérieur",
    ],
    target: "health-info",
    position: "bottom",
    highlight: true,
  },
  {
    id: 7,
    title: (
      <span className="flex items-center gap-2">
        <GraduationCap size={20} /> À vous de jouer !
      </span>
    ),
    content:
      "Expérimentez avec les réglages et trouvez les solutions les plus efficaces. Observez les impacts sur l'air et la santé.",
    tips: [
      "Essayez différentes combinaisons de sources et solutions",
      "Analysez les résultats via les indicateurs",
      "Optimisez pour atteindre un AQI inférieur à 50",
    ],
    position: "center",
  },
];