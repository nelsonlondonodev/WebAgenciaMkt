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

import { initContactForm, initContactReveal, setupContactModal } from './contactForm.js';

import { initCookieConsent } from './cookieConsent.js';

import { setupSocialSharing } from './socialSharing.js';

// import { initHeroIframe } from './heroHelper.js';



document.addEventListener('DOMContentLoaded', async () => {
  // Cargar componentes reutilizables como el NAV y el Footer

  await loadComponents();



  // Inicializar el resto de los scripts después de que los componentes estén cargados

  generateBreadcrumbs('#breadcrumbs-placeholder'); // Generar las migas de pan

  initDarkMode();

  initSmoothScroll();

  applyAlternatingGradients('main', ['section-gradient-green', 'section-gradient-blue']); // Aplicar gradientes alternos a las secciones

  initScrollAnimations();

  initNav();

  initNumberAnimation();

  initServiceCards();

  if (document.getElementById('portfolio-grid')) {

      renderPortfolioCards('portfolio-grid', 3); // Para la página de inicio, limitar a 3 proyectos

  }

  if (document.getElementById('portfolio-grid-proyectos')) {

      renderPortfolioCards('portfolio-grid-proyectos'); // Para la página de proyectos, renderizar todos

  }

  initPortfolioFilter(); // Inicializa los filtros para las tarjetas recién creadas

  initTestimonialCarousel();

  initFooter(); // Inicializar el footer

  initChatbot(); // Inicializar el chatbot

      initDynamicModals(); // Inicializa los modales dinámicos

  

  

      initContactForm();



  initContactReveal();

  // Configuración específica para el botón de prueba gratis en SEO Local
  // Configuración de modal eliminada para permitir enlace directo a Cal.com



  initCookieConsent();



  // initHeroIframe();



  setupSocialSharing();

});


