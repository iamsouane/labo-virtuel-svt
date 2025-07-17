// src/data/initialPollutionState.tsx
import type { PollutionData, Solution } from "../types/simulationPollutionTypes"
import {
  Car,
  Factory,
  Bike,
  Sun,
  Trees,
} from "lucide-react"

export const INITIAL_POLLUTION_DATA: PollutionData = {
  level: 50,
  source: "voiture",
  co2: 400,
  nox: 30,
  pm25: 25,
  aqi: 75,
}

export const INITIAL_SOLUTIONS: Solution[] = [
  {
    id: "electric",
    name: "Voiture électrique",
    icon: <Car size={18} className="text-primary" />,
    description: "Une voiture électrique ne rejette pas de gaz polluants en roulant : elle contribue à un air plus propre en ville.",
    active: false,
    impact: 20,
  },
  {
    id: "filter",
    name: "Filtre industriel",
    icon: <Factory size={18} className="text-primary" />,
    description: "Le filtre industriel agit comme un masque pour les usines : il bloque les fumées nocives avant qu’elles n’atteignent l’air.",
    active: false,
    impact: 25,
  },
  {
    id: "bike",
    name: "Piste cyclable",
    icon: <Bike size={18} className="text-green-600" />,
    description: "Les pistes cyclables encouragent les déplacements sans voiture : moins de circulation, moins de pollution.",
    active: false,
    impact: 15,
  },
  {
    id: "solar",
    name: "Énergie solaire",
    icon: <Sun size={18} className="text-yellow-500" />,
    description: "L’énergie solaire produit de l’électricité sans émission de gaz : elle aide à lutter contre le changement climatique.",
    active: false,
    impact: 30,
  },
  {
    id: "trees",
    name: "Plantation d'arbres",
    icon: <Trees size={18} className="text-green-700" />,
    description: "Les arbres absorbent le CO₂ et purifient l’air : une solution naturelle pour améliorer notre environnement.",
    active: false,
    impact: 10,
  },
]