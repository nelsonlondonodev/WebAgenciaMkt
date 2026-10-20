/**
 * Plantilla de las tarjetas del portafolio, sin DOM.
 *
 * La usa inyectar-componentes.js en el build para escribir las tarjetas
 * dentro del HTML de proyectos.html, y script.js para pintar las 3 primeras
 * en la home al cargar. En la home van por JS a propósito: están lejos de la
 * primera pantalla y, metidas en el HTML, sus imágenes competían con la foto
 * del hero y subían el LCP de 4,7 s a 5,0 s.
 * Antes había dos copias: las tarjetas estáticas, puestas para evitar CLS,
 * y las que el JS generaba desde portfolio.js y sobrescribían a las
 * estáticas al cargar. Ahora src/js/data/portfolio.js es la única fuente.
 */
import { portfolioData } from './data/portfolio.js';

function createSrcSet(srcset) {
  if (!srcset) return '';
  return Object.entries(srcset)
    .map(([size, url]) => `${url} ${size}`)
    .join(', ');
}

function createCardImage(item, srcsetAttr, sizesAttr, priority) {
  return `
    <div class="relative">
      <img
        class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        ${srcsetAttr}
        ${sizesAttr}
        src="${item.imgSrc}"
        alt="${item.imgAlt}"
        width="400"
        height="224"
        ${priority ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}
        decoding="async"
      />
      ${
        item.tourType
          ? `
        <div class="absolute top-2 right-2 flex items-center space-x-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <i class="fas fa-vr-cardboard"></i>
          <span>${item.tourType}</span>
        </div>
      `
          : ''
      }
    </div>
  `;
}

function createCardContent(item) {
  return `
    <div class="p-6">
      <div class="flex items-center gap-2 mb-2">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${item.title}</h3>
        ${
          item.isNew
            ? `
          <span class="bg-primary-blue dark:bg-primary-green text-white text-xs font-bold uppercase py-1 px-2 rounded-full">
            Nuevo
          </span>
        `
            : ''
        }
      </div>
      <p class="text-sm text-primary-blue dark:text-primary-green mb-2">${item.tags}</p>
      <p class="text-gray-600 dark:text-gray-400 text-base">${item.description}</p>
    </div>
  `;
}

function createPortfolioCard(item, priority = false) {
  const isLink = item.type === 'link';
  const tag = isLink ? 'a' : 'div';
  const hrefAttr = isLink
    ? `href="${item.url}" target="_blank" rel="noopener noreferrer"`
    : '';
  const cursorClass = 'cursor-pointer'; // Siempre cursor-pointer para enlaces o modales
  const idAttr = item.type === 'modal' ? `id="card-proyecto-${item.id}"` : '';
  const dataTypeAttr = item.type === 'modal' ? 'data-type="modal"' : '';

  const srcsetAttr = item.imgSrcSet
    ? `srcset="${createSrcSet(item.imgSrcSet)}"`
    : '';
  // Ancho real de la tarjeta en la rejilla (1 columna en móvil, 2 en md y 3
  // en lg dentro de max-w-7xl). El sizes anterior hacía que el móvil bajara
  // la imagen de 1440px en vez de la de 800px.
  const sizesAttr = item.imgSrcSet
    ? `sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px"`
    : '';

  return `
    <${tag} ${idAttr} ${dataTypeAttr} class="portfolio-item group scroll-animate-initial ${cursorClass}" data-category="${item.category}" ${hrefAttr}>
      <div class="absolute inset-0 bg-gradient-to-br from-primary-blue/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
      ${createCardImage(item, srcsetAttr, sizesAttr, priority)}
      ${createCardContent(item)}
    </${tag}>
  `;
}

/**
 * HTML de las tarjetas. Con priority, la primera se carga sin lazy y con
 * fetchpriority alto, porque en proyectos.html es candidata a LCP.
 */
export function renderPortfolioHtml({ limit = null, priority = false } = {}) {
  const items = limit ? portfolioData.slice(0, limit) : portfolioData;
  return items.map((item, i) => createPortfolioCard(item, priority && i === 0)).join('');
}
