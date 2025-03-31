import { Link } from "wouter";
import LandingHeader from "@/components/LandingHeader";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import ShowcaseGallery from "@/components/ShowcaseGallery";
import FaqAccordion from "@/components/FaqAccordion";
import WaitlistForm from "@/components/WaitlistForm";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  {
    icon: "camera",
    title: "Food Recognition",
    description: "Simply take a photo of your meal and our AI instantly identifies all food items with impressive accuracy."
  },
  {
    icon: "pie-chart",
    title: "Nutrition Analysis",
    description: "Get detailed breakdown of calories, macros, vitamins, and minerals from your meals in seconds."
  },
  {
    icon: "utensils",
    title: "Meal Planning",
    description: "Receive customized meal plans based on your dietary preferences, restrictions, and health goals."
  },
  {
    icon: "activity",
    title: "Workout Creator",
    description: "Generate personalized workout routines that complement your nutrition plan for optimal results."
  },
  {
    icon: "file-text",
    title: "PDF Reports",
    description: "Export comprehensive nutrition reports to share with healthcare providers or track your progress."
  },
  {
    icon: "refresh-cw",
    title: "Food Alternatives",
    description: "Discover healthier alternatives to your favorite foods with similar taste profiles but better nutrition."
  }
];

const testimonials = [
  {
    content: "The food recognition is mind-blowing! I take a quick snap of my lunch and instantly get all the nutritional info. It's helping me make smarter choices every day.",
    author: "Sarah J.",
    role: "Fitness Enthusiast",
    rating: 5
  },
  {
    content: "As a busy professional, meal planning used to be a hassle. NutriScan has changed that completely. The AI suggestions are spot on and the workout plans complement my nutrition perfectly.",
    author: "Michael T.",
    role: "Tech Executive",
    rating: 5
  },
  {
    content: "I've tried many nutrition apps before, but the accuracy and personalization of NutriScan AI is unmatched. It's helping me manage my health conditions through diet in ways I never thought possible.",
    author: "Elena R.",
    role: "Health Coach",
    rating: 4.5
  }
];

const faqs = [
  {
    question: "How accurate is the food recognition?",
    answer: "NutriScan AI uses advanced computer vision technology that can identify thousands of food items with over 95% accuracy. Our system is continuously learning and improving with each use."
  },
  {
    question: "When will NutriScan AI be available?",
    answer: "We're currently in the final stages of development. Join our waitlist to be among the first to gain access when we launch!"
  },
  {
    question: "Will it work for international cuisines?",
    answer: "Yes! NutriScan AI is trained on a diverse database of foods from around the world. We currently support recognition for over 30 different cuisines and are continuously adding more."
  },
  {
    question: "How is my health data protected?",
    answer: "NutriScan AI takes data security seriously. All your personal health information is encrypted and stored securely. We never share your data with third parties without your explicit consent."
  },
  {
    question: "Is there a free version available?",
    answer: "Yes! NutriScan AI will offer a free basic version with limited features and a premium subscription with full access to all features. Waitlist members will receive special pricing on premium subscriptions."
  }
];

const LandingPage = () => {
  return (
    <div className="font-sans text-foreground bg-background">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-primary via-primary/90 to-primary-light relative overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10 mb-10 md:mb-0">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI-Powered Nutrition <span className="text-accent-light">Simplified</span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-white opacity-90 mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Take a photo of your food, get instant nutrition analysis, and unlock personalized meal plans tailored to your health goals.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold text-lg rounded-full py-6 px-8">
                <Link href="/auth">Get Started</Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold text-lg rounded-full py-6 px-8">
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </motion.div>
          </div>
          
          <div className="md:w-1/2 relative z-10">
            <motion.div 
              className="relative mx-auto max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Smartphone showing NutriScan app analyzing a healthy meal" 
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-accent text-white text-sm font-bold rounded-full px-4 py-1 shadow-lg animate-pulse">
                AI-powered
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="hidden md:block absolute top-1/4 left-10 w-20 h-20 rounded-full bg-white opacity-10"></div>
        <div className="hidden md:block absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-white opacity-10"></div>
        <div className="hidden md:block absolute top-1/2 left-1/4 w-12 h-12 rounded-full bg-white opacity-10"></div>
      </section>
      
      {/* Trust Indicators */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-muted-foreground font-medium">Backed by nutrition experts and cutting-edge AI technology</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="font-medium">Certified Nutritionists</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="font-medium">USDA Database Integrated</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="font-medium">Advanced AI Recognition</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="font-medium">Personalized Insights</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section id="features" className="py-16 md:py-24 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">Revolutionize Your Health Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover the powerful features that make NutriScan AI your ultimate nutrition companion.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">How NutriScan AI Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Experience nutrition simplified in three easy steps</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-16">
            <div className="lg:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-xl aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Person taking photo of food with smartphone" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/70 flex items-end">
                  <div className="p-6">
                    <span className="bg-primary text-white text-sm font-bold rounded-full px-4 py-1">Step 1</span>
                    <h3 className="text-white text-xl font-bold mt-2">Snap a Photo</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-xl aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1615398606956-9628768fd945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Smartphone showing nutrition analysis interface" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/70 flex items-end">
                  <div className="p-6">
                    <span className="bg-secondary text-white text-sm font-bold rounded-full px-4 py-1">Step 2</span>
                    <h3 className="text-white text-xl font-bold mt-2">Get Instant Analysis</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="lg:w-2/3">
              <div className="relative rounded-xl overflow-hidden shadow-xl aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Personalized meal plan and health dashboard" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/70 flex items-end">
                  <div className="p-6">
                    <span className="bg-accent text-white text-sm font-bold rounded-full px-4 py-1">Step 3</span>
                    <h3 className="text-white text-xl font-bold mt-2">Receive Personalized Recommendations</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Showcase Gallery */}
      <ShowcaseGallery />
      
      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">Early Access Feedback</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">See what our beta testers are saying about NutriScan AI</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-neutral-50 rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="text-primary">
                    {Array.from({ length: Math.floor(testimonial.rating) }).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    {testimonial.rating % 1 !== 0 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" className="text-gray-300" />
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipPath="url(#half-star)" />
                        <defs>
                          <clipPath id="half-star">
                            <rect x="0" y="0" width="10" height="20" />
                          </clipPath>
                        </defs>
                      </svg>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-muted mr-4"></div>
                  <div>
                    <h4 className="font-bold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Waitlist */}
      <section id="waitlist" className="py-16 md:py-24 bg-neutral-100 bg-[radial-gradient(#4CAF50_0.5px,transparent_0.5px),radial-gradient(#4CAF50_0.5px,#F5F5F5_0.5px)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] bg-fixed">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-primary p-8 md:p-12 text-white">
                <h2 className="text-3xl font-bold font-montserrat mb-4">Be the First to Experience NutriScan AI</h2>
                <p className="mb-6">Join our exclusive waitlist today and receive:</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 mr-3 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Early access when we launch</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 mr-3 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>30% discount on premium features</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 mr-3 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Personalized onboarding session</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 mr-3 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Exclusive health resources</span>
                  </li>
                </ul>
                <div className="hidden md:flex items-center space-x-4">
                  <span className="text-sm">Coming soon to:</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5 3A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3h11zm0 1h-11a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5zm-5.5 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                  </svg>
                </div>
              </div>
              
              <div className="md:w-1/2 p-8 md:p-12">
                <WaitlistForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to know about NutriScan AI</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
