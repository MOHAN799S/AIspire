'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        // Faster progress at start, slower near end
        const increment = prev < 60 ? Math.random() * 15 : Math.random() * 5;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"
                animate={{
                  x: [0, -80, 0],
                  y: [0, -60, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center space-y-16">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="text-8xl font-bold tracking-tight text-white drop-shadow-lg">
                  AIspire
                </h1>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-[3px] bg-white/30 mx-auto mt-6 max-w-xs"
                />
              </motion.div>

              {/* Progress Container */}
              <div className="w-[500px] mx-auto space-y-8">
                {/* Percentage Display */}
                <div className="relative h-32 flex items-center justify-center">
                  <motion.div
                    className="text-8xl font-extralight text-white tabular-nums tracking-wider"
                    key={Math.floor(progress)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {String(Math.floor(progress)).padStart(2, '0')}
                    <span className="text-5xl text-white/50 ml-2">%</span>
                  </motion.div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-1 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-white rounded-full shadow-lg shadow-white/20"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>

                {/* Loading Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-white/70 text-sm font-light tracking-[0.3em] uppercase"
                >
                  Initializing
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - only render after loading */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}