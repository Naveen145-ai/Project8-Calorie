import { useState } from "react";
import { MealPlan } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UtensilsCrossed, AlertTriangle, FileText, Trash2, Calendar, Download } from "lucide-react";
import { format } from "date-fns";

interface MealPlanCardProps {
  mealPlan: MealPlan;
  onDelete: () => void;
}

export default function MealPlanCard({ mealPlan, onDelete }: MealPlanCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const meals = mealPlan.meals as any;

  const handleDownloadPDF = () => {
    // Mock PDF generation
    alert("PDF download functionality would be implemented here");
  };

  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {mealPlan.name}
            </CardTitle>
          </div>
          <CardDescription className="flex items-center gap-1 text-xs mt-1">
            <Calendar className="h-3 w-3" />
            {mealPlan.createdAt ? format(new Date(mealPlan.createdAt), "MMM d, yyyy") : "Recent"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow pb-0">
          <p className="text-sm line-clamp-2 mb-3">
            {mealPlan.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <UtensilsCrossed className="h-3 w-3" />
              {mealPlan.calories} cal
            </Badge>
            
            {meals?.breakfast && (
              <Badge variant="outline" className="text-xs">
                Breakfast
              </Badge>
            )}
            
            {meals?.lunch && (
              <Badge variant="outline" className="text-xs">
                Lunch
              </Badge>
            )}
            
            {meals?.dinner && (
              <Badge variant="outline" className="text-xs">
                Dinner
              </Badge>
            )}
            
            {meals?.snacks && meals.snacks.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {meals.snacks.length} Snacks
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-3 pb-4 flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full flex-1">View Plan</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>{mealPlan.name}</DialogTitle>
                <DialogDescription>
                  {mealPlan.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex items-center gap-2 mt-2 mb-6">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <UtensilsCrossed className="h-3 w-3" />
                  {mealPlan.calories} calories/day
                </Badge>
              </div>
              
              <Tabs defaultValue="breakfast" className="flex-grow flex flex-col overflow-hidden">
                <TabsList className="flex-shrink-0">
                  {meals?.breakfast && <TabsTrigger value="breakfast">Breakfast</TabsTrigger>}
                  {meals?.lunch && <TabsTrigger value="lunch">Lunch</TabsTrigger>}
                  {meals?.dinner && <TabsTrigger value="dinner">Dinner</TabsTrigger>}
                  {meals?.snacks && meals.snacks.length > 0 && <TabsTrigger value="snacks">Snacks</TabsTrigger>}
                </TabsList>
                
                <ScrollArea className="flex-grow mt-4">
                  {meals?.breakfast && (
                    <TabsContent value="breakfast" className="mt-0 p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{meals.breakfast.name}</h3>
                          <p className="text-muted-foreground text-sm">{meals.breakfast.macros.calories} calories</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Ingredients</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {meals.breakfast.ingredients.map((ingredient: string, i: number) => (
                              <li key={i} className="text-sm">{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Preparation</h4>
                          <p className="text-sm">{meals.breakfast.preparation}</p>
                        </div>
                        
                        <div className="bg-muted rounded-md p-3">
                          <h4 className="font-medium mb-2">Nutritional Information</h4>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Calories</p>
                              <p className="font-medium">{meals.breakfast.macros.calories} kcal</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Protein</p>
                              <p className="font-medium">{meals.breakfast.macros.protein}g</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Carbs</p>
                              <p className="font-medium">{meals.breakfast.macros.carbs}g</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Fats</p>
                              <p className="font-medium">{meals.breakfast.macros.fats}g</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  )}
                  
                  {meals?.lunch && (
                    <TabsContent value="lunch" className="mt-0 p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{meals.lunch.name}</h3>
                          <p className="text-muted-foreground text-sm">{meals.lunch.macros.calories} calories</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Ingredients</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {meals.lunch.ingredients.map((ingredient: string, i: number) => (
                              <li key={i} className="text-sm">{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Preparation</h4>
                          <p className="text-sm">{meals.lunch.preparation}</p>
                        </div>
                        
                        <div className="bg-muted rounded-md p-3">
                          <h4 className="font-medium mb-2">Nutritional Information</h4>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Calories</p>
                              <p className="font-medium">{meals.lunch.macros.calories} kcal</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Protein</p>
                              <p className="font-medium">{meals.lunch.macros.protein}g</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Carbs</p>
                              <p className="font-medium">{meals.lunch.macros.carbs}g</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Fats</p>
                              <p className="font-medium">{meals.lunch.macros.fats}g</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  )}
                  
                  {meals?.dinner && (
                    <TabsContent value="dinner" className="mt-0 p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{meals.dinner.name}</h3>
                          <p className="text-muted-foreground text-sm">{meals.dinner.macros.calories} calories</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Ingredients</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {meals.dinner.ingredients.map((ingredient: string, i: number) => (
                              <li key={i} className="text-sm">{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Preparation</h4>
                          <p className="text-sm">{meals.dinner.preparation}</p>
                        </div>
                        
                        <div className="bg-muted rounded-md p-3">
                          <h4 className="font-medium mb-2">Nutritional Information</h4>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Calories</p>
                              <p className="font-medium">{meals.dinner.macros.calories} kcal</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Protein</p>
                              <p className="font-medium">{meals.dinner.macros.protein}g</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Carbs</p>
                              <p className="font-medium">{meals.dinner.macros.carbs}g</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Fats</p>
                              <p className="font-medium">{meals.dinner.macros.fats}g</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  )}
                  
                  {meals?.snacks && meals.snacks.length > 0 && (
                    <TabsContent value="snacks" className="mt-0 p-4">
                      <div className="space-y-8">
                        {meals.snacks.map((snack: any, index: number) => (
                          <div key={index} className="space-y-4 pb-6 border-b last:border-0 last:pb-0">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{snack.name}</h3>
                              <p className="text-muted-foreground text-sm">{snack.macros.calories} calories</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Ingredients</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {snack.ingredients.map((ingredient: string, i: number) => (
                                  <li key={i} className="text-sm">{ingredient}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Preparation</h4>
                              <p className="text-sm">{snack.preparation}</p>
                            </div>
                            
                            <div className="bg-muted rounded-md p-3">
                              <h4 className="font-medium mb-2">Nutritional Information</h4>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Calories</p>
                                  <p className="font-medium">{snack.macros.calories} kcal</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Protein</p>
                                  <p className="font-medium">{snack.macros.protein}g</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Carbs</p>
                                  <p className="font-medium">{snack.macros.carbs}g</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Fats</p>
                                  <p className="font-medium">{snack.macros.fats}g</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  )}
                </ScrollArea>
              </Tabs>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <Button variant="outline" onClick={handleDownloadPDF} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                
                <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete Meal Plan
                      </DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this meal plan? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          onDelete();
                          setIsConfirmOpen(false);
                          setIsDialogOpen(false);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="ghost" size="icon" onClick={() => setIsConfirmOpen(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Delete Meal Plan
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this meal plan? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    onDelete();
                    setIsConfirmOpen(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
}