// src/components/photosynthese/OxygenBubbles.tsx
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function OxygenBubbles({ count }: { count: number }) {
  const bubblesRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (bubblesRef.current) {
      bubblesRef.current.children.forEach((bubble, i) => {
        bubble.position.y += delta * (0.5 + i * 0.1);
        bubble.position.x += Math.sin(state.clock.elapsedTime * 2 + i) * delta * 0.2;
        if (bubble.position.y > 3) {
          bubble.position.y = 0;
        }
      });
    }
  });

  return (
    <group ref={bubblesRef}>
      {[...Array(Math.min(count, 8))].map((_, i) => (
        <mesh
          key={i}
          position={[(Math.random() - 0.5) * 0.3, Math.random() * 1.5, (Math.random() - 0.5) * 0.3]}
        >
          <sphereGeometry args={[0.02]} />
          <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}