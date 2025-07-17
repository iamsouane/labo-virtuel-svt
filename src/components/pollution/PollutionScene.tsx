//src/components/pollution/PollutionScene
import React from "react"
import AnimatedLabBackground from "./AnimatedLabBackground"
import AnimatedSky from "./AnimatedSky"
import AnimatedRoad from "./AnimatedRoad"
import Buildings from "./Buildings"
import type { PollutionData, AQIStatus, TooltipData, Vehicle, Solution } from "../../types/simulationPollutionTypes"
import { Bike, Bolt, Car, Cloud, Microscope, Sprout, TreePine, Trees, Wind } from "lucide-react"

interface PollutionSceneProps {
  animationTime: number
  effectivePollution: number
  industryCount: number
  vehicles: Vehicle[]
  particles: any[]
  isAnalyzing: boolean
  pollutionData: PollutionData
  aqiStatus: AQIStatus
  solutions: Solution[]
  setTooltip: React.Dispatch<React.SetStateAction<TooltipData | null>>
}

const PollutionScene: React.FC<PollutionSceneProps> = ({
  animationTime,
  effectivePollution,
  industryCount,
  vehicles,
  particles,
  isAnalyzing,
  pollutionData,
  solutions,
  setTooltip,
}) => {
  return (
    <div className="relative w-full h-full">
      <AnimatedLabBackground animationTime={animationTime} />

      {/* Conteneur principal de la simulation */}
      <div className="absolute inset-0 m-4 bg-black rounded-xl border-8 border-gray-800 shadow-2xl overflow-hidden">
        {/* Indicateurs d'état */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full animate-pulse z-10"></div>
        <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping z-10"></div>
        <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-70 px-2 py-1 rounded z-10 animate-pulse">
          SIMULATION LIVE • {new Date().toLocaleTimeString()}
        </div>

        {/* Scène urbaine */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Ciel animé */}
          <AnimatedSky effectivePollution={effectivePollution} animationTime={animationTime} />

          {/* Zone de sol */}
          <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-gray-700 to-gray-600">
            {/* Route animée */}
            <AnimatedRoad animationTime={animationTime} />

            {/* Bâtiments */}
            <Buildings
              animationTime={animationTime}
              setTooltip={setTooltip}
              solutions={solutions}
            />

            {/* Industries */}
            {[...Array(industryCount)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-8 w-20 h-16 bg-red-800 border-l-2 border-red-900 cursor-pointer"
                style={{ right: `${16 + i * 25}%` }}
                onMouseEnter={(e) => setTooltip({
                  title: `🏭 Usine ${i + 1}`,
                  description: solutions.find((s) => s.id === "filter")?.active
                    ? "Équipée de filtres anti-pollution, émissions réduites"
                    : "Source majeure de pollution atmosphérique",
                  x: e.clientX,
                  y: e.clientY,
                })}
                onMouseLeave={() => setTooltip(null)}
              >
                <div className="absolute -top-6 left-2 w-3 h-6 bg-gray-700"></div>
                <div className="absolute -top-6 right-2 w-3 h-6 bg-gray-700"></div>

                {effectivePollution > 30 && !solutions.find((s) => s.id === "filter")?.active && (
                  <>
                    {[...Array(2)].map((_, j) => (
                      <div
                        key={j}
                        className="absolute text-sm opacity-70 animate-pulse cursor-pointer"
                        style={{
                          left: `${25 + j * 30}%`,
                          top: `${-50 - j * 8}%`,
                          transform: `translateX(${Math.sin(animationTime * 0.05 + j + i) * 8}px)`,
                          animationDuration: `${2 + j * 0.3}s`,
                        }}
                      >
                        <Cloud className="w-5 h-5 text-gray-500" />
                      </div>
                    ))}
                  </>
                )}

                {solutions.find((s) => s.id === "filter")?.active && (
                  <div
                    className="absolute text-sm opacity-40 animate-pulse cursor-pointer"
                    style={{
                      left: "35%",
                      top: "-40%",
                      transform: `translateX(${Math.sin(animationTime * 0.03 + i) * 5}px)`,
                      animationDuration: "1.5s",
                    }}
                  >
                    <Wind className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Véhicules */}
            <div className="absolute bottom-0 left-0 w-full h-8">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="absolute bottom-0 transition-all duration-100 cursor-pointer"
                  style={{
                    left: `${vehicle.x}%`,
                    transform: `translateY(-2px) ${vehicle.type === "bike" ? `scale(0.8) rotate(${Math.sin(animationTime * 0.2) * 2}deg)` : ""} scaleX(1)`,
                  }}
                  onMouseEnter={(e) => setTooltip({
                    title: (
                      <span className="flex items-center gap-2">
                        {vehicle.type === "car" && <Car className="w-4 h-4 text-red-500" />}
                        {vehicle.type === "electric" && <Bolt className="w-4 h-4 text-green-500" />}
                        {vehicle.type === "bike" && <Bike className="w-4 h-4 text-blue-500" />}
                        {vehicle.type === "car"
                          ? "Voiture thermique"
                          : vehicle.type === "electric"
                            ? "Voiture électrique"
                            : "Vélo"}
                      </span>
                    ),
                    description:
                      vehicle.type === "car"
                        ? "Émet du CO₂ et des particules fines"
                        : vehicle.type === "electric"
                          ? "Transport propre, zéro émission locale"
                          : "Transport écologique, zéro pollution",
                    x: e.clientX,
                    y: e.clientY,
                  })}

                  onMouseLeave={() => setTooltip(null)}
                >
                  <div className="text-2xl">
                    {vehicle.type === "car" && <Car className="w-6 h-6 text-red-500 transform scale-x-[-1]" />}
                    {vehicle.type === "electric" && <Car className="w-6 h-6 text-green-500 transform scale-x-[-1]" />}
                    {vehicle.type === "bike" && <Bike className="w-6 h-6 text-blue-500 transform scale-x-[-1]" />}
                  </div>
                  {vehicle.type === "car" && effectivePollution > 20 && (
                    <div className="absolute -top-1 right-0 text-xs opacity-60 animate-ping">
                      <Wind className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Arbres */}
            {[
              { x: 72, health: effectivePollution < 30 ? <Trees className="w-6 h-6 text-green-700" /> : effectivePollution < 60 ? <TreePine className="w-6 h-6 text-green-500" /> : <Sprout className="w-6 h-6 text-green-400" /> },
              { x: 80, health: effectivePollution < 30 ? <Trees className="w-6 h-6 text-green-700" /> : effectivePollution < 60 ? <TreePine className="w-6 h-6 text-green-500" /> : <Sprout className="w-6 h-6 text-green-400" /> },
              { x: 88, health: effectivePollution < 30 ? <Trees className="w-6 h-6 text-green-700" /> : effectivePollution < 60 ? <TreePine className="w-6 h-6 text-green-500" /> : <Sprout className="w-6 h-6 text-green-400" /> },
              { x: 94, health: effectivePollution < 30 ? <Trees className="w-6 h-6 text-green-700" /> : effectivePollution < 60 ? <TreePine className="w-6 h-6 text-green-500" /> : <Sprout className="w-6 h-6 text-green-400" /> },
            ].map((tree, i) => (
              <div
                key={i}
                className="absolute bottom-8 text-2xl opacity-60 transition-all duration-1000 cursor-pointer"
                style={{
                  left: `${tree.x}%`,
                  transform: `rotate(${Math.sin(animationTime * 0.05 + i) * 3}deg) scale(${1 + Math.sin(animationTime * 0.03 + i) * 0.1})`,
                  filter: effectivePollution > 60 ? "grayscale(0.5)" : "none",
                }}
                onMouseEnter={(e) => setTooltip({
                  title: (
                    <span className="flex items-center gap-2">
                      {effectivePollution < 30 && <Trees className="w-5 h-5 text-green-700" />}
                      {effectivePollution >= 30 && effectivePollution < 60 && <TreePine className="w-5 h-5 text-yellow-600" />}
                      {effectivePollution >= 60 && <Sprout className="w-5 h-5 text-red-600" />}
                      {effectivePollution < 30 && "Arbre en bonne santé"}
                      {effectivePollution >= 30 && effectivePollution < 60 && "Arbre affaibli"}
                      {effectivePollution >= 60 && "Arbre en détresse"}
                    </span>
                  ),
                  description: effectivePollution < 30 ? "Absorbe efficacement le CO₂ et produit de l'oxygène"
                    : effectivePollution < 60 ? "Capacité d'absorption réduite par la pollution"
                      : "Fortement impacté par la pollution, absorption limitée",
                  x: e.clientX,
                  y: e.clientY,
                })}
                onMouseLeave={() => setTooltip(null)}
              >
                {tree.health}
              </div>
            ))}

            {/* Arbres supplémentaires */}
            {solutions.find((s) => s.id === "trees")?.active && (
              <>
                {[96, 64, 68, 84].map((x, i) => (
                  <div
                    key={`extra-${x}`}
                    className="absolute bottom-8 text-2xl animate-bounce"
                    style={{
                      left: `${x}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: "2s",
                      transform: `scale(${1.2 + Math.sin(animationTime * 0.04 + i) * 0.1})`,
                    }}
                  >
                    {i % 2 === 0 ? (
                      <Trees className="inline-block w-6 h-6 text-primary" />
                    ) : i % 3 === 0 ? (
                      <Trees className="inline-block w-6 h-6 text-primary" />
                    ) : (
                      <Trees className="inline-block w-6 h-6 text-primary" />
                    )}
                  </div>
                ))}
              </>
            )}

            {/* Éolienne */}
            {solutions.find((s) => s.id === "solar")?.active && (
              <div
                className="absolute bottom-8 right-8"
                style={{
                  transform: `rotate(${animationTime * 2}deg)`,
                  filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))",
                }}
              >
                <Wind className="w-10 h-10 text-primary animate-spin-slow" />
              </div>
            )}
          </div>

          {/* Particules */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute rounded-full transition-all duration-100"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  opacity: particle.opacity,
                  boxShadow: particle.type === "analysis" ? `0 0 ${particle.size * 2}px ${particle.color}` : "none",
                }}
              />
            ))}
          </div>

          {/* Effets d'analyse */}
          {isAnalyzing && (
            <div
              className="absolute inset-0 bg-secondary bg-opacity-25 motion-safe:animate-pulse rounded-lg shadow-inner"
              aria-live="polite"
              aria-label="Analyse en cours"
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div
                  className="animate-spin motion-safe:animate-spin"
                  style={{ animationDuration: "1.2s" }}
                  aria-hidden="true"
                >
                  <Microscope className="w-16 h-16 text-secondary drop-shadow-md" />
                </div>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-secondary opacity-70 motion-safe:animate-ping"
                    style={{
                      width: `${(i + 1) * 60}px`,
                      height: `${(i + 1) * 60}px`,
                      animationDelay: `${i * 0.25}s`,
                      animationDuration: "2.5s",
                    }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Indicateurs de qualité d'air */}
          <div className="absolute top-4 right-4 space-y-2">
            {[
              { label: "CO₂", value: pollutionData.co2, color: "#ef4444" },
              { label: "NOx", value: pollutionData.nox, color: "#f97316" },
              { label: "PM2.5", value: pollutionData.pm25, color: "#a855f7" },
            ].map((indicator, i) => (
              <div
                key={indicator.label}
                className="bg-gray-900 bg-opacity-80 text-gray-100 px-3 py-1 rounded-md text-sm font-medium shadow-sm animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  borderLeft: `3px solid ${indicator.color}`,
                }}
              >
                {indicator.label}: {indicator.value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PollutionScene