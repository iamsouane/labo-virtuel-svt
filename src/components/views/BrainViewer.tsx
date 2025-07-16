//src/components/views/Brainviewer
import React, { useRef, useState, useCallback, Suspense, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Html, Environment, useGLTF, Center } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { X, Loader2 } from "lucide-react"
import type { BrainAnnotation, AnnotationPanelProps, BrainModelProps, CameraControlsRef } from "../../types/visualisationBrainTypes"

// Données des annotations du cerveau basées sur les couleurs du modèle Sketchfab
const brainAnnotations: BrainAnnotation[] = [
  {
    id: "frontal-cortex",
    position: [0, 0.8, 1.2],
    title: "Cortex Frontal",
    description: "Région responsable des fonctions exécutives supérieures et du contrôle moteur volontaire.",
    color: "#ff6b6b", // Rouge-rose pour le cortex frontal
    glbColor: "#ff4757",
    functions: [
      "Planification et prise de décision",
      "Contrôle des mouvements volontaires",
      "Personnalité et comportement social",
      "Production du langage (aire de Broca)",
    ],
  },
  {
    id: "parietal-cortex",
    position: [0, 1.2, -0.2],
    title: "Cortex Pariétal",
    description: "Centre de traitement des informations sensorielles et de l'intégration spatiale.",
    color: "#4ecdc4", // Turquoise pour le cortex pariétal
    glbColor: "#2ed573",
    functions: [
      "Traitement des sensations tactiles",
      "Perception spatiale et navigation",
      "Intégration multisensorielle",
      "Coordination visuo-motrice",
    ],
  },
  {
    id: "temporal-cortex",
    position: [-1.3, 0.3, 0.3],
    title: "Cortex Temporal",
    description: "Région dédiée à l'audition, à la mémoire et à la compréhension du langage.",
    color: "#ffa726", // Orange pour le cortex temporal
    glbColor: "#ff9f43",
    functions: [
      "Traitement auditif et musical",
      "Formation et récupération mnésique",
      "Compréhension du langage (aire de Wernicke)",
      "Reconnaissance des visages et objets",
    ],
  },
  {
    id: "occipital-cortex",
    position: [0, 0.5, -1.5],
    title: "Cortex Occipital",
    description: "Centre principal du traitement de l'information visuelle.",
    color: "#ab47bc", // Violet pour le cortex occipital
    glbColor: "#8e44ad",
    functions: [
      "Traitement des informations visuelles primaires",
      "Reconnaissance des formes et motifs",
      "Perception des couleurs et contrastes",
      "Vision spatiale et mouvement",
    ],
  },
  {
    id: "cerebellum",
    position: [0, -0.8, -1.2],
    title: "Cervelet",
    description: "Structure essentielle pour l'équilibre, la coordination motrice et l'apprentissage.",
    color: "#66bb6a", // Vert pour le cervelet
    glbColor: "#27ae60",
    functions: [
      "Coordination fine des mouvements",
      "Maintien de l'équilibre postural",
      "Apprentissage moteur et adaptation",
      "Régulation du tonus musculaire",
    ],
  },
  {
    id: "brainstem",
    position: [0, -1.2, -0.3],
    title: "Tronc Cérébral",
    description: "Centre de contrôle des fonctions vitales automatiques de l'organisme.",
    color: "#42a5f5", // Bleu pour le tronc cérébral
    glbColor: "#3742fa",
    functions: [
      "Régulation de la respiration",
      "Contrôle du rythme cardiaque",
      "Régulation de la pression artérielle",
      "Cycles veille-sommeil et conscience",
    ],
  },
  {
    id: "limbic-system",
    position: [-0.8, -0.1, 0.4],
    title: "Système Limbique",
    description: "Réseau neuronal impliqué dans les émotions, la mémoire et la motivation.",
    color: "#ef5350", // Rouge pour le système limbique
    glbColor: "#e74c3c",
    functions: [
      "Traitement des émotions",
      "Formation de la mémoire épisodique",
      "Motivation et récompense",
      "Réponses au stress et à la peur",
    ],
  },
  {
    id: "corpus-callosum",
    position: [0, 0.2, 0],
    title: "Corps Calleux",
    description: "Pont de fibres nerveuses reliant les deux hémisphères cérébraux.",
    color: "#ffc107", // Jaune pour le corps calleux
    glbColor: "#f1c40f",
    functions: [
      "Communication inter-hémisphérique",
      "Coordination bilatérale",
      "Transfert d'informations sensorielles",
      "Intégration des fonctions cognitives",
    ],
  },
]

