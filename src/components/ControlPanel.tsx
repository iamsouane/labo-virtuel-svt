"use client"

import type React from "react"

// Composant Button inline
const Button = ({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
  >
    {children}
  </button>
)

interface PollutionData {
  level: number
  source: string
  co2: number
  nox: number
  pm25: number
  aqi: number
}

interface ControlPanelProps {
  pollutionData: PollutionData
  setPollutionData: (data: PollutionData | ((prev: PollutionData) => PollutionData)) => void
  onAnalyze: () => void
  isAnalyzing: boolean
}

export default function ControlPanel({ pollutionData, setPollutionData, onAnalyze, isAnalyzing }: ControlPanelProps) {
  const sources = [
    { value: "voiture", label: "🚗 Voiture thermique", color: "text-red-600" },
    { value: "industrie", label: "🏭 Industrie", color: "text-gray-600" },
    { value: "agriculture", label: "🚜 Agriculture", color: "text-green-600" },
    { value: "chauffage", label: "🏠 Chauffage domestique", color: "text-orange-600" },
  ]

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPollutionData((prev) => ({ ...prev, level: Number.parseInt(e.target.value) }))
  }

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPollutionData((prev) => ({ ...prev, source: e.target.value }))
  }

  return (
    <div className="space-y-6">
      {/* Slider niveau de pollution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          🌫️ Niveau de pollution: {pollutionData.level}%
        </label>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={pollutionData.level}
            onChange={handleLevelChange}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #f59e0b ${pollutionData.level / 2}%, #ef4444 ${pollutionData.level}%, #e5e7eb ${pollutionData.level}%, #e5e7eb 100%)`,
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  height: 24px;
                  width: 24px;
                  border-radius: 50%;
                  background: #3b82f6;
                  cursor: pointer;
                  border: 3px solid #ffffff;
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                }
                input[type="range"]::-moz-range-thumb {
                  height: 24px;
                  width: 24px;
                  border-radius: 50%;
                  background: #3b82f6;
                  cursor: pointer;
                  border: 3px solid #ffffff;
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                }
              `,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Propre</span>
          <span>Modéré</span>
          <span>Très pollué</span>
        </div>
      </div>

      {/* Source de pollution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">🏭 Source de pollution</label>
        <select
          value={pollutionData.source}
          onChange={handleSourceChange}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {sources.map((source) => (
            <option key={source.value} value={source.value}>
              {source.label}
            </option>
          ))}
        </select>
      </div>

      {/* Informations sur la source sélectionnée */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">
          {sources.find((s) => s.value === pollutionData.source)?.label}
        </h4>
        <p className="text-sm text-blue-700">
          {pollutionData.source === "voiture" &&
            "Les véhicules thermiques émettent du CO₂, NOx et des particules fines."}
          {pollutionData.source === "industrie" &&
            "Les usines rejettent de grandes quantités de polluants atmosphériques."}
          {pollutionData.source === "agriculture" && "L'agriculture intensive produit de l'ammoniac et des particules."}
          {pollutionData.source === "chauffage" && "Le chauffage domestique émet des particules fines et du CO₂."}
        </p>
      </div>

      {/* Bouton d'analyse */}
      <Button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
          isAnalyzing ? "bg-yellow-500 hover:bg-yellow-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isAnalyzing ? (
          <>
            <span className="animate-spin mr-2">🔄</span>
            Analyse en cours...
          </>
        ) : (
          <>🔬 Analyser l'air</>
        )}
      </Button>

      {isAnalyzing && (
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <span className="animate-bounce">⚗️</span>
            <span className="text-sm">Mesure des particules en cours...</span>
          </div>
        </div>
      )}
    </div>
  )
}