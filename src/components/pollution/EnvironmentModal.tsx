// src/components/pollution/EnvironmentModal.tsx
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { Cloud, AlertCircle, Droplets, Thermometer, Microscope } from "lucide-react";
import type { PollutionData } from "../../types/simulationPollutionTypes";
import { getAQIStatus } from "../utils/aqiUtils";

interface EnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pollutionData: PollutionData;
  isAnalyzing: boolean;
}

export default function EnvironmentModal({
  isOpen,
  onClose,
  pollutionData,
  isAnalyzing,
}: EnvironmentModalProps) {
  const [showResults, setShowResults] = useState(false);
  const aqiStatus = getAQIStatus(pollutionData.aqi);

  useEffect(() => {
    if (isAnalyzing) {
      setShowResults(false);
      const timer = setTimeout(() => {
        setShowResults(true);
      }, 3000); // 3s d'analyse
      return () => clearTimeout(timer);
    } else {
      setShowResults(false);
    }
  }, [isAnalyzing]);

  const getExplanation = (key: string, value: number) => {
    switch (key) {
      case "co2":
        if (value < 400) return "Le niveau de CO₂ est très bas, ce qui indique un air bien renouvelé et sain pour la respiration.";
        if (value < 600) return "Le CO₂ est légèrement accru, ce qui est tolérable mais peut signaler une ventilation modérée.";
        if (value < 800) return "La concentration de CO₂ est élevée, ce qui peut entraîner un inconfort et révèle un manque de ventilation.";
        return "Le CO₂ est en quantité très élevée, ce qui intensifie l'effet de serre et contribue au réchauffement climatique.";

      case "nox":
        if (value < 40) return "Le niveau de NOx est faible, ce qui signifie que l’air est sain et peu irritant pour les voies respiratoires.";
        if (value < 70) return "Le NOx est modérément élevé, pouvant provoquer une irritation des voies respiratoires chez les personnes sensibles.";
        return "Le NOx atteint un niveau critique, augmentant fortement les risques de problèmes respiratoires et cardiovasculaires.";

      case "pm25":
        if (value < 15) return "La concentration en particules fines est faible, indiquant un air propre et peu pollué.";
        if (value < 35) return "La présence modérée de particules fines peut affecter la santé des personnes sensibles, comme les enfants et les asthmatiques.";
        return "La concentration élevée en particules fines représente un risque important pour les voies respiratoires et la santé pulmonaire.";

      case "aqi":
        if (value <= 50) return "L’air est très pur, sans risques pour la santé de la population générale.";
        if (value <= 100) return "La qualité de l’air est modérée, pouvant affecter les personnes sensibles comme les enfants ou malades.";
        if (value <= 150) return "La pollution est importante, il est conseillé de limiter les activités physiques intenses.";
        return "L’air est fortement pollué, exposant à des risques sanitaires, surtout lors d’expositions prolongées.";
      default:
        return "";
    }
  };

  const parameters = [
    {
      key: "co2",
      label: "CO₂",
      icon: <Cloud size={18} />,
      unit: "ppm",
      value: pollutionData.co2,
      color: "bg-gray-100 text-gray-700 border-gray-300",
    },
    {
      key: "nox",
      label: "NOx",
      icon: <AlertCircle size={18} />,
      unit: "µg/m³",
      value: pollutionData.nox,
      color: "bg-orange-100 text-orange-800 border-orange-300",
    },
    {
      key: "pm25",
      label: "PM2.5",
      icon: <Droplets size={18} />,
      unit: "µg/m³",
      value: pollutionData.pm25,
      color: "bg-purple-100 text-purple-800 border-purple-300",
    },
    {
      key: "aqi",
      label: "Indice AQI",
      icon: <Thermometer size={18} />,
      unit: "",
      value: pollutionData.aqi,
      color:
        aqiStatus.color === "green"
          ? "bg-green-100 text-green-800 border-green-300"
          : aqiStatus.color === "yellow"
            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
            : "bg-red-100 text-red-800 border-red-300",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Analyse de la qualité de l’air">
      {!showResults ? (
        <div className="flex flex-col items-center justify-center h-48 text-lg text-gray-700 animate-pulse">
          <div className="mb-4 text-3xl">
              <Microscope className="w-16 h-16 text-blue-600" />
          </div>
          <p className="font-semibold">Analyse en cours...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {parameters.map(({ key, label, icon, value, unit, color }) => (
            <div
              key={key}
              className={`p-4 border rounded-xl shadow-sm flex flex-col items-center text-center ${color}`}
            >
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                {icon}
                <span>{label}</span>
              </div>
              <div className="text-2xl font-bold mb-2">
                {value} {unit}
              </div>
              <p className="text-sm text-gray-600">{getExplanation(key, value)}</p>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}