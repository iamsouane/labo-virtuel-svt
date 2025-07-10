// src/components/sections/AuthForm.tsx
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { NewUser, Profil } from "../../types";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../lib/notifications";

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [isPendingConfirmation, setIsPendingConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      return notifyError("Tous les champs sont obligatoires.");
    }

    if (!isValidEmail(formData.email)) {
      return notifyError("Veuillez entrer une adresse e-mail valide.");
    }

    if (!isLogin && formData.name.trim().split(" ").length < 2) {
      return notifyError("Veuillez entrer votre prénom et votre nom.");
    }

    if (formData.password.length < 6) {
      return notifyError("Le mot de passe doit contenir au moins 6 caractères.");
    }

    if (isLogin) {
      // Connexion
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) return notifyError("Échec de la connexion : " + signInError.message);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return notifyError("Utilisateur introuvable.");

      const { data: profil, error: profilError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single<Profil>();

      if (profilError || !profil) return notifyError("Impossible de récupérer votre profil.");

      if (profil.must_change_password) {
        notifySuccess("Connexion réussie. Veuillez changer votre mot de passe.");
        navigate("/changer-mot-de-passe");
      } else {
        notifySuccess("Connexion réussie !");
        navigate("/dashboard");
      }

      onAuthSuccess?.();
    } else {
      // Inscription
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) return notifyError("Échec de l'inscription : " + signUpError.message);

      const user = data.user;

      if (!user) {
        // Email non confirmé
        setIsPendingConfirmation(true);
        notifySuccess("Inscription réussie ! Veuillez confirmer votre e-mail avant de vous connecter.");
        return;
      }

      // Création du profil dans la table users
      const newUser: NewUser = {
        nom: formData.name.split(" ").slice(-1)[0] || "",
        prenom: formData.name.split(" ").slice(0, -1).join(" ") || "",
        email: formData.email,
        photo_profil: undefined,
        role: "ELEVE",
        must_change_password: true,
      };

      const { error: insertError } = await supabase
        .from("users")
        .insert([{ id: user.id, ...newUser }]);

      if (insertError) return notifyError("Erreur lors de la création du profil.");

      notifySuccess("Inscription réussie ! Vérifiez votre e-mail pour confirmer.");
      setIsPendingConfirmation(true);
    }
  };

  return (
    <section id="auth" className="py-20 px-6 bg-white max-w-md mx-auto rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold mb-8 text-center">
        {isLogin ? "Connexion" : "Inscription"}
      </h2>

      <div className="flex justify-center mb-8 space-x-8">
        <button
          type="button"
          onClick={() => {
            setIsLogin(true);
            setIsPendingConfirmation(false);
          }}
          className={`pb-2 border-b-4 font-semibold ${isLogin ? "border-green-600 text-green-700" : "border-transparent text-gray-500"
            }`}
        >
          Connexion
        </button>
        <button
          type="button"
          onClick={() => {
            setIsLogin(false);
            setIsPendingConfirmation(false);
          }}
          className={`pb-2 border-b-4 font-semibold ${!isLogin ? "border-green-600 text-green-700" : "border-transparent text-gray-500"
            }`}
        >
          Inscription
        </button>
      </div>

      {isPendingConfirmation && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <p className="font-semibold">📧 Merci pour votre inscription !</p>
          <p>Veuillez confirmer votre adresse email via le lien envoyé. Vous pourrez vous connecter après vérification.</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom complet"
              disabled={isPendingConfirmation}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemple@domaine.com"
            disabled={isPendingConfirmation}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="******"
            disabled={isPendingConfirmation}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPendingConfirmation}
          className={`w-full ${isPendingConfirmation ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold py-3 rounded-xl shadow transition`}
        >
          {isLogin ? "Se connecter" : "S'inscrire"}
        </button>
      </form>
    </section>
  );
};

export default AuthForm;