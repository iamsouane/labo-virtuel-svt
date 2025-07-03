"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Html } from "@react-three/drei"
import * as THREE from "three"
import QuizOverlay from "../../QuizPhotosynthese"

// Types pour la simulation
interface PlantState {
  health: number
  size: number
  oxygenProduction: number
  glucoseProduction: number
}

interface LabEnvironment {
  lightIntensity: number
  co2Level: number
  temperature: number
  humidity: number
}

interface DataPoint {
  time: number
  oxygen: number
  glucose: number
  health: number
}

interface Preset {
  name: string
  description: string
  icon: string
  environment: LabEnvironment
  color: string
}

interface TutorialStep {
  id: number
  title: string
  content: string
  target: string
  position: "top" | "bottom" | "left" | "right" | "center"
  action?: "click" | "hover" | "wait" | "adjust"
  actionTarget?: string
  actionValue?: number
  highlight?: boolean
  skippable?: boolean
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "facile" | "moyen" | "difficile"
  category: "equation" | "facteurs" | "processus" | "application"
}

interface QuizResult {
  score: number
  totalQuestions: number
  timeSpent: number
  answers: { questionId: number; userAnswer: number; correct: boolean }[]
}

// Étapes du tutoriel
const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: "🌱 Bienvenue dans le laboratoire !",
    content:
      "Découvrez la photosynthèse à travers cette simulation 3D interactive. Ce tutoriel vous guidera étape par étape.",
    target: "welcome",
    position: "center",
    skippable: true,
  },
  {
    id: 2,
    title: "🔬 Votre laboratoire virtuel",
    content:
      "Voici votre espace de travail 3D. Vous pouvez voir 3 plantes dans leurs pots, une lampe et l'environnement du laboratoire.",
    target: "canvas",
    position: "bottom",
    action: "wait",
  },
  {
    id: 3,
    title: "🖱️ Navigation 3D",
    content: "Cliquez et glissez pour faire tourner la vue. Utilisez la molette pour zoomer. Essayez maintenant !",
    target: "canvas",
    position: "bottom",
    action: "click",
    actionTarget: "canvas",
  },
  {
    id: 4,
    title: "🌿 Informations des plantes",
    content: "Survolez une plante pour voir ses données en temps réel : santé, production d'oxygène et de glucose.",
    target: "canvas",
    position: "bottom",
    action: "hover",
    actionTarget: "plant",
  },
  {
    id: 5,
    title: "⏯️ Contrôles de base",
    content: "Ces boutons contrôlent la simulation. Démarrer/Pause pour lancer l'expérience, Reset pour recommencer.",
    target: "controls",
    position: "bottom",
    highlight: true,
  },
  {
    id: 6,
    title: "⏱️ Suivi du temps",
    content: "Le chronomètre affiche le temps écoulé depuis le début de votre expérience.",
    target: "timer",
    position: "bottom",
    highlight: true,
  },
  {
    id: 7,
    title: "🎯 Scénarios prédéfinis",
    content:
      "Utilisez ces presets pour tester rapidement différentes conditions environnementales. Cliquez sur 'Conditions Optimales'.",
    target: "presets",
    position: "bottom",
    action: "click",
    actionTarget: "preset-optimal",
    highlight: true,
  },
  {
    id: 8,
    title: "💡 Contrôle de la lumière",
    content: "Ajustez l'intensité lumineuse avec ce curseur. La lumière est essentielle pour la photosynthèse !",
    target: "light-control",
    position: "top",
    action: "adjust",
    actionValue: 80,
    highlight: true,
  },
  {
    id: 9,
    title: "🌫️ Niveau de CO₂",
    content: "Le CO₂ est la matière première de la photosynthèse. Observez la zone optimale en vert.",
    target: "co2-control",
    position: "top",
    highlight: true,
  },
  {
    id: 10,
    title: "🌡️ Température",
    content: "La température affecte l'activité des enzymes. 25°C est idéal pour la plupart des plantes.",
    target: "temp-control",
    position: "top",
    highlight: true,
  },
  {
    id: 11,
    title: "💧 Humidité",
    content: "L'humidité influence les échanges gazeux des plantes. Maintenez-la dans la zone optimale.",
    target: "humidity-control",
    position: "top",
    highlight: true,
  },
  {
    id: 12,
    title: "📊 Indicateurs visuels",
    content: "Les points colorés indiquent si vos paramètres sont optimaux (vert) ou non (rouge).",
    target: "indicators",
    position: "top",
    highlight: true,
  },
  {
    id: 13,
    title: "🌟 Statut environnemental",
    content: "Cet indicateur résume l'état général de votre environnement : Excellent, Bon ou Difficile.",
    target: "env-status",
    position: "bottom",
    highlight: true,
  },
  {
    id: 14,
    title: "⚙️ Mode avancé",
    content: "Cliquez sur 'Avancé' pour accéder aux graphiques, statistiques et contrôles fins.",
    target: "advanced-btn",
    position: "bottom",
    action: "click",
    actionTarget: "advanced-btn",
    highlight: true,
  },
  {
    id: 15,
    title: "📈 Graphiques en temps réel",
    content: "Ces graphiques montrent l'évolution de la production d'oxygène, glucose et santé des plantes.",
    target: "charts",
    position: "top",
    highlight: true,
  },
  {
    id: 16,
    title: "🎮 Raccourcis clavier",
    content: "Utilisez Espace (Play/Pause), R (Reset), H (Aide) pour naviguer plus rapidement.",
    target: "shortcuts",
    position: "center",
  },
  {
    id: 17,
    title: "🧪 Équation scientifique",
    content: "N'oubliez pas l'équation de base : 6CO₂ + 6H₂O + lumière → C₆H₁₂O₆ + 6O₂",
    target: "equation",
    position: "top",
    highlight: true,
  },
  {
    id: 18,
    title: "🎓 Prêt à expérimenter !",
    content:
      "Vous maîtrisez maintenant tous les outils ! Expérimentez avec différents paramètres et observez les résultats.",
    target: "completion",
    position: "center",
  },
]

