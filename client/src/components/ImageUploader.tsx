import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Camera, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
}

export default function ImageUploader({ onFileSelected, isUploading }: ImageUploaderProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Handle file from drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Process the selected file
  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file (jpg, png, etc.)');
      return;
    }
    
    // Create preview
    createPreview(file);
    
    // Pass file to parent component
    onFileSelected(file);
  };

  // Create image preview
  const createPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Clear selected image
  const clearImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(active);
  };

  return (
    <div className="w-full">
      {previewImage ? (
        <div className="relative">
          <Card className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={previewImage}
                alt="Food preview"
                className="w-full h-full object-cover"
              />
              
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-white flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>Analyzing image...</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {!isUploading && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:bg-muted/50"
          )}
          onDragEnter={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          onDragOver={(e) => handleDrag(e, true)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
            disabled={isUploading}
          />
          
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Upload an image</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop an image, or click the buttons below
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                      const tracks = stream.getTracks();
                      tracks.forEach((track) => track.stop());
                      
                      // This would normally trigger the camera API
                      // For simplicity, we just trigger the file upload
                      fileInputRef.current?.click();
                    }).catch((error) => {
                      console.error("Camera access error:", error);
                      alert("Could not access camera. Please check your settings and try again.");
                    });
                  } else {
                    alert("Your browser does not support camera access. Please use the upload button instead.");
                  }
                }}
                disabled={isUploading}
                className="flex gap-2"
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {!previewImage && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Supported formats: JPEG, PNG, WebP • Max size: 5MB
        </p>
      )}
    </div>
  );
}