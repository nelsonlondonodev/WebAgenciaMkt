// src/js/chatbot.js
import { CONFIG } from './config.js';

/**
 * Envía el evento de analítica a Google Analytics 4.
 * @param {string} label 
 */
function sendAnalyticsEvent(label) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'WhatsApp Widget',
      event_label: label,
      value: 1,
    });
  }
}

/**
 * Controla la interacción de la Tarjeta Modal de WhatsApp.
 */
class WhatsAppWidget {
  constructor() {
    this.button = document.getElementById('chat-widget-button');
    this.modal = document.getElementById('whatsapp-card-modal');
    this.closeButton = document.getElementById('close-whatsapp-card');
    this.confirmButton = document.getElementById('confirm-whatsapp-btn');

    if (!this.button || !this.modal) return;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  toggleModal() {
    const isHidden = this.modal.classList.contains('hidden');
    if (isHidden) {
      this.openModal();
    } else {
      this.closeModal();
    }
  }

  openModal() {
    this.modal.classList.remove('hidden');
    this.button.setAttribute('aria-expanded', 'true');
    this.modal.setAttribute('aria-hidden', 'false');
  }

  closeModal() {
    this.modal.classList.add('hidden');
    this.button.setAttribute('aria-expanded', 'false');
    this.modal.setAttribute('aria-hidden', 'true');
  }

  handleConfirmClick() {
    sendAnalyticsEvent('Card Confirm Button Click');
    this.closeModal();
  }

  handleOutsideClick(event) {
    const isClickInside = this.modal.contains(event.target) || this.button.contains(event.target);
    if (!isClickInside && !this.modal.classList.contains('hidden')) {
      this.closeModal();
    }
  }

  bindEvents() {
    // Alternar visibilidad de la tarjeta al pulsar el botón flotante
    this.button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleModal();
    });

    // Cerrar la tarjeta con el botón de X
    if (this.closeButton) {
      this.closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeModal();
      });
    }

    // Confirmación al hacer clic en "Iniciar Chat en WhatsApp"
    if (this.confirmButton) {
      this.confirmButton.addEventListener('click', () => this.handleConfirmClick());
    }

    // Cerrar si se hace clic fuera de la tarjeta
    document.addEventListener('click', (e) => this.handleOutsideClick(e));

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.closeModal();
      }
    });
  }
}

export function initChatbot() {
  return new WhatsAppWidget();
}
