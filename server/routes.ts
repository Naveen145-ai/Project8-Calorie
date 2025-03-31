import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertWaitlistUserSchema, 
  insertFoodEntrySchema, 
  insertMealPlanSchema,
  insertWorkoutPlanSchema
} from "@shared/schema";
import { analyzeFood, suggestAlternatives } from "./openai";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Configure multer for file uploads
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  });
  
  // Waitlist submission
  app.post("/api/waitlist", async (req, res) => {
    try {
      const waitlistData = insertWaitlistUserSchema.parse(req.body);
      const waitlistUser = await storage.addToWaitlist(waitlistData);
      res.status(201).json(waitlistUser);
    } catch (error) {
      res.status(400).json({ message: "Invalid waitlist data", error: String(error) });
    }
  });
  
  // Food image upload and analysis
  app.post("/api/food/analyze", upload.single("image"), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if (!req.file) return res.status(400).json({ message: "No image provided" });
    
    try {
      // Convert image to base64
      const base64Image = req.file.buffer.toString("base64");
      
      // Call OpenAI for food analysis
      const analysisResult = await analyzeFood(base64Image);
      
      // Store the food entry
      if (analysisResult.success) {
        const foodEntry = await storage.createFoodEntry({
          userId: req.user!.id,
          imageUrl: "", // We're using in-memory storage so not saving the actual file
          foodName: analysisResult.foodName || "Unknown food",
          calories: analysisResult.calories || 0,
          protein: analysisResult.protein || 0,
          carbs: analysisResult.carbs || 0,
          fat: analysisResult.fat || 0,
          nutritionData: analysisResult.nutritionData || {},
        });
        
        res.status(200).json({
          foodEntry,
          analysis: analysisResult
        });
      } else {
        res.status(422).json({ message: "Could not analyze food", error: analysisResult.error });
      }
    } catch (error) {
      res.status(500).json({ message: "Error analyzing food", error: String(error) });
    }
  });
  
  // Get food entry history
  app.get("/api/food/history", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const entries = await storage.getFoodEntries(req.user!.id);
      res.status(200).json(entries);
    } catch (error) {
      res.status(500).json({ message: "Error fetching food history", error: String(error) });
    }
  });
  
  // Get single food entry
  app.get("/api/food/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const entryId = parseInt(req.params.id);
      if (isNaN(entryId)) {
        return res.status(400).json({ message: "Invalid entry ID" });
      }
      
      const entry = await storage.getFoodEntry(entryId);
      if (!entry) {
        return res.status(404).json({ message: "Food entry not found" });
      }
      
      if (entry.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to view this entry" });
      }
      
      res.status(200).json(entry);
    } catch (error) {
      res.status(500).json({ message: "Error fetching food entry", error: String(error) });
    }
  });
  
  // Get food alternatives
  app.post("/api/food/alternatives", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const { foodName } = req.body;
      if (!foodName) {
        return res.status(400).json({ message: "Food name is required" });
      }
      
      const alternatives = await suggestAlternatives(foodName);
      res.status(200).json(alternatives);
    } catch (error) {
      res.status(500).json({ message: "Error finding alternatives", error: String(error) });
    }
  });
  
  // Meal plan routes
  app.post("/api/meal-plans", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const mealPlanData = insertMealPlanSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const mealPlan = await storage.createMealPlan(mealPlanData);
      res.status(201).json(mealPlan);
    } catch (error) {
      res.status(400).json({ message: "Invalid meal plan data", error: String(error) });
    }
  });
  
  app.get("/api/meal-plans", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const mealPlans = await storage.getMealPlans(req.user!.id);
      res.status(200).json(mealPlans);
    } catch (error) {
      res.status(500).json({ message: "Error fetching meal plans", error: String(error) });
    }
  });
  
  app.get("/api/meal-plans/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const planId = parseInt(req.params.id);
      if (isNaN(planId)) {
        return res.status(400).json({ message: "Invalid plan ID" });
      }
      
      const plan = await storage.getMealPlan(planId);
      if (!plan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      
      if (plan.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to view this plan" });
      }
      
      res.status(200).json(plan);
    } catch (error) {
      res.status(500).json({ message: "Error fetching meal plan", error: String(error) });
    }
  });
  
  // Workout plan routes
  app.post("/api/workout-plans", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const workoutPlanData = insertWorkoutPlanSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const workoutPlan = await storage.createWorkoutPlan(workoutPlanData);
      res.status(201).json(workoutPlan);
    } catch (error) {
      res.status(400).json({ message: "Invalid workout plan data", error: String(error) });
    }
  });
  
  app.get("/api/workout-plans", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const workoutPlans = await storage.getWorkoutPlans(req.user!.id);
      res.status(200).json(workoutPlans);
    } catch (error) {
      res.status(500).json({ message: "Error fetching workout plans", error: String(error) });
    }
  });
  
  app.get("/api/workout-plans/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const planId = parseInt(req.params.id);
      if (isNaN(planId)) {
        return res.status(400).json({ message: "Invalid plan ID" });
      }
      
      const plan = await storage.getWorkoutPlan(planId);
      if (!plan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      if (plan.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to view this plan" });
      }
      
      res.status(200).json(plan);
    } catch (error) {
      res.status(500).json({ message: "Error fetching workout plan", error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
