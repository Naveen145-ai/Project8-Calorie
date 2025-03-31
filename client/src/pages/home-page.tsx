import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CameraIcon, UtensilsIcon, Dumbbell, PersonStandingIcon, LogOutIcon } from "lucide-react";
import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome, {user?.username || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            Manage your nutrition and fitness journey with NutriScan AI
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Food Analysis Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <CameraIcon className="h-5 w-5 text-primary" />
                  Food Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload food images to get instant nutrition information and calorie estimates.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/food-analysis">Analyze Food</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Meal Planning Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <UtensilsIcon className="h-5 w-5 text-primary" />
                  Meal Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Get personalized meal plans based on your dietary preferences and health goals.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/meal-planning">Create Meal Plan</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Workout Plans Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  Workout Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate customized workout routines tailored to your fitness level and goals.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/workout-plans">Create Workout</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="flex items-center gap-2"
            disabled={logoutMutation.isPending}
          >
            <LogOutIcon className="h-4 w-4" />
            {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
          </Button>
        </div>
      </main>
      
      {/* ChatBot component */}
      <ChatBot />
    </div>
  );
}
