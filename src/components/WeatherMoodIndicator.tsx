import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sun, Cloud, CloudRain, Snowflake, Zap, Wind } from "lucide-react";

interface WeatherMoodIndicatorProps {
  onMoodChange?: (mood: 'happy' | 'calm' | 'energetic' | 'neutral') => void;
}

interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy';
  temperature: number;
  humidity: number;
  campusActivity: 'low' | 'medium' | 'high';
}

export const WeatherMoodIndicator = ({ onMoodChange }: WeatherMoodIndicatorProps) => {
  const [weather, setWeather] = useState<WeatherData>({
    condition: 'sunny',
    temperature: 22,
    humidity: 65,
    campusActivity: 'medium'
  });
  const [currentMood, setCurrentMood] = useState<'happy' | 'calm' | 'energetic' | 'neutral'>('neutral');

  useEffect(() => {
    // Simulate weather changes
    const weatherInterval = setInterval(() => {
      const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy', 'windy'];
      const activities: WeatherData['campusActivity'][] = ['low', 'medium', 'high'];
      
      setWeather({
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        temperature: Math.floor(Math.random() * 30) + 5,
        humidity: Math.floor(Math.random() * 60) + 40,
        campusActivity: activities[Math.floor(Math.random() * activities.length)]
      });
    }, 15000);

    return () => clearInterval(weatherInterval);
  }, []);

  useEffect(() => {
    // Determine mood based on weather and campus activity
    let mood: 'happy' | 'calm' | 'energetic' | 'neutral' = 'neutral';
    
    if (weather.condition === 'sunny' && weather.campusActivity === 'high') {
      mood = 'energetic';
    } else if (weather.condition === 'rainy' || weather.condition === 'cloudy') {
      mood = 'calm';
    } else if (weather.temperature > 20 && weather.condition === 'sunny') {
      mood = 'happy';
    }

    setCurrentMood(mood);
    onMoodChange?.(mood);
  }, [weather, onMoodChange]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'snowy': return <Snowflake className="w-5 h-5 text-blue-200" />;
      case 'stormy': return <Zap className="w-5 h-5 text-purple-500" />;
      case 'windy': return <Wind className="w-5 h-5 text-teal-500" />;
      default: return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'calm': return '😌';
      case 'energetic': return '⚡';
      default: return '🙂';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-600';
      case 'calm': return 'border-blue-500/50 bg-blue-500/10 text-blue-600';
      case 'energetic': return 'border-orange-500/50 bg-orange-500/10 text-orange-600';
      default: return 'border-gray-500/50 bg-gray-500/10 text-gray-600';
    }
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-sky-500/5 to-indigo-500/5 rounded-lg border border-sky-500/20">
      <div className="flex items-center gap-2">
        {getWeatherIcon(weather.condition)}
        <span className="text-sm font-medium">{weather.temperature}°C</span>
      </div>
      
      <div className="h-4 w-px bg-border"></div>
      
      <Badge variant="outline" className={`${getMoodColor(currentMood)} border-2 transition-all duration-500`}>
        <span className="mr-1">{getMoodEmoji(currentMood)}</span>
        Campus Mood: {currentMood}
      </Badge>
      
      <div className="h-4 w-px bg-border"></div>
      
      <div className="flex items-center gap-1 text-sm">
        <div className={`w-2 h-2 rounded-full ${getActivityColor(weather.campusActivity)} animate-pulse`}></div>
        <span className="text-muted-foreground capitalize">{weather.campusActivity} Activity</span>
      </div>
    </div>
  );
};