// Questions du quiz
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Quelle est l'équation chimique correcte de la photosynthèse ?",
    options: [
      "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
      "6CO₂ + 6H₂O + lumière → C₆H₁₂O₆ + 6O₂",
      "CO₂ + H₂O + lumière → glucose + O₂",
      "6CO₂ + 12H₂O + lumière → C₆H₁₂O₆ + 6O₂ + 6H₂O",
    ],
    correctAnswer: 3,
    explanation:
      "L'équation complète inclut 12 molécules d'eau en entrée et 6 en sortie, car l'eau participe à deux réactions distinctes.",
    difficulty: "difficile",
    category: "equation",
  },
  {
    id: 2,
    question: "Quel est le facteur limitant principal de la photosynthèse en faible luminosité ?",
    options: ["La température", "Le CO₂", "La lumière", "L'humidité"],
    correctAnswer: 2,
    explanation:
      "En conditions de faible luminosité, c'est la lumière qui devient le facteur limitant car elle fournit l'énergie nécessaire aux réactions.",
    difficulty: "facile",
    category: "facteurs",
  },
  {
    id: 3,
    question: "À quelle température la photosynthèse est-elle généralement optimale ?",
    options: ["15-20°C", "20-30°C", "30-40°C", "40-50°C"],
    correctAnswer: 1,
    explanation:
      "La plupart des plantes ont une photosynthèse optimale entre 20-30°C, température à laquelle les enzymes fonctionnent le mieux.",
    difficulty: "moyen",
    category: "facteurs",
  },
  {
    id: 4,
    question: "Que produit principalement la photosynthèse pour la plante ?",
    options: ["De l'oxygène uniquement", "Du glucose uniquement", "Du glucose et de l'oxygène", "De l'eau et du CO₂"],
    correctAnswer: 2,
    explanation:
      "La photosynthèse produit du glucose (source d'énergie pour la plante) et de l'oxygène (rejeté dans l'atmosphère).",
    difficulty: "facile",
    category: "processus",
  },
  {
    id: 5,
    question: "Pourquoi les plantes ont-elles besoin de CO₂ pour la photosynthèse ?",
    options: [
      "Pour respirer",
      "Comme source de carbone pour le glucose",
      "Pour produire de l'oxygène",
      "Pour réguler la température",
    ],
    correctAnswer: 1,
    explanation:
      "Le CO₂ fournit le carbone nécessaire à la synthèse du glucose (C₆H₁₂O₆). C'est la matière première carbonée.",
    difficulty: "moyen",
    category: "processus",
  },
  {
    id: 6,
    question: "Dans quelles conditions une plante produit-elle le plus d'oxygène ?",
    options: [
      "Faible lumière, peu de CO₂",
      "Forte lumière, beaucoup de CO₂, température optimale",
      "Température élevée uniquement",
      "Humidité élevée uniquement",
    ],
    correctAnswer: 1,
    explanation:
      "La production d'oxygène est maximale quand tous les facteurs sont optimaux : lumière intense, CO₂ suffisant et température idéale.",
    difficulty: "moyen",
    category: "application",
  },
  {
    id: 7,
    question: "Que se passe-t-il si on augmente seulement la lumière sans CO₂ ?",
    options: [
      "La photosynthèse augmente proportionnellement",
      "Rien ne change car le CO₂ devient limitant",
      "La plante meurt",
      "Seule la température augmente",
    ],
    correctAnswer: 1,
    explanation:
      "C'est le principe du facteur limitant : si le CO₂ manque, augmenter la lumière ne sert à rien car le CO₂ limite la réaction.",
    difficulty: "difficile",
    category: "facteurs",
  },
  {
    id: 8,
    question: "Quelle est l'importance écologique de la photosynthèse ?",
    options: [
      "Elle produit de la nourriture pour les plantes",
      "Elle produit l'oxygène que nous respirons",
      "Elle absorbe le CO₂ de l'atmosphère",
      "Toutes les réponses ci-dessus",
    ],
    correctAnswer: 3,
    explanation:
      "La photosynthèse est cruciale : elle nourrit les plantes, produit notre oxygène et absorbe le CO₂, régulant le climat.",
    difficulty: "facile",
    category: "application",
  },
]

