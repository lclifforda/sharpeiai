import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X, Send, Plus, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAiAgent } from "@/hooks/useAiAgent";

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

const FloatingAIChat = () => {
  const location = useLocation();
  const initialSessionIdRef = useRef(`floating-session-${Date.now()}`);
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState("1");
  const { sendMessage, isLoading, lastMessage, isConnected } = useAiAgent(initialSessionIdRef.current);
  const [conversations, setConversations] = useState<Conversation[]>(() => [
    {
      id: "1",
      title: "New Conversation",
      messages: [{ role: "assistant", content: "Hi! I'm your AI assistant. How can I help you today?" }],
      createdAt: new Date(),
      sessionId: initialSessionIdRef.current,
    }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const currentConversation = conversations.find(c => c.id === currentConversationId)!;

  // Handle AI responses
  useEffect(() => {
    if (lastMessage && !isProcessing) {
      return;
    }
    if (lastMessage && isProcessing) {
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, { 
              role: "assistant" as const, 
              content: lastMessage.text,
              suggestions: lastMessage.suggestions
            }]
          };
        }
        return conv;
      }));
      setIsProcessing(false);
    }
  }, [lastMessage, isProcessing, currentConversationId]); // eslint-disable-line react-hooks/exhaustive-deps

  const createNewChat = () => {
    const newSessionId = `floating-session-${Date.now()}`;
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [{ role: "assistant", content: "Hi! I'm your AI assistant. How can I help you today?" }],
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
    if (!input.trim() || isProcessing) return;
    
    const messageText = input;
    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversationId) {
        const newMessages = [...conv.messages, { role: "user" as const, content: messageText }];
        // Update title based on first user message
        const newTitle = conv.messages.length === 1 ? messageText.slice(0, 30) + (messageText.length > 30 ? "..." : "") : conv.title;
        return { ...conv, messages: newMessages, title: newTitle };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setInput("");
    setIsProcessing(true);
    
    try {
      // Send to real AI agent
      const currentSession = conversations.find(c => c.id === currentConversationId);
      await sendMessage(messageText, {
        conversationHistory: currentConversation.messages.slice(-5), // Last 5 messages for context
        source: 'floating-chat'
      });
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
      setIsProcessing(false);
    }
  };

  // Don't show on AI Assistant page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <>
      {/* Floating Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full gradient-sharpei shadow-elegant hover:shadow-glow transition-all duration-300 flex items-center justify-center z-50 group"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
        </div>
      </button>

      {/* Chat Dialog */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-background border border-border rounded-lg shadow-2xl z-50 flex">
          {/* History Sidebar */}
          {showHistory && (
            <div className="w-64 border-r border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground mb-2">Chat History</h3>
                <Button
                  onClick={createNewChat}
                  size="sm"
                  className="w-full gradient-sharpei hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => switchConversation(conv.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        conv.id === currentConversationId
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm font-medium truncate">{conv.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {conv.messages.length} messages
                      </p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border gradient-sharpei">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <h3 className="font-semibold text-white">AI Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-white hover:text-white/80 transition-colors p-1"
                  title="Chat History"
                >
                  <History className="w-5 h-5" />
                </button>
                <button
                  onClick={createNewChat}
                  className="text-white hover:text-white/80 transition-colors p-1"
                  title="New Chat"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentConversation.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {/* Suggestion buttons for AI messages */}
                      {message.role === "assistant" && message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInput(suggestion)}
                              className="px-2 py-1 text-xs border border-border rounded hover:bg-accent transition-colors bg-background"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isProcessing && (
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
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="min-h-[60px] resize-none"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="gradient-sharpei hover:opacity-90 transition-opacity"
                  disabled={!input.trim() || isProcessing}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIChat;
