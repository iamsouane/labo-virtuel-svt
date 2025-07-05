// src/components/photosynthese/SimpleCO2Particles.tsx
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function SimpleCO2Particles({ level }: { level: number }) {
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
