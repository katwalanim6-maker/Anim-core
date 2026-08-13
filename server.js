const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins.includes('*') ? true : allowedOrigins }));
app.use(express.json({ limit: '1mb' }));

function getAI() {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

app.get('/', (_req, res) => {
  res.json({ status: 'online', name: 'Anim Core', version: '2.0.0' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', aiConfigured: Boolean(process.env.GEMINI_API_KEY) });
});

app.post('/chat', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (message.length > 4000) {
    return res.status(413).json({ error: 'Message is too long.' });
  }

  const ai = getAI();
  if (!ai) {
    return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on Anim Core.' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are AI Anim, the assistant inside Anim OS. Be helpful, concise and honest.\n\nUser: ${message}`
    });

    const reply = response.text?.trim();
    if (!reply) {
      return res.status(502).json({ error: 'Gemini returned an empty response.' });
    }

    return res.json({ reply });
  } catch (error) {
    console.error('Gemini request failed:', error);
    return res.status(502).json({ error: 'Gemini request failed. Check the Render logs and API key.' });
  }
});

app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));

app.listen(PORT, () => {
  console.log(`Anim Core running on port ${PORT}`);
});
