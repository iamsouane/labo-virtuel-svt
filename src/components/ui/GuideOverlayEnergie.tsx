import React, { useState } from "react"
import {
  Gamepad2,
  Keyboard,
  Lightbulb,
  MousePointerClick,
  BatteryCharging,
  Zap,
  Home,
  Bike,
  Gauge,
  BarChart,
} from "lucide-react"

interface GuideOverlayProps {
  onClose: () => void
}

const GuideOverlayEnergie: React.FC<GuideOverlayProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'faq'>('guide')

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border-2 border-blue-500 p-6">

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
            className={`px-4 py-2 font-medium ${activeTab === 'guide' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Guide Rapide
            </span>
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 font-medium ${activeTab === 'faq' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
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
              <BatteryCharging className="w-6 h-6 text-blue-600" />
              Guide d'utilisation rapide - Conversion d'Énergie
            </h3>

            {/* Content grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700 leading-relaxed">

              {/* Block: Controls */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-gray-700" />
                  Contrôles
                </h4>
                <ul className="list-disc list-outside pl-4 space-y-1">
                  <li><span className="ml-[-40px]"><strong>Source :</strong> Choisir entre vélo et soleil</span></li>
                  <li><span className="ml-[-90px]"><strong>Curseur :</strong> Ajuster l'intensité</span></li>
                  <li><span className="ml-[-50px]"><strong>Générateur :</strong> Sélectionner le type</span></li>
                  <li><span className="ml-[-20px]"><strong>Appareil :</strong> Choisir l'appareil à alimenter</span></li>
                </ul>
              </div>

              {/* Block: Keyboard shortcuts */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-gray-700" />
                  Raccourcis
                </h4>
                <ul className="list-disc list-outside pl-4 space-y-1">
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
                <ul className="list-disc list-outside pl-4 space-y-1">
                  <li><span className="ml-[-6px]">Observez les pertes à chaque conversion</span></li>
                  <li><span className="ml-[-45px]">Comparez l'efficacité des appareils</span></li>
                  <li><span className="ml-[-20px]">Notez les différences entre les sources</span></li>
                </ul>
              </div>

              {/* Block: Energy types */}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 text-sm">
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Bike className="w-4 h-4 text-blue-600" />
                    Énergie Source
                  </h4>
                  <p className="text-gray-700">
                    Mécanique (vélo) ou Lumineuse (soleil) : énergie d'entrée.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    Énergie Électrique
                  </h4>
                  <p className="text-gray-700">
                    Produite par les générateurs : avec pertes à la conversion.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Home className="w-4 h-4 text-red-500" />
                    Énergie Finale
                  </h4>
                  <p className="text-gray-700">
                    Utilisée par l'appareil : chaleur, lumière ou mouvement.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* FAQ Sections */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-600" />
                Utilisation Générale
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-gray-700">Comment utiliser la simulation ?</p>
                  <p className="text-sm text-gray-600 mt-1 pl-4">Sélectionnez une source d'énergie, un générateur et un appareil, puis observez les conversions et pertes d'énergie.</p>
                </li>
                <li>
                  <p className="font-medium text-gray-700">Comment mesurer l'efficacité ?</p>
                  <p className="text-sm text-gray-600 mt-1 pl-4">Comparez l'énergie d'entrée avec l'énergie utile finale pour calculer le rendement global.</p>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BatteryCharging className="w-5 h-5 text-blue-600" />
                Types d'Énergie
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-gray-700">Énergie mécanique (vélo)</p>
                  <p className="text-sm text-gray-600 mt-1 pl-4">Un adulte peut produire environ 100W en pédalant (75W utiles après pertes mécaniques).</p>
                </li>
                <li>
                  <p className="font-medium text-gray-700">Énergie solaire</p>
                  <p className="text-sm text-gray-600 mt-1 pl-4">En plein soleil : ~1000W/m², mais panneaux typiques ont 15-20% de rendement.</p>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Conversion et Pertes
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-gray-700">Pertes typiques</p>
                  <p className="text-sm text-gray-600 mt-1 pl-4">Dynamo : 20-30% de perte, Panneau solaire : 80-85% de perte, Stockage batterie : 10-20% de perte.</p>
                </li>
                <li>
                  <p className="font-medium text-gray-700">Pourquoi ces pertes ?</p>
                  <p className="text-sm text-gray-600 mt-1 pl-4">Chaleur dissipée, résistance des composants, limites physiques des matériaux.</p>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Données Scientifiques
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Sources : Études en physique énergétique</p>
                <p>• Rendement dynamo typique : 70-80%</p>
                <p>• Rendement panneau solaire : 15-22%</p>
                <p>• Puissance humaine moyenne : 75-100W soutenus</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GuideOverlayEnergie