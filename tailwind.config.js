/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0e7011',
        secondary: '#c87452',
        light: '#f7f7f7',
        dark: '#1a1a1a',
        accent: '#bce5bc',
        danger: '#dc2626',       // 🔴 Rouge vif pour suppression, annulation, etc.
        dangerHover: '#b91c1c',  // 🔴 Variante au survol
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}