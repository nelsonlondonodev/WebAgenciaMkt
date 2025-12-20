import { CONFIG } from './config.js';

export function initContactForm() {
  const contactForm = document.querySelector('#contact-form');
  if (!contactForm) return;

  const statusMessage = document.getElementById('form-status');
  const submitButton = contactForm.querySelector('button[type="submit"]');

  // Helper para manejar el estado visual, evitando repetición de código
  const updateStatus = (message, type) => {
    if (!statusMessage) return;

    statusMessage.textContent = message;

    const baseClasses = 'text-center font-semibold mt-4';
    const typeClasses = {
      error: 'text-red-600',
      success: 'text-green-600',
      loading: 'text-gray-600 dark:text-gray-300',
    };

    statusMessage.className = `${baseClasses} ${typeClasses[type] || ''}`;

    // Limpiar mensaje automáticamente si no es estado de carga
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
