// src/components/pollution/CarCountControl.tsx
import { Car, Minus, Plus } from "lucide-react"
import { Button } from "../../components/ui/button"
import type { TooltipData } from "../../types/simulationPollutionTypes"

interface CarCountControlProps {
  carCount: number
  setCarCount: (value: number) => void
  setTooltip: (tooltip: TooltipData | null) => void
}

export default function CarCountControl({ carCount, setCarCount, setTooltip }: CarCountControlProps) {
  return (
    <div
      className="transform transition-all duration-300 hover:scale-[1.02]"
      onMouseEnter={(e) =>
        setTooltip({
          title: (
            <span className="flex items-center gap-1">
              <Car size={16} className="text-red-500" />
              Nombre de voitures
            </span>
          ),
          description: "Plus de voitures = plus de pollution atmosphérique",
          x: e.clientX,
          y: e.clientY,
        })
      }
      onMouseLeave={() => setTooltip(null)}
    >

      <div className="max-w-xs mx-auto">
        {/* Titre aligné avec icône */}
        <div className="flex justify-center items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Car size={16} className="text-red-600" />
          <span className="flex items-center gap-1">
            Nombre de voitures :
            <span className="text-blue-700 font-bold">{carCount}</span>
          </span>
        </div>

        {/* Contrôles rapprochés et centrés */}
        <div className="flex items-center justify-center gap-1">
          <Button
            onClick={() => setCarCount(Math.max(0, carCount - 1))}
            disabled={carCount <= 0}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded flex items-center justify-center"
          >
            <Minus size={14} />
          </Button>

          <Button
            onClick={() => setCarCount(Math.min(20, carCount + 1))}
            disabled={carCount >= 20}
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded flex items-center justify-center"
          >
            <Plus size={14} />
          </Button>
        </div>

        {/* Impact */}
        <div className="text-xs text-gray-500 mt-2">
          Impact estimé :
          <span className="font-medium text-red-600"> +{carCount * 32} CO₂ ppm</span>,
          <span className="font-medium text-orange-600"> +{carCount * 12} NOx µg/m³</span>
        </div>
      </div>
    </div>


  )
}