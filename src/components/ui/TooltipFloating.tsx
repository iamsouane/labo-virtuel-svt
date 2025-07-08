// src/components/ui/TooltipFloating.tsx
import type { TooltipData } from "../../types/simulationPollutionTypes"

interface TooltipFloatingProps {
  tooltip: TooltipData | null
}

export default function TooltipFloating({ tooltip }: TooltipFloatingProps) {
  if (!tooltip) return null

  return (
    <div
      className="fixed z-50 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none"
      style={{
        left: tooltip.x + 10,
        top: tooltip.y - 10,
        maxWidth: "250px",
      }}
    >
      <div className="font-semibold flex items-center gap-1">{tooltip.title}</div>
      <div className="text-xs opacity-90">{tooltip.description}</div>
    </div>
  )
}