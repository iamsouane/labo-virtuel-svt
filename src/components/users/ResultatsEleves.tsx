// src/components/users/ResultatsEleves.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import { BookOpen, CalendarCheck, Timer } from "lucide-react";

interface ResultatEleve {
  id: string;
  users_id: string;
  eleve_nom: string;
  eleve_prenom: string;
  quiz_id: string;
  quiz_title: string;
  note: number;
  reponses: Record<string, { userAnswer: number; correct: boolean; timeSpent?: number }>;
  completed_at: string;
  time_spent?: number;
}

interface ResultatsElevesProps {
  professeur: Profil;
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
    return <p className="text-center text-gray-600">Chargement des résultats...</p>;
  }

  if (resultats.length === 0) {
    return <p className="text-center text-gray-600">Aucun résultat d'élève trouvé.</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
        <BookOpen className="w-6 h-6" />
        Résultats des élèves
      </h2>

      {resultats.map((res) => {
        const reponses = res.reponses ?? {};
        const totalQuestions = Object.keys(reponses).length;
        const score = res.note ?? 0;

        let totalTime = typeof res.time_spent === "number" ? res.time_spent : 0;

        // Si time_spent n'est pas présent, on calcule à partir des timeSpent de chaque réponse
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
          <div key={res.id} className="border rounded p-4 shadow-sm bg-white">
            <h3 className="text-lg font-semibold text-green-700 mb-1">
              {res.quiz_title}
            </h3>
            <p className="text-gray-700">
              Élève : <strong>{res.eleve_prenom} {res.eleve_nom}</strong>
            </p>
            <p className="text-gray-700">
              Note : <strong>{score} / {totalQuestions}</strong>
            </p>
            <p className="text-gray-600 text-sm flex items-center gap-1">
              <Timer className="w-4 h-4" />
              Temps total : {minutes}m {seconds}s | Moyenne : {averageTime}s / question
            </p>
            <p className="text-gray-600 text-sm flex items-center gap-1">
              <CalendarCheck className="w-4 h-4" />
              Terminé le : {new Date(res.completed_at).toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}