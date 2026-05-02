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

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Inicializaciones críticas inmediatas (no dependen de componentes externos)
  initDarkMode();
  initSmoothScroll();

  // 2. Cargar componentes reutilizables (Nav, Footer, etc.)
  await loadComponents();

  // 3. Inicializaciones que dependen de los componentes cargados
  initNav();
  initFooter();
  generateBreadcrumbs('#breadcrumbs-placeholder');

  // 4. Renderizado de contenido dinámico principal
  applyAlternatingGradients('main', [
    'section-gradient-green',
    'section-gradient-blue',
  ]);
  initServiceCards();

  if (document.getElementById('portfolio-grid')) {
    renderPortfolioCards('portfolio-grid', 3);
  }
  if (document.getElementById('portfolio-grid-proyectos')) {
    renderPortfolioCards('portfolio-grid-proyectos');
  }

  initPortfolioFilter();
  initScrollAnimations();

  // 5. Inicializaciones diferidas (No críticas para el LCP o interactividad inicial)
  // Usamos un pequeño delay para asegurar que el hilo principal esté libre
  setTimeout(() => {
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
  }, 100);
});
