import { CONFIG } from './config.js';

class Chatbot {
  constructor() {
    this.elements = {
      widgetButton: document.getElementById('chat-widget-button'),
      window: document.getElementById('chat-window'),
      closeButton: document.getElementById('close-chat-window'),
      sendButton: document.getElementById('chat-send'),
      input: document.getElementById('chat-input'),
      messages: document.getElementById('chat-messages'),
      badge: document.getElementById('chat-notification-badge'),
      bubble: document.getElementById('chat-invitation-bubble'),
      closeInvitation: document.getElementById('close-chat-invitation'),
    };

    if (!this.elements.widgetButton) return;

    this.initProperties();
    this.init();
  }

  initProperties() {
    this.n8nWebhookUrl = CONFIG.CHATBOT.WEBHOOK_URL;
    this.sessionIdKey = CONFIG.CHATBOT.SESSION_ID_KEY;
    this.sessionId = this.getOrCreateSessionId();
    this.historyKey = `nelson_chat_history_${this.sessionId}`;
    this.history = [];

    // Engagement Constants
    this.engagement = {
      storageKey: 'nelson_chat_alert_last_dismissed',
      timer: null,
      cooldown: 24 * 60 * 60 * 1000, // 24 hours
      delay: 5000, // 5 seconds
    };
  }

  init() {
    this.loadHistory();
    this.addEventListeners();
    this.initEngagementLogic();
  }

  getOrCreateSessionId() {
    let sessionId = localStorage.getItem(this.sessionIdKey);
    if (!sessionId) {
      sessionId =
        Date.now().toString(36) + Math.random().toString(36).substring(2);
      localStorage.setItem(this.sessionIdKey, sessionId);
    }
    return sessionId;
  }

  loadHistory() {
    const storedHistory = sessionStorage.getItem(this.historyKey);
    if (storedHistory) {
      this.history = JSON.parse(storedHistory);
      this.history.forEach((item) => {
        // Pass false to prevent re-saving history while loading
        this.appendMessage(item.message, item.sender, false);
      });
    }
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
    const hasHistory = this.history.length > 0;
    if (hasHistory) return false;

    const lastDismissed = localStorage.getItem(this.engagement.storageKey);
    if (!lastDismissed) return true;

    const elapsed = Date.now() - parseInt(lastDismissed, 10);
    return elapsed >= this.engagement.cooldown;
  }

  showEngagementAlert() {
    this.updateAlertVisibility(true);
  }

  dismissEngagementAlert(persist = false) {
    if (this.engagement.timer) clearTimeout(this.engagement.timer);

    this.updateAlertVisibility(false);

    if (persist) {
      localStorage.setItem(this.engagement.storageKey, Date.now().toString());
    }
  }

  updateAlertVisibility(show) {
    const { badge, bubble } = this.elements;

    if (badge) badge.classList.toggle('hidden', !show);

    if (bubble) {
      bubble.style.display = show ? 'flex' : 'none';
      if (show) bubble.classList.add('animate-fade-in-up');
    }
  }

  addEventListeners() {
    this.elements.widgetButton.addEventListener('click', () => {
      this.toggleWindow();
      this.dismissEngagementAlert(true);
    });

    if (this.elements.closeInvitation) {
      this.elements.closeInvitation.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dismissEngagementAlert(true);
      });
    }

    this.elements.closeButton.addEventListener('click', () =>
      this.toggleWindow()
    );
    this.elements.sendButton.addEventListener('click', () =>
      this.sendMessage()
    );
    this.elements.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  toggleWindow() {
    this.elements.window.classList.toggle('hidden');
    if (!this.elements.window.classList.contains('hidden')) {
      this.elements.input.focus();
      if (this.history.length === 0) {
        this.appendMessage(
          '¡Hola! Soy Aurelio, tu asistente virtual. ¿En qué puedo ayudarte?',
          'bot'
        );
      }
    }
  }

  sendMessage() {
    const message = this.elements.input.value.trim();
    if (message === '') return;

    this.appendMessage(message, 'user');
    this.elements.input.value = '';
    this.showTypingIndicator();
    this.sendToWebhook(message, this.sessionId);
  }

  async sendToWebhook(message, sessionId) {
    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message, sessionId: sessionId }),
      });
      const data = await response.json();
      this.removeTypingIndicator();
      const botResponse =
        data.response ||
        'Lo siento, no he podido procesar tu mensaje. Por favor, intenta de nuevo.';
      this.appendMessage(botResponse, 'bot');
    } catch (error) {
      console.error('Error sending message to n8n:', error);
      this.removeTypingIndicator();
      this.appendMessage(
        'Lo siento, ha ocurrido un error de conexión. Por favor, inténtalo más tarde.',
        'bot'
      );
    }
  }

  createBubble(message, sender) {
    const bubble = document.createElement('div');
    bubble.className = `py-2 px-4 inline-block max-w-xs ${
      sender === 'user'
        ? 'bg-primary-blue text-white rounded-t-lg rounded-bl-lg'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-t-lg rounded-br-lg'
    }`;
    bubble.innerHTML = message;
    bubble
      .querySelectorAll('a')
      .forEach((link) => link.classList.add('text-blue-500', 'underline'));
    return bubble;
  }

  createTimestamp() {
    const time = new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const timeElement = document.createElement('div');
    timeElement.className = 'text-xs text-gray-500 dark:text-gray-400 mt-1';
    timeElement.textContent = time;
    return timeElement;
  }

  appendMessage(message, sender, save = true) {
    if (save) {
      this.history.push({ message, sender });
      sessionStorage.setItem(this.historyKey, JSON.stringify(this.history));
    }

    const messageElement = document.createElement('div');
    messageElement.className = `mb-4 flex flex-col ${
      sender === 'user' ? 'items-end' : 'items-start'
    } animate-chat-message-in`;

    const bubble = this.createBubble(message, sender);
    const timestamp = this.createTimestamp();

    messageElement.appendChild(bubble);
    messageElement.appendChild(timestamp);

    this.elements.messages.appendChild(messageElement);
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
  }

  showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.className = 'mb-4';
    typingIndicator.innerHTML = `
      <div class="bg-gray-200 dark:bg-gray-700 rounded-lg py-2 px-4 inline-block">
        <div class="flex items-center space-x-1">
          <span class="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
          <span class="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style="animation-delay: 0.2s;"></span>
          <span class="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style="animation-delay: 0.4s;"></span>
        </div>
      </div>`;
    this.elements.messages.appendChild(typingIndicator);
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
  }

  removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
}

export function initChatbot() {
  new Chatbot();
}
