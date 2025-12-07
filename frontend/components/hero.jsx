'use client'
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useRouter } from 'next/navigation'
import { useAuth } from './auth/AuthContext'

gsap.registerPlugin(ScrollTrigger)

export const HeroSection = () => {
  const image = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)
  const sectionRef = useRef(null)

  const { isSignedIn } = useAuth();
  const router = useRouter()

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/dashboard')
    } else {
      router.push('/sign-up')
    }
  }

  useEffect(() => {
    const imgRef = image.current

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const scrollThreshold = 100

      if (scrollPosition > scrollThreshold) {
        imgRef.classList.add('scrolled')
      } else {
        imgRef.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 100, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.4)' }
      )
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      )
      tl.fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' },
        '-=0.4'
      )
    }, sectionRef)

    return () => {
      ctx.revert()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className='w-full pt-36 md:pt-46 pb-10 overflow-x-hidden'>
      <div className='space-y-8 md:space-y-16 text-center'>
        <div className='space-y-4 md:space-y-6 text-center mx-auto'>
          <h1
            ref={titleRef}
            className='text-5xl md:text-6xl font-bold lg:text-7xl xl:text-8xl gradient-title'
          >
            Your AI Companion for <br /> Smarter Career Growth
          </h1>

          <p
            ref={subtitleRef}
            className='mx-auto max-w-[600px] text-muted-foreground md:text-xl'
          >
            AIspire helps you accelerate your career with intelligent interview
            preparation, personalized learning paths, ATS-optimized resume and
            cover letter tools — all powered by AI to help you stand out and
            succeed.
          </p>

          <div
            ref={buttonRef}
            className='flex items-center justify-center gap-4 space-x-4'
          >
            {/* 👇 Smart Redirect Button */}
            <Button
              size='lg'
              className='px-8 hover:cursor-pointer'
              onClick={handleGetStarted}
            >
              Get Started
            </Button>

            <a href='/files/demo.pptx' download>
              <Button
                size='lg'
                variant='outline'
                className='px-8 hover:cursor-pointer'
              >
                Download PPT
              </Button>
            </a>
          </div>

          <div className='hero-image-wrapper mt-5 md:mt-0 '>
            <div ref={image} className='hero-image max-w-full'>
              <Image
                src='/newbanner.png'
                alt='hero-image'
                width={1280}
                height={720}
                className='hero-image rounded-lg shadow-2xl border mx-auto max-w-full h-auto'
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
