// src/js/chatbot.js
import { CONFIG } from './config.js';

const DISMISS_SESSION_KEY = 'nelson_whatsapp_bubble_dismissed';
const ALERT_DELAY_MS = 6000; // 6 segundos de retención previa en la web

/**
 * Comprueba si la burbuja fue desestimada en la sesión actual.
 * @returns {boolean}
 */
function isBubbleDismissedInSession() {
  return sessionStorage.getItem(DISMISS_SESSION_KEY) === 'true';
}

/**
 * Registra que la burbuja fue desestimada en la sesión actual.
 */
function recordSessionDismissal() {
  sessionStorage.setItem(DISMISS_SESSION_KEY, 'true');
}

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
 * Controla la interacción del Widget y la Tarjeta Modal de WhatsApp.
 */
class WhatsAppWidget {
  constructor() {
    this.button = document.getElementById('chat-widget-button');
    this.modal = document.getElementById('whatsapp-card-modal');
    this.bubble = document.getElementById('chat-invitation-bubble');
    this.closeBubbleButton = document.getElementById('close-chat-invitation');
    this.closeModalButton = document.getElementById('close-whatsapp-card');
    this.confirmButton = document.getElementById('confirm-whatsapp-btn');
    this.timer = null;

    if (!this.button || !this.modal) return;
    this.init();
  }

  init() {
    this.bindEvents();
    this.scheduleEngagementAlert();
  }

  scheduleEngagementAlert() {
    if (isBubbleDismissedInSession()) return;

    this.timer = setTimeout(() => {
      this.showBubble();
    }, ALERT_DELAY_MS);
  }

  showBubble() {
    if (this.bubble) {
      this.bubble.style.display = 'flex';
      this.bubble.classList.add('animate-fade-in-up');
    }
  }

  hideBubble(persist = true) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.bubble) {
      this.bubble.style.display = 'none';
    }

    if (persist) {
      recordSessionDismissal();
    }
  }

  toggleModal() {
    this.hideBubble(true);
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

    // Clic en la burbuja de invitación suave
    if (this.bubble) {
      this.bubble.addEventListener('click', (e) => {
        if (e.target.closest('#close-chat-invitation')) return;
        this.openModal();
        this.hideBubble(true);
      });
    }

    // Botón de cerrar la burbuja de invitación
    if (this.closeBubbleButton) {
      this.closeBubbleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideBubble(true);
      });
    }

    // Cerrar la tarjeta modal con el botón X
    if (this.closeModalButton) {
      this.closeModalButton.addEventListener('click', (e) => {
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
