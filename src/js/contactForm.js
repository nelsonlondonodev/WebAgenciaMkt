// src/js/contactForm.js
import { CONFIG } from './config.js';

/**
 * Verifica si el campo trampa (honeypot) fue completado por un bot.
 * @param {FormData} formData
 * @returns {boolean}
 */
export function isHoneypotTriggered(formData) {
  const honeypotValue = formData.get('b_website');
  return typeof honeypotValue === 'string' && honeypotValue.trim().length > 0;
}

/**
 * Detecta caracteres cirílicos (rusos), asiáticos o enlaces sospechosos típicos de spam.
 * @param {string} text
 * @returns {boolean}
 */
export function containsSpamPatterns(text) {
  if (!text || typeof text !== 'string') return false;

  const cyrillicRegex = /[\u0400-\u04FF]/;
  const cjkRegex = /[\u4E00-\u9FFF]/;

  if (cyrillicRegex.test(text) || cjkRegex.test(text)) {
    return true;
  }

  const linkCount = (text.match(/https?:\/\//gi) || []).length;
  return linkCount > 2;
}

/**
 * Valida si la presentación del formulario ocurrió en menos del tiempo mínimo de llenado humano.
 * @param {number} renderTimestamp
 * @param {number} minSeconds
 * @returns {boolean}
 */
export function isSubmittedTooFast(renderTimestamp, minSeconds = 3) {
  if (!renderTimestamp) return false;
  const elapsedSeconds = (Date.now() - renderTimestamp) / 1000;
  return elapsedSeconds < minSeconds;
}

/**
 * Evalúa si la solicitud pertenece a un bot automatizado (Honeypot, Spam de caracteres o Time-check).
 * @param {FormData} formData
 * @param {number} renderTimestamp
 * @param {number} [minSeconds=3]
 * @returns {boolean}
 */
export function isBotSubmission(formData, renderTimestamp, minSeconds = 3) {
  if (isHoneypotTriggered(formData)) return true;
  if (isSubmittedTooFast(renderTimestamp, minSeconds)) return true;

  const name = formData.get('name');
  const message = formData.get('message');

  if (typeof name === 'string' && containsSpamPatterns(name)) return true;
  if (typeof message === 'string' && containsSpamPatterns(message)) return true;

  return false;
}

/**
 * Realiza la petición HTTP POST al endpoint del formulario.
 * @param {string} actionUrl
 * @param {FormData} formData
 * @returns {Promise<boolean>}
 */
export async function sendContactFormData(actionUrl, formData) {
  const response = await fetch(actionUrl, {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
  });
  return response.ok;
}

/**
 * Genera la plantilla HTML para el modal de pre-cualificación.
 * @param {string} modalId
 * @returns {string}
 */
function getQualificationModalTemplate(modalId) {
  return `
    <div id="${modalId}" class="fixed inset-0 z-[10005] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-fade-in" aria-modal="true" role="dialog" aria-labelledby="qual-modal-title">
      <div class="relative w-full max-w-lg rounded-3xl bg-white/95 dark:bg-zinc-950/90 border border-gray-100 dark:border-white/10 p-6 sm:p-8 text-gray-800 dark:text-gray-200 shadow-2xl animate-scale-in-core transition-transform duration-300">
        
        <div class="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-white/10">
          <h3 id="qual-modal-title" class="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5">
            <span class="text-amber-500 text-2xl" aria-hidden="true">⚠️</span>
            Verificación antes de enviar
          </h3>
          <button id="qual-modal-close" class="p-1 -mr-2 text-gray-400 hover:text-gray-900 dark:hover:text-white text-3xl font-light leading-none transition-colors" aria-label="Cerrar modal">&times;</button>
        </div>

        <div class="mt-5 space-y-4">
          <p class="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
            Para ofrecerte la mejor propuesta estratégica y respuesta prioritaria, nos enfocamos en perfiles que califiquen:
          </p>

          <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
            <h4 class="text-sm font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
              <span aria-hidden="true">✅</span> ¿Quién califica?
            </h4>
            <ul class="text-xs sm:text-sm space-y-1.5 text-gray-700 dark:text-gray-300">
              <li class="flex items-start gap-2">
                <span class="text-emerald-500 mt-0.5">•</span>
                <span>Empresas, autónomos y PYMEs que buscan <strong>desarrollo web profesional, SEO o software</strong>.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-500 mt-0.5">•</span>
                <span>Negocios decididos a implementar <strong>automatizaciones con IA</strong> para optimizar procesos.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-500 mt-0.5">•</span>
                <span>Proyectos con intención real de inversión y presupuesto asignado.</span>
              </li>
            </ul>
          </div>

          <div class="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/15">
            <h4 class="text-sm font-extrabold uppercase tracking-wider text-rose-500/80 dark:text-rose-400 mb-2 flex items-center gap-2">
              <span aria-hidden="true">❌</span> ¿Quién NO califica?
            </h4>
            <ul class="text-xs sm:text-sm space-y-1.5 text-gray-600 dark:text-gray-400">
              <li class="flex items-start gap-2">
                <span>•</span> <span>Consultas de soporte técnico gratuito para software de terceros.</span>
              </li>
              <li class="flex items-start gap-2">
                <span>•</span> <span>Solicitudes de empleo, spam comercial automatizado o venta de servicios.</span>
              </li>
            </ul>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400 text-center italic mt-2">
            ¿Cumples con estos requisitos y estás listo para llevar a cabo tu proyecto?
          </p>
        </div>

        <div class="mt-6 flex flex-col-reverse sm:flex-row gap-3 justify-end border-t border-gray-100 dark:border-white/10 pt-4">
          <button id="qual-modal-cancel" class="px-5 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors text-sm uppercase tracking-wider">
            Cancelar / Revisar
          </button>
          <button id="qual-modal-confirm" class="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-blue to-primary-green hover:opacity-90 text-white font-bold shadow-lg transition-all active:scale-95 text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <i class="fas fa-paper-plane text-sm" aria-hidden="true"></i>
            <span>Sí, califico y enviar</span>
          </button>
        </div>

      </div>
    </div>
  `;
}

/**
 * Configura los eventos e interacciones del modal de pre-cualificación.
 * @param {HTMLElement} modalEl
 * @param {Function} onConfirm
 * @param {Function} closeModal
 */
function setupQualificationModalEvents(modalEl, onConfirm, closeModal) {
  const closeBtn = modalEl.querySelector('#qual-modal-close');
  const cancelBtn = modalEl.querySelector('#qual-modal-cancel');
  const confirmBtn = modalEl.querySelector('#qual-modal-confirm');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      closeModal();
      onConfirm();
    });
  }

  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });
}

