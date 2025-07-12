import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { notifySuccess, notifyError } from "../../lib/notifications";
import type { Profil } from "../../types";
import { QUIZ_QUESTIONS_PHOTOSYNTHESE } from "../../data/quizPhotosynthese"; // autres quiz selon besoin

const CreateTPForm = ({ user }: { user: Profil }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [simulations, setSimulations] = useState<any[]>([]);
  const [selectedClasse, setSelectedClasse] = useState("");
  const [typeTP, setTypeTP] = useState<"simulation" | "quiz">("simulation");
  const [selectedSimulation, setSelectedSimulation] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [quizTitle, setQuizTitle] = useState("");

  // Chargement des classes et simulations du professeur connecté
  useEffect(() => {
    const fetchData = async () => {
      const { data: classeData } = await supabase
        .from("classe")
        .select("id, code_classe")
        .eq("created_by", user.id);

      const { data: simsData } = await supabase
        .from("simulations_professeurs")
        .select("simulation(id, titre)")
        .eq("professeur_id", user.id);

      setClasses(classeData || []);
      setSimulations(simsData?.map((s) => s.simulation) || []);
    };
    fetchData();
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClasse) {
      notifyError("Veuillez sélectionner une classe.");
      return;
    }

    if (typeTP === "simulation") {
      if (!selectedSimulation) {
        notifyError("Veuillez sélectionner une simulation.");
        return;
      }

      const { error } = await supabase.from("classe_simulation").insert({
        classe_id: selectedClasse,
        simulation_id: selectedSimulation,
      });

      if (error) notifyError("Erreur : " + error.message);
      else {
        notifySuccess("Simulation associée à la classe avec succès !");
        resetForm();
      }
    } else if (typeTP === "quiz") {
      if (!selectedSimulation || selectedQuestions.length === 0 || !quizTitle.trim()) {
        notifyError("Remplissez tous les champs requis pour le quiz.");
        return;
      }

      // 1. Création du quiz
      const { data: quizCreated, error: quizError } = await supabase
        .from("quiz")
        .insert({
          titre: quizTitle,
          description: `Quiz lié à la simulation ${selectedSimulation}`,
          duree: 15,
          created_by: user.id,
        })
        .select()
        .single();

      if (quizError || !quizCreated) {
        notifyError("Erreur création quiz.");
        return;
      }

      // 2. Préparer les questions avec le quiz_id
      const questionsWithQuizId = selectedQuestions
        .map((i) => QUIZ_QUESTIONS_PHOTOSYNTHESE[i])
        .map((q) => ({
          ...q,
          quiz_id: quizCreated.id,
        }));

      // 3. Insertion des questions
      const { error: qError } = await supabase
        .from("question")
        .insert(questionsWithQuizId);

      if (qError) {
        notifyError("Erreur insertion questions.");
        return;
      }

      // 3.5. Mise à jour de la simulation avec le quiz_id
      const { error: updateSimError } = await supabase
        .from("simulation")
        .update({ quiz_id: quizCreated.id })
        .eq("id", selectedSimulation);

      if (updateSimError) {
        notifyError("Quiz créé mais échec de la mise à jour de la simulation.");
        return;
      }

      // 4. Liaison quiz - classe
      const { error: linkError } = await supabase.from("classe_quiz").insert({
        classe_id: selectedClasse,
        quiz_id: quizCreated.id,
      });

      if (linkError) {
        notifyError("Erreur liaison classe-quiz.");
      } else {
        notifySuccess("Quiz créé, lié à la simulation et à la classe !");
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setSelectedClasse("");
    setSelectedSimulation("");
    setSelectedQuestions([]);
    setTypeTP("simulation");
    setQuizTitle("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-2xl mx-auto bg-white p-6 shadow-md rounded-lg"
    >
      <h3 className="text-xl font-semibold">Créer un TP pour une classe</h3>

      <div>
        <label className="block mb-1">Type de TP</label>
        <select
          value={typeTP}
          onChange={(e) => {
            setTypeTP(e.target.value as "simulation" | "quiz");
            setSelectedQuestions([]);
          }}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="simulation">Simulation</option>
          <option value="quiz">Quiz</option>
        </select>
      </div>

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

      {typeTP && (
        <div>
          <label className="block mb-1">
            {typeTP === "simulation" ? "Simulation" : "Simulation liée au Quiz"}
          </label>
          <select
            value={selectedSimulation}
            onChange={(e) => {
              setSelectedSimulation(e.target.value);
              setSelectedQuestions([]);
              setQuizTitle(""); // reset titre quand on change la simulation
            }}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">-- Sélectionner une simulation --</option>
            {simulations.map((sim) => (
              <option key={sim.id} value={sim.id}>
                {sim.titre}
              </option>
            ))}
          </select>
        </div>
      )}

      {typeTP === "quiz" && (
        <>
          <div>
            <label className="block mb-1">Titre du quiz</label>
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Ex : Quiz sur la photosynthèse"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          {selectedSimulation && (
            <div>
              <label className="block mb-1">Sélectionnez les questions</label>
              <div className="space-y-3 max-h-64 overflow-y-auto border rounded p-3 bg-gray-50">
                {QUIZ_QUESTIONS_PHOTOSYNTHESE.map((q, index) => (
                  <div key={index} className="p-2 border rounded bg-white">
                    <label className="flex items-start gap-2">
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
          )}
        </>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Créer et associer le TP
      </button>
    </form>
  );
};

export default CreateTPForm;