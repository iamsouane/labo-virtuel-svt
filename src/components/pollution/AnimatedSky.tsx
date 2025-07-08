// src/components/pollution/AnimatedSky.tsx
interface AnimatedSkyProps {
  effectivePollution: number
  animationTime: number
}

export default function AnimatedSky({ effectivePollution, animationTime }: AnimatedSkyProps) {
  return (
    <div
      className={`absolute inset-0 transition-all duration-1000 ${effectivePollution < 20
        ? "bg-gradient-to-b from-blue-400 to-blue-200"
        : effectivePollution < 40
          ? "bg-gradient-to-b from-blue-300 to-gray-200"
          : effectivePollution < 60
            ? "bg-gradient-to-b from-gray-300 to-gray-400"
            : effectivePollution < 80
              ? "bg-gradient-to-b from-gray-400 to-gray-500"
              : "bg-gradient-to-b from-gray-500 to-gray-600"
        }`}
    >
      {/* Nuages de pollution animés */}
      {effectivePollution > 20 && (
        <div className="absolute inset-0" style={{ opacity: Math.min(0.8, effectivePollution / 100) }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gray-600 rounded-full animate-pulse"
              style={{
                left: `${5 + i * 12 + Math.sin(animationTime * 0.02 + i) * 3}%`,
                top: `${5 + (i % 4) * 8 + Math.cos(animationTime * 0.015 + i) * 2}%`,
                width: `${15 + i * 3 + Math.sin(animationTime * 0.03 + i) * 2}px`,
                height: `${10 + i * 2 + Math.cos(animationTime * 0.025 + i) * 1}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: "4s",
              }}
            />
          ))}
        </div>
      )}

      {/* Soleil animé */}
      <div
        className={`absolute top-8 right-8 w-16 h-16 rounded-full transition-all duration-1000 ${effectivePollution > 60 ? "bg-orange-300 opacity-30" : "bg-yellow-400 opacity-90"
          }`}
        style={{
          transform: `scale(${1 + Math.sin(animationTime * 0.05) * 0.1})`,
          boxShadow:
            effectivePollution < 40
              ? `0 0 ${20 + Math.sin(animationTime * 0.1) * 10}px rgba(255, 255, 0, 0.6)`
              : "none",
        }}
      >
        {effectivePollution < 40 &&
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-6 bg-yellow-400 origin-bottom transition-all duration-100"
              style={{
                left: "50%",
                top: "50%",
                transform: `translateX(-50%) translateY(-50%) rotate(${i * 45 + animationTime * 0.5}deg) translateY(-40px)`,
                opacity: 0.7 + Math.sin(animationTime * 0.1 + i) * 0.3,
              }}
            />
          ))}
      </div>

      {/* Pluie acide si pollution élevée */}
      {effectivePollution > 70 && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-4 bg-gray-400 opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${-10 + ((animationTime * 2 + i * 10) % 120)}%`,
                transform: `rotate(10deg)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}