/**
 * Muestra el modal de pre-cualificación para envíos del formulario de contacto.
 * @param {Function} onConfirm Callback a ejecutar si el usuario califica y confirma.
 */
export function showContactQualificationModal(onConfirm) {
  const modalId = 'contact-qualification-modal';
  if (document.getElementById(modalId)) return;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = getQualificationModalTemplate(modalId).trim();
  const modalEl = wrapper.firstChild;

  document.body.appendChild(modalEl);
  document.body.classList.add('overflow-hidden');

  const closeModal = () => {
    modalEl.classList.add('opacity-0');
    setTimeout(() => {
      if (document.body.contains(modalEl)) {
        document.body.removeChild(modalEl);
      }
      document.body.classList.remove('overflow-hidden');
    }, 300);
  };

  setupQualificationModalEvents(modalEl, onConfirm, closeModal);
}

/**
 * Adjunta la lógica de validación, filtros anti-bot y envío al formulario de contacto.
 * @param {HTMLFormElement} contactForm
 */
function attachContactFormListeners(contactForm) {
  if (!contactForm) return;

  const statusMessage =
    contactForm.querySelector('#form-status') || contactForm.nextElementSibling;
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const renderTimestamp = Date.now();

  const updateStatus = (message, type) => {
    if (!statusMessage) return;

    statusMessage.textContent = message;

    const baseClasses = 'text-center font-semibold mt-4 block';
    const typeClasses = {
      error: 'text-red-600',
      success: 'text-green-600',
      loading: 'text-gray-600 dark:text-gray-300',
    };

    statusMessage.className = `${baseClasses} ${typeClasses[type] || ''}`;

    if (type !== 'loading') {
      setTimeout(() => {
        statusMessage.textContent = '';
      }, 5000);
    }
  };

  const handleFormSubmission = async (formData) => {
    updateStatus('Enviando...', 'loading');
    if (submitButton) submitButton.disabled = true;

    try {
      const isSuccess = await sendContactFormData(contactForm.action, formData);

      if (isSuccess) {
        updateStatus('¡Mensaje enviado con éxito!', 'success');
        contactForm.reset();
      } else {
        updateStatus(
          'Hubo un error al enviar el mensaje. Inténtalo de nuevo.',
          'error'
        );
      }
    } catch (error) {
      updateStatus(
        'Hubo un problema de conexión. Revisa tu internet.',
        'error'
      );
    } finally {
      if (submitButton) {
        setTimeout(() => {
          submitButton.disabled = false;
        }, 3000);
      }
    }
  };

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      updateStatus('Por favor, completa todos los campos requeridos.', 'error');
      return;
    }

    const formData = new FormData(contactForm);

    if (isBotSubmission(formData, renderTimestamp, 3)) {
      updateStatus('¡Mensaje enviado con éxito!', 'success');
      contactForm.reset();
      return;
    }

    showContactQualificationModal(() => {
      handleFormSubmission(formData);
    });
  });
}

export function initContactForm() {
  const staticForm = document.querySelector('#contact-form');
  if (staticForm) {
    attachContactFormListeners(staticForm);
  }
}

/**
 * Abre un modal pequeño con efecto "glassmorphism" para mostrar datos sensibles.
 * @param {string} title - Título del dato (ej: "Correo Electrónico")
 * @param {string} value - El valor real (ej: email@dominio.com)
 * @param {string} iconClass - Clase de FontAwesome
 * @param {string} linkHref - Enlace para la acción principal (mailto: o tel:)
 */
/**
 * Copia un texto al portapapeles con fallback síncrono.
 */
/**
 * Copia un texto al portapapeles con fallback síncrono.
 */
function copyToClipboard(text) {
  // Intentar primero el método moderno si está disponible
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
    return true; // Asumimos éxito inicial para la UI
  }

  // Fallback síncrono
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText =
      'position:fixed;left:-9999px;top:-9999px;opacity:0;';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Copy Error:', err);
    return false;
  }
}

/**
 * Genera el HTML del modal de privacidad.
 */
const getPrivacyModalTemplate = (title, value, icon, link) => `
  <div class="relative w-full max-w-sm bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden transform scale-95 opacity-0 transition-all duration-300">
    <div class="absolute top-0 right-0 w-32 h-32 bg-primary-blue/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-32 h-32 bg-primary-green/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
    <div class="relative p-6 text-center">
      <button class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors close-btn" aria-label="Cerrar">
        <i class="fas fa-times text-lg"></i>
      </button>
      <div class="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner mb-4 animate-float-up-down">
        <i class="${icon} text-3xl text-white drop-shadow-lg"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-200 mb-1">${title}</h3>
      <a href="${link}" class="block text-xl font-bold text-white tracking-wide hover:text-primary-blue dark:hover:text-primary-green transition-colors mb-6 break-all">${value}</a>
      <div class="flex gap-3 justify-center">
        <a href="${link}" class="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white py-2 px-4 rounded-xl font-medium transition-all backdrop-blur-md flex items-center justify-center gap-2 group">
          <i class="fas fa-external-link-alt group-hover:scale-110 transition-transform"></i> Abrir
        </a>
        <button class="flex-1 bg-gradient-to-r from-primary-blue to-primary-green hover:opacity-90 text-white py-2 px-4 rounded-xl font-bold shadow-lg shadow-primary-blue/20 transition-all active:scale-95 copy-btn flex items-center justify-center gap-2">
          <i class="far fa-copy"></i> Copiar
        </button>
      </div>
    </div>
  </div>
`;

/**
 * Maneja el feedback visual del botón de copia.
 */
function setButtonFeedback(btn, type) {
  const original = btn.innerHTML;
  const states = {
    success: {
      html: '<i class="fas fa-check"></i> ¡Copiado!',
      class: 'bg-green-500',
    },
    error: { html: '<i class="fas fa-times"></i> Error', class: 'bg-red-500' },
  };

  const state = states[type];
  btn.innerHTML = state.html;
  btn.classList.add(state.class);

  setTimeout(() => {
    btn.innerHTML = original;
    btn.classList.remove(state.class);
  }, 2000);
}

/**
 * Abre el modal de privacidad con lógica refactorizada.
 */
function openPrivacyModal(title, value, icon, link) {
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in';
  overlay.innerHTML = getPrivacyModalTemplate(title, value, icon, link);

  const content = overlay.firstElementChild;
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    content.classList.replace('scale-95', 'scale-100');
    content.classList.replace('opacity-0', 'opacity-100');
  });

  const close = () => {
    content.classList.replace('scale-100', 'scale-95');
    content.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.onclick = (e) =>
    (e.target === overlay || e.target.closest('.close-btn')) && close();

  overlay.querySelector('.copy-btn').onclick = (e) => {
    const success = copyToClipboard(value);
    setButtonFeedback(e.currentTarget, success ? 'success' : 'error');
  };
}

