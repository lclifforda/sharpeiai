import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Paperclip,
  RefreshCw,
  FilePlus,
  Plus,
  Home,
  History,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  BarChart3,
  ClipboardList,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import SharpeiOrb from "@/components/SharpeiOrb";
import QuickActionCard from "@/components/QuickActionCard";
import LeaseQuoteDialog from "@/components/LeaseQuoteDialog";
import RenewalOfferDialog from "@/components/RenewalOfferDialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAiAgent } from "@/hooks/useAiAgent";
import { MarkdownText } from "@/components/MarkdownText";
import { getStoredApplications } from "@/lib/applicationStorage";
import { getStoredCustomers } from "@/lib/customerStorage";

// ── Conversation persistence ──────────────────────────────────────────
const STORAGE_KEY = "sharpei-index-conversations";
const CURRENT_KEY = "sharpei-index-current";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  sessionId: string;
}

const loadConversations = (): Conversation[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveConversations = (conversations: Conversation[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // silently ignore
  }
};

// ── Suggested questions ───────────────────────────────────────────────
const suggestedQuestions = [
  { label: "Portfolio KPIs", prompt: "Show me my portfolio KPIs and key metrics for this month.", icon: BarChart3 },
  { label: "Vendor performance", prompt: "Show me the top performing vendors by volume, approval rates, and delinquency scores.", icon: TrendingUp },
  { label: "Risk metrics", prompt: "Show me risk and delinquency metrics including vendor risk flags and credit risk distribution.", icon: ShieldAlert },
  { label: "Pipeline status", prompt: "Show me my application pipeline status including applications that need follow-up.", icon: ClipboardList },
  { label: "Active leases", prompt: "Show me my active leases and contracts.", icon: RefreshCw },
  { label: "Portfolio overview", prompt: "Give me a portfolio overview.", icon: BarChart3 },
];

// ── Alert types ───────────────────────────────────────────────────────
interface AlertItem {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
  prompt: string;
}

// ── Component ─────────────────────────────────────────────────────────
const Index = () => {
  const [isLeaseQuoteOpen, setIsLeaseQuoteOpen] = useState(false);
  const [isRenewalOfferOpen, setIsRenewalOfferOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conversation state
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [currentConvId, setCurrentConvId] = useState<string | null>(() => {
    const saved = localStorage.getItem(CURRENT_KEY);
    const convs = loadConversations();
    if (saved && convs.some(c => c.id === saved)) return saved;
    return null; // null = home mode
  });

  const currentConversation = conversations.find(c => c.id === currentConvId) ?? null;
  const chatMessages = currentConversation?.messages ?? [];
  const hasActiveChat = currentConvId !== null && chatMessages.length > 0;

  // Session ID tracks current conversation for the AI hook
  const sessionIdRef = useRef(currentConversation?.sessionId ?? `index-session-${Date.now()}`);
  const { sendMessage, isLoading, lastMessage } = useAiAgent(sessionIdRef.current);

  // Persist conversations
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  // Persist current conversation id
  useEffect(() => {
    if (currentConvId) {
      localStorage.setItem(CURRENT_KEY, currentConvId);
    } else {
      localStorage.removeItem(CURRENT_KEY);
    }
  }, [currentConvId]);

  // Build dynamic alerts from localStorage
  const alerts = useMemo<AlertItem[]>(() => {
    const items: AlertItem[] = [];
    const storedApps = getStoredApplications();
    const storedCustomers = getStoredCustomers();

    const actionableApps = storedApps.filter(a =>
      a.status === "incomplete" || a.status === "unqualified" || a.status === "submitted"
    );
    if (actionableApps.length > 0) {
      items.push({
        icon: <ClipboardList className="w-4 h-4" />,
        label: actionableApps.length === 1 ? "application needs follow-up" : "applications need follow-up",
        count: actionableApps.length,
        color: "text-orange-600 bg-orange-50 border-orange-200",
        prompt: "Review my applications that need attention and recommend next steps for each.",
      });
    }

    const inactiveCustomers = storedCustomers.filter(c => c.status === "inactive");
    if (inactiveCustomers.length > 0) {
      items.push({
        icon: <Users className="w-4 h-4" />,
        label: inactiveCustomers.length === 1 ? "inactive customer" : "inactive customers",
        count: inactiveCustomers.length,
        color: "text-slate-600 bg-slate-50 border-slate-200",
        prompt: "Review my inactive customers and suggest re-engagement strategies.",
      });
    }

    const declinedApps = storedApps.filter(a => a.status === "declined");
    if (declinedApps.length > 0) {
      items.push({
        icon: <ShieldAlert className="w-4 h-4" />,
        label: declinedApps.length === 1 ? "declined application" : "declined applications",
        count: declinedApps.length,
        color: "text-rose-600 bg-rose-50 border-rose-200",
        prompt: "Review my declined applications — should any be reconsidered?",
      });
    }

    const weakApps = storedApps.filter(a => a.aiSummary?.recommendation === "weak");
    if (weakApps.length > 0) {
      items.push({
        icon: <AlertTriangle className="w-4 h-4" />,
        label: weakApps.length === 1 ? "weak AI assessment" : "weak AI assessments",
        count: weakApps.length,
        color: "text-amber-600 bg-amber-50 border-amber-200",
        prompt: "Review applications flagged with a weak AI assessment and explain the risk factors.",
      });
    }

    return items;
  }, []);

  // Helper: create or get current conversation, add user message, return conv id
  const ensureConversation = useCallback((message: string): string => {
    if (currentConvId && conversations.some(c => c.id === currentConvId)) {
      // Append to existing
      setConversations(prev => prev.map(c => {
        if (c.id !== currentConvId) return c;
        return { ...c, messages: [...c.messages, { role: "user", content: message }] };
      }));
      return currentConvId;
    }
    // Create new
    const newSessionId = `index-session-${Date.now()}`;
    const newId = Date.now().toString();
    const title = message.length > 40 ? message.slice(0, 40) + "…" : message;
    const newConv: Conversation = {
      id: newId,
      title,
      messages: [{ role: "user", content: message }],
      createdAt: new Date().toISOString(),
      sessionId: newSessionId,
    };
    sessionIdRef.current = newSessionId;
    setConversations(prev => [newConv, ...prev]);
    setCurrentConvId(newId);
    return newId;
  }, [currentConvId, conversations]);

  // Append assistant message to a conversation
  const appendAssistantMessage = useCallback((convId: string, content: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      return { ...c, messages: [...c.messages, { role: "assistant", content }] };
    }));
  }, []);

  const sendQuickPrompt = async (message: string) => {
    const convId = ensureConversation(message);
    try {
      await sendMessage(message, {
        aiType: 'portal' as const,
        source: 'index-chat',
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      appendAssistantMessage(convId, 'Sorry, I could not process that request right now. Please try again.');
    }
  };

  // Handle AI responses
  useEffect(() => {
    if (lastMessage && currentConvId) {
      appendAssistantMessage(currentConvId, lastMessage.text);
    }
  }, [lastMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    const message = chatInput.trim();
    setChatInput("");
    const convId = ensureConversation(message);
    try {
      await sendMessage(message, {
        aiType: 'portal' as const,
        source: 'index-chat',
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      appendAssistantMessage(convId, 'Sorry, I encountered an error. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setCurrentConvId(null);
    setChatInput("");
  };

  const handleSwitchConversation = (convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      sessionIdRef.current = conv.sessionId;
      setCurrentConvId(convId);
    }
  };

  const [showHistory, setShowHistory] = useState(false);

  return <div className="h-screen bg-background flex overflow-hidden">
      {/* Left Sidebar Menu */}
      <div className="w-64 border-r border-border bg-white flex flex-col flex-shrink-0">
        <div className="p-4">
          <Button
            variant="ghost"
            onClick={handleNewChat}
            className="w-full justify-start gap-2 border border-transparent bg-gradient-to-r from-gradient-start to-gradient-end bg-origin-border p-[1px] hover:shadow-glow transition-all"
          >
            <span className="w-full flex items-center gap-2 bg-background px-3 py-2 rounded-[calc(0.5rem-1px)]">
              <Plus className="w-4 h-4 text-gradient-start" />
              New Chat
            </span>
          </Button>
        </div>

        <nav className="px-2 space-y-1">
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
              !hasActiveChat ? 'text-foreground bg-accent' : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
              showHistory ? 'text-foreground bg-accent' : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            <div className="flex items-center gap-3">
              <History className="w-4 h-4 flex-shrink-0" />
              <span>History</span>
            </div>
            {conversations.length > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                {conversations.length}
              </span>
            )}
          </button>
        </nav>

        {/* History list */}
        {showHistory && conversations.length > 0 && (
          <ScrollArea className="flex-1 mt-1">
            <div className="px-2 space-y-0.5">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSwitchConversation(conv.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm truncate ${
                    conv.id === currentConvId
                      ? 'bg-accent text-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <p className="truncate">{conv.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{conv.messages.length} messages</p>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {hasActiveChat ? (
          /* ===== CHAT MODE ===== */
          <>
            {/* Suggested questions bar */}
            <div className="border-b border-border bg-white/80 backdrop-blur-sm px-6 py-3 flex-shrink-0">
              <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
                <Sparkles className="w-4 h-4 text-gradient-start flex-shrink-0" />
                {suggestedQuestions.map((q, idx) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => sendQuickPrompt(q.prompt)}
                      disabled={isLoading}
                      className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-white hover:border-gradient-start/40 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-end/5 transition-all duration-200 text-muted-foreground hover:text-foreground whitespace-nowrap disabled:opacity-40"
                    >
                      <Icon className="w-3 h-3 text-gradient-start opacity-60 group-hover:opacity-100 transition-opacity" />
                      {q.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat messages — fills remaining space */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="max-w-5xl mx-auto px-6 py-6">
                <div className="space-y-4">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/60 text-foreground'
                        }`}
                      >
                        <MarkdownText
                          content={msg.content}
                          className="text-sm md:text-base"
                        />
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted/60 rounded-2xl px-5 py-4">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </ScrollArea>

            {/* Chat input — pinned to bottom */}
            <div className="border-t border-border bg-white px-6 py-4 flex-shrink-0">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 p-2 bg-background rounded-full border border-border shadow-float-lg">
                  <button className="p-3 hover:bg-muted/50 rounded-full transition-colors">
                    <Paperclip className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask a follow-up question…"
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isLoading}
                    className="p-3 rounded-full gradient-sharpei text-white hover:opacity-90 transition-opacity shadow-float disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ===== HOME MODE ===== */
          <ScrollArea className="flex-1">
            <main className="flex flex-col items-center justify-center px-6 py-12 min-h-full">
              <div className="w-full max-w-5xl mx-auto space-y-10">
                {/* Hero Section with Orb */}
                <div className="text-center space-y-8">
                  <SharpeiOrb />
                  <div className="space-y-2">
                    <h1 className="text-3xl font-semibold text-foreground">
                      Hey! I'm Sharpei AI, your equipment-financing copilot
                      <span className="inline-block w-0.5 h-8 bg-gradient-start ml-1 animate-pulse" />
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      I help banks, lenders, and leasing teams streamline workflows with audit-ready AI assistance.
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                  {/* Actions Row */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-4 rounded-full bg-gradient-to-b from-gradient-start to-gradient-end" />
                      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Actions</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div onClick={() => setIsLeaseQuoteOpen(true)}>
                        <QuickActionCard
                          icon={<FilePlus className="w-5 h-5 text-gradient-end" />}
                          title="Generate a new lease quote"
                          description="For any equipment within seconds"
                          compact
                        />
                      </div>
                      <div onClick={() => setIsRenewalOfferOpen(true)}>
                        <QuickActionCard
                          icon={<RefreshCw className="w-5 h-5 text-gradient-start" />}
                          title="Generate a renewal / EoT quote"
                          description="For existing leases and end-of-term options"
                          compact
                        />
                      </div>
                    </div>
                  </div>

                  {/* Insights Row */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-4 rounded-full bg-gradient-to-b from-gradient-blue to-gradient-purple" />
                      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Insights</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div onClick={() => sendQuickPrompt("Show me my portfolio KPIs and key metrics for this month.")}>
                        <QuickActionCard
                          icon={<BarChart3 className="w-5 h-5 text-gradient-blue" />}
                          title="Portfolio KPIs"
                          description="Key metrics snapshot"
                          compact
                        />
                      </div>
                      <div onClick={() => sendQuickPrompt("Show me my application pipeline status including applications that need follow-up.")}>
                        <QuickActionCard
                          icon={<ClipboardList className="w-5 h-5 text-gradient-purple" />}
                          title="Pipeline status"
                          description="Application funnel overview"
                          compact
                        />
                      </div>
                      <div onClick={() => sendQuickPrompt("Show me risk and delinquency metrics including vendor risk flags and credit risk distribution.")}>
                        <QuickActionCard
                          icon={<ShieldAlert className="w-5 h-5 text-rose-500" />}
                          title="Risk & delinquency"
                          description="Flags and alerts"
                          compact
                        />
                      </div>
                      <div onClick={() => sendQuickPrompt("Show me the top performing vendors by volume, approval rates, and delinquency scores.")}>
                        <QuickActionCard
                          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
                          title="Vendor performance"
                          description="Top vendors and scores"
                          compact
                        />
                      </div>
                    </div>
                  </div>

                  {/* Needs Attention Row */}
                  {alerts.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-400 to-red-500" />
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Needs attention</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {alerts.map((alert, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendQuickPrompt(alert.prompt)}
                            className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 hover:shadow-float hover:-translate-y-0.5 ${alert.color}`}
                          >
                            {alert.icon}
                            <span className="font-semibold text-sm">{alert.count}</span>
                            <span className="text-sm">{alert.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="w-full max-w-5xl mx-auto">
                  <div className="flex items-center gap-3 p-2 bg-white rounded-full border border-border shadow-float-lg hover:shadow-float transition-all duration-300">
                    <button className="p-3 hover:bg-muted/50 rounded-full transition-colors">
                      <Paperclip className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask me anything about equipment financing, risk, contracts, or vendors…"
                      className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isLoading}
                      className="p-3 rounded-full gradient-sharpei text-white hover:opacity-90 transition-opacity shadow-float disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </ScrollArea>
        )}

      <LeaseQuoteDialog open={isLeaseQuoteOpen} onOpenChange={setIsLeaseQuoteOpen} />
      <RenewalOfferDialog open={isRenewalOfferOpen} onOpenChange={setIsRenewalOfferOpen} />
      </div>
    </div>;
};
export default Index;
