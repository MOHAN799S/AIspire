'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

export default function StarBackground() {
  const canvasRef = useRef(null)
  const scrollY = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

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
      opacity: 0, // start hidden
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // ✨ Fade-in animation (GSAP)
    gsap.to(starMaterial, {
      opacity: 0.8,
      duration: 2.5,
      ease: 'power2.out',
      delay: 0.5,
    })

    // 📜 Scroll-based parallax motion
    const handleScroll = () => {
      scrollY.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll)

    // 🎞 Animation loop
    const clock = new THREE.Clock()
    const animate = () => {
      requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      const scrollOffset = scrollY.current * 0.0015

      stars.rotation.x = elapsed * 0.02 + scrollOffset * 0.3
      stars.rotation.y = elapsed * 0.03 + scrollOffset * 0.2
      camera.position.z = 1 + scrollOffset * 1.5

      renderer.render(scene, camera)
    }
    animate()

    // 🔁 Resize + orientation
    window.addEventListener('resize', setSize)
    window.addEventListener('orientationchange', setSize)

    return () => {
      window.removeEventListener('resize', setSize)
      window.removeEventListener('orientationchange', setSize)
      window.removeEventListener('scroll', handleScroll)
      renderer.dispose()
      starGeometry.dispose()
      starMaterial.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-100 dark:opacity-100"
      style={{ height: '100vh', width: '100vw' }}
    />
  )
}
