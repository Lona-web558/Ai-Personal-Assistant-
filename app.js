const chat = document.getElementById('chat');
const form = document.getElementById('chatForm');
const input = document.getElementById('msg');
const sendBtn = document.getElementById('sendBtn');
const chips = document.getElementById('chips');

let history = JSON.parse(sessionStorage.getItem('history') || '[]');

function add(role, text, extra = '') {
  const el = document.createElement('div');
  el.className = `bubble ${role} ${extra}`.trim();
  el.textContent = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
  return el;
}

function greet() {
  add('bot', 'Hi! I am your personal assistant. What can I help you with?');
}

function render() {
  chat.innerHTML = '';
  if (!history.length) return greet();
  history.forEach(m => add(m.role === 'user' ? 'user' : 'bot', m.content));
}

async function send(text) {
  chips.classList.add('d-none');
  history.push({ role: 'user', content: text });
  add('user', text);
  const typing = add('bot', 'Thinking...', 'typing');
  sendBtn.disabled = true;
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    typing.remove();
    history.push({ role: 'assistant', content: data.reply });
    add('bot', data.reply);
  } catch (err) {
    typing.remove();
    history.pop();
    add('bot', err.message + ' Please try again.', 'error');
  } finally {
    sessionStorage.setItem('history', JSON.stringify(history));
    sendBtn.disabled = false;
    input.focus();
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  send(text);
});

chips.addEventListener('click', e => {
  if (e.target.classList.contains('chip')) send(e.target.textContent);
});

document.getElementById('clearBtn').addEventListener('click', () => {
  history = [];
  sessionStorage.removeItem('history');
  chips.classList.remove('d-none');
  render();
});

render();
