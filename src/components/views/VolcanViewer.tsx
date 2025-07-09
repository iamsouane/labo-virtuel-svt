//src/compoentns/views/VolcanViewer
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Points } from "@react-three/drei"
import { useEffect, useRef, useState, useMemo } from "react"
import type * as THREE from "three"
import { Play, Pause, RotateCcw, Info, Flame, Thermometer, Activity, Zap } from "lucide-react"

type Step = {
  start: number
  end: number
  title: string
  explanation: string
  scientificData: string[]
  temperature: number
  pressure: number
  depth: number
}

const steps: Step[] = [
  {
    start: 0,
    end: 3,
    title: "Subduction de la plaque océanique",
    explanation: "La plaque océanique dense plonge sous la plaque continentale, créant une zone de subduction.",
    scientificData: ["Vitesse de subduction: 2-10 cm/an", "Angle de plongée: 30-90°", "Profondeur: jusqu'à 700 km"],
    temperature: 1200,
    pressure: 3.5,
    depth: 100,
  },
  {
    start: 3,
    end: 6,
    title: "Fusion partielle et formation du magma",
    explanation: "L'eau libérée par la plaque subductée abaisse le point de fusion du manteau, créant du magma.",
    scientificData: [
      "Température de fusion: 1200-1400°C",
      "Composition: andésitique à dacitique",
      "Taux de fusion: 10-30%",
    ],
    temperature: 1350,
    pressure: 2.8,
    depth: 80,
  },
  {
    start: 6,
    end: 9,
    title: "Ascension du magma",
    explanation: "Le magma moins dense remonte à travers la croûte terrestre via des conduits et des fissures.",
    scientificData: [
      "Vitesse d'ascension: 0.1-10 m/s",
      "Pression magmatique: 50-200 MPa",
      "Formation de dykes et sills",
    ],
    temperature: 1100,
    pressure: 1.5,
    depth: 30,
  },
  {
    start: 9,
    end: 12,
    title: "Éruption volcanique",
    explanation: "Le magma atteint la surface, formant un volcan et produisant des coulées de lave et des projections.",
    scientificData: [
      "Température de la lave: 800-1200°C",
      "Débit d'éruption: 1-1000 m³/s",
      "Types: effusive ou explosive",
    ],
    temperature: 1000,
    pressure: 0.1,
    depth: 0,
  },
]

const SmokeParticles = ({ active }: { active: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null)

  const particleCount = 200
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.2
      pos[i * 3 + 1] = Math.random() * 0.3
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2
    }
    return pos
  }, [])

  useFrame(() => {
    if (!pointsRef.current || !active) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] += 0.02 // Move up
      if (positions[i * 3 + 1] > 2.5) {
        // Réduire la hauteur maximale
        positions[i * 3 + 1] = 0
        positions[i * 3] = (Math.random() - 0.5) * 0.2
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={pointsRef} positions={positions}>
      <pointsMaterial color="#666666" size={0.03} transparent opacity={0.6} sizeAttenuation={true} />
    </Points>
  )
}

const LavaParticles = ({ active, intensity }: { active: boolean; intensity: number }) => {
  const pointsRef = useRef<THREE.Points>(null)

  const particleCount = 150
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.15
      pos[i * 3 + 1] = Math.random() * 0.2
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.15
    }
    return pos
  }, [])

  useFrame(() => {
    if (!pointsRef.current || !active) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] += 0.05 * intensity
      positions[i * 3] += (Math.random() - 0.5) * 0.01
      positions[i * 3 + 2] += (Math.random() - 0.5) * 0.01

      if (positions[i * 3 + 1] > 1.8) {
        // Hauteur réduite pour dépasser légèrement le cône
        positions[i * 3 + 1] = 0
        positions[i * 3] = (Math.random() - 0.5) * 0.15
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.15
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={pointsRef} positions={positions}>
      <pointsMaterial color="#FF4500" size={0.04} transparent opacity={0.8} sizeAttenuation={true} />
    </Points>
  )
}

