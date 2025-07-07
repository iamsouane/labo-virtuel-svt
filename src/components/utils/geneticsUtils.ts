// src/components/utils/simulation/geneticsUtils.ts

import type { RabbitGenetics, GenerationExplanation } from "../../types/selectionNaturelleTypes"

// Détermination des traits à partir des allèles
export function determineTraitFromAlleles(
  alleles: [string, string],
  trait: "fur"
): "brown" | "white"
export function determineTraitFromAlleles(
  alleles: [string, string],
  trait: "ear"
): "straight" | "floppy"
export function determineTraitFromAlleles(
  alleles: [string, string],
  trait: "tooth"
): "long" | "short"
export function determineTraitFromAlleles(
  alleles: [string, string],
  trait: "fur" | "ear" | "tooth"
): "brown" | "white" | "straight" | "floppy" | "long" | "short" {
  const [a1, a2] = alleles
  switch (trait) {
    case "fur":
      return a1 === "B" || a2 === "B" ? "brown" : "white"
    case "ear":
      return a1 === "S" || a2 === "S" ? "straight" : "floppy"
    case "tooth":
      return a1 === "L" || a2 === "L" ? "long" : "short"
    default:
      throw new Error("Invalid trait type")
  }
}

// Génération de noms aléatoires
export const generateRabbitName = (): string => {
  const names = [
    "Caramel", "Flocon", "Luna", "Simba", "Zoe", "Oscar",
    "Tulipe", "Coco", "Chloe", "Soleil", "Miel", "Ziggy",
  ]
  return names[Math.floor(Math.random() * names.length)]
}

const generateSurvivalFactors = (): RabbitGenetics["survivalFactors"] => ({
  speed: Math.floor(Math.random() * 101),
  camouflage: Math.floor(Math.random() * 101),
  chewingEfficiency: Math.floor(Math.random() * 101),
})


// Fonction de reproduction
export const breedRabbits = (
  parent1: RabbitGenetics,
  parent2: RabbitGenetics,
  currentGeneration: number
): RabbitGenetics[] => {
  const offspring: RabbitGenetics[] = []
  const numOffspring = Math.floor(Math.random() * 6) + 8

  for (let i = 0; i < numOffspring; i++) {
    const furAlleles: [string, string] = [
      parent1.furAlleles[Math.floor(Math.random() * 2)],
      parent2.furAlleles[Math.floor(Math.random() * 2)],
    ]
    const earAlleles: [string, string] = [
      parent1.earAlleles[Math.floor(Math.random() * 2)],
      parent2.earAlleles[Math.floor(Math.random() * 2)],
    ]
    const toothAlleles: [string, string] = [
      parent1.toothAlleles[Math.floor(Math.random() * 2)],
      parent2.toothAlleles[Math.floor(Math.random() * 2)],
    ]

    offspring.push({
      id: `rabbit-${Date.now()}-${Math.random()}-${i}`,
      name: generateRabbitName(),
      furColor: determineTraitFromAlleles(furAlleles, "fur"),
      earType: determineTraitFromAlleles(earAlleles, "ear"),
      toothLength: determineTraitFromAlleles(toothAlleles, "tooth"),
      furAlleles,
      earAlleles,
      toothAlleles,
      parents: [parent1.id, parent2.id],
      generation: Math.max(parent1.generation, parent2.generation) + 1,
      isAlive: true,
      birthGeneration: currentGeneration,
      survivalFactors: generateSurvivalFactors(),
    })
  }

  return offspring
}

// Fonction d'explication des traits
export const explainTraitInheritance = (
  parent1: RabbitGenetics,
  parent2: RabbitGenetics,
  offspring: RabbitGenetics[]
): GenerationExplanation => {
  const furCounts = { brown: 0, white: 0 }
  const earCounts = { straight: 0, floppy: 0 }
  const toothCounts = { long: 0, short: 0 }

  offspring.forEach((o) => {
    furCounts[o.furColor]++
    earCounts[o.earType]++
    toothCounts[o.toothLength]++
  })

  return {
    generation: offspring[0]?.generation || 1,
    parentInfo: { parent1, parent2 },
    offspringCount: offspring.length,

    // ✅ Ici on retourne des objets de type TraitExplanation
    traitExplanations: {
      fur: {
        alleles: [...parent1.furAlleles, ...parent2.furAlleles].slice(0, 2) as [string, string],
        phenotype: `${furCounts.brown} bruns, ${furCounts.white} blancs.`,
      },
      ear: {
        alleles: [...parent1.earAlleles, ...parent2.earAlleles].slice(0, 2) as [string, string],
        phenotype: `${earCounts.straight} droites, ${earCounts.floppy} tombantes.`,
      },
      tooth: {
        alleles: [...parent1.toothAlleles, ...parent2.toothAlleles].slice(0, 2) as [string, string],
        phenotype: `${toothCounts.long} longues, ${toothCounts.short} courtes.`,
      },
    },

    environmentalEffects: [],
    selectionPressures: [],
  }
}