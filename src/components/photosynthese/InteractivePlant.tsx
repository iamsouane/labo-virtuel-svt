// src/components/photosynthese/InteractivePlant.tsx
import { useRef, useState } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { PlantState } from "../../types/simulationPhotosyntheseTypes"
import { OxygenBubbles } from "../../components/photosynthese/OxygenBubbles";

export function InteractivePlant({ position, plantState }: { position: [number, number, number]; plantState: PlantState }) {
  {
    const groupRef = useRef<THREE.Group>(null)
    const [hovered, setHovered] = useState(false)
  
    useFrame((state, delta) => {
      if (groupRef.current) {
        const targetScale = 0.5 + plantState.health * 0.7
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 2)
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.02 * plantState.health
      }
    })
  
    const plantColor = new THREE.Color().lerpColors(
      new THREE.Color("#8B4513"),
      new THREE.Color("#228B22"),
      plantState.health,
    )
  
    return (
      <group
        ref={groupRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Pot */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.6, 0.8, 0.7]} />
          <meshLambertMaterial color="#CD853F" />
        </mesh>
  
        {/* Terre */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.1]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
  
        {/* Tige */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.03, 0.05, 1]} />
          <meshLambertMaterial color={plantColor} />
        </mesh>
  
        {/* Feuilles */}
        {[0, 1, 2, 3].map((level) => (
          <group key={level} position={[0, 0.1 + level * 0.2, 0]} rotation={[0, (level * Math.PI) / 2, 0]}>
            <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
              <planeGeometry args={[0.5, 0.25]} />
              <meshLambertMaterial color={plantColor} side={THREE.DoubleSide} transparent opacity={0.9} />
            </mesh>
            <mesh position={[-0.3, 0, 0]} rotation={[0, 0, -Math.PI / 8]}>
              <planeGeometry args={[0.5, 0.25]} />
              <meshLambertMaterial color={plantColor} side={THREE.DoubleSide} transparent opacity={0.9} />
            </mesh>
          </group>
        ))}
  
        {/* Particules d'oxygène */}
        {plantState.oxygenProduction > 0.1 && <OxygenBubbles count={Math.floor(plantState.oxygenProduction * 6)} />}
  
        {/* Info au survol */}
        {hovered && (
          <Html position={[0, 1.8, 0]} center>
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200 text-sm min-w-48">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: plantColor.getStyle() }} />
                <h4 className="font-bold text-green-700">🌱 Plante</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Santé:</span>
                  <span className="font-bold">{Math.round(plantState.health * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>O₂:</span>
                  <span className="font-bold text-blue-600">{plantState.oxygenProduction.toFixed(2)} mol/s</span>
                </div>
                <div className="flex justify-between">
                  <span>Glucose:</span>
                  <span className="font-bold text-green-600">{plantState.glucoseProduction.toFixed(2)} mol/s</span>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${plantState.health * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Html>
        )}
      </group>
    )
  }
}
