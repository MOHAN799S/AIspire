import React from "react";
import { Quote } from "lucide-react";
import { Card } from "./ui/card";
// eslint-disable-next-line react/no-unescaped-entities
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
  return (
    <section className="relative py-20 px-6 bg-muted/5 overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-track {
          display: flex;
          width: calc(200%);
          animation: marquee 40s linear infinite;
        }

        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }

        .testimonial-card {
        margin:20px;
          transition: all 0.4s ease;
          position: relative;
          z-index: 0;
        }

        .testimonial-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1),
                      0 0 20px rgba(255, 255, 255, 0.1);
          z-index: 1;
        }
      `}</style>

      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-6 text-white">What Our Users Say</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Real stories from professionals who transformed their careers.
        </p>
      </div>

      {/* Marquee Section */}
      <div className="relative marquee-container overflow-hidden">
        <div className="marquee-track ">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <Card
            key={index}
            className="
              testimonial-card
              bg-black/60
              text-left
              rounded-2xl
              p-8
              mx-10
              flex-shrink-0
              border border-white/10
              
              /* SMALL (Mobile) */
              min-w-[300px]
              max-w-[300px]
              
              /* MEDIUM (Tablet) */
              md:min-w-[350px]
              md:max-w-[350px]
              
              /* LARGE (Desktop) */
              lg:min-w-[420px]
              lg:max-w-[420px]
            "
          >
            {/* Note: Assuming 'Quote' is an imported icon component */}
            <Quote className="absolute top-6 right-6 w-8 h-8 text-gray-600 opacity-50" />
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black font-bold text-lg mr-4">
                {testimonial.image}
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
                <p className="text-gray-500 text-xs">{testimonial.company}</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
    &quot;{testimonial.text}&quot;
  </p>
          </Card>
          
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
