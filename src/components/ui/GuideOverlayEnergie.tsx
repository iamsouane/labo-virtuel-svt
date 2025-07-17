import React, { useState } from "react";
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
} from "lucide-react";

interface GuideOverlayProps {
  onClose: () => void;
}

const GuideOverlayEnergie: React.FC<GuideOverlayProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"guide" | "faq">("guide");

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4 font-sans">
      <div className="bg-light rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border-2 border-accent p-6">

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-dark hover:text-secondary text-xl font-bold"
          aria-label="Fermer le guide"
          title="Fermer le guide"
        >
          ✕
        </button>

        {/* Sélecteur d'onglets */}
        <div className="flex border-b border-accent mb-6">
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-4 py-2 font-semibold font-heading ${
              activeTab === "guide"
                ? "text-primary border-b-2 border-primary"
                : "text-dark hover:text-secondary"
            }`}
          >
            <span className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Guide Rapide
            </span>
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`px-4 py-2 font-semibold font-heading ${
              activeTab === "faq"
                ? "text-primary border-b-2 border-primary"
                : "text-dark hover:text-secondary"
            }`}
          >
            <span className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              FAQ Complète
            </span>
          </button>
        </div>

        {activeTab === "guide" ? (
          <>
            {/* Titre principal */}
            <h3 className="text-2xl font-bold mb-8 text-primary flex items-center justify-center gap-2 font-heading">
              <BatteryCharging className="w-6 h-6 text-primary" />
              Guide d'utilisation rapide - Conversion d'Énergie
            </h3>

            {/* Contenu grille */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-dark leading-relaxed">

              {/* Bloc : Contrôles */}
              <div className="space-y-2">
                <h4 className="font-semibold text-dark flex items-center gap-2 font-heading">
                  <MousePointerClick className="w-4 h-4 text-dark" />
                  Contrôles
                </h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Source :</strong> Choisir entre vélo et soleil</li>
                  <li><strong>Curseur :</strong> Ajuster l'intensité</li>
                  <li><strong>Générateur :</strong> Sélectionner le type</li>
                  <li><strong>Appareil :</strong> Choisir l'appareil à alimenter</li>
                </ul>
              </div>

              {/* Bloc : Raccourcis clavier */}
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

              {/* Bloc : Conseils */}
              <div className="space-y-2">
                <h4 className="font-semibold text-dark flex items-center gap-2 font-heading">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Conseils
                </h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Observez les pertes à chaque conversion</li>
                  <li>Comparez l'efficacité des appareils</li>
                  <li>Notez les différences entre les sources</li>
                </ul>
              </div>

              {/* Bloc : Types d'énergie */}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 text-sm">
                <div className="space-y-1">
                  <h4 className="font-semibold text-dark flex items-center gap-2">
                    <Bike className="w-4 h-4 text-primary" />
                    Énergie Source
                  </h4>
                  <p>
                    Mécanique (vélo) ou Lumineuse (soleil) : énergie d'entrée.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-dark flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    Énergie Électrique
                  </h4>
                  <p>
                    Produite par les générateurs : avec pertes à la conversion.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-dark flex items-center gap-2">
                    <Home className="w-4 h-4 text-secondary" />
                    Énergie Finale
                  </h4>
                  <p>
                    Utilisée par l'appareil : chaleur, lumière ou mouvement.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Sections FAQ */}
            <div className="bg-accent/10 rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2 font-heading">
                <Gauge className="w-5 h-5" />
                Utilisation Générale
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-primary">Comment utiliser la simulation ?</p>
                  <p className="text-sm text-primary/80 mt-1 pl-4">
                    Sélectionnez une source d'énergie, un générateur et un appareil, puis observez les conversions et pertes d'énergie.
                  </p>
                </li>
                <li>
                  <p className="font-medium text-primary">Comment mesurer l'efficacité ?</p>
                  <p className="text-sm text-primary/80 mt-1 pl-4">
                    Comparez l'énergie d'entrée avec l'énergie utile finale pour calculer le rendement global.
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-accent/10 rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2 font-heading">
                <BatteryCharging className="w-5 h-5" />
                Types d'Énergie
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-primary">Énergie mécanique (vélo)</p>
                  <p className="text-sm text-primary/80 mt-1 pl-4">
                    Un adulte peut produire environ 100W en pédalant (75W utiles après pertes mécaniques).
                  </p>
                </li>
                <li>
                  <p className="font-medium text-primary">Énergie solaire</p>
                  <p className="text-sm text-primary/80 mt-1 pl-4">
                    En plein soleil : ~1000W/m², mais panneaux typiques ont 15-20% de rendement.
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-accent/10 rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2 font-heading">
                <Zap className="w-5 h-5" />
                Conversion et Pertes
              </h4>
              <ul className="space-y-3">
                <li>
                  <p className="font-medium text-primary">Pertes typiques</p>
                  <p className="text-sm text-primary/80 mt-1 pl-4">
                    Dynamo : 20-30% de perte, Panneau solaire : 80-85% de perte, Stockage batterie : 10-20% de perte.
                  </p>
                </li>
                <li>
                  <p className="font-medium text-primary">Pourquoi ces pertes ?</p>
                  <p className="text-sm text-primary/80 mt-1 pl-4">
                    Chaleur dissipée, résistance des composants, limites physiques des matériaux.
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-accent/20 rounded-xl p-4 border border-accent">
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2 font-heading">
                <BarChart className="w-5 h-5" />
                Données Scientifiques
              </h4>
              <div className="text-sm text-primary space-y-1">
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
  );
};

export default GuideOverlayEnergie;