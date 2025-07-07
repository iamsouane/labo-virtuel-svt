//src/components/energie/RenderEnergySource
import { Bike } from "lucide-react"
import React from "react"

interface EnergyData {
  pedalingIntensity: number
  solarIntensity: number
  isActive: boolean
}

interface Props {
  energySource: "velo" | "soleil"
  energyData: EnergyData
  pedalRotation: number
  position?: number[]
}

const RenderEnergySource: React.FC<Props> = ({ energySource, energyData, pedalRotation }) => {
  if (energySource === "velo") {
    return (
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
        {/* Cycliste */}
        <div className="relative">
          <div className="w-8 h-8 bg-pink-300 rounded-full mb-2 mx-auto" />
          <div className="w-6 h-12 bg-blue-400 rounded mx-auto mb-2" />
          <div className="absolute top-8 -left-2 w-8 h-2 bg-pink-300 rounded transform -rotate-12" />
          <div className="absolute top-8 -right-2 w-8 h-2 bg-pink-300 rounded transform rotate-12" />
          <div
            className="absolute top-16 left-1 w-2 h-8 bg-blue-600 rounded origin-top transition-transform duration-100"
            style={{
              transform: `rotate(${Math.sin((pedalRotation * Math.PI) / 180) * 20}deg)`,
            }}
          />
          <div
            className="absolute top-16 right-1 w-2 h-8 bg-blue-600 rounded origin-top transition-transform duration-100"
            style={{
              transform: `rotate(${Math.sin(((pedalRotation + 180) * Math.PI) / 180) * 20}deg)`,
            }}
          />
        </div>

        {/* Vélo d'appartement */}
        <div className="relative mt-4">
          <div className="w-20 h-12 border-4 border-gray-600 rounded-lg" />
          <div className="absolute -top-2 left-2 w-8 h-3 bg-black rounded" />
          <div className="absolute -top-4 right-2 w-8 h-2 bg-gray-600 rounded" />
          <div
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-gray-700 rounded-full transition-transform duration-100"
            style={{ transform: `translateX(-50%) rotate(${pedalRotation}deg)` }}
          >
            <div className="absolute top-1/2 left-0 w-2 h-1 bg-gray-800 transform -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-2 h-1 bg-gray-800 transform -translate-y-1/2" />
          </div>
        </div>

        <div className="mt-4 text-sm font-medium text-gray-700">
          <span className="flex items-center gap-1">
            <Bike className="w-5 h-5 text-blue-600" />
            Cycliste
          </span>
          <br />
          <span className="text-blue-600">{energyData.pedalingIntensity}% d'effort</span>
        </div>
      </div>
    )
  }

  // Soleil
  return (
    <div className="absolute left-8 top-16">
      <div className="relative">
        <div
          className="w-20 h-20 bg-yellow-400 rounded-full transition-all duration-500 relative"
          style={{
            boxShadow: `0 0 ${energyData.solarIntensity / 2}px rgba(255, 255, 0, 0.8)`,
            filter: `brightness(${1 + energyData.solarIntensity / 200})`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl">😊</div>
          </div>
        </div>

        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-yellow-400 origin-bottom transition-all duration-500"
            style={{
              width: "3px",
              height: `${15 + energyData.solarIntensity / 8}px`,
              left: "50%",
              top: "50%",
              transform: `translateX(-50%) translateY(-50%) rotate(${i * 30}deg) translateY(-${40 + energyData.solarIntensity / 10}px)`,
              opacity: energyData.solarIntensity / 100,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}

        {energyData.isActive && energyData.solarIntensity > 30 && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={`ray-${i}`}
                className="absolute w-1 bg-yellow-300 origin-bottom animate-pulse"
                style={{
                  height: `${20 + energyData.solarIntensity / 6}px`,
                  left: "50%",
                  top: "50%",
                  transform: `translateX(-50%) translateY(-50%) rotate(${i * 60 + 15}deg) translateY(-${50 + energyData.solarIntensity / 8}px)`,
                  opacity: energyData.solarIntensity / 150,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.5s",
                }}
              />
            ))}
          </>
        )}
      </div>

      <div className="mt-4 text-sm font-medium text-gray-700 text-center">
        ☀️ Soleil
        <br />
        <span className="text-yellow-600">{energyData.solarIntensity}% d'intensité</span>
      </div>
    </div>
  )
}

export default RenderEnergySource