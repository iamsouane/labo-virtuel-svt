//src/components/selection/RabbitInfo
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { findAncestors, findDescendants } from "../utils/naturalSelection"
import type { RabbitGenetics } from "../../types/selectionNaturelleTypes"
import { Baby, Bone, Ear, Network, Paintbrush, Rabbit, X } from "lucide-react"

interface RabbitInfoProps {
  rabbit: RabbitGenetics
  allRabbits: RabbitGenetics[]
  onClose: () => void
}

const RabbitInfo = ({ rabbit, allRabbits, onClose }: RabbitInfoProps) => {
  const getGenotypeString = (alleles: [string, string]) => alleles.sort().join("")

  const findParents = () => {
    if (!rabbit.parents) return null
    const parent1 = allRabbits.find((r) => r.id === rabbit.parents![0])
    const parent2 = allRabbits.find((r) => r.id === rabbit.parents![1])
    return { parent1, parent2 }
  }

  const uniqueAncestorsByIdAcrossGenerations = (generations: RabbitGenetics[][]): RabbitGenetics[][] => {
    const seen = new Set<string>()
    return generations.map((generation) => {
      const unique = generation.filter((rabbit) => {
        if (seen.has(rabbit.id)) return false
        seen.add(rabbit.id)
        return true
      })
      return unique
    })
  }

  const parents = findParents()
  const descendants = findDescendants(rabbit.id, allRabbits)
  const ancestors = findAncestors(rabbit, allRabbits, 3)
  const filteredAncestors = uniqueAncestorsByIdAcrossGenerations(ancestors)

  const RabbitMiniCard = ({ rabbit: miniRabbit, relationship }: { rabbit: RabbitGenetics; relationship: string }) => (
    <div className="bg-gray-50 p-2 rounded text-xs">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="40" r="15" fill={miniRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"} stroke="#000" strokeWidth="2" />
            {miniRabbit.earType === "straight" ? (
              <>
                <ellipse cx="40" cy="32" rx="5" ry="10" fill={miniRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"} stroke="#000" strokeWidth="1" transform="rotate(-15 40 32)" />
                <ellipse cx="60" cy="32" rx="5" ry="10" fill={miniRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"} stroke="#000" strokeWidth="1" transform="rotate(15 60 32)" />
              </>
            ) : (
              <>
                <path d="M38 28 Q35 32 37 40 Q39 45 42 42 Q40 38 40 32 Q39 29 38 28 Z" fill={miniRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"} stroke="#000" strokeWidth="1" />
                <path d="M62 28 Q65 32 63 40 Q61 45 58 42 Q60 38 60 32 Q61 29 62 28 Z" fill={miniRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"} stroke="#000" strokeWidth="1" />
              </>
            )}
            <circle cx="47" cy="38" r="1" fill="#000" />
            <circle cx="53" cy="38" r="1" fill="#000" />
            {miniRabbit.toothLength === "long" && (
              <>
                <rect x="48" y="43" width="2" height="6" fill="#FFF" stroke="#000" strokeWidth="0.5" />
                <rect x="50" y="43" width="2" height="6" fill="#FFF" stroke="#000" strokeWidth="0.5" />
              </>
            )}
          </svg>
        </div>
        <div>
          <p className="font-semibold text-blue-600">{miniRabbit.name}</p>
          <p className="text-gray-500">{relationship}</p>
        </div>
      </div>
      <div className="space-y-1">
        <p>Gen: {miniRabbit.generation}</p>
        <p className="flex items-center gap-1">
          <Paintbrush className="w-4 h-4 text-pink-600" />
          {getGenotypeString(miniRabbit.furAlleles)}
        </p>
        <p className="flex items-center gap-1">
          <Ear className="w-4 h-4 text-yellow-600" />
          {getGenotypeString(miniRabbit.earAlleles)}
        </p>
        <p className="flex items-center gap-1">
          <Bone className="w-4 h-4 text-gray-700" />
          {getGenotypeString(miniRabbit.toothAlleles)}
        </p>
      </div>
    </div>
  )

  const DeadParentCard = ({ relationship }: { relationship: string }) => (
    <div className="bg-red-50 p-2 rounded text-xs border-2 border-red-200">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 flex items-center justify-center">
          <div className="text-red-600 text-lg font-bold">✕</div>
        </div>
        <div>
          <p className="font-semibold text-red-600">Décédé</p>
          <p className="text-gray-500">{relationship}</p>
        </div>
      </div>
      <div className="text-center text-red-500 text-xs">Parent décédé</div>
    </div>
  )

  return (
    <Card className="
    fixed
    top-20
    right-4
    w-[min(100%,32rem)]
    max-h-[90vh]
    bg-white
    shadow-lg
    z-50
    flex
    flex-col
    overflow-y-auto
    border
    border-gray-200
    rounded-lg
  ">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Pedigree Complet</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Fermer">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {/* Lapin sélectionné */}
        <div className="text-center border-2 border-blue-300 rounded-lg p-3 bg-blue-50">
          <div className="w-16 h-16 mx-auto mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="40" r="20" fill={rabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"} stroke="#000" strokeWidth="2" />
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
              <circle cx="45" cy="35" r="2" fill="#000" />
              <circle cx="55" cy="35" r="2" fill="#000" />
              {rabbit.toothLength === "long" && (
                <>
                  <rect x="47" y="45" width="3" height="10" fill="#FFF" stroke="#000" strokeWidth="1" />
                  <rect x="50" y="45" width="3" height="10" fill="#FFF" stroke="#000" strokeWidth="1" />
                </>
              )}
            </svg>
          </div>
          <p className="font-bold text-lg text-blue-800">{rabbit.name}</p>
          <p className="text-sm">Génération {rabbit.generation}</p>
          <div className="mt-2 text-xs">
  <p className="flex items-center justify-center gap-4 text-gray-700">
    <span className="flex items-center gap-1">
      <Paintbrush className="w-4 h-4 text-pink-600" />
      {getGenotypeString(rabbit.furAlleles)}
    </span>
    |
    <span className="flex items-center gap-1">
      <Ear className="w-4 h-4 text-yellow-600" />
      {getGenotypeString(rabbit.earAlleles)}
    </span>
    |
    <span className="flex items-center gap-1">
      <Bone className="w-4 h-4 text-gray-700" />
      {getGenotypeString(rabbit.toothAlleles)}
    </span>
  </p>
</div>

        </div>

        {/* Parents directs */}
        {parents && (
          <div className="space-y-2">
           <h4 className="font-semibold text-sm text-purple-700 flex items-center justify-center gap-2">
  <Network className="w-5 h-5" />
  Parents
</h4>       
              <div className="grid grid-cols-2 gap-2">
              {parents.parent1 && parents.parent1.isAlive ? <RabbitMiniCard rabbit={parents.parent1} relationship="Papa" /> : <DeadParentCard relationship="Papa" />}
              {parents.parent2 && parents.parent2.isAlive ? <RabbitMiniCard rabbit={parents.parent2} relationship="Maman" /> : <DeadParentCard relationship="Maman" />}
            </div>
          </div>
        )}

        {/* Ancêtres */}
        {filteredAncestors.length > 1 && (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {filteredAncestors.slice(1).map((generation, genIndex) => (
              <div key={genIndex}>
                <p className="text-xs font-medium text-purple-600 mb-2 sticky top-0 bg-white">
                  {genIndex === 0 ? "Grands-parents" : `Arrière-grands-parents (${genIndex + 2})`}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {generation.map((ancestor) =>
                    ancestor.isAlive ? (
                      <RabbitMiniCard key={ancestor.id} rabbit={ancestor} relationship="Ancêtre" />
                    ) : (
                      <DeadParentCard key={ancestor.id} relationship="Ancêtre" />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Descendants */}
        {descendants.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-green-700 flex items-center justify-center gap-2">
  <Baby className="w-5 h-5" />
  Descendants ({descendants.filter((d) => d.isAlive).length} vivants / {descendants.length} total)
</h4>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2 bg-gray-50">
              {descendants.map((descendant) =>
                descendant.isAlive ? (
                  <RabbitMiniCard key={descendant.id} rabbit={descendant} relationship="Enfant" />
                ) : (
                  <div key={descendant.id} className="bg-red-50 p-2 rounded text-xs border border-red-200">
                    <div className="flex items-center gap-2">
                      <div className="text-red-600">✕</div>
                      <div>
                        <p className="font-semibold text-red-600">{descendant.name}</p>
                        <p className="text-gray-500">Enfant décédé</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Pas de famille */}
        {filteredAncestors.length === 0 && descendants.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
<p className="flex items-center gap-2 text-gray-700">
  <Rabbit className="w-5 h-5 text-green-600" />
  {rabbit.name} est un lapin fondateur
</p>            <p>Pas encore de famille connue</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RabbitInfo