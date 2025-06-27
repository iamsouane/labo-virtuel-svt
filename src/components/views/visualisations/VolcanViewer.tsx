import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Environment } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import ControlButtons from '../../sections/ControlButtons';

type Step = {
  start: number; // début en secondes
  end: number;   // fin en secondes
  title: string;
  explanation: string;
  scientificData: string[];
};

const steps: Step[] = [
  {
    start: 0,
    end: 2,
    title: "Glissement de la plaque tectonique",
    explanation: "Une plaque tectonique rigide (grise/bleue) glisse latéralement sur la lithosphère.",
    scientificData: [
      "La plaque supérieure est océanique",
      "Mouvement horizontal de la plaque rigide",
    ],
  },
  {
    start: 2,
    end: 4,
    title: "Friction et fusion partielle",
    explanation: "Le frottement entre les plaques génère chaleur et fusion de la matière.",
    scientificData: [
      "La température augmente à cause du frottement",
      "Fusion partielle du manteau sous-jacent (rouge)",
    ],
  },
  {
    start: 4,
    end: 6,
    title: "Remontée du magma",
    explanation: "Le magma formé sous pression remonte à travers la plaque supérieure.",
    scientificData: [
      "Le magma remonte à travers des fissures",
      "Création de chambres magmatiques",
    ],
  },
  {
    start: 6,
    end: 9,
    title: "Formation du volcan",
    explanation: "Le magma atteint la surface et forme un volcan sur la plaque mobile.",
    scientificData: [
      "Éruption volcanique par accumulation",
      "Formation de cônes volcaniques à la surface",
    ],
  },
];

const VolcanModel = ({
  control,
  setStep,
}: {
  control: 'play' | 'pause' | 'reset';
  setStep: React.Dispatch<React.SetStateAction<Step | null>>;
}) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/form_volcan.glb');
  const { actions } = useAnimations(animations, group);

  const actionName = animations[0]?.name;
  const action = actions ? actions[actionName] : null;

  useEffect(() => {
    if (!action) return;

    action.timeScale = 0.3;

    if (control === 'play') {
      action.play();
      action.paused = false;
    } else if (control === 'pause') {
      action.paused = true;
    } else if (control === 'reset') {
      action.reset().stop();
      setStep(null);
    }
  }, [control, action, setStep]);

  useFrame(() => {
    if (!action || control !== 'play') return;

    const t = action.time;

    // Trouver la step en fonction du temps
    const currentStep = steps.find((step) => t >= step.start && t < step.end) ?? null;

    setStep(currentStep);
  });

  return <primitive ref={group} object={scene} scale={1.2} />;
};

const VolcanViewer = () => {
  const [control, setControl] = useState<'play' | 'pause' | 'reset'>('pause');
  const [step, setStep] = useState<Step | null>(null);

  return (
    <div className="space-y-4">
      <section className="relative h-[600px] w-full rounded-xl overflow-hidden border border-gray-300 shadow-inner bg-gray-100">
        <Canvas camera={{ position: [0, 2, 1], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <Environment preset="sunset" />
          <VolcanModel control={control} setStep={setStep} />
          <OrbitControls />
        </Canvas>

        {/* Carte explicative */}
        <div className="absolute bottom-4 right-4 max-w-[320px] max-h-[200px] overflow-y-auto bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-4 shadow-lg text-left pointer-events-auto">
          {!step ? (
            <p className="text-gray-600">Appuyez sur ▶️ pour démarrer l'animation.</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-1 text-red-700">{step.title}</h2>
              <p className="mb-1 text-sm">{step.explanation}</p>
              <ul className="list-disc pl-5 space-y-0.5 text-xs text-gray-700">
                {step.scientificData.map((data, i) => (
                  <li key={i}>{data}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* Contrôles */}
      <ControlButtons control={control} setControl={setControl} />
    </div>
  );
};

export default VolcanViewer;