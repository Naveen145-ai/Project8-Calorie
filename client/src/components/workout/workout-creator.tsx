import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Plus, Minus, Trash2, Dumbbell, Timer, Heart, Zap } from "lucide-react";

// Define exercise types
const exerciseTypes = [
  { value: "strength", label: "Strength Training", emoji: "💪" },
  { value: "cardio", label: "Cardio", emoji: "🏃" },
  { value: "hiit", label: "HIIT", emoji: "⚡" },
  { value: "flexibility", label: "Flexibility", emoji: "🧘" },
  { value: "balance", label: "Balance", emoji: "🤸" },
];

// Define muscle groups
const muscleGroups = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "legs", label: "Legs" },
  { value: "arms", label: "Arms" },
  { value: "shoulders", label: "Shoulders" },
  { value: "core", label: "Core" },
  { value: "fullBody", label: "Full Body" },
];

// Define difficulty levels
const difficultyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

// Define emoji map for exercises
const exerciseEmojiMap: Record<string, string> = {
  "push-ups": "💪",
  "pull-ups": "🏋️",
  "squats": "🦵",
  "lunges": "🦵",
  "planks": "🧘",
  "deadlifts": "🏋️",
  "burpees": "⚡",
  "jumping-jacks": "⚡",
  "crunches": "🧘",
  "mountain-climbers": "🧗",
  "running": "🏃",
  "cycling": "🚴",
  "swimming": "🏊",
  "yoga": "🧘",
  "default": "💪"
};

// Define form schema
const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  sets: z.string().optional(),
  reps: z.string().optional(),
  duration: z.string().optional(),
  muscle: z.string().optional(),
  emoji: z.string().optional(),
});

const workoutSchema = z.object({
  name: z.string().min(3, "Workout name must be at least 3 characters"),
  description: z.string().optional(),
  difficulty: z.string().min(1, "Difficulty level is required"),
  duration: z.string().min(1, "Duration is required"),
  exercises: z.array(exerciseSchema).min(1, "Add at least one exercise to your workout"),
});

type WorkoutFormValues = z.infer<typeof workoutSchema>;

interface WorkoutCreatorProps {
  onSave: (workoutPlan: any) => void;
  isSaving: boolean;
}

export default function WorkoutCreator({ onSave, isSaving }: WorkoutCreatorProps) {
  const [calorieEstimate, setCalorieEstimate] = useState(300);
  
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: "",
      description: "",
      difficulty: "intermediate",
      duration: "30",
      exercises: [
        {
          name: "",
          sets: "3",
          reps: "10",
          duration: "",
          muscle: "",
          emoji: "💪",
        },
      ],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exercises",
  });
  
  const addExercise = () => {
    append({
      name: "",
      sets: "3",
      reps: "10",
      duration: "",
      muscle: "",
      emoji: "💪",
    });
  };
  
  const updateEmoji = (index: number, exerciseName: string) => {
    // Convert to lowercase and remove special characters
    const normalizedName = exerciseName.toLowerCase().replace(/[^\w\s]/gi, '');
    
    // Check if there's a matching emoji
    for (const [key, emoji] of Object.entries(exerciseEmojiMap)) {
      if (normalizedName.includes(key)) {
        form.setValue(`exercises.${index}.emoji`, emoji);
        return;
      }
    }
    
    // If no match, set to default
    form.setValue(`exercises.${index}.emoji`, exerciseEmojiMap.default);
  };
  
  const updateCalorieEstimate = () => {
    const difficulty = form.getValues("difficulty");
    const duration = parseInt(form.getValues("duration") || "30", 10);
    const exerciseCount = form.getValues("exercises").length;
    
    // Simple calorie estimation based on difficulty, duration, and exercise count
    let baseCalories = 0;
    
    switch(difficulty) {
      case "beginner":
        baseCalories = 5; // calories burned per minute
        break;
      case "intermediate":
        baseCalories = 7;
        break;
      case "advanced":
        baseCalories = 10;
        break;
      default:
        baseCalories = 6;
    }
    
    const totalCalories = Math.round(baseCalories * duration * (1 + exerciseCount * 0.05));
    setCalorieEstimate(totalCalories);
    
    return totalCalories;
  };
  
  const onSubmit = (data: WorkoutFormValues) => {
    // Calculate calories
    const calories = updateCalorieEstimate();
    
    // Transform the data to match the format expected by the API
    const formattedData = {
      name: data.name,
      description: data.description || "",
      estimatedCalories: calories,
      exercises: JSON.stringify({
        difficulty: data.difficulty,
        duration: data.duration,
        exercises: data.exercises,
      }),
    };
    
    onSave(formattedData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Full Body HIIT Workout" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of your workout" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        updateCalorieEstimate();
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="5" 
                        max="120" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          updateCalorieEstimate();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium flex items-center">
                  <Zap className="h-4 w-4 text-primary mr-2" />
                  Estimated Calories Burned
                </h3>
                <span className="text-lg font-bold">{calorieEstimate}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                This is an estimate based on your workout difficulty, duration, and exercises. Actual calories burned will vary.
              </p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Exercises</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addExercise}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Exercise
              </Button>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2" role="img" aria-label="Exercise emoji">
                          {form.watch(`exercises.${index}.emoji`) || "💪"}
                        </span>
                        <CardTitle className="text-base">Exercise {index + 1}</CardTitle>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => fields.length > 1 && remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 py-2">
                    <FormField
                      control={form.control}
                      name={`exercises.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exercise Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Push-ups" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                updateEmoji(index, e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`exercises.${index}.sets`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sets</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 3" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`exercises.${index}.reps`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reps</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 10" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`exercises.${index}.duration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (Optional)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Seconds" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`exercises.${index}.muscle`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Muscle Group</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select muscle group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {muscleGroups.map((group) => (
                                  <SelectItem key={group.value} value={group.value}>
                                    {group.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Workout Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
