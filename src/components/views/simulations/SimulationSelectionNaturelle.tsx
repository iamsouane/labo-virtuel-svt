"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Checkbox } from "../../ui/checkbox"
import { LineChart, Line, XAxis, YAxis } from "recharts"
import { motion } from "framer-motion"
import GuideTutorielSelection from "../../GuideTutorielSelection"
import QuizzSelection from "../../QuizzSelection"
import { HelpCircle, BookOpenCheck } from "lucide-react"

// Types avec génétique mendélienne
export type RabbitGenetics = {
  id: string
  name: string
  furColor: "brown" | "white"
  earType: "straight" | "floppy"
  toothLength: "long" | "short"
  // Allèles pour la génétique (dominant/récessif)
  furAlleles: [string, string] // ["B", "b"] où B=brun dominant, b=blanc récessif
  earAlleles: [string, string] // ["S", "s"] où S=droit dominant, s=tombant récessif
  toothAlleles: [string, string] // ["L", "l"] où L=long dominant, l=court récessif
  // Pedigree
  parents?: [string, string] // IDs des parents
  generation: number
  isAlive: boolean
  birthGeneration: number // Génération où le lapin est né
}

export type EnvironmentalFactors = {
  wolvesPresent: boolean
  foodHardness: boolean
  foodScarcity: boolean
}

export type GenerationStats = {
  totalPopulation: number
  traitFrequencies: Record<string, number>
  generationNumber: number
}

export type StatsDataPoint = {
  generation: number
  population: number
}

export type GenerationExplanation = {
  generation: number
  parentInfo: {
    parent1: RabbitGenetics
    parent2: RabbitGenetics
  }
  offspringCount: number
  traitExplanations: {
    fur: string
    ear: string
    tooth: string
  }
  environmentalEffects: string[]
}

// Fonctions génétiques
const determineTraitFromAlleles = (alleles: [string, string], trait: "fur" | "ear" | "tooth") => {
  const [allele1, allele2] = alleles

  switch (trait) {
    case "fur":
      // B (brun) dominant sur b (blanc)
      return allele1 === "B" || allele2 === "B" ? "brown" : "white"
    case "ear":
      // S (droit) dominant sur s (tombant)
      return allele1 === "S" || allele2 === "S" ? "straight" : "floppy"
    case "tooth":
      // L (long) dominant sur l (court)
      return allele1 === "L" || allele2 === "L" ? "long" : "short"
    default:
      return "white"
  }
}

const generateRabbitName = (): string => {
  const names = [
    "Caramel",
    "Noisette",
    "Flocon",
    "Cannelle",
    "Miel",
    "Cacao",
    "Vanille",
    "Praline",
    "Biscuit",
    "Cookie",
    "Truffe",
    "Amande",
    "Pistache",
    "Réglisse",
    "Sucre",
    "Coco",
    "Pépite",
    "Chocolat",
    "Marron",
    "Blanc",
    "Gris",
    "Roux",
    "Doré",
    "Argenté",
    "Luna",
    "Stella",
    "Nova",
    "Orion",
    "Cosmos",
    "Soleil",
    "Étoile",
    "Comète",
    "Jasmin",
    "Rose",
    "Lilas",
    "Violette",
    "Marguerite",
    "Tulipe",
    "Iris",
    "Pivoine",
    "Max",
    "Leo",
    "Charlie",
    "Oscar",
    "Felix",
    "Milo",
    "Simba",
    "Ziggy",
    "Bella",
    "Luna",
    "Chloe",
    "Zoe",
    "Mia",
    "Emma",
    "Sophie",
    "Lola",
  ]
  return names[Math.floor(Math.random() * names.length)]
}

const createRandomRabbit = (generation = 0, birthGeneration = 0): RabbitGenetics => {
  // Générer des allèles aléatoires
  const furAlleles: [string, string] = [Math.random() > 0.5 ? "B" : "b", Math.random() > 0.5 ? "B" : "b"]
  const earAlleles: [string, string] = [Math.random() > 0.5 ? "S" : "s", Math.random() > 0.5 ? "S" : "s"]
  const toothAlleles: [string, string] = [Math.random() > 0.5 ? "L" : "l", Math.random() > 0.5 ? "L" : "l"]

  return {
    id: `rabbit-${Date.now()}-${Math.random()}`,
    name: generateRabbitName(),
    furColor: determineTraitFromAlleles(furAlleles, "fur") as "brown" | "white",
    earType: determineTraitFromAlleles(earAlleles, "ear") as "straight" | "floppy",
    toothLength: determineTraitFromAlleles(toothAlleles, "tooth") as "long" | "short",
    furAlleles,
    earAlleles,
    toothAlleles,
    generation,
    isAlive: true,
    birthGeneration,
  }
}

const breedRabbits = (
  parent1: RabbitGenetics,
  parent2: RabbitGenetics,
  currentGeneration: number,
): RabbitGenetics[] => {
  const offspring: RabbitGenetics[] = []
  const numOffspring = Math.floor(Math.random() * 6) + 8 // 8-13 descendants

  for (let i = 0; i < numOffspring; i++) {
    // Chaque parent donne un allèle aléatoire pour chaque trait
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

    const child: RabbitGenetics = {
      id: `rabbit-${Date.now()}-${Math.random()}-${i}`,
      name: generateRabbitName(),
      furColor: determineTraitFromAlleles(furAlleles, "fur") as "brown" | "white",
      earType: determineTraitFromAlleles(earAlleles, "ear") as "straight" | "floppy",
      toothLength: determineTraitFromAlleles(toothAlleles, "tooth") as "long" | "short",
      furAlleles,
      earAlleles,
      toothAlleles,
      parents: [parent1.id, parent2.id],
      generation: Math.max(parent1.generation, parent2.generation) + 1,
      isAlive: true,
      birthGeneration: currentGeneration,
    }

    offspring.push(child)
  }

  return offspring
}

