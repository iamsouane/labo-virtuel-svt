// src/components/pollution/AnimatedRoad.tsx
interface AnimatedRoadProps {
  animationTime: number
}

export default function AnimatedRoad({ animationTime }: AnimatedRoadProps) {
  return (
    <div className="absolute bottom-0 w-full h-8 bg-gray-800">
      <div
        className="absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-400 opacity-60"
        style={{
          background: `repeating-linear-gradient(to right, #fbbf24 0px, #fbbf24 20px, transparent 20px, transparent 40px)`,
          transform: `translateX(${animationTime % 40}px)`,
        }}
      />
    </div>
  )
}