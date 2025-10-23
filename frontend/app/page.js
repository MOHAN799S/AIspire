import HeroSection from "@/components/hero";
import Features from "@/components/features";
import HowItWorks from "@/components/howitworks";
import Testimonials from "@/components/testimonials";
import Faqs from "@/components/faqs";
import StartJourney from "@/components/calltoaction";

export default function Home() {
  return (
    <div>
      <div className="grid-backgorund"></div>
      <HeroSection />
      
      {/* Elegant Divider */}
      <div className="w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>
      
      <Features />
      
      {/* Elegant Divider */}
      <div className="w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>
      
      <HowItWorks />
      
      {/* Elegant Divider */}
      <div className="w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>
      
      <Testimonials />
      
      {/* Elegant Divider */}
      <div className="w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>
      
      <Faqs></Faqs>
      
      {/* Elegant Divider */}
      <div className="w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>
      
      <StartJourney />
    </div>
  );
}