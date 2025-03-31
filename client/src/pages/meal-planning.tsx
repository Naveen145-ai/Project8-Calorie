import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MealPlanner from "@/components/meal-planning/meal-planner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Utensils, CalendarDays, Badge, ChevronRight } from "lucide-react";

export default function MealPlanning() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("create");
  
  // Fetch existing meal plans
  const { data: mealPlans, isLoading: isLoadingMealPlans, refetch } = useQuery({
    queryKey: ["/api/meal-plans"],
    enabled: !!user,
  });
  
  // Create meal plan mutation
  const createMealPlanMutation = useMutation({
    mutationFn: async (mealPlanData: any) => {
      const res = await fetch("/api/meal-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealPlanData),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create meal plan");
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Meal plan created",
        description: "Your meal plan has been saved successfully",
      });
      refetch();
      setActiveTab("saved");
    },
    onError: (error) => {
      toast({
        title: "Failed to create meal plan",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleCreateMealPlan = (mealPlanData: any) => {
    createMealPlanMutation.mutate(mealPlanData);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold heading">Meal Planning</h1>
          <p className="text-muted-foreground mt-1">Create and manage your personalized meal plans</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Utensils className="mr-2 h-5 w-5 text-primary" />
                Meal Plans
              </CardTitle>
              <TabsList>
                <TabsTrigger 
                  value="create" 
                  onClick={() => setActiveTab("create")}
                  disabled={createMealPlanMutation.isPending}
                >
                  Create New
                </TabsTrigger>
                <TabsTrigger 
                  value="saved" 
                  onClick={() => setActiveTab("saved")}
                  disabled={createMealPlanMutation.isPending}
                >
                  Saved Plans
                </TabsTrigger>
              </TabsList>
            </div>
            <CardDescription>
              {activeTab === "create" 
                ? "Create a personalized meal plan based on your preferences" 
                : "View and edit your saved meal plans"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === "create" ? (
              <MealPlanner 
                onSave={handleCreateMealPlan}
                isSaving={createMealPlanMutation.isPending}
              />
            ) : (
              <div>
                {isLoadingMealPlans ? (
                  <div className="py-10 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your meal plans...</p>
                  </div>
                ) : mealPlans && mealPlans.length > 0 ? (
                  <div className="space-y-6">
                    {mealPlans.map((plan: any) => (
                      <Card key={plan.id} className="overflow-hidden">
                        <div className="bg-primary/5 p-4 border-b">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">{plan.name}</h3>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {JSON.parse(plan.meals).length} meals
                            </Badge>
                          </div>
                          {plan.description && (
                            <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {JSON.parse(plan.meals).slice(0, 3).map((meal: any, index: number) => (
                              <div key={index} className="border rounded-lg p-3">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-medium">{meal.name}</h4>
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                    {meal.type}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {meal.description || "No description"}
                                </p>
                                <div className="flex text-xs text-muted-foreground">
                                  <span className="mr-3">{meal.calories || "?"} kcal</span>
                                  <span>{meal.protein || "?"} g protein</span>
                                </div>
                              </div>
                            ))}
                            {JSON.parse(plan.meals).length > 3 && (
                              <div className="border rounded-lg p-3 flex items-center justify-center">
                                <Button variant="ghost" size="sm">
                                  View {JSON.parse(plan.meals).length - 3} more <ChevronRight className="ml-1 h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarDays className="h-4 w-4 mr-1" />
                              <span>Created {new Date(plan.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <Button size="sm" variant="outline" className="mr-2">
                                Edit
                              </Button>
                              <Button size="sm" variant="default">
                                View Full Plan
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Utensils className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Meal Plans Yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first personalized meal plan</p>
                    <Button onClick={() => setActiveTab("create")}>Create Meal Plan</Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
