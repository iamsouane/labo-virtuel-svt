"use client"

interface ChartData {
  time: string
  co2: number
  nox: number
  pm25: number
  aqi: number
}

interface PollutionChartProps {
  data: ChartData[]
}

export default function PollutionChart({ data }: PollutionChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <div>Collecte des données en cours...</div>
        </div>
      </div>
    )
  }

  const maxValues = {
    co2: Math.max(...data.map((d) => d.co2), 500),
    nox: Math.max(...data.map((d) => d.nox), 100),
    pm25: Math.max(...data.map((d) => d.pm25), 100),
    aqi: Math.max(...data.map((d) => d.aqi), 200),
  }

  const getPathData = (values: number[], max: number) => {
    const width = 100
    const height = 60
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - (value / max) * height
      return `${x},${y}`
    })
    return `M ${points.join(" L ")}`
  }

  return (
    <div className="space-y-6">
      {/* Graphiques individuels */}
      <div className="grid grid-cols-2 gap-4">
        {/* CO₂ */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">🔴 CO₂ (ppm)</h4>
          <div className="relative h-16">
            <svg className="w-full h-full" viewBox="0 0 100 60">
              <path
                d={getPathData(
                  data.map((d) => d.co2),
                  maxValues.co2,
                )}
                stroke="#dc2626"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id="co2Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`${getPathData(
                  data.map((d) => d.co2),
                  maxValues.co2,
                )} L 100,60 L 0,60 Z`}
                fill="url(#co2Gradient)"
              />
            </svg>
          </div>
          <div className="text-right text-sm text-red-600 font-medium">{data[data.length - 1]?.co2} ppm</div>
        </div>

        {/* NOx */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">🟠 NOx (µg/m³)</h4>
          <div className="relative h-16">
            <svg className="w-full h-full" viewBox="0 0 100 60">
              <path
                d={getPathData(
                  data.map((d) => d.nox),
                  maxValues.nox,
                )}
                stroke="#ea580c"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id="noxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`${getPathData(
                  data.map((d) => d.nox),
                  maxValues.nox,
                )} L 100,60 L 0,60 Z`}
                fill="url(#noxGradient)"
              />
            </svg>
          </div>
          <div className="text-right text-sm text-orange-600 font-medium">{data[data.length - 1]?.nox} µg/m³</div>
        </div>

        {/* PM2.5 */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">🟣 PM2.5 (µg/m³)</h4>
          <div className="relative h-16">
            <svg className="w-full h-full" viewBox="0 0 100 60">
              <path
                d={getPathData(
                  data.map((d) => d.pm25),
                  maxValues.pm25,
                )}
                stroke="#9333ea"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id="pm25Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#9333ea" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`${getPathData(
                  data.map((d) => d.pm25),
                  maxValues.pm25,
                )} L 100,60 L 0,60 Z`}
                fill="url(#pm25Gradient)"
              />
            </svg>
          </div>
          <div className="text-right text-sm text-purple-600 font-medium">{data[data.length - 1]?.pm25} µg/m³</div>
        </div>

        {/* AQI */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">🔵 AQI</h4>
          <div className="relative h-16">
            <svg className="w-full h-full" viewBox="0 0 100 60">
              <path
                d={getPathData(
                  data.map((d) => d.aqi),
                  maxValues.aqi,
                )}
                stroke="#2563eb"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id="aqiGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`${getPathData(
                  data.map((d) => d.aqi),
                  maxValues.aqi,
                )} L 100,60 L 0,60 Z`}
                fill="url(#aqiGradient)"
              />
            </svg>
          </div>
          <div className="text-right text-sm text-blue-600 font-medium">{data[data.length - 1]?.aqi}</div>
        </div>
      </div>

      {/* Informations sur les données */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>📊 {data.length} mesures collectées</span>
          <span>🕐 Dernière mise à jour: {data[data.length - 1]?.time}</span>
        </div>
      </div>
    </div>
  )
}