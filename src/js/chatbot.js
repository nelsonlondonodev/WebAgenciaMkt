class Chatbot {
  constructor() {
    this.elements = {
      widgetButton: document.getElementById('chat-widget-button'),
      window: document.getElementById('chat-window'),
      closeButton: document.getElementById('close-chat-window'),
      sendButton: document.getElementById('chat-send'),
      input: document.getElementById('chat-input'),
      messages: document.getElementById('chat-messages'),
    };

    if (!this.elements.widgetButton) {
      return;
    }

    this.n8nWebhookUrl =
      'https://n8n.srv1033442.hstgr.cloud/webhook/34b5ab96-ecf0-4195-93de-e3923c2062e5';
    this.sessionIdKey = 'nelson_chat_session_id';
    this.sessionId = this.getOrCreateSessionId();
    this.historyKey = `nelson_chat_history_${this.sessionId}`;
    this.history = [];

    this.loadHistory();
    this.addEventListeners();
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
      this.history.forEach(item => {
        // Pass false to prevent re-saving history while loading
        this.appendMessage(item.message, item.sender, false);
      });
    }
  }

  addEventListeners() {
    this.elements.widgetButton.addEventListener('click', () => this.toggleWindow());
    this.elements.closeButton.addEventListener('click', () => this.toggleWindow());
    this.elements.sendButton.addEventListener('click', () => this.sendMessage());
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
    bubble.querySelectorAll('a').forEach(link => link.classList.add('text-blue-500', 'underline'));
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

