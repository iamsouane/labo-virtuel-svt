import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import type { Profil } from "./types";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [user, setUser] = useState<Profil | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { data: profil, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single<Profil>();

      if (error) {
        console.error("Erreur profil:", error.message);
        setUser(null);
      } else {
        setUser(profil);
      }

      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Chargement...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil user={user} />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Accueil user={null} />
            )
          }
        />
        <Route path="/changer-mot-de-passe" element={<ChangePassword />} />
      </Routes>

      {/* Activation globale des notifications */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        pauseOnHover
        draggable
        theme="colored"
        toastClassName={(context) =>
          context?.type === "success"
            ? "bg-green-100 text-green-700 border-l-4 border-green-500 rounded-lg px-4 py-3 shadow"
            : context?.type === "error"
              ? "bg-red-100 text-red-700 border-l-4 border-red-500 rounded-lg px-4 py-3 shadow"
              : "bg-blue-100 text-blue-700 border-l-4 border-blue-500 rounded-lg px-4 py-3 shadow"
        }
      />
    </BrowserRouter>
  );
};

export default App;