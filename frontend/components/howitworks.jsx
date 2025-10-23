import React from 'react';
import { UserCircle, FileText, TrendingUp, Target, Rocket } from 'lucide-react';
import { Card } from './ui/card';

const steps = [
  {
    title: '1. Create Your Profile',
    description: 'Sign up and fill in your career details, skills, experience, and goals to get started.',
    icon: UserCircle,
  },
  {
    title: '2. Generate Resume & Cover Letter',
    description: 'Use our AI-powered tools to instantly generate a personalized resume and cover letter tailored to your industry and role.',
    icon: FileText,
  },
  {
    title: '3. Explore Industry Insights',
    description: 'Access up-to-date market trends, salary data, and in-demand skills to stay ahead of the curve.',
    icon: TrendingUp,
  },
  {
    title: '4. Prepare for Interviews',
    description: 'Practice with AI-driven mock interviews, get instant feedback, and boost your confidence.',
    icon: Target,
  },
  {
    title: '5. Apply & Succeed',
    description: 'Apply to jobs directly or download your documents and take the next step in your career.',
    icon: Rocket,
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works-section relative py-20 px-6 bg-black z-10">
      <style>{`
        .step-card {
          transition: all 0.5s ease;
          position: relative;
          z-index: 0;
        }
        
        .step-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 40px rgba(255, 255, 255, 0.1);
          z-index: 1;
        }
        
        .step-icon {
          transition: all 0.5s ease;
        }
        
        .step-card:hover .step-icon {
          transform: scale(1.1) rotate(5deg);
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-white">How It Works</h2>
        <p className="text-lg text-gray-400 mb-16 max-w-2xl mx-auto">
          A step-by-step guide to how our platform helps you land your dream job with smart, AI-driven tools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index} 
                className="step-card bg-black rounded-xl p-6 text-left hover:border-white shadow-lg"
              >
                <div>
                  <div className="step-icon flex-shrink-0 w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center m-auto my-5">
                    <Icon className="w-7 h-7 text-gray-700" />
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