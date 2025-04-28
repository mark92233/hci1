let chatPopup = document.getElementById('chat-popup');
let chatMessages = document.getElementById('chat-messages');
let chatInput = document.getElementById('chat-input');

// Open Chat Popup
function openChat(user = 'Support') {
  chatPopup.style.display = 'flex';
  chatMessages.innerHTML = `<div><strong>Chatting with:</strong> ${user}</div><hr>`;
}

// Close Chat Popup
function closeChat() {
  chatPopup.style.display = 'none';
}

// Send a Message
function sendMessage() {
  let message = chatInput.value.trim();
  if (message !== '') {
    let messageElement = document.createElement('div');
    messageElement.textContent = 'You: ' + message;
    chatMessages.appendChild(messageElement);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Open Chat from Navbar Chat Icon
document.querySelector('.chat-icon').addEventListener('click', () => {
  openChat('Support Team');
});

// Dummy function for Post Job
function openPostJob() {
  alert('Post Job form will appear here!');
}
