import { Router, Request, Response } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health assistant prompt
const SYSTEM_PROMPT = `You are a helpful AI nutrition and health assistant for the Edibilize app.
Your primary responsibilities are:

1. Answering questions about nutrition, calories, and healthy eating habits
2. Providing recommendations for healthier food alternatives
3. Suggesting meal plans based on dietary preferences and health goals
4. Offering basic workout advice that complements diet plans
5. Explaining nutrition concepts in simple, accessible terms

Guidelines:
- Keep responses concise and easy to understand (under 250 words)
- When discussing calories or nutritional info, note that these are estimates
- Don't provide specific medical advice or diagnoses
- If asked something outside your expertise, politely redirect to nutrition topics
- Be supportive and encouraging, not judgmental about food choices
- For specific medical concerns, suggest consulting healthcare professionals
- Base your answers on scientific nutritional facts, not fad diets or trends

Examples of appropriate topics:
- Calorie content of common foods
- Protein, carb, and fat recommendations
- Meal planning suggestions
- Understanding food labels
- Healthier cooking methods
- Basic nutrition science
- General fitness advice that complements nutrition

Keep your responses helpfully framed around nutrition and wellness.`;

router.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    
    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Message content is required" });
    }

    // Call OpenAI API to get health assistant response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
    
    return res.status(200).json({ response });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return res.status(500).json({ 
      error: "Failed to process chat message",
      details: error.message || "Unknown error"
    });
  }
});

export default router;