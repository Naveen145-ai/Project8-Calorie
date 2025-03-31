import { FoodEntry } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

interface NutritionInfoProps {
  foodEntry: FoodEntry;
}

export default function NutritionInfo({ foodEntry }: NutritionInfoProps) {
  // Calculate percentage for macronutrients
  const totalGrams = foodEntry.protein + foodEntry.carbs + foodEntry.fats;
  const proteinPercentage = (foodEntry.protein / totalGrams) * 100;
  const carbsPercentage = (foodEntry.carbs / totalGrams) * 100;
  const fatsPercentage = (foodEntry.fats / totalGrams) * 100;

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
            <div className="font-semibold">{foodEntry.calories}</div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground mb-1">Protein</div>
            <div className="font-semibold">{foodEntry.protein}g</div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground mb-1">Carbs</div>
            <div className="font-semibold">{foodEntry.carbs}g</div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground mb-1">Fats</div>
            <div className="font-semibold">{foodEntry.fats}g</div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground mb-1">Fiber</div>
            <div className="font-semibold">{foodEntry.nutrients?.fiber || 0}g</div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground mb-1">Sugar</div>
            <div className="font-semibold">{foodEntry.nutrients?.sugar || 0}g</div>
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
            <span className="font-medium">{Math.round((foodEntry.calories / 2000) * 100)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Protein</span>
            <span className="font-medium">{Math.round((foodEntry.protein / 50) * 100)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Carbs</span>
            <span className="font-medium">{Math.round((foodEntry.carbs / 300) * 100)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Fats</span>
            <span className="font-medium">{Math.round((foodEntry.fats / 65) * 100)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Fiber</span>
            <span className="font-medium">{Math.round(((foodEntry.nutrients?.fiber || 0) / 28) * 100)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Sugar</span>
            <span className="font-medium">{Math.round(((foodEntry.nutrients?.sugar || 0) / 50) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}