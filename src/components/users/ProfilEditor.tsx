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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary">Modifier le profil</h2>
        <p className="text-dark/80 mt-1 font-sans">Gérez vos informations personnelles et votre sécurité</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section photo de profil */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-medium text-dark">Photo de profil</h3>
            
            <div className="flex flex-col items-center">
              {previewUrl ? (
                <div className="relative group">
                  <img
                    src={previewUrl}
                    alt="Photo profil"
                    className="w-32 h-32 rounded-full object-cover border-2 border-accent"
                  />
                  <button
                    onClick={handleDeletePhoto}
                    disabled={loading}
                    className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-dangerHover"
                    title="Supprimer la photo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center text-primary border-2 border-dashed border-primary/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}

              <label className="mt-4 cursor-pointer">
                <span className="inline-flex items-center px-4 py-2 bg-primary border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors font-sans">
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Changer la photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                    disabled={loading}
                  />
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Section informations personnelles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-heading font-medium text-dark mb-4">Informations personnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1 font-sans">Prénom</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-3 py-2 border border-dark/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-sans"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark mb-1 font-sans">Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full px-3 py-2 border border-dark/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-sans"
                  disabled={loading}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark mb-1 font-sans">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-dark/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-sans"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 font-sans"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </span>
                ) : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>

          {/* Section changement de mot de passe */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-heading font-medium text-dark mb-4">Changer le mot de passe</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1 font-sans">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-dark/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-sans"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark mb-1 font-sans">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-dark/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-sans"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 font-sans"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mise à jour...
                  </span>
                ) : 'Changer le mot de passe'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilEditor;