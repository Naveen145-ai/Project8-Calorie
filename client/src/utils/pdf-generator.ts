import { jsPDF } from "jspdf";
import type { FoodEntry, MealPlan, WorkoutPlan } from "@shared/schema";

// Define PDF generation options
interface PDFOptions {
  title: string;
  subtitle: string;
  includeLogo: boolean;
  includeTimestamp: boolean;
}

export async function generatePDF(
  data: {
    foodEntries?: FoodEntry[];
    mealPlans?: MealPlan[];
    workoutPlans?: WorkoutPlan[];
  },
  type: string = "all"
): Promise<Blob> {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set options based on type
  const options: PDFOptions = {
    title: "NutriScan Health Report",
    subtitle: type === "all" 
      ? "Complete Health Summary" 
      : `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
    includeLogo: true,
    includeTimestamp: true,
  };

  // Add header
  addHeader(doc, options);
  
  // Add content based on type
  const startY = 40;
  let currentY = startY;
  
  if (type === "food" || type === "all") {
    if (data.foodEntries && data.foodEntries.length > 0) {
      currentY = addFoodEntries(doc, data.foodEntries, currentY);
    } else {
      doc.setFontSize(12);
      doc.text("No food entries available", 20, currentY);
      currentY += 10;
    }
  }
  
  if (type === "meals" || type === "all") {
    if (currentY > 240) { // Add a new page if we're close to the bottom
      doc.addPage();
      currentY = startY;
    }
    
    if (data.mealPlans && data.mealPlans.length > 0) {
      currentY = addMealPlans(doc, data.mealPlans, currentY);
    } else if (type === "meals") {
      doc.setFontSize(12);
      doc.text("No meal plans available", 20, currentY);
      currentY += 10;
    }
  }
  
  if (type === "workouts" || type === "all") {
    if (currentY > 240) { // Add a new page if we're close to the bottom
      doc.addPage();
      currentY = startY;
    }
    
    if (data.workoutPlans && data.workoutPlans.length > 0) {
      currentY = addWorkoutPlans(doc, data.workoutPlans, currentY);
    } else if (type === "workouts") {
      doc.setFontSize(12);
      doc.text("No workout plans available", 20, currentY);
      currentY += 10;
    }
  }
  
  // Add footer
  addFooter(doc);
  
  // Return the PDF as a blob
  return doc.output("blob");
}

function addHeader(doc: jsPDF, options: PDFOptions): void {
  // Add logo placeholder
  if (options.includeLogo) {
    doc.setFillColor(76, 175, 80); // Primary green color
    doc.circle(20, 20, 5, "F");
    
    // Add a leaf-like shape
    doc.setFillColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.ellipse(20, 20, 2, 3, "F");
  }
  
  // Add title and subtitle
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(options.title, 30, 20);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(options.subtitle, 30, 28);
  
  // Add timestamp if requested
  if (options.includeTimestamp) {
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${formattedDate}`, 150, 20, { align: "right" });
    doc.setTextColor(0, 0, 0);
  }
  
  // Add a horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 32, 190, 32);
}

function addFooter(doc: jsPDF): void {
  const totalPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Add page number
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" });
    
    // Add copyright
    doc.text("© NutriScan. AI-powered nutrition and fitness platform.", 20, 285);
    
    // Add a horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 280, 190, 280);
  }
}

function addFoodEntries(doc: jsPDF, entries: FoodEntry[], startY: number): number {
  let y = startY;
  
  // Add section header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Food Entries", 20, y);
  y += 8;
  
  // Add table header
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Food Item", 20, y);
  doc.text("Calories", 100, y);
  doc.text("Protein", 125, y);
  doc.text("Carbs", 150, y);
  doc.text("Fat", 175, y);
  y += 5;
  
  // Add a line below header
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, 190, y);
  y += 5;
  
  // Add entries
  doc.setFont("helvetica", "normal");
  entries.slice(0, 15).forEach((entry) => {
    // Check if we need a new page
    if (y > 270) {
      doc.addPage();
      y = 40;
      
      // Add table header on new page
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Food Item", 20, y);
      doc.text("Calories", 100, y);
      doc.text("Protein", 125, y);
      doc.text("Carbs", 150, y);
      doc.text("Fat", 175, y);
      y += 5;
      
      // Add a line below header
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, 190, y);
      y += 5;
      
      doc.setFont("helvetica", "normal");
    }
    
    doc.text(entry.foodName || "Unknown", 20, y);
    doc.text(`${entry.calories || 0} kcal`, 100, y);
    doc.text(`${entry.protein || 0}g`, 125, y);
    doc.text(`${entry.carbs || 0}g`, 150, y);
    doc.text(`${entry.fat || 0}g`, 175, y);
    
    y += 7;
  });
  
  // If there are more entries than displayed
  if (entries.length > 15) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`... and ${entries.length - 15} more entries`, 20, y);
    y += 7;
  }
  
  y += 5;
  
  return y;
}

