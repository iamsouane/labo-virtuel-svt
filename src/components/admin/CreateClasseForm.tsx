// src/components/classes/CreateClasseForm.tsx
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";

interface CreateClasseFormProps {
  user: Profil;
  onCreated?: () => void;
}

const CreateClasseForm = ({ user, onCreated }: CreateClasseFormProps) => {
  const [codeClasse, setCodeClasse] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [eleves, setEleves] = useState<any[]>([]);
  const [selectedEleves, setSelectedEleves] = useState<string[]>([]);

  useEffect(() => {
    const fetchEleves = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, nom, prenom")
        .eq("role", "ELEVE");

      if (!error && data) setEleves(data);
    };

    fetchEleves();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data: classeData, error } = await supabase
      .from("classe")
      .insert({
        code_classe: codeClasse.trim(),
        created_by: user.id,
      })
      .select()
      .single();

    if (error || !classeData) {
      setMessage("Erreur : " + error?.message);
      setLoading(false);
      return;
    }

    // Ajouter les élèves sélectionnés
    if (selectedEleves.length > 0) {
      const insertions = selectedEleves.map((eleveId) => ({
        users_id: eleveId,
        classe_id: classeData.id,
      }));

      const { error: insertError } = await supabase
        .from("users_classe")
        .insert(insertions);

      if (insertError) {
        setMessage("Classe créée, mais erreur lors de l'ajout des élèves.");
        setLoading(false);
        return;
      }
    }

    setMessage("✅ Classe et élèves ajoutés avec succès !");
    setCodeClasse("");
    setSelectedEleves([]);
    if (onCreated) onCreated();
    setLoading(false);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedEleves((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Créer une nouvelle classe</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Code de la classe</label>
          <input
            type="text"
            value={codeClasse}
            onChange={(e) => setCodeClasse(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ajouter des élèves</label>
          <div className="max-h-40 overflow-y-auto border rounded px-3 py-2">
            {eleves.map((eleve) => (
              <label key={eleve.id} className="block text-sm">
                <input
                  type="checkbox"
                  value={eleve.id}
                  checked={selectedEleves.includes(eleve.id)}
                  onChange={() => handleCheckboxChange(eleve.id)}
                  className="mr-2"
                />
                {eleve.prenom} {eleve.nom}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !codeClasse.trim()}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Création en cours..." : "Créer la classe"}
        </button>

        {message && <p className="text-sm mt-2 text-center text-blue-700">{message}</p>}
      </form>
    </div>
  );
};

export default CreateClasseForm;