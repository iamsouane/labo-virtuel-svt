//src/components/utils/applyPredation
import type { RabbitGenetics } from "../../types/selectionNaturelleTypes"

export const applyPredation = (
  population: RabbitGenetics[],
): { survivors: RabbitGenetics[]; dead: RabbitGenetics[] } => {
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