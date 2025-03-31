import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2 bg-background shadow-md" : "py-3 bg-background/90"
      } bg-transparent`}
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
          <a href="#features" className="font-medium hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="font-medium hover:text-primary transition-colors">How It Works</a>
          <a href="#testimonials" className="font-medium hover:text-primary transition-colors">Testimonials</a>
          <a href="#waitlist" className="font-medium hover:text-primary transition-colors">Join Waitlist</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <Button asChild variant="outline" className="mr-2">
              <Link href="/auth">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth">Sign Up</Link>
            </Button>
          </div>
          
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}