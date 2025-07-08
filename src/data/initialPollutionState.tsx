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
    icon: <Car size={18} className="text-blue-600" />,
    description: "Une voiture électrique ne pollue pas en roulant, ce qui aide à garder l'air plus propre, surtout en ville !",
    active: false,
    impact: 20,
  },
  {
    id: "filter",
    name: "Filtre industriel",
    icon: <Factory size={18} className="text-gray-700" />,
    description: "e filtre industriel agit comme un « masque pour les usines » : il empêche les fumées sales d’atteindre l’air que l’on respire.",
    active: false,
    impact: 25,
  },
  {
    id: "bike",
    name: "Piste cyclable",
    icon: <Bike size={18} className="text-green-600" />,
    description: "La piste cyclable aide à garder l’air plus propre, car chaque vélo remplace une voiture polluante.",
    active: false,
    impact: 15,
  },
  {
    id: "solar",
    name: "Énergie solaire",
    icon: <Sun size={18} className="text-yellow-500" />,
    description: "L’énergie solaire produit de l’électricité sans polluer l’air, et aide à lutter contre le changement climatique.",
    active: false,
    impact: 30,
  },
  {
    id: "trees",
    name: "Plantation d'arbres",
    icon: <Trees size={18} className="text-green-700" />,
    description: "Planter des arbres, c’est améliorer la qualité de l’air, absorber du CO₂, et protéger la planète de manière naturelle.",
    active: false,
    impact: 10,
  },
]