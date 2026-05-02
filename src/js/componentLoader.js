// src/js/componentLoader.js
import { CONFIG } from './config.js';

const APP_VERSION = CONFIG.UI.APP_VERSION || '1.0.0';

/**
 * Procesa un string HTML reemplazando placeholders {{KEY}} con valores de un dataset.
 */
const interpolateTemplate = (html, dataset) => {
  let processedHtml = html;
  
  for (const key in dataset) {
    if (key === 'component' || key === 'heroCustomStyles') continue;

    const placeholder = `{{${key
      .replace(/([A-Z])/g, '_$1')
      .replace('-', '_')
      .toUpperCase()}}}`;
    
    const value = dataset[key];
    if (value !== undefined) {
      processedHtml = processedHtml.replaceAll(placeholder, value);
    }
  }

  // Limpiar placeholders restantes
  return processedHtml.replace(/\{\{[A-Z_]+\}\}/g, '');
};

/**
 * Carga un componente desde el servidor con manejo de versión para caché.
 */
const fetchComponent = async (url) => {
  const versionedUrl = `${url}?v=${APP_VERSION}`;
  const response = await fetch(versionedUrl);
  if (!response.ok) throw new Error(`HTTP Error: ${response.statusText}`);
  return await response.text();
};

/**
 * Carga un componente estático simple.
 */
const loadStaticComponent = async (selector, url) => {
  try {
    const html = await fetchComponent(url);
    const element = document.querySelector(selector);
    if (element) element.innerHTML = html;
  } catch (error) {
    console.error(`[ComponentLoader] Fallo al cargar estático ${url}:`, error);
  }
};

/**
 * Carga un componente configurable con inyección de datos.
 */
const loadConfigurableComponent = async (element) => {
  const componentName = element.dataset.component;
  if (!componentName) return;

  const url = `/components/${componentName}.html`;

  try {
    // Inyectar estilos personalizados si existen
    if (element.dataset.heroCustomStyles) {
      const style = document.createElement('style');
      style.textContent = element.dataset.heroCustomStyles;
      document.head.appendChild(style);
    }

    const rawHtml = await fetchComponent(url);
    element.innerHTML = interpolateTemplate(rawHtml, element.dataset);
  } catch (error) {
    console.error(`[ComponentLoader] Fallo al cargar configurable ${url}:`, error);
  }
};

/**
 * Orquestador principal de carga de componentes.
 */
export const loadComponents = async () => {
  // 1. Definir cargadores estáticos
  const staticTargets = [
    { selector: '#nav-placeholder', url: '/components/nav.html' },
    { selector: '#footer-placeholder', url: '/components/footer.html' },
    { selector: '#cookie-banner-placeholder', url: '/components/cookie-banner.html' }
  ];

  const staticPromises = staticTargets.map(t => loadStaticComponent(t.selector, t.url));

  // 2. Identificar y definir cargadores configurables
  const configurableElements = document.querySelectorAll('[data-component]');
  const configurablePromises = Array.from(configurableElements).map(loadConfigurableComponent);

  // 3. Ejecutar todo en paralelo para máxima eficiencia
  await Promise.all([...staticPromises, ...configurablePromises]);
};
