import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Flame, 
  Egg, 
  Droplet, 
  Cookie, 
  Carrot, 
  Award,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface NutrientInfo {
  amount: number;
  unit: string;
  dailyValuePercent?: number;
}

interface NutritionData {
  macronutrients: {
    protein: NutrientInfo;
    carbohydrates: NutrientInfo;
    fat: NutrientInfo;
    fiber?: NutrientInfo;
    sugar?: NutrientInfo;
  };
  micronutrients?: {
    [key: string]: NutrientInfo;
  };
}

interface NutritionDisplayProps {
  nutritionData: {
    foodName?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    nutritionData?: NutritionData;
  };
}

export default function NutritionDisplay({ nutritionData }: NutritionDisplayProps) {
  const [showAllMicronutrients, setShowAllMicronutrients] = useState(false);
  
  if (!nutritionData) {
    return <div className="text-center py-8">No nutrition data available</div>;
  }
  
  const displayedData = nutritionData.nutritionData || {
    macronutrients: {
      protein: { amount: nutritionData.protein || 0, unit: 'g' },
      carbohydrates: { amount: nutritionData.carbs || 0, unit: 'g' },
      fat: { amount: nutritionData.fat || 0, unit: 'g' },
    }
  };
  
  // Calculate macronutrient percentages for the pie chart
  const totalMacros = 
    (displayedData.macronutrients.protein?.amount || 0) + 
    (displayedData.macronutrients.carbohydrates?.amount || 0) + 
    (displayedData.macronutrients.fat?.amount || 0);
  
  const macroPercentages = {
    protein: totalMacros ? Math.round((displayedData.macronutrients.protein?.amount || 0) / totalMacros * 100) : 0,
    carbs: totalMacros ? Math.round((displayedData.macronutrients.carbohydrates?.amount || 0) / totalMacros * 100) : 0,
    fat: totalMacros ? Math.round((displayedData.macronutrients.fat?.amount || 0) / totalMacros * 100) : 0,
  };
  
  // Get micronutrients to display
  const micronutrients = displayedData.micronutrients || {};
  const micronutrientEntries = Object.entries(micronutrients);
  const displayedMicronutrients = showAllMicronutrients 
    ? micronutrientEntries 
    : micronutrientEntries.slice(0, 5);
  
  const hasMoreMicronutrients = micronutrientEntries.length > 5;
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">{nutritionData.foodName || "Food Analysis"}</h2>
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-4 py-2 rounded-full">
          <Flame className="mr-2 h-5 w-5" />
          <span className="text-lg font-bold">{nutritionData.calories || 0}</span>
          <span className="ml-1">calories</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <Award className="mr-2 h-4 w-4 text-primary" />
            Macronutrients
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Egg className="mr-2 h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Protein</span>
                </div>
                <span className="text-sm">
                  {displayedData.macronutrients.protein?.amount || 0}
                  {displayedData.macronutrients.protein?.unit || 'g'}
                  {' '}
                  ({macroPercentages.protein}%)
                </span>
              </div>
              <Progress value={macroPercentages.protein} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Cookie className="mr-2 h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Carbohydrates</span>
                </div>
                <span className="text-sm">
                  {displayedData.macronutrients.carbohydrates?.amount || 0}
                  {displayedData.macronutrients.carbohydrates?.unit || 'g'}
                  {' '}
                  ({macroPercentages.carbs}%)
                </span>
              </div>
              <Progress value={macroPercentages.carbs} className="h-2 bg-yellow-100" indicatorClassName="bg-yellow-500" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Droplet className="mr-2 h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Fat</span>
                </div>
                <span className="text-sm">
                  {displayedData.macronutrients.fat?.amount || 0}
                  {displayedData.macronutrients.fat?.unit || 'g'}
                  {' '}
                  ({macroPercentages.fat}%)
                </span>
              </div>
              <Progress value={macroPercentages.fat} className="h-2 bg-red-100" indicatorClassName="bg-red-500" />
            </div>
            
            {displayedData.macronutrients.fiber && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <Carrot className="mr-2 h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Fiber</span>
                  </div>
                  <span className="text-sm">
                    {displayedData.macronutrients.fiber.amount}
                    {displayedData.macronutrients.fiber.unit}
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (displayedData.macronutrients.fiber.amount / 25) * 100)} 
                  className="h-2 bg-orange-100" 
                  indicatorClassName="bg-orange-500" 
                />
              </div>
            )}
            
            {displayedData.macronutrients.sugar && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">🍬</span>
                    <span className="text-sm font-medium">Sugar</span>
                  </div>
                  <span className="text-sm">
                    {displayedData.macronutrients.sugar.amount}
                    {displayedData.macronutrients.sugar.unit}
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (displayedData.macronutrients.sugar.amount / 30) * 100)} 
                  className="h-2 bg-pink-100" 
                  indicatorClassName="bg-pink-500" 
                />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <Award className="mr-2 h-4 w-4 text-primary" />
            Micronutrients
          </h3>
          
          {displayedMicronutrients.length > 0 ? (
            <>
              <div className="space-y-2">
                {displayedMicronutrients.map(([name, info], index) => (
                  <div key={index} className="flex justify-between items-center py-1 border-b border-neutral-100">
                    <span className="text-sm">{name}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        {info.amount} {info.unit}
                      </span>
                      {info.dailyValuePercent && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({info.dailyValuePercent}% DV)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {hasMoreMicronutrients && (
                <button
                  className="flex items-center text-sm text-primary mt-3 hover:underline"
                  onClick={() => setShowAllMicronutrients(!showAllMicronutrients)}
                >
                  {showAllMicronutrients ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show all micronutrients
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No micronutrient data available
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Nutritional Summary</h3>
          <div className="text-sm text-muted-foreground">
            Based on a 2,000 calorie diet
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-blue-50 p-3">
            <Egg className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <div className="text-sm font-medium">Protein</div>
            <div className="text-xs text-muted-foreground">
              {nutritionData.protein !== undefined ? `${nutritionData.protein}g` : 'N/A'}
            </div>
          </div>
          
          <div className="rounded-lg bg-yellow-50 p-3">
            <Cookie className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
            <div className="text-sm font-medium">Carbs</div>
            <div className="text-xs text-muted-foreground">
              {nutritionData.carbs !== undefined ? `${nutritionData.carbs}g` : 'N/A'}
            </div>
          </div>
          
          <div className="rounded-lg bg-red-50 p-3">
            <Droplet className="h-5 w-5 text-red-500 mx-auto mb-1" />
            <div className="text-sm font-medium">Fat</div>
            <div className="text-xs text-muted-foreground">
              {nutritionData.fat !== undefined ? `${nutritionData.fat}g` : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
