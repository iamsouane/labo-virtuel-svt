// src/components/users/CreateClasseForm.tsx
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifyInfo, notifySuccess } from "../../lib/notifications";
import { useActivityLogger } from "../../hooks/useActivityLogger";

interface CreateClasseFormProps {
  user: Profil;
  onCreated?: () => void;
}

const CreateClasseForm = ({ user, onCreated }: CreateClasseFormProps) => {
  const [codeClasse, setCodeClasse] = useState("");
  const [loading, setLoading] = useState(false);
  const [eleves, setEleves] = useState<any[]>([]);
  const [selectedEleves, setSelectedEleves] = useState<string[]>([]);
  const logActivity = useActivityLogger();

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

    if (!user?.id) {
      notifyInfo("Utilisateur non connecté.");
      return;
    }

    if (!codeClasse.trim() || codeClasse.trim().length < 2) {
      notifyError("Veuillez entrer un code de classe valide (au moins 2 caractères).");
      return;
    }

    if (selectedEleves.length <= 3) {
      notifyError("Veuillez sélectionner au moins trois élève pour créer la classe.");
      return;
    }

    try {
      setLoading(true);

      const { data: classeData, error } = await supabase
        .from("classe")
        .insert({
          code_classe: codeClasse.trim(),
          created_by: user.id,
        })
        .select()
        .single();

      if (error || !classeData) {
        notifyError("Erreur : " + error?.message);
        return;
      }

      const { error: profInsertError } = await supabase
        .from("users_classe")
        .insert([{ users_id: user.id, classe_id: classeData.id }]);

      if (profInsertError) {
        notifyError("Erreur lors de l'ajout du professeur à la classe.");
        return;
      }

      const insertions = selectedEleves.map((eleveId) => ({
        users_id: eleveId,
        classe_id: classeData.id,
      }));

      const { error: insertError } = await supabase
        .from("users_classe")
        .insert(insertions);

      if (insertError) {
        notifyInfo("Classe créée, mais erreur lors de l'ajout des élèves.");
        return;
      }
      await logActivity(user.id, "Création", "classe");
      notifySuccess("Classe et élèves ajoutés avec succès !");
      setCodeClasse("");
      setSelectedEleves([]);
      onCreated?.();
    } catch (err) {
      console.error("Erreur inattendue :", err);
      notifyInfo("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedEleves((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-light p-6 rounded-2xl shadow-md max-w-xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-primary font-heading">Créer une nouvelle classe</h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-dark">Code de la classe</label>
          <input
            type="text"
            value={codeClasse}
            onChange={(e) => setCodeClasse(e.target.value)}
            className="mt-2 block w-full px-4 py-2 border border-dark/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            placeholder="Ex : 2ndeA"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Ajouter des élèves</label>
          <div className="max-h-40 overflow-y-auto border border-dark/10 rounded-xl px-4 py-2 space-y-1 bg-accent">
            {eleves.map((eleve) => (
              <label key={eleve.id} className="block text-sm font-medium text-dark">
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
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-2xl shadow transition"
          disabled={loading}
        >
          {loading ? "Création en cours..." : "Créer la classe"}
        </button>
      </form>
    </div>
  );
};

export default CreateClasseForm;