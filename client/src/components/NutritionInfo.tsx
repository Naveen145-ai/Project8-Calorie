import { FoodEntry } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

interface NutritionInfoProps {
  foodEntry: FoodEntry;
}

export default function NutritionInfo({ foodEntry }: NutritionInfoProps) {
  // Calculate percentage for macronutrients
  const protein = foodEntry.protein || 0;
  const carbs = foodEntry.carbs || 0;
  const fats = foodEntry.fats || 0;
  const calories = foodEntry.calories || 0;
  
  // Ensure nutrients object exists with proper typing
  const nutrients = (foodEntry.nutrients as any) || {
    vitamins: {},
    minerals: {},
    fiber: 0,
    sugar: 0
  };
  
  const totalGrams = protein + carbs + fats;
  const proteinPercentage = totalGrams > 0 ? (protein / totalGrams) * 100 : 0;
  const carbsPercentage = totalGrams > 0 ? (carbs / totalGrams) * 100 : 0;
  const fatsPercentage = totalGrams > 0 ? (fats / totalGrams) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="font-medium">Macronutrients</h3>
          <span className="text-sm text-muted-foreground">{totalGrams}g total</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <div className="text-sm font-medium">Protein</div>
              <div className="text-sm text-muted-foreground">{foodEntry.protein}g</div>
            </div>
            <Progress value={proteinPercentage} className="h-2 bg-muted" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div className="text-sm font-medium">Carbohydrates</div>
              <div className="text-sm text-muted-foreground">{foodEntry.carbs}g</div>
            </div>
            <Progress value={carbsPercentage} className="h-2 bg-muted" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div className="text-sm font-medium">Fats</div>
              <div className="text-sm text-muted-foreground">{foodEntry.fats}g</div>
            </div>
            <Progress value={fatsPercentage} className="h-2 bg-muted" />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">Nutritional Breakdown</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground mb-1">Calories</div>
            <div className="font-semibold">{calories}</div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground mb-1">Protein</div>
            <div className="font-semibold">{protein}g</div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground mb-1">Carbs</div>
            <div className="font-semibold">{carbs}g</div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground mb-1">Fats</div>
            <div className="font-semibold">{fats}g</div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground mb-1">Fiber</div>
            <div className="font-semibold">{nutrients.fiber || 0}g</div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground mb-1">Sugar</div>
            <div className="font-semibold">{nutrients.sugar || 0}g</div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-1">Daily Value</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Based on a 2,000 calorie diet
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Calories</span>
            <span className="font-medium">{Math.round((calories / 2000) * 100)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Protein</span>
            <span className="font-medium">{Math.round((protein / 50) * 100)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Carbs</span>
            <span className="font-medium">{Math.round((carbs / 300) * 100)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Fats</span>
            <span className="font-medium">{Math.round((fats / 65) * 100)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Fiber</span>
            <span className="font-medium">{Math.round(((nutrients.fiber || 0) / 28) * 100)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Sugar</span>
            <span className="font-medium">{Math.round(((nutrients.sugar || 0) / 50) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}