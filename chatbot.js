document.addEventListener('DOMContentLoaded', () => {
    const chatWidgetButton = document.getElementById('chat-widget-button');
    const chatWindow = document.getElementById('chat-window');
    const closeChatWindowButton = document.getElementById('close-chat-window');
    const chatSendButton = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    const n8nWebhookUrl = 'https://n8n.srv1033442.hstgr.cloud/webhook/34b5ab96-ecf0-4195-93de-e3923c2062e5';
    const CHAT_SESSION_ID_KEY = 'nelson_chat_session_id';

    function getOrCreateSessionId() {
        let sessionId = localStorage.getItem(CHAT_SESSION_ID_KEY);
        if (!sessionId) {
            sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
            localStorage.setItem(CHAT_SESSION_ID_KEY, sessionId);
        }
        return sessionId;
    }

    chatWidgetButton.addEventListener('click', () => {
        toggleChatWindow();
    });

    closeChatWindowButton.addEventListener('click', () => {
        toggleChatWindow();
    });

    function toggleChatWindow() {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            // Focus the input when the chat window is opened
            chatInput.focus();
            // Display a welcome message if the chat is empty
            if (chatMessages.children.length === 0) {
                appendMessage("¡Hola! Soy Aurelio, tu asistente virtual. ¿En qué puedo ayudarte?", 'bot');
            }
        }
    }

    chatSendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        appendMessage(message, 'user');
        chatInput.value = '';
        showTypingIndicator();

        const sessionId = getOrCreateSessionId();

        // Send message to n8n
        fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message, sessionId: sessionId })
        })
        .then(response => response.json())
        .then(data => {
            removeTypingIndicator();
            // The n8n workflow should return a JSON with a "response" key.
            // Example: { "response": "This is the bot's answer." }
            const botResponse = data.response || "Lo siento, no he podido procesar tu mensaje. Por favor, intenta de nuevo.";
            appendMessage(botResponse, 'bot');
        })
        .catch(error => {
            console.error('Error sending message to n8n:', error);
            removeTypingIndicator();
            appendMessage("Lo siento, ha ocurrido un error de conexión. Por favor, inténtalo más tarde.", 'bot');
        });
    }

    function createBubble(message, sender) {
        const bubble = document.createElement('div');
        bubble.classList.add('py-2', 'px-4', 'rounded-lg', 'inline-block', 'max-w-xs');

        const bubbleColor = sender === 'user' 
            ? ['bg-primary-blue', 'text-white'] 
            : ['bg-gray-200', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-white'];
        bubble.classList.add(...bubbleColor);

        bubble.innerHTML = message;

        const links = bubble.querySelectorAll('a');
        links.forEach(link => {
            link.classList.add('text-blue-500', 'underline');
        });

        return bubble;
    }

    function createTimestamp() {
        const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const timeElement = document.createElement('div');
        timeElement.classList.add('text-xs', 'text-gray-500', 'dark:text-gray-400', 'mt-1');
        timeElement.textContent = time;
        return timeElement;
    }

    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('mb-4', 'flex', 'flex-col', sender === 'user' ? 'items-end' : 'items-start');

        const bubble = createBubble(message, sender);
        const timestamp = createTimestamp();

        messageElement.appendChild(bubble);
        messageElement.appendChild(timestamp);

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.classList.add('mb-4');
        typingIndicator.innerHTML = `
            <div class="bg-gray-200 dark:bg-gray-700 rounded-lg py-2 px-4 inline-block">
                <div class="flex items-center space-x-1">
                    <span class="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                    <span class="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style="animation-delay: 0.2s;"></span>
                    <span class="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style="animation-delay: 0.4s;"></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
});