// Composant du panneau d'annotation
const AnnotationPanel: React.FC<AnnotationPanelProps> = ({ annotation, onClose }) => {
  if (!annotation) return null

  return (
    <div className="absolute top-40 left-4 z-10 max-w-sm">
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2" style={{ borderColor: annotation.color }}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: annotation.color }}
              />
              <h3 className="font-bold text-lg text-gray-900">{annotation.title}</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed mb-4">{annotation.description}</p>

          {/* Fonctions principales */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: annotation.color }} />
              Fonctions Principales
            </h4>
            <ul className="space-y-2">
              {annotation.functions.map((func, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: annotation.color }}
                  />
                  <span className="leading-relaxed">{func}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 p-2 rounded-lg" style={{ backgroundColor: `${annotation.color}15` }}>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: annotation.color }} />
              <span>Région anatomique identifiée</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Composant du point d'annotation 3D amélioré
const AnnotationPoint: React.FC<{
  annotation: BrainAnnotation
  onClick: (annotation: BrainAnnotation) => void
  isHovered: boolean
  onHover: (id: string | null) => void
}> = ({ annotation, onClick, isHovered, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const lineRef = useRef<THREE.Mesh>(null)
  const pulseRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      if (isHovered) {
        meshRef.current.scale.setScalar(1.4 + Math.sin(state.clock.elapsedTime * 10) * 0.2)
      } else {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1)
      }
    }

    // Animation de la ligne de connexion
    if (lineRef.current) {
      if (isHovered) {
        lineRef.current.scale.y = 1.2 + Math.sin(state.clock.elapsedTime * 6) * 0.15
      } else {
        lineRef.current.scale.y = 1
      }
    }

    // Animation de l'effet de pulsation
    if (pulseRef.current && isHovered) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.3
      pulseRef.current.scale.setScalar(pulse)

      const material = pulseRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 - (pulse - 1) * 0.5
    }

  })

  // Calculer la direction vers le centre du cerveau
  const brainCenter = new THREE.Vector3(0, 0, 0)
  const annotationPos = new THREE.Vector3(...annotation.position)
  const direction = brainCenter.clone().sub(annotationPos).normalize()
  const lineLength = 0.5

  return (
    <group>
      {/* Effet de pulsation pour le hover */}
      {isHovered && (
        <mesh ref={pulseRef} position={annotation.position}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={annotation.color} transparent opacity={0.3} />
        </mesh>
      )}

      {/* Point d'annotation principal */}
      <mesh
        ref={meshRef}
        position={annotation.position}
        onClick={() => onClick(annotation)}
        onPointerEnter={() => onHover(annotation.id)}
        onPointerLeave={() => onHover(null)}
      >
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial
          color={isHovered ? "#ffffff" : annotation.color}
          emissive={annotation.color}
          emissiveIntensity={isHovered ? 0.8 : 0.4}
          transparent
          opacity={0.95}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Ligne de connexion vers le cerveau */}
      <mesh
        ref={lineRef}
        position={[
          annotation.position[0] + direction.x * lineLength * 0.5,
          annotation.position[1] + direction.y * lineLength * 0.5,
          annotation.position[2] + direction.z * lineLength * 0.5,
        ]}
        lookAt={brainCenter}
      >
        <cylinderGeometry args={[0.02, 0.035, lineLength]} />
        <meshStandardMaterial
          color={annotation.color}
          transparent
          opacity={isHovered ? 1 : 0.7}
          emissive={annotation.color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Point de connexion sur le cerveau */}
      <mesh
        position={[
          annotation.position[0] + direction.x * lineLength,
          annotation.position[1] + direction.y * lineLength,
          annotation.position[2] + direction.z * lineLength,
        ]}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={annotation.color}
          emissive={annotation.color}
          emissiveIntensity={0.6}
          transparent
          opacity={isHovered ? 1 : 0.8}
        />
      </mesh>

      {/* Tooltip amélioré */}
      {isHovered && (
        <Html
          position={[annotation.position[0], annotation.position[1] + 0.4, annotation.position[2]]}
          distanceFactor={8}
        >
          <div
            className="bg-black/95 text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap pointer-events-none shadow-2xl border-2"
            style={{ borderColor: annotation.color }}
          >
            <div className="font-bold text-base" style={{ color: annotation.color }}>
              {annotation.title}
            </div>
            <div className="text-xs text-gray-300 mt-1">Cliquez pour explorer</div>
            <div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 border-r-2 border-b-2"
              style={{
                backgroundColor: "rgba(0,0,0,0.95)",
                borderColor: annotation.color,
              }}
            />
          </div>
        </Html>
      )}
    </group>
  )
}

// Composant du modèle de cerveau GLB
const BrainGLBModel: React.FC<BrainModelProps> = ({ onAnnotationClick, hoveredAnnotation, setHoveredAnnotation }) => {
  const brainRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF("/models/brain.glb")

  // Animation subtile du cerveau
  useFrame((state) => {
    if (brainRef.current) {
      // Rotation très lente pour montrer tous les angles
      brainRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.15
      // Légère pulsation pour simuler l'activité cérébrale
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.015
      brainRef.current.scale.setScalar(scale)
    }
  })

  // Cloner la scène pour éviter les conflits
  const clonedScene = scene.clone()

  // Préserver les couleurs originales du modèle Sketchfab
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Préserver les matériaux originaux mais améliorer le rendu
        if (child.material) {
          const originalMaterial = child.material as THREE.MeshStandardMaterial
          child.material = originalMaterial.clone()
          child.material.roughness = 0.4
          child.material.metalness = 0.05
          child.material.transparent = false
          child.material.opacity = 1
        }
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [clonedScene])

  return (
    <group ref={brainRef}>
      <Center>
        <primitive object={clonedScene} scale={2.8} />
      </Center>
      {/* Points d'annotation */}
      {brainAnnotations.map((annotation) => (
        <AnnotationPoint
          key={annotation.id}
          annotation={annotation}
          onClick={onAnnotationClick}
          isHovered={hoveredAnnotation === annotation.id}
          onHover={setHoveredAnnotation}
        />
      ))}
    </group>
  )
}

