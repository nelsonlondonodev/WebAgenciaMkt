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
import { initTestimonialCards } from './testimonialRenderer.js';
import { initDynamicModals } from './modalRenderer.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Cargar componentes reutilizables como el NAV y el Footer
  await loadComponents();

  // Inicializar el resto de los scripts después de que los componentes estén cargados
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
  initTestimonialCards();
  initFooter(); // Inicializar el footer
  initChatbot(); // Inicializar el chatbot
      initDynamicModals(); // Inicializa los modales dinámicos
      generateBreadcrumbs('#breadcrumbs-placeholder'); // Generar las migas de pan
  
  
      initContactForm();
      function initContactForm() {    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
      const statusMessage = document.getElementById('form-status');
      const submitButton = contactForm.querySelector('button[type="submit"]');
      contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!contactForm.checkValidity()) {
          contactForm.reportValidity();
          if (statusMessage) {
            statusMessage.textContent =
              'Por favor, completa todos los campos requeridos.';
            statusMessage.className =
              'text-center font-semibold mt-4 text-red-600';
            setTimeout(() => {
              statusMessage.textContent = '';
            }, 5e3);
          }
          return;
        }
        const formData = new FormData(contactForm);
        if (statusMessage) {
          statusMessage.textContent = 'Enviando...';
          statusMessage.className =
            'text-center font-semibold mt-4 text-gray-600 dark:text-gray-300';
        }
        if (submitButton) {
          submitButton.disabled = true;
        }
        try {
          const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { Accept: 'application/json' },
          });
          if (response.ok) {
            if (statusMessage) {
              statusMessage.textContent = '¡Mensaje enviado con éxito!';
              statusMessage.className =
                'text-center font-semibold mt-4 text-green-600';
              setTimeout(() => {
                statusMessage.textContent = '';
              }, 5e3);
            }
            contactForm.reset();
          } else {
            if (statusMessage) {
              statusMessage.textContent =
                'Hubo un error al enviar el mensaje. Inténtalo de nuevo.';
              statusMessage.className =
                'text-center font-semibold mt-4 text-red-600';
              setTimeout(() => {
                statusMessage.textContent = '';
              }, 5e3);
            }
          }
        } catch (error) {
          if (statusMessage) {
            statusMessage.textContent =
              'Hubo un problema de conexión. Revisa tu internet.';
            statusMessage.className =
              'text-center font-semibold mt-4 text-red-600';
            setTimeout(() => {
              statusMessage.textContent = '';
            }, 5e3);
          }
        } finally {
          if (submitButton) {
            setTimeout(() => {
              submitButton.disabled = false;
            }, 3e3);
          }
        }
      });
    }
  }

  initContactReveal();
  function initContactReveal() {
    const contactContainer = document.getElementById('contact-reveal-container');
    if (contactContainer) {
      const revealEmailBtn = document.getElementById('reveal-email-btn');
      const revealPhoneBtn = document.getElementById('reveal-phone-btn');
      if (revealEmailBtn) {
        revealEmailBtn.addEventListener(
          'click',
          (e) => {
            e.currentTarget.outerHTML = `
          <a href="mailto:contacto@nelsonlondono.es" class="text-primary-blue dark:text-primary-green font-semibold hover:underline flex items-center">
            <i class="fas fa-envelope mr-2"></i>contacto@nelsonlondono.es
          </a>`;
          },
          { once: true }
        );
      }
      if (revealPhoneBtn) {
        revealPhoneBtn.addEventListener(
          'click',
          (e) => {
            e.currentTarget.outerHTML = `
          <a href="tel:+34663975428" class="text-primary-blue dark:text-primary-green font-semibold hover:underline flex items-center">
            <i class="fas fa-phone mr-2"></i>+34 663 97 54 28
          </a>`;
          },
          { once: true }
        );
      }
    }
  }

  initCookieConsent();
  function initCookieConsent() {
    const COOKIE_CONSENT_KEY = 'nelson_cookie_consent';
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieModal = document.getElementById('cookie-settings-modal');
    const analyticsToggle = document.getElementById('analytics-cookie-toggle');
    const openCookieSettingsBtn = document.getElementById('open-cookie-settings');
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    const settingsBtn = document.getElementById('cookie-settings-open');
    const saveSettingsBtn = document.getElementById('cookie-settings-save');

    function getConsent() {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      return consent ? JSON.parse(consent) : null;
    }

    function setConsent(consent) {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    }

    function enableGoogleAnalytics() {
      if (typeof gtag === 'function') {
        gtag('config', 'G-124QEKRXHD');
        // console.log('Google Analytics activado.');
      }
    }

    function handleInitialConsent() {
      const consent = getConsent();
      if (consent) {
        if (consent.analytics) {
          enableGoogleAnalytics();
        }
        if (cookieBanner) {
          cookieBanner.classList.add('hidden');
        }
      } else {
        if (cookieBanner) {
          cookieBanner.classList.remove('hidden');
        }
      }
    }

    if (openCookieSettingsBtn) {
      openCookieSettingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const consent = getConsent() || { analytics: false };
        if (analyticsToggle) {
          analyticsToggle.checked = consent.analytics;
        }
        if (cookieModal) {
          cookieModal.classList.remove('hidden');
        }
      });
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        const consent = { necessary: true, analytics: true };
        setConsent(consent);
        enableGoogleAnalytics();
        if (cookieBanner) {
          cookieBanner.classList.add('hidden');
        }
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        const consent = { necessary: true, analytics: false };
        setConsent(consent);
        if (cookieBanner) {
          cookieBanner.classList.add('hidden');
        }
      });
    }

    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        const consent = getConsent() || { analytics: false };
        if (analyticsToggle) {
          analyticsToggle.checked = consent.analytics;
        }
        if (cookieModal) {
          cookieModal.classList.remove('hidden');
        }
      });
    }

    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => {
        const consent = {
          necessary: true,
          analytics: analyticsToggle ? analyticsToggle.checked : false,
        };
        setConsent(consent);
        if (consent.analytics) {
          enableGoogleAnalytics();
        }
        if (cookieModal) {
          cookieModal.classList.add('hidden');
        }
        if (cookieBanner) {
          cookieBanner.classList.add('hidden');
        }
      });
    }

    if (cookieModal) {
      cookieModal.addEventListener('click', (e) => {
        if (e.target === cookieModal) {
          cookieModal.classList.add('hidden');
        }
      });
    }

    handleInitialConsent();
  }

  initHeroIframe();
  function initHeroIframe() {
    const heroIframeContainer = document.getElementById('hero-iframe-container');
    if (heroIframeContainer) {
      heroIframeContainer.addEventListener(
        'click',
        () => {
          const placeholder = document.getElementById('hero-iframe-placeholder');
          const iframe = document.getElementById('hero-iframe');
          if (iframe && iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            if (placeholder) {
              placeholder.classList.add('hidden');
            }
            iframe.classList.remove('hidden');
            heroIframeContainer.style.cursor = 'default';
          }
        },
        { once: true }
      );
    }
  }

  function setupSocialSharing() {
    const shareLinkedin = document.getElementById('share-linkedin');
    const shareWhatsapp = document.getElementById('share-whatsapp');

    if (shareLinkedin && shareWhatsapp) {
      const shareUrl = window.location.href;
      const shareTitle = document.title;
      const shareText = document
        .querySelector('meta[name="description"]')
        .getAttribute('content');

      if (shareUrl && shareTitle && shareText) {
        shareLinkedin.href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          shareUrl
        )}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(
          shareText
        )}`;
        shareLinkedin.target = '_blank';
        shareLinkedin.rel = 'noopener noreferrer';

        shareWhatsapp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          shareTitle + ' - Link: ' + shareUrl
        )}`;
        shareWhatsapp.target = '_blank';
        shareWhatsapp.rel = 'noopener noreferrer';
      }
    }
  }
  setupSocialSharing();
});
