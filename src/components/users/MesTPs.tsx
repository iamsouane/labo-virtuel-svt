import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { BookOpen, Timer, FileCheck } from "lucide-react";

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
      timeSpent?: number;
    }
  >;
  completed_at: string;
  time_spent: number;
  eleve_classe?: string;
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
      <div className="p-8 text-center text-gray-500">
        <p>Chargement des résultats...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>Aucun TP terminé pour le moment.</p>
      </div>
    );
  }

  // Regroupement par classe
  const resultatsParClasse = results.reduce<Record<string, ResultWithQuizTitle[]>>(
    (acc, res) => {
      const classe = res.eleve_classe || "Classe inconnue";
      if (!acc[classe]) acc[classe] = [];
      acc[classe].push(res);
      return acc;
    },
    {}
  );

  return (
    <div className="p-8">
      <h2 className="text-3xl font-heading font-bold text-primary mb-8 flex items-center gap-3">
        <FileCheck className="w-7 h-7" />
        Mes Résultats aux TPs (Quiz)
      </h2>

      {Object.entries(resultatsParClasse).map(([classe, resultatsClasse]) => (
        <section key={classe} className="mb-12">
          <h3 className="text-2xl font-semibold text-primary-dark mb-6">Classe : {classe}</h3>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resultatsClasse.map((res) => {
              const totalQuestions = Object.keys(res.reponses || {}).length;
              const correctAnswers = Object.values(res.reponses || {}).filter((r) => r.correct).length;
              const percentage = Math.round((correctAnswers / totalQuestions) * 100);

              const timeSpent = typeof res.time_spent === "number" ? res.time_spent : 0;
              const minutes = Math.floor(timeSpent / 60);
              const seconds = timeSpent % 60;
              const averageTimePerQuestion =
                totalQuestions > 0 ? Math.round(timeSpent / totalQuestions) : 0;

              return (
                <article
                  key={res.id}
                  className="border border-primary-light rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <h4 className="font-semibold text-xl text-primary mb-4">{res.quiz_title}</h4>

                  <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5" />
                    Score :{" "}
                    <strong className="text-primary-dark">
                      {correctAnswers} / {totalQuestions} ({percentage}%)
                    </strong>
                  </p>

                  <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                    <Timer className="w-5 h-5" />
                    Temps passé : {minutes}m {seconds}s
                  </p>

                  <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                    <Timer className="w-5 h-5" />
                    Temps moyen / question : {averageTimePerQuestion}s
                  </p>

                  <p className="text-sm text-gray-500 mb-4">
                    Terminé le : {new Date(res.completed_at).toLocaleString()}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}