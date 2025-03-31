import { 
  Camera, 
  ChartPie, 
  Utensils, 
  CalendarRange, 
  Dumbbell, 
  FileText 
} from "lucide-react";

const features = [
  {
    icon: <Camera className="text-2xl" />,
    title: "AI Food Recognition",
    description: "Simply snap a photo of your meal and our AI will identify foods and estimate nutritional content."
  },
  {
    icon: <ChartPie className="text-2xl" />,
    title: "Detailed Nutrition Analysis",
    description: "Get comprehensive breakdown of calories, macros, vitamins, and minerals in your meals."
  },
  {
    icon: <Utensils className="text-2xl" />,
    title: "Food Alternatives",
    description: "Discover healthier alternatives to your favorite foods with similar taste profiles."
  },
  {
    icon: <CalendarRange className="text-2xl" />,
    title: "Custom Meal Planning",
    description: "Generate personalized meal plans based on your preferences, goals, and dietary restrictions."
  },
  {
    icon: <Dumbbell className="text-2xl" />,
    title: "Workout Planner",
    description: "Create customized workout routines with visual guides and calorie burning estimates."
  },
  {
    icon: <FileText className="text-2xl" />,
    title: "PDF Health Reports",
    description: "Download comprehensive reports of your nutritional intake and progress over time."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold heading text-neutral-900">
            Powerful Features for Your Nutrition Journey
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            NutriScan gives you all the tools you need to understand and improve your eating habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card bg-white rounded-xl p-6 shadow-lg transition-all duration-300 
                border border-neutral-200 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold heading mb-3">{feature.title}</h3>
              <p className="text-neutral-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl overflow-hidden shadow-xl">
            <div className="aspect-w-4 aspect-h-3 bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop" 
                alt="Healthy meal with nutrition analysis overlay" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="p-5 bg-white">
              <h3 className="text-xl font-bold heading">Food Recognition & Analysis</h3>
              <p className="text-neutral-600 mt-2">Instantly analyze your meals with detailed nutritional breakdown</p>
            </div>
          </div>
          
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop" 
                    alt="Workout activity tracking" 
                    className="w-full h-48 object-cover" 
                  />
                </div>
                <div className="p-4 bg-white">
                  <h4 className="font-bold heading">Workout Tracking</h4>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden shadow-lg">
                <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=400&h=300&fit=crop" 
                    alt="Meal planning calendar" 
                    className="w-full h-48 object-cover" 
                  />
                </div>
                <div className="p-4 bg-white">
                  <h4 className="font-bold heading">Meal Planning</h4>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden shadow-lg">
                <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=400&h=300&fit=crop" 
                    alt="Food alternatives comparison" 
                    className="w-full h-48 object-cover" 
                  />
                </div>
                <div className="p-4 bg-white">
                  <h4 className="font-bold heading">Food Alternatives</h4>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden shadow-lg">
                <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1522844990619-4951c40f7eda?w=400&h=300&fit=crop" 
                    alt="Health reports and analytics" 
                    className="w-full h-48 object-cover" 
                  />
                </div>
                <div className="p-4 bg-white">
                  <h4 className="font-bold heading">Health Reports</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
