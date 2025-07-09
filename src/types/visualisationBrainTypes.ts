//src/types/visualisationBrainTypes
export interface BrainAnnotation {
  id: string
  position: [number, number, number]
  title: string
  description: string
  color: string
  functions: string[]
  glbColor?: string // Couleur correspondante dans le modèle GLB
}

export interface AnnotationPanelProps {
  annotation: BrainAnnotation | null
  onClose: () => void
}

export interface BrainModelProps {
  onAnnotationClick: (annotation: BrainAnnotation) => void
  hoveredAnnotation: string | null
  setHoveredAnnotation: (id: string | null) => void
}

export interface CameraControlsRef {
  reset: () => void
}