// src/components/selection/Wolf.tsx
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const Wolf = () => {
  const [position, setPosition] = useState({ left: "50%", top: "50%" })

  const getRandomPosition = () => {
    const x = Math.random() * 90 + 5 // pour éviter de sortir de l'écran
    const y = Math.random() * 90 + 5
    return { left: `${x}%`, top: `${y}%` }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(getRandomPosition())
    }, 4000) // toutes les 4 secondes
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="absolute w-16 h-16"
      animate={position}
      transition={{ duration: 4, ease: "easeInOut" }}
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Loup SVG ici, inchangé */}
        <ellipse cx="50" cy="60" rx="25" ry="15" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        <circle cx="50" cy="35" r="18" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        <ellipse cx="50" cy="45" rx="8" ry="6" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        <polygon points="35,25 40,15 45,25" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        <polygon points="55,25 60,15 65,25" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        <circle cx="45" cy="30" r="2" fill="#FF0000" />
        <circle cx="55" cy="30" r="2" fill="#FF0000" />
        <rect x="35" y="70" width="4" height="12" fill="#4A4A4A" />
        <rect x="45" y="70" width="4" height="12" fill="#4A4A4A" />
        <rect x="55" y="70" width="4" height="12" fill="#4A4A4A" />
        <rect x="65" y="70" width="4" height="12" fill="#4A4A4A" />
        <ellipse cx="25" cy="55" rx="12" ry="6" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
      </svg>
    </motion.div>
  )
}

export default Wolf