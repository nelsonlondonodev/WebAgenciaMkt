/** @type {import('tailwindcss').Config} */
module.exports = {
  // Añadimos esta línea para activar el modo oscuro por clase
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{css,js}"],
  theme: {
    extend: {
      colors: {
        "primary-green": "#10B981",
        "primary-blue": "#3B82F6",
        "dark-bg": "#111827",
        "light-bg": "#F9FAFB",
        "dark-card": "#1F2937",
        "light-card": "#FFFFFF",
      },
      animation: {
        "zoom-in": "zoomIn 0.3s ease-out",
      },
      keyframes: {
        zoomIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
