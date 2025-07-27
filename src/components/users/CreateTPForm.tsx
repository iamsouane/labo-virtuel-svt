//src/components/users/CreateTPForm
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { notifySuccess, notifyError } from "../../lib/notifications";
import type { Profil } from "../../types";
import { QUIZ_QUESTIONS_PHOTOSYNTHESE } from "../../data/quizPhotosynthese";
import { QUIZ_QUESTIONS_SELECTION } from "../../data/quizSelection";
import { QUIZ_QUESTIONS_ENERGIE } from "../../data/quizEnergie";
import { QUIZ_QUESTIONS_POLLUTION } from "../../data/quizPollution";
import { useActivityLogger } from "../../hooks/useActivityLogger";
import { BookOpen, CheckCircle, PlusCircle } from "lucide-react";

const QUIZ_BANK: Record<string, any[]> = {
  "photosynthese": QUIZ_QUESTIONS_PHOTOSYNTHESE,
  "selection-naturelle": QUIZ_QUESTIONS_SELECTION,
  "energie": QUIZ_QUESTIONS_ENERGIE,
  "pollution": QUIZ_QUESTIONS_POLLUTION,
};

const CreateTPForm = ({ user }: { user: Profil }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [simulations, setSimulations] = useState<any[]>([]);
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedSimulation, setSelectedSimulation] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logActivity = useActivityLogger();

  useEffect(() => {
    const fetchData = async () => {
      const [classesRes, simulationsRes] = await Promise.all([
        supabase.from("classe").select("id, code_classe").eq("created_by", user.id),
        supabase.from("simulations_professeurs").select("simulation:simulation_id (id, titre, code)").eq("professeur_id", user.id)
      ]);

      if (classesRes.error) notifyError("Erreur chargement classes : " + classesRes.error.message);
      if (simulationsRes.error) notifyError("Erreur chargement simulations : " + simulationsRes.error.message);

      setClasses(classesRes.data || []);
      setSimulations((simulationsRes.data || []).map((row) => row.simulation));
    };

    fetchData();
  }, [user.id]);

  useEffect(() => {
    if (!selectedSimulation) {
      setAvailableQuestions([]);
      return;
    }

    const sim = simulations.find((s) => s.id === selectedSimulation);
    const code = sim?.code?.toLowerCase();
    setAvailableQuestions(code && QUIZ_BANK[code] ? QUIZ_BANK[code] : []);
  }, [selectedSimulation, simulations]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Validation
    if (!selectedClasse || !selectedSimulation) {
      throw new Error("Veuillez sélectionner une classe et une simulation.");
    }
    if (!quizTitle.trim()) {
      throw new Error("Veuillez saisir un titre pour le quiz.");
    }
    if (selectedQuestions.length === 0) {
      throw new Error("Veuillez sélectionner au moins une question.");
    }

    // Création du quiz
    const { data: quizCreated, error: quizError } = await supabase
      .from("quiz")
      .insert({
        titre: quizTitle,
        description: `Quiz créé par ${user.prenom} ${user.nom}`,
        duree: 15,
        created_by: user.id,
      })
      .select()
      .single();

    if (quizError || !quizCreated) {
      throw new Error("Erreur lors de la création du quiz.");
    }

    // Insertion des questions et associations
    const operations = [
      supabase.from("question").insert(
        selectedQuestions.map((index) => ({
          ...availableQuestions[index],
          quiz_id: quizCreated.id,
        }))
      ),
      supabase.from("classe_quiz").insert({
        classe_id: selectedClasse,
        quiz_id: quizCreated.id,
      }),
      supabase.from("simulation_quiz").insert({
        simulation_id: selectedSimulation,
        quiz_id: quizCreated.id,
      }),
    ];

    const results = await Promise.all(operations);
    const hasError = results.some((res) => res.error);
    if (hasError) {
      throw new Error("Erreur lors de l'enregistrement des données.");
    }

    notifySuccess("TP créé et associé avec succès !");
    await logActivity(user.id, "Création", "tp_quiz");
    resetForm();
  } catch (error) {
    if (error instanceof Error) {
      notifyError(error.message);
    } else {
      notifyError("Une erreur inconnue est survenue");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const resetForm = () => {
    setSelectedClasse("");
    setSelectedSimulation("");
    setSelectedQuestions([]);
    setQuizTitle("");
  };

  const toggleQuestionSelection = (index: number) => {
    setSelectedQuestions(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-heading font-bold text-primary">Création de TP Quiz</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Classe */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Classe *
            </label>
            <select
              value={selectedClasse}
              onChange={(e) => setSelectedClasse(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              required
            >
              <option value="">Sélectionner une classe</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code_classe}
                </option>
              ))}
            </select>
          </div>

          {/* Simulation */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Simulation *
            </label>
            <select
              value={selectedSimulation}
              onChange={(e) => setSelectedSimulation(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              required
            >
              <option value="">Sélectionner une simulation</option>
              {simulations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.titre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Titre du quiz *
          </label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Ex : Quiz sur la photosynthèse"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            required
          />
        </div>

        {/* Questions */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-dark">
              Questions sélectionnées ({selectedQuestions.length})
            </label>
            <span className="text-xs text-gray-500">Minimum 1</span>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {availableQuestions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 bg-gray-50">
                {selectedSimulation
                  ? "Aucune question disponible pour cette simulation"
                  : "Veuillez d'abord sélectionner une simulation"}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {availableQuestions.map((q, index) => (
                  <li
                    key={index}
                    className={`hover:bg-accent/30 transition-colors ${
                      selectedQuestions.includes(index) ? "bg-accent/20" : ""
                    }`}
                  >
                    <label className="flex items-start p-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(index)}
                        onChange={() => toggleQuestionSelection(index)}
                        className="mt-1 h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-dark">
                            {q.question}
                          </p>
                          {selectedQuestions.includes(index) && (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Réponse :</span> {q.reponse_correcte}
                        </p>
                        {q.explication && (
                          <p className="text-xs text-gray-400 mt-1 italic">
                            {q.explication}
                          </p>
                        )}
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || selectedQuestions.length === 0}
            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all ${
              isSubmitting
                ? "bg-primary/80 cursor-wait"
                : "bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md"
            } text-white`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-pulse">Création en cours...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                <span>Créer le TP Quiz</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTPForm;