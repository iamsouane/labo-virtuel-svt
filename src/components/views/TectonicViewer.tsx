//src/components/views/TectonicViewer
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Text } from "@react-three/drei"
import { useRef, useState, useMemo, useEffect } from "react"
import type * as THREE from "three"
import { Play, Pause, RotateCcw, Info, Mountain, Thermometer, Activity, Zap } from "lucide-react"

type Step = {
  start: number // temps en secondes
  end: number
  title: string
  explanation: string
  scientificData: string[]
  temperature: number
  pressure: number
  seismicActivity: number
  geologicalProcess: string
}

const steps: Step[] = [
  {
    start: 0,
    end: 2,
    title: "Formation et mouvement des plaques",
    explanation: "Deux plaques continentales se déplacent lentement l'une vers l'autre sur le manteau terrestre.",
    scientificData: [
      "Vitesse moyenne : 2 à 10 cm/an",
      "Cause : convection dans le manteau",
      "Épaisseur plaques continentales : 30-70 km",
      "Densité similaire : 2.7 g/cm³",
    ],
    temperature: 1300,
    pressure: 1,
    seismicActivity: 2,
    geologicalProcess: "Dérive des continents",
  },
  {
    start: 2,
    end: 4,
    title: "Convergence des plaques continentales",
    explanation:
      "Les deux plaques continentales convergent. Aucune ne peut plonger sous l'autre car elles ont la même densité.",
    scientificData: [
      "Densité égale : pas de subduction",
      "Résistance à la compression élevée",
      "Début de déformation plastique",
      "Accumulation de contraintes",
    ],
    temperature: 1200,
    pressure: 10,
    seismicActivity: 4,
    geologicalProcess: "Convergence continentale",
  },
  {
    start: 4,
    end: 6,
    title: "Compression et plissement",
    explanation:
      "Les plaques se compriment et se froissent. La croûte se plisse et se déforme, créant les premières élévations.",
    scientificData: [
      "Compression horizontale intense",
      "Formation de plis et anticlinaux",
      "Épaississement crustal : jusqu'à 80 km",
      "Début de soulèvement : 1-5 mm/an",
    ],
    temperature: 1100,
    pressure: 20,
    seismicActivity: 7,
    geologicalProcess: "Plissement orogénique",
  },
  {
    start: 6,
    end: 8,
    title: "Formation de chaînes de montagnes",
    explanation: "La compression continue forme des chaînes de montagnes. Les roches se plissent et se fracturent.",
    scientificData: [
      "Soulèvement maximal : 5-10 mm/an",
      "Formation de failles inverses",
      "Métamorphisme régional intense",
      "Altitude : jusqu'à 8000m+",
    ],
    temperature: 1000,
    pressure: 25,
    seismicActivity: 8,
    geologicalProcess: "Orogenèse de collision",
  },
  {
    start: 8,
    end: 10,
    title: "Stabilisation et relief mature",
    explanation: "La chaîne de montagnes se stabilise. L'érosion commence à modeler le relief formé par la collision.",
    scientificData: [
      "Équilibre isostatique progressif",
      "Érosion différentielle : 0.1-1 mm/an",
      "Ajustement gravitaire",
      "Cycle orogénique : 100-500 Ma",
    ],
    temperature: 800,
    pressure: 15,
    seismicActivity: 3,
    geologicalProcess: "Équilibre post-orogénique",
  },
]

// Composant pour les effets de particules sismiques
const SeismicParticles = ({ intensity }: { intensity: number }) => {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, particleCount } = useMemo(() => {
    const maxParticles = 200
    const actualCount = Math.floor(Math.min(intensity * 20, maxParticles))
    const posArray = new Float32Array(maxParticles * 3)

    for (let i = 0; i < maxParticles * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 8
      posArray[i + 1] = Math.random() * 3
      posArray[i + 2] = (Math.random() - 0.5) * 8
    }

    return { positions: posArray, particleCount: actualCount }
  }, [])

  useFrame((state) => {
    if (pointsRef.current && intensity > 0) {
      pointsRef.current.rotation.y += 0.005 * intensity

      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime * 3 + i) * 0.005 * intensity
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  if (intensity < 3) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={intensity > 7 ? "#ff3333" : intensity > 5 ? "#ff6633" : "#ffaa33"}
        transparent
        opacity={0.7}
      />
    </points>
  )
}

// Composant pour les effets thermiques
const ThermalGlow = ({ temperature, position }: { temperature: number; position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  if (temperature < 1000) return null

  const intensity = (temperature - 1000) / 400
  const color = `hsl(${20 + intensity * 40}, 100%, ${50 + intensity * 20}%)`

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  )
}

// Composant pour simuler les plaques continentales avec compression
const TectonicPlates = ({
  animationTime,
  speed,
  resetSignal,
}: {
  animationTime: number
  speed: number
  resetSignal: boolean
  isResetting: boolean
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const leftPlateRef = useRef<THREE.Group>(null)
  const rightPlateRef = useRef<THREE.Group>(null)
  const mountainChainRef = useRef<THREE.Group>(null)
  const compressionZoneRef = useRef<THREE.Group>(null)

  const adjustedTime = animationTime * speed

  useFrame(() => {
    if (!leftPlateRef.current || !rightPlateRef.current || !mountainChainRef.current || !compressionZoneRef.current)
      return

    const progress = Math.min(adjustedTime / 10, 1)

    // Phase 1: Approche des plaques (0-0.4)
    if (progress <= 0.4) {
      const approachProgress = progress / 0.4

      // Plaque gauche se déplace vers le centre
      leftPlateRef.current.position.x = -6 + approachProgress * 2.5
      leftPlateRef.current.rotation.z = 0
      leftPlateRef.current.scale.x = 1

      // Plaque droite se déplace vers le centre
      rightPlateRef.current.position.x = 6 - approachProgress * 2.5
      rightPlateRef.current.rotation.z = 0
      rightPlateRef.current.scale.x = 1

      // Masquer les montagnes
      mountainChainRef.current.scale.y = 0
      mountainChainRef.current.visible = false
      compressionZoneRef.current.visible = false
    }

    // Phase 2: Début de compression (0.4-0.6)
    else if (progress <= 0.6) {
      const compressionProgress = (progress - 0.4) / 0.2

      // Les plaques se rapprochent et commencent à se comprimer
      leftPlateRef.current.position.x = -3.5 + compressionProgress * 0.5
      leftPlateRef.current.rotation.z = compressionProgress * 0.1
      leftPlateRef.current.scale.x = 1 - compressionProgress * 0.1

      rightPlateRef.current.position.x = 3.5 - compressionProgress * 0.5
      rightPlateRef.current.rotation.z = compressionProgress * -0.1
      rightPlateRef.current.scale.x = 1 - compressionProgress * 0.1

      // Début d'apparition des montagnes
      mountainChainRef.current.visible = true
      mountainChainRef.current.scale.y = compressionProgress * 0.3
      compressionZoneRef.current.visible = true
      compressionZoneRef.current.scale.y = compressionProgress
    }

    // Phase 3: Compression maximale et formation de montagnes (0.6-1.0)
    else {
      const mountainProgress = (progress - 0.6) / 0.4

      // Compression maximale des plaques
      leftPlateRef.current.position.x = -3 + mountainProgress * 0.3
      leftPlateRef.current.rotation.z = 0.1 + mountainProgress * 0.2
      leftPlateRef.current.scale.x = 0.9 - mountainProgress * 0.1

      rightPlateRef.current.position.x = 3 - mountainProgress * 0.3
      rightPlateRef.current.rotation.z = -0.1 - mountainProgress * 0.2
      rightPlateRef.current.scale.x = 0.9 - mountainProgress * 0.1

      // Croissance complète des montagnes
      const mountainHeight = 0.3 + mountainProgress * 1.5
      mountainChainRef.current.scale.y = mountainHeight
      mountainChainRef.current.position.y = mountainProgress * 0.5

      // Zone de compression active
      compressionZoneRef.current.rotation.y += 0.01
    }
  })

  useEffect(() => {
    if (resetSignal) {
      if (leftPlateRef.current) {
        leftPlateRef.current.position.set(-6, 0, 0)
        leftPlateRef.current.rotation.set(0, 0, 0)
        leftPlateRef.current.scale.set(1, 1, 1)
      }
      if (rightPlateRef.current) {
        rightPlateRef.current.position.set(6, 0, 0)
        rightPlateRef.current.rotation.set(0, 0, 0)
        rightPlateRef.current.scale.set(1, 1, 1)
      }
      if (mountainChainRef.current) {
        mountainChainRef.current.scale.set(1, 0, 1)
        mountainChainRef.current.position.set(0, 0, 0)
        mountainChainRef.current.visible = false
      }
      if (compressionZoneRef.current) {
        compressionZoneRef.current.visible = false
      }
    }
  }, [resetSignal])

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Plaque continentale gauche */}
      <group ref={leftPlateRef}>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[5, 1.4, 4]} />
          <meshStandardMaterial color="#16a34a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[5, 0.2, 4]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5, 4]} />
          <meshStandardMaterial color="#22c55e" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Plaque continentale droite */}
      <group ref={rightPlateRef}>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[5, 1.4, 4]} />
          <meshStandardMaterial color="#1e40af" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[5, 0.2, 4]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5, 4]} />
          <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Chaîne de montagnes formée par compression */}
      <group ref={mountainChainRef} position={[0, 0, 0]}>
        {/* Montagne principale centrale */}
        <mesh position={[0, 1, 0]}>
          <coneGeometry args={[1.5, 4, 8]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>

        {/* Chaîne de montagnes */}
        {[...Array(7)].map((_, i) => {
          const x = (i - 3) * 0.8
          const height = 1.5 + Math.random() * 1.5
          const width = 0.4 + Math.random() * 0.4
          return (
            <mesh key={i} position={[x, height / 2, 0]}>
              <coneGeometry args={[width, height, 6]} />
              <meshStandardMaterial color="#a855f7" />
            </mesh>
          )
        })}

        {/* Montagnes secondaires en arrière-plan */}
        {[...Array(5)].map((_, i) => {
          const x = (i - 2) * 1.2
          const z = -1.5 - Math.random() * 0.5
          const height = 0.8 + Math.random() * 1
          return (
            <mesh key={`back-${i}`} position={[x, height / 2, z]}>
              <coneGeometry args={[0.3 + Math.random() * 0.3, height, 6]} />
              <meshStandardMaterial color="#9333ea" />
            </mesh>
          )
        })}
      </group>

      {/* Zone de compression et plissement */}
      <group ref={compressionZoneRef} position={[0, 0, 0]}>
        {/* Lignes de plissement */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0, 0.2, (i - 2) * 0.4]} rotation={[0, 0, Math.sin(i) * 0.3]}>
            <boxGeometry args={[4, 0.1, 0.1]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
        ))}

        {/* Zone de déformation */}
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.5, 16]} />
          <meshStandardMaterial color="#dc2626" transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Manteau terrestre */}
      <mesh position={[0, -3, 0]}>
        <boxGeometry args={[14, 2, 6]} />
        <meshStandardMaterial color="#ea580c" />
      </mesh>

      {/* Labels 3D */}
      <Text position={[-4, 0.5, 0]} fontSize={0.15} color="#22c55e" anchorX="center">
        Plaque Continentale A
      </Text>
      <Text position={[4, 0.5, 0]} fontSize={0.15} color="#3b82f6" anchorX="center">
        Plaque Continentale B
      </Text>
      {adjustedTime > 4 && (
        <Text position={[0, 2.5, 0]} fontSize={0.12} color="#8b5cf6" anchorX="center">
          Chaîne de Montagnes
        </Text>
      )}
    </group>
  )
}

export default function TectonicViewer() {
  const [control, setControl] = useState<"play" | "pause" | "reset">("pause")
  const [step, setStep] = useState<Step | null>(null)
  const [animationTime, setAnimationTime] = useState(0)
  const [speed, setSpeed] = useState(1)
  const animationRef = useRef<number | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const [isResetting, setIsResetting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false) // Nouvel état pour le chargement

  const totalDuration = 10

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Mountain size={32} className="text-purple-500 animate-pulse" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Chargement de la simulation tectonique...</h2>
          <p className="text-purple-200 max-w-md mx-auto">
            Préparation des plaques continentales et des données géologiques
          </p>
          <div className="pt-4">
            <div className="h-1 w-64 mx-auto bg-purple-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-1000"
                style={{ width: `${Math.min(100, (Date.now() % 2000) / 20)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full">
              <Mountain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Collision de Plaques Continentales
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Découvrez comment la compression de deux plaques continentales forme les chaînes de montagnes
          </p>
        </div>

        {/* Contenu principal */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Visualiseur 3D */}
          <div className="lg:col-span-2">
            <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900">
              <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <pointLight position={[0, 2, 0]} intensity={0.5} color="#8b5cf6" />
                <Environment preset="sunset" />
                <TectonicPlates
                  animationTime={animationTime}
                  speed={speed}
                  resetSignal={!!resetKey}
                  isResetting={isResetting}
                />
                {/* Effets visuels basés sur l'étape actuelle */}
                {step && (
                  <>
                    <SeismicParticles intensity={step.seismicActivity} />
                    <ThermalGlow temperature={step.temperature} position={[0, 0, 0]} />
                  </>
                )}
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
              </Canvas>

              {/* Barre de progression */}
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-black/30 backdrop-blur-md rounded-full p-2">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out"
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
                    className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
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
                  className="w-64 accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Panneau d'informations */}
          <div className="space-y-6">
            {/* Étape actuelle */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Étape Actuelle</h2>
              </div>
              {!step ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-slate-300 text-lg">Démarrez l'animation pour explorer le processus</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-600/10 border border-purple-500/20 rounded-xl">
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">{step.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{step.explanation}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                      Données Scientifiques
                    </h4>
                    <ul className="space-y-2">
                      {step.scientificData.map((data, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
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
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300 text-sm">Pression: {step.pressure} GPa</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
                      <Activity className="w-4 h-4 text-green-400" />
                      <span className="text-slate-300 text-sm">Activité sismique: {step.seismicActivity}/10</span>
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
                        ? "bg-gradient-to-r from-purple-500/20 to-blue-600/20 border-purple-500/40"
                        : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50"
                      }`}
                    onClick={() => setAnimationTime((s.start + s.end) / 2 / speed)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step?.title === s.title
                            ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white"
                            : "bg-slate-600 text-slate-300"
                          }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span
                          className={`font-medium block ${step?.title === s.title ? "text-purple-400" : "text-slate-300"
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
      </div>
    </div>
  )
}