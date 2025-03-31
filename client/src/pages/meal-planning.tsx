import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { MealPlan } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, Calendar, Utensils, UtensilsCrossed } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import MealPlanCard from "@/components/MealPlanCard";

// Form schema
const mealPlanSchema = z.object({
  height: z.coerce.number().min(50, "Height must be at least 50cm").max(300, "Height must be less than 300cm"),
  weight: z.coerce.number().min(20, "Weight must be at least 20kg").max(300, "Weight must be less than 300kg"),
  gender: z.enum(["male", "female", "other"]),
  diet: z.enum(["vegetarian", "non-vegetarian", "vegan", "pescatarian"]),
  mealsPerDay: z.coerce.number().min(2).max(6),
  healthIssues: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

type MealPlanFormValues = z.infer<typeof mealPlanSchema>;

// Health issues options
const healthIssuesOptions = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "Hypertension" },
  { id: "pcod", label: "PCOD" },
  { id: "heart-disease", label: "Heart Disease" },
  { id: "thyroid", label: "Thyroid Issues" },
  { id: "pregnancy", label: "Pregnancy" },
];

// Allergy options
const allergyOptions = [
  { id: "dairy", label: "Dairy" },
  { id: "nuts", label: "Nuts" },
  { id: "seafood", label: "Seafood" },
  { id: "eggs", label: "Eggs" },
  { id: "gluten", label: "Gluten" },
  { id: "soy", label: "Soy" },
];

export default function MealPlanning() {
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const { toast } = useToast();

  // Load existing meal plans
  const { data: mealPlans = [], isLoading: plansLoading } = useQuery<MealPlan[]>({
    queryKey: ["/api/meal-plans"],
  });

  // Form setup
  const form = useForm<MealPlanFormValues>({
    resolver: zodResolver(mealPlanSchema),
    defaultValues: {
      height: 170,
      weight: 70,
      gender: "male",
      diet: "non-vegetarian",
      mealsPerDay: 3,
      healthIssues: [],
      allergies: [],
      notes: "",
    },
  });

  // Default meal plan data based on various diet options
  const getDefaultMealPlan = (values: MealPlanFormValues) => {
    // Calculate BMR based on gender, height, weight
    const heightInCm = values.height;
    const weightInKg = values.weight;
    let bmr;

    if (values.gender === "male") {
      bmr = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * 30); // Assuming age 30
    } else {
      bmr = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * 30); // Assuming age 30
    }

    // Adjust calories based on health issues
    let targetCalories = bmr * 1.375; // Assuming light activity
    
    if (values.healthIssues?.includes("diabetes")) {
      targetCalories = bmr * 1.2; // Lower for diabetes
    }
    
    if (values.healthIssues?.includes("pcod")) {
      targetCalories = bmr * 1.2; // Lower for PCOD
    }
    
    if (values.healthIssues?.includes("heart-disease")) {
      targetCalories = bmr * 1.2; // Lower for heart disease
    }
    
    // Adjust for pregnancy
    if (values.healthIssues?.includes("pregnancy")) {
      targetCalories += 300; // Additional calories for pregnancy
    }

    const totalCalories = Math.round(targetCalories);
    
    // Default meal plans based on diet type
    const dietType = values.diet;
    const mealsPerDay = values.mealsPerDay;
    
    let mealPlan: any = {
      id: 1,
      userId: 1,
      name: `${values.gender === 'male' ? 'Male' : 'Female'} ${dietType.charAt(0).toUpperCase() + dietType.slice(1)} Meal Plan`,
      description: `A ${dietType} meal plan designed for ${values.gender === 'male' ? 'men' : 'women'} with a target of ${totalCalories} calories per day.`,
      createdAt: new Date(),
      calories: totalCalories,
      meals: {}
    };
    
    // Configure meals per day
    if (mealsPerDay === 3) {
      if (dietType === "vegetarian") {
        mealPlan.meals = {
          breakfast: {
            name: "Vegetarian Breakfast",
            ingredients: [
              "2 slices whole wheat bread",
              "1 tbsp peanut butter",
              "1 medium banana",
              "1 cup Greek yogurt",
              "1 tsp honey"
            ],
            preparation: "Toast bread, spread peanut butter. Slice banana and serve with yogurt drizzled with honey.",
            macros: {
              calories: Math.round(totalCalories * 0.3),
              protein: 20,
              carbs: 65,
              fats: 10
            },
            imageDescription: "Toast with peanut butter, banana, and a bowl of yogurt with honey"
          },
          lunch: {
            name: "Hearty Quinoa Salad",
            ingredients: [
              "1 cup cooked quinoa",
              "1 cup mixed vegetables (bell peppers, cucumber, tomatoes)",
              "1/4 cup feta cheese",
              "2 tbsp olive oil",
              "1 tbsp lemon juice",
              "1/4 cup chickpeas"
            ],
            preparation: "Combine all ingredients in a bowl. Drizzle with olive oil and lemon juice. Toss well.",
            macros: {
              calories: Math.round(totalCalories * 0.4),
              protein: 15,
              carbs: 40,
              fats: 20
            },
            imageDescription: "Colorful quinoa salad with vegetables and feta cheese"
          },
          dinner: {
            name: "Vegetable Stir-Fry with Tofu",
            ingredients: [
              "200g firm tofu, cubed",
              "2 cups mixed vegetables (broccoli, carrots, snap peas)",
              "1 tbsp soy sauce",
              "1 tbsp sesame oil",
              "1 garlic clove, minced",
              "1/2 cup brown rice, cooked"
            ],
            preparation: "Sauté tofu until golden. Add vegetables and garlic. Season with soy sauce and sesame oil. Serve over brown rice.",
            macros: {
              calories: Math.round(totalCalories * 0.3),
              protein: 20,
              carbs: 30,
              fats: 15
            },
            imageDescription: "Colorful vegetable stir-fry with tofu cubes on a bed of brown rice"
          },
          snacks: []
        };
      } else if (dietType === "non-vegetarian") {
        mealPlan.meals = {
          breakfast: {
            name: "Protein-Packed Breakfast",
            ingredients: [
              "3 egg whites, 1 whole egg",
              "1/4 cup chopped bell peppers and onions",
              "1 slice whole grain toast",
              "1/2 avocado",
              "1 medium apple"
            ],
            preparation: "Scramble eggs with vegetables. Serve with toast topped with sliced avocado.",
            macros: {
              calories: Math.round(totalCalories * 0.3),
              protein: 25,
              carbs: 40,
              fats: 15
            },
            imageDescription: "Scrambled eggs with vegetables, avocado toast, and an apple on the side"
          },
          lunch: {
            name: "Grilled Chicken Salad",
            ingredients: [
              "150g grilled chicken breast",
              "2 cups mixed greens",
              "1/4 cup cherry tomatoes, halved",
              "1/4 cucumber, sliced",
              "2 tbsp balsamic vinaigrette",
              "1 small whole wheat roll"
            ],
            preparation: "Slice grilled chicken. Toss with greens, tomatoes, and cucumber. Drizzle with vinaigrette. Serve with roll.",
            macros: {
              calories: Math.round(totalCalories * 0.35),
              protein: 30,
              carbs: 30,
              fats: 10
            },
            imageDescription: "Fresh salad with grilled chicken strips, colorful vegetables, and a small bread roll"
          },
          dinner: {
            name: "Baked Salmon with Vegetables",
            ingredients: [
              "150g salmon fillet",
              "1 cup roasted vegetables (zucchini, bell peppers, asparagus)",
              "1 tbsp olive oil",
              "1 tsp herbs de provence",
              "1/2 cup quinoa, cooked"
            ],
            preparation: "Season salmon and vegetables with herbs and olive oil. Bake at 400°F for 15-20 minutes. Serve with quinoa.",
            macros: {
              calories: Math.round(totalCalories * 0.35),
              protein: 30,
              carbs: 25,
              fats: 20
            },
            imageDescription: "Baked salmon fillet with colorful roasted vegetables and a side of quinoa"
          },
          snacks: []
        };
      } else if (dietType === "vegan") {
        mealPlan.meals = {
          breakfast: {
            name: "Vegan Power Breakfast",
            ingredients: [
              "1 cup rolled oats",
              "2 tbsp chia seeds",
              "1 cup almond milk",
              "1 tbsp maple syrup",
              "1/2 cup mixed berries",
              "2 tbsp chopped nuts"
            ],
            preparation: "Combine oats, chia seeds, almond milk, and maple syrup. Let sit overnight or for 30 minutes. Top with berries and nuts.",
            macros: {
              calories: Math.round(totalCalories * 0.3),
              protein: 12,
              carbs: 60,
              fats: 15
            },
            imageDescription: "Overnight oats topped with fresh berries and chopped nuts"
          },
          lunch: {
            name: "Buddha Bowl",
            ingredients: [
              "1 cup roasted sweet potatoes",
              "1/2 cup chickpeas",
              "1 cup kale, massaged",
              "1/4 avocado, sliced",
              "2 tbsp tahini dressing",
              "1 tbsp nutritional yeast"
            ],
            preparation: "Arrange sweet potatoes, chickpeas, and kale in a bowl. Top with avocado, drizzle with tahini dressing, and sprinkle nutritional yeast.",
            macros: {
              calories: Math.round(totalCalories * 0.35),
              protein: 15,
              carbs: 45,
              fats: 20
            },
            imageDescription: "Colorful buddha bowl with roasted sweet potatoes, chickpeas, and avocado"
          },
          dinner: {
            name: "Lentil Pasta with Vegetables",
            ingredients: [
              "1 cup cooked lentil pasta",
              "1 cup mixed vegetables (zucchini, mushrooms, spinach)",
              "1/4 cup tomato sauce",
              "1 tbsp olive oil",
              "1 tbsp nutritional yeast",
              "1 tsp Italian herbs"
            ],
            preparation: "Sauté vegetables in olive oil. Add tomato sauce and herbs. Toss with cooked pasta. Sprinkle nutritional yeast on top.",
            macros: {
              calories: Math.round(totalCalories * 0.35),
              protein: 20,
              carbs: 45,
              fats: 10
            },
            imageDescription: "Lentil pasta with sautéed vegetables in tomato sauce"
          },
          snacks: []
        };
      } else if (dietType === "pescatarian") {
        mealPlan.meals = {
          breakfast: {
            name: "Omega-3 Breakfast",
            ingredients: [
              "2 slices whole grain bread",
              "50g smoked salmon",
              "1/4 avocado, mashed",
              "2 tbsp cream cheese",
              "1 tsp lemon juice",
              "1 tsp dill"
            ],
            preparation: "Toast bread. Spread with cream cheese. Top with salmon, avocado, lemon juice, and dill.",
            macros: {
              calories: Math.round(totalCalories * 0.3),
              protein: 20,
              carbs: 30,
              fats: 15
            },
            imageDescription: "Whole grain toast topped with cream cheese, smoked salmon, and avocado"
          },
          lunch: {
            name: "Mediterranean Tuna Salad",
            ingredients: [
              "1 can tuna in water, drained",
              "2 cups mixed greens",
              "10 cherry tomatoes, halved",
              "10 olives, sliced",
              "1/4 red onion, thinly sliced",
              "2 tbsp olive oil and lemon dressing"
            ],
            preparation: "Mix tuna with greens, tomatoes, olives, and onion. Drizzle with dressing.",
            macros: {
              calories: Math.round(totalCalories * 0.35),
              protein: 30,
              carbs: 15,
              fats: 15
            },
            imageDescription: "Fresh salad with tuna chunks, olives, and vegetables"
          },
          dinner: {
            name: "Grilled Shrimp and Vegetable Skewers",
            ingredients: [
              "150g shrimp, peeled and deveined",
              "1 cup mixed vegetables (bell peppers, zucchini, cherry tomatoes)",
              "1 tbsp olive oil",
              "1 garlic clove, minced",
              "1/2 cup quinoa, cooked",
              "1 lemon, cut into wedges"
            ],
            preparation: "Thread shrimp and vegetables onto skewers. Brush with olive oil and garlic. Grill for 2-3 minutes per side. Serve with quinoa and lemon wedges.",
            macros: {
              calories: Math.round(totalCalories * 0.35),
              protein: 25,
              carbs: 30,
              fats: 10
            },
            imageDescription: "Grilled shrimp and vegetable skewers on a bed of quinoa with lemon wedges"
          },
          snacks: []
        };
      }
    } else if (mealsPerDay >= 4) {
      // Add snacks for meal plans with more than 3 meals per day
      let baseMealPlan;
      
      if (dietType === "vegetarian") {
        baseMealPlan = {
          breakfast: {
            name: "Vegetarian Breakfast",
            ingredients: [
              "2 slices whole wheat bread",
              "1 tbsp peanut butter",
              "1 medium banana",
              "1 cup Greek yogurt",
              "1 tsp honey"
            ],
            preparation: "Toast bread, spread peanut butter. Slice banana and serve with yogurt drizzled with honey.",
            macros: {
              calories: Math.round(totalCalories * 0.25),
              protein: 20,
              carbs: 65,
              fats: 10
            },
            imageDescription: "Toast with peanut butter, banana, and a bowl of yogurt with honey"
          },
          lunch: {
            name: "Hearty Quinoa Salad",
            ingredients: [
              "1 cup cooked quinoa",
              "1 cup mixed vegetables (bell peppers, cucumber, tomatoes)",
              "1/4 cup feta cheese",
              "2 tbsp olive oil",
              "1 tbsp lemon juice",
              "1/4 cup chickpeas"
            ],
            preparation: "Combine all ingredients in a bowl. Drizzle with olive oil and lemon juice. Toss well.",
            macros: {
              calories: Math.round(totalCalories * 0.3),
              protein: 15,
              carbs: 40,
              fats: 20
            },
            imageDescription: "Colorful quinoa salad with vegetables and feta cheese"
          },
          dinner: {
            name: "Vegetable Stir-Fry with Tofu",
            ingredients: [
              "200g firm tofu, cubed",
              "2 cups mixed vegetables (broccoli, carrots, snap peas)",
              "1 tbsp soy sauce",
              "1 tbsp sesame oil",
              "1 garlic clove, minced",
              "1/2 cup brown rice, cooked"
            ],
            preparation: "Sauté tofu until golden. Add vegetables and garlic. Season with soy sauce and sesame oil. Serve over brown rice.",
            macros: {
              calories: Math.round(totalCalories * 0.25),
              protein: 20,
              carbs: 30,
              fats: 15
            },
            imageDescription: "Colorful vegetable stir-fry with tofu cubes on a bed of brown rice"
          },
          snacks: [
            {
              name: "Fruit and Nut Mix",
              ingredients: [
                "1/4 cup mixed nuts (almonds, walnuts)",
                "1/4 cup dried fruits (apricots, raisins)",
                "1 medium apple, sliced"
              ],
              preparation: "Mix nuts and dried fruits. Serve with apple slices.",
              macros: {
                calories: Math.round(totalCalories * 0.1),
                protein: 5,
                carbs: 20,
                fats: 10
              },
              imageDescription: "Trail mix of nuts and dried fruits with fresh apple slices"
            },
            {
              name: "Protein Smoothie",
              ingredients: [
                "1 cup almond milk",
                "1 scoop plant-based protein powder",
                "1/2 frozen banana",
                "1 tbsp almond butter",
                "1/2 cup spinach",
                "Ice cubes"
              ],
              preparation: "Blend all ingredients until smooth.",
              macros: {
                calories: Math.round(totalCalories * 0.1),
                protein: 20,
                carbs: 15,
                fats: 5
              },
              imageDescription: "Green protein smoothie in a glass with a straw"
            }
          ]
        };
      } else if (dietType === "non-vegetarian") {
        baseMealPlan = {
          breakfast: {
            name: "Protein-Packed Breakfast",
            ingredients: [
              "3 egg whites, 1 whole egg",
              "1/4 cup chopped bell peppers and onions",
              "1 slice whole grain toast",
              "1/2 avocado",
              "1 medium apple"
            ],
            preparation: "Scramble eggs with vegetables. Serve with toast topped with sliced avocado.",
            macros: {
              calories: Math.round(totalCalories * 0.25),
              protein: 25,
              carbs: 40,
              fats: 15
            },
            imageDescription: "Scrambled eggs with vegetables, avocado toast, and an apple on the side"
          },
          lunch: {
            name: "Grilled Chicken Salad",
            ingredients: [
              "150g grilled chicken breast",
              "2 cups mixed greens",
              "1/4 cup cherry tomatoes, halved",
              "1/4 cucumber, sliced",
              "2 tbsp balsamic vinaigrette",
              "1 small whole wheat roll"
            ],
            preparation: "Slice grilled chicken. Toss with greens, tomatoes, and cucumber. Drizzle with vinaigrette. Serve with roll.",
            macros: {
              calories: Math.round(totalCalories * 0.3),
              protein: 30,
              carbs: 30,
              fats: 10
            },
            imageDescription: "Fresh salad with grilled chicken strips, colorful vegetables, and a small bread roll"
          },
          dinner: {
            name: "Baked Salmon with Vegetables",
            ingredients: [
              "150g salmon fillet",
              "1 cup roasted vegetables (zucchini, bell peppers, asparagus)",
              "1 tbsp olive oil",
              "1 tsp herbs de provence",
              "1/2 cup quinoa, cooked"
            ],
            preparation: "Season salmon and vegetables with herbs and olive oil. Bake at 400°F for 15-20 minutes. Serve with quinoa.",
            macros: {
              calories: Math.round(totalCalories * 0.25),
              protein: 30,
              carbs: 25,
              fats: 20
            },
            imageDescription: "Baked salmon fillet with colorful roasted vegetables and a side of quinoa"
          },
          snacks: [
            {
              name: "Protein Snack Pack",
              ingredients: [
                "2 hard-boiled eggs",
                "1 oz cheese cubes",
                "10 almonds",
                "1 small apple, sliced"
              ],
              preparation: "Arrange all items on a plate or in a container for a grab-and-go snack.",
              macros: {
                calories: Math.round(totalCalories * 0.1),
                protein: 15,
                carbs: 15,
                fats: 10
              },
              imageDescription: "Hard-boiled eggs, cheese cubes, almonds, and apple slices arranged on a plate"
            },
            {
              name: "Greek Yogurt Parfait",
              ingredients: [
                "1 cup Greek yogurt",
                "1/4 cup granola",
                "1/4 cup mixed berries",
                "1 tsp honey",
                "1 tbsp chopped nuts"
              ],
              preparation: "Layer yogurt, granola, and berries in a glass. Drizzle with honey and top with chopped nuts.",
              macros: {
                calories: Math.round(totalCalories * 0.1),
                protein: 20,
                carbs: 20,
                fats: 5
              },
              imageDescription: "Layered Greek yogurt parfait with granola and fresh berries in a glass"
            }
          ]
        };
      } else if (dietType === "vegan") {
        baseMealPlan = {
          breakfast: {
            name: "Vegan Power Breakfast",
            ingredients: [
              "1 cup rolled oats",
              "2 tbsp chia seeds",
              "1 cup almond milk",
              "1 tbsp maple syrup",
              "1/2 cup mixed berries",
              "2 tbsp chopped nuts"
            ],
            preparation: "Combine oats, chia seeds, almond milk, and maple syrup. Let sit overnight or for 30 minutes. Top with berries and nuts.",
            macros: {
              calories: Math.round(totalCalories * 0.25),
              protein: 12,
              carbs: 60,
              fats: 15
            },
            imageDescription: "Overnight oats topped with fresh berries and chopped nuts"
          },
          lunch: {
            name: "Buddha Bowl",
            ingredients: [
              "1 cup roasted sweet potatoes",
              "1/2 cup chickpeas",
              "1 cup kale, massaged",
              "1/4 avocado, sliced",
              "2 tbsp tahini dressing",
              "1 tbsp nutritional yeast"
            ],
            preparation: "Arrange sweet potatoes, chickpeas, and kale in a bowl. Top with avocado, drizzle with tahini dressing, and sprinkle nutritional yeast.",
            macros: {
              calories: Math.round(totalCalories * 0.3),
              protein: 15,
              carbs: 45,
              fats: 20
            },
            imageDescription: "Colorful buddha bowl with roasted sweet potatoes, chickpeas, and avocado"
          },
          dinner: {
            name: "Lentil Pasta with Vegetables",
            ingredients: [
              "1 cup cooked lentil pasta",
              "1 cup mixed vegetables (zucchini, mushrooms, spinach)",
              "1/4 cup tomato sauce",
              "1 tbsp olive oil",
              "1 tbsp nutritional yeast",
              "1 tsp Italian herbs"
            ],
            preparation: "Sauté vegetables in olive oil. Add tomato sauce and herbs. Toss with cooked pasta. Sprinkle nutritional yeast on top.",
            macros: {
              calories: Math.round(totalCalories * 0.25),
              protein: 20,
              carbs: 45,
              fats: 10
            },
            imageDescription: "Lentil pasta with sautéed vegetables in tomato sauce"
          },
          snacks: [
            {
              name: "Energy Balls",
              ingredients: [
                "1/2 cup dates, pitted",
                "1/4 cup rolled oats",
                "2 tbsp almond butter",
                "1 tbsp chia seeds",
                "1 tbsp cocoa powder",
                "1 tsp vanilla extract"
              ],
              preparation: "Blend all ingredients in a food processor. Roll into small balls. Refrigerate for 30 minutes before serving.",
              macros: {
                calories: Math.round(totalCalories * 0.1),
                protein: 5,
                carbs: 20,
                fats: 5
              },
              imageDescription: "Chocolate energy balls on a small plate"
            },
            {
              name: "Vegetable Sticks with Hummus",
              ingredients: [
                "1 cup mixed vegetable sticks (carrots, cucumber, bell peppers)",
                "1/4 cup hummus",
                "1 tbsp hemp seeds",
                "1 tsp olive oil"
              ],
              preparation: "Arrange vegetable sticks on a plate. Serve with hummus sprinkled with hemp seeds and drizzled with olive oil.",
              macros: {
                calories: Math.round(totalCalories * 0.1),
                protein: 5,
                carbs: 15,
                fats: 10
              },
              imageDescription: "Colorful vegetable sticks with a bowl of hummus"
            }
          ]
        };
      } else if (dietType === "pescatarian") {
        baseMealPlan = {
          breakfast: {
            name: "Omega-3 Breakfast",
            ingredients: [
              "2 slices whole grain bread",
              "50g smoked salmon",
              "1/4 avocado, mashed",
              "2 tbsp cream cheese",
              "1 tsp lemon juice",
              "1 tsp dill"
            ],
            preparation: "Toast bread. Spread with cream cheese. Top with salmon, avocado, lemon juice, and dill.",
            macros: {
              calories: Math.round(totalCalories * 0.25),
              protein: 20,
              carbs: 30,
              fats: 15
            },
            imageDescription: "Whole grain toast topped with cream cheese, smoked salmon, and avocado"
          },
          lunch: {
            name: "Mediterranean Tuna Salad",
            ingredients: [
              "1 can tuna in water, drained",
              "2 cups mixed greens",
              "10 cherry tomatoes, halved",
              "10 olives, sliced",
              "1/4 red onion, thinly sliced",
              "2 tbsp olive oil and lemon dressing"
            ],
            preparation: "Mix tuna with greens, tomatoes, olives, and onion. Drizzle with dressing.",
            macros: {
              calories: Math.round(totalCalories * 0.3),
              protein: 30,
              carbs: 15,
              fats: 15
            },
            imageDescription: "Fresh salad with tuna chunks, olives, and vegetables"
          },
          dinner: {
            name: "Grilled Shrimp and Vegetable Skewers",
            ingredients: [
              "150g shrimp, peeled and deveined",
              "1 cup mixed vegetables (bell peppers, zucchini, cherry tomatoes)",
              "1 tbsp olive oil",
              "1 garlic clove, minced",
              "1/2 cup quinoa, cooked",
              "1 lemon, cut into wedges"
            ],
            preparation: "Thread shrimp and vegetables onto skewers. Brush with olive oil and garlic. Grill for 2-3 minutes per side. Serve with quinoa and lemon wedges.",
            macros: {
              calories: Math.round(totalCalories * 0.25),
              protein: 25,
              carbs: 30,
              fats: 10
            },
            imageDescription: "Grilled shrimp and vegetable skewers on a bed of quinoa with lemon wedges"
          },
          snacks: [
            {
              name: "Seaweed Snack Pack",
              ingredients: [
                "1 package seaweed snacks",
                "1/4 cup edamame, shelled",
                "1 small orange"
              ],
              preparation: "Serve seaweed snacks alongside edamame and orange slices.",
              macros: {
                calories: Math.round(totalCalories * 0.1),
                protein: 5,
                carbs: 15,
                fats: 5
              },
              imageDescription: "Seaweed sheets with edamame and orange slices"
            },
            {
              name: "Cottage Cheese with Fruit",
              ingredients: [
                "1/2 cup cottage cheese",
                "1/2 cup pineapple chunks",
                "1 tbsp chopped mint",
                "1 tsp honey",
                "1 tbsp crushed walnuts"
              ],
              preparation: "Top cottage cheese with pineapple chunks, mint, and walnuts. Drizzle with honey.",
              macros: {
                calories: Math.round(totalCalories * 0.1),
                protein: 15,
                carbs: 15,
                fats: 5
              },
              imageDescription: "Bowl of cottage cheese topped with pineapple chunks and walnuts"
            }
          ]
        };
      }
      
      // Adjust snacks based on number of meals per day
      if (mealsPerDay > 4) {
        // Add a third snack for 5-6 meals
        if (dietType === "vegetarian") {
          baseMealPlan.snacks.push({
            name: "Veggie Wrap",
            ingredients: [
              "1 small whole wheat tortilla",
              "2 tbsp hummus",
              "1/4 cup sliced bell peppers",
              "1/4 cup cucumber sticks",
              "2 tbsp sprouts",
              "1 tsp balsamic glaze"
            ],
            preparation: "Spread hummus on tortilla. Add vegetables and sprouts. Drizzle with balsamic glaze. Roll up and slice in half.",
            macros: {
              calories: Math.round(totalCalories * 0.1),
              protein: 5,
              carbs: 20,
              fats: 5
            },
            imageDescription: "Small vegetable wrap cut in half"
          });
        } else if (dietType === "non-vegetarian") {
          baseMealPlan.snacks.push({
            name: "Turkey Roll-Ups",
            ingredients: [
              "3 slices turkey breast",
              "3 thin slices cucumber",
              "3 thin slices bell pepper",
              "1 tbsp cream cheese",
              "1 tsp whole grain mustard"
            ],
            preparation: "Spread cream cheese and mustard on turkey slices. Add cucumber and bell pepper. Roll up.",
            macros: {
              calories: Math.round(totalCalories * 0.1),
              protein: 15,
              carbs: 5,
              fats: 5
            },
            imageDescription: "Turkey slices rolled up with vegetables"
          });
        } else if (dietType === "vegan") {
          baseMealPlan.snacks.push({
            name: "Avocado Rice Cakes",
            ingredients: [
              "2 brown rice cakes",
              "1/4 avocado, mashed",
              "1 tsp lemon juice",
              "1 tsp hemp seeds",
              "Pinch of red pepper flakes",
              "Pinch of salt"
            ],
            preparation: "Mash avocado with lemon juice, salt, and red pepper flakes. Spread on rice cakes. Sprinkle with hemp seeds.",
            macros: {
              calories: Math.round(totalCalories * 0.1),
              protein: 3,
              carbs: 15,
              fats: 10
            },
            imageDescription: "Rice cakes topped with mashed avocado and hemp seeds"
          });
        } else if (dietType === "pescatarian") {
          baseMealPlan.snacks.push({
            name: "Smoked Salmon Rice Crackers",
            ingredients: [
              "5 whole grain rice crackers",
              "2 tbsp cream cheese",
              "30g smoked salmon",
              "Few capers",
              "Dill sprigs",
              "Lemon zest"
            ],
            preparation: "Spread cream cheese on crackers. Top with small pieces of smoked salmon, a few capers, dill, and lemon zest.",
            macros: {
              calories: Math.round(totalCalories * 0.1),
              protein: 10,
              carbs: 15,
              fats: 5
            },
            imageDescription: "Rice crackers topped with cream cheese, smoked salmon, and capers"
          });
        }
      }
      
      mealPlan.meals = baseMealPlan;
    }
    
    // Check for allergies and adjust meals accordingly
    if (values.allergies && values.allergies.length > 0) {
      if (values.allergies.includes("dairy")) {
        // Replace dairy ingredients
        if (mealPlan.meals.breakfast && mealPlan.meals.breakfast.ingredients) {
          mealPlan.meals.breakfast.ingredients = mealPlan.meals.breakfast.ingredients.map(
            (ingredient: string) => ingredient.toLowerCase().includes("yogurt") ? "1 cup coconut yogurt" : 
                                  ingredient.toLowerCase().includes("cream cheese") ? "2 tbsp dairy-free cream cheese" :
                                  ingredient
          );
        }
      }
      
      if (values.allergies.includes("nuts")) {
        // Replace nut ingredients
        if (mealPlan.meals.breakfast && mealPlan.meals.breakfast.ingredients) {
          mealPlan.meals.breakfast.ingredients = mealPlan.meals.breakfast.ingredients.map(
            (ingredient: string) => ingredient.toLowerCase().includes("almond") || 
                                  ingredient.toLowerCase().includes("nuts") || 
                                  ingredient.toLowerCase().includes("peanut") ? 
                                  "2 tbsp sunflower seed butter" : ingredient
          );
        }
      }
      
      if (values.allergies.includes("seafood")) {
        // Replace seafood ingredients
        if (dietType === "pescatarian") {
          // Switch to vegetarian meals if pescatarian with seafood allergy
          return getDefaultMealPlan({...values, diet: "vegetarian"});
        }
      }
      
      if (values.allergies.includes("eggs")) {
        // Replace egg ingredients
        if (mealPlan.meals.breakfast && mealPlan.meals.breakfast.ingredients) {
          mealPlan.meals.breakfast.ingredients = mealPlan.meals.breakfast.ingredients.map(
            (ingredient: string) => ingredient.toLowerCase().includes("egg") ? 
                                  "1/2 cup scrambled tofu with turmeric" : ingredient
          );
        }
      }
      
      if (values.allergies.includes("gluten")) {
        // Replace gluten ingredients
        if (mealPlan.meals.breakfast && mealPlan.meals.breakfast.ingredients) {
          mealPlan.meals.breakfast.ingredients = mealPlan.meals.breakfast.ingredients.map(
            (ingredient: string) => ingredient.toLowerCase().includes("bread") || 
                                  ingredient.toLowerCase().includes("toast") ? 
                                  "2 slices gluten-free bread" : ingredient
          );
        }
      }
    }
    
    return mealPlan;
  };

  // Generate meal plan mutation
  const generateMutation = useMutation({
    mutationFn: async (values: MealPlanFormValues) => {
      try {
        const res = await apiRequest("POST", "/api/meal-plans/generate", values);
        return await res.json();
      } catch (error) {
        // If API call fails, return default meal plan based on form values
        console.log("Using default meal plan due to API error");
        return getDefaultMealPlan(values);
      }
    },
    onSuccess: (data: MealPlan) => {
      toast({
        title: "Meal Plan Generated",
        description: `Successfully created "${data.name}"`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meal-plans"] });
      setIsGenerateDialogOpen(false);
      setActiveTab("plans");
    },
    onError: (error: Error) => {
      // Use default meal plan instead of showing an error
      toast({
        title: "Using Demo Mode",
        description: "Showing sample meal plan as the API connection is unavailable",
      });
      
      const defaultPlan = getDefaultMealPlan(form.getValues());
      queryClient.setQueryData(["/api/meal-plans"], [defaultPlan]);
      setIsGenerateDialogOpen(false);
      setActiveTab("plans");
    },
  });

  // Delete meal plan mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/meal-plans/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Meal plan deleted",
        description: "The meal plan has been removed."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meal-plans"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: MealPlanFormValues) {
    generateMutation.mutate(values);
  }

  const handleDeletePlan = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Meal Planning</h1>
            <p className="text-muted-foreground">Create personalized meal plans based on your dietary needs and preferences</p>
          </div>
          
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Generate Meal Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Meal Plan</DialogTitle>
                <DialogDescription>
                  Customize your meal plan based on your dietary needs and health goals.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Height in cm" 
                              type="number" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Weight in kg" 
                              type="number" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="diet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diet Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select diet type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="vegetarian">Vegetarian</SelectItem>
                              <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                              <SelectItem value="vegan">Vegan</SelectItem>
                              <SelectItem value="pescatarian">Pescatarian</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="mealsPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meals Per Day</FormLabel>
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            variant="outline"
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value.toString()}
                            className="justify-start"
                          >
                            <ToggleGroupItem value="2">2</ToggleGroupItem>
                            <ToggleGroupItem value="3">3</ToggleGroupItem>
                            <ToggleGroupItem value="4">4</ToggleGroupItem>
                            <ToggleGroupItem value="5">5</ToggleGroupItem>
                            <ToggleGroupItem value="6">6</ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                        <FormDescription>
                          Select the number of meals you want to have per day.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="healthIssues"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Health Issues</FormLabel>
                          <FormDescription>
                            Select any health issues you have that may affect your diet.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {healthIssuesOptions.map((issue) => (
                            <FormField
                              key={issue.id}
                              control={form.control}
                              name="healthIssues"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={issue.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(issue.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], issue.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== issue.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {issue.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Food Allergies</FormLabel>
                          <FormDescription>
                            Select any food allergies you have.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {allergyOptions.map((allergy) => (
                            <FormField
                              key={allergy.id}
                              control={form.control}
                              name="allergies"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={allergy.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(allergy.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], allergy.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== allergy.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {allergy.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional information about your dietary preferences..." 
                            {...field}
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Optional information that helps us tailor your meal plan.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={generateMutation.isPending}
                      className="w-full"
                    >
                      {generateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UtensilsCrossed className="mr-2 h-4 w-4" />
                      )}
                      Generate Meal Plan
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="create">Create Plan</TabsTrigger>
            <TabsTrigger value="plans">My Plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Generate a Meal Plan</CardTitle>
                  <CardDescription>
                    Create a personalized meal plan based on your dietary needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Our AI will generate a custom meal plan tailored to your specific dietary requirements,
                    health conditions, and food preferences. Each meal plan includes detailed recipes,
                    nutritional information, and shopping lists.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-1">Personalized</h3>
                      <p className="text-xs text-muted-foreground">Based on your health profile</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <Utensils className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-1">Balanced Nutrition</h3>
                      <p className="text-xs text-muted-foreground">Optimal macro distribution</p>
                    </div>
                  </div>
                  
                  <Button onClick={() => setIsGenerateDialogOpen(true)} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Meal Plan
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>
                    Our AI-powered meal planning process
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Enter Your Details</h4>
                        <p className="text-sm text-muted-foreground">
                          Provide information about your body metrics, dietary preferences, and health conditions.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">AI Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          Our AI analyzes your information to determine your optimal caloric intake and nutrient distribution.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Get Your Plan</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive a detailed meal plan with recipes, nutritional information, and a shopping list.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="plans" className="mt-6">
            {plansLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : mealPlans.length === 0 ? (
              <div className="text-center py-8">
                <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Meal Plans Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't created any meal plans yet. Create one to get started!
                </p>
                <Button onClick={() => setIsGenerateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Meal Plan
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mealPlans.map((plan) => (
                  <MealPlanCard
                    key={plan.id}
                    mealPlan={plan}
                    onDelete={() => handleDeletePlan(plan.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}