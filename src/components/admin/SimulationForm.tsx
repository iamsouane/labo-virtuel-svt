// src/components/admin/SimulationForm.tsx
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Simulation } from "../../types";
import { notifySuccess, notifyError } from "../../lib/notifications";
import { useActivityLogger } from "../../hooks/useActivityLogger";
import ConfirmDialog from "../ui/ConfirmDialog";
import { Trash, Loader2 } from "lucide-react";
import { PrimaryLoader } from "../ui/Loader";

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
  const [formData, setFormData] = useState({
    titre: "",
    code: "",
    description: "",
    chapitre: "",
    objectifs: "",
    resultats: ""
  });
  const [loading, setLoading] = useState(false);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [selectedToDelete, setSelectedToDelete] = useState<Simulation | null>(null);
  const [fetching, setFetching] = useState(true);
  const logActivity = useActivityLogger();

  const fetchSimulations = async () => {
    setFetching(true);
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
    setFetching(false);
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
        ...formData,
        resultats_attendus: formData.resultats,
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
      setFormData({
        titre: "",
        code: "",
        description: "",
        chapitre: "",
        objectifs: "",
        resultats: ""
      });
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

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePresetSelect = (titre: string) => {
    const selected = SIMULATION_PRESETS.find(p => p.titre === titre);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        titre: selected.titre,
        code: selected.code
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulaire de création */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-heading font-bold text-primary">Nouvelle simulation</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Type de simulation</label>
            <select
              required
              value={formData.titre}
              onChange={(e) => handlePresetSelect(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">-- Sélectionnez un modèle --</option>
              {SIMULATION_PRESETS.map((sim) => (
                <option key={sim.code} value={sim.titre}>{sim.titre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">Objectifs pédagogiques</label>
            <textarea
              value={formData.objectifs}
              onChange={(e) => handleChange('objectifs', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">Résultats attendus</label>
            <textarea
              value={formData.resultats}
              onChange={(e) => handleChange('resultats', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium text-white transition-colors ${loading ? 'bg-primary/60 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <PrimaryLoader size="sm" />
                Enregistrement...
              </span>
            ) : (
              'Ajouter la simulation'
            )}
          </button>
        </form>
      </div>

      {/* Liste des simulations existantes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-heading font-bold text-primary">Mes simulations</h3>
        </div>

        <div className="p-6">
          {fetching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-secondary h-6 w-6" />
            </div>
          ) : simulations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune simulation créée pour le moment
            </div>
          ) : (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-100 max-h-[550px] overflow-y-auto">
                {simulations.map((sim) => (
                  <li key={sim.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-primary truncate">{sim.titre}</h4>
                        {sim.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2 break-words">
                            {sim.description}
                          </p>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                          Créée le {new Date(sim.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedToDelete(sim)}
                        className="text-danger hover:text-dangerHover p-2 flex-shrink-0"
                        aria-label="Supprimer"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Dialogue de confirmation de suppression */}
      <ConfirmDialog
        isOpen={!!selectedToDelete}
        title="Confirmer la suppression"
        message={`Voulez-vous vraiment supprimer définitivement la simulation "${selectedToDelete?.titre}" ?`}
        onCancel={() => setSelectedToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default SimulationForm;