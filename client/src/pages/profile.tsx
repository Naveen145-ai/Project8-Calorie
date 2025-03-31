import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/use-auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  Mail, 
  Lock, 
  Bell, 
  Loader2, 
  Upload,
  Trash2,
  Shield,
  Save,
  LogOut
} from "lucide-react";

// Form schema for profile update
const profileFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  bio: z.string().max(160).optional(),
});

// Form schema for password change
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Form schema for notifications
const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
  mealPlanReminders: z.boolean().default(true),
  weeklyReports: z.boolean().default(true),
  foodLogReminders: z.boolean().default(true),
});

// Form schema for health information
const healthFormSchema = z.object({
  height: z.coerce.number().min(50, "Height must be at least 50cm").max(300, "Height must be less than 300cm"),
  weight: z.coerce.number().min(20, "Weight must be at least 20kg").max(300, "Weight must be less than 300kg"),
  gender: z.enum(["male", "female", "other"]),
  age: z.coerce.number().min(12, "Age must be at least 12").max(120, "Age must be less than 120"),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very-active"]),
  dietaryPreferences: z.array(z.string()).default([]),
  healthConditions: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
type HealthFormValues = z.infer<typeof healthFormSchema>;

// Diet options
const dietOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "low-carb", label: "Low Carb" },
];

// Health conditions options
const healthConditionsOptions = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "Hypertension" },
  { id: "heart-disease", label: "Heart Disease" },
  { id: "pcod", label: "PCOD" },
  { id: "thyroid", label: "Thyroid" },
  { id: "pregnancy", label: "Pregnancy" },
  { id: "high-cholesterol", label: "High Cholesterol" },
  { id: "ibs", label: "IBS" },
];

