"use client"

interface Solution {
  id: string
  name: string
  icon: string
  active: boolean
  impact: number
}

interface SolutionsPanelProps {
  solutions: Solution[]
  onSolutionToggle: (solutionId: string) => void
}

export default function SolutionsPanel({ solutions, onSolutionToggle }: SolutionsPanelProps) {
  const totalImpact = solutions.filter((s) => s.active).reduce((sum, s) => sum + s.impact, 0)

  const getSolutionDescription = (id: string) => {
    const descriptions: Record<string, string> = {
      electric: "Remplace les véhicules thermiques par des véhicules électriques",
      filter: "Installe des filtres à particules dans les usines",
      bike: "Développe les infrastructures cyclables",
      solar: "Utilise l'énergie solaire au lieu des combustibles fossiles",
      trees: "Plante des arbres pour absorber le CO₂",
    }
    return descriptions[id] || ""
  }

  return (
    <div className="shadow-lg border-2 border-green-200 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-green-50 px-6 py-4 border-b border-green-200">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>🛠️</span>
          <span>Solutions Anti-Pollution</span>
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Impact total */}
        <div className="bg-green-100 p-4 rounded-lg border border-green-300">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-green-800">Impact total des solutions:</span>
            <span className="text-2xl font-bold text-green-700">-{totalImpact}%</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, totalImpact)}%` }}
            />
          </div>
        </div>

        {/* Liste des solutions */}
        <div className="space-y-4">
          {solutions.map((solution) => (
            <div
              key={solution.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                solution.active
                  ? "border-green-400 bg-green-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{solution.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{solution.name}</h3>
                    <p className="text-sm text-gray-600">{getSolutionDescription(solution.id)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-green-600">-{solution.impact}%</span>
                  <button
                    onClick={() => onSolutionToggle(solution.id)}
                    className={`mt-2 px-4 py-2 text-sm rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      solution.active
                        ? "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
                        : "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500"
                    }`}
                  >
                    {solution.active ? "Désactiver" : "Activer"}
                  </button>
                </div>
              </div>

              {solution.active && (
                <div className="mt-3 p-2 bg-green-100 rounded border border-green-200">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <span className="animate-pulse">✅</span>
                    <span>Solution active - Réduction de {solution.impact}% de la pollution</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Conseils */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <span>💡</span>
            <span>Conseil du laboratoire</span>
          </h4>
          <p className="text-sm text-blue-700">
            {totalImpact === 0 && "Activez des solutions pour voir leur impact sur la qualité de l'air !"}
            {totalImpact > 0 &&
              totalImpact < 50 &&
              "Bon début ! Essayez d'activer plus de solutions pour un impact maximal."}
            {totalImpact >= 50 && totalImpact < 80 && "Excellent ! Vous réduisez significativement la pollution."}
            {totalImpact >= 80 && "Parfait ! Vous avez créé un environnement très propre."}
          </p>
        </div>
      </div>
    </div>
  )
}