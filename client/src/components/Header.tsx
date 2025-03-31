import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">NutriScan<span className="text-primary">AI</span></span>
        </Link>

        {isMobile ? (
          <MobileNav />
        ) : (
          <>
            {user ? (
              <div className="flex items-center gap-6">
                <nav className="flex items-center space-x-4 text-sm font-medium">
                  <span 
                    onClick={() => window.location.href = '/'}
                    className={`transition-colors hover:text-primary ${location === "/" ? "text-primary" : ""} cursor-pointer`}>
                    Dashboard
                  </span>
                  <span 
                    onClick={() => window.location.href = '/scan-food'}
                    className={`transition-colors hover:text-primary ${location === "/scan-food" ? "text-primary" : ""} cursor-pointer`}>
                    Scan Food
                  </span>
                  <span 
                    onClick={() => window.location.href = '/meal-planning'}
                    className={`transition-colors hover:text-primary ${location === "/meal-planning" ? "text-primary" : ""} cursor-pointer`}>
                    Meal Plan
                  </span>
                  <span 
                    onClick={() => window.location.href = '/alternatives'}
                    className={`transition-colors hover:text-primary ${location === "/alternatives" ? "text-primary" : ""} cursor-pointer`}>
                    Alternatives
                  </span>
                  <span 
                    onClick={() => window.location.href = '/workout-plans'}
                    className={`transition-colors hover:text-primary ${location === "/workout-plans" ? "text-primary" : ""} cursor-pointer`}>
                    Workout
                  </span>
                  <span 
                    onClick={() => window.location.href = '/history'}
                    className={`transition-colors hover:text-primary ${location === "/history" ? "text-primary" : ""} cursor-pointer`}>
                    History
                  </span>
                  <span 
                    onClick={() => window.location.href = '/recommendations'}
                    className={`transition-colors hover:text-primary ${location === "/recommendations" ? "text-primary" : ""} cursor-pointer`}>
                    For You
                  </span>
                </nav>

                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <button className="flex items-center gap-2 p-2 rounded-full hover:bg-muted transition-colors">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold border-2 border-primary/30">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{user.username}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:rotate-180">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>
                    
                    {/* Profile dropdown */}
                    <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2 rounded-md shadow-md bg-card border border-border">
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-sm font-medium">{user.fullName || user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        
                        <div className="px-2 py-2">
                          <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-primary/10 transition-colors cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                              <rect width="3" height="9" x="7" y="7"></rect>
                              <rect width="3" height="5" x="14" y="7"></rect>
                            </svg>
                            Dashboard
                          </div>
                          <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-primary/10 transition-colors cursor-pointer" onClick={() => window.location.href = '/profile'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Profile
                          </div>
                          <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-primary/10 transition-colors cursor-pointer" onClick={() => window.location.href = '/history'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            History
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <nav className="flex items-center space-x-4 text-sm font-medium">
                  <span 
                    onClick={() => window.location.href = '/scan-food'}
                    className={`transition-colors hover:text-primary ${location === "/scan-food" ? "text-primary" : ""} cursor-pointer`}>
                    Scan Food
                  </span>
                  <span 
                    onClick={() => window.location.href = '/meal-planning'}
                    className={`transition-colors hover:text-primary ${location === "/meal-planning" ? "text-primary" : ""} cursor-pointer`}>
                    Meal Plan
                  </span>
                  <span 
                    onClick={() => window.location.href = '/alternatives'}
                    className={`transition-colors hover:text-primary ${location === "/alternatives" ? "text-primary" : ""} cursor-pointer`}>
                    Alternatives
                  </span>
                  <span 
                    onClick={() => window.location.href = '/workout-plans'}
                    className={`transition-colors hover:text-primary ${location === "/workout-plans" ? "text-primary" : ""} cursor-pointer`}>
                    Workout
                  </span>
                </nav>
                <div className="flex items-center gap-3">
                  <Link href="/auth">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/auth?tab=register">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}