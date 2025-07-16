//src/components/views/WaterCycleView
import type React from "react"
import { useRef, useState, useEffect, useMemo, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, useAnimations, Points, Html } from "@react-three/drei"
import type * as THREE from "three"
import { Play, Pause, RotateCcw, Info, Droplets, Thermometer, Activity } from "lucide-react"
import type { WaterCycleAnnotation, Step } from "../../types/visualisationWaterCycleTypes"

// Étapes du cycle de l'eau avec timing
const steps: Step[] = [
  {
    start: 0,
    end: 3,
    title: "Évaporation des océans",
    explanation: "L'énergie solaire chauffe la surface des océans, transformant l'eau liquide en vapeur d'eau.",
    scientificData: [
      "Température de surface: 15-30°C",
      "Énergie solaire: 1361 W/m²",
      "Taux d'évaporation: 1-10 mm/jour",
    ],
    temperature: 25,
    humidity: 85,
    altitude: 0,
  },
  {
    start: 3,
    end: 6,
    title: "Ascension et refroidissement",
    explanation: "La vapeur d'eau s'élève dans l'atmosphère où elle se refroidit progressivement avec l'altitude.",
    scientificData: [
      "Gradient thermique: -6.5°C/km",
      "Altitude de condensation: 2-12 km",
      "Pression atmosphérique décroissante",
    ],
    temperature: -10,
    humidity: 95,
    altitude: 5000,
  },
  {
    start: 6,
    end: 9,
    title: "Formation des nuages",
    explanation:
      "La vapeur d'eau se condense autour de noyaux de condensation pour former des gouttelettes et des nuages.",
    scientificData: [
      "Taille des gouttelettes: 5-20 μm",
      "Noyaux de condensation: 100-1000/cm³",
      "Types de nuages: cumulus, stratus, cirrus",
    ],
    temperature: -15,
    humidity: 100,
    altitude: 8000,
  },
  {
    start: 9,
    end: 12,
    title: "Précipitations et retour",
    explanation:
      "Les gouttelettes s'agglomèrent et tombent sous forme de pluie, retournant vers les océans et la terre.",
    scientificData: ["Vitesse de chute: 3-9 m/s", "Taille des gouttes: 0.5-6 mm", "Cycle complet: 8-10 jours"],
    temperature: 20,
    humidity: 90,
    altitude: 0,
  },
]

