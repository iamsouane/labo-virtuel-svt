import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { BookOpen, Timer, FileCheck, Search } from "lucide-react";

interface ResultWithQuizTitle {
  id: string;
  users_id: string;
  quiz_id: string;
  quiz_title: string;
  note: number;
  reponses: Record<
    string,
    {
      userAnswer: number;
      correct: boolean;
      timeSpent?: number; // ✅ pour supporter le temps par question
    }
  >;
  completed_at: string;
  time_spent: number; // ✅ aligné avec la colonne de la fonction RPC
}

export default function MesTPs() {
  const [results, setResults] = useState<ResultWithQuizTitle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc("get_resultats_quiz_eleve", {
        eleve_id: userData.user.id,
      });

      if (error) {
        console.error("Erreur lors du chargement des résultats:", error);
        setLoading(false);
        return;
      }

      setResults(data || []);
      setLoading(false);
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>Chargement des résultats...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Aucun TP terminé pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
        <FileCheck className="w-6 h-6" />
        Mes Résultats aux TPs (Quiz)
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((res) => {
          const totalQuestions = Object.keys(res.reponses || {}).length;
          const correctAnswers = Object.values(res.reponses || {}).filter((r) => r.correct).length;
          const percentage = Math.round((correctAnswers / totalQuestions) * 100);

          const timeSpent = typeof res.time_spent === "number" ? res.time_spent : 0;
          const minutes = Math.floor(timeSpent / 60);
          const seconds = timeSpent % 60;

          const averageTimePerQuestion =
            totalQuestions > 0 ? Math.round(timeSpent / totalQuestions) : 0;

          return (
            <div
              key={res.id}
              className="border border-green-300 rounded-lg p-4 bg-white shadow"
            >
              <h3 className="font-semibold text-lg text-green-800 mb-2">
                {res.quiz_title}
              </h3>

              <p className="text-sm text-gray-600 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Score :{" "}
                <strong>
                  {correctAnswers} / {totalQuestions} ({percentage}%)
                </strong>
              </p>

              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Temps passé : {minutes}m {seconds}s
              </p>

              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Temps moyen / question : {averageTimePerQuestion}s
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Terminé le : {new Date(res.completed_at).toLocaleString()}
              </p>

              <button
                disabled
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
              >
                <Search className="w-4 h-4" />
                Voir les détails (bientôt)
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}