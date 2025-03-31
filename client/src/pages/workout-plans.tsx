import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { WorkoutPlan } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, Dumbbell, FlameIcon, TimerIcon, ListChecks } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Form schema
const workoutFormSchema = z.object({
  height: z.coerce.number().min(50, "Height must be at least 50cm").max(300, "Height must be less than 300cm"),
  weight: z.coerce.number().min(20, "Weight must be at least 20kg").max(300, "Weight must be less than 300kg"),
  gender: z.enum(["male", "female", "other"]),
  age: z.coerce.number().min(12, "Age must be at least 12").max(120, "Age must be less than 120"),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
  workoutDuration: z.coerce.number().min(15, "Minimum workout is 15 minutes").max(120, "Maximum workout is 120 minutes"),
  workoutLocation: z.enum(["home", "gym"]),
  workoutGoal: z.enum(["weight-loss", "muscle-gain", "endurance", "flexibility", "general"]),
  healthIssues: z.array(z.string()).optional(),
  preferredDays: z.coerce.number().min(1, "Minimum 1 day per week").max(7, "Maximum 7 days per week"),
  notes: z.string().optional(),
});

type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

// Health issues options
const healthIssuesOptions = [
  { id: "back-pain", label: "Back Pain" },
  { id: "knee-pain", label: "Knee Pain" },
  { id: "shoulder-pain", label: "Shoulder Pain" },
  { id: "heart-condition", label: "Heart Condition" },
  { id: "pregnancy", label: "Pregnancy" },
  { id: "hypertension", label: "Hypertension" },
  { id: "joint-problems", label: "Joint Problems" },
  { id: "mobility-issues", label: "Mobility Issues" },
];

