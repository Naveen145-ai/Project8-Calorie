import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { WorkoutPlan } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import WorkoutCard from "@/components/WorkoutCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2, Dumbbell, Plus, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

const fitnessLevels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const fitnessGoals = [
  { id: "weight-loss", label: "Weight Loss" },
  { id: "muscle-gain", label: "Muscle Gain" },
  { id: "endurance", label: "Endurance" },
  { id: "flexibility", label: "Flexibility" },
  { id: "general-fitness", label: "General Fitness" },
  { id: "strength", label: "Strength" },
];

const workoutFormSchema = z.object({
  fitnessLevel: z.string().min(1, "Please select a fitness level"),
  goals: z.array(z.string()).min(1, "Please select at least one goal"),
  duration: z.number().min(10, "Minimum 10 minutes").max(120, "Maximum 120 minutes"),
});

type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

export default function WorkoutPlans() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("create");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  // Form for generating workout plans
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      fitnessLevel: "beginner",
      goals: ["general-fitness"],
      duration: 30,
    },
  });

  // Query for workout plans
  const { data: workoutPlans = [], isLoading: plansLoading } = useQuery<WorkoutPlan[]>({
    queryKey: ["/api/workout-plans"],
  });

  // Generate workout plan mutation
  const generateMutation = useMutation({
    mutationFn: async (values: WorkoutFormValues) => {
      const res = await apiRequest("POST", "/api/workout-plans/generate", values);
      return await res.json();
    },
    onSuccess: (data: WorkoutPlan) => {
      toast({
        title: "Workout Plan Generated",
        description: `Successfully created "${data.name}"`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workout-plans"] });
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

  // Delete workout plan mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/workout-plans/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Workout plan deleted",
        description: "The workout plan has been removed."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workout-plans"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: WorkoutFormValues) {
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
            <h1 className="text-3xl font-bold tracking-tight mb-1">Workout Plans</h1>
            <p className="text-muted-foreground">Create personalized workout routines based on your fitness goals</p>
          </div>
          
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Generate Workout Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Workout Plan</DialogTitle>
                <DialogDescription>
                  Customize your workout routine based on your fitness level and goals.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fitnessLevel"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Fitness Level</FormLabel>
                        <FormDescription>
                          Select your current fitness level.
                        </FormDescription>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {fitnessLevels.map((level) => (
                              <FormItem
                                key={level.id}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={level.id} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {level.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="goals"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Fitness Goals</FormLabel>
                          <FormDescription>
                            Select one or more fitness goals.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {fitnessGoals.map((goal) => (
                            <FormField
                              key={goal.id}
                              control={form.control}
                              name="goals"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={goal.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(goal.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], goal.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== goal.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {goal.label}
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
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout Duration (minutes)</FormLabel>
                        <div className="space-y-4">
                          <Slider
                            min={10}
                            max={120}
                            step={5}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">10 min</span>
                            <span className="text-sm font-semibold">{field.value} min</span>
                            <span className="text-sm text-muted-foreground">120 min</span>
                          </div>
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
                        <Dumbbell className="mr-2 h-4 w-4" />
                      )}
                      Generate Workout Plan
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
                  <CardTitle>Generate a Workout Plan</CardTitle>
                  <CardDescription>
                    Create a personalized workout routine based on your fitness goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Our AI will generate a custom workout plan tailored to your fitness level,
                    goals, and available time. Each plan includes warm-up, main exercises, and
                    cool-down routines with detailed instructions.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <Dumbbell className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-1">Targeted Exercises</h3>
                      <p className="text-xs text-muted-foreground">For specific muscle groups</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-1">Time Optimized</h3>
                      <p className="text-xs text-muted-foreground">Fits your schedule</p>
                    </div>
                  </div>
                  
                  <Button onClick={() => setIsGenerateDialogOpen(true)} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Workout Plan
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>
                    Our AI creates personalized workout plans just for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Choose Your Fitness Level</h3>
                      <p className="text-sm text-muted-foreground">
                        Select beginner, intermediate, or advanced to match your experience
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Set Your Fitness Goals</h3>
                      <p className="text-sm text-muted-foreground">
                        Define what you want to achieve with your workout routine
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Select Workout Duration</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose how much time you can dedicate to your workout sessions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="font-semibold text-primary">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Get Personalized Exercises</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive a complete workout plan with sets, reps, and detailed instructions
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
                <CardTitle>Your Workout Plans</CardTitle>
                <CardDescription>Personalized routines to meet your fitness goals</CardDescription>
              </CardHeader>
              <CardContent>
                {plansLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : workoutPlans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {workoutPlans.map((plan) => (
                      <WorkoutCard 
                        key={plan.id}
                        workoutPlan={plan}
                        onDelete={() => handleDeletePlan(plan.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No workout plans created yet</p>
                    <Button onClick={() => setIsGenerateDialogOpen(true)}>
                      Generate Your First Workout Plan
                    </Button>
                  </div>
                )}
              </CardContent>
              {workoutPlans.length > 0 && (
                <CardFooter>
                  <Button 
                    onClick={() => setIsGenerateDialogOpen(true)}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Another Workout Plan
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
