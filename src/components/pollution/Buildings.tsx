//src/components/pollution/Buildings
import React from "react"
import { Building2, Landmark, Home, Sun } from "lucide-react";
import type { TooltipData, Solution } from "../../types/simulationPollutionTypes";

interface BuildingsProps {
  animationTime: number
  setTooltip: React.Dispatch<React.SetStateAction<TooltipData | null>>
  solutions: Solution[]
}

export default function Buildings({ animationTime, setTooltip, solutions }: BuildingsProps) {
  const buildings = [
    {
      x: 8,
      w: 16,
      h: 24,
      lights: [
        [2, 2],
        [2, 6],
        [2, 10],
      ],
      tooltip: {
        title: (
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-white" />
            Bâtiment résidentiel
          </span>
        ),
        description: "Consomme de l'énergie, peut être équipé de panneaux solaires",
      },
    },
    {
      x: 28,
      w: 20,
      h: 32,
      lights: [
        [2, 2],
        [6, 6],
        [2, 10],
      ],
      tooltip: {
        title: (
          <span className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-white" />
            Immeuble de bureaux
          </span>
        ),
        description: "Grande consommation énergétique, potentiel pour l'efficacité énergétique",
      },
    },
    {
      x: 52,
      w: 14,
      h: 20,
      lights: [
        [2, 2],
        [2, 6],
      ],
      tooltip: {
        title: (
          <span className="flex items-center gap-2">
            <Home className="w-4 h-4 text-white" />
            Petit bâtiment
          </span>
        ),
        description: "Habitat individuel, impact environnemental modéré",
      },
    },
  ]

  return (
    <>
      {buildings.map((building, i) => (
        <div
          key={i}
          className="absolute bottom-8 cursor-pointer"
          style={{ left: `${building.x}%`, width: `${building.w}%`, height: `${building.h}%` }}
          onMouseEnter={(e) =>
            setTooltip({
              title: building.tooltip.title,
              description: building.tooltip.description,
              x: e.clientX,
              y: e.clientY,
            })
          }
          onMouseLeave={() => setTooltip(null)}
        >
          <div className="w-full h-full bg-gray-600 border-r-2 border-gray-700 relative">
            {building.lights.map((light, j) => (
              <div
                key={j}
                className="absolute w-2 h-2 bg-yellow-400 transition-all duration-1000"
                style={{
                  left: `${light[0]}%`,
                  top: `${light[1]}%`,
                  opacity: 0.3 + Math.sin(animationTime * 0.1 + i + j) * 0.3,
                }}
              />
            ))}

            {/* Panneaux solaires si solution active */}
            {solutions.find((s) => s.id === "solar")?.active && (
              <div
                className="absolute -top-2 left-0 right-0 h-2 bg-blue-900 animate-pulse cursor-pointer"
                style={{
                  boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                }}
                onMouseEnter={(e) =>
                  setTooltip({
                    title: (
                      <span className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-yellow-300" />
                        Panneaux solaires
                      </span>
                    ),
                    description: "Génèrent de l'énergie propre, réduisent les émissions de CO₂",
                    x: e.clientX,
                    y: e.clientY,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
              />
            )}
          </div>
        </div>
      ))}
    </>
  )
}