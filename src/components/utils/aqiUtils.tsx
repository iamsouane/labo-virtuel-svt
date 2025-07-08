// src/utils/aqiUtils.tsx
import { 
  CheckCircle, AlertTriangle, AlertCircle, XCircle, Skull, 
  Smile, Leaf, 
  Zap, Eye, CloudFog, 
  Hospital, Droplet, AlertOctagon, 
  Trees,
  Activity,
  FlameKindling
} from "lucide-react"

interface AQIStatus {
  label: string;
  color: string;
  textColor: string;
  icon: React.ReactNode;
  effects: {
    icon: React.ReactNode;
    text: string;
  }[];
  environmentalEffects: {
    icon: React.ReactNode;
    text: string;
  }[];
  recommendations: string[];
}

export const getAQIStatus = (aqi: number): AQIStatus => {
  if (aqi <= 50) {
    return { 
      label: "Bon", 
      color: "bg-green-500", 
      textColor: "text-green-700",
      icon: <CheckCircle className="w-5 h-5" />,
      effects: [
        { icon: <CheckCircle className="w-4 h-4 text-green-600" />, text: "Aucun effet sur la santé" },
        { icon: <Smile className="w-4 h-4 text-green-600" />, text: "Qualité de l'air satisfaisante" }
      ],
      environmentalEffects: [
        { icon: <Leaf className="w-4 h-4 text-green-600" />, text: "Faible impact sur l'environnement" },
        { icon: <Trees className="w-4 h-4 text-green-600" />, text: "Écosystèmes stables" }
      ],
      recommendations: [
        "Profitez des activités extérieures"
      ]
    }
  }
  
  if (aqi <= 100) {
    return { 
      label: "Modéré", 
      color: "bg-yellow-500", 
      textColor: "text-yellow-700",
      icon: <AlertTriangle className="w-5 h-5" />,
      effects: [
        { icon: <Zap className="w-4 h-4 text-yellow-600" />, text: "Léger inconfort pour personnes sensibles" },
        { icon: <Eye className="w-4 h-4 text-yellow-600" />, text: "Possible irritation des yeux" }
      ],
      environmentalEffects: [
        { icon: <Trees className="w-4 h-4 text-yellow-600" />, text: "Légère réduction de la photosynthèse" },
        { icon: <CloudFog className="w-4 h-4 text-yellow-600" />, text: "Visibilité réduite" }
      ],
      recommendations: [
        "Personnes sensibles : limitez les efforts prolongés à l'extérieur"
      ]
    }
  }
  
  if (aqi <= 150) {
    return { 
      label: "Mauvais", 
      color: "bg-orange-500", 
      textColor: "text-orange-700",
      icon: <AlertCircle className="w-5 h-5" />,
      effects: [
        { icon: <Activity className="w-4 h-4 text-orange-600" />, text: "Irritation respiratoire" },
        { icon: <Hospital className="w-4 h-4 text-orange-600" />, text: "Aggravation de l'asthme" },
        { icon: <Zap className="w-4 h-4 text-orange-600" />, text: "Éviter les activités intenses" }
      ],
      environmentalEffects: [
        { icon: <Trees className="w-4 h-4 text-orange-600" />, text: "Stress des végétaux" },
        { icon: <Droplet className="w-4 h-4 text-orange-600" />, text: "Risque de pluies acides" }
      ],
      recommendations: [
        "Portez un masque lors des sorties",
        "Évitez les exercices intenses"
      ]
    }
  }
  
  if (aqi <= 200) {
    return { 
      label: "Très mauvais", 
      color: "bg-red-500", 
      textColor: "text-red-700",
      icon: <XCircle className="w-5 h-5" />,
      effects: [
        { icon: <Hospital className="w-4 h-4 text-red-600" />, text: "Risque accru de problèmes cardiaques" },
        { icon: <Activity className="w-4 h-4 text-red-600" />, text: "Difficultés respiratoires importantes" }
      ],
      environmentalEffects: [
        { icon: <FlameKindling className="w-4 h-4 text-red-600" />, text: "Dégradation des écosystèmes" },
        { icon: <AlertOctagon className="w-4 h-4 text-red-600" />, text: "Impact sur la biodiversité" }
      ],
      recommendations: [
        "Restez à l'intérieur si possible",
        "Utilisez un purificateur d'air"
      ]
    }
  }
  
  return { 
    label: "Dangereux", 
    color: "bg-purple-500", 
    textColor: "text-purple-700",
    icon: <Skull className="w-5 h-5" />,
    effects: [
      { icon: <AlertTriangle className="w-4 h-4 text-purple-700" />, text: "Urgence sanitaire" },
      { icon: <Hospital className="w-4 h-4 text-purple-700" />, text: "Effets graves immédiats sur la santé" }
    ],
    environmentalEffects: [
      { icon: <Skull className="w-4 h-4 text-purple-700" />, text: "Mort des végétaux sensibles" },
      { icon: <AlertOctagon className="w-4 h-4 text-purple-700" />, text: "Déséquilibre écologique grave" }
    ],
    recommendations: [
      "Évitez toute activité extérieure",
      "Consultez un médecin en cas de symptômes"
    ]
  }
}