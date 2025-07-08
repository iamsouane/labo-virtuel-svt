// src/components/ui/Badge
import type React from "react"

interface BadgeProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const Badge: React.FC<BadgeProps> = ({ children, className = "", style }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    style={style}
  >
    {children}
  </span>
)

export default Badge