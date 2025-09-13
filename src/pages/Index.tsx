import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { CategoryButtons } from "@/components/CategoryButtons";
import { Button } from "@/components/ui/button";
import { MessageSquare, GraduationCap } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-campus-primary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-campus-primary to-campus-secondary flex items-center justify-center shadow-lg shadow-campus-primary/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Smart Campus Assistant</h1>
                <p className="text-sm text-muted-foreground">Your AI-powered campus guide</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Help
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-campus-primary to-campus-secondary flex items-center justify-center shadow-xl shadow-campus-primary/20">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-campus-primary to-campus-secondary bg-clip-text text-transparent">
            How can I help you today?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant answers about schedules, facilities, dining options, library services, and administrative procedures.
          </p>
        </div>

        {/* Category Buttons */}
        <CategoryButtons 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto mt-8">
          <ChatInterface selectedCategory={selectedCategory} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Smart Campus Assistant - Powered by AI</p>
            <p className="mt-2">Available 24/7 to help with your campus queries</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;