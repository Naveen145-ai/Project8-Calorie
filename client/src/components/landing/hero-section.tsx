import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface HeroSectionProps {
  onWaitlistClick: () => void;
  onLearnMoreClick: () => void;
}

export default function HeroSection({ onWaitlistClick, onLearnMoreClick }: HeroSectionProps) {
  const { user } = useAuth();
  
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 z-0"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold heading text-neutral-900 leading-tight">
              Smart Nutrition <span className="text-primary">Analysis</span> For Better Health
            </h1>
            <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-xl">
              Scan your meals, track nutrients, and get personalized health recommendations with our AI-powered platform.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="py-3 px-6 text-lg shadow-lg hover:shadow-xl transition duration-300">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={onWaitlistClick} 
                  size="lg" 
                  className="py-3 px-6 text-lg shadow-lg hover:shadow-xl transition duration-300"
                >
                  Join the Waitlist
                </Button>
              )}
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-primary py-3 px-6 text-lg transition duration-300"
                onClick={onLearnMoreClick}
              >
                Learn More
              </Button>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                  JD
                </div>
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                  SK
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                  AM
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                  BT
                </div>
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium border-2 border-white">
                  +3k
                </div>
              </div>
              <p className="ml-4 text-neutral-600">
                <span className="font-semibold">3,000+</span> people have already joined our waitlist
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative">
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1511909525232-61113c912358?w=800&h=600&fit=crop" 
                  alt="Healthy food with mobile app scanning" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="text-white">
                  <div className="text-sm font-semibold">Breakfast Analysis</div>
                  <div className="flex items-center mt-1">
                    <span className="text-sm bg-green-500/90 px-2 py-0.5 rounded mr-2">380 kcal</span>
                    <span className="text-sm bg-blue-500/90 px-2 py-0.5 rounded mr-2">22g protein</span>
                    <span className="text-sm bg-yellow-500/90 px-2 py-0.5 rounded">14g carbs</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-16 -left-10 w-40 h-40 bg-primary/10 rounded-full z-0"></div>
            <div className="absolute -top-12 -right-10 w-32 h-32 bg-blue-500/10 rounded-full z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
