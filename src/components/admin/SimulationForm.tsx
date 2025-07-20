//src/components/admin/SimulationForm.tsx
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Simulation } from "../../types";
import { notifySuccess, notifyError } from "../../lib/notifications";
import { useActivityLogger } from "../../hooks/useActivityLogger";
import ConfirmDialog from "../ui/ConfirmDialog";
import { Trash } from "lucide-react";

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
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [selectedToDelete, setSelectedToDelete] = useState<Simulation | null>(null);
  const logActivity = useActivityLogger();

  const fetchSimulations = async () => {
    const { data, error } = await supabase
      .from("simulation")
      .select("*")
      .eq("created_by", createdBy)
      .order("created_at", { ascending: false });

    if (error) {
      notifyError("Erreur de chargement des simulations.");
    } else {
      setSimulations(data || []);
    }
  };

  useEffect(() => {
    fetchSimulations();
  }, []);

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
      setTitre("");
      setCode("");
      setDescription("");
      setChapitre("");
      setObjectifs("");
      setResultats("");
      fetchSimulations();
      onSimulationAdded?.(data);
      await logActivity(createdBy, "Ajout de simulation", "Simulation", data.id);
    }
  };

  const handleDelete = async () => {
    if (!selectedToDelete) return;
    const { error } = await supabase.from("simulation").delete().eq("id", selectedToDelete.id);
    if (error) {
      notifyError("Erreur lors de la suppression : " + error.message);
    } else {
      notifySuccess("Simulation supprimée.");
      setSelectedToDelete(null);
      fetchSimulations();
      await logActivity(createdBy, "Suppression de simulation", "Simulation", selectedToDelete.id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Formulaire à gauche */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-5 max-w-md border border-gray-200"
      >
        <h3 className="text-xl font-bold text-primary">Ajouter une simulation</h3>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Type de simulation</label>
          <select
            required
            value={titre}
            onChange={(e) => {
              const selected = SIMULATION_PRESETS.find(p => p.titre === e.target.value);
              setTitre(selected?.titre || "");
              setCode(selected?.code || "");
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:outline-none"
          >
            <option value="">-- Choisir une simulation --</option>
            {SIMULATION_PRESETS.map((sim) => (
              <option key={sim.code} value={sim.titre}>{sim.titre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Objectifs pédagogiques</label>
          <textarea
            value={objectifs}
            onChange={(e) => setObjectifs(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Résultats attendus</label>
          <textarea
            value={resultats}
            onChange={(e) => setResultats(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition text-white ${
            loading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-green-700"
          }`}
        >
          {loading ? "Ajout en cours..." : "Ajouter la simulation"}
        </button>
      </form>

      {/* Liste à droite */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-fit">
        <h3 className="text-lg font-bold text-dark mb-4">Simulations ajoutées</h3>
        {simulations.length === 0 ? (
          <p className="text-gray-500">Aucune simulation pour le moment.</p>
        ) : (
          <ul className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
            {simulations.map((sim) => (
              <li
                key={sim.id}
                className="flex justify-between items-center border-b pb-2 text-sm text-dark"
              >
                <div>
                  <div className="font-semibold text-primary">{sim.titre}</div>
                  <div className="text-gray-600 text-xs line-clamp-2">{sim.description}</div>
                </div>
                <button
                  onClick={() => setSelectedToDelete(sim)}
                  className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                >
                  <Trash size={16} />
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirmation suppression */}
      <ConfirmDialog
        isOpen={!!selectedToDelete}
        title="Confirmer la suppression"
        message={`Voulez-vous vraiment supprimer la simulation "${selectedToDelete?.titre}" ?`}
        onCancel={() => setSelectedToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default SimulationForm;