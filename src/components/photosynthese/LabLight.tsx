// src/components/photosynthese/LabLight.tsx
import { useRef } from "react";
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";

export function LabLight({ intensity }: { intensity: number }) {
  const lightRef = useRef<THREE.SpotLight>(null)
  
    useFrame(() => {
      if (lightRef.current) {
        lightRef.current.intensity = intensity * 5
      }
    })
  
    return (
      <group position={[0, 3, 1]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.15, 0.4]} />
          <meshLambertMaterial color="#333333" />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <sphereGeometry args={[0.08]} />
          <meshLambertMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={intensity * 0.5} />
        </mesh>
        <spotLight ref={lightRef} position={[0, -0.3, 0]} angle={Math.PI / 3} penumbra={0.5} color="#FFFF88" />
      </group>
    )
}
