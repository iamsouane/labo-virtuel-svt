//src/components/users/MesClasses
import { useEffect, useState } from "react";
import type { Profil } from "../../types";
import { fetchClassesAndEleves } from "../../lib/fetchClassesAndEleves";
import type { ClasseWithEleves, Eleve } from "../../lib/fetchClassesAndEleves";
import { usePhotoUrl } from "../../lib/usePhotoUrl";
import { supprimerEleveDeClasse } from "../../lib/supprimerEleve";
import { User } from "lucide-react";
import ModalEleve from "./ModalEleve";
import { PrimaryLoader } from "../ui/Loader";

interface MesClassesProps {
  user: Profil;
  singleClasseId?: string;
}

const MesClasses = ({ user, singleClasseId }: MesClassesProps) => {
  const [classes, setClasses] = useState<ClasseWithEleves[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [selectedClasseId, setSelectedClasseId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchClassesAndEleves(
          user.id,
          (data) => {
            if (singleClasseId) {
              // Filtrer pour n'afficher que la classe spécifiée
              const filtered = data.filter(c => c.id === singleClasseId);
              setClasses(filtered);
            } else {
              setClasses(data);
            }
          },
          setLoading
        );
      } catch (error) {
        console.error("Erreur chargement classes:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id, singleClasseId]);

  usePhotoUrl(selectedEleve, setPhotoUrl);

  const handleDeleteEleve = async () => {
    if (!selectedEleve || !selectedClasseId) return;

    setIsDeleting(true);
    try {
      await supprimerEleveDeClasse(
        selectedEleve,
        selectedClasseId,
        classes,
        setClasses,
        setSelectedEleve,
        setSelectedClasseId
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <PrimaryLoader size="lg" />
        <span className="text-dark font-medium text-lg">
          Chargement des classes...
        </span>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 text-center shadow-sm">
        <p className="text-dark/70">
          {singleClasseId
            ? "Aucun élève dans cette classe"
            : "Vous n'avez créé aucune classe pour le moment"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!singleClasseId && (
        <h2 className="text-xl font-heading font-semibold text-primary">
          Mes classes
        </h2>
      )}

      <div className={`grid gap-4 ${singleClasseId ? '' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {classes.map((classe) => (
          <div
            key={classe.id}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${singleClasseId ? '' : 'hover:shadow-md'
              } transition-all`}
          >
            <div className="p-4">
              <h3 className="text-md font-heading font-semibold text-primary mb-2">
                {classe.code_classe}
              </h3>

              {classe.eleves.length === 0 ? (
                <div className="flex items-center gap-2 text-dark/60 text-sm p-2">
                  <User className="w-4 h-4" />
                  <span>Aucun élève</span>
                </div>
              ) : (
                <ul className="space-y-1">
                  {classe.eleves.map((eleve) => (
                    <li
                      key={eleve.eleve_id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedEleve(eleve);
                        setSelectedClasseId(classe.id);
                      }}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-primary">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-dark">
                          {eleve.prenom} {eleve.nom}
                        </p>
                        <p className="text-xs text-dark/60 truncate">{eleve.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'information élève */}
      {selectedEleve && (
        <ModalEleve
          eleve={selectedEleve}
          photoUrl={photoUrl}
          isDeleting={isDeleting}
          onClose={() => {
            setSelectedEleve(null);
            setSelectedClasseId(null);
          }}
          onDelete={handleDeleteEleve}
          selectedClasseId={selectedClasseId}
          classes={classes}
        />
      )}
    </div>
  );
};

export default MesClasses;