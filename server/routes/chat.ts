import { Router, Request, Response } from "express";
import OpenAI from "openai";

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

router.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are NutriScan Health Assistant, an AI specializing in nutrition, calorie estimation, meal planning, and fitness advice.
          
          Your primary functions are:
          1. Answering questions about food nutrition and calories
          2. Providing fitness and workout guidance
          3. Offering meal planning suggestions
          4. Explaining the benefits of different foods and exercises
          
          Keep your responses concise, friendly, and focused on health, fitness, and nutrition topics.
          If asked about topics outside your expertise, politely redirect the conversation to health-related subjects.
          
          Today's date is ${new Date().toLocaleDateString()}.
          `
        },
        { 
          role: "user", 
          content: message 
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return res.status(200).json({
      response: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Failed to process chat request" });
  }
});

export default router;