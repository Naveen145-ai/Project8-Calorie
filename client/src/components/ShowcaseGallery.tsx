import { motion } from "framer-motion";

interface GalleryItem {
  imageUrl: string;
  caption: string;
}

export default function ShowcaseGallery() {
  // Gallery items with high-quality stock images and captions
  const galleryItems: GalleryItem[] = [
    {
      imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      caption: "Breakfast nutrition analysis"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      caption: "Personalized yoga workout plans"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      caption: "Detailed nutritional breakdown"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      caption: "Calorie burning estimation"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      caption: "Food alternatives suggestions"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      caption: "Interactive workout instructions"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      caption: "Customized meal planning"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      caption: "AI-powered food recognition"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-montserrat mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Your Journey to Better Health
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Visualize how NutriScan AI transforms your health and nutrition experience
          </motion.p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryItems.map((item, index) => (
            <motion.div 
              key={index}
              className="relative group overflow-hidden rounded-xl aspect-square"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <img 
                src={item.imageUrl} 
                alt={item.caption} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                <span className="text-white font-medium text-sm">{item.caption}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
