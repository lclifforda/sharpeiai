import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import robotImage from "@/assets/humanoid-robot.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAiAgent } from "@/hooks/useAiAgent";

interface Message {
  role: "assistant" | "user";
  content: string;
  suggestions?: string[];
}

const AIApplicationChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state || {
    quantity: 1,
    maintenance: false,
    insurance: false,
    term: "24",
    downPayment: 299
  };

  const [sessionId] = useState(() => `session-${Date.now()}`);
  const { sendMessage, isLoading, lastMessage, isConnected } = useAiAgent(sessionId);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant here to help you complete your leasing application. I'll guide you through each step and answer any questions you have. Let's start with some basic information. What's the name of your company?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const monthlyRate = 800;
  const maintenanceCost = 150;
  const insuranceCost = 200;

  const calculateTotal = () => {
    let total = monthlyRate * orderDetails.quantity;
    if (orderDetails.maintenance) total += maintenanceCost;
    if (orderDetails.insurance) total += insuranceCost;
    return total;
  };

  // Handle AI responses from the agent
  useEffect(() => {
    if (lastMessage) {
      const aiMessage: Message = {
        role: "assistant",
        content: lastMessage.text,
        suggestions: lastMessage.suggestions
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }
  }, [lastMessage]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    try {
      // Send to real AI agent with order context
      await sendMessage(inputValue, {
        orderDetails: orderDetails,
        cartTotal: calculateTotal(),
        equipmentType: "Humanoid Robot F-02",
        equipmentValue: monthlyRate * orderDetails.quantity * parseInt(orderDetails.term)
      });
    } catch (error) {
      console.error('AI message failed:', error);
      // Add error message to chat
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI-Guided Application</h1>
          <p className="text-muted-foreground">Complete your leasing application through conversation</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardContent className="p-0 flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                      >
                        {message.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-primary-foreground" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            message.role === "assistant"
                              ? "bg-muted text-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          
                          {/* Suggestion buttons for AI messages */}
                          {message.role === "assistant" && message.suggestions && message.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {message.suggestions.map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setInputValue(suggestion)}
                                  className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-accent transition-colors bg-background"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {message.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div className="bg-muted rounded-2xl p-4">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={isProcessing}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!inputValue.trim() || isProcessing}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Same as traditional form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
                  
                  <div className="space-y-4 pb-4 border-b border-border">
                    <div className="flex gap-4">
                      <img 
                        src={robotImage} 
                        alt="Humanoid Robot"
                        className="w-20 h-20 object-contain rounded-md bg-muted"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Humanoid Robot F-02</h3>
                        <p className="text-sm text-muted-foreground">SKU: HR-F02-2024</p>
                        <p className="text-sm text-muted-foreground mt-1">Qty: {orderDetails.quantity}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 py-4 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Equipment Lease</span>
                      <span className="font-medium text-foreground">${monthlyRate * orderDetails.quantity}/mo</span>
                    </div>
                    {orderDetails.maintenance && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Maintenance Package</span>
                        <span className="font-medium text-foreground">${maintenanceCost}/mo</span>
                      </div>
                    )}
                    {orderDetails.insurance && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Insurance Coverage</span>
                        <span className="font-medium text-foreground">${insuranceCost}/mo</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Lease Term</span>
                      <span className="font-medium text-foreground">{orderDetails.term} months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Down Payment</span>
                      <span className="font-medium text-foreground">${orderDetails.downPayment}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="font-semibold text-foreground">Total Monthly Payment</span>
                      <span className="font-bold text-xl text-primary">${calculateTotal()}/mo</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIApplicationChat;
