import { portfolioData } from './data/portfolio.js';
import { observeAnimatedElements } from './scrollAnimations.js';

function createSrcSet(srcset) {
  if (!srcset) return '';
  return Object.entries(srcset)
    .map(([size, url]) => `${url} ${size}`)
    .join(', ');
}

function createPortfolioCard(item) {
  const isLink = item.type === 'link';
  const tag = isLink ? 'a' : 'div';
  const hrefAttr = isLink ? `href="${item.url}" target="_blank" rel="noopener noreferrer"` : '';
  const cursorClass = isLink ? 'cursor-pointer' : 'cursor-pointer'; // Mantener cursor-pointer para modales
  const idAttr = item.type === 'modal' ? `id="${item.modalId}"` : '';

  const srcsetAttr = item.imgSrcSet ? `srcset="${createSrcSet(item.imgSrcSet)}"` : '';
  const sizesAttr = item.imgSrcSet ? `sizes="(max-width: 640px) 480px, (max-width: 1024px) 800px, 1440px"` : '';

  return `
    <${tag} ${idAttr} class="portfolio-item group scroll-animate-initial ${cursorClass}" data-category="${item.category}" ${hrefAttr}>
      <div class="relative">
        <img
          class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          ${srcsetAttr}
          ${sizesAttr}
          src="${item.imgSrc}"
          alt="${item.imgAlt}"
          loading="lazy"
          decoding="async"
        />
        ${item.type === 'link' ? `
          <div class="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
            <i class="fas fa-link"></i>
          </div>
        ` : ''}
        ${item.tourType ? `
          <div class="absolute top-2 right-2 flex items-center space-x-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <i class="fas fa-vr-cardboard"></i>
            <span>${item.tourType}</span>
          </div>
        ` : ''}
      </div>
      <div class="p-6">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${item.title}</h3>
          ${item.isNew ? `
            <span class="bg-primary-blue dark:bg-primary-green text-white text-xs font-bold uppercase py-1 px-2 rounded-full">
              Nuevo
            </span>
          ` : ''}
        </div>
        <p class="text-sm text-primary-blue dark:text-primary-green mb-2">${item.tags}</p>
        <p class="text-gray-600 dark:text-gray-400 text-base">${item.description}</p>
      </div>
    </${tag}>
  `;
}

export function initPortfolioCards() {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;

  const cardsHtml = portfolioData.map(createPortfolioCard).join('');
  container.innerHTML = cardsHtml;

  const newCards = container.querySelectorAll('.scroll-animate-initial');
  observeAnimatedElements(newCards);
}
