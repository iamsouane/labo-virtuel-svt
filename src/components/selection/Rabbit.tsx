//src/components/selection/Rabbit
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { RabbitGenetics } from "../../types/selectionNaturelleTypes"

interface RabbitProps {
  genetics: RabbitGenetics
  initialPosition?: { x: number; y: number }
  index: number
  isSelected: boolean
  onSelect: () => void
}

export const SimpleRabbit = ({ size = 32, className = "" }: { size?: number; className?: string }) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="40" r="18" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
        <ellipse cx="35" cy="30" rx="7" ry="13" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" transform="rotate(-20 35 30)" />
        <ellipse cx="65" cy="30" rx="7" ry="13" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" transform="rotate(20 65 30)" />
        <circle cx="45" cy="35" r="2" fill="#000" />
        <circle cx="55" cy="35" r="2" fill="#000" />
      </svg>
    </div>
  )
}

const Rabbit = ({ genetics, initialPosition, index, isSelected, onSelect }: RabbitProps) => {
  const getInitialPosition = () => {
    if (initialPosition) return initialPosition

    const angle = (index * 2.4) % (2 * Math.PI)
    const radius = 15 + Math.floor(index / 8) * 8
    const centerX = 50
    const centerY = 50

    return {
      x: Math.max(5, Math.min(95, centerX + Math.cos(angle) * radius)),
      y: Math.max(5, Math.min(95, centerY + Math.sin(angle) * radius)),
    }
  }

  const [position, setPosition] = useState(getInitialPosition())

  const getRandomPosition = () => ({
    x: Math.random() * 90 + 5,
    y: Math.random() * 90 + 5,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(getRandomPosition())
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const getGenerationColor = (generation: number) => {
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316"]
    return colors[generation % colors.length]
  }

  return (
    <motion.div
      className={`absolute w-10 h-10 cursor-pointer ${isSelected ? "ring-4 ring-yellow-400 ring-opacity-75" : ""}`}
    animate={{
      left: `${position.x}%`,
      top: `${position.y}%`,
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    }}
    style={{ transform: "translate(-50%, -50%)" }}
    onClick={onSelect}
  >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="40"
          r="18"
          fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
          stroke={isSelected ? "#FCD34D" : getGenerationColor(genetics.generation)}
          strokeWidth={isSelected ? "4" : "2"}
        />
        {genetics.earType === "straight" ? (
          <>
            <ellipse cx="35" cy="30" rx="7" ry="13" fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
              stroke={isSelected ? "#FCD34D" : getGenerationColor(genetics.generation)} strokeWidth={isSelected ? "3" : "2"}
              transform="rotate(-20 35 30)" />
            <ellipse cx="65" cy="30" rx="7" ry="13" fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
              stroke={isSelected ? "#FCD34D" : getGenerationColor(genetics.generation)} strokeWidth={isSelected ? "3" : "2"}
              transform="rotate(20 65 30)" />
          </>
        ) : (
          <>
            <path d="M32 22 Q28 28 30 38 Q32 45 38 42 Q36 35 35 28 Q34 24 32 22 Z"
              fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
              stroke={isSelected ? "#FCD34D" : getGenerationColor(genetics.generation)}
              strokeWidth={isSelected ? "3" : "2"} />
            <path d="M68 22 Q72 28 70 38 Q68 45 62 42 Q64 35 65 28 Q66 24 68 22 Z"
              fill={genetics.furColor === "brown" ? "#8B4513" : "#FFFFFF"}
              stroke={isSelected ? "#FCD34D" : getGenerationColor(genetics.generation)}
              strokeWidth={isSelected ? "3" : "2"} />
          </>
        )}
        <circle cx="45" cy="35" r="2" fill="#000" />
        <circle cx="55" cy="35" r="2" fill="#000" />
        {genetics.toothLength === "long" && (
          <>
            <rect x="47" y="45" width="3" height="8" fill="#FFF" stroke="#000" strokeWidth="0.5" />
            <rect x="50" y="45" width="3" height="8" fill="#FFF" stroke="#000" strokeWidth="0.5" />
          </>
        )}
        <text
          x="50"
          y="75"
          textAnchor="middle"
          fontSize="8"
          fill={getGenerationColor(genetics.generation)}
          fontWeight="bold"
        >
          G{genetics.generation}
        </text>
      </svg>
    </motion.div>
  )
}

export default Rabbit