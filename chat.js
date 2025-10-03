export function initChat() {
  const chatBubble = document.getElementById("chat-bubble");
  const chatWindow = document.getElementById("chat-window");
  const closeChatBtn = document.getElementById("close-chat-btn");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  if (!chatBubble || !chatWindow || !closeChatBtn || !chatMessages || !chatForm) {
    console.error("Chat elements not found!");
    return;
  }

  const webhookUrl = "https://n8n.srv1033442.hstgr.cloud/webhook/2fd095ea-f1a1-4202-acb9-ee74cc8104cb";
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  let isFirstOpen = true;

  function showTypingIndicator() {
    const indicatorElement = document.createElement("div");
    indicatorElement.id = "typing-indicator";
    indicatorElement.classList.add("flex", "items-end", "max-w-xs", "md:max-w-md", "animate-fade-in");

    const bubble = document.createElement("div");
    bubble.classList.add("px-4", "py-2", "rounded-xl", "bg-gray-200", "dark:bg-gray-700");

    const dots = document.createElement("div");
    dots.classList.add("flex", "items-center", "justify-center", "h-5");

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div");
      dot.classList.add("bouncing-dot", "w-2", "h-2", "bg-gray-500", "dark:bg-gray-400", "rounded-full", "mx-0.5");
      dots.appendChild(dot);
    }

    bubble.appendChild(dots);
    indicatorElement.appendChild(bubble);
    chatMessages.appendChild(indicatorElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById("typing-indicator");
    if (indicator) {
      indicator.remove();
    }
  }

  function addMessageToUI(message, sender = "bot") {
    const messageElement = document.createElement("div");
    const bubble = document.createElement("div");

    messageElement.classList.add("flex", "items-end", "max-w-xs", "md:max-w-md", "animate-fade-in");
    bubble.classList.add("px-4", "py-2", "rounded-xl");

    if (sender === "user") {
      messageElement.classList.add("self-end", "ml-auto");
      bubble.classList.add("bg-primary-blue", "text-white", "rounded-br-none");
    } else {
      messageElement.classList.add("self-start");
      bubble.classList.add("bg-gray-200", "dark:bg-gray-700", "text-gray-800", "dark:text-white", "rounded-bl-none");
    }

    bubble.innerText = message;
    messageElement.appendChild(bubble);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const userInput = chatInput.value.trim();

    if (userInput) {
      addMessageToUI(userInput, "user");
      chatInput.value = "";
      chatInput.disabled = true;
      showTypingIndicator();

      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userInput,
            sessionId: sessionId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const responseItem = Array.isArray(data) ? data[0] : data;
        const botReply =
          (responseItem && responseItem.responseText) ||
          "No he podido entender eso. Inténtalo de nuevo.";
        addMessageToUI(botReply, "bot");

      } catch (error) {
        console.error("Error sending message to bot:", error);
        addMessageToUI("Lo siento, ha ocurrido un error de conexión.", "bot");
      } finally {
        hideTypingIndicator();
        chatInput.disabled = false;
        chatInput.focus();
      }
    }
  }

  function toggleChatWindow() {
    const isHidden = chatWindow.classList.contains("hidden");

    if (isHidden) {
      chatWindow.classList.remove("hidden");
      setTimeout(() => {
        chatBubble.classList.add("opacity-0", "scale-0");
        chatWindow.classList.remove("opacity-0", "translate-y-4");
        chatWindow.classList.add("opacity-100", "translate-y-0");
        
        if (isFirstOpen) {
          addMessageToUI("Hola, soy NLAgencia bot");
          isFirstOpen = false;
        }

        setTimeout(() => chatInput.focus(), 300);
      }, 10);
    } else {
      chatBubble.classList.remove("opacity-0", "scale-0");
      chatWindow.classList.remove("opacity-100", "translate-y-0");
      chatWindow.classList.add("opacity-0", "translate-y-4");
      setTimeout(() => {
        chatWindow.classList.add("hidden");
      }, 300);
    }
  }

  chatBubble.addEventListener("click", toggleChatWindow);
  closeChatBtn.addEventListener("click", toggleChatWindow);
  chatForm.addEventListener("submit", handleFormSubmit);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !chatWindow.classList.contains("hidden")) {
      toggleChatWindow();
    }
  });
}
