# AI Chatbox

A clean, Claude-style chatbox interface powered by the Arioron AI API.

## Setup Instructions

### 1. Install Dependencies
```bash
cd chatbox
npm install
```

### 2. Configure API Key
Open `server.js` and replace `YOUR_API_KEY` with your actual Arioron API key:
```javascript
const API_KEY = 'your_actual_api_key_here';
```

### 3. Run the Server
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

### 4. Open in Browser
Navigate to: `http://localhost:3000`

## Features
- Clean, responsive chat interface
- Real-time messaging
- Typing indicator
- Auto-expanding text input
- Smooth animations
- Mobile-friendly design

## File Structure
```
chatbox/
├── index.html      # Main HTML file
├── style.css       # Styling
├── script.js       # Client-side JavaScript
├── server.js       # Node.js server
├── package.json    # Dependencies
└── README.md       # This file
```

## API Configuration
The chatbox uses the Arioron AI API with the `perceptix-vex-amber` model. You can modify the model in `server.js` if needed.

## Troubleshooting
- If you get connection errors, check your API key
- Make sure port 3000 is available
- Check the console for detailed error messages
