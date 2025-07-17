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
      color: "bg-primary",
      textColor: "text-primary",
      icon: <CheckCircle className="w-5 h-5 text-green-200" />,
      effects: [
        { icon: <CheckCircle className="w-4 h-4 text-primary" />, text: "Aucun effet sur la santé" },
        { icon: <Smile className="w-4 h-4 text-primary" />, text: "Qualité de l'air satisfaisante" }
      ],
      environmentalEffects: [
        { icon: <Leaf className="w-4 h-4 text-primary" />, text: "Faible impact sur l'environnement" },
        { icon: <Trees className="w-4 h-4 text-primary" />, text: "Écosystèmes stables" }
      ],
      recommendations: [
        "Profitez des activités extérieures"
      ]
    }
  }

  if (aqi <= 100) {
    return {
      label: "Modéré",
      color: "bg-accent",
      textColor: "text-dark",
      icon: <AlertTriangle className="w-5 h-5 text-secondary" />,
      effects: [
        { icon: <Zap className="w-4 h-4 text-secondary" />, text: "Léger inconfort pour personnes sensibles" },
        { icon: <Eye className="w-4 h-4 text-secondary" />, text: "Possible irritation des yeux" }
      ],
      environmentalEffects: [
        { icon: <Trees className="w-4 h-4 text-secondary" />, text: "Légère réduction de la photosynthèse" },
        { icon: <CloudFog className="w-4 h-4 text-secondary" />, text: "Visibilité réduite" }
      ],
      recommendations: [
        "Personnes sensibles : limitez les efforts prolongés à l'extérieur"
      ]
    }
  }

  if (aqi <= 150) {
    return {
      label: "Mauvais",
      color: "bg-secondary",
      textColor: "text-white",
      icon: <AlertCircle className="w-5 h-5 text-white" />,
      effects: [
        { icon: <Activity className="w-4 h-4 text-white" />, text: "Irritation respiratoire" },
        { icon: <Hospital className="w-4 h-4 text-white" />, text: "Aggravation de l'asthme" },
        { icon: <Zap className="w-4 h-4 text-white" />, text: "Éviter les activités intenses" }
      ],
      environmentalEffects: [
        { icon: <Trees className="w-4 h-4 text-white" />, text: "Stress des végétaux" },
        { icon: <Droplet className="w-4 h-4 text-white" />, text: "Risque de pluies acides" }
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
      color: "bg-dark",
      textColor: "text-light",
      icon: <XCircle className="w-5 h-5 text-light" />,
      effects: [
        { icon: <Hospital className="w-4 h-4 text-light" />, text: "Risque accru de problèmes cardiaques" },
        { icon: <Activity className="w-4 h-4 text-light" />, text: "Difficultés respiratoires importantes" }
      ],
      environmentalEffects: [
        { icon: <FlameKindling className="w-4 h-4 text-light" />, text: "Dégradation des écosystèmes" },
        { icon: <AlertOctagon className="w-4 h-4 text-light" />, text: "Impact sur la biodiversité" }
      ],
      recommendations: [
        "Restez à l'intérieur si possible",
        "Utilisez un purificateur d'air"
      ]
    }
  }

  return {
    label: "Dangereux",
    color: "bg-dark",
    textColor: "text-white",
    icon: <Skull className="w-5 h-5 text-white" />,
    effects: [
      { icon: <AlertTriangle className="w-4 h-4 text-white" />, text: "Urgence sanitaire" },
      { icon: <Hospital className="w-4 h-4 text-white" />, text: "Effets graves immédiats sur la santé" }
    ],
    environmentalEffects: [
      { icon: <Skull className="w-4 h-4 text-white" />, text: "Mort des végétaux sensibles" },
      { icon: <AlertOctagon className="w-4 h-4 text-white" />, text: "Déséquilibre écologique grave" }
    ],
    recommendations: [
      "Évitez toute activité extérieure",
      "Consultez un médecin en cas de symptômes"
    ]
  }
}