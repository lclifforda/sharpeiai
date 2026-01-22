import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Shield, Clock, Sparkles } from "lucide-react";
import bbvaLogo from "@/assets/bbva-logo.png";
import { useAiAgent } from "@/hooks/useAiAgent";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BankApplicationChat = () => {
  const initialSessionIdRef = useRef(`bank-chat-${Date.now()}`);
  const { sendMessage, isLoading, lastMessage } = useAiAgent(initialSessionIdRef.current);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome! I'm your AI financing assistant. I'll help you apply for business financing in just a few minutes. Let's start with your business name – what company are you applying for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const isTyping = isProcessing || isLoading;

  // Append AI responses from the shared AI agent
  useEffect(() => {
    if (!lastMessage || !isProcessing) return;

    setMessages(prev => [
      ...prev,
      {
        role: "assistant",
        content: lastMessage.text ?? lastMessage.message ?? "",
      },
    ]);
    setIsProcessing(false);
  }, [lastMessage, isProcessing]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    setMessages(prev => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsProcessing(true);

    try {
      await sendMessage(trimmed, {
        source: "bank-application-chat",
      });
    } catch (err) {
      setIsProcessing(false);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I ran into a problem processing that. Please try again.",
        },
      ]);
    }
  };

  const quickOptions = ["Equipment Lease", "Working Capital", "Vehicle Financing"];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 rounded-md bg-background flex items-center justify-center border border-border overflow-hidden">
              <img src={bbvaLogo} alt="BBVA" className="w-full h-full object-contain" />
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div>
              <h2 className="text-sm md:text-base font-semibold text-foreground leading-tight">
                AI-Powered Application
              </h2>
              <p className="text-xs text-muted-foreground">Fast, secure financing decisions</p>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Need help?</p>
            <p className="text-sm font-mono">800-438-1470</p>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card>
        <CardContent className="p-3 md:p-4 grid gap-3 md:grid-cols-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground">
              <Shield className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">Bank-Level Security</p>
              <p className="text-[11px] text-muted-foreground">256-bit encryption</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground">
              <Clock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">Quick Decisions</p>
              <p className="text-[11px] text-muted-foreground">As fast as 24 hours</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">AI-Assisted</p>
              <p className="text-[11px] text-muted-foreground">Personalized guidance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Card */}
      <Card className="border border-border shadow-sm">
        {/* Chat header */}
        <div className="px-4 py-3 bg-muted rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center border border-border">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-foreground">Application Copilot</p>
              <p className="text-xs text-muted-foreground">Your AI financing assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Online</span>
          </div>
        </div>

        {/* Messages area */}
        <CardContent className="p-0 rounded-b-xl bg-background border-t border-border/60">
          <div className="h-[400px] flex flex-col">
            <ScrollArea className="flex-1">
              <div className="px-6 py-4 space-y-3">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-1.5 rounded-2xl bg-muted px-3 py-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce"
                        style={{ animationDelay: "120ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce"
                        style={{ animationDelay: "240ms" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick select row */}
            <div className="border-t border-border bg-muted/40 px-4 py-3 flex flex-wrap gap-2 text-xs">
              {quickOptions.map(label => (
                <button
                  key={label}
                  className="px-3 py-1 rounded-full border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  onClick={() => {
                    setInput(label);
                    setTimeout(() => handleSend(), 0);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Input area */}
            <div className="border-t border-border bg-background px-4 py-3 space-y-2 rounded-b-xl">
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your response..."
                  className="flex-1 text-sm bg-muted/40 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="shrink-0"
                  disabled={!input.trim() || isTyping}
                  onClick={handleSend}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center">
                Your information is encrypted and secure. We never share your data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankApplicationChat;
