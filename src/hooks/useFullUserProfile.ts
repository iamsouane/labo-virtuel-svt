// src/hooks/useFullUserProfile.ts
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Profil } from "../types";

export function useFullUserProfile(user: Profil) {
  const [localUser, setLocalUser] = useState<Profil>(user);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Charger toutes les infos du profil depuis Supabase
  useEffect(() => {
    const fetchFullUserProfile = async () => {
      setIsLoadingUser(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        console.error("Erreur chargement profil:", error?.message);
        setLocalUser(user);
      } else {
        setLocalUser(data);
      }

      setIsLoadingUser(false);
    };

    fetchFullUserProfile();
  }, [user.id]);

  // Générer l’URL publique de la photo de profil
  useEffect(() => {
    const fetchPublicUrl = () => {
      if (!localUser.photo_profil) {
        setPhotoUrl(null);
        return;
      }

      if (!localUser.photo_profil.startsWith("http")) {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(localUser.photo_profil);
        setPhotoUrl(data.publicUrl);
      } else {
        setPhotoUrl(localUser.photo_profil);
      }
    };

    fetchPublicUrl();
  }, [localUser.photo_profil]);

  return { localUser, setLocalUser, photoUrl, isLoadingUser };
}