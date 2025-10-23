'use client'
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StartJourney = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // GSAP animations for small devices only (max-width: 767px)
      mm.add("(max-width: 767px)", () => {
        // Title animation - slide from top with bounce
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: -80,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'elastic.out(1, 0.6)',
            force3D: true,
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // Description animation - fade and slide up
        gsap.fromTo(
          descriptionRef.current,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.3,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: descriptionRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );

        // Button animation - bounce in with rotation
        gsap.fromTo(
          buttonRef.current,
          {
            opacity: 0,
            scale: 0,
            rotation: -180,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1,
            delay: 0.6,
            ease: 'back.out(1.7)',
            force3D: true,
            scrollTrigger: {
              trigger: buttonRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        );

        // Button touch interactions
        const button = buttonRef.current;
        if (button) {
          button.addEventListener('touchstart', () => {
            gsap.to(button, {
              scale: 1.1,
              duration: 0.2,
              ease: 'power2.out',
            });
          });

          button.addEventListener('touchend', () => {
            gsap.to(button, {
              scale: 1,
              duration: 0.2,
              ease: 'power2.out',
            });
          });
        }
      });

      // Minimal animations for medium and larger devices
      mm.add("(min-width: 768px)", () => {
        // Simple fade for title
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // Simple fade for description
        gsap.fromTo(
          descriptionRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            delay: 0.2,
            scrollTrigger: {
              trigger: descriptionRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );

        // Simple fade for button
        gsap.fromTo(
          buttonRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: buttonRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        );
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 px-6 text-center overflow-hidden z-10" 
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #2d2d2d 50%, #0a0a0a 100%)'
      }}
    >
      <style>{`
        .gradient-button {
          position: relative;
          background: white;
          color: black;
          border: none;
          transition: all 0.5s ease;
          overflow: hidden;
          z-index: 0;
        }
        
        .gradient-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
          z-index: -1;
        }
        
        .gradient-button:hover::before {
          left: 100%;
        }
        
        .gradient-button:hover {
          transform: scale(1.05);
          z-index: 1;
        }
      `}</style>

      <div className="max-w-4xl mx-auto relative z-0">
        <h1 ref={titleRef} className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
          Your Career Journey Starts Here
        </h1>

        <p ref={descriptionRef} className="text-base md:text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover powerful AI tools to help you craft your resume, generate cover letters, gain industry insights, and prepare for interviews — all in one platform.
        </p>

        <div ref={buttonRef}>
          <Link href='/dashboard'>
            <Button size='lg' className='gradient-button px-8 hover:cursor-pointer'>
              Start my Journey
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StartJourney;