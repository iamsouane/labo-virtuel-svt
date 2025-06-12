import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const HeartModel = () => {
  const { scene } = useGLTF('/models/heart.glb');
  return <primitive object={scene} scale={0.7} />;
};

const HeartViewer = () => {
  return (
    <section className="h-[600px] w-full bg-gray-100 rounded-xl shadow-inner">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />
        <HeartModel />
      </Canvas>
    </section>
  );
};

export default HeartViewer;