function addMealPlans(doc: jsPDF, plans: MealPlan[], startY: number): number {
  let y = startY;
  
  // Add section header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Meal Plans", 20, y);
  y += 10;
  
  // Add plans
  plans.slice(0, 3).forEach((plan, index) => {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = 40;
    }
    
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(plan.name, 20, y);
    y += 6;
    
    if (plan.description) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(plan.description, 20, y);
      y += 6;
    }
    
    // Parse meals
    try {
      const meals = JSON.parse(plan.meals as string);
      if (Array.isArray(meals) && meals.length > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(`Contains ${meals.length} meal${meals.length > 1 ? 's' : ''}`, 20, y);
        y += 6;
        
        // Add meal details for the first 3 meals
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        meals.slice(0, 3).forEach((meal: any) => {
          if (y > 270) {
            doc.addPage();
            y = 40;
          }
          
          doc.setFont("helvetica", "bold");
          doc.text(`• ${meal.name || 'Unnamed Meal'} (${meal.type || 'meal'})`, 25, y);
          y += 5;
          
          if (meal.description) {
            doc.setFont("helvetica", "normal");
            doc.text(meal.description, 30, y);
            y += 5;
          }
          
          // Add meal nutrition if available
          if (meal.calories || meal.protein || meal.carbs || meal.fat) {
            doc.setFont("helvetica", "normal");
            let nutritionText = "";
            if (meal.calories) nutritionText += `${meal.calories} kcal, `;
            if (meal.protein) nutritionText += `${meal.protein}g protein, `;
            if (meal.carbs) nutritionText += `${meal.carbs}g carbs, `;
            if (meal.fat) nutritionText += `${meal.fat}g fat`;
            
            // Remove trailing comma and space
            if (nutritionText.endsWith(", ")) {
              nutritionText = nutritionText.slice(0, -2);
            }
            
            doc.text(nutritionText, 30, y);
            y += 5;
          }
        });
        
        if (meals.length > 3) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          doc.text(`... and ${meals.length - 3} more meals`, 25, y);
          y += 5;
        }
      }
    } catch (error) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Error parsing meal data", 20, y);
      y += 5;
    }
    
    // Add separator between plans
    if (index < plans.length - 1 && index < 2) {
      y += 3;
      doc.setDrawColor(220, 220, 220);
      doc.line(20, y, 190, y);
      y += 8;
    }
  });
  
  // If there are more plans than displayed
  if (plans.length > 3) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`... and ${plans.length - 3} more meal plans`, 20, y);
    y += 7;
  }
  
  y += 5;
  
  return y;
}

function addWorkoutPlans(doc: jsPDF, plans: WorkoutPlan[], startY: number): number {
  let y = startY;
  
  // Add section header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Workout Plans", 20, y);
  y += 10;
  
  // Add plans
  plans.slice(0, 3).forEach((plan, index) => {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = 40;
    }
    
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(plan.name, 20, y);
    y += 6;
    
    if (plan.description) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(plan.description, 20, y);
      y += 6;
    }
    
    // Add calories
    if (plan.estimatedCalories) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Estimated calories: ${plan.estimatedCalories} kcal`, 20, y);
      y += 6;
    }
    
    // Parse exercises
    try {
      const workoutData = JSON.parse(plan.exercises as string);
      if (workoutData && workoutData.exercises && Array.isArray(workoutData.exercises)) {
        const exercises = workoutData.exercises;
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(`Contains ${exercises.length} exercise${exercises.length > 1 ? 's' : ''}`, 20, y);
        y += 6;
        
        // Add difficulty and duration if available
        if (workoutData.difficulty || workoutData.duration) {
          doc.setFont("helvetica", "normal");
          let metaText = "";
          if (workoutData.difficulty) metaText += `Difficulty: ${workoutData.difficulty}, `;
          if (workoutData.duration) metaText += `Duration: ${workoutData.duration} min`;
          
          // Remove trailing comma and space
          if (metaText.endsWith(", ")) {
            metaText = metaText.slice(0, -2);
          }
          
          doc.text(metaText, 20, y);
          y += 6;
        }
        
        // Add exercise details for the first 5 exercises
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        exercises.slice(0, 5).forEach((exercise: any) => {
          if (y > 270) {
            doc.addPage();
            y = 40;
          }
          
          doc.setFont("helvetica", "bold");
          const emoji = exercise.emoji || "💪";
          doc.text(`• ${emoji} ${exercise.name || 'Unnamed Exercise'}`, 25, y);
          y += 5;
          
          doc.setFont("helvetica", "normal");
          let detailText = "";
          if (exercise.sets && exercise.reps) {
            detailText += `${exercise.sets} sets × ${exercise.reps} reps`;
          }
          if (exercise.duration) {
            if (detailText) detailText += ", ";
            detailText += `${exercise.duration} seconds`;
          }
          if (exercise.muscle) {
            if (detailText) detailText += " | ";
            detailText += `Muscle group: ${exercise.muscle}`;
          }
          
          if (detailText) {
            doc.text(detailText, 30, y);
            y += 5;
          }
        });
        
        if (exercises.length > 5) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          doc.text(`... and ${exercises.length - 5} more exercises`, 25, y);
          y += 5;
        }
      }
    } catch (error) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Error parsing workout data", 20, y);
      y += 5;
    }
    
    // Add separator between plans
    if (index < plans.length - 1 && index < 2) {
      y += 3;
      doc.setDrawColor(220, 220, 220);
      doc.line(20, y, 190, y);
      y += 8;
    }
  });
  
  // If there are more plans than displayed
  if (plans.length > 3) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`... and ${plans.length - 3} more workout plans`, 20, y);
    y += 7;
  }
  
  y += 5;
  
  return y;
}
