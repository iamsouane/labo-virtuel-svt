import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import ControlButtons from '../../sections/ControlButtons';

type Step = {
  title: string;
  explanation: string;
  scientificData: string[];
};

const defaultStep: Step = {
  title: "Cycle de l'eau",
  explanation: "Le cycle de l'eau décrit la circulation de l'eau dans la nature à travers différents processus naturels.",
  scientificData: [
    "Évaporation : l'eau passe de l'état liquide à gazeux",
    "Condensation : formation des nuages",
    "Précipitation : pluie, neige, grêle",
    "Infiltration et ruissellement : retour de l'eau vers les océans",
  ],
};

const AnimatedModel = ({
  control,
}: {
  control: 'play' | 'pause' | 'reset';
}) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/water_cycle.glb');
  const { actions } = useAnimations(animations, group);

  const actionName = animations[0]?.name;
  const action = actions ? actions[actionName] : null;

  useEffect(() => {
    if (!action) return;

    action.timeScale = 0.3;

    if (control === 'play') {
      action.reset().play();
      action.paused = false;
    } else if (control === 'pause') {
      action.paused = true;
    } else if (control === 'reset') {
      action.reset().stop();
    }
  }, [control, action]);

  return <primitive ref={group} object={scene} />;
};

const WaterCycleViewer = () => {
  const [control, setControl] = useState<'play' | 'pause' | 'reset'>('pause');
  const [step] = useState<Step | null>(defaultStep);

  return (
    <div className="space-y-4">
      <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-gray-300 shadow">
        <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Environment preset="sunset" />
          <AnimatedModel control={control} />
          <OrbitControls />
        </Canvas>

        {/* Carte explicative */}
        <div className="absolute bottom-4 right-4 max-w-[320px] max-h-[200px] overflow-y-auto bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-4 shadow-lg text-left pointer-events-auto">
          {!step ? (
            <p className="text-gray-600">Appuyez sur ▶️ pour démarrer l'animation.</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-1 text-blue-700">{step.title}</h2>
              <p className="mb-1 text-sm">{step.explanation}</p>
              <ul className="list-disc pl-5 space-y-0.5 text-xs text-gray-700">
                {step.scientificData.map((data, i) => (
                  <li key={i}>{data}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Contrôles */}
      <ControlButtons control={control} setControl={setControl} />
    </div>
  );
};

export default WaterCycleViewer;