//src/components/ui/PhotosyntheseUsageGuide
const PhotosyntheseUsageGuide = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl mb-8 max-w-4xl mx-auto border border-blue-200">
      <h3 className="font-bold text-blue-800 mb-4 text-lg">🎮 Guide d'utilisation rapide :</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700" data-tutorial="shortcuts">
        <div className="space-y-2">
          <h4 className="font-semibold">🖱️ Navigation 3D</h4>
          <ul className="space-y-1">
            <li>• Clic + glisser : Rotation</li>
            <li>• Molette : Zoom</li>
            <li>• Survol : Informations</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">⌨️ Raccourcis</h4>
          <ul className="space-y-1">
            <li>• Espace : Play/Pause</li>
            <li>• R : Reset</li>
            <li>• H : Aide</li>
            <li>• T : Tutoriel</li>
            <li>• Q : Quiz</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">🎯 Conseils</h4>
          <ul className="space-y-1">
            <li>• Utilisez les presets</li>
            <li>• Visez la zone optimale</li>
            <li>• Observez les indicateurs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PhotosyntheseUsageGuide