import { ChatInterface } from "@/components/ChatInterface";
import { CategoryButtons } from "@/components/CategoryButtons";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ARCampusPreview } from "@/components/ARCampusPreview";
import { WeatherMoodIndicator } from "@/components/WeatherMoodIndicator";
import { GestureHandler } from "@/components/GestureHandler";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showARPreview, setShowARPreview] = useState(false);
  const [currentMood, setCurrentMood] = useState<'happy' | 'calm' | 'energetic' | 'neutral'>('neutral');
  const { toast } = useToast();

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setShowARPreview(true);
    }
  };

  const handleGestureSwipeLeft = () => {
    setShowARPreview(false);
  };

  const handleGestureSwipeRight = () => {
    setShowARPreview(true);
  };

  const handleGestureDoubleTap = () => {
    setSelectedCategory(null);
    setShowARPreview(false);
  };

  return (
    <GestureHandler
      onSwipeLeft={handleGestureSwipeLeft}
      onSwipeRight={handleGestureSwipeRight}
      onDoubleTap={handleGestureDoubleTap}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Dynamic Particle Background */}
      <ParticleBackground mood={currentMood} className="z-0" />
      
      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-transparent pointer-events-none z-10"></div>
      
      <div className={`relative z-20 min-h-screen transition-all duration-1000 ${
        currentMood === 'happy' ? 'mood-shift-happy' : 
        currentMood === 'calm' ? 'mood-shift-calm' :
        currentMood === 'energetic' ? 'mood-shift-energetic' : ''
      }`}>
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section with Holographic Effects */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full blur-3xl"></div>
            <div className="relative holographic-card p-8 mb-8 floating-3d">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-campus-primary via-campus-secondary to-purple-500 bg-clip-text text-transparent animate-pulse">
                🚀 Smart Campus Assistant
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-6">
                🎤 Voice-Powered • 🔮 AR Navigation • ⚡ Real-Time Intelligence
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
                  🎯 Gesture Controls Active
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full border border-blue-500/30">
                  🌊 Voice Waveforms
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full border border-green-500/30">
                  🔮 Holographic UI
                </span>
              </div>
            </div>
          </div>

          {/* Weather Mood Indicator */}
          <div className="mb-6">
            <WeatherMoodIndicator onMoodChange={setCurrentMood} />
          </div>

          {/* AR Campus Preview */}
          <ARCampusPreview 
            selectedCategory={selectedCategory}
            isVisible={showARPreview}
          />

          {/* Category Selection with Holographic Effects */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-campus-primary to-campus-secondary bg-clip-text text-transparent">
                🎯 Choose Your Campus Service
              </h2>
              <p className="text-muted-foreground">
                ✨ Swipe left/right to navigate • Double tap to reset
              </p>
            </div>
            <CategoryButtons 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategorySelect}
            />
          </div>

          {/* Enhanced Chat Interface */}
          <ChatInterface selectedCategory={selectedCategory} />

          {/* Holographic Footer */}
          <div className="mt-12 text-center holographic-card p-6">
            <p className="text-sm text-muted-foreground mb-2">
              🚀 Experience the future of campus assistance
            </p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>🎤 AI Voice Interaction</span>
              <span>•</span>
              <span>🔮 Augmented Reality</span>
              <span>•</span>
              <span>⚡ Real-Time Data</span>
              <span>•</span>
              <span>🎯 Smart Gestures</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-campus-primary/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-campus-secondary/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full filter blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </GestureHandler>
  );
};

export default Index;