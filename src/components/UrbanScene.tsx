"use client"

import { useEffect, useState } from "react"

interface Solution {
  id: string
  name: string
  icon: string
  active: boolean
  impact: number
}

interface UrbanSceneProps {
  pollutionLevel: number
  activeSolutions: Solution[]
  isAnalyzing: boolean
}

export default function UrbanScene({ pollutionLevel, activeSolutions, isAnalyzing }: UrbanSceneProps) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    setAnimationKey((prev) => prev + 1)
  }, [pollutionLevel, activeSolutions])

  const solutionImpact = activeSolutions.reduce((sum, s) => sum + s.impact, 0)
  const effectivePollution = Math.max(0, pollutionLevel - solutionImpact)

  const getSkyColor = (pollution: number) => {
    if (pollution < 20) return "from-blue-400 to-blue-200"
    if (pollution < 40) return "from-blue-300 to-gray-200"
    if (pollution < 60) return "from-gray-300 to-gray-400"
    if (pollution < 80) return "from-gray-400 to-gray-500"
    return "from-gray-500 to-gray-600"
  }

  const getCloudOpacity = (pollution: number) => {
    return Math.min(0.8, pollution / 100)
  }

  const getTreeHealth = (pollution: number) => {
    if (pollution < 30) return "🌳"
    if (pollution < 60) return "🌲"
    return "🌿"
  }

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg border-4 border-gray-400 bg-gradient-to-b from-blue-100 to-green-100">
      {/* Écran de laboratoire overlay */}
      <div className="absolute inset-0 border-8 border-gray-800 rounded-lg pointer-events-none">
        <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 left-2 text-xs text-gray-600 bg-black bg-opacity-70 text-white px-2 py-1 rounded">
          LIVE FEED
        </div>
      </div>

      {/* Ciel avec pollution */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${getSkyColor(effectivePollution)} transition-all duration-1000`}
      >
        {/* Nuages de pollution */}
        {effectivePollution > 20 && (
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: getCloudOpacity(effectivePollution) }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={`cloud-${i}-${animationKey}`}
                className="absolute bg-gray-600 rounded-full animate-pulse"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${5 + (i % 3) * 10}%`,
                  width: `${20 + i * 5}px`,
                  height: `${15 + i * 3}px`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: "3s",
                }}
              />
            ))}
          </div>
        )}

        {/* Soleil */}
        <div
          className={`absolute top-8 right-8 w-16 h-16 rounded-full transition-all duration-1000 ${
            effectivePollution > 60 ? "bg-orange-300 opacity-30" : "bg-yellow-400 opacity-90"
          }`}
        >
          {effectivePollution < 40 && (
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-6 bg-yellow-400 origin-bottom"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translateX(-50%) translateY(-50%) rotate(${i * 45}deg) translateY(-40px)`,
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Ville polluée (gauche) */}
      <div className="absolute left-0 bottom-0 w-1/2 h-full">
        <div className="absolute bottom-0 w-full h-32 bg-gray-600">
          {/* Bâtiments */}
          <div className="absolute bottom-0 left-4 w-12 h-20 bg-gray-700 border-r-2 border-gray-800">
            <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-400 opacity-60"></div>
            <div className="absolute top-6 left-2 w-2 h-2 bg-yellow-400 opacity-40"></div>
          </div>
          <div className="absolute bottom-0 left-20 w-16 h-24 bg-gray-800 border-r-2 border-gray-900">
            <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-400 opacity-50"></div>
            <div className="absolute top-6 left-6 w-2 h-2 bg-yellow-400 opacity-30"></div>
          </div>

          {/* Usines avec fumée */}
          <div className="absolute bottom-0 right-8 w-20 h-16 bg-red-800">
            <div className="absolute -top-8 left-2 w-3 h-8 bg-gray-700"></div>
            <div className="absolute -top-8 right-2 w-3 h-8 bg-gray-700"></div>
            {effectivePollution > 30 && (
              <>
                <div className="absolute -top-16 left-2 w-6 h-8 bg-gray-500 rounded-t-full opacity-70 animate-pulse"></div>
                <div className="absolute -top-16 right-2 w-6 h-8 bg-gray-600 rounded-t-full opacity-60 animate-pulse"></div>
              </>
            )}
          </div>

          {/* Voitures */}
          <div className="absolute bottom-0 left-8 flex gap-1">
            <div className="w-4 h-2 bg-red-600 rounded"></div>
            <div className="w-4 h-2 bg-blue-600 rounded"></div>
            <div className="w-4 h-2 bg-gray-600 rounded"></div>
          </div>

          {/* Arbres malades */}
          <div className="absolute bottom-16 left-12 text-2xl opacity-60">{getTreeHealth(effectivePollution)}</div>
          <div className="absolute bottom-16 left-24 text-2xl opacity-50">{getTreeHealth(effectivePollution)}</div>
        </div>
      </div>

      {/* Ville écologique (droite) */}
      <div className="absolute right-0 bottom-0 w-1/2 h-full">
        <div className="absolute bottom-0 w-full h-32 bg-green-600">
          {/* Bâtiments verts */}
          <div className="absolute bottom-0 right-4 w-12 h-20 bg-green-700 border-l-2 border-green-800">
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400"></div>
            <div className="absolute top-6 right-2 w-2 h-2 bg-blue-400"></div>
            {/* Panneaux solaires */}
            <div className="absolute -top-2 left-0 right-0 h-2 bg-blue-900"></div>
          </div>
          <div className="absolute bottom-0 right-20 w-16 h-24 bg-green-800 border-l-2 border-green-900">
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400"></div>
            <div className="absolute top-6 right-6 w-2 h-2 bg-blue-400"></div>
            <div className="absolute -top-2 left-0 right-0 h-2 bg-blue-900"></div>
          </div>

          {/* Usine verte */}
          <div className="absolute bottom-0 left-8 w-20 h-16 bg-green-900">
            <div className="absolute -top-4 left-2 w-3 h-4 bg-green-700"></div>
            <div className="absolute -top-4 right-2 w-3 h-4 bg-green-700"></div>
            {/* Vapeur d'eau propre */}
            <div className="absolute -top-8 left-2 w-4 h-6 bg-white rounded-t-full opacity-40 animate-pulse"></div>
          </div>

          {/* Vélos et voitures électriques */}
          <div className="absolute bottom-0 right-8 flex gap-1">
            {activeSolutions.some((s) => s.id === "electric") && <div className="w-4 h-2 bg-green-400 rounded"></div>}
            {activeSolutions.some((s) => s.id === "bike") && <div className="w-2 h-2 bg-blue-400 rounded-full"></div>}
          </div>

          {/* Arbres sains */}
          <div className="absolute bottom-16 right-12 text-2xl">🌳</div>
          <div className="absolute bottom-16 right-24 text-2xl">🌲</div>
          {activeSolutions.some((s) => s.id === "trees") && (
            <>
              <div className="absolute bottom-16 right-32 text-2xl animate-bounce">🌳</div>
              <div className="absolute bottom-20 right-28 text-xl animate-bounce">🌿</div>
            </>
          )}

          {/* Éoliennes */}
          {activeSolutions.some((s) => s.id === "solar") && (
            <div className="absolute bottom-20 left-4 text-3xl animate-spin" style={{ animationDuration: "3s" }}>
              🌀
            </div>
          )}
        </div>
      </div>

      {/* Particules de pollution */}
      {effectivePollution > 40 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(Math.floor(effectivePollution / 10))].map((_, i) => (
            <div
              key={`particle-${i}-${animationKey}`}
              className="absolute w-1 h-1 bg-gray-600 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 80}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Effet d'analyse */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 animate-pulse">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-spin">
            🔬
          </div>
        </div>
      )}

      {/* Légende */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
          <span>Ville polluée</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600 rounded"></div>
          <span>Ville écologique</span>
        </div>
      </div>
    </div>
  )
}