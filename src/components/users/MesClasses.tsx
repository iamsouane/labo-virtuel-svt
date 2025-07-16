// src/components/users/MesClasses.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import { notifyError, notifySuccess } from "../../lib/notifications";

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
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [selectedClasseId, setSelectedClasseId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

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

    fetchClassesAndEleves();
  }, [user.id]);

  useEffect(() => {
    if (!selectedEleve?.photo_profil) {
      setPhotoUrl(null);
      return;
    }

    if (selectedEleve.photo_profil.startsWith("http")) {
      setPhotoUrl(selectedEleve.photo_profil);
    } else {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(selectedEleve.photo_profil);
      setPhotoUrl(data?.publicUrl ?? null);
    }
  }, [selectedEleve]);

  const supprimerEleveDeClasse = async () => {
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

    let classeVideId: string | null = null;

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

    if (classeVide) {
      classeVideId = classeVide.id;
    }

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

  if (loading)
    return (
      <p className="text-center text-dark font-semibold mt-6">Chargement des classes...</p>
    );
  if (classes.length === 0)
    return (
      <p className="text-center text-dark/70 font-semibold mt-6">Aucune classe créée.</p>
    );

  return (
    <>
      <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {classes.map((classe) => (
          <div
            key={classe.id}
            className="p-4 border border-dark/20 rounded-2xl shadow bg-light"
          >
            <h3 className="text-lg font-semibold font-heading text-primary mb-3">
              Classe : {classe.code_classe}
            </h3>
            {classe.eleves.length === 0 ? (
              <p className="text-dark/60 text-sm">Aucun élève dans cette classe.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1 text-dark">
                {classe.eleves.map((eleve) => (
                  <li
                    key={eleve.eleve_id}
                    className="cursor-pointer hover:text-primary transition"
                    onClick={() => {
                      setSelectedEleve(eleve);
                      setSelectedClasseId(classe.id);
                    }}
                  >
                    {eleve.prenom} {eleve.nom}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {selectedEleve && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => {
            setSelectedEleve(null);
            setSelectedClasseId(null);
          }}
        >
          <div
            className="bg-light rounded-2xl shadow-xl max-w-sm w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-3 text-dark/60 hover:text-dark text-xl font-bold"
              onClick={() => {
                setSelectedEleve(null);
                setSelectedClasseId(null);
              }}
              aria-label="Fermer"
            >
              &times;
            </button>

            <div className="flex flex-col items-center gap-4">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={`${selectedEleve.prenom} ${selectedEleve.nom}`}
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl text-gray-700">
                  ?
                </div>
              )}

              <h2 className="text-xl font-semibold font-heading text-primary">
                {selectedEleve.prenom} {selectedEleve.nom}
              </h2>
              <p className="text-dark">{selectedEleve.email}</p>

              <button
                onClick={supprimerEleveDeClasse}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition font-semibold"
              >
                Supprimer cet élève de la classe
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MesClasses;