// Composant de chargement
const LoadingSpinner: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-30">
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <div className="text-center">
          <h3 className="font-semibold text-gray-900">Chargement du modèle</h3>
          <p className="text-sm text-gray-600 mt-1">Préparation du cerveau humain 3D...</p>
        </div>
      </CardContent>
    </Card>
  </div>
)

// Composant principal de contrôle de la caméra
const CameraControls = React.forwardRef<CameraControlsRef>((_, ref) => {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()

  React.useImperativeHandle(ref, () => ({
    reset: () => {
      if (controlsRef.current) {
        camera.position.set(0, 0, 8)
        camera.lookAt(0, 0, 0)
        controlsRef.current.reset()
      }
    },
  }))

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={3}
      maxDistance={30}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      autoRotate={false}
      autoRotateSpeed={0.3}
      dampingFactor={0.05}
      enableDamping={true}
    />
  )
})

CameraControls.displayName = "CameraControls"

// Composant principal BrainViewer
const BrainViewer: React.FC = () => {
  const [selectedAnnotation, setSelectedAnnotation] = useState<BrainAnnotation | null>(null)
  const [hoveredAnnotation, setHoveredAnnotation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const cameraControlsRef = useRef<CameraControlsRef>(null)

  const handleAnnotationClick = useCallback((annotation: BrainAnnotation) => {
    setSelectedAnnotation(annotation)
  }, [])

  const handleCloseAnnotation = useCallback(() => {
    setSelectedAnnotation(null)
  }, [])

  const handleResetView = useCallback(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.reset()
    }
    setSelectedAnnotation(null)
    setHoveredAnnotation(null)
  }, [])

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Indicateur de chargement */}
      {isLoading && <LoadingSpinner />}

      {/* En-tête */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center leading-tight">
            Anatomie du Cerveau Humain
          </h1>
          <p className="text-center text-purple-300 mt-3 text-base md:text-lg max-w-2xl mx-auto">
            Modèle 3D haute qualité de Sketchfab - Explorez les structures cérébrales
          </p>
        </div>
      </div>

      {/* Panneau d'annotation */}
      <AnnotationPanel annotation={selectedAnnotation} onClose={handleCloseAnnotation} />

      {/* Contrôles */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <Button onClick={handleResetView} className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
          Réinitialiser la vue
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10 max-w-xs">
        <Card className="bg-black/70 backdrop-blur-sm border-purple-800">
          <CardContent className="p-3">
            <p className="text-white text-xs leading-relaxed">
              <strong className="text-purple-900">Instructions:</strong>
              <br /><strong className="text-purple-900">• Cliquez et faites glisser pour faire tourner</strong>
              <br /><strong className="text-purple-900">• Molette pour zoomer/dézoomer</strong>
              <br /><strong className="text-purple-900">• Survolez les points colorés pour les infos</strong>
              <br /><strong className="text-purple-900">• Cliquez sur un point pour voir les détails</strong>
              <br /><strong className="text-purple-900">• Modèle 3D professionnel de Sketchfab</strong>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compteur d'annotations */}
      <div className="absolute top-24 right-4 z-20">
        <Card className="bg-purple-900/80 backdrop-blur-sm border border-purple-700 rounded-2xl shadow-lg">
          <CardContent className="p-4 text-center text-purple-900">
            <div className="text-xl font-bold">
              {brainAnnotations.length}
            </div>
            <div className="text-xs uppercase tracking-wide">Régions</div>
            <div className="text-xs uppercase tracking-wide">annotées</div>
          </CardContent>
        </Card>
      </div>

      {/* Scène 3D */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
        shadows
        onCreated={() => setIsLoading(false)}
      >
        {/* Éclairage optimisé pour le modèle Sketchfab */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[5, -5, -5]} intensity={0.4} color="#06b6d4" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.6} castShadow />

        {/* Environnement */}
        <Environment preset="studio" />

        {/* Contrôles de caméra */}
        <CameraControls ref={cameraControlsRef} />

        {/* Modèle du cerveau GLB avec Suspense */}
        <Suspense fallback={null}>
          <BrainGLBModel
            onAnnotationClick={handleAnnotationClick}
            hoveredAnnotation={hoveredAnnotation}
            setHoveredAnnotation={setHoveredAnnotation}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Préchargement du modèle GLB
useGLTF.preload("/models/brain.glb")

export default BrainViewer