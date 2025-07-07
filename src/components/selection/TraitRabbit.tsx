//src/components/selection/TraitRabbit
import type { RabbitGenetics } from "../../types/selectionNaturelleTypes"

interface TraitRabbitProps {
  trait: string
}

const TraitRabbit = ({ trait }: TraitRabbitProps) => {
  const getTraitGenetics = (trait: string): RabbitGenetics => {
    const baseGenetics: RabbitGenetics = {
      id: "trait-display",
      name: "TraitRabbit",
      furAlleles: ["b", "b"],
      earAlleles: ["s", "s"],
      toothAlleles: ["l", "l"],
      generation: 0,
      isAlive: true,
      birthGeneration: 0,
      furColor: "white",
      earType: "straight",
      toothLength: "short",
      survivalFactors: { // Ajout des facteurs de survie requis
        speed: 50,
        camouflage: 50,
        chewingEfficiency: 50
      }
    };

    switch (trait) {
      case "Fourrure brune":
        return {
          ...baseGenetics,
          furColor: "brown",
          furAlleles: ["B", "B"],
          survivalFactors: {
            ...baseGenetics.survivalFactors,
            camouflage: 70 // Exemple: meilleur camouflage pour fourrure brune
          }
        };
      case "Fourrure blanche":
        return {
          ...baseGenetics,
          furColor: "white",
          furAlleles: ["b", "b"],
          survivalFactors: {
            ...baseGenetics.survivalFactors,
            camouflage: 30 // Exemple: moins bon camouflage pour fourrure blanche
          }
        };
      case "Oreilles droites":
        return {
          ...baseGenetics,
          earType: "straight",
          earAlleles: ["S", "S"],
          survivalFactors: {
            ...baseGenetics.survivalFactors,
            speed: 60 // Exemple: meilleure détection des prédateurs
          }
        };
      case "Oreilles tombantes":
        return {
          ...baseGenetics,
          earType: "floppy",
          earAlleles: ["s", "s"],
          survivalFactors: {
            ...baseGenetics.survivalFactors,
            speed: 40 // Exemple: moins bonne détection des prédateurs
          }
        };
      case "Dents longues":
        return {
          ...baseGenetics,
          toothLength: "long",
          toothAlleles: ["L", "L"],
          survivalFactors: {
            ...baseGenetics.survivalFactors,
            chewingEfficiency: 80 // Exemple: meilleure mastication
          }
        };
      case "Dents courtes":
        return {
          ...baseGenetics,
          toothLength: "short",
          toothAlleles: ["l", "l"],
          survivalFactors: {
            ...baseGenetics.survivalFactors,
            chewingEfficiency: 20 // Exemple: moins bonne mastication
          }
        };
      default:
        return baseGenetics;
    }
  };

  const genetics = getTraitGenetics(trait)

  return (
    <div className="w-8 h-8 flex-shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Corps */}
        <circle
          cx="50"
          cy="40"
          r="20"
          fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
          stroke="#000"
          strokeWidth="2"
        />
        {/* Oreilles */}
        {genetics.earType === "straight" ? (
          <>
            <ellipse
              cx="35"
              cy="30"
              rx="8"
              ry="15"
              fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
              stroke="#000"
              strokeWidth="2"
              transform="rotate(-20 35 30)"
            />
            <ellipse
              cx="65"
              cy="30"
              rx="8"
              ry="15"
              fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
              stroke="#000"
              strokeWidth="2"
              transform="rotate(20 65 30)"
            />
          </>
        ) : (
          <>
            <path
              d="M32 22 Q28 28 30 38 Q32 45 38 42 Q36 35 35 28 Q34 24 32 22 Z"
              fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
              stroke="#000"
              strokeWidth="2"
            />
            <path
              d="M68 22 Q72 28 70 38 Q68 45 62 42 Q64 35 65 28 Q66 24 68 22 Z"
              fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
              stroke="#000"
              strokeWidth="2"
            />
          </>
        )}
        {/* Yeux */}
        <circle cx="45" cy="35" r="2" fill="#000" />
        <circle cx="55" cy="35" r="2" fill="#000" />
        {/* Dents longues */}
        {genetics.toothLength === "long" && (
          <>
            <rect x="47" y="45" width="3" height="10" fill="#FFF" stroke="#000" strokeWidth="1" />
            <rect x="50" y="45" width="3" height="10" fill="#FFF" stroke="#000" strokeWidth="1" />
          </>
        )}
      </svg>
    </div>
  )
}

export default TraitRabbit