import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WorkoutCreator from "@/components/workout/workout-creator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Calendar, Clock, User, FlameIcon } from "lucide-react";

export default function WorkoutPlanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("create");
  
  // Fetch existing workout plans
  const { data: workoutPlans, isLoading: isLoadingWorkoutPlans, refetch } = useQuery({
    queryKey: ["/api/workout-plans"],
    enabled: !!user,
  });
  
  // Create workout plan mutation
  const createWorkoutPlanMutation = useMutation({
    mutationFn: async (workoutPlanData: any) => {
      const res = await fetch("/api/workout-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workoutPlanData),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create workout plan");
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Workout plan created",
        description: "Your workout plan has been saved successfully",
      });
      refetch();
      setActiveTab("saved");
    },
    onError: (error) => {
      toast({
        title: "Failed to create workout plan",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleCreateWorkoutPlan = (workoutPlanData: any) => {
    createWorkoutPlanMutation.mutate(workoutPlanData);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold heading">Workout Planner</h1>
          <p className="text-muted-foreground mt-1">Create and manage your personalized workout routines</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Dumbbell className="mr-2 h-5 w-5 text-primary" />
                Workout Plans
              </CardTitle>
              <TabsList>
                <TabsTrigger 
                  value="create" 
                  onClick={() => setActiveTab("create")}
                  disabled={createWorkoutPlanMutation.isPending}
                >
                  Create New
                </TabsTrigger>
                <TabsTrigger 
                  value="saved" 
                  onClick={() => setActiveTab("saved")}
                  disabled={createWorkoutPlanMutation.isPending}
                >
                  Saved Plans
                </TabsTrigger>
              </TabsList>
            </div>
            <CardDescription>
              {activeTab === "create" 
                ? "Design a custom workout plan with exercise visualization" 
                : "View and edit your saved workout plans"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === "create" ? (
              <WorkoutCreator 
                onSave={handleCreateWorkoutPlan}
                isSaving={createWorkoutPlanMutation.isPending}
              />
            ) : (
              <div>
                {isLoadingWorkoutPlans ? (
                  <div className="py-10 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your workout plans...</p>
                  </div>
                ) : workoutPlans && workoutPlans.length > 0 ? (
                  <div className="space-y-6">
                    {workoutPlans.map((plan: any) => (
                      <Card key={plan.id} className="overflow-hidden">
                        <div className="bg-primary/5 p-4 border-b">
                          <h3 className="font-semibold text-lg">{plan.name}</h3>
                          {plan.description && (
                            <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex flex-wrap gap-2 mb-4">
                            <div className="bg-muted px-3 py-1 rounded-full text-xs flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              <span>Difficulty: {JSON.parse(plan.exercises).difficulty || "Medium"}</span>
                            </div>
                            <div className="bg-muted px-3 py-1 rounded-full text-xs flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{JSON.parse(plan.exercises).duration || "30"} minutes</span>
                            </div>
                            <div className="bg-muted px-3 py-1 rounded-full text-xs flex items-center">
                              <FlameIcon className="h-3 w-3 mr-1" />
                              <span>{plan.estimatedCalories || "300"} calories</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {JSON.parse(plan.exercises).exercises.slice(0, 6).map((exercise: any, index: number) => (
                              <div key={index} className="border rounded-lg p-3">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-medium">{exercise.name}</h4>
                                  <span className="text-xl" role="img" aria-label={exercise.name}>
                                    {exercise.emoji || "💪"}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {exercise.sets} sets × {exercise.reps} reps
                                </p>
                                <div className="text-xs text-muted-foreground">
                                  {exercise.muscle || "Multiple"} muscle group
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Created {new Date(plan.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <Button size="sm" variant="outline" className="mr-2">
                                Edit
                              </Button>
                              <Button size="sm" variant="default">
                                Start Workout
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Dumbbell className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Workout Plans Yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first personalized workout plan</p>
                    <Button onClick={() => setActiveTab("create")}>Create Workout Plan</Button>
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
