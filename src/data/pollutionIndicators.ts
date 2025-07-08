// src/data/pollutionIndicators.ts
export const POLLUTION_INDICATORS = [
  {
    key: "co2",
    label: "CO₂",
    color: "red",
    delay: "0s",
    tooltip: {
      title: "💨 Dioxyde de Carbone (CO₂)",
      description:
        "Gaz à effet de serre principal. Concentration normale : 350-420 ppm. Cause le réchauffement climatique. Sources : combustion fossile, déforestation.",
    },
  },
  {
    key: "nox",
    label: "NOx",
    color: "orange",
    delay: "0.1s",
    tooltip: {
      title: "🔥 Oxydes d'Azote (NOx)",
      description:
        "Gaz toxiques (NO, NO₂). Seuil OMS : 40 µg/m³. Causent asthme, pluies acides. Sources : véhicules, centrales thermiques.",
    },
  },
  {
    key: "pm25",
    label: "PM2.5",
    color: "purple",
    delay: "0.2s",
    tooltip: {
      title: "🫁 Particules Fines (PM2.5)",
      description:
        "Particules < 2,5 µm. Seuil OMS : 15 µg/m³. Pénètrent dans le sang, causent cancers, AVC. Sources : diesel, industrie, feux.",
    },
  },
  {
    key: "aqi",
    label: "AQI",
    color: "dynamic",
    delay: "0.3s",
    tooltip: {
      title: "📊 Indice de Qualité de l'Air (AQI)",
      description:
        "Échelle 0-500. Bon: 0-50, Modéré: 51-100, Mauvais: 101-150, Très mauvais: 151-200, Dangereux: 201-300, Urgence: >300.",
    },
  },
]