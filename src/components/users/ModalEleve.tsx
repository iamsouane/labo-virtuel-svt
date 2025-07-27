//src/components/users/ModalEleve.tsx
import { useState } from "react";
import { Loader2, Trash2, User, X, Mail, BookOpen } from "lucide-react";
import type { ClasseWithEleves, Eleve } from "../../lib/fetchClassesAndEleves";
import ConfirmDialog from "../ui/ConfirmDialog";

interface ModalEleveProps {
  eleve: Eleve;
  photoUrl: string | null;
  isDeleting: boolean;
  onClose: () => void;
  onDelete: () => void;
  selectedClasseId: string | null;
  classes: ClasseWithEleves[];
}

const ModalEleve = ({
  eleve,
  photoUrl,
  isDeleting,
  onClose,
  onDelete,
  selectedClasseId,
  classes,
}: ModalEleveProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const classe = classes.find((c) => c.id === selectedClasseId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay avec floutage */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Contenu de la modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col border border-gray-100 z-10">
        {/* Header */}
        <div className="flex justify-between items-center bg-primary/5 p-5 border-b border-gray-100 sticky top-0">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-heading font-semibold text-dark">
              Fiche Élève
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-danger rounded-full p-1 transition"
            aria-label="Fermer la modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body - Contenu scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Photo et identité */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={`${eleve.prenom} ${eleve.nom}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/50 flex items-center justify-center text-primary border-4 border-white shadow-md">
                  <User className="w-10 h-10" />
                </div>
              )}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full shadow">
                Élève
              </div>
            </div>

            <h4 className="text-2xl font-heading font-semibold text-primary text-center">
              {eleve.prenom} {eleve.nom}
            </h4>
          </div>

          {/* Détails */}
          <div className="space-y-4">
            {/* Email */}
            <div className="bg-light rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-secondary" />
                <h5 className="text-sm font-medium text-dark/80">Email</h5>
              </div>
              <p className="text-dark pl-8 break-all">{eleve.email || "Non renseigné"}</p>
            </div>

            {/* Classe */}
            <div className="bg-light rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                <h5 className="text-sm font-medium text-dark/80">Classe actuelle</h5>
              </div>
              <div className="pl-8">
                {classe ? (
                  <p className="text-dark font-medium">{classe.code_classe}</p>
                ) : (
                  <p className="text-dark/70">Non affecté</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Bouton fixe en bas */}
        <div className="p-5 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isDeleting}
            className={`w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-medium transition-all ${
              isDeleting
                ? "bg-danger/80 cursor-wait"
                : "bg-danger hover:bg-dangerHover shadow-sm hover:shadow-md"
            } text-white`}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Suppression en cours...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                <span>Retirer de la classe</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ConfirmDialog */}
      {showConfirm && (
        <ConfirmDialog
          isOpen={showConfirm}
          title="Confirmation"
          message={`Voulez-vous vraiment retirer ${eleve.prenom} ${eleve.nom} de la classe ?`}
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            onDelete();
          }}
        />
      )}
    </div>
  );
};

export default ModalEleve;