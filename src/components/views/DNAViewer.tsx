import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

const Model = () => {
  const [object, setObject] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('/models/');
    mtlLoader.load(
      'obj.mtl',
      (materials) => {
        materials.preload();

        // Configuration des matériaux transparents pour voir à travers
        Object.values(materials.materials).forEach((material) => {
          if (material instanceof THREE.Material) {
            material.side = THREE.DoubleSide;
            material.transparent = true;
            material.opacity = 0.85; // Légère transparence
            material.needsUpdate = true;
          }
        });

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('/models/');
        objLoader.load(
          'tinker.obj',
          (loadedObject) => {
            // Centrage et mise à l'échelle
            const bbox = new THREE.Box3().setFromObject(loadedObject);
            const center = bbox.getCenter(new THREE.Vector3());
            loadedObject.position.sub(center);
            
            // Ajustement automatique de l'échelle
            const size = bbox.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2.0 / maxDim;
            loadedObject.scale.set(scale, scale, scale);

            setObject(loadedObject);
          },
          undefined,
          (error) => {
            console.error('Erreur de chargement OBJ:', error);
          }
        );
      },
      undefined,
      (error) => {
        console.error('Erreur de chargement MTL:', error);
      }
    );
  }, []);

  return object ? <primitive object={object} /> : null;
};

const CustomControls = () => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    // Position initiale de la caméra - vue de face
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
      enablePan={true}
      enableZoom={true}
      minPolarAngle={0}       // Permet de regarder depuis le haut
      maxPolarAngle={Math.PI} // Permet de regarder depuis le bas
      minAzimuthAngle={-Infinity}
      maxAzimuthAngle={Infinity}
      enableDamping={true}
      dampingFactor={0.25}
      screenSpacePanning={true} // Panning plus intuitif
      rotateSpeed={0.5}         // Vitesse de rotation réduite
    />
  );
};

const WaterCycleViewer = () => (
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
      <directionalLight
        position={[5, 10, 7]}
        intensity={1.2}
        castShadow
      />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      
      <CustomControls />
      <Model />
      
      {/* Aide visuelle pour l'orientation */}
      <gridHelper args={[10, 10]} rotation={[Math.PI/2, 0, 0]} />
    </Canvas>
  </div>
);

export default WaterCycleViewer;