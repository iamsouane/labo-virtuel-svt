//src/components/utils/applyEnvironmentalPressure
import type { RabbitGenetics, EnvironmentalFactors } from "../../types/selectionNaturelleTypes"

export const applyEnvironmentalPressure = (
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