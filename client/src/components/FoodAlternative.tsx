import { ArrowDown } from "lucide-react";

interface FoodAlternativeProps {
  name: string;
  calories: number;
  benefits: string;
}

export default function FoodAlternative({ name, calories, benefits }: FoodAlternativeProps) {
  return (
    <div className="flex flex-col md:flex-row items-start gap-4">
      <div className="bg-primary/10 p-3 rounded-lg text-center flex-shrink-0 w-full md:w-36">
        <h4 className="font-semibold text-lg">{name}</h4>
        <div className="flex items-center justify-center gap-2 mt-2">
          <ArrowDown className="h-4 w-4 text-green-600" />
          <p className="text-xl font-bold">{calories}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">calories</p>
      </div>
      
      <div className="w-full">
        <h4 className="font-medium mb-1">Benefits</h4>
        <p className="text-sm text-muted-foreground">{benefits}</p>
      </div>
    </div>
  );
}