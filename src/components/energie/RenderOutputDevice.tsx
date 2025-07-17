// src/components/energie/RenderOutputDevice.tsx
import React from "react"

interface Props {
  selectedDevice: "ampoule" | "ventilateur" | "chauffe-eau"
  energyData: {
    outputPower: number
  }
  fanRotation: number
  position?: number[]
}

const RenderOutputDevice: React.FC<Props> = ({ selectedDevice, energyData, fanRotation }) => {
  const intensity = energyData.outputPower

  switch (selectedDevice) {
    case "ampoule":
      return (
        <div className="relative font-sans text-dark">
          {/* Halo lumineux */}
          {intensity > 5 && (
            <div
              className="absolute -inset-8 rounded-full bg-yellow-300 animate-pulse transition-all duration-500"
              style={{
                opacity: intensity / 200,
                transform: `scale(${1 + intensity / 200})`,
              }}
            />
          )}
          {/* Ampoule */}
          <div
            className="relative w-16 h-20 rounded-full border-2 border-accent transition-all duration-500"
            style={{
              backgroundColor: `rgba(255, 255, ${100 + intensity}, ${0.3 + intensity / 150})`,
              boxShadow: `0 0 ${intensity}px rgba(255, 255, 0, 0.8)`,
            }}
          >
            {/* Filament */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full transition-all duration-300"
              style={{
                backgroundColor: `rgba(255, ${200 + intensity / 2}, 0, ${intensity / 100})`,
              }}
            />
            {/* Culot */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-secondary rounded-b-lg" />
          </div>
          {/* Rayons */}
          {intensity > 20 && (
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 bg-accent origin-bottom animate-pulse transition-all duration-500"
                  style={{
                    height: `${15 + intensity / 8}px`,
                    left: "50%",
                    bottom: "50%",
                    transform: `translateX(-50%) rotate(${i * 45}deg)`,
                    opacity: intensity / 150,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </>
          )}
        </div>
      )

    case "ventilateur":
      return (
        <div className="relative font-sans text-dark">
          <div className="w-4 h-12 bg-primary mx-auto rounded-b-lg" />
          <div className="w-8 h-8 bg-primary-dark rounded-full mx-auto -mt-2 relative z-10" />
          <div
            className="absolute top-4 left-1/2 transform transition-all duration-100"
            style={{
              transform: `translateX(-50%) rotate(${fanRotation}deg)`,
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-16 h-2 bg-accent rounded-full origin-left transition-all duration-300"
                style={{
                  transform: `rotate(${i * 120}deg)`,
                  opacity: 0.8 + intensity / 500,
                }}
              />
            ))}
          </div>
          {intensity > 30 && (
            <div className="absolute -right-8 top-8 flex flex-col gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-0.5 bg-secondary rounded animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    opacity: intensity / 150,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )

    case "chauffe-eau":
      return (
        <div className="relative font-sans text-dark">
          <div
            className="w-12 h-20 rounded-lg border-2 border-accent transition-all duration-500"
            style={{
              backgroundColor: `rgb(${Math.min(255, 100 + intensity * 1.5)}, ${Math.max(
                100,
                255 - intensity * 1.5,
              )}, ${Math.max(100, 255 - intensity * 2)})`,
            }}
          >
            <div
              className="absolute bottom-2 left-1 right-1 bg-primary rounded transition-all duration-500"
              style={{
                height: `${(intensity / 100) * 70}%`,
                opacity: intensity / 100,
              }}
            />
            <div className="absolute -right-6 top-2 w-2 h-16 bg-accent rounded-full">
              <div
                className="absolute bottom-0 w-full bg-primary rounded-full transition-all duration-500"
                style={{ height: `${intensity}%` }}
              />
            </div>
          </div>
          {intensity > 60 && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-accent rounded-full animate-bounce opacity-60"
                  style={{
                    left: `${i * 8 - 8}px`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: "1.5s",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )

    default:
      return null
  }
}

export default RenderOutputDevice