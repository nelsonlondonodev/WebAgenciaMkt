// src/js/chatbot.js
import { CONFIG } from './config.js';

class WhatsAppWidget {
  constructor() {
    this.elements = {
      widgetButton: document.getElementById('chat-widget-button'),
      bubble: document.getElementById('chat-invitation-bubble'),
      closeInvitation: document.getElementById('close-chat-invitation'),
    };

    if (!this.elements.widgetButton) return;

    this.initProperties();
    this.init();
  }

  initProperties() {
    this.engagement = {
      storageKey: 'nelson_whatsapp_alert_dismissed',
      timer: null,
      cooldown: 24 * 60 * 60 * 1000, // 24 horas
      delay: 4000, // 4 segundos
    };
  }

  init() {
    this.addEventListeners();
    this.initEngagementLogic();
  }

  initEngagementLogic() {
    if (this.shouldShowAlert()) {
      this.engagement.timer = setTimeout(
        () => this.showEngagementAlert(),
        this.engagement.delay
      );
    }
  }

  shouldShowAlert() {
    const lastDismissed = localStorage.getItem(this.engagement.storageKey);
    if (!lastDismissed) return true;

    const elapsed = Date.now() - parseInt(lastDismissed, 10);
    return elapsed >= this.engagement.cooldown;
  }

  showEngagementAlert() {
    if (this.elements.bubble) {
      this.elements.bubble.style.display = 'flex';
      this.elements.bubble.classList.add('animate-fade-in-up');
    }
  }

  dismissEngagementAlert(persist = true) {
    if (this.engagement.timer) clearTimeout(this.engagement.timer);

    if (this.elements.bubble) {
      this.elements.bubble.style.display = 'none';
    }

    if (persist) {
      localStorage.setItem(this.engagement.storageKey, Date.now().toString());
    }
  }

  addEventListeners() {
    // Click en el botón principal de WhatsApp
    this.elements.widgetButton.addEventListener('click', () => {
      this.dismissEngagementAlert(true);
      this.trackAnalytics();
    });

    // Click en la burbuja tooltip de bienvenida (redirige a WhatsApp)
    if (this.elements.bubble) {
      this.elements.bubble.addEventListener('click', (e) => {
        if (e.target.closest('#close-chat-invitation')) return;
        
        this.dismissEngagementAlert(true);
        this.trackAnalytics();
        window.open(CONFIG.CONTACT.WHATSAPP_URL, '_blank', 'noopener,noreferrer');
      });
    }

    // Botón de cerrar la invitación
    if (this.elements.closeInvitation) {
      this.elements.closeInvitation.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dismissEngagementAlert(true);
      });
    }
  }

  trackAnalytics() {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'WhatsApp Widget',
        event_label: 'Direct Chat',
        value: 1,
      });
    }
  }
}

export function initChatbot() {
  return new WhatsAppWidget();
}
