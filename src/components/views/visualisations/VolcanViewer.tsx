import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { useEffect } from 'react';

const VolcanModel = () => {
  const gltf = useGLTF('/models/form_volcan.glb');
  const { scene, animations } = gltf;
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    // Démarre toutes les animations disponibles
    if (actions && animations.length > 0) {
      animations.forEach((clip) => {
        actions[clip.name]?.reset().play();
      });
    }
  }, [actions, animations]);

  return <primitive object={scene} scale={1.2} />;
};

const VolcanViewer = () => {
  return (
    <section className="h-[600px] w-full bg-gray-100 rounded-xl shadow-inner">
      <Canvas camera={{ position: [0, 2, 1], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <OrbitControls />
        <VolcanModel />
      </Canvas>
    </section>
  );
};

export default VolcanViewer;
