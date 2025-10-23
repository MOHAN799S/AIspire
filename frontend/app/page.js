'use client'
import Image from "next/image";
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
      <Features>
      </Features>
    
<HowItWorks></HowItWorks>
      <Testimonials></Testimonials>
      <Faqs>
      </Faqs>
      <StartJourney></StartJourney>
    </div>
  );
}
