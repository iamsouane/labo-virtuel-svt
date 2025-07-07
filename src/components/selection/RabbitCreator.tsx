// src/components/selection/RabbitCreator.tsx
import { useEffect, useState } from "react"
import type { RabbitGenetics } from "../../types/selectionNaturelleTypes"
import { determineTraitFromAlleles, generateRabbitName, createRandomRabbit } from "../utils/naturalSelection"
import { Button } from "../../components/ui/button"
import { AlleleSelector } from "./AlleleSelector"
import { RabbitPreview } from "./RabbitPreview"
import { GeneticReminder } from "./GeneticReminder"
import { Bone, Ear, Paintbrush, AlertCircle } from "lucide-react"
import { notifyError } from "../../lib/notifications"

interface RabbitCreatorProps {
  onCreateRabbit: (rabbit: RabbitGenetics) => void
  isCompanion: boolean
  canCreate: boolean
}

const RabbitCreator = ({ onCreateRabbit, isCompanion, canCreate }: RabbitCreatorProps) => {
  const [selectedAlleles, setSelectedAlleles] = useState({
    fur: ["B", "B"] as [string, string],
    ear: ["S", "S"] as [string, string],
    tooth: ["L", "L"] as [string, string],
  })

  const [previewRabbit, setPreviewRabbit] = useState<RabbitGenetics | null>(null)

  useEffect(() => {
    const preview: RabbitGenetics = {
      id: "preview",
      name: isCompanion ? "Compagnon" : "Premier Lapin",
      furColor: determineTraitFromAlleles(selectedAlleles.fur, "fur") as "brown" | "white",
      earType: determineTraitFromAlleles(selectedAlleles.ear, "ear") as "straight" | "floppy",
      toothLength: determineTraitFromAlleles(selectedAlleles.tooth, "tooth") as "long" | "short",
      furAlleles: selectedAlleles.fur,
      earAlleles: selectedAlleles.ear,
      toothAlleles: selectedAlleles.tooth,
      generation: 0,
      isAlive: true,
      birthGeneration: 0,
      survivalFactors: {
        speed: 0.5,
        camouflage: 0.5,
        chewingEfficiency: 0.5
      }
    }
    setPreviewRabbit(preview)
  }, [selectedAlleles, isCompanion])

  const handleAlleleChange = (trait: "fur" | "ear" | "tooth", position: 0 | 1, allele: string) => {
    setSelectedAlleles((prev) => ({
      ...prev,
      [trait]: position === 0 ? [allele, prev[trait][1]] : [prev[trait][0], allele],
    }))
  }

  const createRabbit = () => {
    if (!previewRabbit) return
    if (!canCreate) {
      notifyError("Impossible de créer un nouveau lapin : génération maximale atteinte.")
      return
    }
    const newRabbit = createRandomRabbit(0, 0)
    newRabbit.furAlleles = selectedAlleles.fur
    newRabbit.earAlleles = selectedAlleles.ear
    newRabbit.toothAlleles = selectedAlleles.tooth
    newRabbit.furColor = previewRabbit.furColor
    newRabbit.earType = previewRabbit.earType
    newRabbit.toothLength = previewRabbit.toothLength
    newRabbit.name = generateRabbitName()
    onCreateRabbit(newRabbit)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sélecteurs */}
      <div className="space-y-4">
        <h3 className="font-semibold">Sélection des Allèles</h3>

        <AlleleSelector
          trait="fur"
          traitName={
            <span className="flex items-center gap-2 text-gray-800">
              <Paintbrush className="w-4 h-4 text-pink-600" />
              Couleur de Fourrure
            </span>
          }
          dominantAllele="B"
          recessiveAllele="b"
          dominantTrait="brun"
          recessiveTrait="blanc"
          selected={selectedAlleles.fur}
          onChange={handleAlleleChange}
          preview={previewRabbit}
        />

        <AlleleSelector
          trait="ear"
          traitName={
            <span className="flex items-center gap-2 text-gray-800">
              <Ear className="w-4 h-4 text-yellow-600" />
              Type d'Oreilles
            </span>
          }
          dominantAllele="S"
          recessiveAllele="s"
          dominantTrait="droites"
          recessiveTrait="tombantes"
          selected={selectedAlleles.ear}
          onChange={handleAlleleChange}
          preview={previewRabbit}
        />

        <AlleleSelector
          trait="tooth"
          traitName={
            <span className="flex items-center gap-2 text-gray-800">
              <Bone className="w-4 h-4 text-gray-700" />
              Longueur des Dents
            </span>
          }
          dominantAllele="L"
          recessiveAllele="l"
          dominantTrait="longues"
          recessiveTrait="courtes"
          selected={selectedAlleles.tooth}
          onChange={handleAlleleChange}
          preview={previewRabbit}
        />

        <Button 
          onClick={createRabbit} 
          className="w-full mt-4"
          disabled={!canCreate}
          title={!canCreate ? "Génération maximale atteinte, impossible de créer un nouveau lapin" : undefined}
        >
          {isCompanion ? "Créer le Compagnon" : "Créer un compagnon"}
        </Button>

        {!canCreate && (
          <div className="text-sm text-red-600 mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            <span>Génération maximale atteinte</span>
          </div>
        )}
      </div>

      {/* Prévisualisation + explication */}
      <div className="space-y-4">
        <h3 className="font-semibold">Prévisualisation</h3>
        {previewRabbit && <RabbitPreview rabbit={previewRabbit} selectedAlleles={selectedAlleles} isCompanion={isCompanion} />}
        <GeneticReminder />
      </div>
    </div>
  )
}

export default RabbitCreator