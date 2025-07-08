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
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border-2 border-red-500 p-6">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
          aria-label="Fermer le guide"
          title="Fermer le guide"
        >
          ✕
        </button>

        {/* Tab selector */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 font-medium ${activeTab === 'guide' ? 'text-red-600 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Guide Rapide
            </span>
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 font-medium ${activeTab === 'faq' ? 'text-red-600 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              FAQ Complète
            </span>
          </button>
        </div>

        {activeTab === 'guide' ? (
          <>
            {/* Main title */}
            <h3 className="text-xl font-bold mb-8 text-gray-800 flex items-center justify-center gap-2">
              <Factory className="w-6 h-6 text-red-600" />
              Guide d'utilisation rapide - Pollution Atmosphérique
            </h3>

            {/* Content grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700 leading-relaxed">

              {/* Block: 3D Navigation */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-gray-700" />
                  Navigation 3D
                </h4>
                <ul className="list-disc list-outside pl-4 text-sm text-gray-700 space-y-1">
                  <li>
                    <span className="ml-[-100px]">
                      <span className="font-semibold">Clic + glisser :</span> Rotation
                    </span>
                  </li>
                  <li>
                    <span className="ml-[-145px]">
                      <span className="font-semibold">Molette :</span> Zoom
                    </span>
                  </li>
                  <li>
                    <span className="ml-[-110px]">
                      <span className="font-semibold">Survol :</span> Informations
                    </span>
                  </li>
                </ul>
              </div>

              {/* Block: Keyboard shortcuts */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-gray-700" />
                  Raccourcis
                </h4>
                <ul className="list-disc list-outside pl-4 space-y-1 text-gray-700 text-sm">
                  <li><span className="ml-[-120px]"><strong>Espace :</strong> Play/Pause</span></li>
                  <li><span className="ml-[-150px]"><strong>R :</strong> Réinitialiser</span></li>
                  <li><span className="ml-[-190px]"><strong>H :</strong> Aide</span></li>
                  <li><span className="ml-[-170px]"><strong>T :</strong> Tutoriel</span></li>
                  <li><span className="ml-[-185px]"><strong>Q :</strong> Quiz</span></li>
                </ul>
              </div>

              {/* Block: Tips */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Conseils
                </h4>
                <ul className="list-disc list-outside pl-4 space-y-1 text-gray-700 text-sm">
                  <li><span className="ml-[-50px]">Comparez les sources de pollution</span></li>
                  <li><span className="ml-[-10px]">Analysez l'impact des différents polluants</span></li>
                  <li><span className="ml-[-20px]">Observez les effets sur la qualité de l'air</span></li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* FAQ Sections */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Car className="w-5 h-5 text-red-600" />
                Utilisation Générale
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-gray-700">Comment utiliser la simulation ?</p>
                  <p className="text-sm text-gray-600 mt-1 pl-4">Choisissez une source de pollution, ajustez les paramètres et observez l'impact sur l'atmosphère.</p>
                </li>
                <li>
                  <p className="font-medium text-gray-700">Comment changer de source de pollution ?</p>
                  <p className="text-sm text-gray-600 mt-1 pl-4">Utilisez le menu déroulant pour basculer entre Transport et Industrie.</p>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-red-600" />
                Polluants Atmosphériques
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-gray-700">Qu'est-ce que le CO₂ ?</p>
                  <p className="text-sm text-gray-600 mt-1 pl-4">Principal gaz à effet de serre. Concentration normale : 350-420 ppm.</p>
                </li>
                <li>
                  <p className="font-medium text-gray-700">Que sont les NOx ?</p>
                  <p className="text-sm text-gray-600 mt-1 pl-4">Oxydes d'azote émis par la combustion. Seuil OMS : 40 µg/m³.</p>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Factory className="w-5 h-5 text-red-600" />
                Sources de Pollution
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-gray-700">Impact d'une voiture ?</p>
                  <p className="text-sm text-gray-600 mt-1 pl-4">Émet ~120g CO₂/km, +32 ppm par jour dans la simulation.</p>
                </li>
                <li>
                  <p className="font-medium text-gray-700">Impact d'une industrie ?</p>
                  <p className="text-sm text-gray-600 mt-1 pl-4">Émet ~50 000 tonnes CO₂/an, impact 3x supérieur aux voitures.</p>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Données Scientifiques
              </h4>              <div className="text-sm text-blue-700 space-y-1">
                <p>• Sources : OMS, EPA, ADEME</p>
                <p>• Émissions voiture : 120g CO₂/km (moyenne européenne)</p>
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