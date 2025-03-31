import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot";
import FoodAlternative from "@/components/FoodAlternative";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { CameraIcon, Search, ArrowRight, Salad, Loader2, HeartPulse } from "lucide-react";

interface FoodItem {
  name: string;
  calories: number;
  imageUrl?: string;
}

interface AlternativeResult {
  original: FoodItem;
  alternatives: {
    name: string;
    calories: number;
    benefits: string;
  }[];
}

export default function AlternativesPage() {
  const [activeTab, setActiveTab] = useState<string>("image");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [result, setResult] = useState<AlternativeResult | null>(null);
  const { toast } = useToast();

  // Image upload and food analysis mutation
  const imageAnalysisMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiRequest("POST", "/api/food/alternatives/image", formData);
      return await res.json();
    },
    onSuccess: (data: AlternativeResult) => {
      setResult(data);
      toast({
        title: "Analysis Complete",
        description: `Found healthier alternatives for ${data.original.name}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Text search mutation
  const textSearchMutation = useMutation({
    mutationFn: async (foodName: string) => {
      const res = await apiRequest("POST", "/api/food/alternatives/text", { foodName });
      return await res.json();
    },
    onSuccess: (data: AlternativeResult) => {
      setResult(data);
      toast({
        title: "Alternatives Found",
        description: `Found healthier alternatives for ${data.original.name}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Search Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    imageAnalysisMutation.mutate(formData);
  };

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      textSearchMutation.mutate(searchQuery);
    }
  };

  // For demo purposes, show a predefined result when the component mounts
  // This would be removed in production with real API data
  const demoResult: AlternativeResult = {
    original: {
      name: "Hamburger",
      calories: 650,
      imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80"
    },
    alternatives: [
      {
        name: "Turkey Burger",
        calories: 350,
        benefits: "Lower in fat and calories while still providing protein. Use whole grain bun for extra fiber."
      },
      {
        name: "Portobello Mushroom Burger",
        calories: 200,
        benefits: "Plant-based alternative with very low calories and high in potassium, phosphorus, and vitamin D."
      },
      {
        name: "Lentil Burger",
        calories: 300,
        benefits: "High in fiber and plant-based protein. Contains folate and potassium for heart health."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Healthier Alternatives</h1>
          <p className="text-muted-foreground">
            Discover healthier options for your favorite foods
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="image">Upload Image</TabsTrigger>
            <TabsTrigger value="text">Text Search</TabsTrigger>
          </TabsList>
          
          <TabsContent value="image" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CameraIcon className="h-5 w-5 text-primary" />
                    Upload Food Image
                  </CardTitle>
                  <CardDescription>
                    Take a photo of any food to find healthier alternatives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploader 
                    onFileSelected={handleImageUpload}
                    isUploading={imageAnalysisMutation.isPending}
                  />
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  For best results, ensure the image clearly shows the food item
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    Why Choose Alternatives?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Making small substitutions in your diet can lead to significant health benefits over time:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-primary font-semibold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Reduce Calorie Intake</h4>
                        <p className="text-sm text-muted-foreground">
                          Healthier alternatives often contain fewer calories while maintaining satisfaction
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-primary font-semibold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Increase Nutritional Value</h4>
                        <p className="text-sm text-muted-foreground">
                          Get more vitamins, minerals, and fiber from healthier food choices
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-primary font-semibold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Support Long-term Health</h4>
                        <p className="text-sm text-muted-foreground">
                          Lower risk of chronic diseases with better food choices
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Search by Food Name
                  </CardTitle>
                  <CardDescription>
                    Enter any food item to find healthier alternatives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTextSearch} className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="e.g., french fries, pizza, ice cream"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="submit"
                        disabled={!searchQuery.trim() || textSearchMutation.isPending}
                      >
                        {textSearchMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </form>
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Popular searches:</h3>
                    <div className="flex flex-wrap gap-2">
                      {["Pizza", "Burger", "Ice Cream", "Fries", "Soda", "Pasta"].map((item) => (
                        <Button
                          key={item}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery(item);
                            textSearchMutation.mutate(item);
                          }}
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Salad className="h-5 w-5 text-primary" />
                    Quick Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Simple Food Swaps</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span>Replace white rice with brown rice or cauliflower rice</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span>Choose Greek yogurt instead of sour cream</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span>Try zucchini or carrot noodles instead of pasta</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span>Use lettuce wraps instead of tortillas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span>Snack on nuts instead of chips</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Results Section */}
        {(result || demoResult) && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Alternative Options</CardTitle>
              <CardDescription>
                Healthier substitutes for {result?.original.name || demoResult.original.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="md:col-span-1 bg-muted/50 border-2 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Original Choice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(result?.original.imageUrl || demoResult.original.imageUrl) && (
                      <div className="aspect-square rounded-md overflow-hidden mb-4">
                        <img
                          src={result?.original.imageUrl || demoResult.original.imageUrl}
                          alt={result?.original.name || demoResult.original.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-bold text-lg mb-1">{result?.original.name || demoResult.original.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Estimated calories:</p>
                    <div className="bg-primary/10 rounded-md p-2 text-center">
                      <span className="text-xl font-bold">{result?.original.calories || demoResult.original.calories}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-3">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Healthier Alternatives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(result?.alternatives || demoResult.alternatives).map((alternative, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <FoodAlternative
                            name={alternative.name}
                            calories={alternative.calories}
                            benefits={alternative.benefits}
                          />
                          {index < (result?.alternatives.length || demoResult.alternatives.length) - 1 && (
                            <Separator className="my-4" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      
      {/* ChatBot component */}
      <ChatBot />
    </div>
  );
}