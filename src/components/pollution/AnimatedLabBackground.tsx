import { Microscope, Laptop, FlaskConical, BarChart3 } from "lucide-react";

interface AnimatedLabBackgroundProps {
  animationTime: number;
}

export default function AnimatedLabBackground({ animationTime }: AnimatedLabBackgroundProps) {
  const equipment = [
    { Icon: Microscope, x: 8, y: 8, rotation: Math.sin(animationTime * 0.02) * 5 },
    { Icon: Laptop, x: 92, y: 8, rotation: Math.sin(animationTime * 0.03) * 3 },
    { Icon: FlaskConical, x: 8, y: 92, rotation: Math.sin(animationTime * 0.025) * 4 },
    { Icon: BarChart3, x: 92, y: 92, rotation: Math.sin(animationTime * 0.035) * 6 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none opacity-10">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300">
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute border-gray-400 border-r border-b transition-all duration-1000"
              style={{
                left: `${(i % 10) * 10}%`,
                top: `${Math.floor(i / 10) * 33}%`,
                width: "10%",
                height: "33%",
                opacity: 0.3 + Math.sin(animationTime * 0.05 + i) * 0.1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Équipements animés */}
      {equipment.map((item, i) => (
        <div
          key={i}
          className="absolute text-4xl opacity-20 transition-all duration-100"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `rotate(${item.rotation}deg) scale(${1 + Math.sin(animationTime * 0.04 + i) * 0.1})`,
          }}
        >
          <item.Icon />
        </div>
      ))}
    </div>
  );
}