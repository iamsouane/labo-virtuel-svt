// src/components/ui/GuideOverlaySelection.tsx
import React, { useState } from "react"
import {
  Gamepad2,
  Keyboard,
  Lightbulb,
  MousePointerClick,
  Leaf,
  Rabbit,
  Dna,
  BarChart,
} from "lucide-react"

interface GuideOverlayProps {
  onClose: () => void
}

const GuideOverlaySelection: React.FC<GuideOverlayProps> = ({ onClose }) => {
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
              <Leaf className="w-6 h-6 text-primary" />
              Guide d'utilisation rapide - Sélection Naturelle
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
                  <li>Testez différents environnements</li>
                  <li>Observez sur plusieurs générations</li>
                  <li>Comparez les traits avantageux</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">

            <div className="bg-light rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2 font-heading">
                <Rabbit className="w-5 h-5" />
                Utilisation Générale
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-dark">Comment utiliser la simulation ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Sélectionnez un environnement, lancez la simulation et observez comment les populations évoluent.
                  </p>
                </li>
                <li>
                  <p className="font-medium text-dark">Comment changer d'environnement ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Utilisez le menu déroulant pour basculer entre différents types d'environnements.
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-light rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2 font-heading">
                <Dna className="w-5 h-5" />
                Mécanismes Évolutifs
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-dark">Qu'est-ce que la sélection naturelle ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Processus par lequel les traits avantageux deviennent plus fréquents dans une population.
                  </p>
                </li>
                <li>
                  <p className="font-medium text-dark">Comment les mutations interviennent-elles ?</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Des variations aléatoires apparaissent à chaque génération avec une faible probabilité.
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-light rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2 font-heading">
                <Leaf className="w-5 h-5" />
                Paramètres Clés
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-dark">Taux de mutation</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Contrôle la fréquence d'apparition de nouveaux traits (1-5% par défaut).
                  </p>
                </li>
                <li>
                  <p className="font-medium text-dark">Pression sélective</p>
                  <p className="text-sm text-dark/80 mt-1 pl-4">
                    Détermine à quel point l'environnement favorise certains traits (faible ou forte).
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-accent/10 rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2 font-heading">
                <BarChart className="w-5 h-5" />
                Données Scientifiques
              </h4>
              <div className="text-sm text-primary space-y-1">
                <p>• Sources : Études sur la phalène du bouleau, Darwin</p>
                <p>• Taux de mutation typique : 0.1-10% selon les espèces</p>
                <p>• Générations pour adaptation visible : 10 à 50</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GuideOverlaySelection