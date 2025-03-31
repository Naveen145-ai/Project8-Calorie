import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Home, Camera, UtensilsCrossed, Salad, Dumbbell, History, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const menuItems = [
    { label: "Dashboard", icon: <Home className="w-5 h-5 mr-2" />, href: "/" },
    { label: "Scan Food", icon: <Camera className="w-5 h-5 mr-2" />, href: "/scan-food" },
    { label: "Meal Plan", icon: <UtensilsCrossed className="w-5 h-5 mr-2" />, href: "/meal-planning" },
    { label: "Alternatives", icon: <Salad className="w-5 h-5 mr-2" />, href: "/alternatives" },
    { label: "Workout", icon: <Dumbbell className="w-5 h-5 mr-2" />, href: "/workout-plans" },
    { label: "History", icon: <History className="w-5 h-5 mr-2" />, href: "/history" },
    { label: "For You", icon: <Sparkles className="w-5 h-5 mr-2" />, href: "/recommendations" },
  ];

  return (
    <div className="block md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:bg-primary/10"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] sm:w-[350px]">
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <span className="font-bold text-lg">NutriScan<span className="text-primary">AI</span></span>
              </Link>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium">Welcome back</p>
                  <p className="text-base font-bold">{user.username}</p>
                </div>
                {menuItems.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link href={item.href}>
                      <Button
                        variant={location === item.href ? "default" : "ghost"}
                        className="justify-start w-full text-left"
                      >
                        {item.icon}
                        {item.label}
                      </Button>
                    </Link>
                  </SheetClose>
                ))}
                <Button
                  variant="outline" 
                  className="justify-start w-full mt-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <SheetClose asChild>
                  <Link href="/">
                    <Button
                      variant={location === "/" ? "default" : "ghost"}
                      className="justify-start w-full text-left"
                    >
                      <Home className="w-5 h-5 mr-2" />
                      Home
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/scan-food">
                    <Button
                      variant={location === "/scan-food" ? "default" : "ghost"}
                      className="justify-start w-full text-left"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Scan Food
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/meal-planning">
                    <Button
                      variant={location === "/meal-planning" ? "default" : "ghost"}
                      className="justify-start w-full text-left"
                    >
                      <UtensilsCrossed className="w-5 h-5 mr-2" />
                      Meal Plan
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/alternatives">
                    <Button
                      variant={location === "/alternatives" ? "default" : "ghost"}
                      className="justify-start w-full text-left"
                    >
                      <Salad className="w-5 h-5 mr-2" />
                      Alternatives
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/workout-plans">
                    <Button
                      variant={location === "/workout-plans" ? "default" : "ghost"}
                      className="justify-start w-full text-left"
                    >
                      <Dumbbell className="w-5 h-5 mr-2" />
                      Workout
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/auth">
                    <Button
                      variant="default"
                      className="w-full mt-4"
                    >
                      Sign In / Register
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}