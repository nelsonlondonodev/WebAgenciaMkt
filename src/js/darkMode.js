import { CONFIG } from './config.js';

export function initDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    const themes = ['auto', 'light', 'dark'];
    let currentTheme = localStorage.getItem(CONFIG.UI.THEME_KEY) || 'dark';
    const applyTheme = (theme) => {
      if (theme === 'auto') {
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        document.documentElement.classList.toggle('dark', prefersDark);
      } else {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    };
    const updateIcon = (theme) => {
      const iconElement = darkModeToggle.querySelector('i');
      if (iconElement) {
        iconElement.classList.remove(
          'fa-sun',
          'fa-moon',
          'fa-circle-half-stroke'
        );
        if (theme === 'light') {
          iconElement.classList.add('fa-sun');
        } else if (theme === 'dark') {
          iconElement.classList.add('fa-moon');
        } else {
          iconElement.classList.add('fa-circle-half-stroke');
        }
      }
    };
    darkModeToggle.addEventListener('click', () => {
      const currentThemeIndex = themes.indexOf(currentTheme);
      const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
      currentTheme = themes[nextThemeIndex];
      localStorage.setItem(CONFIG.UI.THEME_KEY, currentTheme);
      applyTheme(currentTheme);
      updateIcon(currentTheme);
    });
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (currentTheme === 'auto') {
          applyTheme('auto');
        }
      });
    applyTheme(currentTheme);
    updateIcon(currentTheme);
  }
}
