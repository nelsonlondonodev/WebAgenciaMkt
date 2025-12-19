// src/js/componentLoader.js
import { generateBreadcrumbs } from './breadcrumbs.js';

/**
 * Carga un componente HTML estático y lo inserta en un elemento del DOM.
 * @param {string} selector - El selector CSS del elemento.
 * @param {string} url - La URL del archivo HTML del componente.
 * @returns {Promise<void>}
 */
const loadStaticComponent = async (selector, url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al cargar ${url}: ${response.statusText}`);
    }
    const data = await response.text();
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = data;
      // Si el componente cargado es el de las migas de pan, las generamos.
      if (selector === '#breadcrumbs-component') {
        generateBreadcrumbs('#breadcrumbs-placeholder');
      }
    } else {
      // No logueamos la advertencia para el breadcrumb, ya que no está en todas las páginas
      if (selector !== '#breadcrumbs-component') {
        console.warn(`Selector no encontrado: ${selector}`);
      }
    }
  } catch (error) {
    console.error(`No se pudo cargar componente desde ${url}:`, error);
  }
};

/**
 * Carga un componente configurable, reemplazando placeholders con data-attributes.
 * @param {HTMLElement} element - El elemento del DOM que requiere el componente.
 * @returns {Promise<void>}
 */
const loadConfigurableComponent = async (element) => {
  const componentName = element.dataset.component;
  if (!componentName) return;

  const url = `/components/${componentName}.html`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al cargar ${url}: ${response.statusText}`);
    }
    let html = await response.text();

    // Manejar y cargar estilos personalizados en el head
    if (element.dataset.heroCustomStyles) {
      const style = document.createElement('style');
      style.textContent = element.dataset.heroCustomStyles;
      document.head.appendChild(style);
    }

    // Reemplazar placeholders como {{KEY}} con el valor de data-key
    for (const key in element.dataset) {
      if (key === 'component' || key === 'heroCustomStyles') {
        continue; // Omitir estas claves especiales
      }
      
      const placeholder = `{{${key.replace(/([A-Z])/g, '_$1').replace('-', '_').toUpperCase()}}}`;
      const value = element.dataset[key];
      
      if (value !== undefined) {
        html = html.replaceAll(placeholder, value);
      }
    }

    // Limpiar cualquier placeholder restante que no tenga un data-attribute correspondiente
    html = html.replace(/\{\{[A-Z_]+\}\}/g, '');

    element.innerHTML = html;
  } catch (error) {
    console.error(`No se pudo cargar componente configurable desde ${url}:`, error);
  }
};


/**
 * Carga todos los componentes de la página.
 */
export const loadComponents = async () => {
  // Carga componentes estáticos comunes
  const staticLoaders = [
    loadStaticComponent('#nav-placeholder', '/components/nav.html'),
    loadStaticComponent('#footer-placeholder', '/components/footer.html'),
    loadStaticComponent(
      '#cookie-banner-placeholder',
      '/components/cookie-banner.html'
    ),
    loadStaticComponent(
      '#breadcrumbs-component',
      '/components/breadcrumbs.html'
    ),
  ];
  
  // Carga componentes configurables basados en data-attributes
  const configurableComponents = document.querySelectorAll('[data-component]');
  const configurableLoaders = Array.from(configurableComponents).map(element => {
    // Asegurarnos de no volver a procesar los que ya tienen un loader específico si es necesario,
    // pero para este caso, 'chatbot' y 'hero-section' son únicos.
    return loadConfigurableComponent(element);
  });

  // Ejecutar todos los cargadores en paralelo
  await Promise.all([...staticLoaders, ...configurableLoaders]);
};
