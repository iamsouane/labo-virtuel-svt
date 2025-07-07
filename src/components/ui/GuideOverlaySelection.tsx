// src/components/ui/GuideOverlaySelection.tsx
import React from "react"
import { Gamepad2, Keyboard, Lightbulb, MousePointerClick } from "lucide-react"

interface GuideOverlayProps {
  onClose: () => void
}

const GuideOverlaySelection: React.FC<GuideOverlayProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border-2 border-green-500 p-6">

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
          <Gamepad2 className="w-6 h-6 text-green-600" />
          Guide d'utilisation rapide
        </h3>

        {/* Grille de contenu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700 leading-relaxed">

          {/* Bloc : Navigation 3D */}
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

          {/* Bloc : Raccourcis clavier */}
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

          {/* Bloc : Conseils */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Conseils
            </h4>
            <ul className="list-disc list-outside pl-4 space-y-1 text-gray-700 text-sm">
              <li><span className="ml-[-50px]">Testez différents environnements</span></li>
              <li><span className="ml-[-35px]">Observez sur plusieurs générations</span></li>
              <li><span className="ml-[-60px]">Comparez les traits avantageux</span></li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuideOverlaySelection