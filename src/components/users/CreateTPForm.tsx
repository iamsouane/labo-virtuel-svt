import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { notifySuccess, notifyError } from "../../lib/notifications";
import type { Profil } from "../../types";
import { QUIZ_QUESTIONS_PHOTOSYNTHESE } from "../../data/quizPhotosynthese";
import { QUIZ_QUESTIONS_SELECTION } from "../../data/quizSelection";
import { QUIZ_QUESTIONS_ENERGIE } from "../../data/quizEnergie";
import { QUIZ_QUESTIONS_POLLUTION } from "../../data/quizPollution";
import { useActivityLogger } from "../../hooks/useActivityLogger";

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
  const logActivity = useActivityLogger();

  useEffect(() => {
    const fetchClasses = async () => {
      const { data, error } = await supabase
        .from("classe")
        .select("id, code_classe")
        .eq("created_by", user.id);
      if (error) {
        notifyError("Erreur chargement classes : " + error.message);
      } else {
        setClasses(data || []);
      }
    };
    fetchClasses();
  }, [user.id]);

  useEffect(() => {
    const fetchSimulations = async () => {
      const { data, error } = await supabase
        .from("simulations_professeurs")
        .select("simulation:simulation_id (id, titre, code)")
        .eq("professeur_id", user.id);

      if (error) {
        notifyError("Erreur chargement simulations : " + error.message);
      } else {
        const simulationsList = (data || []).map((row) => row.simulation);
        setSimulations(simulationsList);
      }
    };
    fetchSimulations();
  }, [user.id]);

  useEffect(() => {
    const fetchQuestionsForSimulation = async () => {
      if (!selectedSimulation) {
        setAvailableQuestions([]);
        return;
      }

      const sim = simulations.find((s) => s.id === selectedSimulation);
      const code = sim?.code?.toLowerCase();

      if (code && QUIZ_BANK[code]) {
        setAvailableQuestions(QUIZ_BANK[code]);
      } else {
        setAvailableQuestions([]);
      }
    };

    fetchQuestionsForSimulation();
  }, [selectedSimulation, simulations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClasse || !selectedSimulation) {
      notifyError("Veuillez sélectionner une classe et une simulation.");
      return;
    }

    if (!quizTitle.trim()) {
      notifyError("Veuillez saisir un titre pour le quiz.");
      return;
    }

    if (selectedQuestions.length === 0) {
      notifyError("Veuillez sélectionner au moins une question.");
      return;
    }

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
      notifyError("Erreur lors de la création du quiz.");
      return;
    }

    const questionsWithQuizId = selectedQuestions.map((index) => ({
      ...availableQuestions[index],
      quiz_id: quizCreated.id,
    }));

    const { error: qError } = await supabase
      .from("question")
      .insert(questionsWithQuizId);

    if (qError) {
      notifyError("Erreur lors de l'insertion des questions.");
      return;
    }

    const { error: linkError } = await supabase
      .from("classe_quiz")
      .insert({
        classe_id: selectedClasse,
        quiz_id: quizCreated.id,
      });

    if (linkError) {
      notifyError("Erreur liaison quiz à la classe.");
      return;
    }

    const { error: simLinkError } = await supabase
      .from("simulation_quiz")
      .insert({
        simulation_id: selectedSimulation,
        quiz_id: quizCreated.id,
      });

    if (simLinkError) {
      notifyError("Erreur liaison quiz à la simulation.");
      return;
    }

    notifySuccess("TP créé et associé avec succès !");
    await logActivity(user.id, "Création", "tp_quiz");
    resetForm();
  };

  const resetForm = () => {
    setSelectedClasse("");
    setSelectedSimulation("");
    setSelectedQuestions([]);
    setQuizTitle("");
    setAvailableQuestions([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl mx-auto bg-light p-6 shadow-md rounded-xl"
    >
      <h3 className="text-2xl font-heading font-bold text-primary">Créer un TP Quiz pour une classe</h3>

      {/* Classe */}
      <div>
        <label className="block mb-2 text-dark font-medium">Classe</label>
        <select
          value={selectedClasse}
          onChange={(e) => setSelectedClasse(e.target.value)}
          className="w-full px-4 py-2 border border-dark/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        >
          <option value="">-- Sélectionner une classe --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code_classe}
            </option>
          ))}
        </select>
      </div>

      {/* Simulation */}
      <div>
        <label className="block mb-2 text-dark font-medium">Simulation liée</label>
        <select
          value={selectedSimulation}
          onChange={(e) => setSelectedSimulation(e.target.value)}
          className="w-full px-4 py-2 border border-dark/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        >
          <option value="">-- Sélectionner une simulation --</option>
          {simulations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.titre}
            </option>
          ))}
        </select>
      </div>

      {/* Titre */}
      <div>
        <label className="block mb-2 text-dark font-medium">Titre du quiz</label>
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Ex : Quiz sur la photosynthèse"
          className="w-full px-4 py-2 border border-dark/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        />
      </div>

      {/* Questions */}
      <div>
        <label className="block mb-2 text-dark font-medium">Sélectionnez les questions</label>
        <div className="space-y-3 max-h-64 overflow-y-auto border border-dark/20 rounded-md p-4 bg-accent">
          {availableQuestions.length === 0 && (
            <p className="text-dark/60 text-sm">Aucune question disponible pour cette simulation.</p>
          )}
          {availableQuestions.map((q, index) => (
            <div key={index} className="p-3 border border-dark/10 rounded-md bg-light">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(index)}
                  onChange={(e) => {
                    const updated = [...selectedQuestions];
                    if (e.target.checked) updated.push(index);
                    else updated.splice(updated.indexOf(index), 1);
                    setSelectedQuestions(updated);
                  }}
                  className="mt-1"
                />
                <div>
                  <p className="font-semibold text-dark">{q.question}</p>
                  <p className="text-sm text-dark/60 italic mt-1">
                    Réponse correcte :{" "}
                    <span className="text-primary font-medium">{q.reponse_correcte}</span>
                  </p>
                  <p className="text-xs text-dark/40 mt-1">{q.explication}</p>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-primary text-white py-3 rounded-md hover:bg-secondary/90 transition-colors font-semibold"
      >
        Créer et associer le TP Quiz
      </button>
    </form>
  );
};

export default CreateTPForm;