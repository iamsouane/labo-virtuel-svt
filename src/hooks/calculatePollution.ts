//src/hooks/calculatePollution
import type { PollutionData, Solution } from "../types/simulationPollutionTypes"

interface CalculatePollutionParams {
  source: PollutionData["source"]
  carCount: number
  industryCount: number
  solutions: Solution[]
}

export function calculatePollution({
  source,
  carCount,
  industryCount,
  solutions,
}: CalculatePollutionParams): Omit<PollutionData, "source"> & { level: number } {
  const activeSolutionsImpact = solutions.filter((s) => s.active).reduce((sum, s) => sum + s.impact, 0)
  const reductionFactor = Math.max(0.1, 1 - activeSolutionsImpact / 100)

  let baseCo2, baseNox, basePm25

  if (source === "voiture") {
    baseCo2 = 350 + carCount * 32
    baseNox = 15 + carCount * 12
    basePm25 = 8 + carCount * 4
  } else {
    baseCo2 = 350 + industryCount * 85
    baseNox = 15 + industryCount * 35
    basePm25 = 8 + industryCount * 18
  }

  const newCo2 = Math.round(baseCo2 * reductionFactor)
  const newNox = Math.round(baseNox * reductionFactor)
  const newPm25 = Math.round(basePm25 * reductionFactor)

  const aqiCo2 = Math.min(500, (newCo2 - 350) / 2)
  const aqiNox = Math.min(500, newNox * 2.5)
  const aqiPm25 = Math.min(500, newPm25 * 2.8)

  const newAqi = Math.round(Math.max(aqiCo2, aqiNox, aqiPm25))
  const newLevel = Math.min(100, Math.round((newAqi / 200) * 100))

  return {
    level: newLevel,
    co2: newCo2,
    nox: newNox,
    pm25: newPm25,
    aqi: Math.min(500, newAqi),
  }
}