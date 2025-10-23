const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  userId: { type: String, required: false }, // Clerk user ID or null for guest
  sessionId: { type: String, required: true }, // frontend sessionId
  sender: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models?.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);
