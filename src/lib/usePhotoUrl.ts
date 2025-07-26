// src/lib/usePhotoUrl.ts
import { useEffect } from "react";
import { supabase } from "./supabaseClient";

export function usePhotoUrl(selectedEleve: any, setPhotoUrl: (url: string | null) => void) {
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
}