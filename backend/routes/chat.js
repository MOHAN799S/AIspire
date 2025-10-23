const express = require('express');
const axios = require('axios');
const ChatMessage = require('../models/ChatMessage');

const router = express.Router();

// POST /api/chat — send user message, get AI response
router.post('/chat', async (req, res) => {
  const { message, userId, sessionId } = req.body;

  try {
    // Save user message
    await ChatMessage.create({
      userId: userId || null,
      sessionId,
      sender: 'user',
      text: message,
    });

    // System context for AI
    const systemContext = `
You are AIspire Assistant.
- Website: AIspire
- Developer: Mohan Lakshman S
- Portfolio: https://your-portfolio-url.com
Answer friendly and concise, include developer info if asked.
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemContext },
          { role: 'user', content: message },
        ],
        max_tokens: 800,
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = response.data.choices[0].message.content.trim();

    // Save bot response
    await ChatMessage.create({
      userId: userId || null,
      sessionId,
      sender: 'bot',
      text: botReply,
    });

    res.json({ reply: botReply });
  } catch (err) {
    console.error(err.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// GET /api/chat/history?sessionId=... or &userId=...
router.get('/history', async (req, res) => {
  const { sessionId, userId } = req.query;

  try {
    const query = userId ? { userId } : { sessionId };
    const messages = await ChatMessage.find(query).sort({ createdAt: 1 }).lean();
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load chat history' });
  }
});

module.exports = router;
