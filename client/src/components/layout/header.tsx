import { useState } from "react";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Leaf, Menu, User, LogOut, ChevronDown, Home, Camera, Utensils, Dumbbell, History, FileText } from "lucide-react";

interface HeaderProps {
  onWaitlistClick?: () => void;
}

export default function Header({ onWaitlistClick }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isHomePage = location === "/";
  const userInitials = user?.fullName 
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() 
    : user?.username?.substring(0, 2).toUpperCase() || "US";
  
  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5 mr-2" /> },
    { name: "Food Analysis", href: "/food-analysis", icon: <Camera className="h-5 w-5 mr-2" /> },
    { name: "Meal Planning", href: "/meal-planning", icon: <Utensils className="h-5 w-5 mr-2" /> },
    { name: "Workout Planner", href: "/workout-planner", icon: <Dumbbell className="h-5 w-5 mr-2" /> },
    { name: "History", href: "/history", icon: <History className="h-5 w-5 mr-2" /> },
  ];
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Link href={user ? "/dashboard" : "/"} className="flex items-center">
              <div className="text-primary text-3xl mr-1">
                <Leaf className="h-8 w-8" />
              </div>
              <span className="text-xl md:text-2xl font-bold heading text-neutral-900">NutriScan</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          {user && (
            <nav className="hidden md:flex space-x-6 items-center">
              {navigationItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a className={`text-sm font-medium transition-colors ${location === item.href ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
          )}
          
          {isHomePage && !user && (
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#features" className="text-muted-foreground hover:text-primary font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary font-medium transition-colors">How It Works</a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary font-medium transition-colors">Pricing</a>
            </nav>
          )}
          
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src="" alt={user.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.fullName || user.username}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <div className="flex items-center w-full cursor-pointer">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/history">
                      <div className="flex items-center w-full cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>My Reports</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-2 font-normal text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" className="hidden md:flex">Login</Button>
                </Link>
                {isHomePage ? (
                  <Button onClick={onWaitlistClick}>Join Waitlist</Button>
                ) : (
                  <Link href="/">
                    <Button>Back to Home</Button>
                  </Link>
                )}
              </>
            )}
            
            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-8 mt-4">
                    <Leaf className="h-6 w-6 text-primary mr-2" />
                    <span className="text-xl font-bold heading">NutriScan</span>
                  </div>
                  
                  {user ? (
                    <>
                      <div className="flex items-center mb-6 pb-6 border-b">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.fullName || user.username}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      <nav className="flex flex-col space-y-1 flex-grow">
                        {navigationItems.map((item) => (
                          <Link key={item.name} href={item.href}>
                            <a 
                              className={`flex items-center py-3 px-2 rounded-lg text-sm ${
                                location === item.href
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-muted-foreground hover:bg-muted'
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.icon}
                              {item.name}
                            </a>
                          </Link>
                        ))}
                      </nav>
                      
                      <div className="pt-6 mt-auto border-t">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {isHomePage && (
                        <nav className="flex flex-col space-y-1 mb-6">
                          <a 
                            href="#features" 
                            className="flex items-center py-3 px-2 rounded-lg text-muted-foreground hover:bg-muted"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Features
                          </a>
                          <a 
                            href="#how-it-works" 
                            className="flex items-center py-3 px-2 rounded-lg text-muted-foreground hover:bg-muted"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            How It Works
                          </a>
                          <a 
                            href="#pricing" 
                            className="flex items-center py-3 px-2 rounded-lg text-muted-foreground hover:bg-muted"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Pricing
                          </a>
                        </nav>
                      )}
                      
                      <div className="flex flex-col space-y-3 mt-auto">
                        <Link href="/auth">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Login
                          </Button>
                        </Link>
                        {isHomePage ? (
                          <Button 
                            className="w-full"
                            onClick={() => {
                              if (onWaitlistClick) onWaitlistClick();
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            Join Waitlist
                          </Button>
                        ) : (
                          <Link href="/">
                            <Button 
                              className="w-full"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Back to Home
                            </Button>
                          </Link>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
