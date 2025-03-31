import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Extended schemas with validation
const registerSchema = insertUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const { toast } = useToast();

  // Create register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Create login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Handle register form submission
  function onRegisterSubmit(data: RegisterFormValues) {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData, {
      onSuccess: () => {
        // After successful registration, switch to the login tab
        setActiveTab("login");
        // Show success toast
        toast({
          title: "Registration successful",
          description: "Please log in with your new account",
        });
      },
    });
  }

  // Handle login form submission
  function onLoginSubmit(data: LoginFormValues) {
    loginMutation.mutate(data, {
      onSuccess: () => {
        // Force a reload of the user data
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        // Redirect to dashboard or home
        navigate("/");
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Form */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span className="font-bold text-xl text-foreground">NutriScan<span className="text-primary">AI</span></span>
            </Link>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="space-y-4">
                <div className="text-center">
                  <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                  <p className="text-sm text-muted-foreground mt-1">Enter your credentials to access your account</p>
                </div>
                
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending || isLoading}
                    >
                      {loginMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Sign In
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <div className="space-y-4">
                <div className="text-center">
                  <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
                  <p className="text-sm text-muted-foreground mt-1">Enter your details to create your account</p>
                </div>
                
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending || isLoading}
                    >
                      {registerMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Create Account
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Hero/Promo */}
      <div className="md:w-1/2 bg-gradient-to-br from-primary to-primary-dark p-8 flex flex-col justify-center items-center text-white">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4">Transform Your Health Journey</h2>
          <p className="mb-6">
            Join NutriScan AI to unlock a personalized nutrition experience. Upload food images for instant analysis, get customized meal plans, and track your health progress with our AI-powered platform.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5z"></path>
                  <path d="M9 8h1"></path>
                  <path d="M14 8h1"></path>
                  <path d="M9 12h6"></path>
                  <path d="M9 16h6"></path>
                </svg>
                Food Analysis
              </div>
              <p className="text-sm mt-2">Instant nutrition details from food photos</p>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                Meal Plans
              </div>
              <p className="text-sm mt-2">Personalized nutrition plans for your goals</p>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
                Workouts
              </div>
              <p className="text-sm mt-2">Custom exercise routines that fit your lifestyle</p>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                Reports
              </div>
              <p className="text-sm mt-2">Comprehensive health reports and insights</p>
            </div>
          </div>
          
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Healthy food plate" 
            className="rounded-xl shadow-lg mx-auto mb-6 max-w-xs"
          />
        </div>
      </div>
    </div>
  );
}