const findDescendants = (rabbitId: string, allRabbits: RabbitGenetics[]): RabbitGenetics[] => {
  return allRabbits.filter(
    (rabbit) => rabbit.parents && (rabbit.parents[0] === rabbitId || rabbit.parents[1] === rabbitId),
  )
}

const findAncestors = (
  rabbit: RabbitGenetics,
  allRabbits: RabbitGenetics[],
  maxGenerations = 3,
): RabbitGenetics[][] => {
  const ancestors: RabbitGenetics[][] = []
  let currentGeneration = [rabbit]

  for (let gen = 0; gen < maxGenerations; gen++) {
    const nextGeneration: RabbitGenetics[] = []

    for (const currentRabbit of currentGeneration) {
      if (currentRabbit.parents) {
        const parent1 = allRabbits.find((r) => r.id === currentRabbit.parents![0])
        const parent2 = allRabbits.find((r) => r.id === currentRabbit.parents![1])
        if (parent1) nextGeneration.push(parent1)
        if (parent2) nextGeneration.push(parent2)
      }
    }

    if (nextGeneration.length === 0) break
    ancestors.push(nextGeneration)
    currentGeneration = nextGeneration
  }

  return ancestors
}

const explainTraitInheritance = (
  parent1: RabbitGenetics,
  parent2: RabbitGenetics,
  offspring: RabbitGenetics[],
): GenerationExplanation => {
  const getGenotypeString = (alleles: [string, string]) => alleles.sort().join("")

  // Analyser les traits de fourrure
  const furCounts = { brown: 0, white: 0 }
  offspring.forEach((child) => furCounts[child.furColor]++)

  // Ajouter les noms des parents dans l'explication
  const furExplanation = `${parent1.name} (${getGenotypeString(parent1.furAlleles)}) × ${parent2.name} (${getGenotypeString(parent2.furAlleles)}) → ${furCounts.brown} bruns, ${furCounts.white} blancs. ${parent1.furAlleles.includes("B") || parent2.furAlleles.includes("B") ? "Le brun (B) domine le blanc (b)." : "Deux parents blancs (bb) donnent uniquement des descendants blancs."}`

  // Analyser les traits d'oreilles
  const earCounts = { straight: 0, floppy: 0 }
  offspring.forEach((child) => earCounts[child.earType]++)

  const earExplanation = `${parent1.name} (${getGenotypeString(parent1.earAlleles)}) × ${parent2.name} (${getGenotypeString(parent2.earAlleles)}) → ${earCounts.straight} droites, ${earCounts.floppy} tombantes. ${parent1.earAlleles.includes("S") || parent2.earAlleles.includes("S") ? "Les oreilles droites (S) dominent les tombantes (s)." : "Deux parents à oreilles tombantes (ss) donnent uniquement des descendants à oreilles tombantes."}`

  // Analyser les traits de dents
  const toothCounts = { long: 0, short: 0 }
  offspring.forEach((child) => toothCounts[child.toothLength]++)

  const toothExplanation = `${parent1.name} (${getGenotypeString(parent1.toothAlleles)}) × ${parent2.name} (${getGenotypeString(parent2.toothAlleles)}) → ${toothCounts.long} longues, ${toothCounts.short} courtes. ${parent1.toothAlleles.includes("L") || parent2.toothAlleles.includes("L") ? "Les dents longues (L) dominent les courtes (l)." : "Deux parents à dents courtes (ll) donnent uniquement des descendants à dents courtes."}`

  return {
    generation: offspring[0]?.generation || 1,
    parentInfo: { parent1, parent2 },
    offspringCount: offspring.length,
    traitExplanations: {
      fur: furExplanation,
      ear: earExplanation,
      tooth: toothExplanation,
    },
    environmentalEffects: [],
  }
}

// Simulation Utils
const applyPredation = (population: RabbitGenetics[]): { survivors: RabbitGenetics[]; dead: RabbitGenetics[] } => {
  const survivors: RabbitGenetics[] = []
  const dead: RabbitGenetics[] = []

  population.forEach((rabbit) => {
    if (Math.random() > 0.8) {
      survivors.push(rabbit)
    } else {
      dead.push({ ...rabbit, isAlive: false })
    }
  })

  return { survivors, dead }
}

const applyEnvironmentalPressure = (
  population: RabbitGenetics[],
  environment: EnvironmentalFactors,
): { survivors: RabbitGenetics[]; dead: RabbitGenetics[] } => {
  const survivors: RabbitGenetics[] = []
  const dead: RabbitGenetics[] = []

  population.forEach((rabbit) => {
    let survives = true

    if (environment.foodHardness && rabbit.toothLength === "short") {
      survives = false
    } else if (environment.foodScarcity && Math.random() > 0.5) {
      survives = false
    }

    if (survives) {
      survivors.push(rabbit)
    } else {
      dead.push({ ...rabbit, isAlive: false })
    }
  })

  return { survivors, dead }
}

