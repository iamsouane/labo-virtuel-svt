import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AnimatedModel = () => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/water_cycle.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && animations.length > 0) {
      actions[animations[0].name]?.play(); // Lance la première animation trouvée
    }
  }, [actions, animations]);

  return <primitive ref={group} object={scene} />;
};

const WaterCycleViewer = () => {
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-300 shadow">
      <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Environment preset="sunset" />
        <AnimatedModel />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default WaterCycleViewer;