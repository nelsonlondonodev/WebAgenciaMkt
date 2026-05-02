import { CONFIG } from './config.js';

/**
 * Attaches submission logic to a specific contact form element.
 * @param {HTMLFormElement} contactForm
 */
function attachContactFormListeners(contactForm) {
  if (!contactForm) return;

  const statusMessage =
    contactForm.querySelector('#form-status') || contactForm.nextElementSibling; // Fallback if status is outside
  const submitButton = contactForm.querySelector('button[type="submit"]');

  // Helper para manejar el estado visual
  const updateStatus = (message, type) => {
    if (!statusMessage) return;

    // Si statusMessage no tiene estructura, solo texto (fallback simple)
    statusMessage.textContent = message;

    // Classes
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

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      updateStatus('Por favor, completa todos los campos requeridos.', 'error');
      return;
    }

    const formData = new FormData(contactForm);
    updateStatus('Enviando...', 'loading');

    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        updateStatus('¡Mensaje enviado con éxito!', 'success');
        contactForm.reset();

        // Si está en un modal, cerrar después de un tiempo podría ser buena UX,
        // pero por ahora solo mostramos éxito.
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
    textArea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
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
    success: { html: '<i class="fas fa-check"></i> ¡Copiado!', class: 'bg-green-500' },
    error: { html: '<i class="fas fa-times"></i> Error', class: 'bg-red-500' }
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
  overlay.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in';
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

  overlay.onclick = (e) => (e.target === overlay || e.target.closest('.close-btn')) && close();
  
  overlay.querySelector('.copy-btn').onclick = (e) => {
    const success = copyToClipboard(value);
    setButtonFeedback(e.currentTarget, success ? 'success' : 'error');
  };
}

export function initContactReveal() {
  const configs = [
    { id: 'reveal-email-btn', title: 'Correo Corporativo', value: CONFIG.CONTACT.EMAIL, icon: 'fas fa-envelope', link: `mailto:${CONFIG.CONTACT.EMAIL}` },
    { id: 'reveal-phone-btn', title: 'Línea Directa', value: CONFIG.CONTACT.PHONE_DISPLAY, icon: 'fas fa-phone-alt', link: `tel:${CONFIG.CONTACT.PHONE}` }
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
