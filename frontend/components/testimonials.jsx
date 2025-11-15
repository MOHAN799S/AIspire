'use client'
import React, { useEffect, useRef } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Tech Corp",
    image: "SJ",
    text: "This platform transformed my job search! The AI-powered resume builder helped me land interviews at top tech companies. Within 2 weeks, I received 3 job offers.",
  },
  {
    name: "Michael Chen",
    role: "Marketing Manager",
    company: "Brand Solutions",
    image: "MC",
    text: "The interview preparation tools were game-changing. I felt confident and prepared for every interview. Highly recommend to anyone serious about their career.",
  },
  {
    name: "Emily Rodriguez",
    role: "Product Designer",
    company: "Design Studio",
    image: "ER",
    text: "The industry insights helped me understand market trends and negotiate a 30% salary increase. The cover letter builder saved me hours of work.",
  },
  {
    name: "David Kim",
    role: "Data Analyst",
    company: "Analytics Inc",
    image: "DK",
    text: "I was struggling with my resume format until I found this platform. The ATS optimization feature ensured my resume got past the filters. Got hired within a month!",
  },
  {
    name: "Jessica Brown",
    role: "HR Specialist",
    company: "People First",
    image: "JB",
    text: "As an HR professional, I can confirm this tool creates top-quality resumes. I now recommend it to all job seekers I work with. Truly impressive results.",
  },
  {
    name: "Alex Thompson",
    role: "Sales Director",
    company: "Growth Partners",
    image: "AT",
    text: "The career analytics dashboard gave me insights I never had before. I could track my progress and adjust my strategy. Landed my dream role in sales leadership!",
  },
];

const Testimonials = () => {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Duplicate content for seamless loop
    const scrollerContent = Array.from(scroller.children);
    scrollerContent.forEach((item) => {
      const duplicate = item.cloneNode(true);
      scroller.appendChild(duplicate);
    });
  }, []);

  return (
    <section className="relative py-20 px-6  overflow-hidden ">
      <style>{`
        @keyframes scroll {
          0% { 
            transform: translateX(0); 
          }
          100% { 
            transform: translateX(calc(-382px * 6));
          }
        }

        .scroller {
          display: flex;
          gap: 32px;
          animation: scroll 80s linear infinite;
          width: max-content;
          will-change: transform !important;
        }

        .scroller:hover {
          animation-play-state: paused;
        }

        .testimonial-card {
        padding-top: 1.5rem;
          flex: 0 0 350px;
          width: 450px;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.05);
          transform: translateY(0) scale(1);
          border-radius: 1rem;
          padding: 2rem;
          position: relative;
          transition: all 0.4s ease;
          margin-top: 1rem;
        }

        .testimonial-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1),
                      0 0 20px rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          @keyframes scroll {
            0% { 
              transform: translateX(0); 
            }
            100% { 
              transform: translateX(calc(-324px * 6));
            }
          }

          .scroller {
            gap: 24px;
          }

          .testimonial-card {
            flex: 0 0 300px;
            width: 300px;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-6 text-white">What Our Users Say</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Real stories from professionals who transformed their careers.
        </p>
      </div>

      <div style={{ overflow: 'hidden', width: '100%' }}>
        <div ref={scrollerRef} className="scroller">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <Quote 
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  width: '2rem',
                  height: '2rem',
                  color: 'rgb(75, 85, 99)',
                  opacity: 0.5
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  marginRight: '1rem',
                  flexShrink: 0
                }}>
                  {testimonial.image}
                </div>
                <div>
                  <h4 style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                    {testimonial.name}
                  </h4>
                  <p style={{ color: 'rgb(156, 163, 175)', fontSize: '0.875rem', marginBottom: '0.125rem' }}>
                    {testimonial.role}
                  </p>
                  <p style={{ color: 'rgb(107, 114, 128)', fontSize: '0.75rem' }}>
                    {testimonial.company}
                  </p>
                </div>
              </div>
              <p style={{ color: 'rgb(209, 213, 219)', lineHeight: '1.625' }}>
                &apos;{testimonial.text}&apos;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;