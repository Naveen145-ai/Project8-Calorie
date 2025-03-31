import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { analyzeImage, generateMealPlan, generateWorkoutPlan } from "./openai";
import { z } from "zod";
import { insertFoodEntrySchema, insertMealPlanSchema, insertWorkoutPlanSchema, insertWaitlistSchema } from "@shared/schema";
import multer from "multer";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import chatRouter from "./routes/chat";
import recommendationsRouter from "./routes/recommendations";

// Set up multer for file uploads
const upload = multer({ 
  dest: path.join(process.cwd(), "uploads"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Use routers
  app.use(chatRouter);
  app.use(recommendationsRouter);

  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send("Unauthorized");
  };

  // Waitlist entry route
  app.post("/api/waitlist", async (req, res, next) => {
    try {
      const parsedData = insertWaitlistSchema.parse(req.body);
      
      // Check if email already exists
      const existingEntry = await storage.getWaitlistEntryByEmail(parsedData.email);
      if (existingEntry) {
        return res.status(400).json({ message: "Email already registered on waitlist" });
      }
      
      const entry = await storage.createWaitlistEntry(parsedData);
      res.status(201).json({ 
        message: "Successfully joined waitlist",
        entry
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  // Food analysis routes
  app.post("/api/food/analyze", isAuthenticated, upload.single("image"), async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image provided" });
      }

      // Read the file as base64
      const imageBuffer = await fs.readFile(req.file.path);
      const base64Image = imageBuffer.toString("base64");
      
      // Generate a unique filename
      const filename = `${randomUUID()}-${req.file.originalname}`;
      const fileUrl = `/uploads/${filename}`;
      const savePath = path.join(process.cwd(), "uploads", filename);
      
      // Save the file to a permanent location
      await fs.rename(req.file.path, savePath);
      
      // Analyze the image using OpenAI
      const analysisResult = await analyzeImage(base64Image);
      
      // Create a food entry in the database
      const foodEntry = await storage.createFoodEntry({
        userId: req.user!.id,
        imageUrl: fileUrl,
        name: analysisResult.name,
        calories: analysisResult.calories,
        protein: analysisResult.protein,
        carbs: analysisResult.carbs,
        fats: analysisResult.fats,
        nutrients: analysisResult.nutrients
      });
      
      res.status(200).json({
        ...analysisResult,
        id: foodEntry.id,
        imageUrl: fileUrl
      });
    } catch (error) {
      // Clean up temporary file if it exists
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      next(error);
    }
  });

  app.get("/api/food/history", isAuthenticated, async (req, res, next) => {
    try {
      const foodEntries = await storage.getFoodEntriesByUserId(req.user!.id);
      res.status(200).json(foodEntries);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/food/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const foodEntry = await storage.getFoodEntry(id);
      if (!foodEntry) {
        return res.status(404).json({ message: "Food entry not found" });
      }
      
      if (foodEntry.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized access to this food entry" });
      }
      
      res.status(200).json(foodEntry);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/food/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const foodEntry = await storage.getFoodEntry(id);
      if (!foodEntry) {
        return res.status(404).json({ message: "Food entry not found" });
      }
      
      if (foodEntry.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized access to this food entry" });
      }
      
      await storage.deleteFoodEntry(id);
      res.status(200).json({ message: "Food entry deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Meal plan routes
  app.post("/api/meal-plans", isAuthenticated, async (req, res, next) => {
    try {
      const parsedData = insertMealPlanSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const mealPlan = await storage.createMealPlan(parsedData);
      res.status(201).json(mealPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.post("/api/meal-plans/generate", isAuthenticated, async (req, res, next) => {
    try {
      const { calories, preferences, restrictions } = req.body;
      
      if (!calories || isNaN(parseInt(calories))) {
        return res.status(400).json({ message: "Valid calorie target required" });
      }
      
      const mealPlanData = await generateMealPlan(parseInt(calories), preferences, restrictions);
      
      // Store the generated meal plan
      const mealPlan = await storage.createMealPlan({
        userId: req.user!.id,
        name: mealPlanData.name,
        description: mealPlanData.description,
        meals: mealPlanData.meals,
        calories: parseInt(calories)
      });
      
      res.status(201).json(mealPlan);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/meal-plans", isAuthenticated, async (req, res, next) => {
    try {
      const mealPlans = await storage.getMealPlansByUserId(req.user!.id);
      res.status(200).json(mealPlans);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/meal-plans/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const mealPlan = await storage.getMealPlan(id);
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      
      if (mealPlan.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized access to this meal plan" });
      }
      
      res.status(200).json(mealPlan);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/meal-plans/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const mealPlan = await storage.getMealPlan(id);
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      
      if (mealPlan.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized access to this meal plan" });
      }
      
      await storage.deleteMealPlan(id);
      res.status(200).json({ message: "Meal plan deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Workout plan routes
  app.post("/api/workout-plans", isAuthenticated, async (req, res, next) => {
    try {
      const parsedData = insertWorkoutPlanSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const workoutPlan = await storage.createWorkoutPlan(parsedData);
      res.status(201).json(workoutPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.post("/api/workout-plans/generate", isAuthenticated, async (req, res, next) => {
    try {
      const { fitnessLevel, goals, duration } = req.body;
      
      if (!fitnessLevel || !goals || !duration) {
        return res.status(400).json({ message: "Fitness level, goals, and duration are required" });
      }
      
      const workoutPlanData = await generateWorkoutPlan(fitnessLevel, goals, duration);
      
      // Store the generated workout plan
      const workoutPlan = await storage.createWorkoutPlan({
        userId: req.user!.id,
        name: workoutPlanData.name,
        description: workoutPlanData.description,
        exercises: workoutPlanData.exercises,
        caloriesBurned: workoutPlanData.caloriesBurned
      });
      
      res.status(201).json(workoutPlan);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/workout-plans", isAuthenticated, async (req, res, next) => {
    try {
      const workoutPlans = await storage.getWorkoutPlansByUserId(req.user!.id);
      res.status(200).json(workoutPlans);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/workout-plans/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const workoutPlan = await storage.getWorkoutPlan(id);
      if (!workoutPlan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      if (workoutPlan.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized access to this workout plan" });
      }
      
      res.status(200).json(workoutPlan);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/workout-plans/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const workoutPlan = await storage.getWorkoutPlan(id);
      if (!workoutPlan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      if (workoutPlan.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized access to this workout plan" });
      }
      
      await storage.deleteWorkoutPlan(id);
      res.status(200).json({ message: "Workout plan deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), "uploads");
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error("Failed to create uploads directory:", error);
  }

  // Serve static files from the uploads directory
  app.use("/uploads", (req, res, next) => {
    if (req.path.startsWith("/") && req.path.includes("..")) {
      return res.status(400).send("Invalid path");
    }
    next();
  }, express.static(uploadsDir));

  return httpServer;
}
