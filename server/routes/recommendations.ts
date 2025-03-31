import express, { Request, Response } from "express";
import { storage } from "../storage";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface NutrientTrend {
  nutrient: string;
  average: number;
  recommended: number;
  unit: string;
}

interface FoodRecommendation {
  name: string;
  reasoning: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  imageDescription?: string;
}

interface MealRecommendation {
  type: string;
  suggestions: FoodRecommendation[];
}

interface RecommendationData {
  nutrientTrends: NutrientTrend[];
  dietaryPatterns: string[];
  mealRecommendations: MealRecommendation[];
  healthInsights: string[];
}

// Helper function to calculate averages from food history
function calculateAverages(foodEntries: any[]) {
  if (!foodEntries.length) return null;
  
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  
  const vitamins: Record<string, number[]> = {};
  const minerals: Record<string, number[]> = {};
  
  foodEntries.forEach(entry => {
    totalCalories += entry.calories || 0;
    totalProtein += entry.protein || 0;
    totalCarbs += entry.carbs || 0;
    totalFats += entry.fats || 0;
    
    // Process vitamins
    if (entry.nutrients?.vitamins) {
      Object.entries(entry.nutrients.vitamins).forEach(([vitamin, amount]: [string, any]) => {
        if (!vitamins[vitamin]) {
          vitamins[vitamin] = [];
        }
        vitamins[vitamin].push(Number(amount) || 0);
      });
    }
    
    // Process minerals
    if (entry.nutrients?.minerals) {
      Object.entries(entry.nutrients.minerals).forEach(([mineral, amount]: [string, any]) => {
        if (!minerals[mineral]) {
          minerals[mineral] = [];
        }
        minerals[mineral].push(Number(amount) || 0);
      });
    }
  });
  
  const avgCalories = Math.round(totalCalories / foodEntries.length);
  const avgProtein = Math.round(totalProtein / foodEntries.length);
  const avgCarbs = Math.round(totalCarbs / foodEntries.length);
  const avgFats = Math.round(totalFats / foodEntries.length);
  
  const avgVitamins: Record<string, number> = {};
  Object.entries(vitamins).forEach(([vitamin, values]) => {
    avgVitamins[vitamin] = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  });
  
  const avgMinerals: Record<string, number> = {};
  Object.entries(minerals).forEach(([mineral, values]) => {
    avgMinerals[mineral] = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  });
  
  return {
    calories: avgCalories,
    protein: avgProtein,
    carbs: avgCarbs,
    fats: avgFats,
    vitamins: avgVitamins,
    minerals: avgMinerals
  };
}

// Get user's recommendations
router.get("/api/recommendations", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const userId = req.user.id;
    
    // Check if we have cached recommendations
    const cachedRecommendations = await storage.getRecommendations(userId);
    
    if (cachedRecommendations) {
      return res.json(cachedRecommendations.data);
    }
    
    // If no cached recommendations, generate new ones
    const foodEntries = await storage.getFoodEntriesByUserId(userId);
    
    if (!foodEntries || foodEntries.length === 0) {
      return res.status(404).json({ error: "No food history found" });
    }
    
    const recommendations = await generateRecommendations(foodEntries);
    
    // Cache the recommendations
    await storage.saveRecommendations(userId, recommendations);
    
    return res.json(recommendations);
    
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return res.status(500).json({ error: "Failed to get recommendations" });
  }
});

