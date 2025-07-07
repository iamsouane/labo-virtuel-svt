//src/components/selection/Food
import { useState, useEffect } from "react"
import type { EnvironmentalFactors } from "../../types/selectionNaturelleTypes"

interface FoodProps {
  environment: EnvironmentalFactors
}

const Food = ({ environment }: FoodProps) => {
  const getFoodItems = () => {
    const items = []
    const baseCount = environment.foodScarcity ? 4 : 12

    for (let i = 0; i < baseCount; i++) {
      items.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      })
    }
    return items
  }

  const [foodItems, setFoodItems] = useState(getFoodItems())

  useEffect(() => {
    setFoodItems(getFoodItems())
  }, [environment.foodScarcity, environment.foodHardness])

  return (
    <>
      {foodItems.map((item) => (
        <div
          key={item.id}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4">
            {environment.foodHardness ? (
              // Nourriture dure (noix/graines)
              <circle cx="10" cy="10" r="8" fill="#8B4513" stroke="#654321" strokeWidth="2" />
            ) : (
              // Nourriture tendre (herbe/feuilles)
              <g>
                <ellipse cx="10" cy="10" rx="8" ry="6" fill="#90EE90" />
                <path d="M6 10 Q10 6 14 10 Q10 14 6 10" fill="#228B22" />
              </g>
            )}
          </svg>
        </div>
      ))}
    </>
  )
}

export default Food