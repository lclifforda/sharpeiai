import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { agentAPI } from "@/services/ai/agentAPI";
import { generateCryptoId } from "@/lib/idGenerator";
import { MarkdownText } from "@/components/MarkdownText";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface FormAIAssistantProps {
  currentStep: 'info' | 'documents' | 'revenue' | 'offers' | 'contract' | 'complete';
  formContext: {
    companyName?: string;
    revenue?: number;
    documentsUploaded?: number;
    selectedOffer?: {
      lender: string;
      apr: number;
      termMonths: number;
      monthlyPayment: number;
    };
  };
}

const FormAIAssistant: React.FC<FormAIAssistantProps> = ({ currentStep, formContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm here to help answer any questions about your application. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get contextual quick questions based on current step
  const getQuickQuestions = (): string[] => {
    switch (currentStep) {
      case 'info':
        return [
          "What information do I need?",
          "How long does this take?",
          "Is my data secure?"
        ];
      case 'documents':
        return [
          "What documents do I need?",
          "Why do you need these documents?",
          "Can I submit documents later?"
        ];
      case 'revenue':
        return [
          "Why do you need my revenue?",
          "How does revenue affect my rate?",
          "What if I'm not sure of the exact amount?"
        ];
      case 'offers':
        return [
          "What's APR?",
          "Lease vs Finance - which is better?",
          "How is my rate calculated?",
          "Can I change the term length?"
        ];
      case 'contract':
        return [
          "Explain payment terms",
          "What are default terms?",
          "Can I pay early?",
          "What happens after I sign?"
        ];
      case 'complete':
        return [
          "What are the next steps?",
          "When will I receive my equipment?",
          "Can I make changes to my application?"
        ];
      default:
        return [];
    }
  };

  const handleSend = async (message?: string) => {
    const textToSend = message || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: generateCryptoId(),
      role: "user",
      content: textToSend
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build context for AI
      const context = {
        currentStep,
        formData: formContext,
        cartTotal: 19200, // You can pass this as prop if needed
      };

      const response = await agentAPI.sendMessage(
        `form-assistant-${Date.now()}`,
        textToSend,
        context
      );

      const aiMessage: Message = {
        id: generateCryptoId(),
        role: "assistant",
        content: response.message
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI assistant error:", error);
      const errorMessage: Message = {
        id: generateCryptoId(),
        role: "assistant",
        content: "I'm having trouble right now. Please try asking your question again, or contact our support team."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div className="absolute -top-12 right-0 bg-foreground text-background text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Need help? Ask me anything!
          </div>
        </button>
      )}

      {/* Chat Dialog */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 animate-in fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Panel */}
          <div className="fixed top-0 right-0 h-full w-[90vw] sm:w-[550px] md:w-[600px] lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px] bg-background border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary to-blue-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Assistant</h3>
                  <p className="text-xs text-white/80">Here to help with your application</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-white/80 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 md:p-5 lg:p-6">
                <div className="space-y-4 md:space-y-5 lg:space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%] rounded-lg p-3 md:p-4 lg:p-5 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <MarkdownText 
                        content={message.content} 
                        className="text-sm md:text-base lg:text-lg"
                      />
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            <div className="px-4 py-2 border-t border-border bg-muted/30 flex-shrink-0">
              <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {getQuickQuestions().map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(question)}
                    disabled={isLoading}
                    className="px-3 py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5 text-xs md:text-sm lg:text-base border border-border rounded-lg hover:bg-accent transition-colors bg-background disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="bg-gradient-to-r from-primary to-blue-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FormAIAssistant;
