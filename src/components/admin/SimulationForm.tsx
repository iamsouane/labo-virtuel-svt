//src/components/admin/SimulationForm.tsx
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Simulation } from "../../types";
import { notifySuccess, notifyError } from "../../lib/notifications";
import { useActivityLogger } from "../../hooks/useActivityLogger";

interface SimulationFormProps {
  onSimulationAdded?: (simulation: Simulation) => void;
  createdBy: string;
}

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
  const logActivity = useActivityLogger();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("simulation")
      .insert([{
        code,
        titre,
        description,
        chapitre,
        objectifs,
        resultats_attendus: resultats,
        created_by: createdBy,
      }])
      .select()
      .single();

    setLoading(false);

    if (error) {
      notifyError("Erreur : " + error.message);
      return;
    }

    if (data) {
      notifySuccess("Simulation ajoutée avec succès !");
      setCode("");
      setTitre("");
      setDescription("");
      setChapitre("");
      setObjectifs("");
      setResultats("");
      onSimulationAdded?.(data);
      await logActivity(createdBy, `Ajout de la simulation "${titre}"`, "SimulationForm");

    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-6 max-w-3xl border border-gray-200"
    >
      <h3 className="text-xl font-heading font-bold text-primary mb-2">Ajouter une simulation</h3>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">Type de simulation</label>
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
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:outline-none"
        >
          <option value="">-- Choisir une simulation --</option>
          {SIMULATION_PRESETS.map((sim) => (
            <option key={sim.code} value={sim.titre}>
              {sim.titre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">Description</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">Chapitre (optionnel)</label>
        <input
          type="text"
          placeholder="Chapitre"
          value={chapitre}
          onChange={(e) => setChapitre(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">Objectifs pédagogiques</label>
        <textarea
          placeholder="Objectifs"
          value={objectifs}
          onChange={(e) => setObjectifs(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">Résultats attendus</label>
        <textarea
          placeholder="Résultats attendus"
          value={resultats}
          onChange={(e) => setResultats(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold transition text-white ${loading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-green-700"
          }`}
      >
        {loading ? "Ajout en cours..." : "Ajouter la simulation"}
      </button>
    </form>
  );
};

export default SimulationForm;