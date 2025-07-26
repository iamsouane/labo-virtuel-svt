// src/components/users/ProfilEditor.tsx
import { useState, type ChangeEvent, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import { notifySuccess, notifyError } from "../../lib/notifications";

interface ProfilEditorProps {
  user: Profil;
  onUpdate?: (updatedUser: Profil) => void;
}

const ProfilEditor = ({ user, onUpdate }: ProfilEditorProps) => {
  const [prenom, setPrenom] = useState(user.prenom);
  const [nom, setNom] = useState(user.nom);
  const [email, setEmail] = useState(user.email);
  const [photoProfil, setPhotoProfil] = useState<string | null>(user.photo_profil || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePreviewUrl = (path: string | null) => {
    if (!path) {
      setPreviewUrl(null);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setPreviewUrl(data?.publicUrl ?? null);
  };

  useEffect(() => {
    updatePreviewUrl(photoProfil);
  }, [photoProfil]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    if (!fileExt) {
      notifyError("Le fichier doit avoir une extension valide.");
      return;
    }
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `profile-photos/${fileName}`;

    setLoading(true);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    setLoading(false);

    if (uploadError) {
      notifyError(`Erreur upload image : ${uploadError.message}`);
      return;
    }

    setPhotoProfil(filePath);
    notifySuccess("Image uploadée avec succès !");
  };

  const handleDeletePhoto = async () => {
    if (!photoProfil) return;
    setLoading(true);

    const { error } = await supabase.storage.from("avatars").remove([photoProfil]);

    if (error) {
      notifyError(`Erreur suppression image : ${error.message}`);
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ photo_profil: null })
      .eq("id", user.id);

    setLoading(false);

    if (updateError) {
      notifyError(`Erreur mise à jour profil : ${updateError.message}`);
      return;
    }

    setPhotoProfil(null);
    notifySuccess("Photo de profil supprimée.");
    onUpdate && onUpdate({ ...user, photo_profil: null });
  };

  const handleSave = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("users")
      .update({ prenom, nom, email, photo_profil: photoProfil })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      notifyError("Erreur lors de la mise à jour : " + error.message);
    } else {
      notifySuccess("Profil mis à jour avec succès !");
      onUpdate && onUpdate({ ...user, prenom, nom, email, photo_profil: photoProfil });
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      notifyError("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      notifyError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      notifyError(`Erreur lors du changement de mot de passe : ${error.message}`);
    } else {
      notifySuccess("Mot de passe mis à jour avec succès !");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-light rounded-2xl shadow-md space-y-6">
      <h2 className="text-3xl font-heading font-bold text-primary">Modifier mon profil</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colonne gauche : édition du profil */}
        <div>
          {previewUrl ? (
            <div className="relative inline-block mb-6">
              <img
                src={previewUrl}
                alt="Photo profil"
                className="w-40 h-40 rounded-full object-cover border-4 border-primary"
              />
              <button
                type="button"
                onClick={handleDeletePhoto}
                disabled={loading}
                className="absolute top-0 right-0 bg-danger text-white rounded-full p-2 hover:bg-dangerHover transition-shadow shadow-md focus:outline-none focus:ring-2 focus:ring-dangerHover"
                title="Supprimer la photo"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-300 mb-6 flex items-center justify-center text-gray-600 text-lg font-semibold border-4 border-gray-400">
              Aucune photo
            </div>
          )}

          <label className="block mb-5 font-semibold text-dark">
            Changer la photo de profil
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-dark/80 file:rounded-xl file:border-0 file:bg-primary file:text-white file:font-semibold hover:file:bg-secondary transition"
              disabled={loading}
            />
          </label>

          <label className="block mb-4 font-semibold text-dark">
            Prénom
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="w-full border border-dark/30 rounded-xl px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </label>

          <label className="block mb-4 font-semibold text-dark">
            Nom
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border border-dark/30 rounded-xl px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </label>

          <label className="block mb-6 font-semibold text-dark">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-dark/30 rounded-xl px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </label>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3 rounded-2xl hover:bg-secondary transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            {loading ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </div>

        {/* Colonne droite : changement de mot de passe */}
        <div>
          <h3 className="text-xl font-heading font-semibold text-primary mb-4">Changer le mot de passe</h3>

          <div className="space-y-5 mb-6">
            <label className="block font-semibold text-dark">
              Nouveau mot de passe
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-dark/30 rounded-xl px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
            </label>

            <label className="block font-semibold text-dark">
              Confirmer le mot de passe
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-dark/30 rounded-xl px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
            </label>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3 rounded-2xl hover:bg-secondary transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {loading ? "Mise à jour..." : "Changer le mot de passe"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilEditor;