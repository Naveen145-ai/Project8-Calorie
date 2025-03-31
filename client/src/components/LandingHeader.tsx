import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

export default function LandingHeader() {
  const isMobile = useIsMobile();

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
          <div className="flex items-center gap-4">
            <nav className="flex items-center space-x-6 mr-4 text-sm font-medium">
              <Link href="#features">
                <a className="transition-colors hover:text-primary">Features</a>
              </Link>
              <Link href="#how-it-works">
                <a className="transition-colors hover:text-primary">How It Works</a>
              </Link>
              <Link href="#faq">
                <a className="transition-colors hover:text-primary">FAQ</a>
              </Link>
            </nav>
            <Link href="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth?tab=register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}