import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Redirect to landing page
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6">Welcome to NutriScan AI</h1>
        <p className="mb-8 text-muted-foreground max-w-md mx-auto">
          You're now at the Home Page. Please visit our landing page to learn more about our platform.
        </p>
        <Button asChild size="lg">
          <Link href="/">Go to Landing Page</Link>
        </Button>
      </motion.div>
    </div>
  );
}
