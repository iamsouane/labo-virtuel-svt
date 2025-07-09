//src/types/visualisationHeartTypes
export interface HeartAnnotation {
  id: string
  position: [number, number, number]
  title: string
  description: string
  color: string
}

export interface AnnotationPanelProps {
  annotation: HeartAnnotation | null
  onClose: () => void
}

export interface HeartModelProps {
  onAnnotationClick: (annotation: HeartAnnotation) => void
  hoveredAnnotation: string | null
  setHoveredAnnotation: (id: string | null) => void
}

export interface CameraControlsRef {
  reset: () => void
}