// Default workout plans
const defaultWorkouts = {
  "weight-loss": {
    beginner: {
      name: "Beginner Weight Loss Plan",
      description: "A gentle introduction to cardio and strength training for weight loss.",
      exercises: {
        warmup: [
          {
            name: "Light Jogging in Place",
            description: "Lightly jog in place raising knees to waist height.",
            sets: 1,
            reps: 60,
            restTime: 0,
            targetMuscles: ["legs", "cardiovascular"],
            emoji: "🏃"
          },
          {
            name: "Arm Circles",
            description: "Extend arms to sides and make small circles, then increase to larger circles.",
            sets: 1,
            reps: 20,
            restTime: 0,
            targetMuscles: ["shoulders", "upper back"],
            emoji: "🔄"
          }
        ],
        main: [
          {
            name: "Body Weight Squats",
            description: "Stand with feet shoulder-width apart, lower body by bending knees and hips as if sitting in a chair, then return to standing.",
            sets: 3,
            reps: 12,
            restTime: 45,
            targetMuscles: ["quadriceps", "glutes", "hamstrings"],
            emoji: "🏋️"
          },
          {
            name: "Push-Ups (Modified if needed)",
            description: "Start in plank position. Lower chest to ground by bending elbows, then push back up. Can be done on knees for beginners.",
            sets: 3,
            reps: 8,
            restTime: 45,
            targetMuscles: ["chest", "shoulders", "triceps"],
            emoji: "💪"
          },
          {
            name: "Walking Lunges",
            description: "Step forward with one leg, lowering body until both knees are bent at 90 degrees. Push off front foot to bring back leg forward into next lunge.",
            sets: 2,
            reps: 10,
            restTime: 45,
            targetMuscles: ["quadriceps", "glutes", "hamstrings"],
            emoji: "🚶"
          },
          {
            name: "Plank",
            description: "Hold body in straight line from head to heels, supported by forearms and toes.",
            sets: 3,
            reps: 20,
            restTime: 45,
            targetMuscles: ["core", "shoulders", "back"],
            emoji: "🧘"
          },
          {
            name: "High Knees Marching",
            description: "March in place bringing knees up to waist height, increasing speed gradually.",
            sets: 3,
            reps: 30,
            restTime: 30,
            targetMuscles: ["core", "hip flexors", "cardiovascular"],
            emoji: "🏃"
          }
        ],
        cooldown: [
          {
            name: "Standing Forward Bend",
            description: "Stand with feet hip-width apart, slowly fold forward letting arms hang down. Hold for the duration.",
            sets: 1,
            reps: 30,
            restTime: 0,
            targetMuscles: ["hamstrings", "lower back"],
            emoji: "🙇"
          },
          {
            name: "Shoulder Stretch",
            description: "Bring one arm across chest, use opposite arm to gently pull elbow toward chest. Hold, then switch sides.",
            sets: 1,
            reps: 30,
            restTime: 0,
            targetMuscles: ["shoulders", "upper back"],
            emoji: "🤸"
          }
        ]
      },
      caloriesBurned: 250
    },
    intermediate: {
      name: "Intermediate Weight Loss Plan",
      description: "A balanced program combining HIIT and strength training for effective fat burning.",
      exercises: {
        warmup: [
          {
            name: "Jumping Jacks",
            description: "Stand with feet together, arms at sides, then jump while spreading legs and raising arms overhead.",
            sets: 1,
            reps: 40,
            restTime: 0,
            targetMuscles: ["full body", "cardiovascular"],
            emoji: "🏃"
          },
          {
            name: "Arm Swings",
            description: "Swing arms forward and backward in controlled movements.",
            sets: 1,
            reps: 30,
            restTime: 0,
            targetMuscles: ["shoulders", "arms"],
            emoji: "🔄"
          }
        ],
        main: [
          {
            name: "Burpees",
            description: "Begin in standing position, drop to squat position placing hands on ground, kick feet back to plank position, return to squat, then jump up from squat position.",
            sets: 3,
            reps: 12,
            restTime: 45,
            targetMuscles: ["full body", "cardiovascular"],
            emoji: "💥"
          },
          {
            name: "Mountain Climbers",
            description: "Start in plank position, rapidly alternate bringing knees toward chest.",
            sets: 3,
            reps: 20,
            restTime: 30,
            targetMuscles: ["core", "shoulders", "cardiovascular"],
            emoji: "🏔️"
          },
          {
            name: "Kettlebell Swings",
            description: "Hold kettlebell with both hands, hinge at hips and swing kettlebell between legs, then thrust hips forward swinging kettlebell to shoulder height.",
            sets: 3,
            reps: 15,
            restTime: 45,
            targetMuscles: ["glutes", "hamstrings", "core", "shoulders"],
            emoji: "🏋️"
          },
          {
            name: "Jump Squats",
            description: "Perform a squat, then explode upward into a jump, landing softly back into squat position.",
            sets: 3,
            reps: 15,
            restTime: 45,
            targetMuscles: ["quadriceps", "glutes", "calves"],
            emoji: "🦵"
          },
          {
            name: "Russian Twists",
            description: "Sit on floor with knees bent, feet lifted slightly. Lean back slightly and twist torso side to side.",
            sets: 3,
            reps: 20,
            restTime: 30,
            targetMuscles: ["obliques", "core"],
            emoji: "🔄"
          }
        ],
        cooldown: [
          {
            name: "Child's Pose",
            description: "Kneel on floor, sink hips back to heels, extend arms forward, and rest forehead on floor.",
            sets: 1,
            reps: 40,
            restTime: 0,
            targetMuscles: ["back", "shoulders"],
            emoji: "🧘"
          },
          {
            name: "Quad Stretch",
            description: "Stand on one leg, grab ankle of other leg behind you, gently pull toward buttocks. Hold, then switch legs.",
            sets: 1,
            reps: 30,
            restTime: 0,
            targetMuscles: ["quadriceps"],
            emoji: "🦵"
          }
        ]
      },
      caloriesBurned: 400
    },
    advanced: {
      name: "Advanced Weight Loss Plan",
      description: "High-intensity circuit training designed for maximum calorie burn and fat loss.",
      exercises: {
        warmup: [
          {
            name: "High Knees",
            description: "Run in place bringing knees up to hip height with each step.",
            sets: 1,
            reps: 60,
            restTime: 0,
            targetMuscles: ["cardiovascular", "core", "hip flexors"],
            emoji: "🏃"
          },
          {
            name: "Jumping Jacks",
            description: "Stand with feet together, arms at sides, then jump while spreading legs and raising arms overhead.",
            sets: 1,
            reps: 40,
            restTime: 0,
            targetMuscles: ["full body", "cardiovascular"],
            emoji: "🦘"
          }
        ],
        main: [
          {
            name: "Tuck Jumps",
            description: "Jump explosively, bringing knees toward chest at top of jump.",
            sets: 4,
            reps: 15,
            restTime: 30,
            targetMuscles: ["legs", "core", "cardiovascular"],
            emoji: "⬆️"
          },
          {
            name: "Box Jumps",
            description: "Stand in front of box or platform, jump onto box with both feet, stand fully, step down, and repeat.",
            sets: 4,
            reps: 12,
            restTime: 45,
            targetMuscles: ["quadriceps", "glutes", "calves"],
            emoji: "📦"
          },
          {
            name: "Burpee Pull-Ups",
            description: "Perform burpee, then at top of movement do a pull-up before beginning next rep.",
            sets: 4,
            reps: 8,
            restTime: 60,
            targetMuscles: ["full body", "back", "biceps"],
            emoji: "💪"
          },
          {
            name: "Kettlebell Clean and Press",
            description: "Swing kettlebell from between legs, pull to shoulder in 'clean' movement, then press overhead. Return to start and repeat.",
            sets: 3,
            reps: 12,
            restTime: 45,
            targetMuscles: ["shoulders", "legs", "core", "upper body"],
            emoji: "🏋️"
          },
          {
            name: "Plank to Push-up",
            description: "Start in plank position on forearms, then push up one arm at a time to push-up position, then lower back down to forearms.",
            sets: 3,
            reps: 10,
            restTime: 30,
            targetMuscles: ["shoulders", "chest", "triceps", "core"],
            emoji: "🧗"
          }
        ],
        cooldown: [
          {
            name: "Downward Dog",
            description: "Start on hands and knees, lift hips up and back forming an inverted V with body. Push heels toward floor and hold.",
            sets: 1,
            reps: 40,
            restTime: 0,
            targetMuscles: ["shoulders", "hamstrings", "calves"],
            emoji: "🐕"
          },
          {
            name: "Pigeon Pose",
            description: "From downward dog, bring right knee forward behind right wrist, extend left leg back. Hold, then switch sides.",
            sets: 1,
            reps: 30,
            restTime: 0,
            targetMuscles: ["hips", "glutes"],
            emoji: "🧘"
          }
        ]
      },
      caloriesBurned: 600
    }
  },
  "muscle-gain": {
    beginner: {
      name: "Beginner Muscle Building Plan",
      description: "An introduction to resistance training focusing on proper form and building a foundation.",
      exercises: {
        warmup: [
          {
            name: "Light Cardio",
            description: "5 minutes of light jogging or cycling to increase heart rate.",
            sets: 1,
            reps: 300,
            restTime: 0,
            targetMuscles: ["cardiovascular"],
            emoji: "🚶"
          },
          {
            name: "Arm and Shoulder Circles",
            description: "Rotate arms in small circles, then larger circles, forward and backward.",
            sets: 1,
            reps: 20,
            restTime: 0,
            targetMuscles: ["shoulders", "arms"],
            emoji: "🔄"
          }
        ],
        main: [
          {
            name: "Dumbbell Bench Press",
            description: "Lie on bench, hold dumbbells at chest level, press upward until arms are extended, then lower back down.",
            sets: 3,
            reps: 10,
            restTime: 90,
            targetMuscles: ["chest", "triceps", "shoulders"],
            emoji: "🏋️"
          },
          {
            name: "Dumbbell Rows",
            description: "Bend at waist with one knee and hand on bench, pull dumbbell from hanging position up to side of ribs, then lower.",
            sets: 3,
            reps: 10,
            restTime: 90,
            targetMuscles: ["back", "biceps"],
            emoji: "🏋️"
          },
          {
            name: "Goblet Squats",
            description: "Hold dumbbell or kettlebell close to chest, perform squat keeping back straight and chest up.",
            sets: 3,
            reps: 12,
            restTime: 90,
            targetMuscles: ["quadriceps", "glutes", "hamstrings"],
            emoji: "🏋️"
          },
          {
            name: "Dumbbell Shoulder Press",
            description: "Sit or stand holding dumbbells at shoulder height, press upward until arms extend, then lower.",
            sets: 3,
            reps: 10,
            restTime: 90,
            targetMuscles: ["shoulders", "triceps"],
            emoji: "💪"
          },
          {
            name: "Dumbbell Bicep Curls",
            description: "Stand holding dumbbells at sides, curl dumbbells by bending at elbow bringing weight toward shoulders.",
            sets: 3,
            reps: 12,
            restTime: 60,
            targetMuscles: ["biceps"],
            emoji: "💪"
          }
        ],
        cooldown: [
          {
            name: "Chest Stretch",
            description: "Stand in doorway with arms on doorframe at shoulder height, lean forward slightly to stretch chest.",
            sets: 1,
            reps: 30,
            restTime: 0,
            targetMuscles: ["chest", "shoulders"],
            emoji: "🧘"
          },
          {
            name: "Lat Stretch",
            description: "Stand or sit, raise one arm overhead and bend to opposite side. Hold, then switch sides.",
            sets: 1,
            reps: 30,
            restTime: 0,
            targetMuscles: ["lats", "side body"],
            emoji: "🤸"
          }
        ]
      },
      caloriesBurned: 300
    },
    intermediate: {
      name: "Intermediate Muscle Building Plan",
      description: "A hypertrophy-focused program with progressive overload to stimulate muscle growth.",
      exercises: {
        warmup: [
          {
            name: "Dynamic Stretching",
            description: "Perform dynamic movements like leg swings, arm swings, and torso twists.",
            sets: 1,
            reps: 40,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🤸"
          },
          {
            name: "Light Resistance Warm-up",
            description: "Perform very light weight versions of your first exercise to practice form.",
            sets: 1,
            reps: 15,
            restTime: 0,
            targetMuscles: ["specific to workout"],
            emoji: "🏋️"
          }
        ],
        main: [
          {
            name: "Barbell Bench Press",
            description: "Lie on bench, grip barbell slightly wider than shoulder width, lower to chest, then press back up to starting position.",
            sets: 4,
            reps: 8,
            restTime: 120,
            targetMuscles: ["chest", "triceps", "shoulders"],
            emoji: "🏋️"
          },
          {
            name: "Bent-Over Barbell Rows",
            description: "Bend at waist holding barbell with overhand grip, pull barbell to lower chest/upper abdomen, then lower back down.",
            sets: 4,
            reps: 8,
            restTime: 120,
            targetMuscles: ["back", "biceps", "rear delts"],
            emoji: "🏋️"
          },
          {
            name: "Barbell Squats",
            description: "With barbell across upper back, feet shoulder-width apart, bend knees and hips to lower body, then return to standing.",
            sets: 4,
            reps: 8,
            restTime: 120,
            targetMuscles: ["quadriceps", "glutes", "hamstrings", "core"],
            emoji: "🏋️"
          },
          {
            name: "Overhead Press",
            description: "Standing with barbell at shoulder height, press upward until arms are fully extended overhead, then lower back to shoulders.",
            sets: 4,
            reps: 8,
            restTime: 120,
            targetMuscles: ["shoulders", "triceps", "upper back"],
            emoji: "🏋️"
          },
          {
            name: "Romanian Deadlifts",
            description: "Stand holding barbell, hinge at hips keeping back straight, lower barbell along legs until slight stretch in hamstrings, then return to standing.",
            sets: 3,
            reps: 10,
            restTime: 120,
            targetMuscles: ["hamstrings", "glutes", "lower back"],
            emoji: "🏋️"
          }
        ],
        cooldown: [
          {
            name: "Static Stretching",
            description: "Hold stretches for major muscle groups worked during the session.",
            sets: 1,
            reps: 30,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🧘"
          },
          {
            name: "Foam Rolling",
            description: "Use foam roller on any tight muscles, rolling slowly over each area for 30-60 seconds.",
            sets: 1,
            reps: 60,
            restTime: 0,
            targetMuscles: ["specific to workout"],
            emoji: "🧩"
          }
        ]
      },
      caloriesBurned: 400
    },
    advanced: {
      name: "Advanced Muscle Building Plan",
      description: "A high-volume, split routine focusing on maximal muscle hypertrophy.",
      exercises: {
        warmup: [
          {
            name: "Activation Exercises",
            description: "Perform exercises to activate specific muscle groups being targeted in workout.",
            sets: 1,
            reps: 40,
            restTime: 0,
            targetMuscles: ["specific to workout"],
            emoji: "🔥"
          },
          {
            name: "Progressive Loading",
            description: "Perform warm-up sets with progressively heavier weights for first exercise.",
            sets: 3,
            reps: 5,
            restTime: 60,
            targetMuscles: ["specific to workout"],
            emoji: "📈"
          }
        ],
        main: [
          {
            name: "Incline Dumbbell Press",
            description: "Lie on incline bench, press dumbbells from shoulder height to full extension, then lower back down.",
            sets: 4,
            reps: 8,
            restTime: 90,
            targetMuscles: ["upper chest", "shoulders", "triceps"],
            emoji: "🏋️"
          },
          {
            name: "Weighted Pull-Ups",
            description: "Attach weight to belt or hold between feet, perform pull-up bringing chest to bar level.",
            sets: 4,
            reps: 6,
            restTime: 120,
            targetMuscles: ["back", "biceps", "forearms"],
            emoji: "💪"
          },
          {
            name: "Front Squats",
            description: "Hold barbell across front of shoulders, squat down keeping torso upright, then return to standing.",
            sets: 5,
            reps: 5,
            restTime: 180,
            targetMuscles: ["quadriceps", "core", "upper back"],
            emoji: "🏋️"
          },
          {
            name: "Weighted Dips",
            description: "Attach weight to belt or hold between feet, lower body by bending arms until shoulders are at elbow level, then press back up.",
            sets: 4,
            reps: 8,
            restTime: 90,
            targetMuscles: ["chest", "triceps", "shoulders"],
            emoji: "💪"
          },
          {
            name: "Barbell Hip Thrusts",
            description: "Sit with upper back against bench, barbell across hips, lower hips toward ground, then thrust upward by contracting glutes.",
            sets: 4,
            reps: 10,
            restTime: 90,
            targetMuscles: ["glutes", "hamstrings"],
            emoji: "🏋️"
          }
        ],
        cooldown: [
          {
            name: "Mobility Work",
            description: "Perform mobility exercises for joints worked during session.",
            sets: 1,
            reps: 40,
            restTime: 0,
            targetMuscles: ["specific to workout"],
            emoji: "🧘"
          },
          {
            name: "Recovery Techniques",
            description: "Use techniques like contrast bathing, compression, or light active recovery.",
            sets: 1,
            reps: 60,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🧊"
          }
        ]
      },
      caloriesBurned: 500
    }
  },
  "endurance": {
    beginner: {
      name: "Beginner Endurance Plan",
      description: "A gentle introduction to cardiovascular training and muscular endurance.",
      exercises: {
        warmup: [
          {
            name: "Marching in Place",
            description: "March in place lifting knees to waist height.",
            sets: 1,
            reps: 60,
            restTime: 0,
            targetMuscles: ["legs", "cardiovascular"],
            emoji: "🚶"
          },
          {
            name: "Arm Circles",
            description: "Extend arms to sides and make small circles, then increase to larger circles.",
            sets: 1,
            reps: 30,
            restTime: 0,
            targetMuscles: ["shoulders", "arms"],
            emoji: "🔄"
          }
        ],
        main: [
          {
            name: "Walking/Light Jogging Intervals",
            description: "Alternate between 2 minutes of brisk walking and 1 minute of light jogging.",
            sets: 5,
            reps: 1,
            restTime: 0,
            targetMuscles: ["legs", "cardiovascular"],
            emoji: "🏃"
          },
          {
            name: "Bodyweight Squats",
            description: "Perform squats at moderate pace focusing on consistent depth.",
            sets: 3,
            reps: 15,
            restTime: 45,
            targetMuscles: ["quadriceps", "glutes", "hamstrings"],
            emoji: "🏋️"
          },
          {
            name: "Modified Push-Ups",
            description: "Perform push-ups (on knees if needed) at steady pace.",
            sets: 3,
            reps: 10,
            restTime: 45,
            targetMuscles: ["chest", "shoulders", "triceps"],
            emoji: "💪"
          },
          {
            name: "Glute Bridges",
            description: "Lie on back with knees bent, lift hips toward ceiling by contracting glutes, then lower back down.",
            sets: 3,
            reps: 15,
            restTime: 30,
            targetMuscles: ["glutes", "hamstrings", "lower back"],
            emoji: "🍑"
          },
          {
            name: "Step-Ups",
            description: "Step up onto elevated surface (step, bench, etc.), then step back down. Alternate leading leg.",
            sets: 3,
            reps: 12,
            restTime: 45,
            targetMuscles: ["quadriceps", "glutes", "calves"],
            emoji: "🪜"
          }
        ],
        cooldown: [
          {
            name: "Walking",
            description: "Walk at decreasing pace to gradually lower heart rate.",
            sets: 1,
            reps: 120,
            restTime: 0,
            targetMuscles: ["legs", "cardiovascular"],
            emoji: "🚶"
          },
          {
            name: "Static Stretching",
            description: "Hold stretches for major muscle groups for 20-30 seconds each.",
            sets: 1,
            reps: 120,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🧘"
          }
        ]
      },
      caloriesBurned: 250
    },
    intermediate: {
      name: "Intermediate Endurance Plan",
      description: "A balanced program combining interval training, tempo work, and circuit training for improved stamina.",
      exercises: {
        warmup: [
          {
            name: "Dynamic Warm-Up",
            description: "Perform leg swings, arm swings, bodyweight squats, and lunges.",
            sets: 1,
            reps: 60,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🤸"
          },
          {
            name: "Light Cardio",
            description: "Light jogging or cycling at gradually increasing intensity.",
            sets: 1,
            reps: 180,
            restTime: 0,
            targetMuscles: ["cardiovascular"],
            emoji: "🏃"
          }
        ],
        main: [
          {
            name: "Tempo Runs",
            description: "Run at moderately hard pace (about 75-85% of max effort) for duration of set.",
            sets: 4,
            reps: 180,
            restTime: 60,
            targetMuscles: ["legs", "cardiovascular"],
            emoji: "🏃"
          },
          {
            name: "Circuit Training",
            description: "Perform exercises back-to-back with no rest between exercises: 30 jumping jacks, 15 push-ups, 20 bodyweight squats, 10 burpees, 30-second plank.",
            sets: 3,
            reps: 1,
            restTime: 120,
            targetMuscles: ["full body", "cardiovascular"],
            emoji: "⚡"
          },
          {
            name: "Box Step-Ups",
            description: "Step up onto elevated box or bench, alternating leading leg.",
            sets: 3,
            reps: 20,
            restTime: 45,
            targetMuscles: ["quadriceps", "glutes", "cardiovascular"],
            emoji: "📦"
          },
          {
            name: "Kettlebell Swings",
            description: "Perform kettlebell swings with moderately heavy weight using hip hinge motion.",
            sets: 3,
            reps: 20,
            restTime: 45,
            targetMuscles: ["posterior chain", "cardiovascular"],
            emoji: "🏋️"
          },
          {
            name: "Rowing Intervals",
            description: "If equipment available, row at high intensity for 1 minute, then moderate intensity for 1 minute.",
            sets: 5,
            reps: 1,
            restTime: 30,
            targetMuscles: ["back", "arms", "legs", "cardiovascular"],
            emoji: "🚣"
          }
        ],
        cooldown: [
          {
            name: "Light Cardio",
            description: "5 minutes of light jogging or cycling to gradually reduce heart rate.",
            sets: 1,
            reps: 300,
            restTime: 0,
            targetMuscles: ["cardiovascular"],
            emoji: "🚶"
          },
          {
            name: "Comprehensive Stretching",
            description: "Stretch all major muscle groups holding each for 30 seconds.",
            sets: 1,
            reps: 300,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🧘"
          }
        ]
      },
      caloriesBurned: 450
    },
    advanced: {
      name: "Advanced Endurance Plan",
      description: "A high-performance program with challenging interval work, threshold training, and sport-specific conditioning.",
      exercises: {
        warmup: [
          {
            name: "Progressive Warm-Up",
            description: "5 minutes of dynamic movements gradually increasing in intensity.",
            sets: 1,
            reps: 300,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "📈"
          },
          {
            name: "Movement Preparation",
            description: "Perform mobility exercises and movement patterns specific to workout.",
            sets: 1,
            reps: 120,
            restTime: 0,
            targetMuscles: ["specific to workout"],
            emoji: "🤸"
          }
        ],
        main: [
          {
            name: "High-Intensity Intervals",
            description: "Sprint or perform all-out effort for 30 seconds, then recover for 90 seconds.",
            sets: 8,
            reps: 1,
            restTime: 90,
            targetMuscles: ["legs", "cardiovascular"],
            emoji: "⚡"
          },
          {
            name: "Threshold Training",
            description: "Perform activity (running, cycling, etc.) at intensity just below anaerobic threshold for duration of set.",
            sets: 3,
            reps: 300,
            restTime: 120,
            targetMuscles: ["cardiovascular", "specific to activity"],
            emoji: "📊"
          },
          {
            name: "Plyometric Circuit",
            description: "Perform 10 box jumps, 10 jump squats, 10 plyo push-ups, and 10 burpees without rest between exercises.",
            sets: 4,
            reps: 1,
            restTime: 120,
            targetMuscles: ["full body", "cardiovascular"],
            emoji: "💥"
          },
          {
            name: "Weighted Stair Climbs",
            description: "Climb stairs while carrying weights or wearing weighted vest.",
            sets: 5,
            reps: 1,
            restTime: 90,
            targetMuscles: ["legs", "cardiovascular"],
            emoji: "🪜"
          },
          {
            name: "Tabata Protocol",
            description: "Perform 20 seconds of all-out effort followed by 10 seconds rest. Choose different exercises for each round: mountain climbers, kettlebell swings, battle ropes, etc.",
            sets: 8,
            reps: 1,
            restTime: 10,
            targetMuscles: ["varied", "cardiovascular"],
            emoji: "🔄"
          }
        ],
        cooldown: [
          {
            name: "Active Recovery",
            description: "10 minutes of light activity at decreasing intensity.",
            sets: 1,
            reps: 600,
            restTime: 0,
            targetMuscles: ["cardiovascular"],
            emoji: "🚶"
          },
          {
            name: "Mobility and Flexibility Work",
            description: "Comprehensive stretching and mobility exercises focusing on areas of tightness.",
            sets: 1,
            reps: 300,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🧘"
          }
        ]
      },
      caloriesBurned: 700
    }
  },
  "flexibility": {
    beginner: {
      name: "Beginner Flexibility Plan",
      description: "An introduction to basic stretching techniques to improve overall flexibility.",
      exercises: {
        warmup: [
          {
            name: "Light Walking or Marching",
            description: "Walk or march in place to increase body temperature.",
            sets: 1,
            reps: 120,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🚶"
          },
          {
            name: "Gentle Joint Rotations",
            description: "Rotate major joints (ankles, knees, hips, shoulders, wrists) in circular motions.",
            sets: 1,
            reps: 60,
            restTime: 0,
            targetMuscles: ["joints"],
            emoji: "🔄"
          }
        ],
        main: [
          {
            name: "Standing Forward Bend",
            description: "Stand with feet hip-width apart, hinge at hips to fold forward, allowing arms to hang down. Keep slight bend in knees if needed.",
            sets: 3,
            reps: 30,
            restTime: 15,
            targetMuscles: ["hamstrings", "lower back"],
            emoji: "🙇"
          },
          {
            name: "Cat-Cow Stretch",
            description: "On hands and knees, alternate between arching back upward (cat) and letting it sag (cow).",
            sets: 3,
            reps: 10,
            restTime: 15,
            targetMuscles: ["spine", "core"],
            emoji: "🐱"
          },
          {
            name: "Seated Butterfly Stretch",
            description: "Sit with soles of feet together, knees falling outward. Hold ankles and gently press knees toward floor.",
            sets: 3,
            reps: 30,
            restTime: 15,
            targetMuscles: ["inner thighs", "hips"],
            emoji: "🦋"
          },
          {
            name: "Standing Quad Stretch",
            description: "Stand on one leg, grab ankle of other leg and gently pull toward buttocks. Use wall or chair for balance if needed.",
            sets: 3,
            reps: 30,
            restTime: 15,
            targetMuscles: ["quadriceps"],
            emoji: "🦵"
          },
          {
            name: "Seated Forward Bend",
            description: "Sit with legs extended straight, hinge at hips to reach toward toes.",
            sets: 3,
            reps: 30,
            restTime: 15,
            targetMuscles: ["hamstrings", "lower back"],
            emoji: "🧘"
          }
        ],
        cooldown: [
          {
            name: "Child's Pose",
            description: "Kneel with big toes touching, sit back on heels, extend arms forward with forehead on floor.",
            sets: 1,
            reps: 60,
            restTime: 0,
            targetMuscles: ["back", "shoulders", "hips"],
            emoji: "🧘"
          },
          {
            name: "Lying Spinal Twist",
            description: "Lie on back, bring one knee across body while keeping shoulders on floor. Hold, then switch sides.",
            sets: 1,
            reps: 60,
            restTime: 0,
            targetMuscles: ["spine", "glutes"],
            emoji: "🔄"
          }
        ]
      },
      caloriesBurned: 150
    },
    intermediate: {
      name: "Intermediate Flexibility Plan",
      description: "A more comprehensive flexibility routine incorporating dynamic and static stretching with longer holds.",
      exercises: {
        warmup: [
          {
            name: "Light Cardio",
            description: "5 minutes of light jogging, jumping jacks, or cycling to increase body temperature.",
            sets: 1,
            reps: 300,
            restTime: 0,
            targetMuscles: ["full body", "cardiovascular"],
            emoji: "🏃"
          },
          {
            name: "Dynamic Stretching",
            description: "Perform leg swings, arm circles, torso twists, and walking lunges with rotation.",
            sets: 1,
            reps: 120,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🤸"
          }
        ],
        main: [
          {
            name: "Downward-Facing Dog",
            description: "Form inverted V shape with body, pressing heels toward floor while pushing floor away with hands.",
            sets: 3,
            reps: 45,
            restTime: 15,
            targetMuscles: ["shoulders", "hamstrings", "calves"],
            emoji: "🐕"
          },
          {
            name: "Pigeon Pose",
            description: "From all fours, bring one knee forward behind wrist, extend other leg back. Fold forward for deeper stretch. Switch sides.",
            sets: 3,
            reps: 45,
            restTime: 15,
            targetMuscles: ["hips", "glutes"],
            emoji: "🧘"
          },
          {
            name: "Seated Straddle",
            description: "Sit with legs spread wide apart, hinge at hips to reach forward. Also try reaching toward each foot.",
            sets: 3,
            reps: 45,
            restTime: 15,
            targetMuscles: ["inner thighs", "hamstrings", "lower back"],
            emoji: "🧘"
          },
          {
            name: "Cobra Pose",
            description: "Lie face down, place hands under shoulders, gently push chest up keeping hips on floor.",
            sets: 3,
            reps: 30,
            restTime: 15,
            targetMuscles: ["spine", "chest", "shoulders"],
            emoji: "🐍"
          },
          {
            name: "Standing Side Bend",
            description: "Stand with feet hip-width apart, reach one arm overhead and bend sideways. Switch sides.",
            sets: 3,
            reps: 30,
            restTime: 15,
            targetMuscles: ["obliques", "lats", "shoulders"],
            emoji: "🧍"
          }
        ],
        cooldown: [
          {
            name: "Happy Baby Pose",
            description: "Lie on back, bring knees toward armpits, grab outsides of feet, gently pull knees toward floor.",
            sets: 1,
            reps: 60,
            restTime: 0,
            targetMuscles: ["hips", "inner thighs", "lower back"],
            emoji: "👶"
          },
          {
            name: "Supine Figure Four",
            description: "Lie on back, cross one ankle over opposite thigh, thread hands behind uncrossed leg and pull toward chest. Switch sides.",
            sets: 1,
            reps: 60,
            restTime: 0,
            targetMuscles: ["glutes", "hips"],
            emoji: "4️⃣"
          }
        ]
      },
      caloriesBurned: 200
    },
    advanced: {
      name: "Advanced Flexibility Plan",
      description: "A comprehensive program incorporating advanced yoga postures, PNF techniques, and mobility drills.",
      exercises: {
        warmup: [
          {
            name: "Comprehensive Warm-Up",
            description: "10 minutes of progressive warm-up including light cardio, dynamic movements, and mobility drills.",
            sets: 1,
            reps: 600,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🔥"
          },
          {
            name: "Flow Sequence",
            description: "Perform several rounds of basic yoga flow (sun salutation) to prepare body.",
            sets: 3,
            reps: 1,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "☀️"
          }
        ],
        main: [
          {
            name: "PNF Hamstring Stretch",
            description: "Lie on back with one leg extended up, loop strap around foot. Pull leg toward head, then push against resistance for 5 seconds, relax deeper into stretch. Repeat.",
            sets: 3,
            reps: 60,
            restTime: 30,
            targetMuscles: ["hamstrings"],
            emoji: "🦵"
          },
          {
            name: "Full Split Progression",
            description: "Work progressively toward full front split using props as needed for support.",
            sets: 3,
            reps: 60,
            restTime: 30,
            targetMuscles: ["hamstrings", "hip flexors"],
            emoji: "🤸"
          },
          {
            name: "Wheel Pose",
            description: "Lie on back, bend knees with feet on floor. Place hands by ears, push up to create backward arch.",
            sets: 3,
            reps: 30,
            restTime: 30,
            targetMuscles: ["spine", "shoulders", "chest", "hip flexors"],
            emoji: "🔄"
          },
          {
            name: "Shoulder Opener Sequence",
            description: "Perform series of shoulder stretches including thread the needle, cow face arms, and bind variations.",
            sets: 3,
            reps: 60,
            restTime: 30,
            targetMuscles: ["shoulders", "chest", "upper back"],
            emoji: "💪"
          },
          {
            name: "Advanced Hip Openers",
            description: "Perform sequence of advanced hip stretches including lizard pose, frog pose, and fire log pose.",
            sets: 3,
            reps: 60,
            restTime: 30,
            targetMuscles: ["hips", "glutes", "inner thighs"],
            emoji: "🦎"
          }
        ],
        cooldown: [
          {
            name: "Yin Yoga Sequence",
            description: "Hold passive yin yoga poses for extended periods (3-5 minutes each) to target deep fascia.",
            sets: 1,
            reps: 300,
            restTime: 0,
            targetMuscles: ["varied", "fascia"],
            emoji: "☯️"
          },
          {
            name: "Savasana",
            description: "Lie on back in complete relaxation, allowing body to integrate changes from practice.",
            sets: 1,
            reps: 300,
            restTime: 0,
            targetMuscles: ["mind", "nervous system"],
            emoji: "😌"
          }
        ]
      },
      caloriesBurned: 250
    }
  },
  "general": {
    beginner: {
      name: "Beginner General Fitness Plan",
      description: "A balanced introduction to fitness covering cardiovascular exercise, basic strength training, and flexibility.",
      exercises: {
        warmup: [
          {
            name: "Arm Circles and Shoulder Rolls",
            description: "Rotate arms in circles forward and backward, then roll shoulders.",
            sets: 1,
            reps: 30,
            restTime: 0,
            targetMuscles: ["shoulders", "arms"],
            emoji: "🔄"
          },
          {
            name: "Marching in Place",
            description: "March in place lifting knees toward waist.",
            sets: 1,
            reps: 60,
            restTime: 0,
            targetMuscles: ["legs", "cardiovascular"],
            emoji: "🚶"
          }
        ],
        main: [
          {
            name: "Bodyweight Squats",
            description: "Stand with feet shoulder-width apart, lower body by bending knees and hips, then return to standing.",
            sets: 2,
            reps: 12,
            restTime: 60,
            targetMuscles: ["quadriceps", "glutes", "hamstrings"],
            emoji: "🏋️"
          },
          {
            name: "Modified Push-Ups",
            description: "Perform push-ups with knees on ground if needed.",
            sets: 2,
            reps: 8,
            restTime: 60,
            targetMuscles: ["chest", "shoulders", "triceps"],
            emoji: "💪"
          },
          {
            name: "Walking Lunges",
            description: "Step forward into lunge position, then bring other foot forward past first foot and into next lunge.",
            sets: 2,
            reps: 10,
            restTime: 60,
            targetMuscles: ["quadriceps", "glutes", "hamstrings"],
            emoji: "🚶"
          },
          {
            name: "Supermans",
            description: "Lie face down, simultaneously lift arms, chest, and legs off floor, hold briefly, then lower.",
            sets: 2,
            reps: 10,
            restTime: 60,
            targetMuscles: ["lower back", "glutes"],
            emoji: "🦸"
          },
          {
            name: "Cardio Interval",
            description: "Perform 3 minutes of moderate-intensity cardio (marching in place, jumping jacks, etc.).",
            sets: 2,
            reps: 1,
            restTime: 90,
            targetMuscles: ["cardiovascular", "full body"],
            emoji: "🏃"
          }
        ],
        cooldown: [
          {
            name: "Hamstring Stretch",
            description: "Sit with one leg extended, other leg bent with foot against inner thigh. Reach toward toes of extended leg. Switch sides.",
            sets: 1,
            reps: 30,
            restTime: 0,
            targetMuscles: ["hamstrings"],
            emoji: "🧘"
          },
          {
            name: "Chest Stretch",
            description: "Stand in doorway with arms on doorframe at shoulder height, lean forward to stretch chest muscles.",
            sets: 1,
            reps: 30,
            restTime: 0,
            targetMuscles: ["chest", "shoulders"],
            emoji: "🧘"
          }
        ]
      },
      caloriesBurned: 200
    },
    intermediate: {
      name: "Intermediate General Fitness Plan",
      description: "A comprehensive program to develop all aspects of fitness including strength, cardiovascular endurance, and flexibility.",
      exercises: {
        warmup: [
          {
            name: "Dynamic Warm-Up",
            description: "Perform arm swings, leg swings, hip circles, jumping jacks, and high knees for 5 minutes.",
            sets: 1,
            reps: 300,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🤸"
          },
          {
            name: "Mobility Exercises",
            description: "Perform mobility exercises for major joints: ankle rotations, knee circles, hip openers, shoulder circles.",
            sets: 1,
            reps: 120,
            restTime: 0,
            targetMuscles: ["joints"],
            emoji: "🔄"
          }
        ],
        main: [
          {
            name: "Circuit Training",
            description: "Perform 45 seconds each of: squats, push-ups, lunges, bent-over rows (with resistance band or light weights), plank, and mountain climbers with 15 seconds rest between exercises.",
            sets: 3,
            reps: 1,
            restTime: 120,
            targetMuscles: ["full body"],
            emoji: "⚡"
          },
          {
            name: "Kettlebell Swings",
            description: "Perform kettlebell swings with moderate weight using hip hinge motion.",
            sets: 3,
            reps: 15,
            restTime: 60,
            targetMuscles: ["glutes", "hamstrings", "core", "shoulders"],
            emoji: "🏋️"
          },
          {
            name: "Dumbbell Shoulder Press",
            description: "Press dumbbells from shoulder height to overhead, then lower back down.",
            sets: 3,
            reps: 12,
            restTime: 60,
            targetMuscles: ["shoulders", "triceps"],
            emoji: "💪"
          },
          {
            name: "Cardio Intervals",
            description: "Perform 1 minute high intensity (jump squats, burpees, or high knees) followed by 1 minute moderate intensity (marching in place).",
            sets: 5,
            reps: 1,
            restTime: 0,
            targetMuscles: ["cardiovascular", "full body"],
            emoji: "🏃"
          },
          {
            name: "Plank Variations",
            description: "Hold standard plank, then side plank on each side, then plank with shoulder taps.",
            sets: 3,
            reps: 30,
            restTime: 30,
            targetMuscles: ["core", "shoulders"],
            emoji: "🧗"
          }
        ],
        cooldown: [
          {
            name: "Static Stretching",
            description: "Hold stretches for major muscle groups: hamstrings, quadriceps, calves, chest, back, shoulders.",
            sets: 1,
            reps: 180,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🧘"
          },
          {
            name: "Deep Breathing",
            description: "Perform deep breathing exercises to promote recovery and relaxation.",
            sets: 1,
            reps: 60,
            restTime: 0,
            targetMuscles: ["diaphragm", "mind"],
            emoji: "🧘"
          }
        ]
      },
      caloriesBurned: 350
    },
    advanced: {
      name: "Advanced General Fitness Plan",
      description: "A high-level program for overall fitness incorporating advanced training techniques for strength, power, endurance, and mobility.",
      exercises: {
        warmup: [
          {
            name: "Comprehensive Warm-Up",
            description: "10 minutes of progressive warm-up including light cardio, dynamic movements, mobility work, and movement preparation.",
            sets: 1,
            reps: 600,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🔥"
          },
          {
            name: "Movement Skill Practice",
            description: "Practice technical movements that will be used in workout at lower intensity.",
            sets: 1,
            reps: 180,
            restTime: 0,
            targetMuscles: ["specific to workout"],
            emoji: "🔄"
          }
        ],
        main: [
          {
            name: "Strength Complex",
            description: "Perform complex of barbell exercises without setting bar down: 5 deadlifts, 5 bent-over rows, 5 hang cleans, 5 front squats, 5 push presses.",
            sets: 3,
            reps: 1,
            restTime: 180,
            targetMuscles: ["full body"],
            emoji: "🏋️"
          },
          {
            name: "MetCon Circuit",
            description: "30 seconds of each with no rest between: box jumps, kettlebell swings, battle ropes, wall balls, rowing/assault bike. Rest 2 minutes between rounds.",
            sets: 4,
            reps: 1,
            restTime: 120,
            targetMuscles: ["full body", "cardiovascular"],
            emoji: "⚡"
          },
          {
            name: "Weighted Pull-Ups",
            description: "Perform pull-ups with added weight.",
            sets: 4,
            reps: 8,
            restTime: 90,
            targetMuscles: ["back", "biceps", "forearms"],
            emoji: "💪"
          },
          {
            name: "Plyometric Circuit",
            description: "Perform 10 reps each of: plyo push-ups, jump squats, lateral bounds, depth jumps. Rest 30 seconds between exercises.",
            sets: 3,
            reps: 1,
            restTime: 120,
            targetMuscles: ["full body", "power"],
            emoji: "💥"
          },
          {
            name: "Core Stability/Strength",
            description: "Perform advanced core exercises: hollow body rocks, L-sits, toes-to-bar, ab wheel rollouts, and weighted Russian twists.",
            sets: 3,
            reps: [20, 20, 12, 10, 20],
            restTime: 45,
            targetMuscles: ["core"],
            emoji: "🧗"
          }
        ],
        cooldown: [
          {
            name: "Active Recovery",
            description: "5 minutes of light activity (walking, cycling) to promote blood flow and recovery.",
            sets: 1,
            reps: 300,
            restTime: 0,
            targetMuscles: ["cardiovascular"],
            emoji: "🚶"
          },
          {
            name: "Mobility and Recovery Work",
            description: "10 minutes of comprehensive mobility work, foam rolling, and static stretching.",
            sets: 1,
            reps: 600,
            restTime: 0,
            targetMuscles: ["full body"],
            emoji: "🧘"
          }
        ]
      },
      caloriesBurned: 600
    }
  }
};

