import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  description: string;
  trend?: string;
  trendDirection?: "up" | "down";
}

export default function AnalyticsCard({
  title,
  value,
  unit,
  icon,
  description,
  trend,
  trendDirection = "up"
}: AnalyticsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="rounded-full bg-primary/10 p-1.5 text-primary">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold mr-1">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <div className={`flex items-center text-xs ${trendDirection === "up" ? "text-green-500" : "text-red-500"}`}>
              {trendDirection === "up" ? (
                <ArrowUp className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-0.5" />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
