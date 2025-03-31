import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, ArrowRight } from "lucide-react";

interface FoodAlternativeProps {
  name: string;
  calories: number;
  benefits: string;
}

export default function FoodAlternative({ name, calories, benefits }: FoodAlternativeProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <Badge variant="outline" className="font-normal">{calories} kcal</Badge>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Leaf className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <p>{benefits}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 p-3 flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <ArrowRight className="h-3 w-3 mr-1" />
          <span>Healthier Alternative</span>
        </div>
      </CardFooter>
    </Card>
  );
}
