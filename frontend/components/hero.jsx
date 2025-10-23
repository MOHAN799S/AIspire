'use client'
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

export const HeroSection = () => {
  const image = useRef(null)

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
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className='w-full pt-36 md:pt-46 pb-10'>
      <div className='space-y-8 md:space-y-16 text-center'>
        <div className='space-y-4 md:space-y-6 text-center mx-auto'>
          <h1 className='text-5xl md:text-6xl font-bold lg:text-7xl xl:text-8xl gradient-title'>
            AI-Driven Interview Prep <br /> for Career Success
          </h1>
          <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl'>
            Get personalized interview prep with AI-driven insights, practice questions, and expert tips to ace your next job interview.
          </p>
          <div className='flex items-center justify-center gap-4 space-x-4'>
            <Link href='/dashboard'>
              <Button size='lg' className='px-8 hover:cursor-pointer'>
                Get Started
              </Button>
            </Link>
          </div>

          <div className='hero-image-wrapper mt-5 md:mt-0'>
            <div ref={image} className='hero-image'>
              <Image
                src='/newbanner.png'
                alt='hero-image'
                width={1280}
                height={720}
                className='rounded-lg shadow-2xl border mx-auto'
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
