import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles, Mic, MicOff, Volume2, VolumeX, Zap, MapPin, Wifi, Car, Clock, Users, Headphones } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VoiceWaveform } from "@/components/VoiceWaveform";

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

interface CampusStatus {
  library: { status: string; occupancy: number };
  cafeteria: { status: string; waitTime: number };
  parking: { status: string; available: number };
  wifi: { status: string; strength: number };
}

const sampleMessages: Message[] = [
  {
    id: '1',
    type: 'bot',
    content: '🎓 Hello! I\'m your Smart Campus Assistant with AI voice interaction and real-time campus data. I can help you with schedules, facilities, dining, library services, and administrative procedures. Try speaking to me or check out the live campus status above!',
    timestamp: new Date(),
  }
];

const quickQuestions = [
  "What are the library hours today?",
  "Where is the nearest cafeteria?",
  "Show me the campus map",
  "When is my next exam?",
  "How do I register for courses?",
  "What events are happening this week?"
];

export const ChatInterface = ({ selectedCategory }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCampusMap, setShowCampusMap] = useState(false);
  const [campusStatus, setCampusStatus] = useState<CampusStatus>({
    library: { status: 'open', occupancy: 67 },
    cafeteria: { status: 'open', waitTime: 8 },
    parking: { status: 'busy', available: 23 },
    wifi: { status: 'excellent', strength: 95 }
  });
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize voice features and real-time data
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        toast({
          title: "Voice Recognized",
          description: `"${transcript}"`,
        });
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try speaking again or check your microphone permissions.",
          variant: "destructive"
        });
      };
    }
    
    synthRef.current = window.speechSynthesis;
    
    // Simulate real-time campus data updates
    const interval = setInterval(() => {
      setCampusStatus(prev => ({
        ...prev,
        library: { 
          ...prev.library, 
          occupancy: Math.floor(Math.random() * 100) 
        },
        cafeteria: { 
          ...prev.cafeteria, 
          waitTime: Math.floor(Math.random() * 15) + 2 
        },
        parking: { 
          ...prev.parking, 
          available: Math.floor(Math.random() * 50) + 10 
        }
      }));
    }, 10000);
    
    return () => clearInterval(interval);
  }, [toast]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak now, I'm listening!",
      });
    }
  };

  const speakMessage = (text: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

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
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    // Enhanced AI response with voice
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `🤖 Great question about "${currentInput}"! I can see you're interested in ${selectedCategory ? selectedCategory : 'campus services'}. 

📊 Current Campus Status:
🏛️ Library: ${campusStatus.library.occupancy}% capacity
🍽️ Cafeteria: ${campusStatus.cafeteria.waitTime} min wait
🚗 Parking: ${campusStatus.parking.available} spots available
📶 WiFi: ${campusStatus.wifi.strength}% strength

To provide detailed AI-powered responses and real campus data, connect this app to Supabase for full functionality!`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      // Auto-speak the response
      speakMessage(botResponse.content.replace(/[🤖📊🏛️🍽️🚗📶]/g, ''));
      
      toast({
        title: "🚀 AI Response Ready",
        description: "Connect to Supabase for full campus database integration!",
      });
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-500';
      case 'busy': return 'text-yellow-500';
      case 'closed': return 'text-red-500';
      case 'excellent': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Real-time Campus Status Dashboard */}
      <Card className="holographic-card p-4 mb-4 neon-glow floating-3d">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-campus-secondary animate-pulse" />
            🔥 Neural Campus Status
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCampusMap(!showCampusMap)}
              className="hover:bg-campus-primary/10 holographic-card border-purple-500/30"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {showCampusMap ? '🔮 Hide Holo-Map' : '🌟 Show Holo-Map'}
            </Button>
            {isListening && <VoiceWaveform isActive={true} className="ml-2" />}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 holographic-card floating-3d border border-green-500/30">
            <Users className={`w-6 h-6 mx-auto mb-2 ${getStatusColor(campusStatus.library.status)}`} />
            <p className="text-sm font-medium">📚 Neural Library</p>
            <p className="text-xs text-muted-foreground">{campusStatus.library.occupancy}% mind-linked</p>
          </div>
          
          <div className="text-center p-3 holographic-card floating-3d border border-orange-500/30" style={{ animationDelay: '0.1s' }}>
            <Clock className={`w-6 h-6 mx-auto mb-2 ${getStatusColor(campusStatus.cafeteria.status)}`} />
            <p className="text-sm font-medium">🍽️ Quantum Cafeteria</p>
            <p className="text-xs text-muted-foreground">{campusStatus.cafeteria.waitTime} min time-warp</p>
          </div>
          
          <div className="text-center p-3 holographic-card floating-3d border border-blue-500/30" style={{ animationDelay: '0.2s' }}>
            <Car className={`w-6 h-6 mx-auto mb-2 ${getStatusColor(campusStatus.parking.status)}`} />
            <p className="text-sm font-medium">🚗 Teleport Parking</p>
            <p className="text-xs text-muted-foreground">{campusStatus.parking.available} portals</p>
          </div>
          
          <div className="text-center p-3 holographic-card floating-3d border border-purple-500/30" style={{ animationDelay: '0.3s' }}>
            <Wifi className={`w-6 h-6 mx-auto mb-2 ${getStatusColor(campusStatus.wifi.status)}`} />
            <p className="text-sm font-medium">📶 Hypernet WiFi</p>
            <p className="text-xs text-muted-foreground">{campusStatus.wifi.strength}% neural-link</p>
          </div>
        </div>

        {showCampusMap && (
          <div className="mt-4 p-4 holographic-card border border-purple-500/30">
            <div className="aspect-video bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Holographic Grid Background */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: `
                    linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              {/* Floating Map Elements */}
              <div className="text-center relative z-10">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-purple-400 floating-3d" />
                <p className="text-lg font-bold text-purple-300">🔮 Holographic Campus Map</p>
                <p className="text-sm text-purple-400/80">Connect to Supabase for full AR integration</p>
              </div>
              
              {/* Animated Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping"
                    style={{
                      left: `${20 + (i * 12)}%`,
                      top: `${30 + (i % 3) * 20}%`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Enhanced Chat Interface */}
      <Card className="w-full h-[600px] flex flex-col shadow-2xl border-2 border-purple-500/20 holographic-card neon-glow">
        {/* Chat Header with Voice Controls */}
        <div className="p-4 border-b bg-gradient-to-r from-purple-500/10 via-campus-primary/10 to-pink-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening ? 'bg-gradient-to-br from-red-500 to-pink-500 animate-pulse scale-110' :
                isSpeaking ? 'bg-gradient-to-br from-green-500 to-emerald-500 animate-pulse scale-110' :
                'bg-gradient-to-br from-campus-primary to-campus-secondary'
              }`}>
                {isListening ? <Headphones className="w-5 h-5 text-white" /> :
                 isSpeaking ? <Volume2 className="w-5 h-5 text-white" /> :
                 <Bot className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h3 className="font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  🤖 Neural Campus Assistant
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  {isListening ? (
                    <>
                      <VoiceWaveform isActive={true} className="mr-2" />
                      🎙️ Neural-linking...
                    </>
                  ) : isSpeaking ? '🔊 Transmitting knowledge...' : '🌟 Quantum-ready • Voice & Text Enhanced'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedCategory && (
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 border border-purple-500/30">
                  🎯 {selectedCategory}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={isSpeaking ? stopSpeaking : () => {}}
                className="hover:bg-purple-500/20 holographic-card border-purple-500/30"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
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
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${
                      message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    {message.type === 'bot' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakMessage(message.content)}
                        className="h-6 px-2"
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
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

        {/* Smart Quick Questions */}
        {messages.length === 1 && (
          <div className="p-4 border-t bg-muted/30">
            <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-campus-secondary animate-pulse" />
              🚀 Smart Quick Actions
            </p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs hover:bg-campus-primary/10 hover:border-campus-primary/20 transition-all hover:scale-105"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Input with Voice */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={toggleVoiceInput}
              className={`${isListening ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'hover:bg-campus-primary/10'} transition-all`}
              disabled={isTyping}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Input
              placeholder={`🎤 Ask about ${selectedCategory || 'campus information'} or click the mic...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
              disabled={isListening}
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-campus-primary to-campus-secondary hover:from-campus-primary-light hover:to-campus-secondary-light shadow-lg transition-all hover:scale-105"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};