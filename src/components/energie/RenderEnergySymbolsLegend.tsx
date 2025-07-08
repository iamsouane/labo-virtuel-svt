//src/components/energie/RenderEnergySymbolsLegend
import { Languages } from "lucide-react"
import React from "react"

interface Props {
  showEnergySymbols: boolean
  energySource: "velo" | "soleil"
  selectedDevice: "ampoule" | "ventilateur" | "chauffe-eau"
  DEVICES: Record<
    string,
    {
      energyType: string
    }
  >
}

const RenderEnergySymbolsLegend: React.FC<Props> = ({
  showEnergySymbols,
  energySource,
  selectedDevice,
  DEVICES,
}) => {
  if (!showEnergySymbols) return null

  return (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-lg">
      <h4 className="font-semibold text-gray-800 mb-2 text-sm flex items-center gap-2">
        <Languages className="w-4 h-4 text-gray-600" />
        Symboles d'Énergie
      </h4>
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <span className={energySource === "velo" ? "text-blue-500 font-bold" : "text-yellow-500 font-bold"}>
            E
          </span>
          <span className="text-gray-700">{energySource === "velo" ? "Énergie Mécanique" : "Énergie Solaire"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500 font-bold">E</span>
          <span className="text-gray-700">Énergie Électrique</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`font-bold ${selectedDevice === "ampoule"
                ? "text-yellow-500"
                : selectedDevice === "ventilateur"
                  ? "text-cyan-500"
                  : "text-red-500"
              }`}
          >
            E
          </span>
          <span className="text-gray-700">Énergie {DEVICES[selectedDevice].energyType}</span>
        </div>
      </div>
    </div>
  )
}

export default RenderEnergySymbolsLegend