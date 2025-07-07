import React from "react"
import {
  Gamepad2,
  Keyboard,
  Lightbulb,
  MousePointerClick,
  BatteryCharging,
  Zap,
  Home,
} from "lucide-react"

interface GuideOverlayProps {
  onClose: () => void
}

const GuideOverlayEnergie: React.FC<GuideOverlayProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border-2 border-blue-500 p-6">
        
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
          aria-label="Fermer le guide"
          title="Fermer le guide"
        >
          ✕
        </button>

        {/* Titre principal */}
        <h3 className="text-xl font-bold mb-8 text-gray-800 flex items-center justify-center gap-2">
          <Gamepad2 className="w-6 h-6 text-blue-600" />
          Guide d'utilisation rapide – Conversion d'Énergie
        </h3>

        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700 leading-relaxed">

          {/* Bloc : Contrôles */}
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

          {/* Bloc : Raccourcis */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-gray-700" />
              Raccourcis
            </h4>
            <ul className="list-disc list-outside pl-4 space-y-1">
              <li><span className="ml-[-185px]"><strong>H :</strong> Aide</span></li>
              <li><span className="ml-[-185px]"><strong>Q :</strong> Quiz</span></li>
              <li><span className="ml-[-175px]"><strong>T :</strong> Tutoriel</span></li>
            </ul>
          </div>

          {/* Bloc : Conseils */}
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

          {/* Bloc : Types d'énergie */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 text-sm">
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-blue-600" />
                Énergie Source
              </h4>
              <p className="text-gray-700">
                Mécanique (vélo) ou Lumineuse (soleil) : énergie d’entrée.
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
      </div>
    </div>
  )
}

export default GuideOverlayEnergie