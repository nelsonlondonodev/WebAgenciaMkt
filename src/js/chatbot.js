// src/js/chatbot.js
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
 * Controla el botón flotante de WhatsApp y su burbuja de invitación.
 * El botón es un enlace a wa.me: un toque abre el chat, sin tarjeta intermedia.
 */
class WhatsAppWidget {
  constructor() {
    this.button = document.getElementById('chat-widget-button');
    this.bubble = document.getElementById('chat-invitation-bubble');
    this.closeBubbleButton = document.getElementById('close-chat-invitation');
    this.timer = null;

    if (!this.button) return;
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

  bindEvents() {
    // El enlace abre WhatsApp por sí solo; aquí solo se mide y se oculta la burbuja
    this.button.addEventListener('click', () => {
      sendAnalyticsEvent('Floating Button Click');
      this.hideBubble(true);
    });

    // La burbuja de invitación hace lo mismo que el botón
    if (this.bubble) {
      this.bubble.addEventListener('click', (e) => {
        if (e.target.closest('#close-chat-invitation')) return;
        this.button.click();
      });
    }

    // Botón de cerrar la burbuja de invitación
    if (this.closeBubbleButton) {
      this.closeBubbleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideBubble(true);
      });
    }
  }
}

export function initChatbot() {
  return new WhatsAppWidget();
}
