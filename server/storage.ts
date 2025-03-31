import { users, waitlistUsers, foodEntries, mealPlans, workoutPlans } from "@shared/schema";
import type { User, InsertUser, WaitlistUser, InsertWaitlistUser, FoodEntry, InsertFoodEntry, MealPlan, InsertMealPlan, WorkoutPlan, InsertWorkoutPlan } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Waitlist operations
  addToWaitlist(waitlistUser: InsertWaitlistUser): Promise<WaitlistUser>;
  getWaitlistUsers(): Promise<WaitlistUser[]>;
  
  // Food entry operations
  createFoodEntry(foodEntry: InsertFoodEntry): Promise<FoodEntry>;
  getFoodEntries(userId: number): Promise<FoodEntry[]>;
  getFoodEntry(id: number): Promise<FoodEntry | undefined>;
  
  // Meal plan operations
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  getMealPlans(userId: number): Promise<MealPlan[]>;
  getMealPlan(id: number): Promise<MealPlan | undefined>;
  
  // Workout plan operations
  createWorkoutPlan(workoutPlan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  getWorkoutPlans(userId: number): Promise<WorkoutPlan[]>;
  getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlistUsers: Map<number, WaitlistUser>;
  private foodEntries: Map<number, FoodEntry>;
  private mealPlans: Map<number, MealPlan>;
  private workoutPlans: Map<number, WorkoutPlan>;
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private waitlistIdCounter: number;
  private foodEntryIdCounter: number;
  private mealPlanIdCounter: number;
  private workoutPlanIdCounter: number;

  constructor() {
    this.users = new Map();
    this.waitlistUsers = new Map();
    this.foodEntries = new Map();
    this.mealPlans = new Map();
    this.workoutPlans = new Map();
    
    this.userIdCounter = 1;
    this.waitlistIdCounter = 1;
    this.foodEntryIdCounter = 1;
    this.mealPlanIdCounter = 1;
    this.workoutPlanIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24h
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Waitlist operations
  async addToWaitlist(insertWaitlistUser: InsertWaitlistUser): Promise<WaitlistUser> {
    const id = this.waitlistIdCounter++;
    const createdAt = new Date();
    const waitlistUser: WaitlistUser = { ...insertWaitlistUser, id, createdAt };
    this.waitlistUsers.set(id, waitlistUser);
    return waitlistUser;
  }
  
  async getWaitlistUsers(): Promise<WaitlistUser[]> {
    return Array.from(this.waitlistUsers.values());
  }
  
  // Food entry operations
  async createFoodEntry(insertFoodEntry: InsertFoodEntry): Promise<FoodEntry> {
    const id = this.foodEntryIdCounter++;
    const createdAt = new Date();
    const foodEntry: FoodEntry = { ...insertFoodEntry, id, createdAt };
    this.foodEntries.set(id, foodEntry);
    return foodEntry;
  }
  
  async getFoodEntries(userId: number): Promise<FoodEntry[]> {
    return Array.from(this.foodEntries.values()).filter(
      (entry) => entry.userId === userId
    );
  }
  
  async getFoodEntry(id: number): Promise<FoodEntry | undefined> {
    return this.foodEntries.get(id);
  }
  
  // Meal plan operations
  async createMealPlan(insertMealPlan: InsertMealPlan): Promise<MealPlan> {
    const id = this.mealPlanIdCounter++;
    const createdAt = new Date();
    const mealPlan: MealPlan = { ...insertMealPlan, id, createdAt };
    this.mealPlans.set(id, mealPlan);
    return mealPlan;
  }
  
  async getMealPlans(userId: number): Promise<MealPlan[]> {
    return Array.from(this.mealPlans.values()).filter(
      (plan) => plan.userId === userId
    );
  }
  
  async getMealPlan(id: number): Promise<MealPlan | undefined> {
    return this.mealPlans.get(id);
  }
  
  // Workout plan operations
  async createWorkoutPlan(insertWorkoutPlan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const id = this.workoutPlanIdCounter++;
    const createdAt = new Date();
    const workoutPlan: WorkoutPlan = { ...insertWorkoutPlan, id, createdAt };
    this.workoutPlans.set(id, workoutPlan);
    return workoutPlan;
  }
  
  async getWorkoutPlans(userId: number): Promise<WorkoutPlan[]> {
    return Array.from(this.workoutPlans.values()).filter(
      (plan) => plan.userId === userId
    );
  }
  
  async getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined> {
    return this.workoutPlans.get(id);
  }
}

export const storage = new MemStorage();
