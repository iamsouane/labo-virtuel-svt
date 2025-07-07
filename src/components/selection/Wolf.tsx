//src/components/selection/Wolf
import { motion } from "framer-motion"

const Wolf = () => {
  return (
    <motion.div
      className="absolute w-16 h-16"
      style={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
      animate={{
        left: ["50%", "80%", "20%", "70%", "30%", "60%", "50%"],
        top: ["50%", "80%", "20%", "70%", "30%", "60%", "50%"],
      }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 12, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Corps du loup */}
        <ellipse cx="50" cy="60" rx="25" ry="15" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        {/* Tête */}
        <circle cx="50" cy="35" r="18" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        {/* Museau */}
        <ellipse cx="50" cy="45" rx="8" ry="6" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        {/* Oreilles */}
        <polygon points="35,25 40,15 45,25" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        <polygon points="55,25 60,15 65,25" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
        {/* Yeux */}
        <circle cx="45" cy="30" r="2" fill="#FF0000" />
        <circle cx="55" cy="30" r="2" fill="#FF0000" />
        {/* Pattes */}
        <rect x="35" y="70" width="4" height="12" fill="#4A4A4A" />
        <rect x="45" y="70" width="4" height="12" fill="#4A4A4A" />
        <rect x="55" y="70" width="4" height="12" fill="#4A4A4A" />
        <rect x="65" y="70" width="4" height="12" fill="#4A4A4A" />
        {/* Queue */}
        <ellipse cx="25" cy="55" rx="12" ry="6" fill="#4A4A4A" stroke="#000" strokeWidth="1" />
      </svg>
    </motion.div>
  )
}

export default Wolf