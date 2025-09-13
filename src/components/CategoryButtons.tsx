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
            className={`group cursor-pointer transition-all duration-500 hover:shadow-xl hover:scale-105 border-2 holographic-card floating-3d ${
              isSelected 
                ? 'border-purple-500 shadow-2xl shadow-purple-500/30 scale-105 neon-glow' 
                : 'border-transparent hover:border-purple-500/30'
            }`}
            onClick={() => onSelectCategory(isSelected ? null : category.id)}
            style={{ animationDelay: `${category.id === 'schedules' ? '0' : category.id === 'facilities' ? '0.1' : category.id === 'dining' ? '0.2' : category.id === 'library' ? '0.3' : category.id === 'admin' ? '0.4' : '0.5'}s` }}
          >
            <div className="p-6 relative overflow-hidden">
              {/* Holographic Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="flex items-start gap-4 relative z-10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 neon-glow`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                    🚀 {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-purple-300 transition-colors duration-300">
                    {category.description}
                  </p>
                </div>
              </div>
              
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-purple-500/30 relative">
                  <div className="flex items-center gap-3 text-purple-400">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
                    <span className="text-sm font-bold">🎯 Neural-Link Active</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                  </div>
                  
                  {/* Status Indicators */}
                  <div className="mt-2 flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-green-400">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      Online
                    </span>
                    <span className="flex items-center gap-1 text-blue-400">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                      AR Ready
                    </span>
                    <span className="flex items-center gap-1 text-purple-400">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                      Voice Active
                    </span>
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