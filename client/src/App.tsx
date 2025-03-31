import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import FoodAnalysis from "@/pages/food-analysis";
import MealPlanning from "@/pages/meal-planning";
import WorkoutPlans from "@/pages/workout-plans";
import AlternativesPage from "@/pages/alternatives";
import HistoryPage from "@/pages/history";
import ScanFood from "@/pages/scan-food";
import ChatBot from "@/components/ChatBot";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected routes that require authentication */}
      <ProtectedRoute path="/dashboard" component={HomePage} />
      <ProtectedRoute path="/scan-food" component={ScanFood} />
      <ProtectedRoute path="/food-analysis" component={FoodAnalysis} />
      <ProtectedRoute path="/meal-planning" component={MealPlanning} />
      <ProtectedRoute path="/alternatives" component={AlternativesPage} />
      <ProtectedRoute path="/workout-plans" component={WorkoutPlans} />
      <ProtectedRoute path="/history" component={HistoryPage} />
      
      {/* Fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
      <ChatBot />
    </>
  );
}

export default App;
