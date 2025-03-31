import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { FoodEntry } from "@shared/schema";
import { useState } from "react";
import ChatBot from "@/components/ChatBot";
import Header from "@/components/Header";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Progress 
} from "@/components/ui/progress";
import { 
  Button 
} from "@/components/ui/button";
import {
  BarChart,
  TrendingUp,
  Utensils,
  Salad,
  Calendar,
  ChevronRight,
  Loader2,
  Info
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NutrientTrend {
  nutrient: string;
  average: number;
  recommended: number;
  unit: string;
}

interface FoodRecommendation {
  name: string;
  reasoning: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  imageDescription?: string;
}

interface MealRecommendation {
  type: string;
  suggestions: FoodRecommendation[];
}

interface RecommendationData {
  nutrientTrends: NutrientTrend[];
  dietaryPatterns: string[];
  mealRecommendations: MealRecommendation[];
  healthInsights: string[];
}

export default function RecommendationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("trends");

  // Fetch user's food history
  const { 
    data: foodHistory, 
    isLoading: isLoadingHistory,
    error: historyError
  } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food-entries"],
    enabled: !!user,
  });

  // Fetch personalized recommendations
  const {
    data: recommendations,
    isLoading: isLoadingRecommendations,
    error: recommendationsError,
  } = useQuery<RecommendationData>({
    queryKey: ["/api/recommendations"],
    enabled: !!user,
  });

  // Generate new recommendations
  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/recommendations/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?.id }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate recommendations");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      toast({
        title: "Success",
        description: "New recommendations generated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isLoading = isLoadingHistory || isLoadingRecommendations;
  const error = historyError || recommendationsError;

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="rounded-lg border bg-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              {error instanceof Error ? error.message : "Failed to load recommendations"}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
        <ChatBot />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-24 flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold">Loading your recommendations</h2>
            <p className="text-muted-foreground mt-2">
              We're analyzing your food history to create personalized recommendations...
            </p>
          </div>
        </div>
        <ChatBot />
      </div>
    );
  }

  if (!foodHistory || foodHistory.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-12 px-4">
          <div className="rounded-lg border bg-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No History Found</h2>
            <p className="text-muted-foreground mb-6">
              You need to have some food entries in your history before we can generate personalized recommendations.
            </p>
            <Button asChild>
              <a href="/scan-food">Scan Some Food</a>
            </Button>
          </div>
        </div>
        <ChatBot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Personalized Recommendations</h1>
            <p className="text-muted-foreground mt-2">
              Based on your food history and nutritional patterns
            </p>
          </div>
          <Button 
            onClick={() => generateRecommendationsMutation.mutate()}
            disabled={generateRecommendationsMutation.isPending}
            className="mt-4 md:mt-0"
          >
            {generateRecommendationsMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>Refresh Recommendations</>
            )}
          </Button>
        </div>

        <Tabs 
          defaultValue="trends" 
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="trends" className="flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nutrition Trends</span>
              <span className="sm:hidden">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center">
              <Utensils className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Meal Suggestions</span>
              <span className="sm:hidden">Meals</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Health Insights</span>
              <span className="sm:hidden">Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations?.nutrientTrends.map((trend, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">{trend.nutrient}</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Recommended: {trend.recommended}{trend.unit}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <CardDescription>
                      Your average: {trend.average}{trend.unit}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current</span>
                        <span>{Math.round((trend.average / trend.recommended) * 100)}% of recommended</span>
                      </div>
                      <Progress 
                        value={Math.min(100, (trend.average / trend.recommended) * 100)} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Dietary Patterns</CardTitle>
                <CardDescription>
                  Patterns we've detected from your food history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations?.dietaryPatterns.map((pattern, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                      <span>{pattern}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meals">
            {recommendations?.mealRecommendations.map((mealRec, mealIndex) => (
              <div key={mealIndex} className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Salad className="mr-2 h-5 w-5 text-primary" />
                  {mealRec.type}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mealRec.suggestions.map((food, foodIndex) => (
                    <Card key={foodIndex}>
                      <CardHeader>
                        <CardTitle>{food.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{food.reasoning}</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground">Calories</p>
                            <p className="text-lg font-bold">{food.nutrients.calories}</p>
                          </div>
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground">Protein</p>
                            <p className="text-lg font-bold">{food.nutrients.protein}g</p>
                          </div>
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground">Carbs</p>
                            <p className="text-lg font-bold">{food.nutrients.carbs}g</p>
                          </div>
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground">Fats</p>
                            <p className="text-lg font-bold">{food.nutrients.fats}g</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <a href={`/alternatives?query=${encodeURIComponent(food.name)}`}>
                            Find Alternatives
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Health Insights</CardTitle>
                <CardDescription>
                  Based on your food consumption patterns and nutritional intake
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recommendations?.healthInsights.map((insight, index) => (
                    <li key={index} className="bg-muted p-4 rounded-lg">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                        <p>{insight}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/meal-planning">
                    <Calendar className="mr-2 h-4 w-4" />
                    Create Meal Plan
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <ChatBot />
    </div>
  );
}