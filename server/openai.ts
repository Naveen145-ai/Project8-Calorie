import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-replace-with-actual-key"
});

interface NutrientInfo {
  amount: number;
  unit: string;
  dailyValuePercent?: number;
}

interface NutritionData {
  calories: number;
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

interface FoodAnalysisResult {
  success: boolean;
  foodName?: string;
  description?: string;
  ingredients?: string[];
  calories?: number;
  protein?: number;  // in grams
  carbs?: number;    // in grams
  fat?: number;      // in grams
  nutritionData?: NutritionData;
  error?: string;
}

interface FoodAlternative {
  name: string;
  description: string;
  nutritionalBenefits: string[];
  estimatedCalories: number;
}

export async function analyzeFood(base64Image: string): Promise<FoodAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a nutrition expert who can analyze food images and provide detailed nutritional information. Respond with JSON in this format: { 'success': boolean, 'foodName': string, 'description': string, 'ingredients': string[], 'calories': number, 'protein': number, 'carbs': number, 'fat': number, 'nutritionData': object with detailed nutrition }"
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this food image and provide detailed nutritional information. Estimate calories, macronutrients (proteins, carbs, fats), and key micronutrients."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      ...result
    };
  } catch (error) {
    console.error("Error analyzing food image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function suggestAlternatives(foodName: string): Promise<{ alternatives: FoodAlternative[] }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a nutrition expert who can suggest healthier alternatives for foods. Provide 3-5 alternatives with nutritional benefits. Each alternative should include name, description, nutritional benefits, and estimated calories."
        },
        {
          role: "user",
          content: `Suggest healthier alternatives for: ${foodName}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Error suggesting alternatives:", error);
    throw new Error(`Failed to suggest alternatives: ${error instanceof Error ? error.message : String(error)}`);
  }
}
