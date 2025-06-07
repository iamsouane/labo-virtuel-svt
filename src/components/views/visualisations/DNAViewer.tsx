import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Model = () => {
  const gltf = useGLTF('/models/dna.glb');

  useEffect(() => {
    const object = gltf.scene;
    const bbox = new THREE.Box3().setFromObject(object);
    const center = bbox.getCenter(new THREE.Vector3());
    object.position.sub(center);

    const size = bbox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.0 / maxDim;
    object.scale.set(scale, scale, scale);
  }, [gltf]);

  return <primitive object={gltf.scene} />;
};

const CustomControls = () => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      enableDamping
      dampingFactor={0.25}
      screenSpacePanning
      rotateSpeed={0.5}
    />
  );
};

const DNAViewer = () => (
  <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg border">
    <Canvas
      gl={{ antialias: true }}
      camera={{
        position: [0, 0, 5],
        fov: 50,
        near: 0.1,
        far: 1000
      }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />

      <CustomControls />
      <Model />
    </Canvas>
  </div>
);

export default DNAViewer;