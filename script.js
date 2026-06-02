const elements = {
  chatMessages: document.getElementById('chat-messages'),
  chatForm: document.getElementById('chat-form'),
  userInput: document.getElementById('user-input'),
  sendButton: document.getElementById('send-button'),
  photoButton: document.getElementById('photo-button'),
  photoInput: document.getElementById('photo-input'),
  suggestionButtons: document.querySelectorAll('.suggestion-button'),
};

const CHAT_ROLE = {
  user: 'user',
  bot: 'bot',
};

const jokes = [
  'Why did the computer show up at work late? It had a hard drive.',
  'I would tell you a UDP joke, but you might not get it.',
  'Why don’t programmers like nature? Too many bugs.',
];

const funFacts = [
  'Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.',
  'A group of flamingos is called a "flamboyance."',
  'Octopuses have three hearts and blue blood.',
];

const botResponses = Object.freeze({
  hello: 'Hello! How can I help you today?',
  help: 'I can answer questions, tell jokes, share fun facts, and chat with you. Ask me anything.',
  thanks: 'You are welcome! Feel free to ask another question.',
  goodbye: 'Goodbye! Come back anytime for more chat.',
  name: 'My name is O-block AI. I’m here to help you with quick replies.',
  from: 'I am a virtual assistant living in this browser chat window.',
});

const photoResponses = [
  'That’s a nice photo! 📸',
  'Great shot! I like it.',
  'Wow, what a beautiful image!',
  'Thanks for sharing! That looks great.',
  'Amazing picture! You have a good eye for photography.',
  'Beautiful composition! 🎨',
  'I love this photo!',
];

const helpers = {
  randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  },
  formatTime() {
    return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  },
  formatDate() {
    return new Date().toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },
  evaluateMath(expression) {
    const match = expression.match(/(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)/);
    if (!match) return null;

    const left = parseFloat(match[1]);
    const operator = match[2];
    const right = parseFloat(match[3]);

    if (operator === '/' && right === 0) {
      return 'Division by zero is not allowed.';
    }

    const result = {
      '+': left + right,
      '-': left - right,
      '*': left * right,
      '/': left / right,
    }[operator];

    return `The answer is ${result}.`;
  },
};

function createMetaLabel(sender) {
  const meta = document.createElement('div');
  meta.className = 'message-meta';
  meta.textContent = `${sender === CHAT_ROLE.user ? 'You' : 'O-block AI'} · ${helpers.formatTime()}`;
  return meta;
}

function createBubble(content, isImage = false) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  if (isImage) {
    const image = document.createElement('img');
    image.className = 'chat-image';
    image.src = content;
    image.alt = 'Shared photo';
    bubble.appendChild(image);
  } else {
    bubble.textContent = content;
  }

  return bubble;
}

function appendMessage(content, sender, options = {}) {
  const messageEl = document.createElement('div');
  messageEl.className = `message ${sender}`;

  if (!options.noMeta) {
    messageEl.appendChild(createMetaLabel(sender));
  }

  messageEl.appendChild(createBubble(content, options.isImage));
  elements.chatMessages.appendChild(messageEl);
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function getBotReply(rawText) {
  const text = rawText.trim().toLowerCase();
  if (!text) return 'Please type a message so I can respond.';

  const replyRules = [
    { pattern: /^(hi|hello|hey|good morning|good afternoon|good evening)\b/, reply: botResponses.hello },
    { pattern: /thank(s| you)|thx/, reply: botResponses.thanks },
    { pattern: /goodbye|bye|see you|later|peace/, reply: botResponses.goodbye },
    { pattern: /what is your name|who are you|your name/, reply: botResponses.name },
    { pattern: /how are you|how are you doing/, reply: 'I’m doing great, thanks! How can I help you today?' },
    { pattern: /what can you do|what are you capable|can you help|what do you do/, reply: botResponses.help },
    { pattern: /weather|temperature|forecast/, reply: 'I don’t have live weather updates yet, but I can still answer questions and chat with you.' },
    { pattern: /where are you from|from where|where do you come from/, reply: botResponses.from },
    { pattern: /who made you|created you|built you/, reply: 'I was built with HTML, CSS, and JavaScript so I can chat with you right here.' },
  ];

  for (const rule of replyRules) {
    if (rule.pattern.test(text)) {
      return rule.reply;
    }
  }

  if (/tell me a joke|make me laugh|joke/.test(text)) {
    return helpers.randomItem(jokes);
  }

  if (/fun fact|give me a fun fact|tell me a fact|fact/.test(text)) {
    return helpers.randomItem(funFacts);
  }

  if (/what time|current time|time is it/.test(text)) {
    return `The current time is ${helpers.formatTime()}.`;
  }

  if (/what(?:'s| is) the date|today.*date|what day|day is it/.test(text)) {
    return `Today is ${helpers.formatDate()}.`;
  }

  const mathReply = helpers.evaluateMath(text);
  if (mathReply) {
    return mathReply;
  }

  return 'I’m still learning. Could you ask that in a different way or try a new question?';
}

function updateButtonState() {
  elements.sendButton.disabled = elements.userInput.value.trim().length === 0;
}

function applySuggestion(text) {
  elements.userInput.value = text;
  updateButtonState();
  elements.userInput.focus();
}

function sendMessage() {
  const userText = elements.userInput.value.trim();
  if (!userText) return;

  appendMessage(userText, CHAT_ROLE.user);
  elements.userInput.value = '';
  updateButtonState();
  elements.userInput.focus();

  setTimeout(() => {
    appendMessage(getBotReply(userText), CHAT_ROLE.bot);
  }, 300);
}

function handlePhotoUpload(file) {
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    appendMessage(event.target.result, CHAT_ROLE.user, { isImage: true });
    setTimeout(() => {
      appendMessage(helpers.randomItem(photoResponses), CHAT_ROLE.bot);
    }, 500);
  };
  reader.readAsDataURL(file);
}

function registerEventListeners() {
  elements.chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage();
  });

  elements.userInput.addEventListener('input', updateButtonState);

  elements.photoButton.addEventListener('click', () => elements.photoInput.click());

  elements.photoInput.addEventListener('change', (event) => {
    handlePhotoUpload(event.target.files[0]);
    event.target.value = '';
  });

  elements.suggestionButtons.forEach((button) => {
    button.addEventListener('click', () => applySuggestion(button.textContent));
  });
}

function startChat() {
  appendMessage('Welcome! Ask me anything or say hello. Try the suggestions above if you want ideas.', CHAT_ROLE.bot);
  updateButtonState();
  elements.userInput.focus();
}

window.addEventListener('DOMContentLoaded', () => {
  registerEventListeners();
  startChat();
});
