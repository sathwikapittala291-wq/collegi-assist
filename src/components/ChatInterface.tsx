import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  selectedCategory: string | null;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category?: string;
}

const sampleMessages: Message[] = [
  {
    id: '1',
    type: 'bot',
    content: 'Hello! I\'m your Smart Campus Assistant. I can help you with information about schedules, facilities, dining, library services, and administrative procedures. What would you like to know?',
    timestamp: new Date(),
  }
];

const quickQuestions = [
  "What are the library hours today?",
  "Where is the nearest cafeteria?",
  "When is my next exam?",
  "How do I register for courses?",
  "What events are happening this week?"
];

export const ChatInterface = ({ selectedCategory }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      category: selectedCategory || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Show info about needing Supabase for AI functionality
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `I'd love to help you with "${inputValue}"! However, to provide real AI-powered responses and access campus database information, this application needs to be connected to Supabase for backend functionality. Once connected, I'll be able to give you detailed information about ${selectedCategory ? selectedCategory : 'campus services'}.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      toast({
        title: "Connect to Supabase",
        description: "Enable AI functionality by connecting to Supabase backend services.",
      });
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <Card className="w-full h-[600px] flex flex-col shadow-xl border-2 border-campus-primary/10">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gradient-to-r from-campus-primary/5 to-campus-secondary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-campus-primary to-campus-secondary flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Campus Assistant</h3>
              <p className="text-xs text-muted-foreground">Online • Ready to help</p>
            </div>
          </div>
          {selectedCategory && (
            <Badge variant="secondary" className="bg-campus-primary/10 text-campus-primary">
              {selectedCategory}
            </Badge>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.type === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-campus-secondary' 
                  : 'bg-gradient-to-br from-campus-primary to-campus-secondary'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-campus-primary text-white ml-auto'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-campus-primary to-campus-secondary flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-campus-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-campus-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-campus-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="p-4 border-t bg-muted/30">
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-campus-secondary" />
            Quick Questions
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs hover:bg-campus-primary/10 hover:border-campus-primary/20"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder={`Ask about ${selectedCategory || 'campus information'}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-campus-primary to-campus-secondary hover:from-campus-primary-light hover:to-campus-secondary-light shadow-lg"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};