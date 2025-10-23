'use client'
import { useEffect, useRef, useState } from 'react'

export function AdvancedCursor({ variant = 'gradient' }) {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const followerRef = useRef({ x: 0, y: 0 })
  const isPointerRef = useRef(false)
  const requestRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if mobile and handle resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const getCursorStyles = () => {
      const variants = {
        gradient: {
          dotBg: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)',
          ringColor: 'rgba(139, 92, 246, 0.8)',
          glow: '0 0 25px rgba(168, 85, 247, 1), 0 0 40px rgba(168, 85, 247, 0.5)',
        },
        neon: {
          dotBg: '#22d3ee',
          ringColor: '#22d3ee',
          glow: '0 0 20px rgba(34, 211, 238, 0.8)',
        },
        minimal: {
          dotBg: '#ffffff',
          ringColor: 'rgba(255, 255, 255, 0.5)',
          glow: '0 0 8px rgba(255, 255, 255, 0.3)',
        },
        gaming: {
          dotBg: 'linear-gradient(90deg, #4ade80 0%, #10b981 100%)',
          ringColor: '#4ade80',
          glow: '0 0 25px rgba(74, 222, 128, 0.7)',
        },
      }
      return variants[variant] || variants.gradient
    }

    const styles = getCursorStyles()
    dot.style.background = styles.dotBg
    dot.style.boxShadow = styles.glow

    const animate = () => {
      // Smooth follow animation
      followerRef.current.x += (positionRef.current.x - followerRef.current.x) * 0.15
      followerRef.current.y += (positionRef.current.y - followerRef.current.y) * 0.15

      // Dot size: normal (8px), slightly larger on hover (10px)
      const dotSize = isPointerRef.current ? 10 : 8
      const dotScale = 1

      // Update dot position (instant)
      dot.style.transform = `translate3d(${positionRef.current.x - dotSize / 2}px, ${positionRef.current.y - dotSize / 2}px, 0) scale(${dotScale})`
      dot.style.width = `${dotSize}px`
      dot.style.height = `${dotSize}px`

      // Ring size: normal (30px), slightly larger on hover (36px)
      const ringSize = isPointerRef.current ? 36 : 30
      ring.style.transform = `translate3d(${followerRef.current.x - ringSize / 2}px, ${followerRef.current.y - ringSize / 2}px, 0)`
      ring.style.width = `${ringSize}px`
      ring.style.height = `${ringSize}px`
      ring.style.borderColor = styles.ringColor
      ring.style.opacity = isPointerRef.current ? '0.7' : '0.4'

      requestRef.current = requestAnimationFrame(animate)
    }

    const updateCursor = (e) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseOver = (e) => {
      const isClickable = e.target.closest('a, button, input, textarea, select, [role="button"], [onclick], .cursor-pointer')
      isPointerRef.current = !!isClickable
      
      // Check if cursor is over Clerk modal or high z-index elements
      const isOverModal = e.target.closest('[role="dialog"], .cl-modal, .cl-modalContent, [data-clerk-modal], .cl-userButtonPopoverCard, .cl-card')
      setIsVisible(!isOverModal)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    // Use passive listeners for better performance
    document.addEventListener('mousemove', updateCursor, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', updateCursor)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [variant, isMobile])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] rounded-full will-change-transform transition-opacity duration-300"
        style={{
          width: '8px',
          height: '8px',
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.3s ease',
          opacity: isMobile ? 0 : 1,
          visibility: isMobile ? 'hidden' : 'visible',
        }}
      />
      
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] border-2 rounded-full will-change-transform transition-opacity duration-300"
        style={{
          width: '30px',
          height: '30px',
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.3s ease',
          opacity: isMobile ? 0 : 0.5,
          visibility: isMobile ? 'hidden' : 'visible',
        }}
      />

      <style jsx global>{`
        * {
          cursor: ${isMobile ? 'auto' : 'none'} !important;
        }
        
        body {
          cursor: ${isMobile ? 'auto' : 'none'} !important;
        }
        
        /* Show normal cursor on Clerk modals and dialogs */
        [role="dialog"],
        [role="dialog"] *,
        .cl-modal,
        .cl-modal *,
        .cl-modalContent,
        .cl-modalContent *,
        [data-clerk-modal],
        [data-clerk-modal] *,
        .cl-userButtonPopoverCard,
        .cl-userButtonPopoverCard *,
        .cl-card,
        .cl-card * {
          cursor: auto !important;
        }
      `}</style>
    </>
  )
}

export default AdvancedCursor