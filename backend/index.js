const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const client_url = process.env.CLIENT_URL;

app.use(cors({
  origin: client_url,
  methods: ['GET','POST'],
  credentials: true
}));

app.use(express.json());

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
- Experience: 4+ Years in Web Development & AI Integration
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
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemContext },
          { role: 'user', content: message },
        ],
        max_tokens: 400,
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