// Remplacer les annotations existantes par celles basées sur le modèle GLB
const waterCycleAnnotations: WaterCycleAnnotation[] = [
  {
    id: "sun",
    position: [0, 2.2, 0.8],
    title: "Énergie Solaire",
    description: "Le soleil fournit l'énergie nécessaire pour faire évaporer l'eau des océans et alimenter le cycle.",
    color: "#FFD700",
    process: "Source d'énergie du cycle",
    scientificData: [
      "Puissance solaire : 1361 W/m²",
      "Énergie UV : 280-400 nm",
      "Température surface : 5778 K",
      "Évaporation quotidienne : 1400 km³",
    ],
  },
  {
    id: "ocean-evaporation",
    position: [2, 0.5, 1],
    title: "Évaporation Océanique",
    description: "L'eau de l'océan s'évapore sous l'effet de la chaleur solaire, formant de la vapeur d'eau invisible.",
    color: "#1E90FF",
    process: "Changement d'état liquide → gazeux",
    scientificData: [
      "Température surface : 15-30°C",
      "Taux d'évaporation : 86% du total",
      "Volume annuel : 434 000 km³",
      "Salinité concentrée par évaporation",
    ],
  },
  {
    id: "mountain-snow",
    position: [-1.5, 1.2, -1.5],
    title: "Neige en Montagne",
    description: "En altitude, les précipitations tombent sous forme de neige qui s'accumule sur les sommets.",
    color: "#F0F8FF",
    process: "Précipitation solide",
    scientificData: [
      "Température < 0°C",
      "Altitude > 1500m",
      "Stockage saisonnier d'eau",
      "Fonte printanière progressive",
    ],
  },
  {
    id: "snow-cloud",
    position: [-2, 1.8, -0.5],
    title: "Nuage de Neige",
    description: "Nuages froids qui libèrent leurs précipitations sous forme de flocons de neige.",
    color: "#B0E0E6",
    process: "Condensation et précipitation froide",
    scientificData: [
      "Température < -10°C",
      "Cristaux de glace hexagonaux",
      "Humidité relative > 100%",
      "Formation à 2000-4000m d'altitude",
    ],
  },
  {
    id: "rain-cloud",
    position: [1.5, 1.5, 0],
    title: "Nuage de Pluie",
    description: "Nuages chargés d'humidité qui libèrent leurs précipitations sous forme de pluie.",
    color: "#4682B4",
    process: "Condensation et précipitation liquide",
    scientificData: [
      "Température > 0°C",
      "Gouttelettes 0.5-6mm",
      "Vitesse chute : 3-9 m/s",
      "Formation par coalescence",
    ],
  },
  {
    id: "surface-runoff",
    position: [-0.5, 1, 0.4],
    title: "Ruissellement de Surface",
    description: "L'eau de pluie et de fonte s'écoule en surface vers les rivières et l'océan.",
    color: "#20B2AA",
    process: "Écoulement gravitaire",
    scientificData: [
      "Vitesse : 0.1-3 m/s",
      "Érosion et transport sédiments",
      "37% des précipitations",
      "Retour rapide vers l'océan",
    ],
  },
  {
    id: "groundwater-flow",
    position: [-1, -0.1, 0],
    title: "Écoulement Souterrain",
    description: "L'eau infiltrée circule lentement dans le sol et les roches vers l'océan.",
    color: "#8B4513",
    process: "Infiltration et circulation souterraine",
    scientificData: [
      "Vitesse : mm/jour à m/an",
      "Filtration naturelle",
      "Recharge des aquifères",
      "Résurgences et sources",
    ],
  },
  {
    id: "mountain-runoff",
    position: [-1.8, 0.7, -0.9],
    title: "Ruissellement Montagnard",
    description: "L'eau de fonte des neiges et glaciers s'écoule des montagnes vers les vallées.",
    color: "#87CEEB",
    process: "Fonte et écoulement alpin",
    scientificData: [
      "Débit saisonnier variable",
      "Érosion glaciaire intense",
      "Formation de torrents",
      "Alimentation des rivières",
    ],
  },
]

// Particules de vapeur d'eau
const WaterVaporParticles = ({ active, intensity }: { active: boolean; intensity: number }) => {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 300

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4
      pos[i * 3 + 1] = Math.random() * 0.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return pos
  }, [])

  useFrame(() => {
    if (!pointsRef.current || !active) return
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] += 0.02 * intensity
      if (positions[i * 3 + 1] > 4) {
        positions[i * 3 + 1] = 0
        positions[i * 3] = (Math.random() - 0.5) * 4
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={pointsRef} positions={positions}>
      <pointsMaterial color="#87CEEB" size={0.02} transparent opacity={0.6} sizeAttenuation={true} />
    </Points>
  )
}

// Particules de pluie
const RainParticles = ({ active }: { active: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6
      pos[i * 3 + 1] = Math.random() * 4 + 2
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return pos
  }, [])

  useFrame(() => {
    if (!pointsRef.current || !active) return
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] -= 0.1
      if (positions[i * 3 + 1] < -1) {
        positions[i * 3 + 1] = Math.random() * 4 + 2
        positions[i * 3] = (Math.random() - 0.5) * 6
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={pointsRef} positions={positions}>
      <pointsMaterial color="#4682B4" size={0.03} transparent opacity={0.8} sizeAttenuation={true} />
    </Points>
  )
}

// Ajouter le composant AnnotationPoint après les particules
const AnnotationPoint: React.FC<{
  annotation: WaterCycleAnnotation
  onClick: (annotation: WaterCycleAnnotation) => void
  isHovered: boolean
  onHover: (id: string | null) => void
}> = ({ annotation, onClick, isHovered, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      if (isHovered) {
        meshRef.current.scale.setScalar(1.5 + Math.sin(state.clock.elapsedTime * 12) * 0.2)
      } else {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.1)
      }
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02
    }
  })

  return (
    <group>
      {/* Anneau rotatif */}
      <mesh ref={ringRef} position={annotation.position} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.015, 8, 16]} />
        <meshStandardMaterial
          color={annotation.color}
          emissive={annotation.color}
          emissiveIntensity={0.3}
          transparent
          opacity={isHovered ? 0.9 : 0.6}
        />
      </mesh>

      {/* Point d'annotation principal */}
      <mesh
        ref={meshRef}
        position={annotation.position}
        onClick={() => onClick(annotation)}
        onPointerEnter={() => onHover(annotation.id)}
        onPointerLeave={() => onHover(null)}
      >
        <sphereGeometry args={[0.06, 20, 20]} />
        <meshStandardMaterial
          color={isHovered ? "#ffffff" : annotation.color}
          emissive={annotation.color}
          emissiveIntensity={isHovered ? 0.9 : 0.5}
          transparent
          opacity={0.95}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* Ligne de connexion vers l'élément */}
      <mesh position={[annotation.position[0], annotation.position[1] - 0.15, annotation.position[2]]}>
        <cylinderGeometry args={[0.01, 0.02, 0.3]} />
        <meshStandardMaterial
          color={annotation.color}
          transparent
          opacity={isHovered ? 1 : 0.7}
          emissive={annotation.color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Tooltip amélioré */}
      {isHovered && (
        <Html
          position={[annotation.position[0], annotation.position[1] + 0.4, annotation.position[2]]}
          distanceFactor={8}
        >
          <div
            className="bg-black/95 text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap pointer-events-none shadow-2xl border-2 max-w-xs"
            style={{ borderColor: annotation.color }}
          >
            <div className="font-bold text-base mb-1" style={{ color: annotation.color }}>
              {annotation.title}
            </div>
            <div className="text-xs text-gray-300 mb-2">{annotation.process}</div>
            <div className="text-xs text-gray-400">Cliquez pour explorer</div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Modifier le composant AnimatedWaterCycleModel pour inclure les annotations
const AnimatedWaterCycleModel = ({
  control,
  animationTime,
  speed,
  resetSignal,
  isResetting,
  onAnnotationClick,
  hoveredAnnotation,
  setHoveredAnnotation,
}: {
  control: "play" | "pause" | "reset"
  animationTime: number
  speed: number
  resetSignal: boolean
  isResetting: boolean
  onAnnotationClick: (annotation: WaterCycleAnnotation) => void
  hoveredAnnotation: string | null
  setHoveredAnnotation: (id: string | null) => void
}) => {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF("/models/water_cycle.glb")
  const { actions } = useAnimations(animations, group)
  const actionName = animations[0]?.name
  const action = actions ? actions[actionName] : null

  const adjustedTime = animationTime * speed
  const isEvaporationActive = adjustedTime >= 0 && adjustedTime <= 6
  const isRainActive = adjustedTime >= 9

  useEffect(() => {
    if (!action) return
    action.timeScale = 0.3
    if (control === "play") {
      action.reset().play()
      action.paused = false
    } else if (control === "pause") {
      action.paused = true
    } else if (control === "reset") {
      action.reset().stop()
    }
  }, [control, action])

  useEffect(() => {
    if (resetSignal && action) {
      action.reset().stop()
    }
  }, [resetSignal, action])

  return (
    <group ref={group}>
      <primitive object={scene} />

      {/* Points d'annotation sur le modèle GLB */}
      {waterCycleAnnotations.map((annotation) => (
        <AnnotationPoint
          key={annotation.id}
          annotation={annotation}
          onClick={onAnnotationClick}
          isHovered={hoveredAnnotation === annotation.id}
          onHover={setHoveredAnnotation}
        />
      ))}

      {/* Effets de particules */}
      {isEvaporationActive && !isResetting && (
        <group position={[2, -0.5, 0.5]}>
          <WaterVaporParticles active intensity={Math.min(adjustedTime / 3, 1)} />
        </group>
      )}

      {isRainActive && !isResetting && (
        <group position={[0, 2, 0]}>
          <RainParticles active />
        </group>
      )}
    </group>
  )
}

// Composant AnnotationPanel mis à jour
const AnnotationPanel: React.FC<{
  annotation: WaterCycleAnnotation | null
  onClose: () => void
}> = ({ annotation, onClose }) => {
  if (!annotation) return null

  return (
    <div className="fixed top-4 left-4 z-50 max-w-md">
      <div
        className="bg-white/95 backdrop-blur-sm shadow-xl border-2 rounded-2xl p-5"
        style={{ borderColor: annotation.color }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full text-white shadow-lg" style={{ backgroundColor: annotation.color }}>
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">{annotation.title}</h3>
              <p className="text-sm text-gray-600 font-medium">{annotation.process}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-4">{annotation.description}</p>

        {/* Données scientifiques */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: annotation.color }} />
            Données Scientifiques
          </h4>
          <ul className="space-y-2">
            {annotation.scientificData.map((data, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <div
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: annotation.color }}
                />
                <span className="leading-relaxed">{data}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${annotation.color}15` }}>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div
              className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: annotation.color }}
            />
            <span className="font-medium">Élément du cycle de l'eau</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant principal WaterCycleViewer
const WaterCycleViewer: React.FC = () => {
  const [control, setControl] = useState<"play" | "pause" | "reset">("pause")
  const [step, setStep] = useState<Step | null>(null)
  const [animationTime, setAnimationTime] = useState(0)
  const [speed, setSpeed] = useState(1)
  const animationRef = useRef<number | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const [isResetting, setIsResetting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false) // Nouvel état pour le chargement


  // Modifier le composant principal pour inclure les annotations
  // Dans le return du WaterCycleViewer, ajouter les états pour les annotations
  const [selectedAnnotation, setSelectedAnnotation] = useState<WaterCycleAnnotation | null>(null)
  const [hoveredAnnotation, setHoveredAnnotation] = useState<string | null>(null)

  const handleAnnotationClick = useCallback((annotation: WaterCycleAnnotation) => {
    setSelectedAnnotation(annotation)
  }, [])

  const handleCloseAnnotation = useCallback(() => {
    setSelectedAnnotation(null)
  }, [])

  const totalDuration = 12

  useEffect(() => {
    // Simuler un temps de chargement
    const timer = setTimeout(() => setIsLoaded(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (control === "play") {
      const startTime = Date.now() - animationTime * 1000
      const animate = () => {
        const currentTime = (Date.now() - startTime) / 1000
        setAnimationTime(currentTime)
        const adjustedTime = currentTime * speed
        const currentStep = steps.find((s) => adjustedTime >= s.start && adjustedTime < s.end) ?? null
        setStep(currentStep)
        if (currentTime < totalDuration / speed) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    } else if (control === "pause") {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else if (control === "reset") {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      setIsResetting(true)
      setAnimationTime(0)
      setStep(null)
      setResetKey((prev) => prev + 1)
      setTimeout(() => {
        setIsResetting(false)
      }, 100)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [control, animationTime, speed])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Droplets size={32} className="text-blue-500 animate-pulse" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Chargement du cycle de l'eau...</h2>
          <p className="text-blue-200 max-w-md mx-auto">
            Préparation de la simulation 3D et des données scientifiques
          </p>
          <div className="pt-4">
            <div className="h-1 w-64 mx-auto bg-blue-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-1000"
                style={{ width: `${Math.min(100, (Date.now() % 2000) / 20)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full shadow-md">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
              Cycle de l'Eau
            </h1>
          </div>
          <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Découvrez le processus fascinant de circulation de l'eau dans la nature à travers une simulation 3D interactive.
          </p>
        </div>

        {/* Panneau d'annotation */}
        <AnnotationPanel annotation={selectedAnnotation} onClose={handleCloseAnnotation} />

        {/* Contenu principal */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Visualiseur 3D */}
          <div className="lg:col-span-2">
            <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900">
              <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <pointLight position={[0, 2, 0]} intensity={0.5} color="#87CEEB" />
                <Environment preset="sunset" />
                {/* Modifier l'appel à AnimatedWaterCycleModel pour inclure les props d'annotation */}
                <AnimatedWaterCycleModel
                  control={control}
                  animationTime={animationTime}
                  speed={speed}
                  resetSignal={!!resetKey}
                  isResetting={isResetting}
                  onAnnotationClick={handleAnnotationClick}
                  hoveredAnnotation={hoveredAnnotation}
                  setHoveredAnnotation={setHoveredAnnotation}
                />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
              </Canvas>

              {/* Barre de progression */}
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-black/30 backdrop-blur-md rounded-full p-2">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 ease-out"
                      style={{
                        width: `${((animationTime * speed) / totalDuration) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Contrôles de vitesse */}
              <div className="absolute top-4 right-4">
                <div className="bg-black/30 backdrop-blur-md rounded-lg p-2">
                  <label className="text-white text-xs block mb-1">Vitesse: {speed}x</label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(Number.parseFloat(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>

              {/* Contrôles */}
              <div className="absolute bottom-4 left-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setControl(control === "play" ? "pause" : "play")}
                    className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    {control === "play" ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setControl("reset")}
                    className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <input
                  type="range"
                  min="0"
                  max={totalDuration}
                  step="0.1"
                  value={animationTime * speed}
                  onChange={(e) => setAnimationTime(Number.parseFloat(e.target.value) / speed)}
                  className="w-64 accent-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Panneau d'informations */}
          <div className="space-y-6">
            {/* Étape actuelle */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Étape Actuelle</h2>
              </div>
              {!step ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-slate-300 text-lg">Démarrez l'animation pour explorer le processus</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-xl">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">{step.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{step.explanation}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                      Données Scientifiques
                    </h4>
                    <ul className="space-y-2">
                      {step.scientificData.map((data, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          {data}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Mesures */}
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
                      <Thermometer className="w-4 h-4 text-red-400" />
                      <span className="text-slate-300 text-sm">Température: {step.temperature}°C</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300 text-sm">Humidité: {step.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
                      <Activity className="w-4 h-4 text-green-400" />
                      <span className="text-slate-300 text-sm">Altitude: {step.altitude} m</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Vue d'ensemble des étapes */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Processus Complet</h3>
              <div className="space-y-3">
                {steps.map((s, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${step?.title === s.title
                      ? "bg-gradient-to-r from-blue-500/20 to-cyan-600/20 border-blue-500/40"
                      : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50"
                      }`}
                    onClick={() => setAnimationTime((s.start + s.end) / 2 / speed)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step?.title === s.title
                          ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
                          : "bg-slate-600 text-slate-300"
                          }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span
                          className={`font-medium block ${step?.title === s.title ? "text-blue-400" : "text-slate-300"
                            }`}
                        >
                          {s.title}
                        </span>
                        <span className="text-xs text-slate-400">
                          {s.start}s - {s.end}s
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Instructions</h3>
          <p className="text-slate-300">
            Utilisez les contrôles pour démarrer, mettre en pause ou redémarrer l'animation. Vous pouvez également faire
            pivoter, zoomer et déplacer la vue 3D avec votre souris. Cliquez sur les étapes pour naviguer directement.
          </p>
        </div>
        {/* Légende des annotations */}
        <div className="relative top-30 left-4 z-10 max-w-xs">
          <div className="bg-black/70 backdrop-blur-sm border-blue-800 rounded-2xl p-3">
            <h4 className="text-white text-sm font-bold mb-2 flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              Éléments annotés
            </h4>
            <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
              {waterCycleAnnotations.slice(0, 6).map((annotation) => (
                <div
                  key={annotation.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1 rounded"
                  onClick={() => handleAnnotationClick(annotation)}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: annotation.color }} />
                  <span className="text-gray-300 truncate">{annotation.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compteur pour inclure les annotations */}
        <div className="absolute top-24 right-4 z-10">
          <div className="bg-blue-900/80 backdrop-blur-md border border-blue-700 rounded-2xl shadow-lg px-4 py-3">
            <div className="text-white text-center space-y-0.5">
              <div className="text-xl font-extrabold text-blue-200">{waterCycleAnnotations.length}</div>
              <div className="text-xs text-blue-100">Éléments</div>
              <div className="text-xs text-blue-100">annotés</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Préchargement du modèle GLB
useGLTF.preload("/models/water_cycle.glb")

export default WaterCycleViewer