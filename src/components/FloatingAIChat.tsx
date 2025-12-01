import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X, Send, Plus, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const FloatingAIChat = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState("1");
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "New Conversation",
      messages: [{ role: "assistant", content: "Hi! I'm your AI assistant. How can I help you today?" }],
      createdAt: new Date(),
    }
  ]);
  const [input, setInput] = useState("");

  // Don't show on AI Assistant page
  if (location.pathname === "/") {
    return null;
  }

  const currentConversation = conversations.find(c => c.id === currentConversationId)!;

  const createNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [{ role: "assistant", content: "Hi! I'm your AI assistant. How can I help you today?" }],
      createdAt: new Date(),
    };
    setConversations([newConversation, ...conversations]);
    setCurrentConversationId(newConversation.id);
    setShowHistory(false);
  };

  const switchConversation = (id: string) => {
    setCurrentConversationId(id);
    setShowHistory(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversationId) {
        const newMessages = [...conv.messages, { role: "user" as const, content: input }];
        // Update title based on first user message
        const newTitle = conv.messages.length === 1 ? input.slice(0, 30) + (input.length > 30 ? "..." : "") : conv.title;
        return { ...conv, messages: newMessages, title: newTitle };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, { 
              role: "assistant" as const, 
              content: "I'm here to help! This is a demo response. In production, this would connect to your AI backend." 
            }]
          };
        }
        return conv;
      }));
    }, 1000);
  };

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
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
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
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="gradient-sharpei hover:opacity-90 transition-opacity"
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
