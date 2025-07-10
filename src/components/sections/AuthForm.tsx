// src/components/sections/AuthForm.tsx
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { NewUser } from "../../types";

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      return setError("Veuillez remplir tous les champs.");
    }

    if (isLogin) {
      // Connexion
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) return setError(error.message);
      onAuthSuccess?.();
    } else {
      // Inscription
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) return setError(signUpError.message);

      const user = data.user;
      if (user) {
        const newUser: NewUser = {
          nom: formData.name.split(" ").slice(-1)[0] || "",
          prenom: formData.name.split(" ").slice(0, -1).join(" ") || "",
          email: formData.email,
          photo_profil: null,
          role: "ELEVE",
          must_change_password: true,
        };

        const { error: insertError } = await supabase
          .from("users")
          .insert([{ id: user.id, ...newUser }]);

        if (insertError) return setError(insertError.message);
      }

      alert("Inscription réussie ! Vérifiez votre e-mail pour confirmer.");
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
          onClick={() => setIsLogin(true)}
          className={`pb-2 border-b-4 font-semibold ${
            isLogin ? "border-green-600 text-green-700" : "border-transparent text-gray-500"
          }`}
        >
          Connexion
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`pb-2 border-b-4 font-semibold ${
            !isLogin ? "border-green-600 text-green-700" : "border-transparent text-gray-500"
          }`}
        >
          Inscription
        </button>
      </div>

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
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
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
            required
            minLength={6}
            placeholder="******"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow transition"
        >
          {isLogin ? "Se connecter" : "S'inscrire"}
        </button>
      </form>
    </section>
  );
};

export default AuthForm;