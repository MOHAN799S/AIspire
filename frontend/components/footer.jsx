import React from 'react'
import { ExternalLink, MessageSquare } from 'lucide-react'
import StarBackground from './StartBackground'



const Footer = () => {
  return (
    <footer className="relative bg-muted/50 py-10 border-t z-10">
      <StarBackground />
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          
          {/* Copyright Section */}
          <div className="space-y-2">
            <p className="text-md text-foreground">
              © {new Date().getFullYear()} — Designed & Developed by{' '}
              <a 
                href="https://your-portfolio-url.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 hover:underline"
                aria-label="Visit 404 Graduate portfolio"
              >
                404 Graduate
                <ExternalLink className="w-3 h-3" />
              </a>
              . All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Click on &quot;404 Graduate&quot; to visit the developer&apos;s portfolio
            </p>
          </div>

          {/* Feedback Link Section */}
          <div className="flex justify-center">
            <a 
              href="/feedback"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 rounded-lg transition-all duration-200 border border-primary/20 hover:border-primary/30 animate-gentle-bounce"
              aria-label="Submit feedback"
            >
              <MessageSquare className="w-4 h-4" />
              Submit Feedback
            </a>
          </div>
        </div>
      </div>

      {/* Custom CSS for beautiful bounce animation */}
      <style>{`
        @keyframes gentle-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(-5px);
          }
          75% {
            transform: translateY(-7px);
          }
        }
        
        .animate-gentle-bounce {
          animation: gentle-bounce 2s ease-in-out infinite !important;
          will-change: transform;
        }
        
        .animate-gentle-bounce:hover {
          animation-play-state: paused !important;
        }
      `}</style>
    </footer>
  )
}

export default Footer