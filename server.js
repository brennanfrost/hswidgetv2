// Optional backend proxy — keeps your Anthropic API key off the client.
// Usage: node server.js  (requires ANTHROPIC_API_KEY in .env)

import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { readFileSync } from 'fs';

// Load .env manually (no extra package needed on Node 20+)
try {
  const env = readFileSync('.env', 'utf8');
  env.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  });
} catch {}

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static('public'));

app.post('/api/analyze', async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Proxy error' });
  }
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
