// lib/fetchClassesAndEleves.ts
import { supabase } from "./supabaseClient";

export interface Eleve {
  eleve_id: string;
  prenom: string;
  nom: string;
  email: string;
  photo_profil: string | null;
}

export interface ClasseWithEleves {
  id: string;
  code_classe: string;
  eleves: Eleve[];
}

export const fetchClassesAndEleves = async (
  userId: string,
  setClasses: (classes: ClasseWithEleves[]) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  try {
    const { data: classesData, error: classesError } = await supabase
      .from("classe")
      .select("id, code_classe")
      .eq("created_by", userId);

    if (classesError) {
      console.error("Erreur récupération classes:", classesError);
      setClasses([]);
      return;
    }

    const classesWithEleves: ClasseWithEleves[] = [];

    for (const classe of classesData || []) {
      const { data: elevesData, error: elevesError } = await supabase
        .from("eleves_par_classe")
        .select("*")
        .eq("classe_id", classe.id);

      classesWithEleves.push({
        id: classe.id,
        code_classe: classe.code_classe,
        eleves: elevesError ? [] : elevesData || [],
      });
    }

    setClasses(classesWithEleves);
  } catch (error) {
    console.error("Erreur inattendue :", error);
    setClasses([]);
  } finally {
    setLoading(false);
  }
};