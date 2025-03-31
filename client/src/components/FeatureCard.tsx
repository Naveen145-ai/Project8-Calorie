import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Camera, 
  PieChart, 
  Utensils, 
  Activity, 
  FileText, 
  RefreshCw,
  BarChart2,
  Heart,
  Zap,
  ShoppingBag,
  Calendar,
  Watch
} from "lucide-react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  // Render the appropriate icon based on the icon name
  const renderIcon = () => {
    switch (icon) {
      case "camera":
        return <Camera className="text-primary text-xl" />;
      case "pie-chart":
        return <PieChart className="text-primary text-xl" />;
      case "utensils":
        return <Utensils className="text-primary text-xl" />;
      case "activity":
        return <Activity className="text-primary text-xl" />;
      case "file-text":
        return <FileText className="text-primary text-xl" />;
      case "refresh-cw":
        return <RefreshCw className="text-primary text-xl" />;
      case "bar-chart":
        return <BarChart2 className="text-primary text-xl" />;
      case "heart":
        return <Heart className="text-primary text-xl" />;
      case "zap":
        return <Zap className="text-primary text-xl" />;
      case "shopping-bag":
        return <ShoppingBag className="text-primary text-xl" />;
      case "calendar":
        return <Calendar className="text-primary text-xl" />;
      case "watch":
        return <Watch className="text-primary text-xl" />;
      default:
        return <Camera className="text-primary text-xl" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 h-full">
        <CardContent className="p-0">
          <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            {renderIcon()}
          </div>
          <h3 className="text-xl font-bold font-montserrat mb-3">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
