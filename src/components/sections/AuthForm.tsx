// src/components/sections/AuthForm.tsx
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { Profil } from "../../types";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../lib/notifications";
import { Eye, EyeOff } from "lucide-react";
import { useActivityLogger } from "../../hooks/useActivityLogger";

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [isPendingConfirmation, setIsPendingConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const logActivity = useActivityLogger();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
        notifyError("Tous les champs sont obligatoires.");
        setIsLoading(false);
        return;
      }

      if (!isValidEmail(formData.email)) {
        notifyError("Veuillez entrer une adresse e-mail valide.");
        setIsLoading(false);
        return;
      }

      if (!isLogin && formData.name.trim().split(" ").length < 2) {
        notifyError("Veuillez entrer votre prénom et votre nom.");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        notifyError("Le mot de passe doit contenir au moins 6 caractères.");
        setIsLoading(false);
        return;
      }
      if (/\d/.test(formData.name)) {
        notifyError("Le nom ne doit pas contenir de chiffres.");
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        // Connexion
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          notifyError("Échec de la connexion : " + signInError.message);
          setIsLoading(false);
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          notifyError("Session utilisateur introuvable.");
          setIsLoading(false);
          return;
        }

        // Attendre un petit délai pour s'assurer que le profil est créé
        await new Promise(resolve => setTimeout(resolve, 500));

        // Récupérer le profil
        const { data: profil, error: profilError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single<Profil>();

        if (profilError || !profil) {
          notifyError("Impossible de récupérer votre profil.");
          setIsLoading(false);
          return;
        }

        if (profil.must_change_password) {
          notifySuccess("Connexion réussie. Veuillez changer votre mot de passe.");
          await logActivity(profil.id, "Connexion", "AuthForm");
          navigate("/changer-mot-de-passe");
        } else {
          notifySuccess("Connexion réussie !");
          await logActivity(profil.id, "Connexion", "AuthForm");
          navigate("/dashboard");
        }

        onAuthSuccess?.();
      } else {
        // Avant d'appeler signUp, vérifier si email est déjà utilisé
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("id")
          .eq("email", formData.email)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // Erreur autre que "no rows found"
          notifyError("Erreur lors de la vérification de l'email : " + fetchError.message);
          setIsLoading(false);
          return;
        }

        if (existingUser) {
          notifyError("Cet email est déjà utilisé. Veuillez en choisir un autre.");
          setIsLoading(false);
          return;
        }

        // Email libre, on inscrit l'utilisateur
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            },
          },
        });

        if (signUpError) {
          notifyError("Échec de l'inscription : " + signUpError.message);
          setIsLoading(false);
          return;
        }

        const user = data.user;

        if (!user) {
          setIsPendingConfirmation(true);
          notifySuccess("Inscription réussie ! Veuillez confirmer votre e-mail avant de vous connecter.");
          setIsLoading(false);
          return;
        }
        await logActivity(user.id, "Inscription", "AuthForm");
        notifySuccess("Inscription réussie ! Vérifiez votre e-mail pour confirmer.");
        setIsPendingConfirmation(true);
      }
    } catch (error) {
      console.error("Erreur inattendue:", error);
      notifyError("Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="auth"
      className="py-20 px-6 bg-light max-w-md mx-auto rounded-2xl shadow-lg"
    >
      <h2 className="text-3xl font-heading font-bold mb-8 text-primary text-center">
        {isLogin ? "Connexion" : "Inscription"}
      </h2>

      <div className="flex justify-center mb-8 space-x-8">
        <button
          type="button"
          onClick={() => {
            setIsLogin(true);
            setIsPendingConfirmation(false);
          }}
          className={`pb-2 border-b-4 font-semibold transition ${isLogin
            ? "border-primary text-primary"
            : "border-transparent text-gray-500 hover:text-secondary"
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
          className={`pb-2 border-b-4 font-semibold transition ${!isLogin
            ? "border-primary text-primary"
            : "border-transparent text-gray-500 hover:text-secondary"
            }`}
        >
          Inscription
        </button>
      </div>

      {isPendingConfirmation && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg">
          <p className="font-semibold">📧 Merci pour votre inscription !</p>
          <p>
            Veuillez confirmer votre adresse email via le lien envoyé. Vous
            pourrez vous connecter après vérification.
          </p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label
              htmlFor="name"
              className="block mb-2 font-semibold text-primary"
            >
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom complet"
              disabled={isPendingConfirmation || isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block mb-2 font-semibold text-primary"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemple@domaine.com"
            disabled={isPendingConfirmation || isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="relative">
          <label
            htmlFor="password"
            className="block mb-2 font-semibold text-primary"
          >
            Mot de passe
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="******"
            disabled={isPendingConfirmation || isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-9 right-3 text-gray-500 hover:text-primary focus:outline-none items-center justify-center rounded-full p-2 transition-colors"
            tabIndex={-1} // pour ne pas être tabulé en tab
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isPendingConfirmation || isLoading}
          className={`w-full ${isPendingConfirmation || isLoading
            ? "bg-secondary cursor-not-allowed"
            : "bg-primary hover:bg-green-800"
            } text-light font-semibold py-3 rounded-xl shadow transition`}
        >
          {isLoading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
        </button>
      </form>
    </section>
  );
};

export default AuthForm;