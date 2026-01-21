import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Shield, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import ilsLogo from "@/assets/ils-logo.png";
import ibercajaLogo from "@/assets/ibercaja-logo.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const BankApplicationChat = () => {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome! I'm your AI financing assistant. I'll help you apply for business financing in just a few minutes. Let's start with your business name - what company are you applying for?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentLogo = i18n.language === 'es' ? ibercajaLogo : ilsLogo;
  const logoAlt = i18n.language === 'es' ? 'Ibercaja' : 'Innovative Lease Services';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great! And what type of financing are you looking for today? Equipment lease, working capital, or vehicle financing?",
        "Perfect. How much funding do you need for your business?",
        "Thank you. Can you tell me approximately how long your business has been operating?",
        "Excellent. What's your estimated annual revenue?",
        "Almost done! I just need your business email to send you the pre-approval details.",
        "Thank you for providing all the information. Based on what you've shared, you may qualify for financing up to $150,000 with rates starting at 5.9% APR. Would you like me to connect you with a financing specialist to finalize your application?"
      ];

      const responseIndex = Math.min(messages.length - 1, responses.length - 1);
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: responses[responseIndex] || responses[responses.length - 1]
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    "Equipment Lease",
    "Working Capital",
    "Vehicle Financing"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-background to-muted rounded-xl p-6 border border-border">
        <div className="flex items-center gap-4">
          <img 
            src={currentLogo} 
            alt={logoAlt} 
            className="h-10"
          />
          <div className="h-8 w-px bg-border" />
          <div>
            <h2 className="font-semibold text-foreground">AI-Powered Application</h2>
            <p className="text-sm text-muted-foreground">Fast, secure financing decisions</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p className="text-muted-foreground">Need help?</p>
          <p className="text-primary font-medium">800-438-1470</p>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Bank-Level Security</p>
            <p className="text-xs text-muted-foreground">256-bit encryption</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Quick Decisions</p>
            <p className="text-xs text-muted-foreground">As fast as 24 hours</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">AI-Assisted</p>
            <p className="text-xs text-muted-foreground">Personalized guidance</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="border-2">
        <CardContent className="p-0">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Application Copilot</h3>
              <p className="text-sm text-muted-foreground">Your AI financing assistant</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(action);
                    }}
                    className="px-3 py-1.5 text-sm border border-border rounded-full hover:bg-accent transition-colors bg-background"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response..."
                disabled={isTyping}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Your information is encrypted and secure. We never share your data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankApplicationChat;
