// src/types/tutorialSelection.ts
import React from 'react';

export interface TutorialStep {
    /**
     * Identifiant unique de l'étape
     */
    id: number;
    
    /**
     * Titre de l'étape (peut inclure des emojis)
     */
    title: string | React.ReactNode;
    
    /**
     * Contenu principal de l'étape (supporte les sauts de ligne avec \n)
     */
    content: string;
    
    /**
     * Élément cible pour les étapes interactives
     */
    target?: string;
    
    /**
     * Position du tooltip par rapport à la cible
     */
    position?: "top" | "bottom" | "left" | "right" | "center";
    
    /**
     * Si l'étape peut être sautée
     * @default false
     */
    skippable?: boolean;
    
    /**
     * Type d'action requise pour passer à l'étape suivante
     */
    action?: "click" | "hover" | "adjust" | "wait" | "none";
    
    /**
     * Cible de l'action (ID ou sélecteur)
     */
    actionTarget?: string;
    
    /**
     * Valeur attendue pour les actions de type 'adjust'
     */
    actionValue?: number | string;
    
    /**
     * Met en surbrillance l'élément cible
     * @default false
     */
    highlight?: boolean;
    
    /**
     * Liste de conseils supplémentaires
     */
    tips?: string[];
    
    /**
     * Icône ou emoji associé à l'étape
     */
    icon?: string | React.ReactNode;
    
    /**
     * Durée avant passage automatique (en ms)
     */
    autoAdvance?: number;
}

export interface TutorialOverlaySelectionProps {
    /**
     * Étape actuelle du tutoriel
     */
    currentStep: Omit<TutorialStep, "totalSteps">;
    
    /**
     * Nombre total d'étapes
     */
    totalSteps: number;
    
    /**
     * Callback pour passer à l'étape suivante
     */
    onNext: () => void;
    
    /**
     * Callback pour revenir à l'étape précédente
     */
    onPrevious: () => void;
    
    /**
     * Callback pour sauter tout le tutoriel
     */
    onSkip: () => void;
    
    /**
     * Callback quand le tutoriel est terminé
     */
    onComplete: () => void;
    
    /**
     * Personnalisation du bouton principal
     */
    primaryButtonVariant?: "green" | "blue" | "purple";
}