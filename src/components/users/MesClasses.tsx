import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";

interface Eleve {
  eleve_id: string;
  prenom: string;
  nom: string;
  email: string;
  photo_profil: string | null;
}

interface ClasseWithEleves {
  id: string;
  code_classe: string;
  eleves: Eleve[];
}

interface MesClassesProps {
  user: Profil;
}

const MesClasses = ({ user }: MesClassesProps) => {
  const [classes, setClasses] = useState<ClasseWithEleves[]>([]);
  const [loading, setLoading] = useState(false);

  // État modal élève sélectionné
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);

  useEffect(() => {
    const fetchClassesAndEleves = async () => {
      setLoading(true);
      try {
        const { data: classesData, error: classesError } = await supabase
          .from("classe")
          .select("id, code_classe")
          .eq("created_by", user.id);

        if (classesError) {
          console.error("Erreur récupération classes:", classesError);
          setClasses([]);
          setLoading(false);
          return;
        }

        if (!classesData) {
          setClasses([]);
          setLoading(false);
          return;
        }

        const classesWithEleves: ClasseWithEleves[] = [];

        for (const classe of classesData) {
          const { data: elevesData, error: elevesError } = await supabase
            .from("eleves_par_classe")
            .select("*")
            .eq("classe_id", classe.id);

          if (elevesError) {
            console.error("Erreur récupération élèves pour la classe", classe.code_classe, elevesError);
            classesWithEleves.push({ id: classe.id, code_classe: classe.code_classe, eleves: [] });
          } else {
            classesWithEleves.push({
              id: classe.id,
              code_classe: classe.code_classe,
              eleves: elevesData || [],
            });
          }
        }

        setClasses(classesWithEleves);
      } catch (error) {
        console.error("Erreur inattendue :", error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClassesAndEleves();
  }, [user.id]);

  if (loading) return <p>Chargement des classes...</p>;
  if (classes.length === 0) return <p>Aucune classe créée.</p>;

  return (
    <>
      {/* Ici ton formulaire */}

      <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {classes.map((classe) => (
          <div key={classe.id} className="p-4 border rounded shadow-sm bg-white">
            <h3 className="text-lg font-semibold mb-2">Classe : {classe.code_classe}</h3>
            {classe.eleves.length === 0 ? (
              <p>Aucun élève dans cette classe.</p>
            ) : (
              <ul className="list-disc pl-6">
                {classe.eleves.map((eleve) => (
                  <li
                    key={eleve.eleve_id}
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedEleve(eleve)}
                  >
                    {eleve.prenom} {eleve.nom}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Modal élève */}
      {selectedEleve && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedEleve(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative"
            onClick={(e) => e.stopPropagation()} // empêcher fermeture au clic dans le modal
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
              onClick={() => setSelectedEleve(null)}
              aria-label="Fermer"
            >
              &times;
            </button>

            <div className="flex flex-col items-center gap-4">
              {selectedEleve.photo_profil ? (
                <img
                  src={selectedEleve.photo_profil}
                  alt={`${selectedEleve.prenom} ${selectedEleve.nom}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl text-gray-700">
                  ?
                </div>
              )}

              <h2 className="text-xl font-semibold">
                {selectedEleve.prenom} {selectedEleve.nom}
              </h2>
              <p className="text-gray-700">{selectedEleve.email}</p>

              {/* Tu peux ajouter d'autres infos ici */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MesClasses;