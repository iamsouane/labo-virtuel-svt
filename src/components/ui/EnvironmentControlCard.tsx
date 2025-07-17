// src/components/ui/EnvironmentControlCard.tsx
import React from "react"

interface EnvironmentControlCardProps {
  label: React.ReactNode
  value: number
  unit: string
  min: number
  max: number
  color: string
  optimalRange: [number, number]
  showAdvanced: boolean
  onChange: (newValue: number) => void
  tutorialId?: string
}

const EnvironmentControlCard = ({
  label,
  value,
  unit,
  min,
  max,
  color,
  optimalRange,
  showAdvanced,
  onChange,
  tutorialId,
}: EnvironmentControlCardProps) => {
  const [optMin, optMax] = optimalRange
  const isOptimal = value >= optMin && value <= optMax

  return (
    <div
      className="bg-white p-5 rounded-2xl shadow border border-gray-100"
      data-tutorial={tutorialId}
    >
      {/* Label + Valeur */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          {label}
        </div>
        <div className="flex items-baseline gap-1 text-sm font-medium text-gray-800">
          <span>{value}</span>
          <span className="text-xs">{unit}</span>
          <div
            className={`w-3 h-3 rounded-full ml-2 ${
              isOptimal ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-3 rounded-lg appearance-none cursor-pointer bg-${color}-200`}
      />

      {/* Plage optimale */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{min}{unit}</span>
        <span className="text-green-600 font-medium">
          Optimal : {optMin}-{optMax}{unit}
        </span>
        <span>{max}{unit}</span>
      </div>

      {/* Contrôles avancés */}
      {showAdvanced && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onChange(Math.max(min, value - 5))}
            className="px-3 py-1 text-xs rounded-xl bg-gray-200 hover:bg-gray-300 transition shadow"
          >
            -5
          </button>
          <button
            onClick={() => onChange(Math.min(max, value + 5))}
            className="px-3 py-1 text-xs rounded-xl bg-gray-200 hover:bg-gray-300 transition shadow"
          >
            +5
          </button>
          <button
            onClick={() => onChange(Math.floor((optMin + optMax) / 2))}
            className="px-3 py-1 text-xs rounded-xl bg-gradient-to-r from-green-400 to-green-500 text-white hover:to-green-600 transition shadow"
          >
            Optimal
          </button>
        </div>
      )}
    </div>
  )
}

export default EnvironmentControlCard