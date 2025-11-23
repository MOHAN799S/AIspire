const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const axios = require('axios');
const feedbackRoutes = require('./routes/feedback');
const connectDB = require('./config/db'); 




const app = express();
const port = process.env.PORT || 4000; // fallback just in case
const client_url_port = 'http://localhost:3000'; // Adjusted for local network access
const client_url = process.env.CLIENT_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// CORS
app.use(
  cors({
    origin: client_url_port,
    methods: ['GET', 'POST','PATCH','DELETE'],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Connect to MongoDB BEFORE using routes & starting server
connectDB();

// Routes
app.use('/api/feedback', feedbackRoutes);

app.post('/api/industry-insights', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a data analyst that provides structured JSON responses. Always respond with valid JSON only, no additional text or formatting.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    const gptReply = response.data.choices[0].message.content;

    let parsedData;
    try {
      parsedData = JSON.parse(gptReply);
    } catch (parseError) {
      console.error('Failed to parse GPT response:', gptReply);
      return res.status(500).json({
        error: 'Failed to parse AI response',
        rawResponse: gptReply,
      });
    }

    res.json({
      reply: parsedData,
      success: true,
    });
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    res.status(500).json({
      error: 'Failed to fetch industry insights',
      details: error.message,
    });
  }
});

// POST /api/chat — send user message, get AI reply
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const systemContext = `
You are AIspire Assistant.
- Website: AIspire
- Developer: Mohan Alias 404 Graduate
- Portfolio: https://your-portfolio-url.com
- GitHub: https://github.com/MOHAN799S
- LinkedIn: https://www.linkedin.com/in/mohan-lakshman-sangidi-287322256/
- Contact Email: mohansangidi@gmail.com
- Location: India
- Role: Full Stack Developer & AI Enthusiast
- Experience: 1+ Years in Web Development & AI Integration
- Motto: "Code. Create. Inspire."
- Tagline: Empowering innovation through intelligent code.
- Tech Stack: JavaScript (React, Node.js, Express), Python (Flask, FastAPI), TypeScript, Next.js, TailwindCSS, MongoDB, PostgreSQL, TensorFlow, OpenAI API
- Services: Web App Development, AI Chatbot Integration, API Development, UI/UX Design, Automation Tools
- Socials:
   • Twitter: https://x.com/MohanSangidi
   • Instagram: https://www.instagram.com/_mr_.mohan7
- Mission: To build intelligent, user-focused digital experiences powered by AI and creativity.
- Vision: To inspire developers and creators to leverage technology for meaningful impact.

Answer in a friendly and concise manner.
Include developer information if asked.
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: systemContext },
          { role: 'user', content: message },
        ],
        max_tokens: 350,
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

    res.json({ reply: botReply });
  } catch (err) {
    console.error(err.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Hello World! AIspire Chatbot backend is running.');
});

app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
