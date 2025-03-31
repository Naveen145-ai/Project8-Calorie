import { users, foodEntries, mealPlans, workoutPlans, waitlistEntries } from "@shared/schema";
import type { User, InsertUser, FoodEntry, InsertFoodEntry, MealPlan, InsertMealPlan, WorkoutPlan, InsertWorkoutPlan, WaitlistEntry, InsertWaitlistEntry } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User related
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Food entries
  getFoodEntry(id: number): Promise<FoodEntry | undefined>;
  getFoodEntriesByUserId(userId: number): Promise<FoodEntry[]>;
  createFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry>;
  deleteFoodEntry(id: number): Promise<boolean>;

  // Meal plans
  getMealPlan(id: number): Promise<MealPlan | undefined>;
  getMealPlansByUserId(userId: number): Promise<MealPlan[]>;
  createMealPlan(plan: InsertMealPlan): Promise<MealPlan>;
  updateMealPlan(id: number, plan: Partial<MealPlan>): Promise<MealPlan | undefined>;
  deleteMealPlan(id: number): Promise<boolean>;

  // Workout plans
  getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined>;
  getWorkoutPlansByUserId(userId: number): Promise<WorkoutPlan[]>;
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  updateWorkoutPlan(id: number, plan: Partial<WorkoutPlan>): Promise<WorkoutPlan | undefined>;
  deleteWorkoutPlan(id: number): Promise<boolean>;

  // Waitlist entries
  getWaitlistEntry(id: number): Promise<WaitlistEntry | undefined>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private foodEntries: Map<number, FoodEntry>;
  private mealPlans: Map<number, MealPlan>;
  private workoutPlans: Map<number, WorkoutPlan>;
  private waitlistEntries: Map<number, WaitlistEntry>;
  currentId: { [key: string]: number };
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.foodEntries = new Map();
    this.mealPlans = new Map();
    this.workoutPlans = new Map();
    this.waitlistEntries = new Map();
    this.currentId = {
      users: 1,
      foodEntries: 1,
      mealPlans: 1,
      workoutPlans: 1,
      waitlistEntries: 1
    };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now, profilePic: null };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Food entry methods
  async getFoodEntry(id: number): Promise<FoodEntry | undefined> {
    return this.foodEntries.get(id);
  }

  async getFoodEntriesByUserId(userId: number): Promise<FoodEntry[]> {
    return Array.from(this.foodEntries.values()).filter(
      (entry) => entry.userId === userId,
    );
  }

  async createFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry> {
    const id = this.currentId.foodEntries++;
    const now = new Date();
    const foodEntry: FoodEntry = { ...entry, id, timestamp: now };
    this.foodEntries.set(id, foodEntry);
    return foodEntry;
  }

  async deleteFoodEntry(id: number): Promise<boolean> {
    return this.foodEntries.delete(id);
  }

  // Meal plan methods
  async getMealPlan(id: number): Promise<MealPlan | undefined> {
    return this.mealPlans.get(id);
  }

  async getMealPlansByUserId(userId: number): Promise<MealPlan[]> {
    return Array.from(this.mealPlans.values()).filter(
      (plan) => plan.userId === userId,
    );
  }

  async createMealPlan(plan: InsertMealPlan): Promise<MealPlan> {
    const id = this.currentId.mealPlans++;
    const now = new Date();
    const mealPlan: MealPlan = { ...plan, id, createdAt: now };
    this.mealPlans.set(id, mealPlan);
    return mealPlan;
  }

  async updateMealPlan(id: number, planData: Partial<MealPlan>): Promise<MealPlan | undefined> {
    const plan = await this.getMealPlan(id);
    if (!plan) return undefined;
    
    const updatedPlan = { ...plan, ...planData };
    this.mealPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteMealPlan(id: number): Promise<boolean> {
    return this.mealPlans.delete(id);
  }

  // Workout plan methods
  async getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined> {
    return this.workoutPlans.get(id);
  }

  async getWorkoutPlansByUserId(userId: number): Promise<WorkoutPlan[]> {
    return Array.from(this.workoutPlans.values()).filter(
      (plan) => plan.userId === userId,
    );
  }

  async createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const id = this.currentId.workoutPlans++;
    const now = new Date();
    const workoutPlan: WorkoutPlan = { ...plan, id, createdAt: now };
    this.workoutPlans.set(id, workoutPlan);
    return workoutPlan;
  }

  async updateWorkoutPlan(id: number, planData: Partial<WorkoutPlan>): Promise<WorkoutPlan | undefined> {
    const plan = await this.getWorkoutPlan(id);
    if (!plan) return undefined;
    
    const updatedPlan = { ...plan, ...planData };
    this.workoutPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteWorkoutPlan(id: number): Promise<boolean> {
    return this.workoutPlans.delete(id);
  }

  // Waitlist methods
  async getWaitlistEntry(id: number): Promise<WaitlistEntry | undefined> {
    return this.waitlistEntries.get(id);
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    return Array.from(this.waitlistEntries.values()).find(
      (entry) => entry.email === email,
    );
  }

  async createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.currentId.waitlistEntries++;
    const now = new Date();
    const waitlistEntry: WaitlistEntry = { ...entry, id, createdAt: now };
    this.waitlistEntries.set(id, waitlistEntry);
    return waitlistEntry;
  }
}

export const storage = new MemStorage();
