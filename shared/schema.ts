import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow()
});

export const waitlistUsers = pgTable("waitlist_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  interests: text("interests"),
  createdAt: timestamp("created_at").defaultNow()
});

export const foodEntries = pgTable("food_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  imageUrl: text("image_url"),
  foodName: text("food_name"),
  calories: integer("calories"),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fat: integer("fat"),
  nutritionData: json("nutrition_data"),
  createdAt: timestamp("created_at").defaultNow()
});

export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  meals: json("meals").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const workoutPlans = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  exercises: json("exercises").notNull(),
  estimatedCalories: integer("estimated_calories"),
  createdAt: timestamp("created_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

export const insertWaitlistUserSchema = createInsertSchema(waitlistUsers).pick({
  email: true,
  fullName: true,
  interests: true,
});

export const insertFoodEntrySchema = createInsertSchema(foodEntries).pick({
  userId: true,
  imageUrl: true,
  foodName: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  nutritionData: true,
});

export const insertMealPlanSchema = createInsertSchema(mealPlans).pick({
  userId: true,
  name: true,
  description: true,
  meals: true,
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).pick({
  userId: true,
  name: true,
  description: true,
  exercises: true,
  estimatedCalories: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWaitlistUser = z.infer<typeof insertWaitlistUserSchema>;
export type WaitlistUser = typeof waitlistUsers.$inferSelect;

export type InsertFoodEntry = z.infer<typeof insertFoodEntrySchema>;
export type FoodEntry = typeof foodEntries.$inferSelect;

export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type MealPlan = typeof mealPlans.$inferSelect;

export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;
export type WorkoutPlan = typeof workoutPlans.$inferSelect;
