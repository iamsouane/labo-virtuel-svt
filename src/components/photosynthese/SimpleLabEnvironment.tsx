// src/components/photosynthese/SimpleLabEnvironment.tsx
export function SimpleLabEnvironment() {
   return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshLambertMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[6, 0.1, 3]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      {[
        [-2.8, -1.2, -1.3],
        [2.8, -1.2, -1.3],
        [-2.8, -1.2, 1.3],
        [2.8, -1.2, 1.3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.05, 0.05, 1]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
      ))}
      <mesh position={[0, 1, -3]}>
        <planeGeometry args={[10, 5]} />
        <meshLambertMaterial color="#e8e8e8" />
      </mesh>
    </group>
  )
}
