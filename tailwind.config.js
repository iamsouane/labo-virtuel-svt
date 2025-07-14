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
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Appliqué par défaut si tu utilises `font-sans`
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}