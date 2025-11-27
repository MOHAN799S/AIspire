"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MessageCircle, X, Send, Sparkles, Bot, User, Trash2, AlertCircle, Check, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";

// Format timestamp to human-readable format
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return "Just now";
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000);
    return `${mins}m ago`;
  }
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }
  
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  }
  
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Format date separator
function formatDateSeparator(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) return "Today";
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
  
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

// Check if two timestamps are on different days
function isDifferentDay(timestamp1, timestamp2) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  return date1.toDateString() !== date2.toDateString();
}

// Status component
function MessageStatus({ status }) {
  if (status === 'sending') {
    return (
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="flex items-center gap-0.5"
      >
        <Check size={14} className="text-gray-500" />
      </motion.div>
    );
  }
  
  if (status === 'sent') {
    return <Check size={14} className="text-gray-400" />;
  }
  
  if (status === 'delivered') {
    return <CheckCheck size={14} className="text-gray-400" />;
  }
  
  if (status === 'read') {
    return <CheckCheck size={14} className="text-blue-500" />;
  }
  
  if (status === 'failed') {
    return <AlertCircle size={14} className="text-red-500" />;
  }
  
  return null;
}

export default function Chatbot() {
  const { user, isSignedIn, isLoaded } = useUser();
  const userId = isSignedIn ? user?.id : null;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const scrollRef = useRef(null);

  // Load chat history from local storage only
  useEffect(() => {
    if (!isLoaded) return;

    const local = localStorage.getItem("aispire-chat-local");
    if (local) {
      try {
        setMessages(JSON.parse(local));
      } catch (err) {
        console.error("Failed to parse local messages:", err);
      }
    }
  }, [isLoaded]);

  // Save messages to local storage
  useEffect(() => {
    if (messages.length) {
      try {
        localStorage.setItem("aispire-chat-local", JSON.stringify(messages));
      } catch (err) {
        console.error("Failed to save messages locally:", err);
      }
      
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ 
            top: scrollRef.current.scrollHeight, 
            behavior: "smooth" 
          });
        }
      }, 100);
    }
  }, [messages]);

  // Simulate message status updates
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.sender !== 'user') return;

    if (lastMessage.status === 'sending') {
      const timer = setTimeout(() => {
        setMessages(prev => prev.map((msg, idx) => 
          idx === prev.length - 1 ? { ...msg, status: 'sent' } : msg
        ));
      }, 500);
      return () => clearTimeout(timer);
    }

    if (lastMessage.status === 'sent') {
      const timer = setTimeout(() => {
        setMessages(prev => prev.map((msg, idx) => 
          idx === prev.length - 1 ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const toggleChat = () => {
    if (!isOpen && !isSignedIn && isLoaded) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
    }
    setIsOpen(!isOpen);
    
    // Mark all messages as read when opening chat
    if (!isOpen) {
      setMessages(prev => prev.map(msg => 
        msg.sender === 'user' ? { ...msg, status: 'read' } : msg
      ));
    }
  };
  
  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear all messages?")) {
      setMessages([]);
      localStorage.removeItem("aispire-chat-local");
    }
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    
    if (!isSignedIn) {
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "⚠️ Please sign in to use the chat feature.",
        timestamp: Date.now()
      }]);
      return;
    }

    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMsg = { 
      sender: "user", 
      text: userMessage,
      timestamp: Date.now(),
      status: 'sending'
    };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/chat`,
        {
          message: userMessage,
          userId: userId
        },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const botText = res.data?.reply || "Sorry, I couldn't get a response.";
      
      // Update user message to 'read' status
      setMessages(prev => prev.map((msg, idx) => 
        idx === prev.length - 1 ? { ...msg, status: 'read' } : msg
      ));
      
      // Add bot response
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: botText,
        timestamp: Date.now()
      }]);
    } catch (err) {
      console.error("Chat error:", err);
      
      // Update message status to failed
      setMessages(prev => prev.map((msg, idx) => 
        idx === prev.length - 1 ? { ...msg, status: 'failed' } : msg
      ));
      
      let errorMessage = "⚠️ Something went wrong. Please try again.";
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "⚠️ Request timeout. Please check your connection and try again.";
      } else if (err.response) {
        errorMessage = `⚠️ Server error: ${err.response.status}. Please try again later.`;
      } else if (err.request) {
        errorMessage = "⚠️ Network error. Please check your internet connection.";
      }
      
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: errorMessage,
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Login Prompt Toast */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 max-w-sm z-100"
          >
            <div className="rounded-2xl p-4 shadow-2xl flex items-start gap-3 bg-gray-800 border border-gray-700">
              <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-sm text-white">
                  Please Sign In
                </p>
                <p className="text-xs mt-1 text-gray-400">
                  You need to be signed in to use the chat feature.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button with Tooltip */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Tooltip */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:flex absolute bottom-0 right-20 mb-2 px-4 py-2 rounded-xl shadow-lg whitespace-nowrap bg-white/10 backdrop-blur-md border border-white/20"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                <span className="text-sm font-medium text-white">
                AIspire Assistant -&gt;
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Chat Button */}
        <motion.button
          whileHover={{ scale: 1.08, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChat} 
          className="p-4 rounded-2xl shadow-2xl transition-all duration-300 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600"
          aria-label="Open chat"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
          </motion.div>
          
          {!isOpen && isSignedIn && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-[92vw] sm:w-96 md:w-[420px] rounded-3xl shadow-2xl z-50 backdrop-blur-xl flex flex-col overflow-hidden bg-gray-900/95 border border-gray-700/50"
            style={{ height: "600px", maxHeight: "80vh" }}
          >
            {/* Header */}
            <div className="relative p-4 bg-gradient-to-r bg-black/40 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="relative"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    {isSignedIn && (
                      <motion.div
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}
                  </motion.div>
                  
                  <div>
                    <div className="font-bold text-base text-white">
                      AIspire Assistant
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {isSignedIn ? (
                        <>
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          Always here to help
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-amber-400 rounded-full" />
                          Please sign in
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSignedIn && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={clearChat}
                      className="p-2 rounded-xl transition-colors bg-gray-800 hover:bg-red-900/50"
                      aria-label="Clear chat"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleChat}
                    className="p-2 rounded-xl transition-colors bg-gray-800 hover:bg-gray-700"
                    aria-label="Close chat"
                  >
                    <X size={18} className="text-gray-300" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50"
            >
              {!isSignedIn ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <AlertCircle size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">
                    Sign In Required
                  </h3>
                  <p className="text-sm text-gray-400 max-w-xs mx-auto">
                    Please sign in to start chatting with AIspire Assistant.
                  </p>
                </motion.div>
              ) : messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">
                    Welcome to AIspire
                  </h3>
                  <p className="text-sm text-gray-400 max-w-xs mx-auto">
                    Ask me anything about AIspire, its features, or the developer. I&apos;m here to help!
                  </p>
                </motion.div>
              ) : null}

              {messages.map((m, idx) => (
                <div key={idx}>
                  {/* Date Separator */}
                  {(idx === 0 || isDifferentDay(messages[idx - 1].timestamp, m.timestamp)) && (
                    <div className="flex items-center justify-center my-6">
                      <div className="px-4 py-1.5 rounded-full text-xs font-medium bg-gray-800/80 text-gray-400 border border-gray-700/50">
                        {formatDateSeparator(m.timestamp)}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className={`flex items-end gap-2 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      {m.sender === "bot" ? (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
                          <Bot size={16} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center flex-shrink-0 shadow-md">
                          <User size={16} className="text-white" />
                        </div>
                      )}

                      <div
                        className={`px-4 py-3 rounded-2xl max-w-[75%] text-sm shadow-md break-words ${
                          m.sender === "user"
                            ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                            : "bg-gray-800 text-gray-100"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                    
                    {/* Timestamp and Status */}
                    <div className={`flex items-center gap-1.5 mt-1 px-2 ${
                      m.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(m.timestamp)}
                      </span>
                      {m.sender === "user" && m.status && (
                        <MessageStatus status={m.status} />
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-gray-800 shadow-md">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-gray-600"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t flex-shrink-0 bg-gray-900/80 border-gray-700/50">
              <form onSubmit={sendMessage} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isSignedIn ? "Ask me anything..." : "Please sign in to chat"}
                  disabled={!isSignedIn}
                  className="flex-1 px-4 py-3 rounded-2xl text-sm transition-all focus:outline-none focus:ring-2 bg-gray-800 text-white placeholder-gray-500 focus:ring-purple-500/50 disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: isSignedIn && input.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: isSignedIn && input.trim() ? 0.95 : 1 }}
                  type="submit"
                  disabled={!isSignedIn || !input.trim()}
                  className={`p-3 rounded-2xl transition-all shadow-lg ${
                    isSignedIn && input.trim()
                      ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white cursor-pointer"
                      : "bg-gray-800 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <Send size={20} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}