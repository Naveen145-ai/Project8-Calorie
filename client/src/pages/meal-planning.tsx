import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MealPlan } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import MealPlanCard from "@/components/MealPlanCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Utensils, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const dietaryPreferences = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "paleo", label: "Paleo" },
  { id: "keto", label: "Keto" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "mediterranean", label: "Mediterranean" },
];

const dietaryRestrictions = [
  { id: "nuts", label: "Nuts" },
  { id: "seafood", label: "Seafood" },
  { id: "soy", label: "Soy" },
  { id: "eggs", label: "Eggs" },
  { id: "wheat", label: "Wheat" },
  { id: "sesame", label: "Sesame" },
  { id: "shellfish", label: "Shellfish" },
];

const mealPlanFormSchema = z.object({
  calories: z.number().min(500, "Minimum 500 calories").max(5000, "Maximum 5000 calories"),
  preferences: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
});

type MealPlanFormValues = z.infer<typeof mealPlanFormSchema>;

export default function MealPlanning() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("create");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  // Form for generating meal plans
  const form = useForm<MealPlanFormValues>({
    resolver: zodResolver(mealPlanFormSchema),
    defaultValues: {
      calories: 2000,
      preferences: [],
      restrictions: [],
    },
  });

  // Query for meal plans
  const { data: mealPlans = [], isLoading: plansLoading } = useQuery<MealPlan[]>({
    queryKey: ["/api/meal-plans"],
  });

  // Generate meal plan mutation
  const generateMutation = useMutation({
    mutationFn: async (values: MealPlanFormValues) => {
      const res = await apiRequest("POST", "/api/meal-plans/generate", values);
      return await res.json();
    },
    onSuccess: (data: MealPlan) => {
      toast({
        title: "Meal Plan Generated",
        description: `Successfully created "${data.name}"`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meal-plans"] });
      setIsGenerateDialogOpen(false);
      setActiveTab("plans");
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete meal plan mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/meal-plans/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Meal plan deleted",
        description: "The meal plan has been removed."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meal-plans"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: MealPlanFormValues) {
    generateMutation.mutate(values);
  }

  const handleDeletePlan = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Meal Planning</h1>
            <p className="text-muted-foreground">Create personalized meal plans based on your preferences</p>
          </div>
          
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Generate Meal Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Meal Plan</DialogTitle>
                <DialogDescription>
                  Customize your daily meal plan based on your caloric needs and dietary preferences.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="calories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Calorie Target</FormLabel>
                        <div className="space-y-4">
                          <Slider
                            min={500}
                            max={5000}
                            step={50}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">500 kcal</span>
                            <span className="text-sm font-semibold">{field.value} kcal</span>
                            <span className="text-sm text-muted-foreground">5000 kcal</span>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="preferences"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Dietary Preferences</FormLabel>
                          <FormDescription>
                            Select the diet types you prefer to follow.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {dietaryPreferences.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="preferences"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="restrictions"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Dietary Restrictions</FormLabel>
                          <FormDescription>
                            Select any allergens or foods to avoid.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {dietaryRestrictions.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="restrictions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={generateMutation.isPending}
                      className="w-full"
                    >
                      {generateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Utensils className="mr-2 h-4 w-4" />
                      )}
                      Generate Meal Plan
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="create">Create Plan</TabsTrigger>
            <TabsTrigger value="plans">My Plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Generate a Meal Plan</CardTitle>
                  <CardDescription>
                    Create a personalized meal plan based on your preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Our AI will generate a custom meal plan based on your caloric needs,
                    dietary preferences, and restrictions. Each meal comes with detailed
                    recipes and nutritional information.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <Utensils className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-1">Balanced Nutrition</h3>
                      <p className="text-xs text-muted-foreground">Optimized macro ratios</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <h3 className="font-semibold mb-1">Custom Preferences</h3>
                      <p className="text-xs text-muted-foreground">Tailored to your diet</p>
                    </div>
                  </div>
                  
                  <Button onClick={() => setIsGenerateDialogOpen(true)} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Meal Plan
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>
                    Our AI creates personalized meal plans just for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Set Your Calorie Target</h3>
                      <p className="text-sm text-muted-foreground">
                        Specify your daily caloric needs based on your goals
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Choose Dietary Preferences</h3>
                      <p className="text-sm text-muted-foreground">
                        Select your preferred diet types and any restrictions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Plan Generation</h3>
                      <p className="text-sm text-muted-foreground">
                        Our AI creates a balanced meal plan with breakfast, lunch, dinner, and snacks
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="font-semibold text-primary">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Get Recipes & Instructions</h3>
                      <p className="text-sm text-muted-foreground">
                        Each meal includes ingredients, preparation steps, and complete nutritional information
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="plans" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Meal Plans</CardTitle>
                <CardDescription>Personalized plans to meet your nutritional goals</CardDescription>
              </CardHeader>
              <CardContent>
                {plansLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : mealPlans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mealPlans.map((plan) => (
                      <MealPlanCard 
                        key={plan.id}
                        mealPlan={plan}
                        onDelete={() => handleDeletePlan(plan.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No meal plans created yet</p>
                    <Button onClick={() => setIsGenerateDialogOpen(true)}>
                      Generate Your First Meal Plan
                    </Button>
                  </div>
                )}
              </CardContent>
              {mealPlans.length > 0 && (
                <CardFooter>
                  <Button 
                    onClick={() => setIsGenerateDialogOpen(true)}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Another Meal Plan
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
