import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { agentAPI } from "@/services/ai/agentAPI";
import { generateCryptoId } from "@/lib/idGenerator";
import { MarkdownText } from "@/components/MarkdownText";
import { TypingIndicator, ChatInput } from "@/components/chat";

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
  const sessionIdRef = useRef(`form-assistant-${Date.now()}`);
  const [isOpen, setIsOpen] = useState(false);
  const [showProactiveHint, setShowProactiveHint] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm here to help with your application. Ask me anything."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowProactiveHint(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) setShowProactiveHint(false);
  }, [isOpen]);

  const getQuickQuestions = (): string[] => {
    switch (currentStep) {
      case 'info':
        return ["What info do I need?", "Is my data secure?"];
      case 'documents':
        return ["What documents?", "Submit later?"];
      case 'revenue':
        return ["Why revenue?", "Affects my rate?"];
      case 'offers':
        return ["What's APR?", "Lease vs Finance?"];
      case 'contract':
        return ["Payment terms?", "Can I pay early?"];
      case 'complete':
        return ["Next steps?", "Make changes?"];
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
      const response = await agentAPI.sendMessage(
        sessionIdRef.current,
        textToSend,
        { aiType: 'checkout' as const, currentStep, formData: formContext, cartTotal: 19200 }
      );
      setMessages(prev => [...prev, {
        id: generateCryptoId(),
        role: "assistant",
        content: response.message
      }]);
    } catch (error) {
      console.error("AI assistant error:", error);
      setMessages(prev => [...prev, {
        id: generateCryptoId(),
        role: "assistant",
        content: "I'm having trouble right now. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bubble + Proactive Hint */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex items-end gap-2">
          {showProactiveHint && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[200px]">
              <div className="relative bg-foreground text-background text-xs px-3 py-2 rounded-lg rounded-br-sm shadow-lg">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowProactiveHint(false); }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-accent"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
                Need help? I can answer questions about your application.
              </div>
            </div>
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="w-11 h-11 rounded-full bg-gradient-to-r from-primary to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center flex-shrink-0"
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </button>
        </div>
      )}

      {/* Small chat card — anchored bottom-right */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 w-[300px] h-[360px] bg-background border border-border rounded-xl shadow-2xl z-50 flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-150 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-gradient-to-r from-primary to-blue-600 rounded-t-xl flex-shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-white" />
              <span className="font-medium text-white text-xs">AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-2.5 space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-lg px-2.5 py-1.5 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <MarkdownText content={message.content} className="text-xs" />
                  </div>
                </div>
              ))}
              {isLoading && <TypingIndicator />}
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          <div className="px-2.5 py-1.5 border-t border-border bg-muted/30 flex-shrink-0">
            <div className="flex flex-wrap gap-1">
              {getQuickQuestions().map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(question)}
                  disabled={isLoading}
                  className="px-2 py-0.5 text-[10px] border border-border rounded hover:bg-accent transition-colors bg-background disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-2 border-t border-border flex-shrink-0">
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={() => handleSend()}
              disabled={isLoading}
              placeholder="Ask a question..."
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FormAIAssistant;
