import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import FoodAnalysis from "@/pages/food-analysis";
import MealPlanning from "@/pages/meal-planning";
import WorkoutPlans from "@/pages/workout-plans";
import { ProtectedRoute } from "./lib/protected-route";

// These pages need to be created
const ScanFood = () => <div>Scan Food Page Coming Soon</div>; // Placeholder until we create it
const AlternativesPage = () => <div>Alternatives Page Coming Soon</div>; // Placeholder until we create it
const HistoryPage = () => <div>History Page Coming Soon</div>; // Placeholder until we create it

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
    </>
  );
}

export default App;
