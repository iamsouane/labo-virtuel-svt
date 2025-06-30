"use client"

import { useState } from "react"

interface AideProps {
  onClose: () => void
}

export default function Aide({ onClose }: AideProps) {
  const [activeSection, setActiveSection] = useState("general")

  const sections = {
    general: {
      title: "🎯 Utilisation Générale",
      content: [
        {
          question: "Comment démarrer la simulation ?",
          answer:
            "Cliquez sur le bouton 'Commencer à pédaler' ou 'Faire briller le soleil' selon la source d'énergie choisie. Ajustez ensuite l'intensité avec le curseur.",
        },
        {
          question: "Comment changer de source d'énergie ?",
          answer:
            "Utilisez le menu déroulant 'Source d'énergie' pour choisir entre le vélo (énergie mécanique) et le soleil (énergie solaire).",
        },
        {
          question: "Que signifient les pourcentages affichés ?",
          answer:
            "Les pourcentages représentent l'intensité de chaque type d'énergie : source, électrique, et finale. Ils montrent l'efficacité des transformations.",
        },
      ],
    },
    sources: {
      title: "🔋 Sources d'Énergie",
      content: [
        {
          question: "Quelle est la différence entre le vélo et le soleil ?",
          answer:
            "Le vélo produit de l'énergie mécanique par l'effort humain, tandis que le soleil fournit de l'énergie lumineuse constante et renouvelable.",
        },
        {
          question: "Pourquoi l'intensité solaire est-elle fixe ?",
          answer:
            "L'intensité solaire représente les conditions météorologiques. Vous pouvez l'ajuster pour simuler différents niveaux d'ensoleillement.",
        },
        {
          question: "Comment optimiser la production d'énergie ?",
          answer:
            "Augmentez l'intensité de la source et choisissez les générateurs et appareils les plus efficaces selon vos besoins.",
        },
      ],
    },
    generateurs: {
      title: "⚡ Générateurs",
      content: [
        {
          question: "Quelle est la différence entre les générateurs ?",
          answer:
            "La génératrice (80% d'efficacité) convertit l'énergie mécanique, tandis que le panneau solaire (85% d'efficacité) convertit l'énergie lumineuse.",
        },
        {
          question: "Pourquoi y a-t-il des pertes d'énergie ?",
          answer:
            "Toute conversion d'énergie implique des pertes sous forme de chaleur, frottements, ou résistance électrique. C'est un principe physique fondamental.",
        },
        {
          question: "Comment choisir le bon générateur ?",
          answer:
            "Adaptez le générateur à votre source : génératrice pour le vélo, panneau solaire pour le soleil, bien que les deux soient techniquement possibles.",
        },
      ],
    },
    appareils: {
      title: "🏠 Appareils",
      content: [
        {
          question: "Quel appareil est le plus efficace ?",
          answer:
            "Le chauffe-eau (95%), suivi de l'ampoule LED (90%), puis du ventilateur (85%). L'efficacité dépend de la technologie utilisée.",
        },
        {
          question: "Pourquoi le ventilateur tourne-t-il ?",
          answer:
            "L'animation du ventilateur est proportionnelle à la puissance reçue, simulant le comportement réel d'un moteur électrique.",
        },
        {
          question: "Comment interpréter les animations ?",
          answer:
            "Plus l'intensité est élevée, plus les effets visuels sont prononcés : luminosité de l'ampoule, vitesse du ventilateur, chaleur du chauffe-eau.",
        },
      ],
    },
    symboles: {
      title: "🔤 Symboles d'Énergie",
      content: [
        {
          question: "Que représentent les symboles 'E' ?",
          answer:
            "Les 'E' symbolisent les particules d'énergie qui se déplacent dans le système, changeant de couleur selon le type d'énergie.",
        },
        {
          question: "Pourquoi les couleurs changent-elles ?",
          answer:
            "Chaque couleur représente un type d'énergie : bleu/jaune (source), vert (électrique), et couleur spécifique selon l'appareil final.",
        },
        {
          question: "Comment activer/désactiver les symboles ?",
          answer:
            "Utilisez le bouton 'Afficher/Masquer les symboles E' dans les contrôles pour basculer l'affichage des particules d'énergie.",
        },
      ],
    },
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">❓ Aide</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <nav className="space-y-2">
            {Object.entries(sections).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  activeSection === key ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {sections[activeSection as keyof typeof sections].title}
          </h3>

          <div className="space-y-6">
            {sections[activeSection as keyof typeof sections].content.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">Q:</span>
                  {item.question}
                </h4>
                <p className="text-gray-700 leading-relaxed pl-6">
                  <span className="text-green-500 font-semibold">R:</span> {item.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">📧 Besoin d'aide supplémentaire ?</h4>
            <p className="text-blue-700 text-sm">
              Si vous avez d'autres questions, n'hésitez pas à consulter le guide tutoriel ou à expérimenter avec les
              différents paramètres de la simulation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}