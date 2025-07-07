// src/hooks/useEnergyShortcuts.ts
import { useEffect } from "react";

interface EnergyShortcutsOptions {
  showTutorial: boolean;
  showGuide: boolean;
  showQuiz: boolean;
  setShowTutorial: (show: boolean) => void;
  setShowGuide: (show: boolean) => void;
  startTutorial: () => void;
  startQuiz: () => void;
}

export const useEnergyShortcuts = ({
  showTutorial,
  showGuide,
  showQuiz,
  setShowGuide,
  startTutorial,
  startQuiz,
}: EnergyShortcutsOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "t" || event.key === "T") {
        if (!showTutorial) startTutorial();
      }
      if (event.key === "q" || event.key === "Q") {
        if (!showQuiz) startQuiz();
      }
      if (event.key === "h" || event.key === "H") {
        if (!showGuide) setShowGuide(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showTutorial, showGuide, showQuiz]);
};