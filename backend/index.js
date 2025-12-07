// ============================================
// index.js - Main Server File
// ============================================
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const axios = require('axios');
const cookieParser = require('cookie-parser');

// Import routes and middleware
const feedbackRoutes = require('./routes/feedback');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const connectDB = require('./config/db');

const app = express();

// ============================================
// Configuration
// ============================================
const PORT = process.env.PORT || 4000;
const CLIENT_URL =  'http://localhost:3000';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// ============================================
// Middleware
// ============================================

// CORS - IMPORTANT: credentials must be true for cookies
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true, // Essential for cookies to work
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser - for reading httpOnly cookies
app.use(cookieParser());

// Request logging middleware (optional but helpful)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============================================
// Database Connection
// ============================================
connectDB();

// ============================================
// Routes
// ============================================

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'AIspire Backend API',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      feedback: '/api/feedback',
      chat: '/api/chat',
      insights: '/api/industry-insights',
    },
  });
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Profile route (protected)
app.get('/api/profile', authMiddleware, (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Feedback routes
app.use('/api/feedback', feedbackRoutes);

// ============================================
// AI Chat Routes
// ============================================

// Industry Insights - AI-powered structured responses
app.post('/api/industry-insights', async (req, res) => {
  try {
    const { message } = req.body;

    // Validation
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Call OpenAI API
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o-mini',
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
        timeout: 30000, // 30 seconds
      }
    );

    const gptReply = response.data.choices[0].message.content;

    // Parse JSON response
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
    console.error('OpenAI API Error:', error.response?.data || error.message);

    // Handle specific errors
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: 'Request timeout. Please try again.' });
    }

    res.status(500).json({
      error: 'Failed to fetch industry insights',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Chat - General AI conversation
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Validation
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const systemContext = `
You are AIspire Assistant, a helpful and knowledgeable AI assistant.

Your capabilities:
- Answer questions about various topics
- Provide industry insights and analysis
- Help with general information and guidance
- Offer friendly and professional assistance

Guidelines:
- Be concise but informative
- Use a friendly and professional tone
- Provide accurate information
- If you don't know something, say so
- Include developer information if asked

Developer: Created by AIspire Team
Purpose: To assist users with intelligent insights and support
`;

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemContext },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const botReply = response.data.choices[0].message.content.trim();

    res.json({
      reply: botReply,
      success: true,
    });
  } catch (error) {
    console.error('Chat API Error:', error.response?.data || error.message);

    // Handle specific errors
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: 'Request timeout. Please try again.' });
    }

    res.status(500).json({
      error: 'Failed to get AI response',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ============================================
// Error Handling Middleware
// ============================================

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      error: 'Duplicate entry',
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Default error
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 AIspire Backend Server');
  console.log('=================================');
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Client URL: ${CLIENT_URL}`);
  console.log(`✓ OpenAI API: ${OPENAI_API_KEY ? 'Configured' : '❌ Not configured'}`);
  console.log('=================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});


// ============================================
// .env Configuration
// ============================================
/*
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:3000

# MongoDB
MONGO_URI=mongodb://localhost:27017/aispire

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-use-long-random-string
JWT_EXPIRES_IN=1d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here
*/