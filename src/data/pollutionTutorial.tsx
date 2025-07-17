// src/data/pollutionTutorial.ts
import type { TutorialStep } from "../types/simulationPollutionTypes"
import {
  CloudDrizzle,
  Car,
  Factory,
  CircleAlert,
  Leaf,
  HeartPulse,
  GraduationCap,
} from "lucide-react"

export const POLLUTION_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <CloudDrizzle className="text-primary" size={20} />
        Bienvenue
      </span>
    ),
    content:
      "Bienvenue dans la simulation sur la pollution de l'air.\n\nVous allez découvrir comment les transports et les industries influencent la qualité de l'air, et comment certaines actions peuvent réduire ces effets.",
    tips: [
      "Utilisez les curseurs pour modifier les sources de pollution",
      "Observez les indicateurs et leur évolution",
      "Appliquez différentes solutions pour améliorer l'air",
    ],
    position: "center",
    autoAdvance: 7000,
    skippable: true,
  },
  {
    id: 2,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <Car className="text-primary" size={20} />
        Transports et pollution
      </span>
    ),
    content:
      "Les véhicules à moteur thermique émettent du dioxyde de carbone (CO₂), des oxydes d'azote (NOx) et des particules fines (PM2.5).\n\nChaque voiture rejette en moyenne 120g de CO₂/km parcouru.",
    tips: [
      "Une voiture émet ~32 ppm de CO₂/jour",
      "Le NOx aggrave les problèmes respiratoires",
      "Les PM2.5 pénètrent dans le sang",
    ],
    target: "car-control",
    position: "top",
    highlight: true,
  },
  {
    id: 3,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <Factory className="text-primary" size={20} />
        Industries polluantes
      </span>
    ),
    content:
      "Les usines émettent beaucoup de CO₂, de NOx et de particules.\n\nUne usine peut produire autant de CO₂ que 400 voitures !",
    tips: [
      "Émission moyenne : 85 ppm de CO₂/jour",
      "Impact 3× plus élevé qu’une voiture",
      "Les filtres peuvent réduire 80% des émissions",
    ],
    target: "industry-control",
    position: "top",
    highlight: true,
  },
  {
    id: 4,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <CircleAlert className="text-primary" size={20} />
        Comprendre les polluants
      </span>
    ),
    content:
      "La qualité de l’air est mesurée par plusieurs indicateurs :\n\n- CO₂ : gaz à effet de serre\n- NOx : toxique pour le système respiratoire\n- PM2.5 : fines particules cancérigènes\n- AQI : indice global de 0 à 500",
    tips: [
      "CO₂ acceptable : 350–420 ppm",
      "NOx dangereux > 100 µg/m³",
      "PM2.5 cancérigènes > 50 µg/m³",
    ],
    target: "pollution-indicators",
    position: "bottom",
    highlight: true,
  },
  {
    id: 5,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <Leaf className="text-primary" size={20} />
        Solutions efficaces
      </span>
    ),
    content:
      "Plusieurs actions permettent de réduire la pollution :\n\nVoitures électriques, filtres industriels, pistes cyclables, panneaux solaires, plantation d’arbres.\n\nCes solutions réduisent l’AQI et améliorent la santé.",
    tips: [
      "Voiture électrique : -20% d’émissions",
      "Filtre industriel : -25% d’émissions",
      "Les arbres absorbent naturellement le CO₂",
    ],
    target: "solutions-panel",
    position: "top",
    highlight: true,
  },
  {
    id: 6,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <HeartPulse className="text-primary" size={20} />
        Effets sur la santé
      </span>
    ),
    content:
      "La pollution atmosphérique cause 7 millions de décès prématurés chaque année.\n\nL’AQI vous informe sur le niveau de danger :\n- Bon : 0–50\n- Modéré : 51–100\n- Mauvais : 101–150\n- Dangereux : 200+",
    tips: [
      "AQI > 100 : évitez les efforts physiques",
      "AQI > 150 : portez un masque",
      "AQI > 200 : restez à l’intérieur",
    ],
    target: "health-info",
    position: "bottom",
    highlight: true,
  },
  {
    id: 7,
    title: (
      <span className="flex items-center gap-2 text-dark">
        <GraduationCap className="text-primary" size={20} />
        À vous de jouer !
      </span>
    ),
    content:
      "C’est à vous de tester les réglages :\n\nChangez les sources de pollution, appliquez les solutions et observez les résultats.\n\nVotre objectif : un AQI inférieur à 50 !",
    tips: [
      "Combinez les solutions pour plus d'efficacité",
      "Analysez les indicateurs",
      "Trouvez la configuration optimale",
    ],
    position: "center",
  },
]