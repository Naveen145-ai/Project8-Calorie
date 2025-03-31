import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PricingProps {
  onWaitlistClick: () => void;
}

const pricingPlans = [
  {
    name: "Basic",
    price: "$9",
    period: "/month",
    description: "Perfect for beginners",
    isPopular: false,
    features: [
      { name: "Food recognition & analysis", included: true },
      { name: "Basic nutritional breakdown", included: true },
      { name: "Up to 30 meal scans per month", included: true },
      { name: "Basic workout plans", included: true },
      { name: "Custom meal planning", included: false },
      { name: "PDF report exports", included: false },
    ],
  },
  {
    name: "Premium",
    price: "$19",
    period: "/month",
    description: "For health enthusiasts",
    isPopular: true,
    features: [
      { name: "Everything in Basic", included: true },
      { name: "Unlimited meal scans", included: true },
      { name: "Detailed nutrition analysis", included: true },
      { name: "Custom meal planning", included: true },
      { name: "Advanced workout plans", included: true },
      { name: "Health coach consultation", included: false },
    ],
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "Complete health solution",
    isPopular: false,
    features: [
      { name: "Everything in Premium", included: true },
      { name: "Monthly health coach consultation", included: true },
      { name: "Advanced PDF health reports", included: true },
      { name: "Priority customer support", included: true },
      { name: "Family account (up to 5 users)", included: true },
      { name: "API access", included: true },
    ],
  },
];

export default function Pricing({ onWaitlistClick }: PricingProps) {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-neutral-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold heading text-neutral-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Choose the plan that's right for your health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`
                bg-white rounded-xl shadow-lg overflow-hidden border 
                ${plan.isPopular 
                  ? 'border-2 border-primary transform md:-translate-y-4 scale-105 relative z-10' 
                  : 'border-neutral-200 transition-all hover:shadow-xl'
                }
              `}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className={`p-6 border-b border-neutral-200 ${plan.isPopular ? 'mt-6' : ''}`}>
                <h3 className="text-xl font-bold heading">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold heading">{plan.price}</span>
                  <span className="text-neutral-600 ml-1">{plan.period}</span>
                </div>
                <p className="mt-2 text-neutral-600">{plan.description}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.included ? (
                        <Check className="text-primary mt-1 mr-2 h-4 w-4" />
                      ) : (
                        <X className="text-neutral-400 mt-1 mr-2 h-4 w-4" />
                      )}
                      <span className={feature.included ? '' : 'text-neutral-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={onWaitlistClick}
                  className={`mt-6 w-full ${plan.isPopular 
                    ? 'bg-primary text-white shadow-md hover:bg-primary/90' 
                    : 'bg-white border-2 border-primary text-primary hover:bg-primary/5'
                  }`}
                  variant={plan.isPopular ? "default" : "outline"}
                >
                  Join Waitlist
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