export default function WorkoutPlans() {
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [generatedWorkoutPlan, setGeneratedWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const { toast } = useToast();

  // Load existing workout plans
  const { data: workoutPlans = [], isLoading: plansLoading } = useQuery<WorkoutPlan[]>({
    queryKey: ["/api/workout-plans"],
  });

  // Form setup
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      height: 170,
      weight: 70,
      gender: "male",
      age: 30,
      fitnessLevel: "beginner",
      workoutDuration: 45,
      workoutLocation: "home",
      workoutGoal: "general",
      healthIssues: [],
      preferredDays: 3,
      notes: "",
    },
  });

  // Calculate BMI
  const calculateBMI = () => {
    const height = form.getValues("height") / 100; // convert cm to meters
    const weight = form.getValues("weight");
    
    if (height > 0 && weight > 0) {
      const bmi = weight / (height * height);
      return bmi.toFixed(1);
    }
    return "N/A";
  };

  // Get BMI category
  const getBMICategory = () => {
    const bmi = parseFloat(calculateBMI());
    
    if (isNaN(bmi)) return "N/A";
    
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  // Generate workout plan from defaults
  const getDefaultWorkoutPlan = (values: WorkoutFormValues) => {
    const { workoutGoal, fitnessLevel } = values;
    
    let defaultPlan = defaultWorkouts[workoutGoal][fitnessLevel];
    
    // Modify based on health issues
    if (values.healthIssues && values.healthIssues.length > 0) {
      const modifiedExercises = { ...defaultPlan.exercises };
      
      if (values.healthIssues.includes("back-pain")) {
        // Remove or modify exercises that stress the back
        modifiedExercises.main = modifiedExercises.main.filter(ex => 
          !ex.targetMuscles.includes("back") && 
          !ex.targetMuscles.includes("lower back") &&
          !ex.name.toLowerCase().includes("deadlift") &&
          !ex.name.toLowerCase().includes("bent-over")
        );
        
        // Add alternative exercises if needed
        if (modifiedExercises.main.length < 3) {
          modifiedExercises.main.push({
            name: "Wall Slides",
            description: "Stand with back against wall, slide arms up and down wall keeping contact throughout movement.",
            sets: 3,
            reps: 12,
            restTime: 45,
            targetMuscles: ["shoulders", "upper back"],
            emoji: "🧍"
          });
        }
      }
      
      if (values.healthIssues.includes("knee-pain")) {
        // Modify or remove exercises that stress the knees
        modifiedExercises.main = modifiedExercises.main.filter(ex => 
          !ex.targetMuscles.includes("quadriceps") ||
          !ex.name.toLowerCase().includes("squat") &&
          !ex.name.toLowerCase().includes("lunge") &&
          !ex.name.toLowerCase().includes("jump")
        );
        
        // Add alternative exercises
        if (modifiedExercises.main.length < 3) {
          modifiedExercises.main.push({
            name: "Swimming or Water Exercises",
            description: "Perform exercises in water to reduce impact on joints.",
            sets: 3,
            reps: 180,
            restTime: 60,
            targetMuscles: ["full body", "cardiovascular"],
            emoji: "🏊"
          });
        }
      }
      
      if (values.healthIssues.includes("pregnancy")) {
        // Adapt for pregnancy
        defaultPlan.description += " Modified for pregnancy with appropriate intensity and movement patterns.";
        
        // Remove high-intensity or high-impact exercises
        modifiedExercises.main = modifiedExercises.main.filter(ex => 
          !ex.name.toLowerCase().includes("jump") &&
          !ex.name.toLowerCase().includes("burpee") &&
          !ex.name.toLowerCase().includes("sprint") &&
          !ex.targetMuscles.includes("abs")
        );
        
        // Add pregnancy-appropriate exercises
        if (modifiedExercises.main.length < 4) {
          modifiedExercises.main.push({
            name: "Bird Dog",
            description: "On hands and knees, extend opposite arm and leg while maintaining stable core.",
            sets: 2,
            reps: 10,
            restTime: 30,
            targetMuscles: ["core stabilizers", "shoulders", "glutes"],
            emoji: "🐕"
          });
          
          modifiedExercises.main.push({
            name: "Side-lying Leg Lifts",
            description: "Lie on side with body in straight line, lift top leg up and down in controlled manner.",
            sets: 2,
            reps: 12,
            restTime: 30,
            targetMuscles: ["outer thighs", "hip stabilizers"],
            emoji: "🦵"
          });
        }
      }
      
      defaultPlan = {
        ...defaultPlan,
        exercises: modifiedExercises
      };
    }
    
    // Adjust workout duration
    const requestedDuration = values.workoutDuration;
    const estimatedDefaultDuration = 
      defaultPlan.exercises.warmup.reduce((acc, ex) => acc + ex.reps + ex.restTime, 0) +
      defaultPlan.exercises.main.reduce((acc, ex) => acc + (ex.reps * ex.sets) + (ex.restTime * ex.sets), 0) +
      defaultPlan.exercises.cooldown.reduce((acc, ex) => acc + ex.reps + ex.restTime, 0);
    
    // Convert to minutes
    const defaultDurationMinutes = Math.round(estimatedDefaultDuration / 60);
    
    // Scale if significantly different
    if (Math.abs(defaultDurationMinutes - requestedDuration) > 10) {
      const scaleFactor = requestedDuration / defaultDurationMinutes;
      
      // Adjust main exercises sets/reps
      defaultPlan.exercises.main = defaultPlan.exercises.main.map(ex => ({
        ...ex,
        sets: Math.max(1, Math.round(ex.sets * scaleFactor))
      }));
      
      defaultPlan.description += ` Adjusted to approximately ${requestedDuration} minutes.`;
    }
    
    // Create a proper workout plan object
    return {
      id: Math.floor(Math.random() * 1000),
      userId: 1,
      name: defaultPlan.name,
      description: defaultPlan.description,
      exercises: defaultPlan.exercises,
      caloriesBurned: defaultPlan.caloriesBurned,
      createdAt: new Date()
    };
  };

  // Generate workout plan mutation
  const generateMutation = useMutation({
    mutationFn: async (values: WorkoutFormValues) => {
      try {
        const res = await apiRequest("POST", "/api/workout-plans/generate", values);
        return await res.json();
      } catch (error) {
        // If API call fails, return default workout plan based on form values
        console.log("Using default workout plan due to API error");
        return getDefaultWorkoutPlan(values);
      }
    },
    onSuccess: (data: WorkoutPlan) => {
      toast({
        title: "Workout Plan Generated",
        description: `Successfully created "${data.name}"`,
      });
      setGeneratedWorkoutPlan(data);
      queryClient.invalidateQueries({ queryKey: ["/api/workout-plans"] });
      setIsGenerateDialogOpen(false);
      setActiveTab("currentPlan");
    },
    onError: (error: Error) => {
      // Use default workout plan instead of showing an error
      toast({
        title: "Using Demo Mode",
        description: "Showing sample workout plan as the API connection is unavailable",
      });
      
      const defaultPlan = getDefaultWorkoutPlan(form.getValues());
      setGeneratedWorkoutPlan(defaultPlan);
      queryClient.setQueryData(["/api/workout-plans"], (oldData = []) => [...oldData as WorkoutPlan[], defaultPlan]);
      setIsGenerateDialogOpen(false);
      setActiveTab("currentPlan");
    },
  });

  // Delete workout plan mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/workout-plans/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Workout plan deleted",
        description: "The workout plan has been removed."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workout-plans"] });
      if (generatedWorkoutPlan && generatedWorkoutPlan.id === deleteMutation.variables) {
        setGeneratedWorkoutPlan(null);
        setActiveTab("create");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: WorkoutFormValues) {
    generateMutation.mutate(values);
  }

  const handleDeletePlan = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Workout Plans</h1>
            <p className="text-muted-foreground">Create personalized workout plans tailored to your fitness goals and needs</p>
          </div>
          
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Generate Workout Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Workout Plan</DialogTitle>
                <DialogDescription>
                  Customize your workout plan based on your fitness level and goals.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 p-4 mb-4 bg-muted rounded-md">
                    <div className="flex flex-col space-y-1.5 mb-2">
                      <h3 className="text-sm font-medium leading-none">Your Body Metrics</h3>
                      <p className="text-sm text-muted-foreground">Based on your height and weight</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">BMI</p>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold">{calculateBMI()}</span>
                          <span className="text-sm text-muted-foreground mb-1">kg/m²</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{getBMICategory()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Height in cm" 
                              type="number" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                form.trigger("height");
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Weight in kg" 
                              type="number" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                form.trigger("weight");
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your age" 
                              type="number" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fitnessLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fitness Level</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select fitness level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the level that best matches your current fitness.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="workoutGoal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workout Goal</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select workout goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weight-loss">Weight Loss</SelectItem>
                              <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                              <SelectItem value="endurance">Endurance</SelectItem>
                              <SelectItem value="flexibility">Flexibility</SelectItem>
                              <SelectItem value="general">General Fitness</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            What's your primary fitness objective?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="workoutDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workout Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Duration in minutes" 
                              type="number" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            How long you can dedicate to each workout session.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="preferredDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workouts Per Week</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Days per week" 
                              type="number" 
                              min={1}
                              max={7}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            How many days per week can you exercise?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="workoutLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout Location</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select workout location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="gym">Gym</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Where will you be working out?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="healthIssues"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Health Issues</FormLabel>
                          <FormDescription>
                            Select any health issues you have that may affect your workout.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {healthIssuesOptions.map((issue) => (
                            <FormField
                              key={issue.id}
                              control={form.control}
                              name="healthIssues"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={issue.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(issue.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], issue.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== issue.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {issue.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional information about your fitness preferences..." 
                            {...field}
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Optional information that helps us tailor your workout plan.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={generateMutation.isPending}
                      className="w-full"
                    >
                      {generateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Dumbbell className="mr-2 h-4 w-4" />
                      )}
                      Generate Workout Plan
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="create">Create Plan</TabsTrigger>
            <TabsTrigger value="currentPlan">Current Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Generate a Workout Plan</CardTitle>
                  <CardDescription>
                    Create a personalized workout plan based on your fitness goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Our AI will generate a custom workout plan tailored to your specific goals,
                    fitness level, and any health conditions. Each plan includes warm-up exercises,
                    main workout components, and cool-down stretches.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <Dumbbell className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-1">Personalized</h3>
                      <p className="text-xs text-muted-foreground">Based on your fitness level</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <ListChecks className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold mb-1">Step-by-Step</h3>
                      <p className="text-xs text-muted-foreground">Clear exercise instructions</p>
                    </div>
                  </div>
                  
                  <Button onClick={() => setIsGenerateDialogOpen(true)} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Workout Plan
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>
                    Our AI-powered workout planning process
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Enter Your Details</h4>
                        <p className="text-sm text-muted-foreground">
                          Provide information about your body metrics, fitness level, and workout goals.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">AI Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          Our AI analyzes your information to determine the optimal workout structure and exercises.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Get Your Plan</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive a detailed workout plan with exercise instructions, sets, reps, and rest periods.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="currentPlan" className="mt-6">
            {!generatedWorkoutPlan && workoutPlans.length === 0 ? (
              <div className="text-center py-8">
                <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Workout Plans Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't created any workout plans yet. Create one to get started!
                </p>
                <Button onClick={() => setIsGenerateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workout Plan
                </Button>
              </div>
            ) : plansLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Display current generated workout plan */}
                {generatedWorkoutPlan && (
                  <Card className="border-primary/50">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{generatedWorkoutPlan.name}</CardTitle>
                          <CardDescription>{generatedWorkoutPlan.description}</CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <FlameIcon className="h-3 w-3 text-orange-500" />
                            {generatedWorkoutPlan.caloriesBurned} calories / session
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-0">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="warmup">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Warm-up</Badge>
                              <span className="text-sm text-muted-foreground">
                                {generatedWorkoutPlan.exercises.warmup.length} exercises
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              {generatedWorkoutPlan.exercises.warmup.map((exercise, index) => (
                                <div key={index} className="p-4 rounded-md border">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium flex items-center gap-2">
                                      <span>{exercise.emoji}</span>
                                      {exercise.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Badge variant="outline" className="text-xs">
                                        {exercise.sets} set{exercise.sets > 1 ? 's' : ''}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {exercise.reps} rep{exercise.reps > 1 ? 's' : ''}
                                      </Badge>
                                      {exercise.restTime > 0 && (
                                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                                          <TimerIcon className="h-3 w-3" />
                                          {exercise.restTime}s rest
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {exercise.targetMuscles.map((muscle, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">{muscle}</Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="main">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Badge>Main Workout</Badge>
                              <span className="text-sm text-muted-foreground">
                                {generatedWorkoutPlan.exercises.main.length} exercises
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              {generatedWorkoutPlan.exercises.main.map((exercise, index) => (
                                <div key={index} className="p-4 rounded-md border">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium flex items-center gap-2">
                                      <span>{exercise.emoji}</span>
                                      {exercise.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Badge variant="outline" className="text-xs">
                                        {exercise.sets} set{exercise.sets > 1 ? 's' : ''}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {exercise.reps} rep{exercise.reps > 1 ? 's' : ''}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                                        <TimerIcon className="h-3 w-3" />
                                        {exercise.restTime}s rest
                                      </Badge>
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {exercise.targetMuscles.map((muscle, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">{muscle}</Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="cooldown">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Cool-down</Badge>
                              <span className="text-sm text-muted-foreground">
                                {generatedWorkoutPlan.exercises.cooldown.length} exercises
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              {generatedWorkoutPlan.exercises.cooldown.map((exercise, index) => (
                                <div key={index} className="p-4 rounded-md border">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium flex items-center gap-2">
                                      <span>{exercise.emoji}</span>
                                      {exercise.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Badge variant="outline" className="text-xs">
                                        {exercise.sets} set{exercise.sets > 1 ? 's' : ''}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {exercise.reps} rep{exercise.reps > 1 ? 's' : ''}
                                      </Badge>
                                      {exercise.restTime > 0 && (
                                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                                          <TimerIcon className="h-3 w-3" />
                                          {exercise.restTime}s rest
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {exercise.targetMuscles.map((muscle, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">{muscle}</Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                    
                    <CardFooter className="pt-6 flex justify-end">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeletePlan(generatedWorkoutPlan.id)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Plan
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                {/* Display previously generated workout plans */}
                {!generatedWorkoutPlan && workoutPlans.length > 0 && (
                  <div className="space-y-4">
                    {workoutPlans.map((plan) => (
                      <Card key={plan.id} className="border-muted">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">{plan.name}</CardTitle>
                              <CardDescription>{plan.description}</CardDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <FlameIcon className="h-3 w-3 text-orange-500" />
                                {plan.caloriesBurned} calories / session
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pb-0">
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="main">
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2">
                                  <Badge>Main Workout</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {plan.exercises.main.length} exercises
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4">
                                  {plan.exercises.main.map((exercise, index) => (
                                    <div key={index} className="p-4 rounded-md border">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium flex items-center gap-2">
                                          <span>{exercise.emoji}</span>
                                          {exercise.name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-sm">
                                          <Badge variant="outline" className="text-xs">
                                            {exercise.sets} set{exercise.sets > 1 ? 's' : ''}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs">
                                            {exercise.reps} rep{exercise.reps > 1 ? 's' : ''}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                                            <TimerIcon className="h-3 w-3" />
                                            {exercise.restTime}s rest
                                          </Badge>
                                        </div>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                                      <div className="flex flex-wrap gap-1">
                                        {exercise.targetMuscles.map((muscle, i) => (
                                          <Badge key={i} variant="secondary" className="text-xs">{muscle}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                        
                        <CardFooter className="pt-6 flex gap-2 justify-between">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setGeneratedWorkoutPlan(plan);
                            }}
                            className="flex items-center gap-2"
                          >
                            View Full Plan
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeletePlan(plan.id)}
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-center mt-6">
                  <Button onClick={() => setIsGenerateDialogOpen(true)} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Generate New Workout Plan
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}