// src/components/pollution/PollutionSourceSelector.tsx
interface Source {
  value: string;
  label: string;
}

interface PollutionSourceSelectorProps {
  value: string;
  onChange: (newValue: string) => void;
  sources: Source[];
}

export default function PollutionSourceSelector({
  value,
  onChange,
  sources,
}: PollutionSourceSelectorProps) {
  return (
    <div className="transform transition-all duration-300 hover:scale-105">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        🏭 Source de pollution
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-300"
      >
        {sources.map((source) => (
          <option key={source.value} value={source.value}>
            {source.label}
          </option>
        ))}
      </select>
    </div>
  );
}