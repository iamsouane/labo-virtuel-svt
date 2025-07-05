// src/components/photosynthese/SimplePhotosynthesisScene.tsx
import { useEffect, useState } from "react"
import { OrbitControls, Text } from "@react-three/drei"
import type { LabEnvironment, PlantState } from "../../types/simulationPhotosyntheseTypes"
import { InteractivePlant } from "./InteractivePlant"
import { LabLight } from "./LabLight"
import { SimpleLabEnvironment } from "./SimpleLabEnvironment"
import { SimpleCO2Particles } from "./SimpleCO2Particles"
import type { ReactNode } from "react"


type Props = {
  environment: LabEnvironment
  isRunning: boolean
  selectedPreset: string | null
  timeElapsed: number
  resetKey: number
}

export type Preset = {
  name: string
  description: string
  icon: ReactNode // ✅ accepte du JSX comme <Sparkles />
  environment: LabEnvironment
  color: string
}

// 🟩 État initial des plantes (par défaut sauf preset "❄️Hiver")
const INITIAL_PLANTS: PlantState[] = [
  { health: 0.8, size: 1, oxygenProduction: 0.5, glucoseProduction: 0.3 },
  { health: 0.6, size: 0.8, oxygenProduction: 0.3, glucoseProduction: 0.2 },
  { health: 0.9, size: 1.2, oxygenProduction: 0.7, glucoseProduction: 0.4 },
]

// ❄️ État flétri pour l’hiver
const WILTED_STATE: PlantState[] = [
  { health: 0.2, size: 0.3, oxygenProduction: 0.05, glucoseProduction: 0.03 },
  { health: 0.25, size: 0.35, oxygenProduction: 0.06, glucoseProduction: 0.04 },
  { health: 0.3, size: 0.4, oxygenProduction: 0.07, glucoseProduction: 0.05 },
]

export function SimplePhotosynthesisScene({
  environment,
  isRunning,
  selectedPreset,
  resetKey,
}: Props) {
  const [plants, setPlants] = useState<PlantState[]>(
    selectedPreset === "❄️ Hiver" ? WILTED_STATE : INITIAL_PLANTS
  )

  // 🔄 Remettre les plantes à zéro lors d’un reset
  useEffect(() => {
    setPlants(selectedPreset === "❄️ Hiver" ? WILTED_STATE : INITIAL_PLANTS)
  }, [resetKey, selectedPreset])

  // Mise à jour de l'état des plantes quand un preset est sélectionné
  useEffect(() => {
    if (!selectedPreset) return

    if (selectedPreset === "❄️ Hiver") {
      setPlants(WILTED_STATE)
    }
    // Pour les autres presets, on part de WILTED_STATE (mais la croissance démarre uniquement si `isRunning`)
    else {
      setPlants(WILTED_STATE)
    }
  }, [selectedPreset])

  // 🌱 Croissance des plantes quand la simulation tourne
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      const status = getEnvironmentStatus()
      let photosynthesisRate = 0.4

      if (status === "Excellent") photosynthesisRate = 1.0
      else if (status === "Bon") photosynthesisRate = 0.6
      else photosynthesisRate = 0.2

      setPlants((prevPlants) =>
        prevPlants.map((plant) => {
          const healthChange = (photosynthesisRate - 0.4) * 0.02
          const newHealth = Math.max(0, Math.min(1, plant.health + healthChange))
          const newSize = Math.max(0.1, Math.min(1.5, plant.size + healthChange * 0.5))

          return {
            ...plant,
            health: newHealth,
            size: newSize,
            oxygenProduction: +(photosynthesisRate * newHealth).toFixed(2),
            glucoseProduction: +(photosynthesisRate * newHealth * 0.7).toFixed(2),
          }
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, environment])

  // 🔍 Qualité des conditions environnementales
  const getEnvironmentStatus = () => {
    const { lightIntensity, co2Level, temperature } = environment
    const lightOk = lightIntensity >= 50
    const co2Ok = co2Level >= 30
    const tempOk = temperature >= 20 && temperature <= 30

    if (lightOk && co2Ok && tempOk) return "Excellent"
    if ((lightOk && co2Ok) || (lightOk && tempOk) || (co2Ok && tempOk)) return "Bon"
    return "Difficile"
  }

  return (
    <>
      <OrbitControls enablePan enableZoom enableRotate maxDistance={10} minDistance={3} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <SimpleLabEnvironment />
      {plants.map((plant, index) => (
        <InteractivePlant
          key={index}
          position={[(-1 + index) * 1.8, -0.65, 0]}
          plantState={plant}
        />
      ))}
      <LabLight intensity={environment.lightIntensity / 100} />
      <SimpleCO2Particles level={environment.co2Level} />
      <Text position={[0, 3.5, -2]} fontSize={0.3} color="#2c5530" anchorX="center" anchorY="middle">
        Laboratoire de Photosynthèse
      </Text>
    </>
  )
}