import React from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import StarBackground from './StartBackground'

const Footer = () => {
  return (
    <footer className="relative bg-muted/50 py-10 border-t z-10">
      <StarBackground />
      <div className="container mx-auto px-4">
        <div className="text-center space-y-2">
          <p className="text-md text-foreground">
            © {new Date().getFullYear()} — Designed & Developed by{' '}
            <Link 
              href="https://your-portfolio-url.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 hover:underline"
              aria-label="Visit 404 Graduate portfolio"
            >
              404 Graduate
              <ExternalLink className="w-3 h-3" />
            </Link>
            . All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
 Click on &quot;404 Graduate&quot; to visit the developer&apos;s portfolio

          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer