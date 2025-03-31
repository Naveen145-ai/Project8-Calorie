import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import FoodAnalysis from "@/pages/food-analysis";
import MealPlanning from "@/pages/meal-planning";
import WorkoutPlans from "@/pages/workout-plans";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/food-analysis" component={FoodAnalysis} />
      <ProtectedRoute path="/meal-planning" component={MealPlanning} />
      <ProtectedRoute path="/workout-plans" component={WorkoutPlans} />
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
