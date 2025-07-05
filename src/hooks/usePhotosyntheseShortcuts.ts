//src/hooks/UsePhotosyntheseShortcut
import { useEffect } from "react"

interface UsePhotosyntheseShortcutsProps {
    isRunning: boolean
    setIsRunning: (running: boolean) => void
    showTutorial: boolean
    showHelp: boolean
    setShowHelp: (show: boolean) => void
    startTutorial: () => void
    resetSimulation: () => void
    startQuiz: () => void
}

export const usePhotosyntheseShortcuts = ({
    isRunning,
    setIsRunning,
    showTutorial,
    showHelp,
    setShowHelp,
    startTutorial,
    resetSimulation,
    startQuiz,
}: UsePhotosyntheseShortcutsProps) => {
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (showTutorial) return // Désactiver les raccourcis pendant le tutoriel

            switch (e.code) {
                case "Space":
                    e.preventDefault()
                    setIsRunning(!isRunning)
                    break
                case "KeyR":
                    resetSimulation()
                    break
                case "KeyH":
                    setShowHelp(!showHelp)
                    break
                case "KeyT":
                    startTutorial()
                    break
                case "KeyQ":
                    startQuiz()
                    break
            }
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [isRunning, showHelp, showTutorial])
}