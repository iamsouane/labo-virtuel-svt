//src/components/utils/simulation/simulationSelectionNaturelle
import type { RabbitGenetics, EnvironmentalFactors, GenerationExplanation } from "../../types/selectionNaturelleTypes"
import { breedRabbits, explainTraitInheritance } from "./geneticsUtils" 
import { applyAging } from "./applyAging"
import { applyPredation } from "./applyPredation"
import { applyEnvironmentalPressure } from "./applyEnvironmentalPressure"

export const simulationSelectionNaturelle = (
  allLivingRabbits: RabbitGenetics[],
  environment: EnvironmentalFactors,
  currentGeneration: number,
): { newLivingRabbits: RabbitGenetics[]; explanation?: GenerationExplanation; newDeadRabbits: RabbitGenetics[] } => {
  const reproductiveRabbits = allLivingRabbits.filter((r) => r.isAlive)
  if (reproductiveRabbits.length < 2) {
    return { newLivingRabbits: allLivingRabbits, newDeadRabbits: [] }
  }

  let offspring: RabbitGenetics[] = []
  let explanation: GenerationExplanation | undefined

  if (reproductiveRabbits.length === 2) {
    offspring = breedRabbits(reproductiveRabbits[0], reproductiveRabbits[1], currentGeneration)
    explanation = explainTraitInheritance(reproductiveRabbits[0], reproductiveRabbits[1], offspring)
  } else {
    for (let i = 0; i < reproductiveRabbits.length; i += 2) {
      const parent1 = reproductiveRabbits[i]
      const parent2 = reproductiveRabbits[i + 1] || reproductiveRabbits[Math.floor(Math.random() * reproductiveRabbits.length)]
      const children = breedRabbits(parent1, parent2, currentGeneration)
      offspring.push(...children.slice(0, 2))
    }
  }

  const environmentalEffects: string[] = []
  const allNewDeadRabbits: RabbitGenetics[] = []

  if (environment.wolvesPresent) {
    const result = applyPredation(offspring)
    offspring = result.survivors
    allNewDeadRabbits.push(...result.dead)
    environmentalEffects.push(`Prédation par les loups: ${result.dead.length} lapins éliminés`)
  }

  if (environment.foodHardness || environment.foodScarcity) {
    const result = applyEnvironmentalPressure(offspring, environment)
    offspring = result.survivors
    allNewDeadRabbits.push(...result.dead)

    if (environment.foodHardness) {
      const affected = result.dead.filter((r) => r.toothLength === "short").length
      if (affected > 0) environmentalEffects.push(`Nourriture dure: ${affected} lapins à dents courtes éliminés`)
    }

    if (environment.foodScarcity) {
      const affected = result.dead.length
      if (affected > 0) environmentalEffects.push(`Pénurie alimentaire: ${affected} lapins éliminés`)
    }
  }

  if (explanation) explanation.environmentalEffects = environmentalEffects

  const aging = applyAging(allLivingRabbits, currentGeneration)
  const newLivingRabbits = [...aging.survivors, ...offspring]
  allNewDeadRabbits.push(...aging.dead)

  return { newLivingRabbits, explanation, newDeadRabbits: allNewDeadRabbits }
}