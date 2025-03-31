import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Minus, Trash2, SunIcon, Coffee, UtensilsCrossed } from "lucide-react";

// Define meal types
const mealTypes = [
  { value: "breakfast", label: "Breakfast", icon: <Coffee className="h-4 w-4" /> },
  { value: "lunch", label: "Lunch", icon: <SunIcon className="h-4 w-4" /> },
  { value: "dinner", label: "Dinner", icon: <UtensilsCrossed className="h-4 w-4" /> },
  { value: "snack", label: "Snack", icon: <SunIcon className="h-4 w-4" /> },
];

// Define dietary preferences
const dietaryPreferences = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "dairy-free", label: "Dairy-Free" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "low-carb", label: "Low-Carb" },
  { value: "low-fat", label: "Low-Fat" },
  { value: "high-protein", label: "High-Protein" },
];

// Define form schema
const mealSchema = z.object({
  type: z.string().min(1, "Meal type is required"),
  name: z.string().min(1, "Meal name is required"),
  description: z.string().optional(),
  calories: z.string().optional(),
  protein: z.string().optional(),
  carbs: z.string().optional(),
  fat: z.string().optional(),
});

const mealPlanSchema = z.object({
  name: z.string().min(3, "Plan name must be at least 3 characters"),
  description: z.string().optional(),
  preferences: z.array(z.string()).optional(),
  goals: z.string().optional(),
  meals: z.array(mealSchema).min(1, "Add at least one meal to your plan"),
});

type MealPlanFormValues = z.infer<typeof mealPlanSchema>;

interface MealPlannerProps {
  onSave: (mealPlan: any) => void;
  isSaving: boolean;
}

export default function MealPlanner({ onSave, isSaving }: MealPlannerProps) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  
  const form = useForm<MealPlanFormValues>({
    resolver: zodResolver(mealPlanSchema),
    defaultValues: {
      name: "",
      description: "",
      preferences: [],
      goals: "",
      meals: [
        {
          type: "breakfast",
          name: "",
          description: "",
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
        },
      ],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "meals",
  });
  
  const addMeal = () => {
    append({
      type: "breakfast",
      name: "",
      description: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    });
  };
  
  const togglePreference = (preference: string) => {
    setSelectedPreferences(prev => {
      if (prev.includes(preference)) {
        const newPrefs = prev.filter(p => p !== preference);
        form.setValue("preferences", newPrefs);
        return newPrefs;
      } else {
        const newPrefs = [...prev, preference];
        form.setValue("preferences", newPrefs);
        return newPrefs;
      }
    });
  };
  
  const onSubmit = (data: MealPlanFormValues) => {
    // Transform the data to match the format expected by the API
    const formattedData = {
      name: data.name,
      description: data.description || "",
      meals: JSON.stringify(data.meals),
    };
    
    onSave(formattedData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal Plan Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., My Weekly Meal Plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of your meal plan" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="preferences"
              render={() => (
                <FormItem>
                  <FormLabel>Dietary Preferences (Optional)</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dietaryPreferences.map((preference) => (
                      <Button
                        key={preference.value}
                        type="button"
                        variant={selectedPreferences.includes(preference.value) ? "default" : "outline"}
                        className="text-xs h-8"
                        onClick={() => togglePreference(preference.value)}
                      >
                        {preference.label}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nutrition Goals (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Weight loss, muscle gain, maintain weight" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Meals</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addMeal}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Meal
              </Button>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Meal {index + 1}</CardTitle>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => fields.length > 1 && remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`meals.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select meal type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mealTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    <span className="flex items-center">
                                      {type.icon}
                                      <span className="ml-2">{type.label}</span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`meals.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Greek Yogurt Parfait" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name={`meals.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description or ingredients" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-4 gap-2">
                      <FormField
                        control={form.control}
                        name={`meals.${index}.calories`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Calories</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="kcal" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`meals.${index}.protein`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Protein</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="g" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`meals.${index}.carbs`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Carbs</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="g" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`meals.${index}.fat`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fat</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="g" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Meal Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
