import { useState } from "react";
import { FoodEntry } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import { format } from "date-fns";

interface PDFGeneratorProps {
  foodEntry: FoodEntry;
}

export default function PDFGenerator({ foodEntry }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Create a new PDF document
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;
      
      // Add title
      pdf.setFontSize(22);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Nutrition Analysis Report", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;
      
      // Add date
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on ${format(new Date(), "MMMM d, yyyy")}`, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;
      
      // Add food name
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Food Item: ${foodEntry.name}`, 20, yPosition);
      yPosition += 15;
      
      // If there's an image, add it
      if (foodEntry.imageUrl) {
        try {
          // Create an image element to load the URL
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = foodEntry.imageUrl;
          
          // Wait for the image to load
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          
          // Add the image to the PDF
          const imgWidth = 80;
          const imgHeight = (img.height * imgWidth) / img.width;
          pdf.addImage(img, "JPEG", 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 15;
        } catch (error) {
          console.error("Failed to add image to PDF:", error);
          yPosition += 10;
        }
      }
      
      // Add macronutrients section
      pdf.setFontSize(14);
      pdf.text("Nutritional Information", 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;
      
      // Add calorie information
      pdf.setFontSize(12);
      pdf.text(`Calories: ${foodEntry.calories}`, 20, yPosition);
      yPosition += 8;
      
      // Add macronutrients
      const macros = [
        { name: "Protein", value: `${foodEntry.protein}g` },
        { name: "Carbohydrates", value: `${foodEntry.carbs}g` },
        { name: "Fats", value: `${foodEntry.fats}g` },
        { name: "Fiber", value: `${foodEntry.nutrients?.fiber || 0}g` },
        { name: "Sugar", value: `${foodEntry.nutrients?.sugar || 0}g` }
      ];
      
      macros.forEach(macro => {
        pdf.text(`${macro.name}: ${macro.value}`, 20, yPosition);
        yPosition += 7;
      });
      
      yPosition += 5;
      
      // Add vitamins section if available
      if (foodEntry.nutrients?.vitamins && Object.keys(foodEntry.nutrients.vitamins).length > 0) {
        pdf.setFontSize(14);
        pdf.text("Vitamins", 20, yPosition);
        yPosition += 8;
        
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        
        // Create two columns for vitamins
        const vitaminEntries = Object.entries(foodEntry.nutrients.vitamins);
        const midPoint = Math.ceil(vitaminEntries.length / 2);
        
        const leftColumn = vitaminEntries.slice(0, midPoint);
        const rightColumn = vitaminEntries.slice(midPoint);
        
        const startYPosition = yPosition;
        
        // Left column
        leftColumn.forEach(([vitamin, amount]) => {
          pdf.text(`${vitamin}: ${amount}mg`, 20, yPosition);
          yPosition += 6;
        });
        
        // Reset Y position for right column
        yPosition = startYPosition;
        
        // Right column
        rightColumn.forEach(([vitamin, amount]) => {
          pdf.text(`${vitamin}: ${amount}mg`, pageWidth / 2, yPosition);
          yPosition += 6;
        });
        
        // Set Y position to the end of the longer column
        yPosition = Math.max(
          startYPosition + leftColumn.length * 6,
          startYPosition + rightColumn.length * 6
        );
        
        yPosition += 5;
      }
      
      // Add minerals section if available
      if (foodEntry.nutrients?.minerals && Object.keys(foodEntry.nutrients.minerals).length > 0) {
        pdf.setFontSize(14);
        pdf.text("Minerals", 20, yPosition);
        yPosition += 8;
        
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        
        // Create two columns for minerals
        const mineralEntries = Object.entries(foodEntry.nutrients.minerals);
        const midPoint = Math.ceil(mineralEntries.length / 2);
        
        const leftColumn = mineralEntries.slice(0, midPoint);
        const rightColumn = mineralEntries.slice(midPoint);
        
        const startYPosition = yPosition;
        
        // Left column
        leftColumn.forEach(([mineral, amount]) => {
          pdf.text(`${mineral}: ${amount}mg`, 20, yPosition);
          yPosition += 6;
        });
        
        // Reset Y position for right column
        yPosition = startYPosition;
        
        // Right column
        rightColumn.forEach(([mineral, amount]) => {
          pdf.text(`${mineral}: ${amount}mg`, pageWidth / 2, yPosition);
          yPosition += 6;
        });
        
        // Set Y position to the end of the longer column
        yPosition = Math.max(
          startYPosition + leftColumn.length * 6,
          startYPosition + rightColumn.length * 6
        );
        
        yPosition += 10;
      }
      
      // Add daily value information
      pdf.setFontSize(14);
      pdf.text("Daily Value (% based on 2,000 calorie diet)", 20, yPosition);
      yPosition += 8;
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      
      const dailyValues = [
        { name: "Calories", value: `${Math.round((foodEntry.calories / 2000) * 100)}%` },
        { name: "Protein", value: `${Math.round((foodEntry.protein / 50) * 100)}%` },
        { name: "Carbohydrates", value: `${Math.round((foodEntry.carbs / 300) * 100)}%` },
        { name: "Fats", value: `${Math.round((foodEntry.fats / 65) * 100)}%` },
        { name: "Fiber", value: `${Math.round(((foodEntry.nutrients?.fiber || 0) / 28) * 100)}%` }
      ];
      
      // Create two columns for daily values
      const midPoint = Math.ceil(dailyValues.length / 2);
      
      const leftColumn = dailyValues.slice(0, midPoint);
      const rightColumn = dailyValues.slice(midPoint);
      
      const startYPosition = yPosition;
      
      // Left column
      leftColumn.forEach(item => {
        pdf.text(`${item.name}: ${item.value}`, 20, yPosition);
        yPosition += 6;
      });
      
      // Reset Y position for right column
      yPosition = startYPosition;
      
      // Right column
      rightColumn.forEach(item => {
        pdf.text(`${item.name}: ${item.value}`, pageWidth / 2, yPosition);
        yPosition += 6;
      });
      
      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Generated by Edibilize - AI Nutrition Analysis", pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, {
        align: "center"
      });
      
      // Save the PDF
      pdf.save(`${foodEntry.name.replace(/\s+/g, "_")}_nutrition_report.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Button 
      onClick={generatePDF} 
      disabled={isGenerating}
      variant="default"
    >
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Download PDF
    </Button>
  );
}