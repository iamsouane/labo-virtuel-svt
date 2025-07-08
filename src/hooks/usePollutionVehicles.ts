import { useEffect } from "react"
import type { Vehicle, Solution } from "../types/simulationPollutionTypes"

interface UsePollutionVehiclesParams {
  carCount: number
  solutions: Solution[]
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>
  isRunning: boolean 
}

export function usePollutionVehicles({
  carCount,
  solutions,
  setVehicles,
  isRunning, 
}: UsePollutionVehiclesParams) {
  useEffect(() => {
    if (!isRunning) return 

    const hasElectric = solutions.find((s) => s.id === "electric")?.active
    const hasBike = solutions.find((s) => s.id === "bike")?.active

    const interval = setInterval(() => {
      setVehicles((prev) => {
        let newVehicles = [...prev]

        // Supprimer les véhicules sortis de l'écran
        newVehicles = newVehicles.filter((v) => v.x > -10)

        // Taux d'apparition
        const vehicleSpawnRate = Math.min(0.3, carCount * 0.05)

        if (Math.random() < vehicleSpawnRate) {
          const vehicleTypes = []

          if (!hasElectric) {
            vehicleTypes.push(
              { type: "car" as const, color: "#ef4444", speed: -0.8 },
              { type: "car" as const, color: "#3b82f6", speed: -0.7 },
              { type: "car" as const, color: "#6b7280", speed: -0.9 }
            )
          } else {
            vehicleTypes.push(
              { type: "electric" as const, color: "#10b981", speed: -0.6 },
              { type: "electric" as const, color: "#06b6d4", speed: -0.7 }
            )
          }

          if (hasBike) {
            vehicleTypes.push({ type: "bike" as const, color: "#f59e0b", speed: -0.4 })
          }

          const randomVehicle = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)]

          newVehicles.push({
            id: Date.now() + Math.random(),
            x: 105,
            ...randomVehicle,
          })
        }

        return newVehicles.map((vehicle) => ({
          ...vehicle,
          x: vehicle.x + vehicle.speed,
        }))
      })
    }, 100)

    return () => clearInterval(interval)
  }, [solutions, carCount, setVehicles, isRunning]) 
}