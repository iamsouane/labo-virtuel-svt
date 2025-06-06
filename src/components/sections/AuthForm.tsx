import { useState } from 'react';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section id="auth" className="py-20 px-6 bg-white max-w-md mx-auto rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold mb-8 text-center">
        {isLogin ? 'Connexion' : 'Inscription'}
      </h2>

      <div className="flex justify-center mb-8 space-x-8">
        <button
          onClick={() => setIsLogin(true)}
          className={`pb-2 border-b-4 font-semibold ${
            isLogin ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500'
          }`}
        >
          Connexion
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`pb-2 border-b-4 font-semibold ${
            !isLogin ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500'
          }`}
        >
          Inscription
        </button>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {!isLogin && (
          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
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
            placeholder="email@example.com"
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
            placeholder="••••••••"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow transition"
        >
          {isLogin ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>
    </section>
  );
};

export default AuthForm;