import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Food analysis interface
interface FoodAnalysisResult {
  name: string;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fats: number;    // in grams
  nutrients: {
    vitamins: Record<string, number>;
    minerals: Record<string, number>;
    fiber: number;
    sugar: number;
  };
  alternatives: {
    name: string;
    calories: number;
    benefits: string;
  }[];
}

// Meal plan interfaces
interface Meal {
  name: string;
  ingredients: string[];
  preparation: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  imageDescription: string;
}

interface MealPlan {
  name: string;
  description: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
  };
}

// Workout plan interfaces
interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: number;
  restTime: number; // in seconds
  targetMuscles: string[];
  emoji: string;
}

interface WorkoutPlan {
  name: string;
  description: string;
  exercises: {
    warmup: Exercise[];
    main: Exercise[];
    cooldown: Exercise[];
  };
  caloriesBurned: number;
}

// Analyze food image
export async function analyzeImage(base64Image: string): Promise<FoodAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert nutritionist specializing in food recognition and nutritional analysis. Analyze the food in the image and provide detailed nutritional information. Respond with a JSON object."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this food image and provide the following details in JSON format: \n1. Name of the food\n2. Calories\n3. Macronutrients (protein, carbs, fats in grams)\n4. Micronutrients (key vitamins and minerals)\n5. Three healthier alternatives with their calorie counts and benefits"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Transform the result to match our interface
    const formattedResult: FoodAnalysisResult = {
      name: result.name || "Unknown food",
      calories: typeof result.calories === 'number' ? result.calories : parseInt(result.calories) || 0,
      protein: typeof result.protein === 'number' ? result.protein : parseInt(result.protein) || 0,
      carbs: typeof result.carbs === 'number' ? result.carbs : parseInt(result.carbs) || 0,
      fats: typeof result.fats === 'number' ? result.fats : parseInt(result.fats) || 0,
      nutrients: {
        vitamins: result.micronutrients?.vitamins || {},
        minerals: result.micronutrients?.minerals || {},
        fiber: result.micronutrients?.fiber || 0,
        sugar: result.micronutrients?.sugar || 0
      },
      alternatives: result.alternatives || []
    };

    return formattedResult;
  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw new Error("Failed to analyze food image. Please try again.");
  }
}

// Generate meal plan
export async function generateMealPlan(
  calories: number,
  preferences: string[] = [],
  restrictions: string[] = []
): Promise<MealPlan> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist and meal planner. Create personalized meal plans based on calorie targets and dietary preferences."
        },
        {
          role: "user",
          content: `Generate a one-day meal plan with approximately ${calories} calories. 
                    Preferences: ${preferences.join(', ')}
                    Restrictions: ${restrictions.join(', ')}
                    Include breakfast, lunch, dinner, and 1-2 snacks. For each meal, provide the name, ingredients, preparation instructions, and macronutrient breakdown.
                    Respond in JSON format.`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Return the meal plan with the structure expected by our application
    return {
      name: result.name || `${calories} Calorie Meal Plan`,
      description: result.description || `A balanced meal plan with approximately ${calories} calories`,
      meals: result.meals
    };
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw new Error("Failed to generate meal plan. Please try again.");
  }
}

// Generate workout plan
export async function generateWorkoutPlan(
  fitnessLevel: string,
  goals: string[],
  duration: number
): Promise<WorkoutPlan> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional fitness trainer specializing in creating personalized workout plans."
        },
        {
          role: "user",
          content: `Create a workout plan for someone with a ${fitnessLevel} fitness level who wants to ${goals.join(' and ')}.
                    The workout should take approximately ${duration} minutes.
                    Include warmup exercises, main workout, and cooldown. For each exercise, provide name, description, sets, reps, rest time, target muscles, and an appropriate emoji.
                    Also estimate total calories burned.
                    Respond in JSON format.`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Return the workout plan with the structure expected by our application
    return {
      name: result.name || `${fitnessLevel} ${goals[0]} Workout`,
      description: result.description || `A ${duration}-minute workout designed for ${fitnessLevel} fitness level focusing on ${goals.join(' and ')}`,
      exercises: result.exercises,
      caloriesBurned: result.caloriesBurned || 0
    };
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw new Error("Failed to generate workout plan. Please try again.");
  }
}