// Allergy options
const allergyOptions = [
  { id: "peanuts", label: "Peanuts" },
  { id: "tree-nuts", label: "Tree Nuts" },
  { id: "dairy", label: "Dairy" },
  { id: "eggs", label: "Eggs" },
  { id: "wheat", label: "Wheat" },
  { id: "soy", label: "Soy" },
  { id: "fish", label: "Fish" },
  { id: "shellfish", label: "Shellfish" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const { user, logoutMutation } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Profile form setup
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      username: user?.username || "",
      bio: "",
    },
  });

  // Password form setup
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Notifications form setup
  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: false,
      mealPlanReminders: true,
      weeklyReports: true,
      foodLogReminders: true,
    },
  });

  // Health info form setup
  const healthForm = useForm<HealthFormValues>({
    resolver: zodResolver(healthFormSchema),
    defaultValues: {
      height: 170,
      weight: 70,
      gender: "male",
      age: 30,
      activityLevel: "moderate",
      dietaryPreferences: [],
      healthConditions: [],
      allergies: [],
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const res = await apiRequest("PATCH", "/api/user", values);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (values: PasswordFormValues) => {
      const res = await apiRequest("POST", "/api/user/password", values);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Password Change Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update notifications mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: async (values: NotificationsFormValues) => {
      const res = await apiRequest("POST", "/api/user/notifications", values);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Notification Preferences Updated",
        description: "Your notification settings have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update health info mutation
  const updateHealthMutation = useMutation({
    mutationFn: async (values: HealthFormValues) => {
      const res = await apiRequest("POST", "/api/user/health-info", values);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Health Information Updated",
        description: "Your health profile has been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle avatar upload
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic
    toast({
      title: "Feature Not Available",
      description: "Account deletion is not implemented in this demo.",
    });
  };

  // Form submission handlers
  function onProfileSubmit(values: ProfileFormValues) {
    updateProfileMutation.mutate(values);
  }

  function onPasswordSubmit(values: PasswordFormValues) {
    updatePasswordMutation.mutate(values);
  }

  function onNotificationsSubmit(values: NotificationsFormValues) {
    updateNotificationsMutation.mutate(values);
  }

  function onHealthSubmit(values: HealthFormValues) {
    updateHealthMutation.mutate(values);
  }

  function handleLogout() {
    logoutMutation.mutate();
  }

  // Calculate BMI
  const calculateBMI = () => {
    const height = healthForm.getValues("height") / 100; // convert cm to meters
    const weight = healthForm.getValues("weight");
    
    if (height > 0 && weight > 0) {
      const bmi = weight / (height * height);
      return bmi.toFixed(1);
    }
    return "N/A";
  };

  // Get BMI category
  const getBMICategory = () => {
    const bmi = parseFloat(calculateBMI());
    
    if (isNaN(bmi)) return "N/A";
    
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  // Format activity level for display
  const formatActivityLevel = (level: string) => {
    switch(level) {
      case "sedentary": return "Sedentary (little or no exercise)";
      case "light": return "Light (exercise 1-3 times/week)";
      case "moderate": return "Moderate (exercise 3-5 times/week)";
      case "active": return "Active (exercise 6-7 times/week)";
      case "very-active": return "Very Active (intense exercise daily)";
      default: return level;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="md:w-1/4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={avatarPreview || user?.profilePic || ""} alt={user?.fullName || "User"} />
                      <AvatarFallback className="text-2xl">
                        {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1 rounded-full bg-primary text-white cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-medium text-lg">{user?.fullName || user?.username}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  
                  <div className="w-full pt-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                      <TabsList className="flex flex-col items-start w-full gap-1">
                        <TabsTrigger value="profile" className="w-full justify-start">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </TabsTrigger>
                        <TabsTrigger value="security" className="w-full justify-start">
                          <Lock className="mr-2 h-4 w-4" />
                          Password
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="w-full justify-start">
                          <Bell className="mr-2 h-4 w-4" />
                          Notifications
                        </TabsTrigger>
                        <TabsTrigger value="health" className="w-full justify-start">
                          <Shield className="mr-2 h-4 w-4" />
                          Health Profile
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            <Tabs value={activeTab} className="w-full">
              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and how others see you on the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <FormField
                          control={profileForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                This is your public display name.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                Your unique username for logging in and identification.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormDescription>
                                We'll use this email for notifications and account recovery.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Tell us a little about yourself..." 
                                  className="resize-none min-h-[100px]"
                                />
                              </FormControl>
                              <FormDescription>
                                Brief description about yourself. Max 160 characters.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Save Changes
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start border-t pt-6">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Trash2 className="mr-2 h-5 w-5 text-destructive" />
                      Delete Account
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Once you delete your account, there is no going back. This action cannot be undone.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                    >
                      Delete Account
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Password Tab */}
              <TabsContent value="security" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="mr-2 h-5 w-5" />
                      Security
                    </CardTitle>
                    <CardDescription>
                      Manage your password and account security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" />
                              </FormControl>
                              <FormDescription>
                                Enter your current password to verify your identity.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" />
                              </FormControl>
                              <FormDescription>
                                Your new password must be at least 8 characters.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" />
                              </FormControl>
                              <FormDescription>
                                Please confirm your new password.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={updatePasswordMutation.isPending}
                        >
                          {updatePasswordMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Update Password
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="mr-2 h-5 w-5" />
                      Notifications
                    </CardTitle>
                    <CardDescription>
                      Manage how you receive notifications and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...notificationsForm}>
                      <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                        <div className="space-y-4">
                          <FormField
                            control={notificationsForm.control}
                            name="emailNotifications"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Email Notifications</FormLabel>
                                  <FormDescription>
                                    Receive app notifications via email
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationsForm.control}
                            name="pushNotifications"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Push Notifications</FormLabel>
                                  <FormDescription>
                                    Receive push notifications on your device
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationsForm.control}
                            name="mealPlanReminders"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Meal Plan Reminders</FormLabel>
                                  <FormDescription>
                                    Get reminders about your meal plans
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationsForm.control}
                            name="weeklyReports"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Weekly Reports</FormLabel>
                                  <FormDescription>
                                    Receive weekly progress and nutrition reports
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationsForm.control}
                            name="foodLogReminders"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Food Log Reminders</FormLabel>
                                  <FormDescription>
                                    Get reminders to log your meals
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={updateNotificationsMutation.isPending}
                        >
                          {updateNotificationsMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Save Preferences
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Health Profile Tab */}
              <TabsContent value="health" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5" />
                      Health Profile
                    </CardTitle>
                    <CardDescription>
                      Update your health information to get personalized meal and workout plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mb-6 bg-muted rounded-md">
                      <div>
                        <p className="text-sm font-medium">BMI</p>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold">{calculateBMI()}</span>
                          <span className="text-sm text-muted-foreground mb-1">kg/m²</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{getBMICategory()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Activity Level</p>
                        <div className="text-xl font-semibold">
                          {formatActivityLevel(healthForm.getValues("activityLevel"))}
                        </div>
                      </div>
                    </div>
                    
                    <Form {...healthForm}>
                      <form onSubmit={healthForm.handleSubmit(onHealthSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={healthForm.control}
                            name="height"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Height (cm)</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={healthForm.control}
                            name="weight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Weight (kg)</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={healthForm.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={healthForm.control}
                            name="age"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={healthForm.control}
                          name="activityLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Activity Level</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select activity level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                                  <SelectItem value="light">Light (exercise 1-3 times/week)</SelectItem>
                                  <SelectItem value="moderate">Moderate (exercise 3-5 times/week)</SelectItem>
                                  <SelectItem value="active">Active (exercise 6-7 times/week)</SelectItem>
                                  <SelectItem value="very-active">Very Active (intense exercise daily)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                This helps calculate your daily calorie needs.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-medium mb-3">Dietary Preferences</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {dietOptions.map((diet) => (
                                <FormField
                                  key={diet.id}
                                  control={healthForm.control}
                                  name="dietaryPreferences"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={diet.id}
                                        className="flex flex-row items-start space-x-3 space-y-0 p-2 border rounded-md"
                                      >
                                        <FormControl>
                                          <input
                                            type="checkbox"
                                            checked={field.value?.includes(diet.id)}
                                            onChange={(e) => {
                                              const checked = e.target.checked;
                                              const currentValue = field.value || [];
                                              field.onChange(
                                                checked
                                                  ? [...currentValue, diet.id]
                                                  : currentValue.filter(value => value !== diet.id)
                                              );
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                          {diet.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-3">Health Conditions</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {healthConditionsOptions.map((condition) => (
                                <FormField
                                  key={condition.id}
                                  control={healthForm.control}
                                  name="healthConditions"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={condition.id}
                                        className="flex flex-row items-start space-x-3 space-y-0 p-2 border rounded-md"
                                      >
                                        <FormControl>
                                          <input
                                            type="checkbox"
                                            checked={field.value?.includes(condition.id)}
                                            onChange={(e) => {
                                              const checked = e.target.checked;
                                              const currentValue = field.value || [];
                                              field.onChange(
                                                checked
                                                  ? [...currentValue, condition.id]
                                                  : currentValue.filter(value => value !== condition.id)
                                              );
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                          {condition.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-3">Allergies</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {allergyOptions.map((allergy) => (
                                <FormField
                                  key={allergy.id}
                                  control={healthForm.control}
                                  name="allergies"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={allergy.id}
                                        className="flex flex-row items-start space-x-3 space-y-0 p-2 border rounded-md"
                                      >
                                        <FormControl>
                                          <input
                                            type="checkbox"
                                            checked={field.value?.includes(allergy.id)}
                                            onChange={(e) => {
                                              const checked = e.target.checked;
                                              const currentValue = field.value || [];
                                              field.onChange(
                                                checked
                                                  ? [...currentValue, allergy.id]
                                                  : currentValue.filter(value => value !== allergy.id)
                                              );
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                          {allergy.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={updateHealthMutation.isPending}
                        >
                          {updateHealthMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Save Health Profile
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}