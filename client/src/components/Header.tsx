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
                  <Link href="/">
                    <a className={`transition-colors hover:text-primary ${location === "/" ? "text-primary" : ""}`}>
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/scan-food">
                    <a className={`transition-colors hover:text-primary ${location === "/scan-food" ? "text-primary" : ""}`}>
                      Scan Food
                    </a>
                  </Link>
                  <Link href="/meal-planning">
                    <a className={`transition-colors hover:text-primary ${location === "/meal-planning" ? "text-primary" : ""}`}>
                      Meal Plan
                    </a>
                  </Link>
                  <Link href="/alternatives">
                    <a className={`transition-colors hover:text-primary ${location === "/alternatives" ? "text-primary" : ""}`}>
                      Alternatives
                    </a>
                  </Link>
                  <Link href="/workout-plans">
                    <a className={`transition-colors hover:text-primary ${location === "/workout-plans" ? "text-primary" : ""}`}>
                      Workout
                    </a>
                  </Link>
                  <Link href="/history">
                    <a className={`transition-colors hover:text-primary ${location === "/history" ? "text-primary" : ""}`}>
                      History
                    </a>
                  </Link>
                  <Link href="/recommendations">
                    <a className={`transition-colors hover:text-primary ${location === "/recommendations" ? "text-primary" : ""}`}>
                      For You
                    </a>
                  </Link>
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
                          <Link href="/dashboard">
                            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-primary/10 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                <rect width="3" height="9" x="7" y="7"></rect>
                                <rect width="3" height="5" x="14" y="7"></rect>
                              </svg>
                              Dashboard
                            </a>
                          </Link>
                          <Link href="/history">
                            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-primary/10 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              History
                            </a>
                          </Link>
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
                  <Link href="/scan-food">
                    <a className={`transition-colors hover:text-primary ${location === "/scan-food" ? "text-primary" : ""}`}>
                      Scan Food
                    </a>
                  </Link>
                  <Link href="/meal-planning">
                    <a className={`transition-colors hover:text-primary ${location === "/meal-planning" ? "text-primary" : ""}`}>
                      Meal Plan
                    </a>
                  </Link>
                  <Link href="/alternatives">
                    <a className={`transition-colors hover:text-primary ${location === "/alternatives" ? "text-primary" : ""}`}>
                      Alternatives
                    </a>
                  </Link>
                  <Link href="/workout-plans">
                    <a className={`transition-colors hover:text-primary ${location === "/workout-plans" ? "text-primary" : ""}`}>
                      Workout
                    </a>
                  </Link>
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