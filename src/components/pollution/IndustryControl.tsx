// src/components/pollution/IndustryControl.tsx
import React from "react";
import {Button} from "../../components/ui/button";

interface IndustryControlProps {
  industryCount: number;
  setIndustryCount: React.Dispatch<React.SetStateAction<number>>;
  setTooltip: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      x: number;
      y: number;
    } | null>
  >;
  pollutionSource: string;
}

export default function IndustryControl({
  industryCount,
  setIndustryCount,
  setTooltip,
  pollutionSource,
}: IndustryControlProps) {
  if (pollutionSource !== "industrie") return null;

  return (
    <div
      className="transform transition-all duration-300 hover:scale-105"
      onMouseEnter={(e) =>
        setTooltip({
          title: "🏭 Nombre d'industries",
          description: "Plus d'industries = plus de pollution industrielle",
          x: e.clientX,
          y: e.clientY,
        })
      }
      onMouseLeave={() => setTooltip(null)}
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">
        🏭 Nombre d'industries: {industryCount}
      </label>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setIndustryCount(Math.max(0, industryCount - 1))}
          disabled={industryCount <= 0}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
        >
          -
        </Button>
        <div className="flex-1 text-center">
          <div className="bg-gray-50 p-2 rounded border border-gray-200">
            <span className="text-lg font-bold text-gray-700">{industryCount}</span>
          </div>
        </div>
        <Button
          onClick={() => setIndustryCount(Math.min(10, industryCount + 1))}
          disabled={industryCount >= 10}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm"
        >
          +
        </Button>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Impact: +{industryCount * 85} CO₂ ppm, +{industryCount * 35} NOx µg/m³
      </div>
    </div>
  );
}