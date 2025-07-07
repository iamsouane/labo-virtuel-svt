//src/components/utils/applyAging
import type { RabbitGenetics } from "../../types/selectionNaturelleTypes"

export const applyAging = (
  population: RabbitGenetics[],
  currentGeneration: number,
): { survivors: RabbitGenetics[]; dead: RabbitGenetics[] } => {
  const survivors: RabbitGenetics[] = []
  const dead: RabbitGenetics[] = []

  population.forEach((rabbit) => {
    const age = currentGeneration - rabbit.birthGeneration
    let deathChance = 0

    if (age >= 4) deathChance = 0.8
    else if (age >= 3) deathChance = 0.4
    else if (age >= 2) deathChance = 0.1

    if (Math.random() < deathChance) {
      dead.push({ ...rabbit, isAlive: false })
    } else {
      survivors.push(rabbit)
    }
  })

  return { survivors, dead }
}