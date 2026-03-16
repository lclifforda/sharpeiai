import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X, Plus, History } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAiAgent } from "@/hooks/useAiAgent";
import { MarkdownText } from "@/components/MarkdownText";
import { useAssistantContext } from "@/contexts/AssistantContext";
import { TypingIndicator, ChatInput } from "@/components/chat";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  sessionId: string;
}

const STORAGE_KEY = "sharpei-ai-conversations";
const CURRENT_CONV_KEY = "sharpei-ai-current-conversation";
const WELCOME_MESSAGE = "Hey! I'm Sharpei AI, your equipment-financing copilot. I can help you explore your portfolio data, KPIs, working capital, vendor performance, risk metrics, and more. What would you like to know?";

const loadConversations = (): Conversation[] | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Conversation[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map(c => ({ ...c, createdAt: new Date(c.createdAt) }));
  } catch {
    return null;
  }
};

const saveConversations = (conversations: Conversation[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // Storage full or unavailable — silently ignore
  }
};

const FloatingAIChat = () => {
  const location = useLocation();
  const { pageContext } = useAssistantContext();
  const initialSessionIdRef = useRef(`floating-session-${Date.now()}`);
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { sendMessage, isLoading } = useAiAgent(initialSessionIdRef.current);

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = loadConversations();
    if (saved) return saved;
    return [{
      id: "1",
      title: "New Conversation",
      messages: [{ role: "assistant", content: WELCOME_MESSAGE }],
      createdAt: new Date(),
      sessionId: initialSessionIdRef.current,
    }];
  });

  const [currentConversationId, setCurrentConversationId] = useState(() => {
    const savedId = localStorage.getItem(CURRENT_CONV_KEY);
    const saved = loadConversations();
    if (savedId && saved?.some(c => c.id === savedId)) return savedId;
    return saved?.[0]?.id ?? "1";
  });

  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist conversations to localStorage whenever they change
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  // Persist current conversation id
  useEffect(() => {
    localStorage.setItem(CURRENT_CONV_KEY, currentConversationId);
  }, [currentConversationId]);

  const currentConversation = conversations.find(c => c.id === currentConversationId)!;
  const isActuallyProcessing = isProcessing || isLoading;

  // Auto-scroll to bottom when messages change or processing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation.messages, isActuallyProcessing]);

  const predefinedQuestions = [
    "Show me my KPIs",
    "What's my working capital this month?",
    "Show me my portfolio overview",
    "How are my vendors performing?",
    "What's my cash flow looking like?",
    "Show me risk & delinquency metrics",
  ];

  const createNewChat = () => {
    const newSessionId = `floating-session-${Date.now()}`;
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [{ role: "assistant", content: WELCOME_MESSAGE }],
      createdAt: new Date(),
      sessionId: newSessionId,
    };
    setConversations([newConversation, ...conversations]);
    setCurrentConversationId(newConversation.id);
    setShowHistory(false);
  };

  const switchConversation = (id: string) => {
    setCurrentConversationId(id);
    setShowHistory(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isActuallyProcessing) return;

    const messageText = input.trim();
    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        const newMessages = [...conv.messages, { role: "user" as const, content: messageText }];
        const newTitle = conv.messages.length === 1 ? messageText.slice(0, 30) + (messageText.length > 30 ? "..." : "") : conv.title;
        return { ...conv, messages: newMessages, title: newTitle };
      }
      return conv;
    }));
    setInput("");
    setIsProcessing(true);

    try {
      const response = await sendMessage(messageText, {
        aiType: 'portal' as const,
        conversationHistory: currentConversation.messages.slice(-5),
        currentPage: location.pathname,
        source: 'floating-chat',
        ...pageContext,
      });

      if (response) {
        setConversations(prev => prev.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, {
                role: "assistant" as const,
                content: response.text,
                suggestions: response.suggestions
              }]
            };
          }
          return conv;
        }));
      }
    } catch (error) {
      console.error('AI message failed:', error);
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, {
              role: "assistant" as const,
              content: "I apologize, but I encountered an error. Please try again."
            }]
          };
        }
        return conv;
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't show on pages that have their own embedded AI assistant
  const hiddenPaths = ["/", "/checkout", "/checkout-v2", "/application"];
  if (hiddenPaths.some(p => location.pathname === p || location.pathname.startsWith(p + "/"))) {
    return null;
  }

  return (
    <>
      {/* Floating Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 w-11 h-11 rounded-full gradient-sharpei shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
        </div>
      </button>

      {/* Chat Dialog — compact card, bottom-right */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-[320px] h-[420px] bg-background border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border gradient-sharpei flex-shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-white" />
              <span className="font-medium text-white text-xs">AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              {conversations.length > 1 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-white/80 hover:text-white transition-colors p-0.5"
                  title="Chat History"
                >
                  <History className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={createNewChat}
                className="text-white/80 hover:text-white transition-colors p-0.5"
                title="New Chat"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setIsOpen(false); setShowHistory(false); }}
                className="text-white/80 hover:text-white transition-colors p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* History dropdown (overlay, not sidebar) */}
          {showHistory && (
            <div className="absolute top-10 left-0 right-0 bg-background border-b border-border shadow-md z-10 max-h-[200px] overflow-y-auto">
              <div className="p-2 space-y-0.5">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => switchConversation(conv.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors text-xs ${
                      conv.id === currentConversationId
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="font-medium truncate">{conv.title}</p>
                    <p className="text-[10px] text-muted-foreground">{conv.messages.length} messages</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-2.5">
              <div className="space-y-2">
                {currentConversation.messages.map((message, index) => (
                  <div
                    key={index}
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
                      {message.role === "assistant" && message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setInput(suggestion);
                                setTimeout(() => handleSend(), 100);
                              }}
                              disabled={isActuallyProcessing}
                              className="px-1.5 py-0.5 text-[10px] border border-border rounded hover:bg-accent transition-colors bg-background disabled:opacity-50"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isActuallyProcessing && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollArea>

          {/* Quick questions — only on fresh conversation */}
          {currentConversation.messages.length <= 1 && (
            <div className="px-2.5 py-1.5 border-t border-border bg-muted/30 flex-shrink-0">
              <div className="flex flex-wrap gap-1">
                {predefinedQuestions.slice(0, 3).map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(question);
                      setTimeout(() => handleSend(), 100);
                    }}
                    disabled={isActuallyProcessing}
                    className="px-2 py-0.5 text-[10px] border border-border rounded hover:bg-accent transition-colors bg-background disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-2 border-t border-border flex-shrink-0">
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={handleSend}
              disabled={isActuallyProcessing}
              placeholder="Ask me anything..."
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIChat;
