// src/components/admin/SimulationForm.tsx
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Simulation } from "../../types";

interface SimulationFormProps {
  onSimulationAdded?: (simulation: Simulation) => void;
  createdBy: string;
}

// Liste des simulations disponibles
const SIMULATION_PRESETS = [
  { code: "photosynthese", titre: "Expérience sur la photosynthèse" },
  { code: "selection-naturelle", titre: "Sélection naturelle" },
  { code: "energie", titre: "Formes et transformations de l'énergie" },
  { code: "pollution", titre: "Pollution de l'air" },
];

const SimulationForm = ({ onSimulationAdded, createdBy }: SimulationFormProps) => {
  const [titre, setTitre] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [chapitre, setChapitre] = useState("");
  const [objectifs, setObjectifs] = useState("");
  const [resultats, setResultats] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("simulation")
      .insert([
        {
          code,
          titre,
          description,
          chapitre,
          objectifs,
          resultats_attendus: resultats,
          created_by: createdBy,
        },
      ])
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert("Erreur lors de l'ajout : " + error.message);
    } else if (data) {
      setSuccessMsg("Simulation ajoutée avec succès !");
      setCode("");
      setTitre("");
      setDescription("");
      setChapitre("");
      setObjectifs("");
      setResultats("");
      onSimulationAdded?.(data);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-3xl"
    >
      <h3 className="text-xl font-bold mb-2">Ajouter une simulation</h3>

      {successMsg && (
        <div className="text-green-600 font-semibold">{successMsg}</div>
      )}

      <select
        required
        value={titre}
        onChange={(e) => {
          const selected = SIMULATION_PRESETS.find(
            (preset) => preset.titre === e.target.value
          );
          setTitre(selected?.titre || "");
          setCode(selected?.code || "");
        }}
        className="w-full border px-4 py-2 rounded"
      >
        <option value="">-- Choisir une simulation --</option>
        {SIMULATION_PRESETS.map((sim) => (
          <option key={sim.code} value={sim.titre}>
            {sim.titre}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />
      <input
        type="text"
        placeholder="Chapitre (optionnel)"
        value={chapitre}
        onChange={(e) => setChapitre(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />
      <textarea
        placeholder="Objectifs pédagogiques"
        value={objectifs}
        onChange={(e) => setObjectifs(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />
      <textarea
        placeholder="Résultats attendus"
        value={resultats}
        onChange={(e) => setResultats(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
      >
        {loading ? "Ajout en cours..." : "Ajouter la simulation"}
      </button>
    </form>
  );
};

export default SimulationForm;