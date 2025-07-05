//src/types/tutorialPhotosynthese
export interface TutorialStep {
    id: number
    title: string
    content: string
    skippable?: boolean
    totalSteps: number
}