export const simulationSelectionNaturelle = (
  allLivingRabbits: RabbitGenetics[],
  environment: EnvironmentalFactors,
  currentGeneration: number,
): { newLivingRabbits: RabbitGenetics[]; explanation?: GenerationExplanation; newDeadRabbits: RabbitGenetics[] } => {
  // Trouver les parents reproducteurs (au moins 2 lapins vivants)
  const reproductiveRabbits = allLivingRabbits.filter((r) => r.isAlive)

  if (reproductiveRabbits.length < 2) {
    return { newLivingRabbits: allLivingRabbits, newDeadRabbits: [] }
  }

  // Si on a exactement 2 lapins reproducteurs, on les fait se reproduire
  let offspring: RabbitGenetics[] = []
  let explanation: GenerationExplanation | undefined

  if (reproductiveRabbits.length === 2) {
    offspring = breedRabbits(reproductiveRabbits[0], reproductiveRabbits[1], currentGeneration)
    explanation = explainTraitInheritance(reproductiveRabbits[0], reproductiveRabbits[1], offspring)
  } else {
    // Reproduction aléatoire entre survivants
    for (let i = 0; i < reproductiveRabbits.length; i += 2) {
      const parent1 = reproductiveRabbits[i]
      const parent2 =
        reproductiveRabbits[i + 1] || reproductiveRabbits[Math.floor(Math.random() * reproductiveRabbits.length)]
      const children = breedRabbits(parent1, parent2, currentGeneration)
      offspring.push(...children.slice(0, 2)) // Limiter à 2 enfants par couple
    }
  }

  // Appliquer les pressions environnementales sur la descendance
  const environmentalEffects: string[] = []
  const allNewDeadRabbits: RabbitGenetics[] = []

  if (environment.wolvesPresent) {
    const beforePredation = offspring.length
    const predationResult = applyPredation(offspring)
    offspring = predationResult.survivors
    allNewDeadRabbits.push(...predationResult.dead)
    environmentalEffects.push(`Prédation par les loups: ${beforePredation - offspring.length} lapins éliminés`)
  }

  if (environment.foodHardness || environment.foodScarcity) {
    const beforeEnvironment = offspring.length
    const environmentResult = applyEnvironmentalPressure(offspring, environment)
    offspring = environmentResult.survivors
    allNewDeadRabbits.push(...environmentResult.dead)

    if (environment.foodHardness) {
      const hardFoodDeaths = environmentResult.dead.filter((r) => r.toothLength === "short").length
      if (hardFoodDeaths > 0) {
        environmentalEffects.push(`Nourriture dure: ${hardFoodDeaths} lapins à dents courtes éliminés`)
      }
    }

    if (environment.foodScarcity) {
      const scarcityDeaths = beforeEnvironment - offspring.length
      if (scarcityDeaths > 0) {
        environmentalEffects.push(`Pénurie alimentaire: ${scarcityDeaths} lapins éliminés par la compétition`)
      }
    }
  }

  if (explanation) {
    explanation.environmentalEffects = environmentalEffects
  }

  // Vieillissement naturel - les lapins très âgés peuvent mourir
  const agingResult = applyAging(allLivingRabbits, currentGeneration)
  const survivingOldRabbits = agingResult.survivors
  allNewDeadRabbits.push(...agingResult.dead)

  // Combiner tous les lapins vivants
  const newLivingRabbits = [...survivingOldRabbits, ...offspring]

  return { newLivingRabbits, explanation, newDeadRabbits: allNewDeadRabbits }
}

const applyAging = (
  population: RabbitGenetics[],
  currentGeneration: number,
): { survivors: RabbitGenetics[]; dead: RabbitGenetics[] } => {
  const survivors: RabbitGenetics[] = []
  const dead: RabbitGenetics[] = []

  population.forEach((rabbit) => {
    const age = currentGeneration - rabbit.birthGeneration
    let deathChance = 0

    // Chance de mort augmente avec l'âge
    if (age >= 4)
      deathChance = 0.8 // Très vieux
    else if (age >= 3)
      deathChance = 0.4 // Vieux
    else if (age >= 2) deathChance = 0.1 // Adulte

    if (Math.random() < deathChance) {
      dead.push({ ...rabbit, isAlive: false })
    } else {
      survivors.push(rabbit)
    }
  })

  return { survivors, dead }
}

export const updateStatistics = (population: RabbitGenetics[]): GenerationStats => {
  const livingRabbits = population.filter((r) => r.isAlive)
  const traitFrequencies = livingRabbits.reduce(
    (acc, rabbit) => {
      // Couleur de fourrure
      const furColorFr = rabbit.furColor === "brown" ? "Fourrure brune" : "Fourrure blanche"
      acc[furColorFr] = (acc[furColorFr] || 0) + 1

      // Type d'oreilles
      const earTypeFr = rabbit.earType === "straight" ? "Oreilles droites" : "Oreilles tombantes"
      acc[earTypeFr] = (acc[earTypeFr] || 0) + 1

      // Longueur des dents
      const toothLengthFr = rabbit.toothLength === "long" ? "Dents longues" : "Dents courtes"
      acc[toothLengthFr] = (acc[toothLengthFr] || 0) + 1

      return acc
    },
    {} as Record<string, number>,
  )

  return {
    totalPopulation: livingRabbits.length,
    traitFrequencies,
    generationNumber: Math.floor(Math.random() * 100),
  }
}

// Components
interface RabbitProps {
  genetics: RabbitGenetics
  initialPosition?: { x: number; y: number }
  index: number
  isSelected: boolean
  onSelect: () => void
}

