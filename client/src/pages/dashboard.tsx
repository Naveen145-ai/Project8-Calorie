import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { FoodEntry, MealPlan, WorkoutPlan } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Loader2, Calendar, Camera, Utensils, Dumbbell, ChevronRight, Plus } from "lucide-react";
import Header from "@/components/Header";

export default function Dashboard() {
  const { user } = useAuth();

  // Query food entries
  const { 
    data: foodEntries = [], 
    isLoading: isLoadingFoodEntries 
  } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food/history"],
    enabled: !!user,
  });

  // Query meal plans
  const { 
    data: mealPlans = [], 
    isLoading: isLoadingMealPlans 
  } = useQuery<MealPlan[]>({
    queryKey: ["/api/meal-plans"],
    enabled: !!user,
  });

  // Query workout plans
  const { 
    data: workoutPlans = [], 
    isLoading: isLoadingWorkoutPlans 
  } = useQuery<WorkoutPlan[]>({
    queryKey: ["/api/workout-plans"],
    enabled: !!user,
  });

  // Calculate total stats
  const totalCaloriesLogged = foodEntries.reduce((total, entry) => total + (entry.calories || 0), 0);
  const totalProteins = foodEntries.reduce((total, entry) => total + (entry.protein || 0), 0);
  const totalCarbs = foodEntries.reduce((total, entry) => total + (entry.carbs || 0), 0);
  const totalFats = foodEntries.reduce((total, entry) => total + (entry.fats || 0), 0);

  // Data for nutrition distribution pie chart
  const nutritionData = [
    { name: "Protein", value: totalProteins, color: "#4CAF50" },
    { name: "Carbs", value: totalCarbs, color: "#2196F3" },
    { name: "Fats", value: totalFats, color: "#FF9800" },
  ];

  // Data for recent activities
  const recentActivities = [
    ...foodEntries.map(entry => ({
      type: 'food',
      id: entry.id,
      name: entry.name,
      timestamp: new Date(entry.timestamp),
      data: entry
    })),
    ...mealPlans.map(plan => ({
      type: 'meal',
      id: plan.id,
      name: plan.name,
      timestamp: new Date(plan.createdAt),
      data: plan
    })),
    ...workoutPlans.map(plan => ({
      type: 'workout',
      id: plan.id,
      name: plan.name,
      timestamp: new Date(plan.createdAt),
      data: plan
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  // Loading state
  const isLoading = isLoadingFoodEntries || isLoadingMealPlans || isLoadingWorkoutPlans;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.fullName || user?.username}</p>
          </div>
          
          <div className="flex mt-4 md:mt-0 gap-3">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/food-analysis">
                <Camera className="h-4 w-4" />
                Analyze Food
              </Link>
            </Button>
            <Button asChild className="flex items-center gap-2">
              <Link href="/meal-planning">
                <Plus className="h-4 w-4" />
                Create Meal Plan
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{foodEntries.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Food items analyzed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCaloriesLogged}</div>
              <p className="text-xs text-muted-foreground mt-1">Calories logged</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Meal Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mealPlans.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Custom meal plans</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Workout Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workoutPlans.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Personalized workouts</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nutrition Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Distribution</CardTitle>
                  <CardDescription>Macronutrient breakdown of your logged foods</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {nutritionData.some(item => item.value > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={nutritionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {nutritionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}g`, '']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-muted-foreground mb-4">No nutrition data available yet</p>
                      <Button asChild variant="outline">
                        <Link href="/food-analysis">Analyze Your First Meal</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest health activities</CardDescription>
                  </div>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={`${activity.type}-${activity.id}`} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {activity.type === 'food' && (
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Camera className="h-5 w-5 text-primary" />
                              </div>
                            )}
                            {activity.type === 'meal' && (
                              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                                <Utensils className="h-5 w-5 text-secondary" />
                              </div>
                            )}
                            {activity.type === 'workout' && (
                              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                <Dumbbell className="h-5 w-5 text-accent" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{activity.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {activity.timestamp.toLocaleDateString()} • {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64">
                      <p className="text-muted-foreground mb-4">No activities recorded yet</p>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href="/food-analysis">Analyze Food</Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href="/meal-planning">Create Meal Plan</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="nutrition">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calorie Intake</CardTitle>
                  <CardDescription>Calorie breakdown of your recent meals</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {foodEntries.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={foodEntries.slice(-10).map(entry => ({
                          name: entry.name,
                          calories: entry.calories || 0
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar dataKey="calories" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-muted-foreground mb-4">No nutrition data available yet</p>
                      <Button asChild variant="outline">
                        <Link href="/food-analysis">Analyze Your First Meal</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Exercise Activity</CardTitle>
                  <CardDescription>Summary of your recent workouts</CardDescription>
                </CardHeader>
                <CardContent>
                  {workoutPlans.length > 0 ? (
                    <div className="space-y-4">
                      {workoutPlans.map((plan) => (
                        <div key={plan.id} className="bg-muted/30 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">{plan.name}</h3>
                            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {plan.caloriesBurned} calories
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/workout-plans/${plan.id}`}>View Details</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64">
                      <p className="text-muted-foreground mb-4">No workout plans created yet</p>
                      <Button asChild>
                        <Link href="/workout-plans">Create Workout Plan</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Food Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Take a photo of your food and get instant nutrition breakdown</p>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/food-analysis">Analyze Food</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary text-secondary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Meal Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Create custom meal plans based on your dietary preferences</p>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/meal-planning">Plan Meals</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-accent text-accent-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Workout Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Get personalized workout routines to complement your nutrition</p>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/workout-plans">Create Workout</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
