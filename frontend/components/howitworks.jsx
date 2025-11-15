'use client'
import React, { useEffect, useRef } from 'react';
import { UserCircle, FileText, TrendingUp, Target, Rocket, BookOpen } from 'lucide-react';
import { Card } from './ui/card';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: 'Create Your Profile',
    description: 'Sign up and fill in your career details, skills, experience, and goals to get started.',
    icon: UserCircle,
  },
  {
    title: 'Explore Industry Insights & Learning Path',
    description: 'Discover the latest industry trends and follow a personalized learning path to enhance your skills.',
    icon: TrendingUp,
  },
  {
    title: 'Get Project Recommendations',
    description: 'Receive AI-powered project suggestions tailored to your skills and career aspirations.',
    icon: BookOpen,
  },
  {
    title: 'Generate Resume & Cover Letter',
    description: 'Use our AI-powered tools to instantly generate a personalized resume and cover letter tailored to your industry and role.',
    icon: FileText,
  },
  {
    title: 'Prepare for Interviews',
    description: 'Practice with AI-driven mock interviews, get instant feedback, and boost your confidence.',
    icon: Target,
  },
  {
    title: 'Apply & Succeed',
    description: 'Apply to jobs directly or download your documents and take the next step in your career.',
    icon: Rocket,
  },
];

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const iconsRef = useRef([]);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Use matchMedia to apply GSAP only on small devices (max-width: 767px)
      const mm = gsap.matchMedia();
      
      mm.add("(max-width: 767px)", () => {
        // Animate title with split effect - MOBILE ONLY
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // Animate subtitle with different direction - MOBILE ONLY
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, x: 100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // Animate cards with rotation and fade - MOBILE ONLY
        cardsRef.current.forEach((card, index) => {
          if (card) {
            // Card animation with rotation
            gsap.fromTo(
              card,
              {
                opacity: 0,
                rotateY: 90,
                x: index % 2 === 0 ? -50 : 50,
              },
              {
                opacity: 1,
                rotateY: 0,
                x: 0,
                duration: 1,
                ease: 'back.out(1.4)',
                force3D: true,
                scrollTrigger: {
                  trigger: card,
                  start: 'top 90%',
                  toggleActions: 'play none none reverse',
                  once: true,
                  fastScrollEnd: true,
                },
              }
            );

            // Icon animation - bounce effect
            const icon = iconsRef.current[index];
            if (icon) {
              gsap.fromTo(
                icon,
                {
                  scale: 0,
                  rotation: -180,
                },
                {
                  scale: 1,
                  rotation: 0,
                  duration: 0.8,
                  delay: 0.3,
                  ease: 'elastic.out(1, 0.5)',
                  force3D: true,
                  scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                    once: true,
                  },
                }
              );
            }

            // Touch hover animations for mobile
            card.addEventListener('touchstart', () => {
              gsap.to(card, {
                y: -12,
                boxShadow: '0 20px 60px rgba(255, 255, 255, 0.15)',
                duration: 0.4,
                ease: 'power2.out',
              });

              const icon = iconsRef.current[index];
              if (icon) {
                gsap.to(icon, {
                  scale: 1.15,
                  rotation: 8,
                  duration: 0.4,
                  ease: 'back.out(2)',
                });
              }
            });

            card.addEventListener('touchend', () => {
              gsap.to(card, {
                y: 0,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                duration: 0.4,
                ease: 'power2.out',
              });

              const icon = iconsRef.current[index];
              if (icon) {
                gsap.to(icon, {
                  scale: 1,
                  rotation: 0,
                  duration: 0.4,
                  ease: 'back.out(2)',
                });
              }
            });
          }
        });
      });

      // For medium and larger devices - minimal GSAP
      // mm.add("(min-width: 768px)", () => {
      //   // Simple fade in for title
      //   gsap.fromTo(
      //     titleRef.current,
      //     { opacity: 0 },
      //     {
      //       opacity: 1,
      //       duration: 0.6,
      //       scrollTrigger: {
      //         trigger: titleRef.current,
      //         start: 'top 80%',
      //         once: true,
      //       },
      //     }
      //   );

      //   // Simple fade in for subtitle
      //   gsap.fromTo(
      //     subtitleRef.current,
      //     { opacity: 0 },
      //     {
      //       opacity: 1,
      //       duration: 0.6,
      //       delay: 0.2,
      //       scrollTrigger: {
      //         trigger: subtitleRef.current,
      //         start: 'top 80%',
      //         once: true,
      //       },
      //     }
      //   );

      //   // Simple fade in for cards
      //   cardsRef.current.forEach((card) => {
      //     if (card) {
      //       gsap.fromTo(
      //         card,
      //         { opacity: 0 },
      //         {
      //           opacity: 1,
      //           duration: 0.5,
      //           scrollTrigger: {
      //             trigger: card,
      //             start: 'top 90%',
      //             once: true,
      //           },
      //         }
      //       );
      //     }
      //   });
      // });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="how-it-works-section relative py-20 px-6 bg-black z-10">
      <div className="max-w-6xl mx-auto text-center">
        <h2 ref={titleRef} className="text-4xl font-bold mb-6 text-white">
          How It Works
        </h2>
        <p ref={subtitleRef} className="text-lg text-gray-400 mb-16 max-w-2xl mx-auto">
          A step-by-step guide to how our platform helps you land your dream job with smart, AI-driven tools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="step-card bg-black rounded-xl p-6 text-left border border-white/20 shadow-lg cursor-pointer hover:shadow-2xl hover:-translate-y-2 hover:border-white transition-all duration-300"
                style={{ perspective: '1000px' }}
              >
                <div>
                  <div
                    ref={(el) => (iconsRef.current[index] = el)}
                    className="step-icon flex-shrink-0 w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center m-auto my-5"
                  >
                    <Icon className="w-7 h-7 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-white text-center w-full">
                        {step.title.replace(/^\d+\.\s*/, '')}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;