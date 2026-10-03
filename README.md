# Ai-Personal-Assistant-


# My AI Assistant

A personal AI chatbot built with HTML5, CSS3, Bootstrap 5, JavaScript, Node.js and Express.js. The server forwards chats to the Claude API, so your API key stays off the browser.

## Project structure

```
ai-assistant/
├── server.js        Express server and /api/chat endpoint
├── package.json
├── README.md
└── public/
    ├── index.html   Bootstrap layout
    ├── style.css    Styling
    └── app.js       Chat logic
```

## Requirements

- Node.js 18 or later
- An Anthropic API key (optional, see Offline mode)

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Set your API key.

   macOS / Linux:
   ```
   export ANTHROPIC_API_KEY=your_key_here
   ```
   Windows (Command Prompt):
   ```
   set ANTHROPIC_API_KEY=your_key_here
   ```
   Windows (PowerShell):
   ```
   $env:ANTHROPIC_API_KEY="your_key_here"
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open http://localhost:3000 in your browser.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | none | Enables full AI answers |
| `MODEL` | `claude-sonnet-5-5` | Claude model to use |
| `PORT` | `3000` | Server port |

## Offline mode

Without an API key, the assistant answers a few simple things (time, date, greeting, joke) so you can test the interface.

## How it works

1. The browser sends the conversation to `POST /api/chat`.
2. The server adds a system prompt and calls the Claude API.
3. The reply is returned to the browser and shown in the chat.

Chat history is kept in `sessionStorage`. The "New chat" button clears it.

## Deploying (Render)

1. Push the project to GitHub.
2. Create a new Web Service on Render and connect the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Add `ANTHROPIC_API_KEY` under Environment.

## Troubleshooting

- **Cannot GET /**: `index.html` must be inside the `public` folder, and `server.js` must use `express.static(path.join(__dirname, 'public'))`.
- **Chat shows an error**: check that the server is running and the API key is set correctly.
- **Page loads but chat does nothing**: open the app at http://localhost:3000, not by double-clicking `index.html`.

## Ideas for next steps

- Streaming replies
- Markdown rendering
- Saving chats to a database
