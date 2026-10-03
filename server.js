const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.MODEL || 'claude-sonnet-5-5';
const SYSTEM = 'You are a friendly, concise personal assistant. Help with planning, writing, ideas, coding and everyday questions. Keep answers short unless asked for detail.';

app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname)));

// Simple offline fallback so the app works without an API key
function localReply(text) {
  const t = text.toLowerCase();
  if (/\b(time|clock)\b/.test(t)) return 'It is ' + new Date().toLocaleTimeString() + ' on the server.';
  if (/\b(date|today|day)\b/.test(t)) return 'Today is ' + new Date().toDateString() + '.';
  if (/\b(hi|hello|hey)\b/.test(t)) return 'Hello! How can I help you today?';
  if (/\bjoke\b/.test(t)) return 'Why do programmers prefer dark mode? Because light attracts bugs.';
  return 'I am running in offline mode. Set ANTHROPIC_API_KEY on the server to get full AI answers.';
}

app.post('/api/chat', async (req, res) => {
  const messages = (req.body.messages || [])
    .filter(m => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string' && m.content.trim())
    .slice(-20);
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Send at least one user message.' });
  }
  if (!API_KEY) return res.json({ reply: localReply(messages[messages.length - 1].content) });

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 1000, system: SYSTEM, messages })
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data.error?.message || 'AI service error.' });
    res.json({ reply: data.content.filter(b => b.type === 'text').map(b => b.text).join('\n') });
  } catch (e) {
    res.status(500).json({ error: 'Could not reach the AI service.' });
  }
});


app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));



app.listen(PORT, () => console.log('Assistant running at http://localhost:' + PORT));
