// src/lib/supprimerEleve.ts
import { supabase } from "./supabaseClient";
import { notifyError, notifySuccess } from "./notifications";
import type { Eleve, ClasseWithEleves } from "./fetchClassesAndEleves";

export const supprimerEleveDeClasse = async (
  selectedEleve: Eleve | null,
  selectedClasseId: string | null,
  classes: ClasseWithEleves[],
  setClasses: (classes: ClasseWithEleves[]) => void,
  setSelectedEleve: (eleve: Eleve | null) => void,
  setSelectedClasseId: (id: string | null) => void
) => {
  if (!selectedEleve || !selectedClasseId) return;

  const { error } = await supabase
    .from("users_classe")
    .delete()
    .match({
      users_id: selectedEleve.eleve_id,
      classe_id: selectedClasseId,
    });

  if (error) {
    console.error("Erreur lors de la suppression de l'élève:", error);
    notifyError("Erreur lors de la suppression de l'élève.");
    return;
  }

  notifySuccess("Élève supprimé de la classe avec succès.");

  const updatedClasses = classes.map((c) =>
    c.id === selectedClasseId
      ? {
          ...c,
          eleves: c.eleves.filter((e) => e.eleve_id !== selectedEleve.eleve_id),
        }
      : c
  );

  const classeVide = updatedClasses.find(
    (c) => c.id === selectedClasseId && c.eleves.length === 0
  );

  const classeVideId = classeVide?.id ?? null;

  setClasses(
    classeVideId
      ? updatedClasses.filter((c) => c.id !== classeVideId)
      : updatedClasses
  );

  setSelectedEleve(null);
  setSelectedClasseId(null);

  if (classeVideId) {
    await supprimeClasse(classeVideId);
  }
};

const supprimeClasse = async (classeId: string) => {
  const { error } = await supabase.from("classe").delete().eq("id", classeId);

  if (error) {
    console.error("Erreur lors de la suppression de la classe vide:", error);
    notifyError("Erreur lors de la suppression de la classe vide.");
  } else {
    notifySuccess("Classe supprimée car elle ne contenait plus d'élèves.");
  }
};