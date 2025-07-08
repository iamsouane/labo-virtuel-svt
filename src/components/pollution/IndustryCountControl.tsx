// src/components/pollution/IndustryCountControl.tsx
import { Factory, Minus, Plus } from "lucide-react"
import { Button } from "../../components/ui/button"
import type { TooltipData } from "../../types/simulationPollutionTypes"

interface IndustryCountControlProps {
  industryCount: number
  setIndustryCount: (value: number) => void
  setTooltip: (tooltip: TooltipData | null) => void
}

export default function IndustryCountControl({ industryCount, setIndustryCount, setTooltip }: IndustryCountControlProps) {
  return (
    <div
      className="transform transition-all duration-300 hover:scale-[1.02]"
      onMouseEnter={(e) =>
        setTooltip({
          title: (
            <span className="flex items-center gap-1">
              <Factory size={16} className="text-gray-700" />
              Nombre d'industries
            </span>
          ),
          description: "Plus d’industries = plus de pollution atmosphérique",
          x: e.clientX,
          y: e.clientY,
        })
      }
      onMouseLeave={() => setTooltip(null)}
    >
      <div className="max-w-xs mx-auto">
        {/* Titre aligné avec icône */}
        <div className="flex justify-center items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Factory size={16} className="text-gray-700" />
          <span className="flex items-center gap-1">
            Nombre d'industries :
            <span className="text-blue-700 font-bold">{industryCount}</span>
          </span>
        </div>

        {/* Contrôles rapprochés et centrés */}
        <div className="flex items-center justify-center gap-1">
          <Button
            onClick={() => setIndustryCount(Math.max(0, industryCount - 1))}
            disabled={industryCount <= 0}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded flex items-center justify-center"
          >
            <Minus size={14} />
          </Button>

          <Button
            onClick={() => setIndustryCount(industryCount + 1)}
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded flex items-center justify-center"
          >
            <Plus size={14} />
          </Button>
        </div>

        {/* Impact estimé */}
        <div className="text-xs text-gray-500 mt-2">
          Impact estimé :
          <span className="font-medium text-red-600"> +{industryCount * 50} CO₂ ppm</span>,
          <span className="font-medium text-orange-600"> +{industryCount * 20} NOx µg/m³</span>
        </div>
      </div>
    </div>
  )
}
