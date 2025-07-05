//src/components/ui/GuideOverlayPhotosynthese
import React from "react"

interface GuideOverlayProps {
  onClose: () => void
}

const GuideOverlayPhotosynthese: React.FC<GuideOverlayProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border-2 border-blue-500 p-6">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg font-bold"
          aria-label="Fermer le guide"
          title="Fermer le guide"
        >
          ✕
        </button>

        {/* Titre */}
        <h3 className="text-lg font-bold mb-6 text-gray-800 text-center">
          🎮 Guide d'utilisation rapide
        </h3>

        {/* Contenu en grille */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700 leading-relaxed">
          <div>
            <h4 className="font-semibold mb-2 text-gray-800">🖱️ Navigation 3D</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Clic + glisser : Rotation</li>
              <li>Molette : Zoom</li>
              <li>Survol : Informations</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-gray-800">⌨️ Raccourcis</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Espace : Play/Pause</li>
              <li>R : Reset</li>
              <li>H : Aide</li>
              <li>T : Tutoriel</li>
              <li>Q : Quiz</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-gray-800">🎯 Conseils</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Utilisez les presets</li>
              <li>Visez la zone optimale</li>
              <li>Observez les indicateurs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuideOverlayPhotosynthese