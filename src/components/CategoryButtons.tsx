import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  MapPin, 
  UtensilsCrossed, 
  BookOpen, 
  FileText,
  Clock
} from "lucide-react";

interface CategoryButtonsProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const categories = [
  {
    id: "schedules",
    name: "Schedules",
    icon: Calendar,
    description: "Class schedules, exam timetables, and academic calendar",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "facilities",
    name: "Facilities",
    icon: MapPin,
    description: "Buildings, rooms, labs, and campus locations",
    color: "from-green-500 to-green-600"
  },
  {
    id: "dining",
    name: "Dining",
    icon: UtensilsCrossed,
    description: "Cafeterias, meal plans, and food options",
    color: "from-orange-500 to-orange-600"
  },
  {
    id: "library",
    name: "Library",
    icon: BookOpen,
    description: "Library hours, resources, and study spaces",
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "admin",
    name: "Administration",
    icon: FileText,
    description: "Procedures, forms, and administrative services",
    color: "from-red-500 to-red-600"
  },
  {
    id: "general",
    name: "General Info",
    icon: Clock,
    description: "Campus hours, events, and general information",
    color: "from-teal-500 to-teal-600"
  }
];

export const CategoryButtons = ({ selectedCategory, onSelectCategory }: CategoryButtonsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;
        
        return (
          <Card 
            key={category.id}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 ${
              isSelected 
                ? 'border-campus-primary shadow-lg shadow-campus-primary/20 scale-105' 
                : 'border-transparent hover:border-campus-primary/20'
            }`}
            onClick={() => onSelectCategory(isSelected ? null : category.id)}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md transition-transform group-hover:scale-110`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-campus-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
              
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-campus-primary/20">
                  <div className="flex items-center gap-2 text-campus-primary">
                    <div className="w-2 h-2 rounded-full bg-campus-secondary animate-pulse"></div>
                    <span className="text-sm font-medium">Selected Category</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};