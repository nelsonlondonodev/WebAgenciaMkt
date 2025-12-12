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
  // Las rutas a los componentes son relativas a la raíz del sitio.
  await loadComponent('#nav-placeholder', '/components/nav.html');
  await loadComponent('#footer-placeholder', '/components/footer.html');
};
