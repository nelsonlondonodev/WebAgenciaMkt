// src/js/chatbot.js
import { CONFIG } from './config.js';

const STORAGE_KEY = 'nelson_whatsapp_alert_dismissed';
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 horas
const ALERT_DELAY_MS = 4000; // 4 segundos

/**
 * Comprueba si ha transcurrido el tiempo de enfriamiento desde la última interacción.
 * @param {string} key 
 * @param {number} cooldown 
 * @returns {boolean}
 */
function isAlertCooldownExpired(key, cooldown) {
  const lastDismissed = localStorage.getItem(key);
  if (!lastDismissed) return true;

  const elapsed = Date.now() - parseInt(lastDismissed, 10);
  return elapsed >= cooldown;
}

/**
 * Guarda la marca de tiempo de desestimación en el almacenamiento local.
 * @param {string} key 
 */
function recordDismissalTimestamp(key) {
  localStorage.setItem(key, Date.now().toString());
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
 * Abre la URL de WhatsApp en una pestaña segura.
 * @param {string} url 
 */
function openWhatsAppChat(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Clase controladora del Widget de WhatsApp en la interfaz web.
 */
class WhatsAppWidget {
  constructor() {
    this.button = document.getElementById('chat-widget-button');
    this.bubble = document.getElementById('chat-invitation-bubble');
    this.closeButton = document.getElementById('close-chat-invitation');
    this.timer = null;

    if (!this.button) return;
    this.init();
  }

  init() {
    this.bindEvents();
    this.scheduleEngagementAlert();
  }

  scheduleEngagementAlert() {
    if (!isAlertCooldownExpired(STORAGE_KEY, COOLDOWN_MS)) return;

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
      recordDismissalTimestamp(STORAGE_KEY);
    }
  }

  handleButtonInteraction() {
    this.hideBubble(true);
    sendAnalyticsEvent('Direct Button Click');
  }

  handleBubbleInteraction(event) {
    if (event.target.closest('#close-chat-invitation')) return;

    this.hideBubble(true);
    sendAnalyticsEvent('Tooltip Bubble Click');
    openWhatsAppChat(CONFIG.CONTACT.WHATSAPP_URL);
  }

  handleCloseInteraction(event) {
    event.stopPropagation();
    this.hideBubble(true);
  }

  bindEvents() {
    this.button.addEventListener('click', () => this.handleButtonInteraction());

    if (this.bubble) {
      this.bubble.addEventListener('click', (e) => this.handleBubbleInteraction(e));
    }

    if (this.closeButton) {
      this.closeButton.addEventListener('click', (e) => this.handleCloseInteraction(e));
    }
  }
}

export function initChatbot() {
  return new WhatsAppWidget();
}
