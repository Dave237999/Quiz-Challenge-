/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Active le mode sombre par classe
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Tu peux définir ici les couleurs de ta maquette
        primary: '#6366f1', // Indigo
        darkBg: '#0f172a',  // Fond sombre
      }
    },
  },
  plugins: [],
}