// Presets prédéfinis
const PRESETS: Preset[] = [
  {
    name: "Conditions Optimales",
    description: "Lumière forte, CO₂ élevé, température idéale",
    icon: "🌟",
    environment: { lightIntensity: 85, co2Level: 60, temperature: 25, humidity: 70 },
    color: "green",
  },
  {
    name: "Faible Luminosité",
    description: "Simulation d'un jour nuageux",
    icon: "☁️",
    environment: { lightIntensity: 30, co2Level: 40, temperature: 22, humidity: 60 },
    color: "gray",
  },
  {
    name: "Serre Chaude",
    description: "Température élevée, humidité forte",
    icon: "🌡️",
    environment: { lightIntensity: 70, co2Level: 50, temperature: 35, humidity: 85 },
    color: "red",
  },
  {
    name: "Hiver",
    description: "Conditions hivernales difficiles",
    icon: "❄️",
    environment: { lightIntensity: 25, co2Level: 30, temperature: 15, humidity: 45 },
    color: "blue",
  },
  {
    name: "Laboratoire Standard",
    description: "Conditions de laboratoire normales",
    icon: "🔬",
    environment: { lightIntensity: 60, co2Level: 40, temperature: 25, humidity: 60 },
    color: "purple",
  },
]

// Composant pour une plante 3D interactive
function InteractivePlant({
  position,
  plantState,
}: {
  position: [number, number, number]
  plantState: PlantState
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = 0.5 + plantState.health * 0.7
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 2)
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.02 * plantState.health
    }
  })

  const plantColor = new THREE.Color().lerpColors(
    new THREE.Color("#8B4513"),
    new THREE.Color("#228B22"),
    plantState.health,
  )

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Pot */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 0.7]} />
        <meshLambertMaterial color="#CD853F" />
      </mesh>

      {/* Terre */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.1]} />
        <meshLambertMaterial color="#654321" />
      </mesh>

      {/* Tige */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 1]} />
        <meshLambertMaterial color={plantColor} />
      </mesh>

      {/* Feuilles */}
      {[0, 1, 2, 3].map((level) => (
        <group key={level} position={[0, 0.1 + level * 0.2, 0]} rotation={[0, (level * Math.PI) / 2, 0]}>
          <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
            <planeGeometry args={[0.5, 0.25]} />
            <meshLambertMaterial color={plantColor} side={THREE.DoubleSide} transparent opacity={0.9} />
          </mesh>
          <mesh position={[-0.3, 0, 0]} rotation={[0, 0, -Math.PI / 8]}>
            <planeGeometry args={[0.5, 0.25]} />
            <meshLambertMaterial color={plantColor} side={THREE.DoubleSide} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}

      {/* Particules d'oxygène */}
      {plantState.oxygenProduction > 0.1 && <OxygenBubbles count={Math.floor(plantState.oxygenProduction * 6)} />}

      {/* Info au survol */}
      {hovered && (
        <Html position={[0, 1.8, 0]} center>
          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200 text-sm min-w-48">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: plantColor.getStyle() }} />
              <h4 className="font-bold text-green-700">🌱 Plante</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Santé:</span>
                <span className="font-bold">{Math.round(plantState.health * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>O₂:</span>
                <span className="font-bold text-blue-600">{plantState.oxygenProduction.toFixed(2)} mol/s</span>
              </div>
              <div className="flex justify-between">
                <span>Glucose:</span>
                <span className="font-bold text-green-600">{plantState.glucoseProduction.toFixed(2)} mol/s</span>
              </div>
              <div className="mt-2 pt-2 border-t">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${plantState.health * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Bulles d'oxygène
function OxygenBubbles({ count }: { count: number }) {
  const bubblesRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (bubblesRef.current) {
      bubblesRef.current.children.forEach((bubble, i) => {
        bubble.position.y += delta * (0.5 + i * 0.1)
        bubble.position.x += Math.sin(state.clock.elapsedTime * 2 + i) * delta * 0.2
        if (bubble.position.y > 3) {
          bubble.position.y = 0
        }
      })
    }
  })

  return (
    <group ref={bubblesRef}>
      {[...Array(Math.min(count, 8))].map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 0.3, Math.random() * 1.5, (Math.random() - 0.5) * 0.3]}>
          <sphereGeometry args={[0.02]} />
          <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// Lampe avec indicateur d'intensité
function LabLight({ intensity }: { intensity: number }) {
  const lightRef = useRef<THREE.SpotLight>(null)

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.intensity = intensity * 5
    }
  })

  return (
    <group position={[0, 3, 1]}>
      <mesh>
        <cylinderGeometry args={[0.2, 0.15, 0.4]} />
        <meshLambertMaterial color="#333333" />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <sphereGeometry args={[0.08]} />
        <meshLambertMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={intensity * 0.5} />
      </mesh>
      <spotLight ref={lightRef} position={[0, -0.3, 0]} angle={Math.PI / 3} penumbra={0.5} color="#FFFF88" />
    </group>
  )
}

// Environnement simple
function SimpleLabEnvironment() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshLambertMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[6, 0.1, 3]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      {[
        [-2.8, -1.2, -1.3],
        [2.8, -1.2, -1.3],
        [-2.8, -1.2, 1.3],
        [2.8, -1.2, 1.3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
      ))}
      <mesh position={[0, 1, -3]}>
        <planeGeometry args={[10, 5]} />
        <meshLambertMaterial color="#e8e8e8" />
      </mesh>
    </group>
  )
}

// Particules CO2
function SimpleCO2Particles({ level }: { level: number }) {
  const particlesRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        particle.position.y -= delta * 0.2
        particle.position.x += Math.sin(state.clock.elapsedTime + i) * delta * 0.1
        if (particle.position.y < -1) {
          particle.position.y = 4
        }
      })
    }
  })

  return (
    <group ref={particlesRef}>
      {[...Array(Math.floor(level / 15))].map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 8, Math.random() * 5 + 2, (Math.random() - 0.5) * 4]}>
          <sphereGeometry args={[0.02]} />
          <meshLambertMaterial color="#666666" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// Scène 3D
function SimplePhotosynthesisScene({ environment }: { environment: LabEnvironment }) {
  const [plants, setPlants] = useState<PlantState[]>([
    { health: 0.8, size: 1, oxygenProduction: 0.5, glucoseProduction: 0.3 },
    { health: 0.6, size: 0.8, oxygenProduction: 0.3, glucoseProduction: 0.2 },
    { health: 0.9, size: 1.2, oxygenProduction: 0.7, glucoseProduction: 0.4 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setPlants((prevPlants) =>
        prevPlants.map((plant) => {
          const lightEffect = environment.lightIntensity / 100
          const co2Effect = environment.co2Level / 100
          const tempEffect = Math.max(0, 1 - Math.abs(environment.temperature - 25) / 25)

          const photosynthesisRate = Math.min(lightEffect, co2Effect, tempEffect) * 0.8
          const healthChange = (photosynthesisRate - 0.4) * 0.02
          const newHealth = Math.max(0, Math.min(1, plant.health + healthChange))

          return {
            ...plant,
            health: newHealth,
            oxygenProduction: photosynthesisRate * newHealth,
            glucoseProduction: photosynthesisRate * newHealth * 0.7,
          }
        }),
      )
    }, 200)

    return () => clearInterval(interval)
  }, [environment])

  return (
    <>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} maxDistance={10} minDistance={3} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <SimpleLabEnvironment />
      {plants.map((plant, index) => (
        <InteractivePlant key={index} position={[(-1 + index) * 1.8, -0.65, 0]} plantState={plant} />
      ))}
      <LabLight intensity={environment.lightIntensity / 100} />
      <SimpleCO2Particles level={environment.co2Level} />
      <Text position={[0, 3.5, -2]} fontSize={0.3} color="#2c5530" anchorX="center" anchorY="middle">
        Laboratoire de Photosynthèse
      </Text>
    </>
  )
}

