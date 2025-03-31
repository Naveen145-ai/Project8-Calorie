import { useState } from "react";
import { FoodEntry } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface NutritionInfoProps {
  foodEntry: FoodEntry;
}

export default function NutritionInfo({ foodEntry }: NutritionInfoProps) {
  const [activeTab, setActiveTab] = useState("macros");

  // Calculate total calories from macronutrients if available
  const proteinCalories = (foodEntry.protein || 0) * 4;
  const carbsCalories = (foodEntry.carbs || 0) * 4;
  const fatsCalories = (foodEntry.fats || 0) * 9;
  const totalCaloriesFromMacros = proteinCalories + carbsCalories + fatsCalories;

  // Data for macronutrient distribution pie chart
  const macroData = [
    { name: "Protein", value: foodEntry.protein || 0, calories: proteinCalories, color: "#4CAF50" },
    { name: "Carbs", value: foodEntry.carbs || 0, calories: carbsCalories, color: "#2196F3" },
    { name: "Fats", value: foodEntry.fats || 0, calories: fatsCalories, color: "#FF9800" },
  ];

  // Get vitamins and minerals from nutrients object if it exists
  const vitamins = foodEntry.nutrients?.vitamins || {};
  const minerals = foodEntry.nutrients?.minerals || {};
  const fiber = foodEntry.nutrients?.fiber || 0;
  const sugar = foodEntry.nutrients?.sugar || 0;

  // Helper function to display nutrient value with unit
  const formatNutrient = (value: number, unit: string = "mg") => {
    if (value >= 1000 && unit === "mg") {
      return `${(value / 1000).toFixed(1)} g`;
    }
    return `${value} ${unit}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Nutritional Information</h3>
        <div className="text-sm font-medium text-primary">
          {foodEntry.calories} kcal
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="macros">Macronutrients</TabsTrigger>
          <TabsTrigger value="vitamins">Vitamins</TabsTrigger>
          <TabsTrigger value="minerals">Minerals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="macros" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-sm text-muted-foreground">{foodEntry.protein}g ({Math.round(proteinCalories)} kcal)</span>
                </div>
                <Progress value={(proteinCalories / totalCaloriesFromMacros) * 100} className="h-2 bg-muted" indicatorClassName="bg-[#4CAF50]" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Carbohydrates</span>
                  <span className="text-sm text-muted-foreground">{foodEntry.carbs}g ({Math.round(carbsCalories)} kcal)</span>
                </div>
                <Progress value={(carbsCalories / totalCaloriesFromMacros) * 100} className="h-2 bg-muted" indicatorClassName="bg-[#2196F3]" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Fats</span>
                  <span className="text-sm text-muted-foreground">{foodEntry.fats}g ({Math.round(fatsCalories)} kcal)</span>
                </div>
                <Progress value={(fatsCalories / totalCaloriesFromMacros) * 100} className="h-2 bg-muted" indicatorClassName="bg-[#FF9800]" />
              </div>
              
              {fiber > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Fiber</span>
                    <span className="text-sm text-muted-foreground">{fiber}g</span>
                  </div>
                  <Progress value={(fiber / (foodEntry.carbs || 1)) * 100} className="h-2 bg-muted" />
                </div>
              )}
              
              {sugar > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Sugar</span>
                    <span className="text-sm text-muted-foreground">{sugar}g</span>
                  </div>
                  <Progress value={(sugar / (foodEntry.carbs || 1)) * 100} className="h-2 bg-muted" />
                </div>
              )}
            </div>
            
            <div className="h-52 md:h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}g`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="vitamins">
          {Object.keys(vitamins).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(vitamins).map(([vitamin, value]) => (
                <Card key={vitamin}>
                  <CardContent className="p-4">
                    <div className="font-medium">{vitamin}</div>
                    <div className="text-muted-foreground text-sm">{formatNutrient(value)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No vitamin information available for this food
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="minerals">
          {Object.keys(minerals).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(minerals).map(([mineral, value]) => (
                <Card key={mineral}>
                  <CardContent className="p-4">
                    <div className="font-medium">{mineral}</div>
                    <div className="text-muted-foreground text-sm">{formatNutrient(value)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No mineral information available for this food
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
