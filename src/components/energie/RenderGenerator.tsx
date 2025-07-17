// src/components/energie/RenderGenerator.tsx
import { BatteryCharging, Zap } from "lucide-react"
import React from "react"

interface Props {
  generatorType: "panneau-solaire" | "generatrice"
  energyData: {
    electricalPower: number
  }
  position?: number[]
}

const RenderGenerator: React.FC<Props> = ({ generatorType, energyData }) => {
  if (generatorType === "panneau-solaire") {
    return (
      <div className="font-sans absolute left-72 top-1/2 transform -translate-y-1/2 text-dark">
        <div
          className="relative w-16 h-20 bg-primary-dark rounded-lg transition-all duration-500 border-2 border-blue-70y0"
          style={{
            boxShadow: `0 0 ${energyData.electricalPower / 3}px rgba(28, 112, 24, 0.5)`,
          }}
        >
          <div className="absolute inset-1 grid grid-cols-3 gap-0.5">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="rounded-sm transition-all duration-300"
                style={{
                  backgroundColor: `rgba(11, 17, 117, ${0.8 + energyData.electricalPower / 500})`,
                }}
              />
            ))}
          </div>

          {energyData.electricalPower > 20 && (
            <div
              className="absolute top-1 left-1 w-4 h-4 bg-light rounded opacity-30 animate-pulse"
              style={{ animationDuration: "2s" }}
            />
          )}

          {energyData.electricalPower > 5 && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
          )}
        </div>

        <div className="mt-4 text-sm font-medium text-primary text-center">
          <span className="flex items-center justify-center gap-1 relative top-[35px]">
            <BatteryCharging className="w-5 h-5 text-primary relative top-[1px]" />
            <span className="relative top-[1px]">Panneau Solaire</span>
          </span>
          <br />
          <span className="relative top-[35px] text-accent font-semibold">
            {energyData.electricalPower.toFixed(1)}% de puissance
          </span>
        </div>
      </div>
    )
  }

  // Génératrice
  return (
    <div className="font-sans absolute left-72 top-1/2 transform -translate-y-1/2 text-dark">
      <div
        className="relative w-16 h-20 bg-dark rounded-lg transition-all duration-500 border-2 border-primary"
        style={{
          boxShadow: `0 0 ${energyData.electricalPower / 3}px rgba(188, 229, 188, 0.5)`,
        }}
      >
        <div
          className="absolute inset-2"
          style={{ backgroundColor: "#B87333", borderRadius: "4px" }}
        />
        {energyData.electricalPower > 5 && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
        )}
        {energyData.electricalPower > 50 && (
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-secondary rounded-full animate-ping"
                style={{
                  top: `${20 + i * 20}%`,
                  right: "-4px",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </>
        )}
      </div>

      <div className="mt-4 text-sm font-medium text-primary text-center">
        <span className="flex items-center justify-center gap-1 relative top-[35px]">
          <Zap className="w-5 h-5 text-primary relative top-[1px]" />
          <span className="relative top-[1px]">Génératrice</span>
        </span>
        <br />
        <span className="relative top-[35px] text-accent font-semibold">
          {energyData.electricalPower.toFixed(1)}% de puissance
        </span>
      </div>
    </div>
  )
}

export default RenderGenerator
