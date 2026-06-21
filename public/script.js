const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const submitButton = form.querySelector('button');

// Store conversation history for API requests
let conversationHistory = [];

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Disable submit button to prevent multiple submissions
  submitButton.disabled = true;

  try {
    // Add user message to UI and history
    addMessageToUI('user', userMessage);
    conversationHistory.push({ role: 'user', text: userMessage });

    // Show thinking placeholder with temporary ID for later replacement
    const thinkingElementId = `thinking-${Date.now()}`;
    addMessageToUI('bot', 'Sedang berpikir...', thinkingElementId);

    // Clear input field
    input.value = '';

    // Build request payload with conversation history
    const requestPayload = {
      conversation: conversationHistory,
    };

    // Send POST request to backend API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Parse response JSON
    const data = await response.json();

    // Validate that result exists
    if (!data.result) {
      throw new Error('No result received from server');
    }

    // Replace thinking message with actual AI response
    const thinkingElement = document.getElementById(thinkingElementId);
    if (thinkingElement) {
      thinkingElement.textContent = data.result;
    }

    // Add AI response to conversation history
    conversationHistory.push({ role: 'model', text: data.result });
  } catch (error) {
    // Show error message in UI
    const thinkingElement = document.querySelector('.message.bot:last-child');
    const errorMessage = error.message.includes('Failed to fetch')
      ? 'Gagal terhubung ke server. Silakan periksa koneksi Anda.'
      : `Gagal mendapatkan respons dari server: ${error.message}`;

    if (thinkingElement && thinkingElement.textContent === 'Thinking...') {
      thinkingElement.textContent = errorMessage;
    } else {
      addMessageToUI('bot', errorMessage);
    }

    console.error('Chat error:', error);
  } finally {
    // Re-enable submit button
    submitButton.disabled = false;
    input.focus();
  }
});

/**
 * Add a message to the UI chat box
 * @param {string} sender - 'user' or 'bot'
 * @param {string} text - Message text
 * @param {string} [id] - Optional element ID
 */
function addMessageToUI(sender, text, id = '') {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.textContent = text;

  if (id) {
    messageElement.id = id;
  }

  chatBox.appendChild(messageElement);

  // Auto-scroll to latest message
  chatBox.scrollTop = chatBox.scrollHeight;
}
