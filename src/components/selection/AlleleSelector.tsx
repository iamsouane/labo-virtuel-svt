//src/components/selection/AlleleSelector
import type { RabbitGenetics } from "../../types/selectionNaturelleTypes"

interface Props {
  trait: "fur" | "ear" | "tooth"
  traitName: React.ReactNode;
  dominantAllele: string
  recessiveAllele: string
  dominantTrait: string
  recessiveTrait: string
  selected: [string, string]
  onChange: (trait: "fur" | "ear" | "tooth", position: 0 | 1, allele: string) => void
  preview: RabbitGenetics | null
}

export const AlleleSelector = ({
  trait,
  traitName,
  dominantAllele,
  recessiveAllele,
  dominantTrait,
  recessiveTrait,
  selected,
  onChange,
  preview,
}: Props) => (
  <div className="space-y-2">
    <h4 className="font-semibold text-sm">{traitName}</h4>
    <div className="grid grid-cols-2 gap-2">
      {[0, 1].map((pos) => (
        <div key={pos}>
          <label className="text-xs text-gray-600">Allèle {pos + 1}</label>
          <select
            value={selected[pos]}
            onChange={(e) => onChange(trait, pos as 0 | 1, e.target.value)}
            className="w-full p-1 border rounded text-sm"
          >
            <option value={dominantAllele}>
              {dominantAllele} (dominant - {dominantTrait})
            </option>
            <option value={recessiveAllele}>
              {recessiveAllele} (récessif - {recessiveTrait})
            </option>
          </select>
        </div>
      ))}
    </div>
    <div className="text-xs text-gray-500">
      Génotype: {selected.sort().join("")} → Phénotype:{" "}
      {trait === "fur"
        ? preview?.furColor === "brown"
          ? "Brun"
          : "Blanc"
        : trait === "ear"
        ? preview?.earType === "straight"
          ? "Droites"
          : "Tombantes"
        : preview?.toothLength === "long"
        ? "Longues"
        : "Courtes"}
    </div>
  </div>
)