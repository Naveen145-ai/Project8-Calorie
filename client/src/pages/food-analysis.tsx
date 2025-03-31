import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import FoodUpload from "@/components/food-analysis/food-upload";
import NutritionDisplay from "@/components/food-analysis/nutrition-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Info, BarChart2, List, ChevronRight } from "lucide-react";

export default function FoodAnalysis() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [foodName, setFoodName] = useState<string>("");
  
  const { data: alternatives, isLoading: loadingAlternatives } = useQuery({
    queryKey: ["/api/food/alternatives", foodName],
    queryFn: async () => {
      if (!foodName) return null;
      const res = await fetch("/api/food/alternatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to get alternatives");
      return res.json();
    },
    enabled: !!foodName && foodName.length > 0 && !!analysisResult,
  });
  
  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
    if (result?.analysis?.foodName) {
      setFoodName(result.analysis.foodName);
    }
    setIsAnalyzing(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold heading">Food Analysis</h1>
          <p className="text-muted-foreground mt-1">Analyze your food to get detailed nutritional information</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5 text-primary" />
                  Upload Food Image
                </CardTitle>
                <CardDescription>
                  Take a photo or upload an image of your food
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FoodUpload 
                  onAnalysisStart={() => setIsAnalyzing(true)}
                  onAnalysisComplete={handleAnalysisComplete}
                />
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5" />
                <p>For best results, try to capture the entire meal clearly and avoid dark or blurry images.</p>
              </CardFooter>
            </Card>
            
            {analysisResult && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <List className="mr-2 h-5 w-5 text-primary" />
                    Food Alternatives
                  </CardTitle>
                  <CardDescription>
                    Healthier options for {analysisResult.analysis.foodName || "this food"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingAlternatives ? (
                    <div className="py-4 text-center text-muted-foreground">Loading alternatives...</div>
                  ) : alternatives?.alternatives ? (
                    <div className="space-y-4">
                      {alternatives.alternatives.slice(0, 3).map((alt: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <h3 className="font-medium">{alt.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{alt.description}</p>
                          <div className="text-sm flex items-center justify-between">
                            <span className="text-primary">{alt.estimatedCalories} kcal</span>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              View Details <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">
                      {analysisResult ? "No alternatives found" : "Analyze a food to see alternatives"}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <Tabs defaultValue="nutrition">
                  <div className="flex items-center justify-between">
                    <CardTitle>Analysis Results</CardTitle>
                    <TabsList>
                      <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>
                  </div>
                  <CardDescription>
                    Detailed nutritional breakdown of your food
                  </CardDescription>
                </Tabs>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
                    <h3 className="text-lg font-medium mb-1">Analyzing your food...</h3>
                    <p className="text-muted-foreground">Our AI is identifying ingredients and calculating nutrition</p>
                  </div>
                ) : analysisResult ? (
                  <TabsContent value="nutrition" className="mt-0">
                    <NutritionDisplay nutritionData={analysisResult.analysis} />
                  </TabsContent>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <BarChart2 className="h-20 w-20 text-muted-foreground/30 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No Analysis Results Yet</h2>
                    <p className="text-muted-foreground mb-6">Upload a food image to get detailed nutritional information</p>
                  </div>
                )}
                
                <TabsContent value="details" className="mt-0">
                  {analysisResult ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{analysisResult.analysis.foodName || "Food Details"}</h3>
                        <p className="text-muted-foreground">{analysisResult.analysis.description || "No detailed description available"}</p>
                      </div>
                      
                      {analysisResult.analysis.ingredients && analysisResult.analysis.ingredients.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Ingredients:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysisResult.analysis.ingredients.map((ingredient: string, index: number) => (
                              <li key={index} className="text-muted-foreground">{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Info className="h-16 w-16 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Details Available</h3>
                      <p className="text-muted-foreground">Upload a food image to see detailed information</p>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
