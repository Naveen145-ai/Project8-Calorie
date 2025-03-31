export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold heading text-neutral-900">
            How NutriScan Works
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Our platform makes nutrition tracking effortless with advanced AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="rounded-full w-16 h-16 flex items-center justify-center bg-primary text-white text-2xl font-bold mb-6 z-10 relative">1</div>
            <div className="absolute top-8 left-8 h-full w-0.5 bg-primary/20 z-0 hidden md:block"></div>
            <h3 className="text-xl font-bold heading mb-3">Snap a Photo</h3>
            <p className="text-neutral-600 mb-4">
              Take a picture of your meal or upload an existing food image.
            </p>
            <div className="rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?w=500&h=300&fit=crop" 
                  alt="Taking photo of food" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-full w-16 h-16 flex items-center justify-center bg-primary text-white text-2xl font-bold mb-6 z-10 relative">2</div>
            <div className="absolute top-8 left-8 h-full w-0.5 bg-primary/20 z-0 hidden md:block"></div>
            <h3 className="text-xl font-bold heading mb-3">AI Analysis</h3>
            <p className="text-neutral-600 mb-4">
              Our AI identifies foods and calculates nutritional content instantly.
            </p>
            <div className="rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop" 
                  alt="AI analyzing food" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-full w-16 h-16 flex items-center justify-center bg-primary text-white text-2xl font-bold mb-6 z-10 relative">3</div>
            <h3 className="text-xl font-bold heading mb-3">Get Recommendations</h3>
            <p className="text-neutral-600 mb-4">
              Receive personalized nutrition advice and meal planning suggestions.
            </p>
            <div className="rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1522844990619-4951c40f7eda?w=500&h=300&fit=crop" 
                  alt="Health recommendations" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
