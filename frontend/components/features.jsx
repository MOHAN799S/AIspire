'use client'
import React, { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import {
  FileText,
  TrendingUp,
  PenBox,
  GraduationCap,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: FileText,
    title: 'AI-Powered Resume Generator',
    description:
      'Create professional, tailored resumes instantly using advanced AI algorithms that highlight your strengths and experiences.',
    badge: 'Core Feature',
  },
  {
    icon: PenBox,
    title: 'Cover Letter Builder',
    description:
      "Generate compelling cover letters customized to the job you're applying for, helping you stand out from the competition.",
    badge: 'Popular',
  },
  {
    icon: TrendingUp,
    title: 'Industry Insights',
    description:
      'Stay ahead with up-to-date trends, salary benchmarks, and skills in demand across various industries.',
    badge: 'Data-Driven',
  },
  {
    icon: GraduationCap,
    title: 'Interview Preparation',
    description:
      'Ace your interviews with AI-powered practice questions, feedback, and tips tailored to your target role.',
    badge: 'Interactive',
  },
]

const Features = () => {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Use matchMedia to apply GSAP only on small devices (max-width: 767px)
      const mm = gsap.matchMedia()
      
      mm.add("(max-width: 767px)", () => {
        // Animate each card individually when it comes into view - MOBILE ONLY
        cardsRef.current.forEach((card) => {
          if (card) {
            gsap.fromTo(
              card,
              { 
                y: 80, 
                opacity: 0,
                scale: 0.9
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out',
                force3D: true,
                scrollTrigger: {
                  trigger: card,
                  start: 'top 85%',
                  end: 'top 60%',
                  toggleActions: 'play none none reverse',
                  once: true,
                  fastScrollEnd: true,
                },
              }
            )

            // Add GSAP hover animation for mobile
            card.addEventListener('touchstart', () => {
              gsap.to(card, {
                y: -8,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                duration: 0.3,
                ease: 'power2.out'
              })
            })

            card.addEventListener('touchend', () => {
              gsap.to(card, {
                y: 0,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                duration: 0.3,
                ease: 'power2.out'
              })
            })
          }
        })
      })

      // For medium and larger devices - use CSS transitions only
      mm.add("(min-width: 768px)", () => {
        cardsRef.current.forEach((card) => {
          if (card) {
            // Simple fade in without GSAP overhead
            gsap.fromTo(
              card,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.5,
                scrollTrigger: {
                  trigger: card,
                  start: 'top 10%',
                  end: 'top 5%',
                  once: true,
                },
              }
            )
          }
        })
      })

      return () => mm.revert()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="features-section relative py-20 px-6 bg-black z-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-title">
            Empowering Your Career Journey with Growth Tools
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Everything you need to land your dream job — guided by AI precision
            and real-world insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="feature-card relative p-6 bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 border border-zinc-800/60 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4 mt-2">
                  <Icon className="w-7 h-7 text-gray-400" />
                  <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features