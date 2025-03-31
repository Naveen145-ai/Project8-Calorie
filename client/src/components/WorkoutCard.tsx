import { useState } from "react";
import { WorkoutPlan } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Info, Dumbbell, Clock, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface WorkoutCardProps {
  workoutPlan: WorkoutPlan;
  onDelete: () => void;
}

export default function WorkoutCard({ workoutPlan, onDelete }: WorkoutCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Count total exercises
  const totalExercises = [
    ...(workoutPlan.exercises.warmup || []),
    ...(workoutPlan.exercises.main || []),
    ...(workoutPlan.exercises.cooldown || [])
  ].length;

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="bg-primary/5 pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>{workoutPlan.name}</span>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </CardTitle>
          <CardDescription>
            Created on {formatDate(workoutPlan.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground mb-4">{workoutPlan.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Flame className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{workoutPlan.caloriesBurned} calories</span>
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
              {totalExercises} exercises
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="warmup">
              <AccordionTrigger>Warm Up</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {workoutPlan.exercises.warmup?.map((exercise, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span>{exercise.emoji}</span>
                      <span>{exercise.name}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="main">
              <AccordionTrigger>Main Workout</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {workoutPlan.exercises.main?.map((exercise, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span>{exercise.emoji}</span>
                      <span>{exercise.name}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="cooldown">
              <AccordionTrigger>Cool Down</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {workoutPlan.exercises.cooldown?.map((exercise, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span>{exercise.emoji}</span>
                      <span>{exercise.name}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="bg-muted/30 pt-2">
          <Button variant="ghost" className="w-full" onClick={() => setIsOpen(true)}>
            <Info className="h-4 w-4 mr-2" />
            View Full Details
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{workoutPlan.name}</DialogTitle>
            <DialogDescription>{workoutPlan.description}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center">
                <Flame className="h-4 w-4 mr-1" />
                {workoutPlan.caloriesBurned} calories
              </div>
              <div className="text-sm text-muted-foreground">
                Created on {formatDate(workoutPlan.createdAt)}
              </div>
            </div>
            
            {/* Warm Up */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-primary/5 px-4 py-3 font-semibold">
                Warm Up
              </div>
              <div className="p-4">
                {workoutPlan.exercises.warmup?.map((exercise, index) => (
                  <motion.div 
                    key={index} 
                    className="border-b last:border-0 py-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="text-2xl">{exercise.emoji}</span>
                        {exercise.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exercise.restTime}s rest
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary">
                        {exercise.sets} sets
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary">
                        {exercise.reps} reps
                      </Badge>
                      <div className="ml-auto text-xs text-muted-foreground">
                        Targets: {exercise.targetMuscles?.join(", ")}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Main Workout */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-primary/5 px-4 py-3 font-semibold">
                Main Workout
              </div>
              <div className="p-4">
                {workoutPlan.exercises.main?.map((exercise, index) => (
                  <motion.div 
                    key={index} 
                    className="border-b last:border-0 py-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="text-2xl">{exercise.emoji}</span>
                        {exercise.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exercise.restTime}s rest
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary">
                        {exercise.sets} sets
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary">
                        {exercise.reps} reps
                      </Badge>
                      <div className="ml-auto text-xs text-muted-foreground">
                        Targets: {exercise.targetMuscles?.join(", ")}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Cool Down */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-primary/5 px-4 py-3 font-semibold">
                Cool Down
              </div>
              <div className="p-4">
                {workoutPlan.exercises.cooldown?.map((exercise, index) => (
                  <motion.div 
                    key={index} 
                    className="border-b last:border-0 py-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="text-2xl">{exercise.emoji}</span>
                        {exercise.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exercise.restTime}s rest
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary">
                        {exercise.sets} sets
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary">
                        {exercise.reps} reps
                      </Badge>
                      <div className="ml-auto text-xs text-muted-foreground">
                        Targets: {exercise.targetMuscles?.join(", ")}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
