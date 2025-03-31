import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ImageUploaderProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
}

export default function ImageUploader({ onFileSelected, isUploading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a preview
    createPreview(file);
    
    // Send to parent
    onFileSelected(file);
  };

  const createPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    
    // Create a preview
    createPreview(file);
    
    // Send to parent
    onFileSelected(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const captureImage = () => {
    // This triggers the file input with capture="camera"
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "camera");
      fileInputRef.current.click();
      // Remove the attribute after click to allow normal uploads too
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.removeAttribute("capture");
        }
      }, 500);
    }
  };

  return (
    <div className="w-full">
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="food-image-upload"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
        } transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Analyzing your food image...</p>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-md overflow-hidden mx-auto max-w-md">
              <motion.img
                src={preview}
                alt="Food preview"
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={triggerFileInput}>
                <Upload className="mr-2 h-4 w-4" />
                Change Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <ImageIcon className="h-10 w-10 text-muted-foreground/80 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Drag and drop your food image, or use the buttons below
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button onClick={captureImage} className="flex-1">
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
              <Button variant="outline" onClick={triggerFileInput} className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
