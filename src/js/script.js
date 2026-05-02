import { initDarkMode } from './darkMode.js';
import { initSmoothScroll } from './smoothScroll.js';
import { applyAlternatingGradients } from './sectionStyler.js'; // Importar la función para gradientes alternos
import { initScrollAnimations } from './scrollAnimations.js';
import { initNav } from './nav.js';
import { initPortfolioFilter } from './portfolio.js';
import { initNumberAnimation } from './numberAnimation.js';
import { loadComponents } from './componentLoader.js'; // Importar el cargador de componentes
import { initFooter } from './footer.js'; // Importar la inicialización del footer
import { initChatbot } from './chatbot.js';
import { initServiceCards } from './serviceRenderer.js';
import { renderPortfolioCards } from './portfolioRenderer.js';
import { initTestimonialCarousel } from './testimonialCarousel.js';
import { initDynamicModals } from './modalRenderer.js';
import { generateBreadcrumbs } from './breadcrumbs.js'; // Importar la función para generar migas de pan

import {
  initContactForm,
  initContactReveal,
  setupContactModal,
} from './contactForm.js';

import { initCookieConsent } from './cookieConsent.js';

import { setupSocialSharing } from './socialSharing.js';
import { initPricing } from './pricing.js';
import {
  initBeforeAfterSlider,
  initHeroBenefitBadge,
  initSuccessCaseCarousels,
} from './uiInteractions.js';

// import { initHeroIframe } from './heroHelper.js';

/**
 * Programa la ejecución de tareas no críticas para cuando el hilo principal esté libre.
 * @param {Function} task - La función a ejecutar.
 */
const scheduleIdleTask = (task) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => task(), { timeout: 2000 });
  } else {
    setTimeout(task, 200);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Fase Crítica: UX Inicial e Identidad
  initDarkMode();
  initSmoothScroll();

  // 2. Fase de Hidratación: Carga de componentes estructurales
  await loadComponents();

  // 3. Fase de Interactividad: Funciones del Nav y Layout
  initNav();
  initFooter();
  generateBreadcrumbs('#breadcrumbs-placeholder');

  applyAlternatingGradients('main', [
    'section-gradient-green',
    'section-gradient-blue',
  ]);
  
  initServiceCards();

  // Renderizado condicional de Portfolio
  const portfolioGrid = document.getElementById('portfolio-grid');
  const projectsGrid = document.getElementById('portfolio-grid-proyectos');
  
  if (portfolioGrid) renderPortfolioCards('portfolio-grid', 3);
  if (projectsGrid) renderPortfolioCards('portfolio-grid-proyectos');

  initPortfolioFilter();
  initScrollAnimations();

  // 4. Fase Ociosa (Idle): Plugins y widgets secundarios
  scheduleIdleTask(() => {
    initChatbot();
    initDynamicModals();
    initContactForm();
    initContactReveal();
    initCookieConsent();
    setupSocialSharing();
    initPricing();
    initTestimonialCarousel();
    initBeforeAfterSlider();
    initHeroBenefitBadge();
    initSuccessCaseCarousels();
  });
});
