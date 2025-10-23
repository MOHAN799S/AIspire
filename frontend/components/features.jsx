import React from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Mail, TrendingUp, MessageSquare, Target, BarChart3, Code, Award, PenBox, GraduationCap } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'AI-Powered Resume Generator',
    description: 'Create professional, tailored resumes instantly using advanced AI algorithms that highlight your strengths and experiences.',
    badge: 'Core Feature'
  },
  {
    icon: FileText,
    title: 'AI-Powered Resume Generator',
    description: 'Create professional, tailored resumes instantly using advanced AI algorithms that highlight your strengths and experiences.',
    badge: 'Core Feature'
  },
  {
    icon: PenBox,
    title: 'Cover Letter Builder',
    description: "Generate compelling cover letters customized to the job you're applying for, helping you stand out from the competition.",
    badge: 'Popular'
  },
  {
    icon: TrendingUp,
    title: 'Industry Insights',
    description: 'Stay ahead with up-to-date trends, salary benchmarks, and skills in demand across various industries.',
    badge: 'Data-Driven'
  },
  {
    icon: GraduationCap,
    title: 'Interview Preparation',
    description: 'Ace your interviews with AI-powered practice questions, feedback, and tips tailored to your target role.',
    badge: 'Interactive'
  },
];

const Features = () => {
  return (
    <section className="features-section relative py-16 px-6 bg-black z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6 gradient-title">
            Empowering Your Career Journey with Growth Tools
          </h2>
          <p className="text-lg text-gray-200 mb-12">
            Everything you need to land your dream job in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="feature-card relative p-6 bg-transparent rounded-lg shadow hover:shadow-md hover:border-white transition-all duration-400 z-0"
              >
                <div className="flex items-start justify-between mb-4 mt-4">
                  <Icon className="w-6 h-6 text-gray-400" />
                  <span className="text-xs px-2 py-1 bg-gray-900 text-gray-400 rounded-full text-center">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;