import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import ControlButtons from '../../sections/ControlButtons';

type Step = {
  start: number; // temps en secondes
  end: number;
  title: string;
  explanation: string;
  scientificData: string[];
};

const steps: Step[] = [
  {
    start: 0,
    end: 1,
    title: "Mouvement des plaques",
    explanation: "Les plaques tectoniques se déplacent lentement sur le manteau terrestre.",
    scientificData: [
      "Vitesse moyenne : 2 à 10 cm/an",
      "Cause : convection dans le manteau",
    ],
  },
  {
    start: 1,
    end: 3,
    title: "Rapprochement des plaques",
    explanation: "Les plaques convergent vers une zone de subduction.",
    scientificData: [
      "Température au contact : jusqu'à 1200°C",
      "Pression élevée provoquant métamorphisme",
    ],
  },
  {
    start: 3,
    end: 5,
    title: "Collision et déformation",
    explanation: "Collision des plaques provoquant montagnes et séismes.",
    scientificData: [
      "Force de pression : jusqu'à des milliers de bars",
      "Énergie libérée : équivalente à plusieurs bombes nucléaires",
    ],
  },
  {
    start: 5,
    end: 10,
    title: "Cycle continu",
    explanation: "Les forces tectoniques continuent d'agir même après l’animation.",
    scientificData: [
      "Cycle tectonique : des millions d’années",
      "Formation continue des reliefs terrestres",
    ],
  },
];

const AnimatedModel = ({
  control,
  setStep,
}: {
  control: 'play' | 'pause' | 'reset';
  setStep: React.Dispatch<React.SetStateAction<Step | null>>;
}) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/tectonic.glb');
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
      setStep(null); // reset texte aussi
    }
  }, [control, action, setStep]);

  useFrame(() => {
    if (!action || control !== 'play') return;

    const t = action.time;

    const currentStep = steps.find((step) => t >= step.start && t < step.end) ?? null;

    setStep(currentStep);
  });

  return <primitive ref={group} object={scene} />;
};

const TectonicViewer = () => {
  const [control, setControl] = useState<'play' | 'pause' | 'reset'>('pause');
  const [step, setStep] = useState<Step | null>(null);

  return (
    <div className="space-y-4">
      <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-gray-300 shadow">
        <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Environment preset="sunset" />
          <AnimatedModel control={control} setStep={setStep} />
          <OrbitControls />
        </Canvas>

        {/* Carte explicative en overlay */}
        <div className="absolute bottom-4 right-4 max-w-[320px] max-h-[180px] overflow-y-auto bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-4 shadow-lg text-left pointer-events-auto">
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

      {/* Boutons de contrôle */}
      <ControlButtons control={control} setControl={setControl} />
    </div>
  );
};

export default TectonicViewer;