import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FoodEntry } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import NutritionInfo from "@/components/NutritionInfo";
import FoodAlternative from "@/components/FoodAlternative";
import PDFGenerator from "@/components/PDFGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, History } from "lucide-react";

interface FoodAnalysisResult extends FoodEntry {
  alternatives?: {
    name: string;
    calories: number;
    benefits: string;
  }[];
}

export default function FoodAnalysis() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("analyze");
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);

  // Query for food history
  const { data: foodHistory = [], isLoading: historyLoading } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food/history"],
  });

  // Image upload and analysis mutation
  const analysisMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/food/analyze", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to analyze food image");
      }
      
      return await res.json();
    },
    onSuccess: (data: FoodAnalysisResult) => {
      setAnalysisResult(data);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${data.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/food/history"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/food/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Food entry deleted",
        description: "The food entry has been removed from your history."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/food/history"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpload = (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    analysisMutation.mutate(formData);
  };

  const handleSelectHistoryItem = (item: FoodEntry) => {
    setAnalysisResult(item as FoodAnalysisResult);
    setActiveTab("results");
  };

  const handleDeleteHistoryItem = (id: number) => {
    deleteEntryMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Food Analysis</h1>
            <p className="text-muted-foreground">Upload a food image for instant nutrition breakdown</p>
          </div>
          
          <Button
            variant="outline"
            className="mt-4 md:mt-0 flex items-center gap-2"
            onClick={() => setActiveTab("history")}
          >
            <History className="h-4 w-4" />
            View History
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysisResult}>Results</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyze" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Food Image</CardTitle>
                  <CardDescription>
                    Take a photo of your meal or upload an existing image
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploader 
                    onFileSelected={handleUpload} 
                    isUploading={analysisMutation.isPending}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>
                    Our AI analyzes your food images with high accuracy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Upload Your Food Image</h3>
                      <p className="text-sm text-muted-foreground">
                        Take a clear photo of your meal or upload from your gallery
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Our advanced AI recognizes food items and analyzes their nutritional content
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Get Detailed Nutrition Info</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive a comprehensive breakdown of calories, macros, vitamins, and minerals
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="font-semibold text-primary">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Healthier Alternatives</h3>
                      <p className="text-sm text-muted-foreground">
                        Discover healthier options with similar taste profiles but better nutrition
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            {analysisResult ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{analysisResult.name}</CardTitle>
                      <CardDescription>Nutritional analysis results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-muted rounded-md overflow-hidden mb-6">
                        {analysisResult.imageUrl && (
                          <img 
                            src={analysisResult.imageUrl} 
                            alt={analysisResult.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <NutritionInfo foodEntry={analysisResult} />
                      
                      <div className="mt-6 flex flex-wrap gap-3">
                        <PDFGenerator foodEntry={analysisResult} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  {analysisResult.alternatives && analysisResult.alternatives.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Healthier Alternatives</CardTitle>
                        <CardDescription>Try these options for better nutrition</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analysisResult.alternatives.map((alternative, index) => (
                            <FoodAlternative 
                              key={index}
                              name={alternative.name}
                              calories={alternative.calories}
                              benefits={alternative.benefits}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Macronutrient Summary</CardTitle>
                      <CardDescription>Breakdown of your meal</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Calories</span>
                            <span className="text-sm font-bold">{analysisResult.calories} kcal</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Protein</span>
                            <span className="text-sm font-bold">{analysisResult.protein}g</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div 
                              className="bg-green-500 h-2.5 rounded-full" 
                              style={{ 
                                width: `${Math.min(100, (analysisResult.protein || 0) / ((analysisResult.calories || 0) / 4) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Carbohydrates</span>
                            <span className="text-sm font-bold">{analysisResult.carbs}g</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div 
                              className="bg-blue-500 h-2.5 rounded-full" 
                              style={{ 
                                width: `${Math.min(100, (analysisResult.carbs || 0) / ((analysisResult.calories || 0) / 4) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Fats</span>
                            <span className="text-sm font-bold">{analysisResult.fats}g</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div 
                              className="bg-amber-500 h-2.5 rounded-full" 
                              style={{ 
                                width: `${Math.min(100, (analysisResult.fats || 0) / ((analysisResult.calories || 0) / 9) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No analysis results available</p>
                <Button onClick={() => setActiveTab("analyze")}>Analyze Food Image</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Food Analysis History</CardTitle>
                <CardDescription>Your previously analyzed meals</CardDescription>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : foodHistory.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {foodHistory.map((entry) => (
                      <Card key={entry.id} className="overflow-hidden">
                        {entry.imageUrl && (
                          <div className="aspect-video bg-muted">
                            <img 
                              src={entry.imageUrl} 
                              alt={entry.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1">{entry.name}</h3>
                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-sm text-muted-foreground">{entry.calories} kcal</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleSelectHistoryItem(entry)}
                              className="flex-1"
                            >
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDeleteHistoryItem(entry.id)}
                              className="flex-1"
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No food analysis history yet</p>
                    <Button onClick={() => setActiveTab("analyze")}>Analyze Your First Meal</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
