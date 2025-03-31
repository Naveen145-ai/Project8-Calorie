import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  profilePic: text("profile_pic"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  profilePic: true,
});

export const loginUserSchema = insertUserSchema.pick({
  username: true,
  password: true,
});

export const foodEntries = pgTable("food_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  imageUrl: text("image_url"),
  name: text("name").notNull(),
  calories: integer("calories"),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fats: integer("fats"),
  nutrients: jsonb("nutrients"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertFoodEntrySchema = createInsertSchema(foodEntries).omit({
  id: true,
  timestamp: true,
});

export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  meals: jsonb("meals").notNull(),
  calories: integer("calories"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMealPlanSchema = createInsertSchema(mealPlans).omit({
  id: true,
  createdAt: true,
});

export const workoutPlans = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  exercises: jsonb("exercises").notNull(),
  caloriesBurned: integer("calories_burned"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({
  id: true,
  createdAt: true,
});

export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  interests: jsonb("interests"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWaitlistSchema = createInsertSchema(waitlistEntries).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFoodEntry = z.infer<typeof insertFoodEntrySchema>;
export type FoodEntry = typeof foodEntries.$inferSelect;

export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type MealPlan = typeof mealPlans.$inferSelect;

export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;
export type WorkoutPlan = typeof workoutPlans.$inferSelect;

export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
