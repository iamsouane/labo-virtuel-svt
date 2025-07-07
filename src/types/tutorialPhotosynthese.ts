//src/types/tutorialPhotosynthese
export interface TutorialStep {
    id: number
    title: string
    content: string
    skippable?: boolean
    autoAdvance?: number
    tips?: string[]
    icon?: string
    totalSteps?: number 
}