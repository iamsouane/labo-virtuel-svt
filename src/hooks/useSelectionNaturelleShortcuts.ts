// src/hooks/useSelectionNaturelleShortcuts.ts
import { useEffect } from "react"

interface UseSelectionNaturelleShortcutsProps {
  isRunning: boolean
  setIsRunning: (running: boolean) => void
  showTutorial: boolean
  showGuide: boolean
  showQuiz: boolean
  setShowTutorial: (show: boolean) => void
  setShowGuide: (show: boolean) => void
  resetSimulation: () => void
  simulateNextGeneration: () => void
  startTutorial: () => void
  startQuiz: () => void
}

export const useSelectionNaturelleShortcuts = ({
  isRunning,
  setIsRunning,
  showGuide,
  showQuiz,
  setShowGuide,
  resetSimulation,
  simulateNextGeneration,
  startQuiz,
}: UseSelectionNaturelleShortcutsProps) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Désactiver les raccourcis pendant les modaux
      if (showGuide || showQuiz) return

      switch (e.code) {
        case "Space":
          e.preventDefault()
          if (isRunning) {
            setIsRunning(false)
          } else {
            simulateNextGeneration()
          }
          break
        case "KeyR":
          e.preventDefault()
          resetSimulation()
          break
        case "KeyG":
          e.preventDefault()
          setShowGuide(true)
          break
        case "KeyQ":
          e.preventDefault()
          startQuiz()
          break
        case "KeyH":
          e.preventDefault()
          setShowGuide(!showGuide)
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isRunning, showGuide, showQuiz, resetSimulation, simulateNextGeneration, setShowGuide, setIsRunning, startQuiz])
}