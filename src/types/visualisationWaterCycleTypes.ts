//src/types/visualisationWaterCycleTypes
export interface WaterCycleAnnotation {
  id: string
  position: [number, number, number]
  title: string
  description: string
  color: string
  process: string
  scientificData: string[]
}

export type Step = {
  start: number
  end: number
  title: string
  explanation: string
  scientificData: string[]
  temperature: number
  humidity: number
  altitude: number
}