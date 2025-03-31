import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Camera, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface FoodUploadProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (result: any) => void;
}

export default function FoodUpload({ onAnalysisStart, onAnalysisComplete }: FoodUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const analyzeFoodMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/food/analyze', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze food');
      }
      
      return response.json();
    },
    onMutate: () => {
      onAnalysisStart();
    },
    onSuccess: (data) => {
      onAnalysisComplete(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
      onAnalysisComplete(null);
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleAnalyzeClick = () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload a food image first",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append('image', selectedImage);
    analyzeFoodMutation.mutate(formData);
  };
  
  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={previewUrl} 
            alt="Food preview" 
            className="w-full h-auto aspect-video object-cover"
          />
          <button 
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center 
            hover:border-primary/50 transition-colors cursor-pointer bg-neutral-50"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Camera className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium mb-1">Upload Food Image</p>
          <p className="text-xs text-muted-foreground mb-3">
            Click to browse or drag and drop
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <Upload className="h-4 w-4 mr-1" />
            Select Image
          </Button>
        </div>
      )}
      
      <Button 
        className="w-full" 
        onClick={handleAnalyzeClick}
        disabled={!selectedImage || analyzeFoodMutation.isPending}
      >
        {analyzeFoodMutation.isPending ? 'Analyzing...' : 'Analyze Food'}
      </Button>
    </div>
  );
}