// Composant de graphique simple
function SimpleChart({ data, title, /*color*/ }: { data: DataPoint[]; title: string; color: string }) {
  const maxValue = Math.max(...data.map((d) => Math.max(d.oxygen, d.glucose, d.health * 100)))

  return (
    <div className="bg-white p-4 rounded-lg shadow border" data-tutorial="charts">
      <h4 className="font-semibold text-gray-700 mb-3">{title}</h4>
      <div className="h-32 relative">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Grille */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line key={y} x1="0" y1={`${100 - y}%`} x2="100%" y2={`${100 - y}%`} stroke="#e5e7eb" strokeWidth="1" />
          ))}

          {/* Ligne oxygène */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={data
              .map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.oxygen / maxValue) * 100}`)
              .join(" ")}
          />

          {/* Ligne glucose */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            points={data
              .map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.glucose / maxValue) * 100}`)
              .join(" ")}
          />

          {/* Ligne santé */}
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            points={data
              .map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d.health * 100) / maxValue) * 100}`)
              .join(" ")}
          />
        </svg>
      </div>
      <div className="flex justify-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>O₂</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Glucose</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Santé</span>
        </div>
      </div>
    </div>
  )
}

// Composant de tutoriel interactif
function TutorialOverlay({
  currentStep,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
}: {
  currentStep: TutorialStep
  onNext: () => void
  onPrevious: () => void
  onSkip: () => void
  onComplete: () => void
}) {
  const [/*actionCompleted*/, setActionCompleted] = useState(true)

  // Force re-render when step changes
  useEffect(() => {
    setActionCompleted(true) // Always allow progression for now
  }, [currentStep.id])

  const handleNext = () => {
    onNext()
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50 pointer-events-auto" />

      {/* Tooltip du tutoriel */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 max-w-md pointer-events-auto border-2 border-blue-500">
        {/* Indicateur de progression */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {currentStep.id}
            </div>
            <span className="text-sm text-gray-500">
              {currentStep.id} / {TUTORIAL_STEPS.length}
            </span>
          </div>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(currentStep.id / TUTORIAL_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Contenu */}
        <h3 className="text-lg font-bold mb-3 text-gray-800">{currentStep.title}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{currentStep.content}</p>

        {/* Boutons de navigation */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {currentStep.id > 1 && (
              <button
                onClick={onPrevious}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                ← Précédent
              </button>
            )}
            {currentStep.skippable && (
              <button
                onClick={onSkip}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Passer le tutoriel
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {currentStep.id < TUTORIAL_STEPS.length ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600"
              >
                Suivant →
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
              >
                Terminer 🎉
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant principal avec tutoriel intégré
const SimulationPhotosynthese = () => {
  const [environment, setEnvironment] = useState<LabEnvironment>({
    lightIntensity: 60,
    co2Level: 40,
    temperature: 25,
    humidity: 60,
  })

  const [isRunning, setIsRunning] = useState(true)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [dataHistory, setDataHistory] = useState<DataPoint[]>([])
  const [showHelp, setShowHelp] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])

  // États du tutoriel
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0)
  const [tutorialCompleted, setTutorialCompleted] = useState(false)

  // États du quiz
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizStartTime, setQuizStartTime] = useState<number>(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  // Vérifier si c'est la première visite
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("photosynthesis-tutorial-completed")
    if (!hasSeenTutorial) {
      setShowTutorial(true)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
        if (timeElapsed % 5 === 0) {
          const avgOxygen = 0.5
          const avgGlucose = 0.35
          const avgHealth = 0.75
          setDataHistory((prev) => [
            ...prev.slice(-19),
            { time: timeElapsed, oxygen: avgOxygen, glucose: avgGlucose, health: avgHealth },
          ])
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeElapsed])

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showTutorial) return // Désactiver les raccourcis pendant le tutoriel

      if (e.code === "Space") {
        e.preventDefault()
        setIsRunning(!isRunning)
      } else if (e.code === "KeyR") {
        resetSimulation()
      } else if (e.code === "KeyH") {
        setShowHelp(!showHelp)
      } else if (e.code === "KeyT") {
        startTutorial()
      } else if (e.code === "KeyQ") {
        startQuiz()
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isRunning, showHelp, showTutorial])

  const resetSimulation = () => {
    setTimeElapsed(0)
    setIsRunning(false)
    setDataHistory([])
    setEnvironment({ lightIntensity: 60, co2Level: 40, temperature: 25, humidity: 60 })
    setSelectedPreset(null)
    addNotification("Simulation réinitialisée")
  }

  const applyPreset = (preset: Preset) => {
    setEnvironment(preset.environment)
    setSelectedPreset(preset.name)
    addNotification(`Preset "${preset.name}" appliqué`)
  }

  const addNotification = (message: string) => {
    setNotifications((prev) => [...prev, message])
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1))
    }, 3000)
  }

  const startTutorial = () => {
    setShowTutorial(true)
    setCurrentTutorialStep(0)
    setTutorialCompleted(false)
  }

  const nextTutorialStep = () => {
    console.log("Next step called, current:", currentTutorialStep, "moving to:", currentTutorialStep + 1)
    setCurrentTutorialStep((prev) => {
      const newStep = prev + 1
      console.log("Setting new step:", newStep)
      return newStep
    })
  }

  const previousTutorialStep = () => {
    console.log("Previous step called, current:", currentTutorialStep) // Debug
    if (currentTutorialStep > 0) {
      setCurrentTutorialStep(currentTutorialStep - 1)
    }
  }

  const skipTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem("photosynthesis-tutorial-completed", "true")
  }

  const completeTutorial = () => {
    setShowTutorial(false)
    setTutorialCompleted(true)
    localStorage.setItem("photosynthesis-tutorial-completed", "true")
    addNotification("🎉 Tutoriel terminé ! Vous êtes prêt à expérimenter !")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getEnvironmentStatus = () => {
    const { lightIntensity, co2Level, temperature } = environment
    const lightOk = lightIntensity >= 50
    const co2Ok = co2Level >= 30
    const tempOk = temperature >= 20 && temperature <= 30

    if (lightOk && co2Ok && tempOk) return { status: "Excellent", color: "green", icon: "🌟" }
    if ((lightOk && co2Ok) || (lightOk && tempOk) || (co2Ok && tempOk))
      return { status: "Bon", color: "yellow", icon: "👍" }
    return { status: "Difficile", color: "red", icon: "⚠️" }
  }

  const envStatus = getEnvironmentStatus()

  const startQuiz = () => {
    setShowQuiz(true)
    setCurrentQuizQuestion(0)
    setQuizAnswers([])
    setQuizStartTime(Date.now())
    setQuizCompleted(false)
    setQuizResult(null)
    setSelectedAnswer(null)
  }

  const answerQuestion = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const nextQuestion = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...quizAnswers, selectedAnswer]
    setQuizAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuizQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1)
    } else {
      completeQuiz(newAnswers)
    }
  }

  const completeQuiz = (answers: number[]) => {
    const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000)
    const results = answers.map((answer, index) => ({
      questionId: QUIZ_QUESTIONS[index].id,
      userAnswer: answer,
      correct: answer === QUIZ_QUESTIONS[index].correctAnswer,
    }))

    const score = results.filter((r) => r.correct).length

    const result: QuizResult = {
      score,
      totalQuestions: QUIZ_QUESTIONS.length,
      timeSpent,
      answers: results,
    }

    setQuizResult(result)
    setQuizCompleted(true)

    // Notification de fin
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100)
    addNotification(`🎯 Quiz terminé ! Score: ${score}/${QUIZ_QUESTIONS.length} (${percentage}%)`)
  }

  const restartQuiz = () => {
    startQuiz()
  }

  const closeQuiz = () => {
    setShowQuiz(false)
    setQuizCompleted(false)
    setQuizResult(null)
  }

  if (!isLoaded) {
    return (
      <section id="photosynthese" className="py-20 px-6 bg-gray-50 max-w-7xl mx-auto text-center rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Expérience sur la photosynthèse</h2>
        <div className="flex items-center justify-center h-96 bg-gradient-to-br from-green-50 via-blue-50 to-green-100 rounded-lg">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
            </div>
            <p className="text-gray-700 font-medium">Préparation du laboratoire...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="photosynthese"
      className={`py-20 px-6 bg-gray-50 mx-auto text-center rounded-xl shadow-lg transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 max-w-none" : "max-w-7xl"
      }`}
    >
      {/* Tutoriel interactif */}
      {showTutorial && (
        <TutorialOverlay
          key={currentTutorialStep} // Force re-render with key
          currentStep={TUTORIAL_STEPS[currentTutorialStep]}
          onNext={nextTutorialStep}
          onPrevious={previousTutorialStep}
          onSkip={skipTutorial}
          onComplete={completeTutorial}
        />
      )}

      {/* Quiz interactif */}
      {showQuiz && (
        <QuizOverlay
          questions={QUIZ_QUESTIONS}
          currentQuestion={currentQuizQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={answerQuestion}
          onNext={nextQuestion}
          onClose={closeQuiz}
          result={quizResult}
          completed={quizCompleted}
          onRestart={restartQuiz}
        />
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-40 space-y-2">
        {notifications.map((notification, index) => (
          <div key={index} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in-right">
            {notification}
          </div>
        ))}
      </div>

      {/* Aide contextuelle */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">🎮 Guide d'utilisation</h3>
              <button onClick={() => setShowHelp(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="space-y-4 text-left">
              <div>
                <h4 className="font-semibold">Raccourcis clavier :</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>
                    • <kbd className="bg-gray-100 px-2 py-1 rounded">Espace</kbd> : Démarrer/Pause
                  </li>
                  <li>
                    • <kbd className="bg-gray-100 px-2 py-1 rounded">R</kbd> : Reset
                  </li>
                  <li>
                    • <kbd className="bg-gray-100 px-2 py-1 rounded">H</kbd> : Aide
                  </li>
                  <li>
                    • <kbd className="bg-gray-100 px-2 py-1 rounded">T</kbd> : Tutoriel
                  </li>
                  <li>
                    • <kbd className="bg-gray-100 px-2 py-1 rounded">Q</kbd> : Quiz
                  </li>
                </ul>
              </div>
              <button
                onClick={startTutorial}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                🎓 Relancer le tutoriel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Expérience sur la photosynthèse</h2>
        <div className="flex gap-2">
          <button
            onClick={startTutorial}
            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            title="Tutoriel (T)"
          >
            🎓
          </button>
          <button
            onClick={startQuiz}
            className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            title="Quiz (Q)"
          >
            🧠
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            title="Aide (H)"
          >
            ❓
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            title="Plein écran"
          >
            {isFullscreen ? "🗗" : "🗖"}
          </button>
        </div>
      </div>

      {/* Statut de l'environnement */}
      <div className="mb-6" data-tutorial="env-status">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium ${
            envStatus.color === "green" ? "bg-green-500" : envStatus.color === "yellow" ? "bg-yellow-500" : "bg-red-500"
          }`}
        >
          <span>{envStatus.icon}</span>
          <span>Conditions: {envStatus.status}</span>
        </div>
      </div>

      {/* Contrôles principaux */}
      <div className="mb-6 flex flex-wrap justify-center gap-4" data-tutorial="controls">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg transform hover:scale-105 ${
            isRunning
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          }`}
        >
          {isRunning ? "⏸️ Pause" : "▶️ Démarrer"}
        </button>
        <button
          onClick={resetSimulation}
          className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg transform hover:scale-105"
        >
          🔄 Reset
        </button>
        <div
          className="px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-lg"
          data-tutorial="timer"
        >
          <span className="font-bold text-blue-800">⏱️ {formatTime(timeElapsed)}</span>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
          data-tutorial="advanced-btn"
        >
          ⚙️ {showAdvanced ? "Simple" : "Avancé"}
        </button>
      </div>

      {/* Presets */}
      <div className="mb-6" data-tutorial="presets">
        <h3 className="text-lg font-semibold mb-3">🎯 Scénarios prédéfinis</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                selectedPreset === preset.name
                  ? `bg-${preset.color}-500 text-white shadow-lg`
                  : `bg-${preset.color}-100 text-${preset.color}-700 hover:bg-${preset.color}-200`
              }`}
              title={preset.description}
              data-tutorial={preset.name === "Conditions Optimales" ? "preset-optimal" : undefined}
            >
              <span className="mr-2">{preset.icon}</span>
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Contrôles environnementaux */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {[
          {
            key: "lightIntensity",
            label: "💡 Intensité Lumineuse",
            unit: "%",
            min: 0,
            max: 100,
            color: "yellow",
            optimal: [60, 80],
            tutorial: "light-control",
          },
          {
            key: "co2Level",
            label: "🌫️ Niveau CO₂",
            unit: "%",
            min: 0,
            max: 100,
            color: "gray",
            optimal: [30, 60],
            tutorial: "co2-control",
          },
          {
            key: "temperature",
            label: "🌡️ Température",
            unit: "°C",
            min: 0,
            max: 50,
            color: "red",
            optimal: [20, 30],
            tutorial: "temp-control",
          },
          {
            key: "humidity",
            label: "💧 Humidité",
            unit: "%",
            min: 0,
            max: 100,
            color: "blue",
            optimal: [50, 80],
            tutorial: "humidity-control",
          },
        ].map(({ key, label, unit, min, max, color, optimal, tutorial }) => {
          const value = environment[key as keyof LabEnvironment]
          const isOptimal = value >= optimal[0] && value <= optimal[1]
          return (
            <div
              key={key}
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
              data-tutorial={tutorial}
            >
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  {label}: {value}
                  {unit}
                </label>
                <div
                  className={`w-3 h-3 rounded-full ${isOptimal ? "bg-green-400" : "bg-red-400"}`}
                  data-tutorial="indicators"
                />
              </div>
              <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => setEnvironment((prev) => ({ ...prev, [key]: Number.parseInt(e.target.value) }))}
                className={`w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-${color}`}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>
                  {min}
                  {unit}
                </span>
                <span className="text-green-600 font-medium">
                  Optimal: {optimal[0]}-{optimal[1]}
                  {unit}
                </span>
                <span>
                  {max}
                  {unit}
                </span>
              </div>
              {showAdvanced && (
                <div className="mt-2 flex gap-1">
                  <button
                    onClick={() => setEnvironment((prev) => ({ ...prev, [key]: Math.max(min, value - 5) }))}
                    className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => setEnvironment((prev) => ({ ...prev, [key]: Math.min(max, value + 5) }))}
                    className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                  >
                    +5
                  </button>
                  <button
                    onClick={() =>
                      setEnvironment((prev) => ({ ...prev, [key]: Math.floor((optimal[0] + optimal[1]) / 2) }))
                    }
                    className="px-2 py-1 bg-green-200 rounded text-xs hover:bg-green-300"
                  >
                    Optimal
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Scène 3D */}
      <div
        className={`rounded-xl border-2 border-gray-200 overflow-hidden bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 mb-8 shadow-xl ${
          isFullscreen ? "h-[calc(100vh-300px)]" : "h-[500px]"
        }`}
        data-tutorial="canvas"
      >
        <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
          <SimplePhotosynthesisScene environment={environment} />
        </Canvas>
      </div>

      {/* Graphiques et données */}
      {showAdvanced && dataHistory.length > 0 && (
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <SimpleChart data={dataHistory} title="📊 Production en temps réel" color="blue" />
          <div className="bg-white p-4 rounded-lg shadow border">
            <h4 className="font-semibold text-gray-700 mb-3">📈 Statistiques</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Temps total:</span>
                <span className="font-bold ml-2">{formatTime(timeElapsed)}</span>
              </div>
              <div>
                <span className="text-gray-600">Points de données:</span>
                <span className="font-bold ml-2">{dataHistory.length}</span>
              </div>
              <div>
                <span className="text-gray-600">O₂ moyen:</span>
                <span className="font-bold ml-2 text-blue-600">
                  {dataHistory.length > 0
                    ? (dataHistory.reduce((sum, d) => sum + d.oxygen, 0) / dataHistory.length).toFixed(2)
                    : "0.00"}{" "}
                  mol/s
                </span>
              </div>
              <div>
                <span className="text-gray-600">Glucose moyen:</span>
                <span className="font-bold ml-2 text-green-600">
                  {dataHistory.length > 0
                    ? (dataHistory.reduce((sum, d) => sum + d.glucose, 0) / dataHistory.length).toFixed(2)
                    : "0.00"}{" "}
                  mol/s
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl mb-8 max-w-4xl mx-auto border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-4 text-lg">🎮 Guide d'utilisation rapide :</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700" data-tutorial="shortcuts">
          <div className="space-y-2">
            <h4 className="font-semibold">🖱️ Navigation 3D</h4>
            <ul className="space-y-1">
              <li>• Clic + glisser : Rotation</li>
              <li>• Molette : Zoom</li>
              <li>• Survol : Informations</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">⌨️ Raccourcis</h4>
            <ul className="space-y-1">
              <li>• Espace : Play/Pause</li>
              <li>• R : Reset</li>
              <li>• H : Aide</li>
              <li>• T : Tutoriel</li>
              <li>• Q : Quiz</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">🎯 Conseils</h4>
            <ul className="space-y-1">
              <li>• Utilisez les presets</li>
              <li>• Visez la zone optimale</li>
              <li>• Observez les indicateurs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Informations scientifiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg text-left border border-gray-100" data-tutorial="equation">
          <h3 className="font-bold text-xl mb-4 text-green-700 flex items-center gap-2">
            🧪 Équation de la photosynthèse
          </h3>
          <div className="bg-green-50 p-4 rounded-lg text-center mb-4 border border-green-200">
            <code className="text-lg font-mono text-green-800">6CO₂ + 6H₂O + lumière → C₆H₁₂O₆ + 6O₂</code>
          </div>
          <p className="text-gray-700 leading-relaxed">
            La photosynthèse convertit le CO₂ et l'eau en glucose et oxygène grâce à l'énergie lumineuse. Ce processus
            est vital pour la vie sur Terre et produit l'oxygène que nous respirons.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg text-left border border-gray-100">
          <h3 className="font-bold text-xl mb-4 text-blue-700 flex items-center gap-2">📊 Facteurs limitants</h3>
          <div className="space-y-3">
            {[
              { icon: "💡", factor: "Lumière", desc: "Source d'énergie (optimal: 60-80%)", color: "yellow" },
              { icon: "🌫️", factor: "CO₂", desc: "Matière première (optimal: 30-60%)", color: "gray" },
              { icon: "🌡️", factor: "Température", desc: "Activité enzymatique (optimal: 20-30°C)", color: "red" },
              { icon: "💧", factor: "Humidité", desc: "Échanges gazeux (optimal: 50-80%)", color: "blue" },
            ].map(({ icon, factor, desc, color }) => (
              <div key={factor} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <span className="text-xl">{icon}</span>
                <div>
                  <strong className={`text-${color}-600`}>{factor}:</strong>
                  <p className="text-sm text-gray-600 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-8 text-gray-700 max-w-3xl mx-auto leading-relaxed" data-tutorial="completion">
        Cette simulation interactive vous permet d'expérimenter avec les facteurs qui influencent la photosynthèse.
        {!tutorialCompleted && " Cliquez sur le bouton 🎓 pour commencer le tutoriel !"}
      </p>
    </section>
  )
}

export default SimulationPhotosynthese