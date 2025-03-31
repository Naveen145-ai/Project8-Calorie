import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/landing/hero-section";
import FeaturesSection from "@/components/landing/features-section";
import HowItWorks from "@/components/landing/how-it-works";
import Pricing from "@/components/landing/pricing";
import WaitlistForm from "@/components/landing/waitlist-form";

export default function HomePage() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const openWaitlistModal = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setIsWaitlistModalOpen(true);
    }
  };

  const closeWaitlistModal = () => {
    setIsWaitlistModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onWaitlistClick={openWaitlistModal} />

      <main className="flex-grow">
        <HeroSection onWaitlistClick={openWaitlistModal} onLearnMoreClick={() => {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        }} />
        
        <FeaturesSection />
        
        <HowItWorks />
        
        <Pricing onWaitlistClick={openWaitlistModal} />
        
        <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-blue-500">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold heading mb-6">
                Be Among the First to Experience NutriScan
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join our waitlist today and receive early access when we launch, plus exclusive bonuses for early adopters.
              </p>
              <div className="max-w-lg mx-auto">
                <button
                  onClick={openWaitlistModal}
                  className="bg-white text-primary px-6 py-3 rounded-lg font-bold hover:bg-neutral-100 transition-colors"
                >
                  Join Waitlist
                </button>
                <p className="mt-4 text-sm text-white/80">
                  We respect your privacy and will never share your information.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {isWaitlistModalOpen && (
        <WaitlistForm isOpen={isWaitlistModalOpen} onClose={closeWaitlistModal} />
      )}
    </div>
  );
}
