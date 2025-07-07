//src/components/selection/RabbitPreview
import { Bone, Ear, Paintbrush } from "lucide-react"
import type { RabbitGenetics } from "../../types/selectionNaturelleTypes"

interface Props {
  rabbit: RabbitGenetics
  selectedAlleles: {
    fur: [string, string]
    ear: [string, string]
    tooth: [string, string]
  }
  isCompanion: boolean
}

export const RabbitPreview = ({ rabbit, selectedAlleles, isCompanion }: Props) => {
  return (
    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
      <div className="w-24 h-24 mx-auto mb-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Corps */}
          <circle cx="50" cy="40" r="20" fill={rabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"} stroke="#000" strokeWidth="2" />
          {/* Oreilles */}
          {rabbit.earType === "straight" ? (
            <>
              <ellipse cx="35" cy="30" rx="8" ry="15" fill={rabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"} stroke="#000" strokeWidth="2" transform="rotate(-20 35 30)" />
              <ellipse cx="65" cy="30" rx="8" ry="15" fill={rabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"} stroke="#000" strokeWidth="2" transform="rotate(20 65 30)" />
            </>
          ) : (
            <>
              <path d="M32 22 Q28 28 30 38 Q32 45 38 42 Q36 35 35 28 Q34 24 32 22 Z" fill={rabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"} stroke="#000" strokeWidth="2" />
              <path d="M68 22 Q72 28 70 38 Q68 45 62 42 Q64 35 65 28 Q66 24 68 22 Z" fill={rabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"} stroke="#000" strokeWidth="2" />
            </>
          )}
          {/* Yeux */}
          <circle cx="45" cy="35" r="2" fill="#000" />
          <circle cx="55" cy="35" r="2" fill="#000" />
          {/* Dents longues */}
          {rabbit.toothLength === "long" && (
            <>
              <rect x="47" y="45" width="3" height="10" fill="#FFF" stroke="#000" strokeWidth="1" />
              <rect x="50" y="45" width="3" height="10" fill="#FFF" stroke="#000" strokeWidth="1" />
            </>
          )}
        </svg>
      </div>

      <div className="text-center space-y-2 text-sm">
  <p className="font-semibold">{isCompanion ? "Compagnon" : "Premier Lapin"}</p>
  
  <p className="flex items-center justify-center gap-2">
    <Paintbrush className="w-5 h-5 text-pink-600" />
    Fourrure: {rabbit.furColor === "brown" ? "Brune" : "Blanche"} ({selectedAlleles.fur.sort().join("")})
  </p>
  
  <p className="flex items-center justify-center gap-2">
    <Ear className="w-5 h-5 text-yellow-600" />
    Oreilles: {rabbit.earType === "straight" ? "Droites" : "Tombantes"} ({selectedAlleles.ear.sort().join("")})
  </p>
  
  <p className="flex items-center justify-center gap-2">
    <Bone className="w-5 h-5 text-gray-700" />
    Dents: {rabbit.toothLength === "long" ? "Longues" : "Courtes"} ({selectedAlleles.tooth.sort().join("")})
  </p>
</div>
    </div>
  )
}