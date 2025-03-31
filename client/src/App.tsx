import React from 'react';
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
import ProfilePage from "@/pages/profile";
import RecommendationsPage from "@/pages/recommendations";
import { ProtectedRoute } from "./lib/protected-route";

// Create a wrapper for authenticated pages
const AuthenticatedPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ChatBot = React.lazy(() => import('@/components/ChatBot'));
  
  return (
    <>
      {children}
      <React.Suspense fallback={null}>
        <ChatBot />
      </React.Suspense>
    </>
  );
};

// Component to wrap each protected route
const ProtectedPageWithChat: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  return (
    <AuthenticatedPageWrapper>
      <Component />
    </AuthenticatedPageWrapper>
  );
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Public routes (not redirecting to login) */}
      <Route path="/scan-food" component={ScanFood} />
      <Route path="/meal-planning" component={MealPlanning} />
      <Route path="/alternatives" component={AlternativesPage} />
      <Route path="/workout-plans" component={WorkoutPlans} />
      
      {/* Protected routes that require authentication */}
      <ProtectedRoute path="/dashboard" component={() => <ProtectedPageWithChat component={HomePage} />} />
      <ProtectedRoute path="/food-analysis" component={() => <ProtectedPageWithChat component={FoodAnalysis} />} />
      <ProtectedRoute path="/history" component={() => <ProtectedPageWithChat component={HistoryPage} />} />
      <ProtectedRoute path="/recommendations" component={() => <ProtectedPageWithChat component={RecommendationsPage} />} />
      <ProtectedRoute path="/profile" component={() => <ProtectedPageWithChat component={ProfilePage} />} />
      
      {/* Fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const ChatBot = React.lazy(() => import('@/components/ChatBot'));
  
  return (
    <>
      <Router />
      <Toaster />
      <React.Suspense fallback={null}>
        <ChatBot />
      </React.Suspense>
    </>
  );
}

export default App;
