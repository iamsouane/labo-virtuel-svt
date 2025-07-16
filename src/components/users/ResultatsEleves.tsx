// src/components/users/ResultatsEleves.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import { BookOpen, CalendarCheck, Timer } from "lucide-react";
import type { ResultatEleve } from "../../types";

interface ResultatsElevesProps {
  professeur: Profil;
}

function convertToCSV(results: ResultatEleve[]): string {
  const headers = [
    "Élève prénom",
    "Élève nom",
    "Classe",
    "Quiz",
    "Note",
    "Total questions",
    "Temps total (s)",
    "Terminé le",
  ];

  const rows = results.map((res) => {
    const totalQuestions = Object.keys(res.reponses ?? {}).length;
    const totalTime =
      typeof res.time_spent === "number"
        ? res.time_spent
        : Object.values(res.reponses ?? {}).reduce((acc, val) => acc + (val.timeSpent ?? 0), 0);
    const completedDate = new Date(res.completed_at).toLocaleString();

    return [
      res.eleve_prenom,
      res.eleve_nom,
      res.eleve_classe,
      res.quiz_title,
      res.note?.toString() ?? "",
      totalQuestions.toString(),
      totalTime.toString(),
      completedDate,
    ].map((field) => `"${field.replace(/"/g, '""')}"`);
  });

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ResultatsEleves({ professeur }: ResultatsElevesProps) {
  const [resultats, setResultats] = useState<ResultatEleve[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultats = async () => {
      setLoading(true);

      const { data, error } = await supabase.rpc("get_resultats_eleves_prof", {
        professeur_id: professeur.id,
      });

      if (error) {
        console.error("Erreur récupération résultats élèves:", error);
        setResultats([]);
        setLoading(false);
        return;
      }

      setResultats(data || []);
      setLoading(false);
    };

    fetchResultats();
  }, [professeur.id]);

  if (loading) {
    return (
      <p className="text-center text-dark/70 font-semibold mt-6">Chargement des résultats...</p>
    );
  }

  if (resultats.length === 0) {
    return (
      <p className="text-center text-dark/70 font-semibold mt-6">Aucun résultat d'élève trouvé.</p>
    );
  }

  const resultatsParClasse = resultats
    .filter((res) => res.users_id !== professeur.id)
    .reduce<Record<string, ResultatEleve[]>>((acc, res) => {
      if (!acc[res.eleve_classe]) acc[res.eleve_classe] = [];
      acc[res.eleve_classe].push(res);
      return acc;
    }, {});

  return (
    <div className="p-6 space-y-8 bg-light rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold font-heading text-primary mb-6 flex items-center gap-3">
        <BookOpen className="w-6 h-6" />
        Résultats des élèves
      </h2>

      {Object.entries(resultatsParClasse).map(([classe, resultatsClasse]) => {
        const handleDownload = () => {
          const csv = convertToCSV(resultatsClasse);
          downloadCSV(csv, `resultats_classe_${classe}.csv`);
        };

        return (
          <section key={classe} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold font-heading text-primary">
                Classe : {classe}
              </h3>
              <button
                onClick={handleDownload}
                className="px-4 py-1 text-sm bg-primary text-white rounded-xl hover:bg-green-700 transition"
                type="button"
              >
                Télécharger CSV
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {resultatsClasse.map((res) => {
                const reponses = res.reponses ?? {};
                const totalQuestions = Object.keys(reponses).length;
                const score = res.note ?? 0;

                let totalTime = typeof res.time_spent === "number" ? res.time_spent : 0;

                if (!totalTime && Object.keys(reponses).length > 0) {
                  totalTime = Object.values(reponses).reduce(
                    (acc, val) => acc + (val.timeSpent ?? 0),
                    0
                  );
                }

                const minutes = Math.floor(totalTime / 60);
                const seconds = totalTime % 60;
                const averageTime = totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;

                return (
                  <div
                    key={res.id}
                    className="border border-dark/20 rounded-2xl p-5 shadow-sm bg-white"
                  >
                    <h4 className="text-lg font-semibold font-heading text-primary mb-2">
                      {res.quiz_title}
                    </h4>
                    <p className="text-dark/80">
                      Élève : <strong>{res.eleve_prenom} {res.eleve_nom}</strong>
                    </p>
                    <p className="text-dark/80">
                      Note : <strong>{score} / {totalQuestions}</strong>
                    </p>
                    <p className="text-dark/60 text-sm flex items-center gap-1 mt-1">
                      <Timer className="w-4 h-4" />
                      Temps total : {minutes}m {seconds}s | Moyenne : {averageTime}s / question
                    </p>
                    <p className="text-dark/60 text-sm flex items-center gap-1">
                      <CalendarCheck className="w-4 h-4" />
                      Terminé le : {new Date(res.completed_at).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}