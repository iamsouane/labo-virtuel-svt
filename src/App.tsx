// src/App.tsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import type { Profil } from "./types";
import MainLayout from "./components/layout/MainLayout";
import AccueilUtilisateur from "./components/views/AccueilUtilisateur";
import Accueil from "./pages/Accueil";

function App() {
  const [user, setUser] = useState<Profil | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    const { data: authData } = await supabase.auth.getSession();
    if (!authData?.session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }
    const userId = authData.session.user.id;

    const { data: userDetails, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single<Profil>();


    if (userError || !userDetails) {
      setUser(null);
    } else {
      setUser(userDetails);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserDetails();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
      } else {
        fetchUserDetails();
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              {user ? (
                <AccueilUtilisateur user={user} onLogout={() => setUser(null)} />
              ) : (
                <Accueil user={null} />
              )}
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;