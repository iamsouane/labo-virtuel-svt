//src/hooks/useEnergySimulation
import { useEffect, useState } from "react"
import type { OutputDevice, EnergySource, GeneratorType, EnergyData, EnergyParticle } from "../types/simulationEnergieTypes"

interface UseEnergySimulationParams {
  energyData: EnergyData
  selectedDevice: OutputDevice
  energySource: EnergySource
  generatorType: GeneratorType
  showEnergySymbols: boolean
}

export function useEnergySimulation({
  energyData,
  selectedDevice,
  energySource,
  showEnergySymbols,
}: UseEnergySimulationParams) {
  const [pedalRotation, setPedalRotation] = useState(0)
  const [fanRotation, setFanRotation] = useState(0)
  const [energyParticles, setEnergyParticles] = useState<EnergyParticle[]>([])

  // Calcul de l'énergie électrique et de sortie (à gérer dans composant parent via callback ou autre)

  // Animation des pédales
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (energyData.isActive && energySource === "velo" && energyData.pedalingIntensity > 0) {
      interval = setInterval(() => {
        setPedalRotation((prev) => prev + energyData.pedalingIntensity / 5)
      }, 50)
    }
    return () => clearInterval(interval)
  }, [energyData.isActive, energyData.pedalingIntensity, energySource])

  // Animation du ventilateur
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (energyData.isActive && energyData.outputPower > 0 && selectedDevice === "ventilateur") {
      interval = setInterval(() => {
        setFanRotation((prev) => prev + energyData.outputPower / 3)
      }, 50)
    }
    return () => clearInterval(interval)
  }, [energyData.isActive, energyData.outputPower, selectedDevice])

  // Animation des particules d'énergie
  useEffect(() => {
    if (!showEnergySymbols || !energyData.isActive) {
      setEnergyParticles([])
      return
    }

    const inputIntensity = energySource === "velo" ? energyData.pedalingIntensity : energyData.solarIntensity
    if (inputIntensity === 0) {
      setEnergyParticles([])
      return
    }

    const interval = setInterval(() => {
      setEnergyParticles((prev) => {
        const activeParticles = prev.filter((p) => p.progress < 100)
        const newParticles: EnergyParticle[] = []
        const particleCount = Math.floor(inputIntensity / 25)

        for (let i = 0; i < particleCount; i++) {
          if (Math.random() < 0.3) {
            newParticles.push({
              id: Date.now() + Math.random(),
              x: energySource === "velo" ? 120 : 120,
              y: energySource === "velo" ? 250 : 150,
              type: energySource === "velo" ? ("mechanical" as const) : ("solar" as const),
              progress: 0,
            })
          }
        }

        const updatedParticles = activeParticles.map((particle) => {
          const newProgress = particle.progress + 2
          let newX = particle.x
          const newY = particle.y

          if ((particle.type === "mechanical" || particle.type === "solar") && newProgress > 30) {
            return {
              ...particle,
              type: "electrical" as const, 
              x: 290,
              progress: 0,
            }
          } else if (particle.type === "electrical" && newProgress > 30) {
            return {
              ...particle,
              type: "output" as const,
              x: 450,
              progress: 0,
            }
          } else {
            if (particle.type === "mechanical" || particle.type === "solar") {
              newX = 120 + (170 * newProgress) / 100
            } else if (particle.type === "electrical") {
              newX = 290 + (160 * newProgress) / 100
            }
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            progress: newProgress,
          }
        })

        return [...updatedParticles, ...newParticles]
      })
    }, 100)

    return () => clearInterval(interval)
  }, [showEnergySymbols, energyData.isActive, energyData.pedalingIntensity, energyData.solarIntensity, energySource])

  return {
    pedalRotation,
    fanRotation,
    energyParticles,
  }
}