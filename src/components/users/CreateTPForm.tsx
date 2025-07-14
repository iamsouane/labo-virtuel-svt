// src/components/ui/CreateTPForm.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { notifySuccess, notifyError } from "../../lib/notifications";
import type { Profil } from "../../types";
import { QUIZ_QUESTIONS_PHOTOSYNTHESE } from "../../data/quizPhotosynthese";
import { QUIZ_QUESTIONS_SELECTION } from "../../data/quizSelection";
import { QUIZ_QUESTIONS_ENERGIE } from "../../data/quizEnergie";
import { QUIZ_QUESTIONS_POLLUTION } from "../../data/quizPollution"; // <-- Import ajouté

const CreateTPForm = ({ user }: { user: Profil }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [simulations, setSimulations] = useState<any[]>([]);
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedSimulation, setSelectedSimulation] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);

  // Charger les classes du prof connecté
  useEffect(() => {
    const fetchClasses = async () => {
      const { data: classeData, error } = await supabase
        .from("classe")
        .select("id, code_classe")
        .eq("created_by", user.id);
      if (error) {
        notifyError("Erreur chargement classes : " + error.message);
      } else {
        setClasses(classeData || []);
      }
    };
    fetchClasses();
  }, [user.id]);

  // Charger les simulations autorisées/créées
  useEffect(() => {
    const fetchSimulations = async () => {
      const { data, error } = await supabase.rpc("get_simulations_autorisees_ou_creees", {
        user_id: user.id,
      });
      if (error) {
        notifyError("Erreur chargement simulations : " + error.message);
      } else {
        setSimulations(data || []);
      }
    };
    fetchSimulations();
  }, [user.id]);

  // Charger les questions selon la simulation sélectionnée
  useEffect(() => {
    const fetchQuestionsForSimulation = async () => {
      if (!selectedSimulation) {
        setAvailableQuestions([]);
        return;
      }

      // Récupérer la simulation pour obtenir son code
      const { data: simulation, error: simError } = await supabase
        .from("simulation")
        .select("*")
        .eq("id", selectedSimulation)
        .single();

      if (simError || !simulation) {
        setAvailableQuestions([]);
        return;
      }

      const code = simulation.code?.toLowerCase();

      // Cas des quiz codés en dur
      if (code === "photosynthese") {
        setAvailableQuestions(QUIZ_QUESTIONS_PHOTOSYNTHESE);
        return;
      } else if (code === "selection-naturelle") {
        setAvailableQuestions(QUIZ_QUESTIONS_SELECTION);
        return;
      } else if (code === "energie") {
        setAvailableQuestions(QUIZ_QUESTIONS_ENERGIE);
        return;
      } else if (code === "pollution") {
        setAvailableQuestions(QUIZ_QUESTIONS_POLLUTION);
        return;
      }

      // Cas quiz dynamique lié via simulation_quiz
      const { data: simQuiz, error: simQuizError } = await supabase
        .from("simulation_quiz")
        .select("quiz_id")
        .eq("simulation_id", selectedSimulation)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (simQuizError || !simQuiz) {
        setAvailableQuestions([]);
        return;
      }

      const quizId = simQuiz.quiz_id;

      const { data: questions, error: qError } = await supabase
        .from("question")
        .select("*")
        .eq("quiz_id", quizId);

      if (qError) {
        notifyError("Erreur chargement questions : " + qError.message);
        return;
      }

      setAvailableQuestions(questions || []);
    };

    fetchQuestionsForSimulation();
  }, [selectedSimulation]);

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

    // 1. Création du quiz
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

    // 2. Insertion des questions sélectionnées dans la table question avec quiz_id
    const questionsWithQuizId = selectedQuestions.map((index) => ({
      ...availableQuestions[index],
      quiz_id: quizCreated.id,
    }));

    const { error: qError } = await supabase.from("question").insert(questionsWithQuizId);
    if (qError) {
      notifyError("Erreur lors de l'insertion des questions.");
      return;
    }

    // 3. Liaison quiz à la classe
    const { error: linkError } = await supabase.from("classe_quiz").insert({
      classe_id: selectedClasse,
      quiz_id: quizCreated.id,
    });
    if (linkError) {
      notifyError("Erreur liaison quiz à la classe.");
      return;
    }

    // 4. Liaison quiz à la simulation
    const { error: simLinkError } = await supabase.from("simulation_quiz").insert({
      simulation_id: selectedSimulation,
      quiz_id: quizCreated.id,
    });
    if (simLinkError) {
      notifyError("Erreur liaison quiz à la simulation.");
      return;
    }

    notifySuccess("TP créé avec succès !");
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
      className="space-y-4 max-w-2xl mx-auto bg-white p-6 shadow-md rounded-lg"
    >
      <h3 className="text-xl font-semibold">Créer un TP Quiz pour une classe</h3>

      {/* Sélection de la classe */}
      <div>
        <label className="block mb-1">Classe</label>
        <select
          value={selectedClasse}
          onChange={(e) => setSelectedClasse(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">-- Sélectionner une classe --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code_classe}
            </option>
          ))}
        </select>
      </div>

      {/* Sélection de la simulation */}
      <div>
        <label className="block mb-1">Simulation liée</label>
        <select
          value={selectedSimulation}
          onChange={(e) => setSelectedSimulation(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">-- Sélectionner une simulation --</option>
          {simulations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.titre}
            </option>
          ))}
        </select>
      </div>

      {/* Titre du quiz */}
      <div>
        <label className="block mb-1">Titre du quiz</label>
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Ex : Quiz sur la photosynthèse"
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* Sélection des questions */}
      <div>
        <label className="block mb-1">Sélectionnez les questions</label>
        <div className="space-y-3 max-h-64 overflow-y-auto border rounded p-3 bg-gray-50">
          {availableQuestions.length === 0 && (
            <p className="text-gray-500 text-sm">Aucune question disponible pour cette simulation.</p>
          )}
          {availableQuestions.map((q, index) => (
            <div key={index} className="p-2 border rounded bg-white">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(index)}
                  onChange={(e) => {
                    const updated = [...selectedQuestions];
                    if (e.target.checked) updated.push(index);
                    else updated.splice(updated.indexOf(index), 1);
                    setSelectedQuestions(updated);
                  }}
                />
                <div>
                  <p className="font-semibold">{q.question}</p>
                  <p className="text-sm text-gray-500 italic mt-1">
                    Réponse correcte :{" "}
                    <span className="text-green-700">{q.reponse_correcte}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{q.explication}</p>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Créer et associer le TP Quiz
      </button>
    </form>
  );
};

export default CreateTPForm;