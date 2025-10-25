'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function StarBackground() {
  const canvasRef = useRef(null)
  const waveCanvasRef = useRef(null)
  const scrollY = useRef(0)
  const mousePos = useRef({ x: 0, y: 0 })
  const prevMousePos = useRef({ x: 0, y: 0 })
  const particles = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const waveCanvas = waveCanvasRef.current
    if (!canvas || !waveCanvas) return

    // ===== THREE.JS STAR SETUP =====
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })

    const setSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      
      waveCanvas.width = width
      waveCanvas.height = height
    }
    setSize()

    camera.position.z = 1

    // 🌌 Create stars
    const starCount = 1000
    const starGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 400
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // ===== 2D PROFESSIONAL EFFECT CANVAS =====
    const ctx = waveCanvas.getContext('2d')

    // 📜 Scroll handler
    const handleScroll = () => {
      scrollY.current = window.scrollY
    }

    // ✨ Mouse move - create professional particle trail
    const handleMouseMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX)
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY)
      
      if (clientX === undefined || clientY === undefined) return
      
      prevMousePos.current = { ...mousePos.current }
      mousePos.current = {
        x: clientX,
        y: clientY
      }
      
      // Calculate velocity for dynamic effects
      const dx = mousePos.current.x - prevMousePos.current.x
      const dy = mousePos.current.y - prevMousePos.current.y
      const velocity = Math.sqrt(dx * dx + dy * dy)
      
      // Create particles based on movement
      if (velocity > 1) {
        const particleCount = Math.min(Math.floor(velocity / 5), 8)
        for (let i = 0; i < particleCount; i++) {
          particles.current.push({
            x: mousePos.current.x + (Math.random() - 0.5) * 20,
            y: mousePos.current.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            decay: 0.015 + Math.random() * 0.01,
            size: 2 + Math.random() * 3,
            hue: 200 + Math.random() * 40,
            type: Math.random() > 0.5 ? 'glow' : 'line'
          })
        }
      }
      
      // Limit particles
      if (particles.current.length > 200) {
        particles.current = particles.current.slice(-200)
      }
    }

    // Clear particles on touch end (mobile)
    const handleTouchEnd = () => {
      particles.current = []
      mousePos.current = { x: -1000, y: -1000 } // Move cursor off-screen
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleMouseMove)
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchcancel', handleTouchEnd)

    // 🎞 Animation loop
    const clock = new THREE.Clock()
    const animate = () => {
      requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      const scrollOffset = scrollY.current * 0.0015

      // Animate stars
      stars.rotation.x = elapsed * 0.02 + scrollOffset * 0.3
      stars.rotation.y = elapsed * 0.03 + scrollOffset * 0.2
      camera.position.z = 1 + scrollOffset * 1.5

      renderer.render(scene, camera)

      // Clear canvas for transparent effect
      ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height)
      
      // Draw cursor focal point with gradient
      const gradient = ctx.createRadialGradient(
        mousePos.current.x, mousePos.current.y, 0,
        mousePos.current.x, mousePos.current.y, 80
      )
      gradient.addColorStop(0, 'rgba(100, 150, 255, 0.3)')
      gradient.addColorStop(0.5, 'rgba(80, 120, 200, 0.15)')
      gradient.addColorStop(1, 'rgba(60, 100, 180, 0)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(
        mousePos.current.x - 80,
        mousePos.current.y - 80,
        160,
        160
      )
      
      // Update and draw particles
      particles.current = particles.current.filter(particle => {
        particle.life -= particle.decay
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.05 // gravity
        particle.vx *= 0.99 // drag
        particle.vy *= 0.99
        
        if (particle.life <= 0) return false
        
        const alpha = particle.life * 0.8
        
        if (particle.type === 'glow') {
          // Glowing particles
          const size = particle.size * particle.life
          const glowGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, size * 3
          )
          glowGradient.addColorStop(0, `hsla(${particle.hue}, 80%, 70%, ${alpha})`)
          glowGradient.addColorStop(0.5, `hsla(${particle.hue}, 70%, 60%, ${alpha * 0.5})`)
          glowGradient.addColorStop(1, `hsla(${particle.hue}, 60%, 50%, 0)`)
          
          ctx.fillStyle = glowGradient
          ctx.fillRect(
            particle.x - size * 3,
            particle.y - size * 3,
            size * 6,
            size * 6
          )
        } else {
          // Line trail particles
          ctx.strokeStyle = `hsla(${particle.hue}, 70%, 65%, ${alpha})`
          ctx.lineWidth = particle.size * particle.life
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(particle.x - particle.vx * 3, particle.y - particle.vy * 3)
          ctx.stroke()
        }
        
        return true
      })
      
      // Draw connecting lines between nearby particles (neural network effect)
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.15)'
      ctx.lineWidth = 1
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const p1 = particles.current[i]
          const p2 = particles.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 60) {
            const alpha = (1 - dist / 60) * 0.3 * p1.life * p2.life
            ctx.strokeStyle = `rgba(100, 150, 255, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }
      
      // Draw elegant cursor ring
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.4)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(mousePos.current.x, mousePos.current.y, 15 + Math.sin(elapsed * 3) * 3, 0, Math.PI * 2)
      ctx.stroke()
      
      ctx.strokeStyle = 'rgba(150, 180, 255, 0.2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(mousePos.current.x, mousePos.current.y, 25 + Math.cos(elapsed * 2) * 5, 0, Math.PI * 2)
      ctx.stroke()
    }
    animate()

    // 🔁 Resize + orientation
    window.addEventListener('resize', setSize)
    window.addEventListener('orientationchange', setSize)

    return () => {
      window.removeEventListener('resize', setSize)
      window.removeEventListener('orientationchange', setSize)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleMouseMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
      renderer.dispose()
      starGeometry.dispose()
      starMaterial.dispose()
    }
  }, [])

  return (
    <>
      {/* Star background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-100 dark:opacity-100"
        style={{ height: '100vh', width: '100vw' }}
      />
      
      {/* Professional cursor effect layer */}
      <canvas
        ref={waveCanvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ height: '100vh', width: '100vw', zIndex: 9999 }}
      />
    </>
  )
}