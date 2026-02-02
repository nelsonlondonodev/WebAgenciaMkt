import { CONFIG } from './config.js';

/**
 * Attaches submission logic to a specific contact form element.
 * @param {HTMLFormElement} contactForm 
 */
function attachContactFormListeners(contactForm) {
  if (!contactForm) return;

  const statusMessage = contactForm.querySelector('#form-status') || contactForm.nextElementSibling; // Fallback if status is outside
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
        updateStatus('Hubo un error al enviar el mensaje. Inténtalo de nuevo.', 'error');
      }
    } catch (error) {
      updateStatus('Hubo un problema de conexión. Revisa tu internet.', 'error');
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

export function initContactReveal() {
  const contactContainer = document.getElementById('contact-reveal-container');
  if (!contactContainer) return;

  const revealEmailBtn = document.getElementById('reveal-email-btn');
  const revealPhoneBtn = document.getElementById('reveal-phone-btn');

  const createLink = (href, iconClass, text) => `
    <a href="${href}" class="text-primary-blue dark:text-primary-green font-semibold hover:underline flex items-center">
        <i class="${iconClass} mr-2"></i>${text}
    </a>`;

  if (revealEmailBtn) {
    revealEmailBtn.addEventListener(
      'click',
      (e) => {
        e.currentTarget.outerHTML = createLink(
          `mailto:${CONFIG.CONTACT.EMAIL}`,
          'fas fa-envelope',
          CONFIG.CONTACT.EMAIL
        );
      },
      { once: true }
    );
  }

  if (revealPhoneBtn) {
    revealPhoneBtn.addEventListener(
      'click',
      (e) => {
        e.currentTarget.outerHTML = createLink(
          `tel:${CONFIG.CONTACT.PHONE}`,
          'fas fa-phone',
          CONFIG.CONTACT.PHONE_DISPLAY
        );
      },
      { once: true }
    );
  }
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
  tempDiv.querySelectorAll('.scroll-animate-initial').forEach(el => {
    el.classList.remove('scroll-animate-initial', 'opacity-0', 'translate-y-20'); 
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
    formElement.querySelectorAll('input, textarea').forEach(input => {
      input.classList.replace('py-3', 'py-2'); 
    });
  }
  
  // Contenedor limpio con SOLO el formulario
  const cleanContent = document.createElement('div');
  if (formElement) cleanContent.appendChild(formElement);


  // 3. Construir la estructura del modal
  const modalWrapper = document.createElement('div');
  modalWrapper.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in p-4';
  
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
        if(modalWrapper.parentNode) document.body.removeChild(modalWrapper);
        document.body.classList.remove('overflow-hidden');
    }, 300);
  };

  modalWrapper.querySelector('.close-modal-btn').addEventListener('click', closeModal);
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

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal(prefillMessage);
    });
  });
}
