//src/components/ui/GuideOverlayPhotosynthese.tsx
import React, { useState } from "react";
import {
  Gamepad2,
  Keyboard,
  Lightbulb,
  MousePointerClick,
  Sun,
  LeafyGreen,
  Droplets,
  BarChart,
} from "lucide-react";

interface GuideOverlayProps {
  onClose: () => void;
}

const GuideOverlayPhotosynthese: React.FC<GuideOverlayProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'faq'>('guide');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4 font-sans">
      <div className="bg-light rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border-2 border-accent p-6">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-dark hover:text-secondary text-xl font-bold"
          aria-label="Fermer le guide"
          title="Fermer le guide"
        >
          ✕
        </button>

        {/* Tabs */}
        <div className="flex border-b border-accent mb-6">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 font-semibold font-heading ${
              activeTab === 'guide'
                ? 'text-primary border-b-2 border-primary'
                : 'text-dark hover:text-secondary'
            }`}
          >
            <span className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Guide Rapide
            </span>
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 font-semibold font-heading ${
              activeTab === 'faq'
                ? 'text-primary border-b-2 border-primary'
                : 'text-dark hover:text-secondary'
            }`}
          >
            <span className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              FAQ Complète
            </span>
          </button>
        </div>

        {activeTab === 'guide' ? (
          <>
            <h3 className="text-2xl font-bold mb-8 text-primary flex items-center justify-center gap-2 font-heading">
              <LeafyGreen className="w-6 h-6 text-primary" />
              Guide d'utilisation rapide - Photosynthèse
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-dark leading-relaxed">

              {/* Navigation 3D */}
              <div className="space-y-2">
                <h4 className="font-semibold text-dark flex items-center gap-2 font-heading">
                  <MousePointerClick className="w-4 h-4 text-dark" />
                  Navigation 3D
                </h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Clic + glisser :</strong> Rotation</li>
                  <li><strong>Molette :</strong> Zoom</li>
                  <li><strong>Survol :</strong> Informations</li>
                </ul>
              </div>

              {/* Raccourcis */}
              <div className="space-y-2">
                <h4 className="font-semibold text-dark flex items-center gap-2 font-heading">
                  <Keyboard className="w-4 h-4 text-dark" />
                  Raccourcis
                </h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Espace :</strong> Play/Pause</li>
                  <li><strong>R :</strong> Réinitialiser</li>
                  <li><strong>H :</strong> Aide</li>
                  <li><strong>T :</strong> Tutoriel</li>
                  <li><strong>Q :</strong> Quiz</li>
                </ul>
              </div>

              {/* Conseils */}
              <div className="space-y-2">
                <h4 className="font-semibold text-dark flex items-center gap-2 font-heading">
                  <Lightbulb className="w-4 h-4 text-dark" />
                  Conseils
                </h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Utilisez les presets pour gagner du temps</li>
                  <li>Visez la zone optimale d'efficacité</li>
                  <li>Observez l'évolution des indicateurs</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">

            {/* FAQ Block */}
            <div className="bg-light rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2 font-heading">
                <Sun className="w-5 h-5" />
                Utilisation Générale
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-dark">Comment utiliser la simulation ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Ajustez l'intensité lumineuse, la concentration en CO₂ et la température pour observer leur impact.
                  </p>
                </li>
                <li>
                  <p className="font-medium text-dark">Comment utiliser les presets ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Choisissez un environnement prédéfini (faible limunosité, hiver, serre chaude) pour tester différents contextes.
                  </p>
                </li>
              </ul>
            </div>

            {/* FAQ Block */}
            <div className="bg-light rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2 font-heading">
                <LeafyGreen className="w-5 h-5" />
                Facteurs Clés
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-dark">Qu'est-ce que le point de compensation ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Niveau de lumière où photosynthèse = respiration (env. 20-100 µmol/m²/s).
                  </p>
                </li>
                <li>
                  <p className="font-medium text-dark">Quel est l'impact de la température ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Optimum entre 20-30°C pour les plantes C3, plus pour les C4.
                  </p>
                </li>
              </ul>
            </div>

            {/* Plantes et environnement */}
            <div className="bg-light rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2 font-heading">
                <Droplets className="w-5 h-5" />
                Plantes et Environnements
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-dark">Différence C3/C4/CAM ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    C3: climat tempéré, C4: chaud/ensoleillé, CAM: désertique.
                  </p>
                </li>
                <li>
                  <p className="font-medium text-dark">Impact de l'eau ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Le stress hydrique ferme les stomates, réduisant le CO₂ absorbé.
                  </p>
                </li>
              </ul>
            </div>

            {/* Données scientifiques */}
            <div className="bg-accent/10 rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2 font-heading">
                <BarChart className="w-5 h-5" />
                Données Scientifiques
              </h4>
              <div className="text-sm text-primary space-y-1">
                <p>• Sources : Recherches en physiologie végétale</p>
                <p>• Lumière optimale : 500-1000 µmol/m²/s</p>
                <p>• CO₂ optimal : 400-1000 ppm</p>
                <p>• Rendement quantique max : ~8-9 photons/CO₂</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideOverlayPhotosynthese;