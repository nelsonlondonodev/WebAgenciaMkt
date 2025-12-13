// src/js/componentLoader.js

/**
 * Carga un componente HTML desde una URL y lo inserta en un elemento del DOM.
 * @param {string} selector - El selector CSS del elemento donde se insertará el componente.
 * @param {string} url - La URL del archivo HTML del componente.
 * @returns {Promise<void>}
 */
const loadComponent = async (selector, url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Error al cargar el componente ${url}: ${response.statusText}`,
      );
    }
    const data = await response.text();
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = data;
    } else {
      console.warn(`No se encontró el elemento con el selector: ${selector}`);
    }
  } catch (error) {
    console.error(`No se pudo cargar el componente desde ${url}:`, error);
  }
};

/**
 * Carga todos los componentes comunes de la página, como el nav y el footer.
 * Es importante que esta función se ejecute antes de los scripts que dependen
 * de los elementos cargados (ej. nav.js).
 */
export const loadComponents = async () => {
  // Siempre carga los componentes comunes como nav, footer y el banner de cookies.
  await Promise.all([
    loadComponent('#nav-placeholder', '/components/nav.html'),
    loadComponent('#footer-placeholder', '/components/footer.html'),
    loadComponent('#cookie-banner-placeholder', '/components/cookie-banner.html')
  ]);

  // Carga el chatbot solo si su placeholder existe en la página.
  if (document.querySelector('[data-component="chatbot"]')) {
    await loadComponent('[data-component="chatbot"]', '/components/chatbot.html');
  }
};
