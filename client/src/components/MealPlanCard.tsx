import { useState } from "react";
import { MealPlan } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, ChevronRight, Utensils, Info } from "lucide-react";
import { motion } from "framer-motion";

interface MealPlanCardProps {
  mealPlan: MealPlan;
  onDelete: () => void;
}

export default function MealPlanCard({ mealPlan, onDelete }: MealPlanCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const totalCalories = mealPlan.calories || 
    Object.values(mealPlan.meals).reduce((total, meal) => {
      if (Array.isArray(meal)) {
        return total + meal.reduce((sum, m) => sum + (m.macros?.calories || 0), 0);
      }
      return total + (meal.macros?.calories || 0);
    }, 0);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="bg-primary/5 pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>{mealPlan.name}</span>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </CardTitle>
          <CardDescription>
            Created on {formatDate(mealPlan.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground mb-4">{mealPlan.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Utensils className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{totalCalories} calories</span>
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
              {Object.keys(mealPlan.meals).length} meals
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="breakfast">
              <AccordionTrigger>Breakfast</AccordionTrigger>
              <AccordionContent>
                <p className="font-medium">{mealPlan.meals.breakfast?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {mealPlan.meals.breakfast?.macros?.calories} kcal
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="lunch">
              <AccordionTrigger>Lunch</AccordionTrigger>
              <AccordionContent>
                <p className="font-medium">{mealPlan.meals.lunch?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {mealPlan.meals.lunch?.macros?.calories} kcal
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="dinner">
              <AccordionTrigger>Dinner</AccordionTrigger>
              <AccordionContent>
                <p className="font-medium">{mealPlan.meals.dinner?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {mealPlan.meals.dinner?.macros?.calories} kcal
                </p>
              </AccordionContent>
            </AccordionItem>
            
            {mealPlan.meals.snacks && mealPlan.meals.snacks.length > 0 && (
              <AccordionItem value="snacks">
                <AccordionTrigger>Snacks</AccordionTrigger>
                <AccordionContent>
                  {mealPlan.meals.snacks.map((snack, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <p className="font-medium">{snack.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {snack.macros?.calories} kcal
                      </p>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
        <CardFooter className="bg-muted/30 pt-2">
          <Button variant="ghost" className="w-full" onClick={() => setIsOpen(true)}>
            <Info className="h-4 w-4 mr-2" />
            View Full Details
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{mealPlan.name}</DialogTitle>
            <DialogDescription>{mealPlan.description}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {totalCalories} calories
              </div>
              <div className="text-sm text-muted-foreground">
                Created on {formatDate(mealPlan.createdAt)}
              </div>
            </div>
            
            {/* Breakfast */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-primary/5 px-4 py-3 font-semibold flex items-center justify-between">
                <span>Breakfast</span>
                <span className="text-sm text-muted-foreground">
                  {mealPlan.meals.breakfast?.macros?.calories} kcal
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{mealPlan.meals.breakfast?.name}</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Ingredients</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {mealPlan.meals.breakfast?.ingredients?.map((ingredient, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {ingredient}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Preparation</h4>
                  <p className="text-sm">{mealPlan.meals.breakfast?.preparation}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Nutritional Info</h4>
                  <div className="flex gap-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                      Protein: {mealPlan.meals.breakfast?.macros?.protein}g
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                      Carbs: {mealPlan.meals.breakfast?.macros?.carbs}g
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                      Fats: {mealPlan.meals.breakfast?.macros?.fats}g
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Lunch */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-primary/5 px-4 py-3 font-semibold flex items-center justify-between">
                <span>Lunch</span>
                <span className="text-sm text-muted-foreground">
                  {mealPlan.meals.lunch?.macros?.calories} kcal
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{mealPlan.meals.lunch?.name}</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Ingredients</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {mealPlan.meals.lunch?.ingredients?.map((ingredient, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {ingredient}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Preparation</h4>
                  <p className="text-sm">{mealPlan.meals.lunch?.preparation}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Nutritional Info</h4>
                  <div className="flex gap-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                      Protein: {mealPlan.meals.lunch?.macros?.protein}g
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                      Carbs: {mealPlan.meals.lunch?.macros?.carbs}g
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                      Fats: {mealPlan.meals.lunch?.macros?.fats}g
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dinner */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-primary/5 px-4 py-3 font-semibold flex items-center justify-between">
                <span>Dinner</span>
                <span className="text-sm text-muted-foreground">
                  {mealPlan.meals.dinner?.macros?.calories} kcal
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{mealPlan.meals.dinner?.name}</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Ingredients</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {mealPlan.meals.dinner?.ingredients?.map((ingredient, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {ingredient}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Preparation</h4>
                  <p className="text-sm">{mealPlan.meals.dinner?.preparation}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Nutritional Info</h4>
                  <div className="flex gap-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                      Protein: {mealPlan.meals.dinner?.macros?.protein}g
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                      Carbs: {mealPlan.meals.dinner?.macros?.carbs}g
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                      Fats: {mealPlan.meals.dinner?.macros?.fats}g
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Snacks */}
            {mealPlan.meals.snacks && mealPlan.meals.snacks.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-primary/5 px-4 py-3 font-semibold">
                  Snacks
                </div>
                <div className="p-4">
                  {mealPlan.meals.snacks.map((snack, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{snack.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          {snack.macros?.calories} kcal
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Ingredients</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {snack.ingredients?.map((ingredient, i) => (
                            <li key={i}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Preparation</h4>
                        <p className="text-sm">{snack.preparation}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Nutritional Info</h4>
                        <div className="flex gap-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                            Protein: {snack.macros?.protein}g
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                            Carbs: {snack.macros?.carbs}g
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                            Fats: {snack.macros?.fats}g
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
