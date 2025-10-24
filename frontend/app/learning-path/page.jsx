'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion'
import { Learningpaths } from '@/components/data'
import { BookOpen, FileText, Loader2 } from 'lucide-react'
const LearningPathsCard = () => {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [visibleCards, setVisibleCards] = useState(new Set())

  const paths = Learningpaths // Import paths data

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in')

    if (isLoaded && isSignedIn) {
      const timer = setTimeout(() => setPageLoading(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [isLoaded, isSignedIn, router])

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (pageLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-card-id')
            setVisibleCards((prev) => new Set([...prev, id]))
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    )

    const cards = document.querySelectorAll('[data-card-id]')
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [pageLoading])

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || pageLoading) return

    const container = containerRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.position.z = 5

    // Particles
    const particlesCount = window.innerWidth < 768 ? 400 : 800
    const positions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount * 3; i++) positions[i] = (Math.random() - 0.5) * 15

    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particlesMaterial = new THREE.PointsMaterial({ size: 0.04, color: 0xffffff, transparent: true, opacity: 0.35 })
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // createWireframe
    const createWireframe = (geometry, color, opacity, position) => {
      const material = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.copy(position)
      scene.add(mesh)
      return mesh
    }

    const torus = createWireframe(new THREE.TorusGeometry(1, 0.3, 8, 50), 0xffffff, 0.2, new THREE.Vector3(-2, 2, 0))
    const octahedron = createWireframe(new THREE.OctahedronGeometry(1.1), 0xffffff, 0.15, new THREE.Vector3(2, -2, -1))

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    // Mouse + scroll
    let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0
    let scrollY = window.scrollY

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      targetMouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      targetMouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }

    const handleScroll = () => {
      scrollY = window.scrollY
    }

    container.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

    // Animation loop
    const clock = new THREE.Clock()
    const isMobile = window.innerWidth < 768
    let lastFrameTime = 0
    const targetFPS = isMobile ? 30 : 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime) => {
      requestAnimationFrame(animate)

      if (currentTime - lastFrameTime < frameInterval) return
      lastFrameTime = currentTime

      const delta = clock.getDelta()
      const easeFactor = isMobile ? 0.03 : 0.05

      mouseX += (targetMouseX - mouseX) * easeFactor
      mouseY += (targetMouseY - mouseY) * easeFactor

      const scrollOffset = scrollY * (isMobile ? 0.0004 : 0.0008)

      particlesMesh.rotation.y += delta * 0.08
      torus.rotation.x += delta * 0.25
      torus.rotation.y += delta * 0.18
      octahedron.rotation.x += delta * 0.15
      octahedron.rotation.y += delta * 0.22

      const parallaxStrength = isMobile ? 0.3 : 0.5
      camera.position.x += (mouseX * parallaxStrength - camera.position.x) * easeFactor
      camera.position.y += (mouseY * parallaxStrength - camera.position.y) * easeFactor
      camera.position.z = 5 + scrollOffset * (isMobile ? 20 : 30)

      camera.lookAt(scene.position)
      renderer.render(scene, camera)
    }
    animate(0)

    // Resize
    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      container.removeEventListener('mousemove', handleMouseMove)
      renderer.dispose()
      particlesGeometry.dispose()
      scene.clear()
    }
  }, [pageLoading])


  if (pageLoading || !isLoaded) {
    return (
      <section className="relative bg-black h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
        <p className="text-gray-400 text-lg">Loading learning paths...</p>
      </section>
    )
  }

  if (!isSignedIn) return null

  return (
    <section ref={containerRef} className="relative bg-black text-white min-h-screen overflow-hidden py-16">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      {/* Timeline line for larger screens */}
      {/* <div className="hidden lg:block absolute left-1/2 top-68 bottom-0 w-0.5  transform -translate-x-1/2" /> */}

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="gradient-title text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 mt-20  bg-clip-text text-transparent">
            Learning Paths
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl lg:text-2xl">Choose your path and start learning today</p>
        </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">

          {paths.map((path, index) => {
            const isEven = index % 2 === 0
            const isVisible = visibleCards.has(path.id.toString())
            
            return (
              <div
                key={path.id}
                data-card-id={path.id}
                className={`
                  relative flex items-center justify-center ${isEven ? 'lg:justify-start' : 'lg:justify-end'}
                  transition-all duration-1000 ease-out
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
                `}
                style={{
                  transitionDelay: `${(index % 3) * 100}ms`
                }}
              >
                {/* Timeline dot for larger screens */}
                {/* <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className={`
                    w-6 h-6 rounded-full border-4 border-white/85
                    ${isVisible ? 'scale-100 bg-gradient-to-br from-gray-200 to-gray-400' : 'scale-0 bg-gray-500'}
                    transition-all duration-500 ease-out shadow-lg shadow-white/80
                  `} style={{ transitionDelay: '200ms' }} />
                </div> */}

                {/* Card container */}
                <div className={`
                  w-full lg:w-[48%]
                  ${isEven ? 'lg:pr-12' : 'lg:pl-12'}
                `}>
                  <Card
                    className={`
                      bg-white/5 backdrop-blur-md border border-white/10 
                      hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-white/25 md:flex-2
                      transition-all duration-500 group
                      ${isVisible ? 'scale-100' : 'scale-95'}
                    `}
                    style={{
                      transitionDelay: `${300 + (index % 3) * 100}ms`
                    }}
                  >
                    <CardHeader className="border-b border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                          {path.icon}
                        </div>
                        <CardTitle className="text-lg sm:text-xl">{path.title}</CardTitle>
                      </div>
                      <p className="text-sm text-gray-400">{path.description}</p>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-5 space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-1 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="text-sm font-medium">{path.duration}</p>
                        </div>
                        <div className="flex-1 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                          <p className="text-xs text-gray-500">Level</p>
                          <p className="text-sm font-medium">{path.difficulty}</p>
                        </div>
                      </div>

                      <Accordion type="single" collapsible className="space-y-3">
                        <AccordionItem
                          value={`syllabus-${path.id}`}
                          className="border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                        >
                          <AccordionTrigger className="px-4 py-2 text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-gray-400" />
                              <span>Syllabus</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-3 space-y-3">
                            {path.syllabus.map((module, idx) => (
                              <Accordion key={idx} type="single" collapsible>
                                <AccordionItem
                                  value={`module-${path.id}-${idx}`}
                                  className="bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                                >
                                  <AccordionTrigger className="px-3 py-2 text-xs font-medium">
                                    {module.module}
                                  </AccordionTrigger>
                                  <AccordionContent className="p-3">
                                    <div className="flex flex-wrap gap-2">
                                      {module.topics.map((topic, tIdx) => (
                                        <span key={tIdx} className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-all">
                                          {topic}
                                        </span>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            ))}
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                          value={`resources-${path.id}`}
                          className="border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                        >
                          <AccordionTrigger className="px-4 py-2 text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span>Resources</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-3 space-y-2">
                            {path.resources.map((res, idx) => (
                              <a
                                key={idx}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-xs text-gray-300 bg-white/10 hover:bg-white/20 hover:translate-x-1 px-3 py-2 rounded transition-all"
                              >
                                <span className="font-medium">{res.name}</span>
                                <span className="text-gray-500 ml-2">• {res.type}</span>
                              </a>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      {/* <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                        Start Learning
                      </button> */}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default LearningPathsCard