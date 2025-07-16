//src/components/views/HeartViewer
import React, { useRef, useState, useCallback, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Html, Environment, useGLTF, Center } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { X, Loader2 } from "lucide-react"
import type { HeartAnnotation, AnnotationPanelProps, HeartModelProps, CameraControlsRef } from "../../types/visualisationHeartTypes"

// Données des annotations du cœur (positions rapprochées pour plus de précision)
const heartAnnotations: HeartAnnotation[] = [
  {
    id: "aorta",
    position: [-0.2
      , 1, -0.2],
    title: "Aorte",
    description:
      "La plus grande artère du corps humain, elle transporte le sang oxygéné du ventricule gauche vers tout l'organisme.",
    color: "#ef4444",
  },
  {
    id: "left-ventricle",
    position: [0.8, -0.5, -1],
    title: "Ventricule gauche",
    description: "Chambre principale du cœur qui pompe le sang oxygéné vers l'aorte et le reste du corps.",
    color: "#dc2626",
  },
  {
    id: "right-atrium",
    position:  [0.8, 0.5, 0.4],
    title: "Oreillette droite",
    description: "Chambre qui reçoit le sang désoxygéné en provenance des veines caves supérieure et inférieure.",
    color: "#b91c1c",
  },
  {
    id: "right-ventricle",
    position: [0.8, -0.5, 0],
    title: "Ventricule droit",
    description: "Chambre qui pompe le sang désoxygéné vers les poumons via l'artère pulmonaire.",
    color: "#991b1b",
  },
  {
    id: "left-atrium",
    position: [0.3, 0.4, -0.8],
    title: "Oreillette gauche",
    description: "Chambre qui reçoit le sang oxygéné en provenance des poumons via les veines pulmonaires.",
    color: "#7f1d1d",
  },
  {
    id: "pulmonary-artery",
    position: [0.1, 0.6, -0.1],
    title: "Artère pulmonaire",
    description: "Artère qui transporte le sang désoxygéné du ventricule droit vers les poumons.",
    color: "#f87171",
  },
  {
    id: "vena-cava",
    position:  [-0.9, 0.8, 0.3],
    title: "Veine cave",
    description: "Grandes veines qui ramènent le sang désoxygéné des tissus vers l'oreillette droite.",
    color: "#dc2626",
  },
]

// Composant du panneau d'annotation
const AnnotationPanel: React.FC<AnnotationPanelProps> = ({ annotation, onClose }) => {
  if (!annotation) return null

  return (
    <div className="absolute top-40 left-4 z-10 max-w-sm">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-red-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900">{annotation.title}</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{annotation.description}</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: annotation.color }} />
            <span className="text-xs text-gray-500">Point d'annotation</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Composant du point d'annotation 3D
const AnnotationPoint: React.FC<{
  annotation: HeartAnnotation
  onClick: (annotation: HeartAnnotation) => void
  isHovered: boolean
  onHover: (id: string | null) => void
}> = ({ annotation, onClick, isHovered, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const lineRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current && isHovered) {
      meshRef.current.scale.setScalar(1.3 + Math.sin(state.clock.elapsedTime * 8) * 0.15)
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1)
    }

    // Animation de la ligne de connexion
    if (lineRef.current && isHovered) {
      lineRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1
    } else if (lineRef.current) {
      lineRef.current.scale.y = 1
    }
  })

  // Calculer la direction vers le centre du cœur pour orienter la ligne
  const heartCenter = new THREE.Vector3(0, 0, 0)
  const annotationPos = new THREE.Vector3(...annotation.position)
  const direction = heartCenter.clone().sub(annotationPos).normalize()
  const lineLength = 0.3 // Ligne plus courte pour plus de précision

  return (
    <group>
      {/* Point d'annotation principal */}
      <mesh
        ref={meshRef}
        position={annotation.position}
        onClick={() => onClick(annotation)}
        onPointerEnter={() => onHover(annotation.id)}
        onPointerLeave={() => onHover(null)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={isHovered ? "#fbbf24" : annotation.color}
          emissive={isHovered ? "#f59e0b" : annotation.color}
          emissiveIntensity={isHovered ? 0.5 : 0.3}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Ligne de connexion courte vers le cœur */}
      <mesh
        ref={lineRef}
        position={[
          annotation.position[0] + direction.x * lineLength * 0.5,
          annotation.position[1] + direction.y * lineLength * 0.5,
          annotation.position[2] + direction.z * lineLength * 0.5,
        ]}
        lookAt={heartCenter}
      >
        <cylinderGeometry args={[0.015, 0.025, lineLength]} />
        <meshStandardMaterial
          color={annotation.color}
          transparent
          opacity={isHovered ? 0.9 : 0.6}
          emissive={annotation.color}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Point de connexion sur le cœur */}
      <mesh
        position={[
          annotation.position[0] + direction.x * lineLength,
          annotation.position[1] + direction.y * lineLength,
          annotation.position[2] + direction.z * lineLength,
        ]}
      >
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color={annotation.color}
          emissive={annotation.color}
          emissiveIntensity={0.4}
          transparent
          opacity={isHovered ? 1 : 0.8}
        />
      </mesh>

      {/* Tooltip amélioré */}
      {isHovered && (
        <Html
          position={[annotation.position[0], annotation.position[1] + 0.3, annotation.position[2]]}
          distanceFactor={6}
        >
          <div className="bg-black/95 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none shadow-xl border border-red-500/30">
            <div className="font-medium text-red-300">{annotation.title}</div>
            <div className="text-xs text-gray-300 mt-1">Cliquez pour plus d'infos</div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/95 rotate-45 border-r border-b border-red-500/30"></div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Composant du modèle de cœur GLB
const HeartGLBModel: React.FC<HeartModelProps> = ({ onAnnotationClick, hoveredAnnotation, setHoveredAnnotation }) => {
  const heartRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF("/models/heart.glb")

  // Animation de battement du cœur
  useFrame((state) => {
    if (heartRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.03
      heartRef.current.scale.setScalar(scale)

      // Rotation lente pour montrer tous les angles
      heartRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  // Cloner la scène pour éviter les conflits
  const clonedScene = scene.clone()

  // Appliquer des matériaux réalistes au modèle
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#8b1538",
          roughness: 0.4,
          metalness: 0.1,
          transparent: true,
          opacity: 0.95,
        })
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [clonedScene])

  return (
    <group ref={heartRef}>
      <Center>
        <primitive object={clonedScene} scale={2} />
      </Center>

      {/* Points d'annotation */}
      {heartAnnotations.map((annotation) => (
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
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        <div className="text-center">
          <h3 className="font-semibold text-gray-900">Chargement du modèle 3D</h3>
          <p className="text-sm text-gray-600 mt-1">Préparation du cœur humain...</p>
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
        camera.position.set(0, 0, 6) // Position plus rapprochée
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
      minDistance={2.5} // Distance minimale réduite
      maxDistance={12}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      autoRotate={false}
      autoRotateSpeed={0.5}
      dampingFactor={0.05}
      enableDamping={true}
    />
  )
})

CameraControls.displayName = "CameraControls"

// Composant principal HeartViewer
const HeartViewer: React.FC = () => {
  const [selectedAnnotation, setSelectedAnnotation] = useState<HeartAnnotation | null>(null)
  const [hoveredAnnotation, setHoveredAnnotation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const cameraControlsRef = useRef<CameraControlsRef>(null)

  const handleAnnotationClick = useCallback((annotation: HeartAnnotation) => {
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
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-900">
      {/* Indicateur de chargement */}
      {isLoading && <LoadingSpinner />}

      {/* En-tête */}
<div className="absolute top-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-md">
  <div className="max-w-4xl mx-auto px-4 py-6 text-center space-y-2">
    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
      Anatomie du Cœur Humain
    </h1>
    <p className="text-sm md:text-base text-red-100">
      Modèle 3D réaliste – Explorez les structures cardiaques
    </p>
  </div>
</div>

      {/* Panneau d'annotation */}
      <AnnotationPanel annotation={selectedAnnotation} onClose={handleCloseAnnotation} />

      {/* Contrôles */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <Button onClick={handleResetView} className="bg-red-600 hover:bg-red-700 text-white shadow-lg">
          Réinitialiser la vue
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10 max-w-xs">
        <Card className="bg-black/70 backdrop-blur-sm border-red-800">
          <CardContent className="p-3">
            <p className="text-white text-xs leading-relaxed">
              <strong className="text-red-900">Instructions:</strong>
              <br /> <strong className="text-red-900"> • Cliquez et faites glisser pour faire tourner</strong>
              <br /> <strong className="text-red-900"> • Molette pour zoomer/dézoomer</strong>
              <br /> <strong className="text-red-900"> • Survolez les points lumineux pour les infos</strong>
              <br /> <strong className="text-red-900"> • Cliquez sur un point pour voir les détails</strong>
              <br /> <strong className="text-red-900"> • Modèle 3D haute qualité de Sketchfab</strong>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compteur d'annotations */}
<div className="absolute top-24 right-4 z-20">
  <Card className="bg-red-900/80 backdrop-blur-md border-red-700 rounded-2xl shadow-lg">
    <CardContent className="p-4">
      <div className="text-center text-red-900 space-y-1">
        <div className="text-xl font-extrabold">{heartAnnotations.length}</div>
        <div className="text-xs uppercase tracking-wide">Structures</div>
        <div className="text-xs uppercase tracking-wide">anatomiques</div>
      </div>
    </CardContent>
  </Card>
</div>

      {/* Scène 3D */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }} // Position plus rapprochée
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
        shadows
        onCreated={() => setIsLoading(false)}
      >
        {/* Éclairage amélioré pour le modèle GLB */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.4} color="#ff6b6b" />
        <pointLight position={[5, -5, -5]} intensity={0.3} color="#4ecdc4" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} castShadow />

        {/* Environnement */}
        <Environment preset="studio" />

        {/* Contrôles de caméra */}
        <CameraControls ref={cameraControlsRef} />

        {/* Modèle du cœur GLB avec Suspense */}
        <Suspense fallback={null}>
          <HeartGLBModel
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
useGLTF.preload("/models/heart.glb")

export default HeartViewer