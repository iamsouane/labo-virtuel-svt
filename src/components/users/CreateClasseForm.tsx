// src/components/users/CreateClasseForm.tsx
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifyInfo, notifySuccess } from "../../lib/notifications";
import { useActivityLogger } from "../../hooks/useActivityLogger";
import { User, Loader2, CheckCircle } from "lucide-react";

interface CreateClasseFormProps {
  user: Profil;
  onCreated?: () => void;
  compact?: boolean;
}

const CreateClasseForm = ({ user, onCreated, compact = false }: CreateClasseFormProps) => {
  const [codeClasse, setCodeClasse] = useState("");
  const [loading, setLoading] = useState(false);
  const [eleves, setEleves] = useState<any[]>([]);
  const [selectedEleves, setSelectedEleves] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const logActivity = useActivityLogger();

  useEffect(() => {
    const fetchEleves = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, nom, prenom")
        .eq("role", "ELEVE")
        .order("nom", { ascending: true });

      if (!error && data) setEleves(data);
    };

    fetchEleves();
  }, []);

  const filteredEleves = eleves.filter(
    (eleve) =>
      `${eleve.prenom} ${eleve.nom}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

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

    if (selectedEleves.length < 3) {
      notifyError("Veuillez sélectionner au moins trois élèves pour créer la classe.");
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
        notifyError("Erreur lors de la création : " + error?.message);
        return;
      }

      // Ajout du professeur à la classe
      const { error: profInsertError } = await supabase
        .from("users_classe")
        .insert([{ users_id: user.id, classe_id: classeData.id }]);

      if (profInsertError) {
        notifyError("Erreur lors de l'ajout du professeur à la classe.");
        return;
      }

      // Ajout des élèves
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
      notifySuccess("Classe créée avec succès !");
      setCodeClasse("");
      setSelectedEleves([]);
      onCreated?.();
    } catch (err) {
      console.error("Erreur inattendue :", err);
      notifyError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const toggleEleveSelection = (id: string) => {
    setSelectedEleves((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  return (
    <div className={`bg-white ${compact ? 'p-4' : 'p-6'} rounded-xl border border-gray-200 shadow-sm`}>
      <h3 className={`font-heading font-semibold text-primary ${compact ? 'text-lg mb-3' : 'text-xl mb-4'}`}>
        {compact ? 'Nouvelle classe' : 'Créer une nouvelle classe'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">
            Code de la classe *
          </label>
          <input
            type="text"
            value={codeClasse}
            onChange={(e) => setCodeClasse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: 2ndeA"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-dark">
              Élèves sélectionnés ({selectedEleves.length})
            </label>
            <span className="text-xs text-gray-500">Minimum 3</span>
          </div>
          
          {/* Barre de recherche */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Rechercher un élève..."
          />
          
          {/* Liste des élèves */}
          <div className={`border border-gray-200 rounded-lg overflow-hidden ${compact ? 'max-h-40' : 'max-h-60'} overflow-y-auto`}>
            {filteredEleves.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                Aucun élève trouvé
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredEleves.map((eleve) => (
                  <li key={eleve.id} className="hover:bg-accent/50 transition-colors">
                    <label className="flex items-center px-3 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEleves.includes(eleve.id)}
                        onChange={() => toggleEleveSelection(eleve.id)}
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-3 flex items-center">
                        <User className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-dark">
                          {eleve.prenom} {eleve.nom}
                        </span>
                        {selectedEleves.includes(eleve.id) && (
                          <CheckCircle className="h-4 w-4 text-primary ml-auto" />
                        )}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || selectedEleves.length < 3 || !codeClasse.trim()}
          className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-xl shadow-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition ${
            (selectedEleves.length < 3 || !codeClasse.trim()) && "opacity-70 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Création...
            </>
          ) : (
            "Créer la classe"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateClasseForm;