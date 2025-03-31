import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AnalyticsCard from "@/components/dashboard/analytics-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart2, Camera, Utensils, Dumbbell, History, FileText } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const { data: foodHistory, isLoading: isLoadingFoodHistory } = useQuery({
    queryKey: ["/api/food/history"],
    enabled: !!user,
  });
  
  const { data: mealPlans, isLoading: isLoadingMealPlans } = useQuery({
    queryKey: ["/api/meal-plans"],
    enabled: !!user,
  });
  
  const { data: workoutPlans, isLoading: isLoadingWorkoutPlans } = useQuery({
    queryKey: ["/api/workout-plans"],
    enabled: !!user,
  });
  
  const userName = user?.fullName || user?.username || "User";
  
  const totalCaloriesTracked = foodHistory ? foodHistory.reduce((sum: number, entry: any) => sum + (entry.calories || 0), 0) : 0;
  const foodEntriesCount = foodHistory ? foodHistory.length : 0;
  const mealPlansCount = mealPlans ? mealPlans.length : 0;
  const workoutPlansCount = workoutPlans ? workoutPlans.length : 0;
  
  const recentActivity = [
    ...((foodHistory && foodHistory.length > 0) ? [{ type: 'food', title: 'Analyzed a meal', time: '2 hours ago' }] : []),
    ...((mealPlans && mealPlans.length > 0) ? [{ type: 'meal', title: 'Created a new meal plan', time: '1 day ago' }] : []),
    ...((workoutPlans && workoutPlans.length > 0) ? [{ type: 'workout', title: 'Created a workout routine', time: '3 days ago' }] : []),
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold heading">Welcome, {userName}</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your nutrition and fitness journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AnalyticsCard 
            title="Total Calories Tracked" 
            value={`${totalCaloriesTracked}`}
            unit="kcal"
            icon={<BarChart2 className="h-5 w-5" />}
            description="All-time calories tracked"
            trend={totalCaloriesTracked > 0 ? "+10%" : undefined}
          />
          
          <AnalyticsCard 
            title="Food Entries" 
            value={`${foodEntriesCount}`}
            icon={<Camera className="h-5 w-5" />}
            description="Total meals analyzed"
          />
          
          <AnalyticsCard 
            title="Meal Plans" 
            value={`${mealPlansCount}`}
            icon={<Utensils className="h-5 w-5" />}
            description="Created meal plans"
          />
          
          <AnalyticsCard 
            title="Workout Plans" 
            value={`${workoutPlansCount}`}
            icon={<Dumbbell className="h-5 w-5" />}
            description="Created workout routines"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start tracking your nutrition and fitness</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/food-analysis">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <Camera className="h-6 w-6 text-primary" />
                  <span>Analyze Food</span>
                </Button>
              </Link>
              
              <Link href="/meal-planning">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <Utensils className="h-6 w-6 text-primary" />
                  <span>Create Meal Plan</span>
                </Button>
              </Link>
              
              <Link href="/workout-planner">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <Dumbbell className="h-6 w-6 text-primary" />
                  <span>Create Workout</span>
                </Button>
              </Link>
              
              <Link href="/history">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <History className="h-6 w-6 text-primary" />
                  <span>View History</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        {activity.type === 'food' && <Camera className="h-4 w-4 text-primary" />}
                        {activity.type === 'meal' && <Utensils className="h-4 w-4 text-primary" />}
                        {activity.type === 'workout' && <Dumbbell className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No recent activity yet</p>
                  <p className="text-sm mt-1">Start using NutriScan features</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <Tabs defaultValue="overview" onValueChange={setSelectedTab}>
              <div className="flex items-center justify-between">
                <CardTitle>Nutrition & Fitness Summary</CardTitle>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="week">This Week</TabsTrigger>
                  <TabsTrigger value="month">This Month</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                {selectedTab === "overview" && "Your overall nutrition and fitness data"}
                {selectedTab === "week" && "Your nutrition and fitness data for this week"}
                {selectedTab === "month" && "Your nutrition and fitness data for this month"}
              </CardDescription>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="mt-0">
              {foodEntriesCount > 0 ? (
                <div className="h-72 flex items-center justify-center">
                  <BarChart2 className="h-32 w-32 text-muted-foreground/30" />
                  <div className="ml-4">
                    <h3 className="text-xl font-medium">Nutrition Summary</h3>
                    <p className="text-muted-foreground">Your nutritional data will be displayed here as you track more meals</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Camera className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-medium">No Nutrition Data Yet</h3>
                  <p className="text-muted-foreground mb-4">Start analyzing your meals to track your nutrition</p>
                  <Link href="/food-analysis">
                    <Button>Analyze Your First Meal</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            <TabsContent value="week" className="mt-0">
              <div className="h-72 flex items-center justify-center">
                <Calendar className="h-32 w-32 text-muted-foreground/30" />
                <div className="ml-4">
                  <h3 className="text-xl font-medium">Weekly Data</h3>
                  <p className="text-muted-foreground">Your weekly nutrition and workout data will appear here</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="month" className="mt-0">
              <div className="h-72 flex items-center justify-center">
                <FileText className="h-32 w-32 text-muted-foreground/30" />
                <div className="ml-4">
                  <h3 className="text-xl font-medium">Monthly Report</h3>
                  <p className="text-muted-foreground">Your monthly nutrition and fitness progress will be shown here</p>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
