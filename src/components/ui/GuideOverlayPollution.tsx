// src/components/ui/GuideOverlayPollution.tsx
import React, { useState } from "react"
import {
  Gamepad2,
  Keyboard,
  Lightbulb,
  MousePointerClick,
  Factory,
  Car,
  FlaskConical,
  BarChart,
} from "lucide-react"

interface GuideOverlayProps {
  onClose: () => void
}

const GuideOverlayPollution: React.FC<GuideOverlayProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'faq'>('guide')

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
              <Factory className="w-6 h-6 text-primary" />
              Guide d'utilisation rapide - Pollution Atmosphérique
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
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Conseils
                </h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Comparez les sources de pollution</li>
                  <li>Analysez l'impact des polluants</li>
                  <li>Observez la qualité de l’air</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">

            {/* Bloc FAQ 1 */}
            <div className="bg-light rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2 font-heading">
                <Car className="w-5 h-5" />
                Utilisation Générale
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-dark">Comment utiliser la simulation ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Choisissez une source de pollution, ajustez les paramètres et observez l'impact sur l'atmosphère.
                  </p>
                </li>
                <li>
                  <p className="font-medium text-dark">Comment changer de source ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Utilisez le menu déroulant pour basculer entre Transport et Industrie.
                  </p>
                </li>
              </ul>
            </div>

            {/* Bloc FAQ 2 */}
            <div className="bg-light rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2 font-heading">
                <FlaskConical className="w-5 h-5" />
                Polluants Atmosphériques
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-dark">Qu'est-ce que le CO₂ ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Gaz à effet de serre principal. Niveau normal : 350–420 ppm.
                  </p>
                </li>
                <li>
                  <p className="font-medium text-dark">Que sont les NOx ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Oxydes d’azote produits par la combustion. Limite OMS : 40 µg/m³.
                  </p>
                </li>
              </ul>
            </div>

            {/* Bloc FAQ 3 */}
            <div className="bg-light rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2 font-heading">
                <Factory className="w-5 h-5" />
                Sources de Pollution
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-dark">Impact d’une voiture ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Émet ~120g CO₂/km, +32 ppm/jour dans la simulation.
                  </p>
                </li>
                <li>
                  <p className="font-medium text-dark">Impact d’une industrie ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Environ 50 000 tonnes CO₂/an, 3× plus que les voitures.
                  </p>
                </li>
              </ul>
            </div>

            {/* Bloc données scientifiques */}
            <div className="bg-accent/10 rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2 font-heading">
                <BarChart className="w-5 h-5" />
                Données Scientifiques
              </h4>
              <div className="text-sm text-primary space-y-1">
                <p>• Sources : OMS, EPA, ADEME</p>
                <p>• Émissions voiture : 120g CO₂/km (moyenne UE)</p>
                <p>• Seuils OMS : PM2.5 ≤ 15 µg/m³, NO₂ ≤ 40 µg/m³</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GuideOverlayPollution