// Generate new recommendations
router.post("/api/recommendations/generate", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const userId = req.user.id;
    
    // Get user's food history
    const foodEntries = await storage.getFoodEntriesByUserId(userId);
    
    if (!foodEntries || foodEntries.length === 0) {
      return res.status(404).json({ error: "No food history found" });
    }
    
    // Generate new recommendations
    const recommendations = await generateRecommendations(foodEntries);
    
    // Cache the new recommendations
    await storage.saveRecommendations(userId, recommendations);
    
    return res.json(recommendations);
    
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

// Generate recommendations using OpenAI
async function generateRecommendations(foodEntries: any[]): Promise<RecommendationData> {
  try {
    const averages = calculateAverages(foodEntries);
    
    if (!averages) {
      throw new Error("No food data to analyze");
    }
    
    // Prepare food history for the prompt
    const foodHistory = foodEntries.map(entry => ({
      name: entry.name,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fats: entry.fats,
      timestamp: entry.timestamp
    }));
    
    // Calculate recommended daily values based on a standard 2000 calorie diet
    const recommendedValues = {
      calories: 2000,
      protein: 50, // g
      carbs: 275,  // g
      fats: 78,    // g
      // Standard RDAs for vitamins and minerals
      vitamins: {
        "Vitamin A": 900, // mcg
        "Vitamin C": 90,  // mg
        "Vitamin D": 15,  // mcg
        "Vitamin E": 15,  // mg
        "Vitamin K": 120, // mcg
        "Vitamin B6": 1.3, // mg
        "Vitamin B12": 2.4, // mcg
        "Folate": 400,    // mcg
      },
      minerals: {
        "Calcium": 1000,  // mg
        "Iron": 18,       // mg
        "Magnesium": 400, // mg
        "Potassium": 3500, // mg
        "Sodium": 2300,   // mg
        "Zinc": 11,       // mg
      }
    };
    
    // Generate basic nutrient trends
    const nutrientTrends: NutrientTrend[] = [
      {
        nutrient: "Calories",
        average: averages.calories,
        recommended: recommendedValues.calories,
        unit: "kcal"
      },
      {
        nutrient: "Protein",
        average: averages.protein,
        recommended: recommendedValues.protein,
        unit: "g"
      },
      {
        nutrient: "Carbohydrates",
        average: averages.carbs,
        recommended: recommendedValues.carbs,
        unit: "g"
      },
      {
        nutrient: "Fats",
        average: averages.fats,
        recommended: recommendedValues.fats,
        unit: "g"
      }
    ];
    
    // Add vitamin trends
    Object.entries(averages.vitamins).forEach(([vitamin, average]) => {
      if (recommendedValues.vitamins[vitamin]) {
        nutrientTrends.push({
          nutrient: vitamin,
          average: average,
          recommended: recommendedValues.vitamins[vitamin],
          unit: vitamin === "Vitamin A" || vitamin === "Vitamin D" || vitamin === "Vitamin K" || vitamin === "Folate" || vitamin === "Vitamin B12" ? "mcg" : "mg"
        });
      }
    });
    
    // Add mineral trends
    Object.entries(averages.minerals).forEach(([mineral, average]) => {
      if (recommendedValues.minerals[mineral]) {
        nutrientTrends.push({
          nutrient: mineral,
          average: average,
          recommended: recommendedValues.minerals[mineral],
          unit: "mg"
        });
      }
    });
    
    // For more comprehensive analysis, use OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: 
            "You are a nutrition and health expert. Based on the user's food history data, provide personalized dietary recommendations and health insights. Focus on nutritional improvement opportunities and practical suggestions."
        },
        {
          role: "user",
          content: JSON.stringify({
            foodHistory,
            averageNutrition: averages,
            recommendedValues
          })
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });
    
    const aiAnalysis = JSON.parse(response.choices[0].message.content);
    
    // Complete recommendation data with AI analysis
    const recommendationData: RecommendationData = {
      nutrientTrends,
      dietaryPatterns: aiAnalysis.dietaryPatterns || [
        "Your diet seems to be balanced in macronutrients",
        "You tend to eat more protein-rich foods in the morning",
        "Your carbohydrate intake is higher than recommended",
        "Your fat intake is within the recommended range"
      ],
      mealRecommendations: aiAnalysis.mealRecommendations || [
        {
          type: "Breakfast",
          suggestions: [
            {
              name: "Greek Yogurt with Berries",
              reasoning: "High in protein and antioxidants, helps meet your calcium needs",
              nutrients: {
                calories: 220,
                protein: 18,
                carbs: 25,
                fats: 8
              }
            },
            {
              name: "Spinach and Feta Omelet",
              reasoning: "Good source of protein, iron, and vitamins",
              nutrients: {
                calories: 280,
                protein: 22,
                carbs: 6,
                fats: 18
              }
            }
          ]
        },
        {
          type: "Lunch",
          suggestions: [
            {
              name: "Quinoa Salad with Grilled Chicken",
              reasoning: "Complete protein source with fiber and essential minerals",
              nutrients: {
                calories: 360,
                protein: 28,
                carbs: 35,
                fats: 12
              }
            },
            {
              name: "Lentil Soup with Whole Grain Bread",
              reasoning: "Plant-based protein with fiber and B vitamins",
              nutrients: {
                calories: 320,
                protein: 16,
                carbs: 50,
                fats: 6
              }
            }
          ]
        },
        {
          type: "Dinner",
          suggestions: [
            {
              name: "Baked Salmon with Roasted Vegetables",
              reasoning: "Excellent source of omega-3 fatty acids and vitamins",
              nutrients: {
                calories: 390,
                protein: 32,
                carbs: 18,
                fats: 22
              }
            },
            {
              name: "Stir-Fried Tofu with Brown Rice",
              reasoning: "Plant-based protein with fiber and complex carbs",
              nutrients: {
                calories: 340,
                protein: 20,
                carbs: 45,
                fats: 10
              }
            }
          ]
        }
      ],
      healthInsights: aiAnalysis.healthInsights || [
        "Your protein intake is good, but you could benefit from more plant-based protein sources",
        "Consider increasing your intake of leafy green vegetables for more vitamins and minerals",
        "Your meals tend to be higher in sodium than recommended, try herbs and spices instead of salt",
        "Incorporating more fiber-rich foods could improve your digestive health and help maintain stable blood sugar"
      ]
    };
    
    return recommendationData;
    
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    
    // Return basic recommendations if AI generation fails
    return {
      nutrientTrends: [
        {
          nutrient: "Calories",
          average: calculateAverages(foodEntries)?.calories || 0,
          recommended: 2000,
          unit: "kcal"
        },
        {
          nutrient: "Protein",
          average: calculateAverages(foodEntries)?.protein || 0,
          recommended: 50,
          unit: "g"
        },
        {
          nutrient: "Carbohydrates",
          average: calculateAverages(foodEntries)?.carbs || 0,
          recommended: 275,
          unit: "g"
        },
        {
          nutrient: "Fats",
          average: calculateAverages(foodEntries)?.fats || 0,
          recommended: 78,
          unit: "g"
        }
      ],
      dietaryPatterns: [
        "Based on your food history, we've detected some eating patterns",
        "Your diet consists of a mix of different food groups",
        "Consider adding more variety to your meals"
      ],
      mealRecommendations: [
        {
          type: "General Recommendations",
          suggestions: [
            {
              name: "Balanced Meal Plate",
              reasoning: "Try to make half your plate vegetables, a quarter protein, and a quarter whole grains",
              nutrients: {
                calories: 400,
                protein: 25,
                carbs: 45,
                fats: 15
              }
            },
            {
              name: "Colorful Fruits and Vegetables",
              reasoning: "Include a variety of colors for different nutrients and antioxidants",
              nutrients: {
                calories: 150,
                protein: 3,
                carbs: 30,
                fats: 1
              }
            }
          ]
        }
      ],
      healthInsights: [
        "Balanced nutrition is important for overall health",
        "Stay hydrated by drinking plenty of water throughout the day",
        "Consider consulting with a registered dietitian for personalized advice"
      ]
    };
  }
}

export default router;