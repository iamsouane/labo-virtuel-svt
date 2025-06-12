import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const AbdomenModel = () => {
  const { scene } = useGLTF('/models/abdomen_anatomy.glb');
  return <primitive object={scene} scale={0.8} />;
};

const AbdomenViewer = () => {
  return (
    <section className="h-[600px] w-full bg-gray-100 rounded-xl shadow-inner">
      <Canvas camera={{ position: [0, 0, 500] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />
        <AbdomenModel />
      </Canvas>
    </section>
  );
};

export default AbdomenViewer;