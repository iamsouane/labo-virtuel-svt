//src/components/hooks/UsePollutionParticles
import { useEffect } from "react"
import type { Particle, Solution } from "../types/simulationPollutionTypes"

interface UsePollutionParticlesParams {
  pollutionLevel: number
  solutions: Solution[]
  isAnalyzing: boolean
  setParticles: React.Dispatch<React.SetStateAction<Particle[]>>
}

export function usePollutionParticles({
  pollutionLevel,
  solutions,
  isAnalyzing,
  setParticles,
}: UsePollutionParticlesParams) {
  useEffect(() => {
    const solutionImpact = solutions.filter((s) => s.active).reduce((sum, s) => sum + s.impact, 0)
    const effectivePollution = Math.max(0, pollutionLevel - solutionImpact)

    const interval = setInterval(() => {
      setParticles((prev) => {
        let newParticles = [...prev].filter((p) => p.opacity > 0)

        // Particules de pollution
        if (effectivePollution > 20) {
          const count = Math.floor(effectivePollution / 15)
          for (let i = 0; i < count; i++) {
            if (Math.random() < 0.3) {
              newParticles.push({
                id: Date.now() + Math.random(),
                x: Math.random() * 100,
                y: 80 + Math.random() * 20,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -Math.random() * 0.3 - 0.1,
                size: Math.random() * 3 + 1,
                opacity: 0.6,
                color: effectivePollution > 60 ? "#666" : "#999",
                type: "pollution",
              })
            }
          }
        }

        // Particules de nettoyage
        if (solutionImpact > 30 && Math.random() < 0.2) {
          newParticles.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 100,
            y: 85,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -Math.random() * 0.2 - 0.05,
            size: Math.random() * 2 + 1,
            opacity: 0.4,
            color: "#4ade80",
            type: "clean",
          })
        }

        // Particules d'analyse
        if (isAnalyzing) {
          for (let i = 0; i < 3; i++) {
            newParticles.push({
              id: Date.now() + Math.random(),
              x: 50 + (Math.random() - 0.5) * 30,
              y: 50 + (Math.random() - 0.5) * 30,
              vx: (Math.random() - 0.5) * 1,
              vy: (Math.random() - 0.5) * 1,
              size: Math.random() * 4 + 2,
              opacity: 0.8,
              color: "#3b82f6",
              type: "analysis",
            })
          }
        }

        // Mise à jour des positions
        return newParticles.map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          opacity: p.type === "analysis" ? p.opacity - 0.02 : p.opacity - 0.005,
          vy: p.type === "pollution" ? p.vy - 0.001 : p.vy,
        }))
      })
    }, 50)

    return () => clearInterval(interval)
  }, [pollutionLevel, solutions, isAnalyzing, setParticles])
}