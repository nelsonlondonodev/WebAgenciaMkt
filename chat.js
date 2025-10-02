export function initChat() {
  const chatBubble = document.getElementById("chat-bubble");
  const chatWindow = document.getElementById("chat-window");
  const closeChatBtn = document.getElementById("close-chat-btn");
  const chatInput = document.getElementById("chat-input");

  if (!chatBubble || !chatWindow || !closeChatBtn) {
    console.error("Chat elements not found!");
    return;
  }

  function toggleChatWindow() {
    const isHidden = chatWindow.classList.contains("hidden");

    if (isHidden) {
      chatWindow.classList.remove("hidden");
      setTimeout(() => {
        chatBubble.classList.add("opacity-0", "scale-0");
        chatWindow.classList.remove("opacity-0", "translate-y-4");
        chatWindow.classList.add("opacity-100", "translate-y-0");
        setTimeout(() => chatInput.focus(), 300); // Focus input after transition
      }, 10);
    } else {
      chatBubble.classList.remove("opacity-0", "scale-0");
      chatWindow.classList.remove("opacity-100", "translate-y-0");
      chatWindow.classList.add("opacity-0", "translate-y-4");
      setTimeout(() => {
        chatWindow.classList.add("hidden");
      }, 300); // Corresponds to duration-300
    }
  }

  chatBubble.addEventListener("click", toggleChatWindow);
  closeChatBtn.addEventListener("click", toggleChatWindow);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !chatWindow.classList.contains("hidden")) {
      toggleChatWindow();
    }
  });
}