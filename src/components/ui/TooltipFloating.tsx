// src/components/ui/TooltipFloating.tsx
import type { TooltipData } from "../../types/simulationPollutionTypes";

interface TooltipFloatingProps {
  tooltip: TooltipData | null;
}

export default function TooltipFloating({ tooltip }: TooltipFloatingProps) {
  if (!tooltip) return null;

  return (
    <div
      className="fixed z-50 bg-primary text-light text-sm px-4 py-2 rounded-xl shadow-lg pointer-events-none font-sans max-w-xs"
      style={{
        left: tooltip.x + 10,
        top: tooltip.y - 10,
      }}
      role="tooltip"
      aria-live="polite"
    >
      <div className="font-semibold flex items-center gap-1 mb-1">{tooltip.title}</div>
      <div className="text-xs opacity-90">{tooltip.description}</div>
    </div>
  );
}