// src/components/views/AbdomenViewer.tsx
import React, { useRef, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Environment, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { X, Loader2 } from "lucide-react";

// Types TypeScript
interface AbdomenAnnotation {
  id: string;
  position: [number, number, number];
  title: string;
  description: string;
  color: string;
  functions: string[];
}

interface AnnotationPanelProps {
  annotation: AbdomenAnnotation | null;
  onClose: () => void;
}

interface AbdomenModelProps {
  onAnnotationClick: (annotation: AbdomenAnnotation) => void;
  hoveredAnnotation: string | null;
  setHoveredAnnotation: (id: string | null) => void;
}

interface CameraControlsRef {
  reset: () => void;
}

// Données des annotations de l'abdomen
const abdomenAnnotations: AbdomenAnnotation[] = [
  {
    id: "liver",
    position: [-0.2, -3, 2],
    title: "Foie",
    description: "Le plus grand organe interne, essentiel pour le métabolisme, la détoxification et la production de bile.",
    color: "#4CAF50",
    functions: [
      "Détoxification du sang",
      "Production de bile",
      "Stockage du glycogène",
      "Synthèse des protéines plasmatiques"
    ]
  },
  {
    id: "stomach",
    position: [3, 6, 0.8],
    title: "Estomac",
    description: "Organe musculaire qui digère les aliments grâce aux enzymes et à l'acide gastrique.",
    color: "#8BC34A",
    functions: [
      "Digestion mécanique",
      "Sécrétion d'acide chlorhydrique",
      "Production de pepsine",
      "Absorption limitée"
    ]
  },
  {
    id: "pancreas",
    position: [-0.5, -2, -0.5],
    title: "Pancréas",
    description: "Glande mixte qui produit des enzymes digestives et des hormones comme l'insuline.",
    color: "#CDDC39",
    functions: [
      "Production d'insuline",
      "Sécrétion d'enzymes digestives",
      "Régulation glycémique",
      "Neutralisation du chyme acide"
    ]
  },
  {
    id: "small-intestine",
    position: [0, -1.2, -2.5],
    title: "Intestin grêle",
    description: "Principal site de digestion et d'absorption des nutriments, divisé en duodénum, jéjunum et iléon.",
    color: "#FFC107",
    functions: [
      "Digestion chimique",
      "Absorption des nutriments",
      "Sécrétion d'enzymes",
      "Mouvements péristaltiques"
    ]
  },
  {
    id: "large-intestine",
    position: [-1.5, -1, -3],
    title: "Gros intestin",
    description: "Responsable de l'absorption d'eau et de la formation des matières fécales.",
    color: "#FF9800",
    functions: [
      "Absorption d'eau",
      "Formation des selles",
      "Flore bactérienne",
      "Production de vitamines (K, B)"
    ]
  },
  {
    id: "spleen",
    position: [1.8, 2.8, 0.5],
    title: "Rate",
    description: "Organe lymphoïde qui filtre le sang et participe aux défenses immunitaires.",
    color: "#F44336",
    functions: [
      "Filtration du sang",
      "Production de lymphocytes",
      "Stockage des plaquettes",
      "Dégradation des globules rouges vieillis"
    ]
  },
  {
    id: "kidneys",
    position: [2, 1.5, 0],
    title: "Reins",
    description: "Organes pairs qui filtrent le sang pour éliminer les déchets et réguler l'équilibre hydrique.",
    color: "#2196F3",
    functions: [
      "Filtration sanguine",
      "Production d'urine",
      "Régulation tensionnelle",
      "Équilibre électrolytique"
    ]
  }
];

// Composant du panneau d'annotation
const AnnotationPanel: React.FC<AnnotationPanelProps> = ({ annotation, onClose }) => {
  if (!annotation) return null;

  return (
    <div className="fixed top-4 left-4 z-50 max-w-sm">
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2" style={{ borderColor: annotation.color }}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full text-white shadow-lg" style={{ backgroundColor: annotation.color }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900">{annotation.title}</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed mb-4">{annotation.description}</p>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: annotation.color }} />
              Fonctions Principales
            </h4>
            <ul className="space-y-2">
              {annotation.functions.map((func, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: annotation.color }}
                  />
                  <span className="leading-relaxed">{func}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 p-2 rounded-lg" style={{ backgroundColor: `${annotation.color}15` }}>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: annotation.color }} />
              <span>Organe abdominal identifié</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant du point d'annotation 3D
const AnnotationPoint: React.FC<{
  annotation: AbdomenAnnotation;
  onClick: (annotation: AbdomenAnnotation) => void;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}> = ({ annotation, onClick, isHovered, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && isHovered) {
      meshRef.current.scale.setScalar(1.3 + Math.sin(state.clock.elapsedTime * 8) * 0.15);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }

    if (lineRef.current && isHovered) {
      lineRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
    } else if (lineRef.current) {
      lineRef.current.scale.y = 1;
    }
  });

  const abdomenCenter = new THREE.Vector3(0, 0, 0);
  const annotationPos = new THREE.Vector3(...annotation.position);
  const direction = abdomenCenter.clone().sub(annotationPos).normalize();
  const lineLength = 0.3;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={annotation.position}
        onClick={() => onClick(annotation)}
        onPointerEnter={() => onHover(annotation.id)}
        onPointerLeave={() => onHover(null)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={isHovered ? "#ffffff" : annotation.color}
          emissive={isHovered ? "#ffffff" : annotation.color}
          emissiveIntensity={isHovered ? 0.5 : 0.3}
          transparent
          opacity={0.95}
        />
      </mesh>

      <mesh
        ref={lineRef}
        position={[
          annotation.position[0] + direction.x * lineLength * 0.5,
          annotation.position[1] + direction.y * lineLength * 0.5,
          annotation.position[2] + direction.z * lineLength * 0.5,
        ]}
        lookAt={abdomenCenter}
      >
        <cylinderGeometry args={[0.015, 0.025, lineLength]} />
        <meshStandardMaterial
          color={annotation.color}
          transparent
          opacity={isHovered ? 0.9 : 0.6}
          emissive={annotation.color}
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh
        position={[
          annotation.position[0] + direction.x * lineLength,
          annotation.position[1] + direction.y * lineLength,
          annotation.position[2] + direction.z * lineLength,
        ]}
      >
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color={annotation.color}
          emissive={annotation.color}
          emissiveIntensity={0.4}
          transparent
          opacity={isHovered ? 1 : 0.8}
        />
      </mesh>

      {isHovered && (
        <Html
          position={[annotation.position[0], annotation.position[1] + 0.3, annotation.position[2]]}
          distanceFactor={6}
        >
          <div className="bg-black/95 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none shadow-xl border border-green-500/30">
            <div className="font-medium" style={{ color: annotation.color }}>{annotation.title}</div>
            <div className="text-xs text-gray-300 mt-1">Cliquez pour plus d'infos</div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/95 rotate-45 border-r border-b" style={{ borderColor: `${annotation.color}30` }}></div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Composant du modèle d'abdomen GLB
const AbdomenGLBModel: React.FC<AbdomenModelProps> = ({ onAnnotationClick, hoveredAnnotation, setHoveredAnnotation }) => {
  const abdomenRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/abdomen.glb");

  useFrame((state) => {
    if (abdomenRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.01;
      abdomenRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={abdomenRef}>
      <Center>
        <primitive object={scene} scale={1.5} />
      </Center>

      {abdomenAnnotations.map((annotation) => (
        <AnnotationPoint
          key={annotation.id}
          annotation={annotation}
          onClick={onAnnotationClick}
          isHovered={hoveredAnnotation === annotation.id}
          onHover={setHoveredAnnotation}
        />
      ))}
    </group>
  );
};

// Composant de chargement
const LoadingSpinner: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-30">
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <div className="text-center">
          <h3 className="font-semibold text-gray-900">Chargement du modèle 3D</h3>
          <p className="text-sm text-gray-600 mt-1">Préparation de l'anatomie abdominale...</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Composant de contrôle de la caméra
const CameraControls = React.forwardRef<CameraControlsRef>((_, ref) => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  React.useImperativeHandle(ref, () => ({
    reset: () => {
      if (controlsRef.current) {
        camera.position.set(0, 0, 8);
        camera.lookAt(0, 0, 0);
        controlsRef.current.reset();
      }
    },
  }));

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={3}
      maxDistance={30}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      autoRotate={false}
      dampingFactor={0.05}
      enableDamping={true}
    />
  );
});

CameraControls.displayName = "CameraControls";

// Composant principal AbdomenViewer
const AbdomenViewer: React.FC = () => {
  const [selectedAnnotation, setSelectedAnnotation] = useState<AbdomenAnnotation | null>(null);
  const [hoveredAnnotation, setHoveredAnnotation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cameraControlsRef = useRef<CameraControlsRef>(null);

  const handleAnnotationClick = useCallback((annotation: AbdomenAnnotation) => {
    setSelectedAnnotation(annotation);
  }, []);

  const handleCloseAnnotation = useCallback(() => {
    setSelectedAnnotation(null);
  }, []);

  const handleResetView = useCallback(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.reset();
    }
    setSelectedAnnotation(null);
    setHoveredAnnotation(null);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900">
      {isLoading && <LoadingSpinner />}

      <div className="absolute top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">Anatomie de l'Abdomen</h1>
          <p className="text-center text-gray-300 mt-2 text-sm md:text-base">
            Modèle 3D interactif des organes abdominaux
          </p>
        </div>
      </div>

      <AnnotationPanel annotation={selectedAnnotation} onClose={handleCloseAnnotation} />

      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <Button onClick={handleResetView} className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
          Réinitialiser la vue
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 max-w-xs">
        <Card className="bg-black/70 backdrop-blur-sm border-green-800">
          <CardContent className="p-3">
            <p className="text-white text-xs leading-relaxed">
              <strong className="text-green-300">Instructions:</strong>
              <br /> <strong className="text-green-300"> • Rotation: clic + glisser</strong>
              <br /> <strong className="text-green-300"> • Zoom: molette souris</strong>
              <br /> <strong className="text-green-300"> • Survolez les points colorés</strong>
              <br /> <strong className="text-green-300"> • Cliquez pour les détails</strong>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="absolute top-24 right-4 z-20">
        <Card className="bg-green-900/80 backdrop-blur-sm border-green-700">
          <CardContent className="p-3">
            <div className="text-white text-center">
              <div className="text-lg font-bold">{abdomenAnnotations.length}</div>
              <div className="text-xs">Organes</div>
              <div className="text-xs">annotés</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Canvas
        camera={{ position: [0, 0, 8], fov: 35 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
        shadows
        onCreated={() => setIsLoading(false)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#a5b4fc" />
        <pointLight position={[5, -5, -5]} intensity={0.4} color="#fca5a5" />

        <Environment preset="apartment" />
        <CameraControls ref={cameraControlsRef} />

        <Suspense fallback={null}>
          <AbdomenGLBModel
            onAnnotationClick={handleAnnotationClick}
            hoveredAnnotation={hoveredAnnotation}
            setHoveredAnnotation={setHoveredAnnotation}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Préchargement du modèle GLB
useGLTF.preload("/models/abdomen.glb");

export default AbdomenViewer;