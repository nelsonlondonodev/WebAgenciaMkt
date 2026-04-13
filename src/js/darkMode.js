import { CONFIG } from './config.js';

export function initDarkMode() {
  // Eliminar el botón si existe (ya no se usa)
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.style.display = 'none';
  }
  
  // Limpiar cualquier configuración previa de light mode
  localStorage.removeItem(CONFIG.UI.THEME_KEY);
  
  // Forzar Dark Mode siempre
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');
}