export function initContactReveal() {
  const configs = [
    {
      id: 'reveal-email-btn',
      title: 'Correo Corporativo',
      value: CONFIG.CONTACT.EMAIL,
      icon: 'fas fa-envelope',
      link: `mailto:${CONFIG.CONTACT.EMAIL}`,
    },
    {
      id: 'reveal-phone-btn',
      title: 'Línea Directa',
      value: CONFIG.CONTACT.PHONE_DISPLAY,
      icon: 'fas fa-phone-alt',
      link: `tel:${CONFIG.CONTACT.PHONE}`,
    },
  ];

  configs.forEach(({ id, ...data }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.onclick = (e) => {
        e.preventDefault();
        openPrivacyModal(data.title, data.value, data.icon, data.link);
      };
    }
  });
}

/**
 * Abre un modal con el formulario de contacto.
 * @param {string} prefillMessage - Mensaje opcional para pre-rellenar.
 */
export async function openContactModal(prefillMessage = '') {
  // 1. Cargar el HTML del componente
  let componentHtml = '';
  try {
    const response = await fetch('/components/contact-form.html');
    if (!response.ok) throw new Error('Error loading form component');
    componentHtml = await response.text();
  } catch (error) {
    console.error('Could not load contact form component:', error);
    return;
  }

  // 2. Procesar el HTML para el modal (limpiar estilos de animación y textos de "sección")
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = componentHtml;

  // Eliminar animaciones de scroll (opacity: 0) porque el observer no las verá dentro del modal
  tempDiv.querySelectorAll('.scroll-animate-initial').forEach((el) => {
    el.classList.remove(
      'scroll-animate-initial',
      'opacity-0',
      'translate-y-20'
    );
    // Asegurar visibilidad
    el.style.opacity = '1';
    el.style.transform = 'none';
  });

  // Extraer solo lo relevante: el formulario
  const formElement = tempDiv.querySelector('form');
  // const contactInfo = tempDiv.querySelector('.mt-10.text-center'); // Eliminamos los botones de contacto del modal

  // Optimización de UI para el modal: Reducir espaciados
  if (formElement) {
    formElement.classList.replace('gap-y-6', 'gap-y-4'); // Reducir espacio entre inputs
    // Reducir padding interno de inputs para que sean menos altos
    formElement.querySelectorAll('input, textarea').forEach((input) => {
      input.classList.replace('py-3', 'py-2');
    });
  }

  // Contenedor limpio con SOLO el formulario
  const cleanContent = document.createElement('div');
  if (formElement) cleanContent.appendChild(formElement);

  // 3. Construir la estructura del modal
  const modalWrapper = document.createElement('div');
  modalWrapper.className =
    'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in p-4';

  modalWrapper.innerHTML = `
    <div class="relative w-full max-w-lg rounded-xl bg-light-card dark:bg-dark-card shadow-2xl animate-zoom-in flex flex-col max-h-[90vh] overflow-y-auto scrollbar-hide">
       <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl z-10 transition-colors close-modal-btn">&times;</button>
       <div class="p-5 sm:p-6">
         <h3 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">Solicita tu Prueba Gratuita</h3>
         ${cleanContent.innerHTML}
       </div>
    </div>
  `;

  // 3. Insertar en el DOM
  document.body.appendChild(modalWrapper);
  document.body.classList.add('overflow-hidden');

  // 4. Inicializar lógica del formulario dentro del modal
  const formInModal = modalWrapper.querySelector('form');
  if (formInModal) {
    // Override del ID para evitar duplicados si ya existe en la página
    formInModal.id = 'contact-form-modal';
    attachContactFormListeners(formInModal);

    // Pre-rellenar
    if (prefillMessage) {
      const msgInput = formInModal.querySelector('[name="message"]');
      if (msgInput) msgInput.value = prefillMessage;
    }
  }

  // 5. Lógica de cierre
  const closeModal = () => {
    modalWrapper.classList.add('opacity-0'); // Simple fade out effect manually or use animation class
    setTimeout(() => {
      if (modalWrapper.parentNode) document.body.removeChild(modalWrapper);
      document.body.classList.remove('overflow-hidden');
    }, 300);
  };

  modalWrapper
    .querySelector('.close-modal-btn')
    .addEventListener('click', closeModal);
  modalWrapper.addEventListener('click', (e) => {
    if (e.target === modalWrapper) closeModal();
  });

  // Cerrar con ESC
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

/**
 * Configura botones que abren el modal de contacto con mensaje predefinido.
 * @param {string} triggerSelector - Selector CSS de los botones.
 * @param {string} prefillMessage - Mensaje a insertar.
 */
export function setupContactModal(triggerSelector, prefillMessage) {
  const buttons = document.querySelectorAll(triggerSelector);

  if (buttons.length === 0) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal(prefillMessage);
    });
  });
}
