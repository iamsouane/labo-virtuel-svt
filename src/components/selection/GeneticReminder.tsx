//src/components/selection/GeneticReminder
import { Lightbulb } from "lucide-react"
export const GeneticReminder = () => (
  <div className="bg-blue-50 p-3 rounded text-xs">
    <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-800">
      <Lightbulb className="w-4 h-4 text-yellow-500" />
      Rappel Génétique
    </h4>
    <ul className="space-y-1 text-gray-700">
      <li>• <strong>Allèles dominants</strong> s'expriment même avec un seul exemplaire</li>
      <li>• <strong>Allèles récessifs</strong> ne s'expriment qu'avec deux exemplaires</li>
      <li>• <strong>BB ou Bb</strong> = trait dominant visible</li>
      <li>• <strong>bb</strong> = trait récessif visible</li>
    </ul>
  </div>
)