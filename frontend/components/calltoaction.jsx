import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';

const StartJourney = () => {
  return (
    <section className="relative py-12 px-6 text-center overflow-hidden z-10" style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #2d2d2d 50%, #0a0a0a 100%)'
      }}>
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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
          Your Career Journey Starts Here
        </h1>

        <p className="text-base md:text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover powerful AI tools to help you craft your resume, generate cover letters, gain industry insights, and prepare for interviews — all in one platform.
        </p>

        <Link href='/dashboard'>
            <Button size='lg' className='gradient-button px-8 hover:cursor-pointer'>
                Start my Journey
            </Button>
        </Link>
      </div>
    </section>
  );
};

export default StartJourney;