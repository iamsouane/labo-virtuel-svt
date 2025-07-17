// src/utils/naturalSelection.ts
import type { RabbitGenetics, GenerationExplanation } from "../../types/selectionNaturelleTypes"

export function determineTraitFromAlleles<T extends "fur" | "ear" | "tooth">(
  alleles: [string, string],
  trait: T
): T extends "fur"
  ? "brown" | "white"
  : T extends "ear"
  ? "straight" | "floppy"
  : "long" | "short" {
  const [a1, a2] = alleles

  switch (trait) {
    case "fur":
      return (a1 === "B" || a2 === "B" ? "brown" : "white") as any
    case "ear":
      return (a1 === "S" || a2 === "S" ? "straight" : "floppy") as any
    case "tooth":
      return (a1 === "L" || a2 === "L" ? "long" : "short") as any
    default:
      throw new Error("Invalid trait")
  }
}

export const generateRabbitName = (): string => {
const names = [
  "Caramel", "Flocon", "Luna", "Simba", "Zoe", "Oscar", "Tulipe", "Coco", "Chloe", "Soleil", "Miel", "Ziggy",
  "Nina", "Biscuit", "Plume", "Noisette", "Étoile", "Moka", "Perle", "Néo", "Roxy", "Gaufrette", "Saphir", "Pepper",
  "Nala", "Poppy", "Mimosa", "Jazz", "Kiki", "Cookie", "Vénus", "Calypso", "Pistache", "Olive", "Pépite", "Gizmo",
  "Lolly", "Bambi", "Snickers", "Nina", "Panda", "Chiffon", "Fleur", "Misty", "Jasmine", "Bounty", "Nino", "Dune",
  "Câline", "Bulle", "Violette", "Raven", "Peluche", "Cactus", "Sushi", "Tango", "Nico", "Zelda", "Mango", "Tinker",
  "Pixie", "Holly", "Sushi", "Litchi", "Banjo", "Zazie", "Echo", "Basilic", "Roux", "Mousse", "Foxy", "Pip",
  "Bijou", "Nicolette", "Sirius", "Aloha", "Blossom", "Tulip", "Yuki", "Mimic", "Karma"
]
  return names[Math.floor(Math.random() * names.length)]
}

export const createRandomRabbit = (
  generation = 0,
  birthGeneration = 0
): RabbitGenetics => {
  const furAlleles: [string, string] = [Math.random() > 0.5 ? "B" : "b", Math.random() > 0.5 ? "B" : "b"]
  const earAlleles: [string, string] = [Math.random() > 0.5 ? "S" : "s", Math.random() > 0.5 ? "S" : "s"]
  const toothAlleles: [string, string] = [Math.random() > 0.5 ? "L" : "l", Math.random() > 0.5 ? "L" : "l"]

  return {
    id: `rabbit-${Date.now()}-${Math.random()}`,
    name: generateRabbitName(),
    furColor: determineTraitFromAlleles(furAlleles, "fur"),
    earType: determineTraitFromAlleles(earAlleles, "ear"),
    toothLength: determineTraitFromAlleles(toothAlleles, "tooth"),
    furAlleles,
    earAlleles,
    toothAlleles,
    generation,
    isAlive: true,
    birthGeneration,
    survivalFactors: {
      speed: Math.random() * 100,
      camouflage: Math.random() * 100,
      chewingEfficiency: Math.random() * 100
    }
  }
}

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
      survivalFactors: {
        speed: Math.random() * 100,
        camouflage: Math.random() * 100,
        chewingEfficiency: Math.random() * 100
      }
    })
  }

  return offspring
}

export const findDescendants = (
  rabbitId: string,
  allRabbits: RabbitGenetics[]
): RabbitGenetics[] =>
  allRabbits.filter(
    (r) => r.parents && (r.parents[0] === rabbitId || r.parents[1] === rabbitId)
  )


export const findAncestors = (
  rabbit: RabbitGenetics,
  allRabbits: RabbitGenetics[],
  maxGenerations = 3
): RabbitGenetics[][] => {
  const ancestors: RabbitGenetics[][] = []
  let current = [rabbit]

  for (let gen = 0; gen < maxGenerations; gen++) {
    const next: RabbitGenetics[] = []
    for (const r of current) {
      if (r.parents) {
        const p1 = allRabbits.find((a) => a.id === r.parents![0])
        const p2 = allRabbits.find((a) => a.id === r.parents![1])
        if (p1) next.push(p1)
        if (p2) next.push(p2)
      }
    }
    if (!next.length) break
    ancestors.push(next)
    current = next
  }

  return ancestors
}

export const explainTraitInheritance = (
  parent1: RabbitGenetics,
  parent2: RabbitGenetics,
  offspring: RabbitGenetics[]
): GenerationExplanation => {
  const format = (alleles: [string, string]) => alleles.sort() as [string, string]

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
    traitExplanations: {
      fur: {
        alleles: format(parent1.furAlleles),
        phenotype: `${furCounts.brown} bruns, ${furCounts.white} blancs`,
        advantage: undefined, // ou une phrase si tu veux
      },
      ear: {
        alleles: format(parent1.earAlleles),
        phenotype: `${earCounts.straight} droites, ${earCounts.floppy} tombantes`,
        advantage: undefined,
      },
      tooth: {
        alleles: format(parent1.toothAlleles),
        phenotype: `${toothCounts.long} longues, ${toothCounts.short} courtes`,
        advantage: undefined,
      },
    },
    environmentalEffects: [],
    selectionPressures: [],
  }
}
