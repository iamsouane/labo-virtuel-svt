import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { notifySuccess, notifyError } from "../../lib/notifications";
import type { Profil } from "../../types";

const CreateTPForm = ({ user }: { user: Profil }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [tps, setTps] = useState<any[]>([]);
  const [typeTP, setTypeTP] = useState<"simulation" | "quiz">("simulation");
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedTP, setSelectedTP] = useState("");

  useEffect(() => {
    const fetchClassesAndTPs = async () => {
      const { data: classesData } = await supabase
        .from("classe")
        .select("id, code_classe")
        .eq("created_by", user.id);

      const { data: tpsData } = await supabase
        .from(typeTP)
        .select("id, titre");

      if (classesData) setClasses(classesData);
      if (tpsData) setTps(tpsData);
    };

    fetchClassesAndTPs();
  }, [typeTP]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClasse || !selectedTP) {
      notifyError("Veuillez sélectionner une classe et un TP.");
      return;
    }

    const table = typeTP === "simulation" ? "classe_simulation" : "classe_quiz";

    const { error } = await supabase.from(table).insert({
      classe_id: selectedClasse,
      [`${typeTP}_id`]: selectedTP,
    });

    if (error) notifyError("Erreur : " + error.message);
    else notifySuccess("TP associé à la classe avec succès !");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-white p-6 shadow-md rounded-lg">
      <h3 className="text-xl font-semibold">Créer un TP pour une classe</h3>

      <div>
        <label className="block mb-1">Type de TP</label>
        <select
          value={typeTP}
          onChange={(e) => setTypeTP(e.target.value as "simulation" | "quiz")}
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
            <option key={c.id} value={c.id}>{c.code_classe}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">TP ({typeTP})</label>
        <select
          value={selectedTP}
          onChange={(e) => setSelectedTP(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">-- Sélectionner un TP --</option>
          {tps.map((tp) => (
            <option key={tp.id} value={tp.id}>{tp.titre}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Associer le TP
      </button>
    </form>
  );
};

export default CreateTPForm;
