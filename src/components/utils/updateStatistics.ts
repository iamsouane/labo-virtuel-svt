//src/components/utils/updateStatistics
import type { RabbitGenetics, GenerationStats } from "../../types/selectionNaturelleTypes"

export const updateStatistics = (population: RabbitGenetics[]): GenerationStats => {
  const totalRabbits = population.length
  const livingRabbits = population.filter((r) => r.isAlive)

  const traitFrequencies = livingRabbits.reduce((acc, rabbit) => {
    const fur = rabbit.furColor === "brown" ? "Fourrure brune" : "Fourrure blanche"
    const ear = rabbit.earType === "straight" ? "Oreilles droites" : "Oreilles tombantes"
    const tooth = rabbit.toothLength === "long" ? "Dents longues" : "Dents courtes"

    acc[fur] = (acc[fur] || 0) + 1
    acc[ear] = (acc[ear] || 0) + 1
    acc[tooth] = (acc[tooth] || 0) + 1

    return acc
  }, {} as Record<string, number>)

  const survivalRate = totalRabbits > 0 ? livingRabbits.length / totalRabbits : 0

  return {
    totalPopulation: livingRabbits.length,
    traitFrequencies,
    generationNumber: Math.floor(Math.random() * 100), // ou passe une vraie valeur
    survivalRate
  }
}