# 🎄 High-Strung Christmas Lights — Roofline Preview Tool

A web tool that lets homeowners upload a photo of their house and see animated Christmas lights drawn along the roofline, powered by Claude Vision AI.

Built for **[High-Strung Christmas Lights](https://highstrunglights.com)** — professional holiday light installation serving the Wasatch Front (Salt Lake City area) and Greater Seattle.

---

## How It Works

1. Customer uploads a front-facing photo of their home
2. Image is sent to the Anthropic Claude API (Vision)
3. Claude identifies every roofline edge and returns coordinates as JSON
4. Animated twinkling bulbs are rendered on a canvas overlay

**Features:**
- Detects all roof sections — main roof, garage, dormers, porch
- 6 light color options: warm white, cool white, multicolor, red, blue, green
- 3 density settings: sparse, medium, dense
- Animated twinkling with realistic glow and wire drops
- Mobile-friendly layout
- Links directly to the Jobber free-quote form

---

## Setup

### Prerequisites
- An [Anthropic API key](https://console.anthropic.com/)
- A web host (Netlify, Vercel, GitHub Pages, etc.)

### Local development

```bash
git clone https://github.com/YOUR_USERNAME/christmas-lights-preview.git
cd christmas-lights-preview
npx serve public
# open http://localhost:3000
```

> **Note:** Running locally via the Claude.ai environment uses built-in API auth. For standalone hosting, add the backend proxy below.

---

## Production Deployment (API Key Proxy)

Never expose your API key in client-side code. Use a lightweight proxy:

**Install:**
```bash
npm install express node-fetch cors dotenv
```

**`server.js`:**
```javascript
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static('public'));

app.post('/api/analyze', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3000);
```

**`.env`:**
```
ANTHROPIC_API_KEY=sk-ant-...
```

Then in `public/index.html`, change the fetch URL:
```javascript
// Before:
const response = await fetch('https://api.anthropic.com/v1/messages', { ... });

// After (no Authorization header needed):
const response = await fetch('/api/analyze', { ... });
```

---

## Customization

| What | Where in `public/index.html` |
|---|---|
| Quote form URL | `href` on `.header-cta` and `.btn-cta` |
| Service area text | Hero `<p>` and CTA banner `<p>` |
| Default light color | `selectedColor` variable |
| Bulb size | `bulbR` variable |
| Light color palettes | `LIGHT_COLORS` object |

---

## Deployment Options

### Netlify (recommended)
- Drag `public/` folder into Netlify dashboard, or connect this repo and set publish directory to `public`
- Add a Netlify Function for the API proxy

### GitHub Pages
```bash
git subtree push --prefix public origin gh-pages
```
Pair with a proxy on Railway, Render, or Vercel for API calls.

---

## Tech Stack

- Vanilla HTML/CSS/JS — zero dependencies
- [Anthropic Claude API](https://docs.anthropic.com/) for roofline detection
- HTML5 Canvas for light rendering and animation

---

## License

MIT
