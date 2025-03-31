import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { generatePDF } from "@/utils/pdf-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  History as HistoryIcon, 
  FileText, 
  Download, 
  ChevronDown, 
  Calendar, 
  Filter, 
  Clock, 
  Search,
  BarChart2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function History() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("food");
  const [dateRange, setDateRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch food entries
  const { data: foodEntries, isLoading: isLoadingFoodEntries } = useQuery({
    queryKey: ["/api/food/history"],
  });
  
  // Fetch meal plans
  const { data: mealPlans, isLoading: isLoadingMealPlans } = useQuery({
    queryKey: ["/api/meal-plans"],
  });
  
  // Fetch workout plans
  const { data: workoutPlans, isLoading: isLoadingWorkoutPlans } = useQuery({
    queryKey: ["/api/workout-plans"],
  });
  
  const generateHistoryReport = async () => {
    try {
      let dataToExport = {};
      
      if (activeTab === "food") {
        dataToExport = { foodEntries: foodEntries || [] };
      } else if (activeTab === "meals") {
        dataToExport = { mealPlans: mealPlans || [] };
      } else if (activeTab === "workouts") {
        dataToExport = { workoutPlans: workoutPlans || [] };
      } else {
        dataToExport = {
          foodEntries: foodEntries || [],
          mealPlans: mealPlans || [],
          workoutPlans: workoutPlans || []
        };
      }
      
      const pdfBlob = await generatePDF(dataToExport, activeTab);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nutriscan-${activeTab}-history.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Report generated",
        description: `Your ${activeTab} history report has been downloaded`,
      });
    } catch (error) {
      toast({
        title: "Failed to generate report",
        description: "An error occurred while generating your report",
        variant: "destructive",
      });
    }
  };
  
  const filteredFoodEntries = foodEntries 
    ? foodEntries.filter((entry: any) => {
        const matchesSearch = searchQuery === "" || 
          entry.foodName.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Add date filtering logic here if needed
        
        return matchesSearch;
      })
    : [];
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold heading">History</h1>
            <p className="text-muted-foreground mt-1">View and export your nutrition and fitness history</p>
          </div>
          <Button 
            onClick={generateHistoryReport}
            className="mt-4 md:mt-0"
            disabled={
              (activeTab === "food" && (!foodEntries || foodEntries.length === 0)) ||
              (activeTab === "meals" && (!mealPlans || mealPlans.length === 0)) ||
              (activeTab === "workouts" && (!workoutPlans || workoutPlans.length === 0))
            }
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate PDF Report
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="flex items-center">
                <HistoryIcon className="mr-2 h-5 w-5 text-primary" />
                Your History
              </CardTitle>
              <TabsList>
                <TabsTrigger 
                  value="food" 
                  onClick={() => setActiveTab("food")}
                >
                  Food Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="meals" 
                  onClick={() => setActiveTab("meals")}
                >
                  Meal Plans
                </TabsTrigger>
                <TabsTrigger 
                  value="workouts" 
                  onClick={() => setActiveTab("workouts")}
                >
                  Workouts
                </TabsTrigger>
                <TabsTrigger 
                  value="all" 
                  onClick={() => setActiveTab("all")}
                >
                  All History
                </TabsTrigger>
              </TabsList>
            </div>
            <CardDescription>
              {activeTab === "food" && "Your food analysis history and nutritional data"}
              {activeTab === "meals" && "Your saved meal plans and dietary preferences"}
              {activeTab === "workouts" && "Your workout routines and exercise history"}
              {activeTab === "all" && "Your complete nutrition and fitness history"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search in history..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                    <SelectItem value="year">This year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="food" className="mt-0">
              {isLoadingFoodEntries ? (
                <div className="py-10 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your food history...</p>
                </div>
              ) : filteredFoodEntries.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 bg-muted py-3 px-4 text-sm font-medium">
                    <div className="col-span-5">Food Item</div>
                    <div className="col-span-2 text-center">Calories</div>
                    <div className="col-span-1 text-center">Protein</div>
                    <div className="col-span-1 text-center">Carbs</div>
                    <div className="col-span-1 text-center">Fat</div>
                    <div className="col-span-2 text-right">Date</div>
                  </div>
                  <div className="divide-y">
                    {filteredFoodEntries.map((entry: any) => (
                      <div key={entry.id} className="grid grid-cols-12 py-3 px-4 hover:bg-muted/50">
                        <div className="col-span-5 font-medium">{entry.foodName}</div>
                        <div className="col-span-2 text-center">{entry.calories} kcal</div>
                        <div className="col-span-1 text-center">{entry.protein}g</div>
                        <div className="col-span-1 text-center">{entry.carbs}g</div>
                        <div className="col-span-1 text-center">{entry.fat}g</div>
                        <div className="col-span-2 text-right text-muted-foreground text-sm">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart2 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Food History Yet</h3>
                  <p className="text-muted-foreground mb-6">Analyze your meals to build your nutrition history</p>
                  <Button variant="outline">Go to Food Analysis</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="meals" className="mt-0">
              {isLoadingMealPlans ? (
                <div className="py-10 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your meal plans...</p>
                </div>
              ) : mealPlans && mealPlans.length > 0 ? (
                <div className="space-y-4">
                  {mealPlans.map((plan: any) => (
                    <Card key={plan.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{plan.name}</CardTitle>
                          <div className="text-sm text-muted-foreground">
                            {new Date(plan.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <CardDescription>{plan.description || "No description"}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">
                          <span className="font-medium">{JSON.parse(plan.meals).length}</span> meals included
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="mr-2">
                            <ChevronDown className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Meal Plans Yet</h3>
                  <p className="text-muted-foreground mb-6">Create meal plans to view them in your history</p>
                  <Button variant="outline">Create Meal Plan</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="workouts" className="mt-0">
              {/* Similar to meals tab but for workouts */}
              <div className="text-center py-12">
                <Clock className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Workout History Yet</h3>
                <p className="text-muted-foreground mb-6">Create and log workouts to view them here</p>
                <Button variant="outline">Create Workout</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="mt-0">
              <div className="text-center py-12">
                <HistoryIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-medium mb-2">Comprehensive History</h3>
                <p className="text-muted-foreground mb-6">
                  Use the tabs above to view specific history categories
                </p>
                <Button onClick={generateHistoryReport}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Complete Report
                </Button>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
