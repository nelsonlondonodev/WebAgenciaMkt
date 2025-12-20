/** @type {import('tailwindcss').Config} */
module.exports = {
  // Añadimos esta línea para activar el modo oscuro por clase
  darkMode: 'class',

  content: ['./*.html', './src/**/*.html', './src/js/**/*.js', './components/**/*.html'],
  theme: {
    extend: {
      colors: {
        'primary-green': '#10B981',
        'primary-blue': '#3B82F6',
        'dark-bg': '#020202',
        'light-bg': '#F9FAFB',
        'dark-card': '#1F2937',
        'light-card': '#FFFFFF',
      },
      animation: {
        'zoom-in': 'zoomIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'scale-in-core': 'scaleInCore 0.8s ease-out forwards',
        'float-up-down': 'float-up-down 6s ease-in-out infinite',
        'float-down-up': 'float-down-up 8s ease-in-out infinite',
      },
      keyframes: {
        zoomIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(150px)' },
          '80%': { opacity: 1, transform: 'translateX(-10px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: 0, transform: 'translateX(-100px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        scaleInCore: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'float-up-down': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-down-up': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(20px)' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    // Estados dinámicos (JS)
    'nav-active',
    'is-active',
    'is-visible',
    'hidden',
    
    // Gradientes de sección (JS)
    'section-gradient-green',
    'section-gradient-blue',
    
    // Clases aplicadas dinámicamente en Chatbot y Formularios
    'text-red-600',
    'text-green-600',
    'text-gray-600',
    'dark:text-gray-300',
    'text-blue-500',
    'underline',
    
    // Patrones de colores de marca
    { 
      pattern: /bg-(primary-green|primary-blue)/, 
      variants: ['hover', 'dark', 'dark:hover'] 
    },
    { 
      pattern: /text-(primary-green|primary-blue)/, 
      variants: ['dark'] 
    }
  ],
};
