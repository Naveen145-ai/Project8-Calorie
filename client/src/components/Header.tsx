import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, User, LogOut, Home, Camera, Utensils, Dumbbell, ChevronRight } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const isLandingPage = location === "/";

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    
    if (user.fullName) {
      const names = user.fullName.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return user.fullName[0].toUpperCase();
    }
    
    return user.username[0].toUpperCase();
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2 bg-background shadow-md" : "py-3 bg-background/90"
      } ${isLandingPage ? "bg-transparent" : ""}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <span className="font-bold text-xl">NutriScan<span className="text-primary">AI</span></span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {!isLandingPage && user && (
            <>
              <Link href="/dashboard" className={`font-medium hover:text-primary transition-colors ${location === "/dashboard" ? "text-primary" : ""}`}>
                Dashboard
              </Link>
              <Link href="/food-analysis" className={`font-medium hover:text-primary transition-colors ${location === "/food-analysis" ? "text-primary" : ""}`}>
                Food Analysis
              </Link>
              <Link href="/meal-planning" className={`font-medium hover:text-primary transition-colors ${location === "/meal-planning" ? "text-primary" : ""}`}>
                Meal Planning
              </Link>
              <Link href="/workout-plans" className={`font-medium hover:text-primary transition-colors ${location === "/workout-plans" ? "text-primary" : ""}`}>
                Workout Plans
              </Link>
            </>
          )}
          
          {isLandingPage && (
            <>
              <a href="#features" className="font-medium hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="font-medium hover:text-primary transition-colors">How It Works</a>
              <a href="#testimonials" className="font-medium hover:text-primary transition-colors">Testimonials</a>
              <a href="#waitlist" className="font-medium hover:text-primary transition-colors">Join Waitlist</a>
            </>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src={user.profilePic || ""} alt={user.username} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:block">
              <Button asChild variant="outline" className="mr-2">
                <Link href="/auth">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth">Sign Up</Link>
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="mb-6">
                <SheetTitle>NutriScanAI</SheetTitle>
                <SheetDescription>
                  AI-powered nutrition and fitness platform
                </SheetDescription>
              </SheetHeader>
              
              <div className="flex flex-col space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.profilePic || ""} alt={user.username} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.fullName || user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    <SheetClose asChild>
                      <Link href="/dashboard" className="flex items-center justify-between p-3 hover:bg-muted rounded-md">
                        <div className="flex items-center">
                          <Home className="mr-3 h-5 w-5" />
                          <span>Dashboard</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link href="/food-analysis" className="flex items-center justify-between p-3 hover:bg-muted rounded-md">
                        <div className="flex items-center">
                          <Camera className="mr-3 h-5 w-5" />
                          <span>Food Analysis</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link href="/meal-planning" className="flex items-center justify-between p-3 hover:bg-muted rounded-md">
                        <div className="flex items-center">
                          <Utensils className="mr-3 h-5 w-5" />
                          <span>Meal Planning</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </Link>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Link href="/workout-plans" className="flex items-center justify-between p-3 hover:bg-muted rounded-md">
                        <div className="flex items-center">
                          <Dumbbell className="mr-3 h-5 w-5" />
                          <span>Workout Plans</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </Link>
                    </SheetClose>
                    
                    <Button variant="ghost" className="flex items-center justify-start pl-3" onClick={handleLogout}>
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    {isLandingPage && (
                      <>
                        <SheetClose asChild>
                          <a href="#features" className="flex items-center p-3 hover:bg-muted rounded-md">
                            Features
                          </a>
                        </SheetClose>
                        <SheetClose asChild>
                          <a href="#how-it-works" className="flex items-center p-3 hover:bg-muted rounded-md">
                            How It Works
                          </a>
                        </SheetClose>
                        <SheetClose asChild>
                          <a href="#testimonials" className="flex items-center p-3 hover:bg-muted rounded-md">
                            Testimonials
                          </a>
                        </SheetClose>
                        <SheetClose asChild>
                          <a href="#waitlist" className="flex items-center p-3 hover:bg-muted rounded-md">
                            Join Waitlist
                          </a>
                        </SheetClose>
                      </>
                    )}
                    
                    <div className="mt-4 flex flex-col space-y-2">
                      <SheetClose asChild>
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/auth">Login</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild className="w-full">
                          <Link href="/auth">Sign Up</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
