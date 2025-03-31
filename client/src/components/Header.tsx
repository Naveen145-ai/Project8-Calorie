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
                </nav>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout}
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}