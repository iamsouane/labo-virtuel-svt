//src/components/users/MesClasses.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";

interface ClasseWithEleves {
  id: string;
  code_classe: string;
  eleves: { id: string; prenom: string; nom: string }[];
}

interface MesClassesProps {
  user: Profil;
}

const MesClasses = ({ user }: MesClassesProps) => {
  const [classes, setClasses] = useState<ClasseWithEleves[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClassesWithEleves = async () => {
  setLoading(true);
  try {
    const { data: classesData, error: classesError } = await supabase
      .from("classe")
      .select(`
        id,
        code_classe,
        users_classe (
          users_id,
          users (
            id,
            prenom,
            nom
          )
        )
      `)
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

    // Transformer données
    const formatted = classesData.map((classe: any) => ({
      id: classe.id,
      code_classe: classe.code_classe,
      eleves: classe.users_classe?.map((uc: any) => uc.users).filter(Boolean) || [],
    }));

    setClasses(formatted);
  } catch (error) {
    console.error("Erreur inattendue :", error);
  } finally {
    setLoading(false);
  }
};


    fetchClassesWithEleves();
  }, [user.id]);

  if (loading) return <p>Chargement des classes...</p>;
  if (classes.length === 0) return <p>Aucune classe créée.</p>;

  return (
    <div>
      {classes.map((classe) => (
        <div key={classe.id} className="mb-6 p-4 border rounded shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">Classe : {classe.code_classe}</h3>
          {classe.eleves.length === 0 ? (
            <p>Aucun élève dans cette classe.</p>
          ) : (
            <ul className="list-disc pl-6">
              {classe.eleves.map((eleve) => (
                <li key={eleve.id}>
                  {eleve.prenom} {eleve.nom}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default MesClasses;