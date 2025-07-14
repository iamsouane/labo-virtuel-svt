//src/data/presetsPhotosynthese
import type { Preset } from "../types/simulationPhotosyntheseTypes"
import {
  Sparkles,
  CloudSun,
  ThermometerSun,
  Snowflake,
} from "lucide-react"

export const PRESETS: Preset[] = [
  {
    id: "preset1",
    name: "Conditions Optimales",
    description: "Lumière forte, CO₂ élevé, température idéale",
    icon: <Sparkles className="w-4 h-4" />,
    environment: { 
      lightIntensity: 85, 
      co2Level: 60, 
      temperature: 25, 
      humidity: 70,
      waterAvailability: 90,
    },
    color: "green",
  },
  {
    id: "preset2",
    name: "Faible Luminosité",
    description: "Simulation d'un jour nuageux",
    icon: <CloudSun className="w-4 h-4" />,
    environment: { 
      lightIntensity: 30, 
      co2Level: 40, 
      temperature: 22, 
      humidity: 60,
      waterAvailability: 50,
    },
    color: "gray",
  },
  {
    id: "preset3",
    name: "Serre Chaude",
    description: "Température élevée, humidité forte",
    icon: <ThermometerSun className="w-4 h-4" />,
    environment: { 
      lightIntensity: 70, 
      co2Level: 50, 
      temperature: 35, 
      humidity: 85,
      waterAvailability: 80,
    },
    color: "red",
  },
  {
    id: "preset4",
    name: "Hiver",
    description: "Conditions hivernales difficiles",
    icon: <Snowflake className="w-4 h-4" />,
    environment: { 
      lightIntensity: 25, 
      co2Level: 30, 
      temperature: 15, 
      humidity: 45,
      waterAvailability: 20,
    },
    color: "blue",
  },
]