const Rabbit = ({ genetics, initialPosition, index, isSelected, onSelect }: RabbitProps) => {
  const getInitialPosition = () => {
    if (initialPosition) return initialPosition

    const angle = (index * 2.4) % (2 * Math.PI)
    const radius = 15 + Math.floor(index / 8) * 8
    const centerX = 50
    const centerY = 50

    return {
      x: Math.max(5, Math.min(95, centerX + Math.cos(angle) * radius)),
      y: Math.max(5, Math.min(95, centerY + Math.sin(angle) * radius)),
    }
  }

  const [position, setPosition] = useState(getInitialPosition())

  const getRandomPosition = () => ({
    x: Math.random() * 90 + 5,
    y: Math.random() * 90 + 5,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(getRandomPosition())
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getGenerationColor = (generation: number) => {
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316"]
    return colors[generation % colors.length]
  }

  return (
    <motion.div
      className={`absolute w-10 h-10 cursor-pointer ${isSelected ? "ring-4 ring-yellow-400 ring-opacity-75" : ""}`}
      animate={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      style={{
        transform: "translate(-50%, -50%)",
      }}
      onClick={onSelect}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Corps du lapin */}
        <circle
          cx="50"
          cy="40"
          r="18"
          fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
          stroke={isSelected ? "#FCD34D" : getGenerationColor(genetics.generation)}
          strokeWidth={isSelected ? "4" : "2"}
        />
        {/* Oreilles */}
        {genetics.earType === "straight" ? (
          <>
            <ellipse
              cx="35"
              cy="30"
              rx="7"
              ry="13"
              fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
              stroke={isSelected ? "#FCD34D" : getGenerationColor(genetics.generation)}
              strokeWidth={isSelected ? "3" : "2"}
              transform="rotate(-20 35 30)"
            />
            <ellipse
              cx="65"
              cy="30"
              rx="7"
              ry="13"
              fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
              stroke={isSelected ? "#FCD34D" : getGenerationColor(genetics.generation)}
              strokeWidth={isSelected ? "3" : "2"}
              transform="rotate(20 65 30)"
            />
          </>
        ) : (
          <>
            <path
              d="M32 22 Q28 28 30 38 Q32 45 38 42 Q36 35 35 28 Q34 24 32 22 Z"
              fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
              stroke={isSelected ? "#FCD34D" : getGenerationColor(genetics.generation)}
              strokeWidth={isSelected ? "3" : "2"}
            />
            <path
              d="M68 22 Q72 28 70 38 Q68 45 62 42 Q64 35 65 28 Q66 24 68 22 Z"
              fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
              stroke={isSelected ? "#FCD34D" : getGenerationColor(genetics.generation)}
              strokeWidth={isSelected ? "3" : "2"}
            />
          </>
        )}
        {/* Yeux */}
        <circle cx="45" cy="35" r="2" fill="#000" />
        <circle cx="55" cy="35" r="2" fill="#000" />
        {/* Dents longues */}
        {genetics.toothLength === "long" && (
          <>
            <rect x="47" y="45" width="3" height="8" fill="#FFF" stroke="#000" strokeWidth="0.5" />
            <rect x="50" y="45" width="3" height="8" fill="#FFF" stroke="#000" strokeWidth="0.5" />
          </>
        )}
        {/* Génération */}
        <text
          x="50"
          y="75"
          textAnchor="middle"
          fontSize="8"
          fill={getGenerationColor(genetics.generation)}
          fontWeight="bold"
        >
          G{genetics.generation}
        </text>
      </svg>
    </motion.div>
  )
}

// Composant pour afficher les informations d'un lapin sélectionné
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
            <circle
              cx="50"
              cy="40"
              r="15"
              fill={miniRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
              stroke="#000"
              strokeWidth="2"
            />
            {miniRabbit.earType === "straight" ? (
              <>
                <ellipse
                  cx="40"
                  cy="32"
                  rx="5"
                  ry="10"
                  fill={miniRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                  stroke="#000"
                  strokeWidth="1"
                  transform="rotate(-15 40 32)"
                />
                <ellipse
                  cx="60"
                  cy="32"
                  rx="5"
                  ry="10"
                  fill={miniRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                  stroke="#000"
                  strokeWidth="1"
                  transform="rotate(15 60 32)"
                />
              </>
            ) : (
              <>
                <path
                  d="M38 28 Q35 32 37 40 Q39 45 42 42 Q40 38 40 32 Q39 29 38 28 Z"
                  fill={miniRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                  stroke="#000"
                  strokeWidth="1"
                />
                <path
                  d="M62 28 Q65 32 63 40 Q61 45 58 42 Q60 38 60 32 Q61 29 62 28 Z"
                  fill={miniRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                  stroke="#000"
                  strokeWidth="1"
                />
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
        <p>🎨 {getGenotypeString(miniRabbit.furAlleles)}</p>
        <p>👂 {getGenotypeString(miniRabbit.earAlleles)}</p>
        <p>🦷 {getGenotypeString(miniRabbit.toothAlleles)}</p>
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
    <Card className="fixed top-4 right-4 w-[min(100%,32rem)] bg-white shadow-lg z-50 flex flex-col max-h-[90vh] overflow-y-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Pedigree Complet</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {/* Lapin sélectionné */}
        <div className="text-center border-2 border-blue-300 rounded-lg p-3 bg-blue-50">
          <div className="w-16 h-16 mx-auto mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="40"
                r="20"
                fill={rabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                stroke="#000"
                strokeWidth="2"
              />
              {rabbit.earType === "straight" ? (
                <>
                  <ellipse
                    cx="35"
                    cy="30"
                    rx="8"
                    ry="15"
                    fill={rabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                    stroke="#000"
                    strokeWidth="2"
                    transform="rotate(-20 35 30)"
                  />
                  <ellipse
                    cx="65"
                    cy="30"
                    rx="8"
                    ry="15"
                    fill={rabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                    stroke="#000"
                    strokeWidth="2"
                    transform="rotate(20 65 30)"
                  />
                </>
              ) : (
                <>
                  <path
                    d="M32 22 Q28 28 30 38 Q32 45 38 42 Q36 35 35 28 Q34 24 32 22 Z"
                    fill={rabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  <path
                    d="M68 22 Q72 28 70 38 Q68 45 62 42 Q64 35 65 28 Q66 24 68 22 Z"
                    fill={rabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                    stroke="#000"
                    strokeWidth="2"
                  />
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
            <p>
              🎨 {getGenotypeString(rabbit.furAlleles)} | 👂 {getGenotypeString(rabbit.earAlleles)} | 🦷{" "}
              {getGenotypeString(rabbit.toothAlleles)}
            </p>
          </div>
        </div>

        {/* Parents directs */}
        {parents && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-purple-700">👨‍👩‍👧‍👦 Parents</h4>
            <div className="grid grid-cols-2 gap-2">
              {parents.parent1 && parents.parent1.isAlive ? (
                <RabbitMiniCard rabbit={parents.parent1} relationship="Papa" />
              ) : (
                <DeadParentCard relationship="Papa" />
              )}
              {parents.parent2 && parents.parent2.isAlive ? (
                <RabbitMiniCard rabbit={parents.parent2} relationship="Maman" />
              ) : (
                <DeadParentCard relationship="Maman" />
              )}
            </div>
          </div>
        )}

        {/* Ancêtres sans doublons */}
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
            <h4 className="font-semibold text-sm text-green-700">
              👶 Descendants ({descendants.filter((d) => d.isAlive).length} vivants / {descendants.length} total)
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

        {/* Message si pas de famille */}
        {filteredAncestors.length === 0 && descendants.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            <p>🌱 {rabbit.name} est un lapin fondateur</p>
            <p>Pas encore de famille connue</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Composant pour afficher un petit lapin représentatif d'un trait
interface TraitRabbitProps {
  trait: string
}

const TraitRabbit = ({ trait }: TraitRabbitProps) => {
  const getTraitGenetics = (trait: string): RabbitGenetics => {
    const baseGenetics = {
      id: "trait-display",
      name: "TraitRabbit",
      furAlleles: ["b", "b"] as [string, string],
      earAlleles: ["s", "s"] as [string, string],
      toothAlleles: ["l", "l"] as [string, string],
      generation: 0,
      isAlive: true,
      birthGeneration: 0,
    }

    switch (trait) {
  case "Fourrure brune":
    return {
      ...baseGenetics,
      furColor: "brown",
      earType: "straight",
      toothLength: "short",
      furAlleles: ["B", "B"],
    }
  case "Fourrure blanche":
    return {
      ...baseGenetics,
      furColor: "white",
      earType: "straight",
      toothLength: "short",
      furAlleles: ["b", "b"],
    }
  case "Oreilles droites":
    return {
      ...baseGenetics,
      furColor: "white",
      earType: "straight",
      toothLength: "short",
      earAlleles: ["S", "S"],
    }
  case "Oreilles tombantes":
    return {
      ...baseGenetics,
      furColor: "white",
      earType: "floppy",
      toothLength: "short",
      earAlleles: ["s", "s"],
    }
  case "Dents longues":
    return {
      ...baseGenetics,
      furColor: "white",
      earType: "straight",
      toothLength: "long",
      toothAlleles: ["L", "L"],
    }
  case "Dents courtes":
    return {
      ...baseGenetics,
      furColor: "white",
      earType: "straight",
      toothLength: "short",
      toothAlleles: ["l", "l"],
    }
  default:
    return {
      ...baseGenetics,
      furColor: "white",
      earType: "straight",
      toothLength: "short",
    }
}

  }

  const genetics = getTraitGenetics(trait)

  return (
    <div className="w-8 h-8 flex-shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Corps du lapin */}
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
          // Oreilles droites
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
          // Oreilles tombantes
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
        {/* Dents (si longues) */}
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

const Wolf = () => {
  return (
    <motion.div
      className="absolute w-16 h-16"
      style={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
      animate={{
        left: ["50%", "80%", "20%", "70%", "30%", "60%", "50%"],
        top: ["50%", "80%", "20%", "70%", "30%", "60%", "50%"],
      }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 12, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Corps du loup */}
        <ellipse cx="50" cy="60" rx="25" ry="15" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        {/* Tête */}
        <circle cx="50" cy="35" r="18" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        {/* Museau */}
        <ellipse cx="50" cy="45" rx="8" ry="6" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        {/* Oreilles */}
        <polygon points="35,25 40,15 45,25" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        <polygon points="55,25 60,15 65,25" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        {/* Yeux */}
        <circle cx="45" cy="30" r="2" fill="#FF0000" />
        <circle cx="55" cy="30" r="2" fill="#FF0000" />
        {/* Pattes */}
        <rect x="35" y="70" width="4" height="12" fill="#4A4A4A" />
        <rect x="45" y="70" width="4" height="12" fill="#4A4A4A" />
        <rect x="55" y="70" width="4" height="12" fill="#4A4A4A" />
        <rect x="65" y="70" width="4" height="12" fill="#4A4A4A" />
        {/* Queue */}
        <ellipse cx="25" cy="55" rx="12" ry="6" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
      </svg>
    </motion.div>
  )
}

interface FoodProps {
  environment: EnvironmentalFactors
}

const Food = ({ environment }: FoodProps) => {
  const getFoodItems = () => {
    const items = []
    const baseCount = environment.foodScarcity ? 4 : 12

    for (let i = 0; i < baseCount; i++) {
      items.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      })
    }
    return items
  }

  const [foodItems, setFoodItems] = useState(getFoodItems())

  useEffect(() => {
    setFoodItems(getFoodItems())
  }, [environment.foodScarcity, environment.foodHardness])

  return (
    <>
      {foodItems.map((item) => (
        <div
          key={item.id}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4">
            {environment.foodHardness ? (
              // Nourriture dure (noix/graines)
              <circle cx="10" cy="10" r="8" fill="#8B4513" stroke="#654321" strokeWidth="2" />
            ) : (
              // Nourriture tendre (herbe/feuilles)
              <g>
                <ellipse cx="10" cy="10" rx="8" ry="6" fill="#90EE90" />
                <path d="M6 10 Q10 6 14 10 Q10 14 6 10" fill="#228B22" />
              </g>
            )}
          </svg>
        </div>
      ))}
    </>
  )
}

// Composant pour créer des lapins personnalisés
interface RabbitCreatorProps {
  onCreateRabbit: (rabbit: RabbitGenetics) => void
  isCompanion: boolean
}

const RabbitCreator = ({ onCreateRabbit, isCompanion }: RabbitCreatorProps) => {
  const [selectedAlleles, setSelectedAlleles] = useState({
    fur: ["B", "B"] as [string, string],
    ear: ["S", "S"] as [string, string],
    tooth: ["L", "L"] as [string, string],
  })

  const [previewRabbit, setPreviewRabbit] = useState<RabbitGenetics | null>(null)

  // Mettre à jour la prévisualisation quand les allèles changent
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

  const AlleleSelector = ({
    trait,
    traitName,
    dominantAllele,
    recessiveAllele,
    dominantTrait,
    recessiveTrait,
  }: {
    trait: "fur" | "ear" | "tooth"
    traitName: string
    dominantAllele: string
    recessiveAllele: string
    dominantTrait: string
    recessiveTrait: string
  }) => (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm">{traitName}</h4>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-600">Allèle 1</label>
          <select
            value={selectedAlleles[trait][0]}
            onChange={(e) => handleAlleleChange(trait, 0, e.target.value)}
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
        <div>
          <label className="text-xs text-gray-600">Allèle 2</label>
          <select
            value={selectedAlleles[trait][1]}
            onChange={(e) => handleAlleleChange(trait, 1, e.target.value)}
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
      </div>
      <div className="text-xs text-gray-500">
        Génotype: {selectedAlleles[trait].sort().join("")} → Phénotype:{" "}
        {trait === "fur"
          ? previewRabbit?.furColor === "brown"
            ? "Brun"
            : "Blanc"
          : trait === "ear"
            ? previewRabbit?.earType === "straight"
              ? "Droites"
              : "Tombantes"
            : previewRabbit?.toothLength === "long"
              ? "Longues"
              : "Courtes"}
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sélecteurs d'allèles */}
      <div className="space-y-4">
        <h3 className="font-semibold">Sélection des Allèles</h3>

        <AlleleSelector
          trait="fur"
          traitName="🎨 Couleur de Fourrure"
          dominantAllele="B"
          recessiveAllele="b"
          dominantTrait="brun"
          recessiveTrait="blanc"
        />

        <AlleleSelector
          trait="ear"
          traitName="👂 Type d'Oreilles"
          dominantAllele="S"
          recessiveAllele="s"
          dominantTrait="droites"
          recessiveTrait="tombantes"
        />

        <AlleleSelector
          trait="tooth"
          traitName="🦷 Longueur des Dents"
          dominantAllele="L"
          recessiveAllele="l"
          dominantTrait="longues"
          recessiveTrait="courtes"
        />

        <Button onClick={createRabbit} className="w-full mt-4">
          {isCompanion ? "Créer le Compagnon" : "Créer le Premier Lapin"}
        </Button>
      </div>

      {/* Prévisualisation */}
      <div className="space-y-4">
        <h3 className="font-semibold">Prévisualisation</h3>
        {previewRabbit && (
          <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
            <div className="w-24 h-24 mx-auto mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Corps du lapin */}
                <circle
                  cx="50"
                  cy="40"
                  r="20"
                  fill={previewRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                  stroke="#000"
                  strokeWidth="2"
                />
                {/* Oreilles */}
                {previewRabbit.earType === "straight" ? (
                  <>
                    <ellipse
                      cx="35"
                      cy="30"
                      rx="8"
                      ry="15"
                      fill={previewRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                      stroke="#000"
                      strokeWidth="2"
                      transform="rotate(-20 35 30)"
                    />
                    <ellipse
                      cx="65"
                      cy="30"
                      rx="8"
                      ry="15"
                      fill={previewRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                      stroke="#000"
                      strokeWidth="2"
                      transform="rotate(20 65 30)"
                    />
                  </>
                ) : (
                  <>
                    <path
                      d="M32 22 Q28 28 30 38 Q32 45 38 42 Q36 35 35 28 Q34 24 32 22 Z"
                      fill={previewRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <path
                      d="M68 22 Q72 28 70 38 Q68 45 62 42 Q64 35 65 28 Q66 24 68 22 Z"
                      fill={previewRabbit.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
                      stroke="#000"
                      strokeWidth="2"
                    />
                  </>
                )}
                {/* Yeux */}
                <circle cx="45" cy="35" r="2" fill="#000" />
                <circle cx="55" cy="35" r="2" fill="#000" />
                {/* Dents (si longues) */}
                {previewRabbit.toothLength === "long" && (
                  <>
                    <rect x="47" y="45" width="3" height="10" fill="#FFF" stroke="#000" strokeWidth="1" />
                    <rect x="50" y="45" width="3" height="10" fill="#FFF" stroke="#000" strokeWidth="1" />
                  </>
                )}
              </svg>
            </div>

            <div className="text-center space-y-2">
              <p className="font-semibold">{isCompanion ? "Compagnon" : "Premier Lapin"}</p>
              <div className="text-sm space-y-1">
                <p>
                  🎨 Fourrure: {previewRabbit.furColor === "brown" ? "Brune" : "Blanche"} (
                  {selectedAlleles.fur.sort().join("")})
                </p>
                <p>
                  👂 Oreilles: {previewRabbit.earType === "straight" ? "Droites" : "Tombantes"} (
                  {selectedAlleles.ear.sort().join("")})
                </p>
                <p>
                  🦷 Dents: {previewRabbit.toothLength === "long" ? "Longues" : "Courtes"} (
                  {selectedAlleles.tooth.sort().join("")})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Explication génétique */}
        <div className="bg-blue-50 p-3 rounded text-xs">
          <h4 className="font-semibold mb-2">💡 Rappel Génétique</h4>
          <ul className="space-y-1 text-gray-700">
            <li>
              • <strong>Allèles dominants</strong> s'expriment même avec un seul exemplaire
            </li>
            <li>
              • <strong>Allèles récessifs</strong> ne s'expriment qu'avec deux exemplaires
            </li>
            <li>
              • <strong>BB ou Bb</strong> = trait dominant visible
            </li>
            <li>
              • <strong>bb</strong> = trait récessif visible
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Main Component
const SimulationSelectionNaturelle = () => {
  const [allLivingRabbits, setAllLivingRabbits] = useState<RabbitGenetics[]>([])
  const [allRabbitsHistory, setAllRabbitsHistory] = useState<RabbitGenetics[]>([]) // Tous les lapins (vivants et morts)
  const [selectedRabbit, setSelectedRabbit] = useState<RabbitGenetics | null>(null)
  const [lastExplanation, setLastExplanation] = useState<GenerationExplanation | null>(null)
  const [currentGeneration, setCurrentGeneration] = useState(0)
  const [environment, setEnvironment] = useState<EnvironmentalFactors>({
    wolvesPresent: false,
    foodHardness: false,
    foodScarcity: false,
  })
  const [stats, setStats] = useState<GenerationStats>({
    totalPopulation: 0,
    traitFrequencies: {},
    generationNumber: 0,
  })
  const [generationHistory, setGenerationHistory] = useState<StatsDataPoint[]>([])

  // Créer le premier lapin au démarrage
  useEffect(() => {
    const firstRabbit = createRandomRabbit(0, 0)
    setAllLivingRabbits([firstRabbit])
    setAllRabbitsHistory([firstRabbit])
    const initialStats = updateStatistics([firstRabbit])
    setStats(initialStats)
    setGenerationHistory([{ generation: 0, population: 1 }])
  }, [])

  const simulateNextGeneration = () => {
    if (allLivingRabbits.length === 0) return

    const nextGeneration = currentGeneration + 1
    const result = simulationSelectionNaturelle(allLivingRabbits, environment, nextGeneration)
    const { newLivingRabbits, explanation, newDeadRabbits } = result

    setAllLivingRabbits(newLivingRabbits)
    setAllRabbitsHistory((prev) => [
      ...prev,
      ...newDeadRabbits,
      ...newLivingRabbits.filter((r) => r.birthGeneration === nextGeneration),
    ])
    setLastExplanation(explanation || null)
    setCurrentGeneration(nextGeneration)

    const newStats = updateStatistics(newLivingRabbits)
    setStats(newStats)

    setGenerationHistory((prev) => [...prev, { generation: nextGeneration, population: newLivingRabbits.length }])
  }

  /*const getButtonText = () => {
    if (allLivingRabbits.length === 0) return "Commencer avec un lapin"
    if (allLivingRabbits.length === 1) return "Ajouter un compagnon"
    return "Population complète"
  }*/

  const handleRabbitSelect = (rabbit: RabbitGenetics) => {
    setSelectedRabbit(rabbit)
  }

  const [showQuiz, setShowQuiz] = useState(false)
  const [showGuide, setShowGuide] = useState(true)


  return (
    <>
      {showGuide && <GuideTutorielSelection onClose={() => setShowGuide(false)} />}
      {showQuiz && <QuizzSelection onClose={() => setShowQuiz(false)} />}
      <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Sélection Naturelle - Laboratoire Virtuel</CardTitle>
        <p className="text-center text-sm text-gray-600">
          Génétique mendélienne : Traits dominants (Brun, Droit, Long) vs Récessifs (Blanc, Tombant, Court)
        </p>
        <p className="text-center text-xs text-blue-600">
          💡 Cliquez sur un lapin pour voir ses informations génétiques | 🌈 Couleurs = Générations différentes
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zone de simulation */}
        <div className="relative w-full h-[400px] bg-gradient-to-b from-blue-200 to-green-200 rounded-lg overflow-hidden border-2 border-gray-300">
          {/* Icônes Quiz & Guide */}
          <div className="absolute top-4 right-4 flex gap-3 z-10">
            <button
              onClick={() => setShowGuide(true)}
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
              title="Voir le guide"
            >
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={() => setShowQuiz(true)}
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
              title="Lancer le quiz"
            >
              <BookOpenCheck className="w-5 h-5 text-green-600" />
            </button>
          </div>

          <Food environment={environment} />
          {allLivingRabbits
            .filter((r) => r.isAlive)
            .map((rabbit, index) => (
              <Rabbit
                key={rabbit.id}
                genetics={rabbit}
                index={index}
                isSelected={selectedRabbit?.id === rabbit.id}
                onSelect={() => handleRabbitSelect(rabbit)}
              />
            ))}
          {environment.wolvesPresent && <Wolf />}

          {/* Informations sur la population */}
          <div className="absolute top-4 left-4 bg-white/80 p-2 rounded">
            <p className="text-sm font-semibold">Population vivante: {stats.totalPopulation}</p>
            <p className="text-sm">Génération actuelle: {currentGeneration}</p>
            <p className="text-xs text-gray-600">Total historique: {allRabbitsHistory.length}</p>
          </div>

          {/* Légende des générations */}
          <div className="absolute bottom-4 left-4 bg-white/80 p-2 rounded text-xs">
            <p className="font-semibold mb-1">Générations:</p>
            <div className="flex gap-2 flex-wrap">
              {Array.from(new Set(allLivingRabbits.filter((r) => r.isAlive).map((r) => r.generation)))
                .sort()
                .map((gen) => {
                  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316"]
                  return (
                    <div key={gen} className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: colors[gen % colors.length] }}
                      />
                      <span>G{gen}</span>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Panneau d'informations du lapin sélectionné */}
          {selectedRabbit && (
            <RabbitInfo
              rabbit={selectedRabbit}
              allRabbits={allRabbitsHistory}
              onClose={() => setSelectedRabbit(null)}
            />
          )}
        </div>

        {/* Explication de la génération */}
        {lastExplanation && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-800">
                🧬 Explication Génétique - Génération {lastExplanation.generation}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Parents:</h4>
                  <div className="text-xs space-y-1">
                    <p>
                      🎨 Fourrure: {lastExplanation.parentInfo.parent1.furAlleles.join("")} ×{" "}
                      {lastExplanation.parentInfo.parent2.furAlleles.join("")}
                    </p>
                    <p>
                      👂 Oreilles: {lastExplanation.parentInfo.parent1.earAlleles.join("")} ×{" "}
                      {lastExplanation.parentInfo.parent2.earAlleles.join("")}
                    </p>
                    <p>
                      🦷 Dents: {lastExplanation.parentInfo.parent1.toothAlleles.join("")} ×{" "}
                      {lastExplanation.parentInfo.parent2.toothAlleles.join("")}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Résultat:</h4>
                  <p className="text-sm">{lastExplanation.offspringCount} descendants nés</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Hérédité des traits:</h4>
                <div className="text-xs space-y-1">
                  <p>
                    🎨 <strong>Fourrure:</strong> {lastExplanation.traitExplanations.fur}
                  </p>
                  <p>
                    👂 <strong>Oreilles:</strong> {lastExplanation.traitExplanations.ear}
                  </p>
                  <p>
                    🦷 <strong>Dents:</strong> {lastExplanation.traitExplanations.tooth}
                  </p>
                </div>
              </div>

              {lastExplanation.environmentalEffects.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-red-700">Effets environnementaux:</h4>
                  <ul className="text-xs space-y-1">
                    {lastExplanation.environmentalEffects.map((effect, index) => (
                      <li key={index} className="text-red-600">
                        ⚠️ {effect}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contrôles - seulement si on a déjà 2 lapins */}
        {allLivingRabbits.length >= 2 && (
          <div className="grid grid-cols-1 gap-4">
            <Button onClick={simulateNextGeneration} className="w-full">
              Lancer la génération suivante
            </Button>
          </div>
        )}

        {allLivingRabbits.length < 2 && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-800">🧬 Créateur de Lapins Personnalisés</CardTitle>
              <p className="text-sm text-gray-600">
                Choisissez les allèles pour créer un lapin avec des traits spécifiques
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <RabbitCreator
                onCreateRabbit={(rabbit) => {
                  if (allLivingRabbits.length === 0) {
                    setAllLivingRabbits([rabbit])
                    setAllRabbitsHistory([rabbit])
                    const initialStats = updateStatistics([rabbit])
                    setStats(initialStats)
                    setGenerationHistory([{ generation: 0, population: 1 }])
                  } else if (allLivingRabbits.length === 1) {
                    const newLivingRabbits = [...allLivingRabbits, rabbit]
                    setAllLivingRabbits(newLivingRabbits)
                    setAllRabbitsHistory((prev) => [...prev, rabbit])
                    const newStats = updateStatistics(newLivingRabbits)
                    setStats(newStats)
                    setGenerationHistory([{ generation: 0, population: 2 }])
                  }
                }}
                isCompanion={allLivingRabbits.length === 1}
              />
            </CardContent>
          </Card>
        )}

        {/* Facteurs environnementaux */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Facteurs Environnementaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="wolves"
                checked={environment.wolvesPresent}
                onCheckedChange={(checked) => setEnvironment((prev) => ({ ...prev, wolvesPresent: checked === true }))}
              />
              <label htmlFor="wolves" className="text-sm font-medium">
                Présence de loups (prédation)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="foodHardness"
                checked={environment.foodHardness}
                onCheckedChange={(checked) => setEnvironment((prev) => ({ ...prev, foodHardness: checked === true }))}
              />
              <label htmlFor="foodHardness" className="text-sm font-medium">
                Nourriture dure (favorise dents longues)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="foodScarcity"
                checked={environment.foodScarcity}
                onCheckedChange={(checked) => setEnvironment((prev) => ({ ...prev, foodScarcity: checked === true }))}
              />
              <label htmlFor="foodScarcity" className="text-sm font-medium">
                Nourriture limitée (compétition)
              </label>
            </div>
          </div>
        </div>

        {/* Statistiques des traits */}
        {stats.totalPopulation > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fréquences des Traits (Population Vivante)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {Object.entries(stats.traitFrequencies).map(([trait, frequency]) => (
                <div key={trait} className="bg-gray-100 p-3 rounded flex items-center gap-3">
                  <TraitRabbit trait={trait} />
                  <div>
                    <span className="font-medium capitalize">{trait}:</span>
                    <br />
                    <span className="text-lg font-bold text-blue-600">{frequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Graphique de l'évolution de la population */}
        {generationHistory.length > 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Évolution de la Population</h3>
            <LineChart width={600} height={300} data={generationHistory}>
              <XAxis dataKey="generation" />
              <YAxis />
              <Line type="monotone" dataKey="population" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  )
}

export default SimulationSelectionNaturelle