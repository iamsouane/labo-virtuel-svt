// src/components/users/MesTPs.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { BookOpen, Timer, FileCheck } from "lucide-react";
import { PrimaryLoader } from "../ui/Loader";

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
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const { data } = await supabase.rpc("get_resultats_quiz_eleve", {
          eleve_id: userData.user.id,
        });

        setResults(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des résultats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <PrimaryLoader size="lg" />
            <span className="text-dark font-medium text-lg">
              Chargement des resultats...
            </span>
          </div>
        );
  }

  if (results.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-gray-500">
          <BookOpen className="mx-auto h-10 w-10 mb-3 text-gray-400" />
          <p className="font-medium">Aucun TP terminé pour le moment</p>
        </div>
      </div>
    );
  }

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary mb-2 flex items-center gap-3">
          <FileCheck className="w-6 h-6" />
          Mes résultats aux TPs
        </h1>
        <p className="text-dark/80">Historique de vos travaux pratiques</p>
      </div>

      {Object.entries(resultatsParClasse).map(([classe, resultatsClasse]) => (
        <div key={classe} className="mb-12">
          <h2 className="text-xl font-semibold text-dark mb-6 pb-2 border-b border-gray-200">
            Classe : {classe}
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resultatsClasse.map((res) => {
              const totalQuestions = Object.keys(res.reponses || {}).length;
              const correctAnswers = Object.values(res.reponses || {}).filter((r) => r.correct).length;
              const percentage = Math.round((correctAnswers / totalQuestions) * 100);
              const noteSur20 = Math.round((percentage * 20) / 100 * 10) / 10;

              const timeSpent = typeof res.time_spent === "number" ? res.time_spent : 0;
              const minutes = Math.floor(timeSpent / 60);
              const seconds = timeSpent % 60;
              const averageTimePerQuestion =
                totalQuestions > 0 ? Math.round(timeSpent / totalQuestions) : 0;

              return (
                <div
                  key={res.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-primary text-lg mb-3">
                    {res.quiz_title}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-dark/70">Note</p>
                        <p className="font-medium text-dark">
                          {noteSur20.toFixed(1)}/20 ({percentage}%)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Timer className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-dark/70">Temps passé</p>
                        <p className="font-medium text-dark">
                          {minutes}m {seconds}s
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Timer className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-dark/70">Temps moyen/question</p>
                        <p className="font-medium text-dark">
                          {averageTimePerQuestion}s
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 text-xs text-dark/50">
                      Terminé le{" "}
                      {new Date(res.completed_at).toLocaleString("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}