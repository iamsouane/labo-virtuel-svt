// src/hooks/useEnergyHandlers.ts
import type React from "react"
import type {
  EnergySource,
  OutputDevice,
  GeneratorType,
  EnergyData,
} from "../types/simulationEnergieTypes"

interface UseEnergyHandlersParams {
  energySource: EnergySource
  setEnergyData: React.Dispatch<React.SetStateAction<EnergyData>>
  setSelectedDevice: React.Dispatch<React.SetStateAction<OutputDevice>>
  setEnergySource: React.Dispatch<React.SetStateAction<EnergySource>>
  setGeneratorType: React.Dispatch<React.SetStateAction<GeneratorType>>
}

export function useEnergyHandlers({
  energySource,
  setEnergyData,
  setSelectedDevice,
  setEnergySource,
  setGeneratorType,
}: UseEnergyHandlersParams) {
  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (energySource === "velo") {
      setEnergyData((prev) => ({
        ...prev,
        pedalingIntensity: value,
      }))
    } else {
      setEnergyData((prev) => ({
        ...prev,
        solarIntensity: value,
      }))
    }
  }

  const toggleActivity = () => {
    setEnergyData((prev) => ({ ...prev, isActive: !prev.isActive }))
  }

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevice(e.target.value as OutputDevice)
  }

  const handleEnergySourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSource = e.target.value as EnergySource
    setEnergySource(newSource)
    if (newSource === "soleil") {
      setGeneratorType("panneau-solaire")
    } else {
      setGeneratorType("generatrice")
    }
  }

  const handleGeneratorTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGeneratorType(e.target.value as GeneratorType)
  }

  return {
    handleIntensityChange,
    toggleActivity,
    handleDeviceChange,
    handleEnergySourceChange,
    handleGeneratorTypeChange,
  }
}