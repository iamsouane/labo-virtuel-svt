// src/components/users/ResultatsEleves.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil, ResultatEleve } from "../../types";
import { BookOpen, CalendarCheck, Timer, Download, Loader2, Award } from "lucide-react";

interface ResultatsElevesProps {
  professeur: Profil;
}

function convertToCSV(results: ResultatEleve[]): string {
  const headers = [
    "Élève prénom",
    "Élève nom",
    "Classe",
    "Quiz",
    "Note sur 20",
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

    const score = res.note ?? 0;
    const noteSur20 = totalQuestions > 0 ? ((score / totalQuestions) * 20).toFixed(1) : "0";

    return [
      res.eleve_prenom,
      res.eleve_nom,
      res.eleve_classe,
      res.quiz_title,
      noteSur20,
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResultats = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.rpc("get_resultats_eleves_prof", {
          professeur_id: professeur.id,
        });

        if (error) throw error;

        setResultats(data || []);
      } catch (err) {
        console.error("Erreur récupération résultats élèves:", err);
        setError("Impossible de charger les résultats. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchResultats();
  }, [professeur.id]);

  const resultatsParClasse = resultats
    .filter((res) => res.users_id !== professeur.id)
    .reduce<Record<string, ResultatEleve[]>>((acc, res) => {
      if (!acc[res.eleve_classe]) acc[res.eleve_classe] = [];
      acc[res.eleve_classe].push(res);
      return acc;
    }, {});

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes > 0 ? `${minutes}m ` : ""}${seconds}s`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Award className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-heading font-bold text-primary">
          Résultats des élèves
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-red-700">
          {error}
        </div>
      ) : Object.keys(resultatsParClasse).length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-500">Aucun résultat d'élève disponible</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(resultatsParClasse).map(([classe, resultatsClasse]) => {
            const handleDownload = () => {
              const csv = convertToCSV(resultatsClasse);
              downloadCSV(csv, `resultats_classe_${classe}.csv`);
            };

            return (
              <section key={classe} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-xl font-heading font-semibold text-primary">
                    Classe : <span className="text-secondary">{classe}</span>
                  </h3>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
                    type="button"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exporter en CSV</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {resultatsClasse.map((res) => {
                    const reponses = res.reponses ?? {};
                    const totalQuestions = Object.keys(reponses).length;
                    const score = res.note ?? 0;
                    const totalTime = typeof res.time_spent === "number" 
                      ? res.time_spent 
                      : Object.values(reponses).reduce((acc, val) => acc + (val.timeSpent ?? 0), 0);
                    const noteSur20 = totalQuestions > 0 ? ((score / totalQuestions) * 20).toFixed(1) : "0";

                    return (
                      <div
                        key={res.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-dark">
                            {res.quiz_title}
                          </h4>
                          <span className="bg-primary/10 text-primary text-sm font-medium px-2 py-1 rounded-full">
                            {noteSur20}/20
                          </span>
                        </div>

                        <p className="text-sm font-medium text-dark mb-3">
                          {res.eleve_prenom} {res.eleve_nom}
                        </p>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span>{totalQuestions} questions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-gray-400" />
                            <span>Temps : {formatTime(totalTime)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4 text-gray-400" />
                            <span>
                              {new Date(res.completed_at).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}