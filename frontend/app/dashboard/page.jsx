'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Charts from './components/Charts'
import { Loader2 } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAuth } from '@/components/auth/AuthContext'

gsap.registerPlugin(ScrollTrigger)

export default function DashboardPage() {
  const { user, loading } = useAuth() 
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)

  // Refs
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const cardsRef = useRef(null)
  const dividerRef = useRef(null)
  const chartsRef = useRef(null)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User not logged in, redirect to sign-in
        router.push('/sign-in')
      } else {
        // User is logged in, show dashboard after delay
        const timer = setTimeout(() => {
          setPageLoading(false)
        }, 800) // Reduced delay for better UX
        
        return () => clearTimeout(timer)
      }
    }
  }, [loading, user, router])

  // GSAP Animations
  useEffect(() => {
    if (!pageLoading && user) {
      const ctx = gsap.context(() => {
        // Set initial states immediately
        gsap.set([titleRef.current, subtitleRef.current, dividerRef.current], { 
          opacity: 1 
        })
        gsap.set(cardsRef.current?.children || [], { opacity: 1 })
        
        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })

        tl.from(titleRef.current, { 
          y: 50, 
          opacity: 0 
        })
        .from(subtitleRef.current, { 
          y: 40,
          opacity: 0,
          duration: 0.8
        }, '-=0.6')
        .from(cardsRef.current?.children || [], {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
        }, '-=0.4')
        .from(dividerRef.current, {
          scaleX: 0,
          opacity: 0,
          transformOrigin: 'center',
          duration: 1.2,
          ease: 'power2.inOut'
        }, '-=0.2')

        // Scroll-triggered charts animation
        gsap.from(chartsRef.current, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: chartsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })
      })

      return () => ctx.revert()
    }
  }, [pageLoading, user])

  if (pageLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen dark:bg-black">
        <Loader2 className="w-12 h-12 mb-4 text-indigo-600 animate-spin" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Preparing your dashboard...
        </p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="relative min-h-screen bg-black overflow-hidden"> 
      <div className="pt-20 sm:pt-24 lg:pt-28 relative z-10">
        <div className="relative bg-black text-center overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold lg:text-7xl xl:text-8xl gradient-title">
              Dashboard Overview
            </h1>
            <p ref={subtitleRef} className="mt-3 mb-10 text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400">
              Track your progress and analytics
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Hours', value: '245', sub: '+12% from last month', color: 'indigo' },
              { label: 'Completed', value: '78%', sub: 'On track', color: 'green' },
              { label: 'Tests Passed', value: '96', sub: '8 this week', color: 'purple' },
              { label: 'Current Streak', value: '12d', sub: 'Keep it up! 🔥', color: 'orange' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-muted/30 border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400 mt-1`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-center py-12 bg-gray-50 dark:bg-black">
          <div ref={dividerRef} className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent"></div>
        </div>

        <div ref={chartsRef}>
          <Charts />
        </div>
      </div>
    </div>
  )
}