// Composant principal du modèle 3D simplifié
const VolcanModel = ({
  animationTime,
  speed,
  resetSignal,
  isResetting,
}: {
  animationTime: number
  speed: number
  resetSignal: boolean
  isResetting: boolean
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const oceanicPlateRef = useRef<THREE.Mesh>(null)
  const magmaChamberRef = useRef<THREE.Mesh>(null)
  const magmaRiseRef = useRef<THREE.Mesh>(null)
  const volcanoRef = useRef<THREE.Mesh>(null)

  const adjustedTime = animationTime * speed

  const isFinalStage = adjustedTime >= 9
  const eruptionProgress = Math.min(Math.max((adjustedTime - 9) / 3, 0), 1)

  useFrame(() => {
    if (!oceanicPlateRef.current) return

    // Étape 1: Subduction (0-3s)
    if (adjustedTime <= 3) {
      const progress = adjustedTime / 3
      oceanicPlateRef.current.position.x = -2 + progress * 1.5
      oceanicPlateRef.current.position.y = -0.5 - progress * 1.5
      oceanicPlateRef.current.rotation.z = progress * -0.3
    }

    // Étape 2: Formation du magma (3-6s)
    if (adjustedTime > 3 && adjustedTime <= 6 && magmaChamberRef.current) {
      const progress = (adjustedTime - 3) / 3
      magmaChamberRef.current.scale.setScalar(progress)
    }

    // Étape 3: Remontée du magma (6-9s)
    if (adjustedTime > 6 && adjustedTime <= 9 && magmaRiseRef.current) {
      const progress = (adjustedTime - 6) / 3
      magmaRiseRef.current.scale.y = progress * 3
      magmaRiseRef.current.position.y = progress * 1.5
    }

    // Étape 4: Formation du volcan (9-12s)
    if (!isResetting && adjustedTime > 9 && volcanoRef.current) {
      const progress = Math.min((adjustedTime - 9) / 3, 1)
      volcanoRef.current.scale.y = progress
    }
  })
  useEffect(() => {
    if (resetSignal) {
      if (oceanicPlateRef.current) {
        oceanicPlateRef.current.position.set(-2, -0.5, 0)
        oceanicPlateRef.current.rotation.set(0, 0, 0)
      }
      if (magmaChamberRef.current) {
        magmaChamberRef.current.scale.set(0, 0, 0)
      }
      if (magmaRiseRef.current) {
        magmaRiseRef.current.scale.set(1, 0, 1)
        magmaRiseRef.current.position.set(0, -0.5, 0)
      }
      if (volcanoRef.current) {
        volcanoRef.current.scale.set(1, 0, 1)
      }
    }
  }, [resetSignal])

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Manteau terrestre */}
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[10, 2, 6]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Plaque océanique */}
      <mesh ref={oceanicPlateRef} position={[-2, -0.5, 0]}>
        <boxGeometry args={[4, 0.8, 6]} />
        <meshStandardMaterial color="#2C5282" />
      </mesh>

      {/* Plaque continentale */}
      <mesh position={[2, -0.5, 0]}>
        <boxGeometry args={[4, 0.8, 6]} />
        <meshStandardMaterial color="#68D391" />
      </mesh>

      {/* Chambre magmatique */}
      <mesh ref={magmaChamberRef} position={[0, -1.5, 0]} scale={0}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#FF4500" emissive="#FF2200" emissiveIntensity={0.5} />
      </mesh>

      {/* Conduit magmatique */}
      <mesh ref={magmaRiseRef} position={[0, -0.5, 0]} scale={[1, 0, 1]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color="#FF6600" emissive="#FF3300" emissiveIntensity={0.3} />
      </mesh>

      {/* Cône volcanique */}
      <mesh ref={volcanoRef} position={[0, 0.0, 0]} scale={[1, 0, 1]}>
        <coneGeometry args={[1.5, 6.0, 12]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Labels 3D */}
      <Text position={[-2, 0.5, 0]} fontSize={0.15} color="#2C5282" anchorX="center">
        Plaque Océanique
      </Text>
      <Text position={[2, 0.5, 0]} fontSize={0.15} color="#68D391" anchorX="center">
        Plaque Continentale
      </Text>
      <Text position={[0, -1.8, 0]} fontSize={0.12} color="#FF4500" anchorX="center">
        Chambre Magmatique
      </Text>

      {/* Effets de particules */}
      {isFinalStage && !isResetting && (
        <group position={[0, 1.3, 0]}>
          {" "}
          {/* Position ajustée pour être au sommet du cône */}
          <SmokeParticles active />
          <LavaParticles active intensity={eruptionProgress} />
        </group>
      )}
    </group>
  )



}

// Composant principal
export default function VolcanViewer() {
  const [control, setControl] = useState<"play" | "pause" | "reset">("pause")
  const [step, setStep] = useState<Step | null>(null)
  const [animationTime, setAnimationTime] = useState(0)
  const [speed, setSpeed] = useState(1)
  const animationRef = useRef<number | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const [isResetting, setIsResetting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false) // Nouvel état pour le chargement

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

      // Attendre un petit moment pour permettre le reset complet
      setTimeout(() => {
        setIsResetting(false)
      }, 100) // 100ms suffit
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [control, animationTime, speed])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-200 border-t-orange-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Flame size={32} className="text-orange-500 animate-pulse" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Chargement de la simulation volcanique...</h2>
          <p className="text-orange-200 max-w-md mx-auto">
            Préparation du magma et des plaques tectoniques
          </p>
          <div className="pt-4">
            <div className="h-1 w-64 mx-auto bg-orange-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-1000"
                style={{ width: `${Math.min(100, (Date.now() % 2000) / 20)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Formation des Volcans
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Découvrez le processus fascinant de formation des volcans à travers une simulation 3D interactive
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
                <pointLight position={[0, 2, 0]} intensity={0.5} color="#FF4500" />
                <Environment preset="sunset" />
                <VolcanModel animationTime={animationTime} speed={speed} resetSignal={!!resetKey} isResetting={isResetting} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
              </Canvas>

              {/* Barre de progression */}
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-black/30 backdrop-blur-md rounded-full p-2">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 ease-out"
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
                    className="p-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
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
                  className="w-64 accent-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Panneau d'informations */}
          <div className="space-y-6">
            {/* Étape actuelle */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">Étape Actuelle</h2>
              </div>

              {!step ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-slate-300 text-lg">Démarrez l'animation pour explorer le processus</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-600/10 border border-orange-500/20 rounded-xl">
                    <h3 className="text-lg font-semibold text-orange-400 mb-2">{step.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{step.explanation}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                      Données Scientifiques
                    </h4>
                    <ul className="space-y-2">
                      {step.scientificData.map((data, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
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
                      <span className="text-slate-300 text-sm">Profondeur: {step.depth} km</span>
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
                      ? "bg-gradient-to-r from-orange-500/20 to-red-600/20 border-orange-500/40"
                      : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50"
                      }`}
                    onClick={() => setAnimationTime((s.start + s.end) / 2 / speed)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step?.title === s.title
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                          : "bg-slate-600 text-slate-300"
                          }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span
                          className={`font-medium block ${step?.title === s.title ? "text-orange-400" : "text-slate-300"}`}
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