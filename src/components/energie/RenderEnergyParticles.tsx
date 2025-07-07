//src/components/energie/RenderEnergyParticles
import React from "react"

interface EnergyParticle {
  id: number
  x: number
  y: number
  progress: number
  type: "mechanical" | "solar" | "electrical" | "output"
}

interface Props {
  showEnergySymbols: boolean
  energyParticles: EnergyParticle[]
  selectedDevice: "ampoule" | "ventilateur" | "chauffe-eau"
}

const RenderEnergyParticles: React.FC<Props> = ({
  showEnergySymbols,
  energyParticles,
  selectedDevice,
}) => {
  if (!showEnergySymbols) return null

  const getParticleColor = (type: string) => {
    switch (type) {
      case "mechanical":
        return "text-blue-500"
      case "solar":
        return "text-yellow-500"
      case "electrical":
        return "text-green-500"
      case "output":
        if (selectedDevice === "ampoule") return "text-yellow-500"
        if (selectedDevice === "ventilateur") return "text-cyan-500"
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <>
      {energyParticles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute text-lg font-bold ${getParticleColor(particle.type)} animate-pulse transition-all duration-100 pointer-events-none`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: "translate(-50%, -50%)",
            opacity: Math.max(0.3, 1 - particle.progress / 100),
          }}
        >
          E
        </div>
      ))}
    </>
  )
}

export default RenderEnergyParticles