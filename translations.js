// Base translations shared across all pages
const baseTranslations = {
  es: {
    // Common keys like navigation, footer, modal titles, etc.
    navHome: 'Inicio',
    navServices: 'Servicios',
    navProjects: 'Proyectos',
    navAbout: 'Sobre Mí',
    navTestimonials: 'Testimonios',
    navContact: 'Contacto',
    navBlog: 'Blog',
    navServiceAutomations: 'Agentes Virtuales y Automatizaciones',
    openMenu: 'Abrir menú principal',
    badgeNew: 'Nuevo',
    serviceLearnMore: 'Saber más',
    modalCTA: 'Pedir Presupuesto',
    footerText: `&copy; ${new Date().getFullYear()} Nelson Londoño Agencia. Todos los derechos reservados.`,
    footerMadeWith:
      'Diseñado con <i class="fas fa-heart text-red-500"></i> en Madrid.',
    revealEmail: 'Mostrar Email',
    revealPhone: 'Mostrar Teléfono',
    '404GoHome': 'Volver a la página de inicio',
  },
  en: {
    navHome: 'Home',
    navServices: 'Services',
    navProjects: 'Projects',
    navAbout: 'About Me',
    navTestimonials: 'Testimonials',
    navContact: 'Contact',
    navBlog: 'Blog',
    navServiceAutomations: 'Virtual Agents & Automations',
    openMenu: 'Open main menu',
    badgeNew: 'New',
    serviceLearnMore: 'Learn more',
    modalCTA: 'Request Quote',
    footerText: `&copy; ${new Date().getFullYear()} Nelson Londoño Agency. All rights reserved.`,
    footerMadeWith:
      'Designed with <i class="fas fa-heart text-red-500"></i> in Madrid.',
    revealEmail: 'Show Email',
    revealPhone: 'Show Phone',
    '404GoHome': 'Go back to the homepage',
  },
};

/**
 * Formats all <time> elements on the page according to the current language.
 * @param {string} lang - The current language ('es' or 'en').
 */
function formatDate(lang) {
  const timeElements = document.querySelectorAll('time');
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const locale = lang === 'es' ? 'es-ES' : 'en-US';

  timeElements.forEach((el) => {
    const datetime = el.getAttribute('datetime');
    if (datetime) {
      const dateParts = datetime.split('-').map((part) => parseInt(part, 10));
      const date = new Date(
        Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2])
      );
      el.textContent = new Intl.DateTimeFormat(locale, options).format(date);
    }
  });
}

/**
 * Updates the DOM attributes and language switcher UI.
 * @param {string} lang - The new language to set.
 */
function updateDOMForLanguage(lang) {
  const langIndicator = document.getElementById('langIndicator');
  if (!langIndicator) {
    console.error('CRITICAL: #langIndicator element not found in HTML.');
    return;
  }
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;
  document.body.setAttribute('data-lang', lang);
  langIndicator.innerHTML =
    lang === 'es'
      ? '<span role="img" aria-label="Bandera de Reino Unido">🇬🇧</span> EN'
      : '<span role="img" aria-label="Bandera de España">🇪🇸</span> ES';
}

/**
 * Determines the URL for the page-specific translation file based on the current path.
 * @returns {string|null} The URL of the translation file or null if not needed.
 */
function getPageSpecificTranslationsUrl() {
  const path = window.location.pathname;
  const pageName = path.substring(path.lastIndexOf('/') + 1);

  // List of pages that have their own translation files
  const pagesWithTranslations = [
    'agencia-automatizaciones.html',
    'articulo-redes-sociales-publicidad-local.html',
    'articulo-seo-post-fiestas.html',
    'blog.html',
    'index.html', // Assuming index.html also has a corresponding json
  ];

  if (pagesWithTranslations.includes(pageName) || (pageName === '' && pagesWithTranslations.includes('index.html'))) {
    const jsonFile = (pageName || 'index.html').replace('.html', '.json');
    return `./translations/${jsonFile}`;
  }
  
  // For pages like articulo-ejemplo.html that don't have a json, it will return null
  return null;
}

/**
 * Applies the translations to all elements with a data-translate-key attribute.
 * @param {string} lang - The current language.
 * @param {object} pageTranslations - The translations specific to the current page.
 */
function applyTranslations(lang, pageTranslations) {
  const mergedTranslations = {
    es: { ...baseTranslations.es, ...(pageTranslations.es || {}) },
    en: { ...baseTranslations.en, ...(pageTranslations.en || {}) },
  };

  document.querySelectorAll('[data-translate-key]').forEach((el) => {
    const key = el.getAttribute('data-translate-key');
    const translation = mergedTranslations[lang]?.[key];

    if (translation !== undefined) {
      // Use innerHTML for keys that are known to contain HTML tags
      const keysWithHtml = [
        'articleContent',
        'footerMadeWith',
        'ctaDescription',
        'whatsappButton',
      ];
      if (keysWithHtml.includes(key)) {
        el.innerHTML = translation;
      } else {
        el.textContent = translation;
      }
    } else {
      // console.warn(`Translation key not found: ${key}`);
    }
  });

  formatDate(lang);
}

/**
 * Fetches page-specific translations and applies them.
 * @param {string} lang - The current language.
 */
async function loadAndApplyTranslations(lang) {
  const url = getPageSpecificTranslationsUrl();
  let pageTranslations = {};

  if (url) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        pageTranslations = await response.json();
      } else {
        console.error(`Could not load page-specific translations from ${url}`);
      }
    } catch (error) {
      console.error(`Error fetching translations from ${url}:`, error);
    }
  }

  applyTranslations(lang, pageTranslations);
}

/**
 * Sets the language for the page and loads the appropriate translations.
 * @param {string} lang - The language to set ('es' or 'en').
 */
function setLanguage(lang) {
  updateDOMForLanguage(lang);
  loadAndApplyTranslations(lang);
}

/**
 * Initializes the translation functionality, setting the initial language
 * and adding an event listener to the language switcher button.
 */
export function initTranslations() {
  const languageSwitcher = document.getElementById('languageSwitcher');
  if (languageSwitcher) {
    let currentLang = localStorage.getItem('language') || 'es';
    
    languageSwitcher.addEventListener('click', () => {
      const newLang = currentLang === 'es' ? 'en' : 'es';
      setLanguage(newLang);
      currentLang = newLang;
    });

    // Set initial language
    setLanguage(currentLang);
  }
}
