import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MessageSquare, Paperclip, RefreshCw, FileSearch, History, FilePlus, Plus, Home, FileText, Database, X } from "lucide-react";
import SharpeiOrb from "@/components/SharpeiOrb";
import QuickActionCard from "@/components/QuickActionCard";
import LeaseQuoteDialog from "@/components/LeaseQuoteDialog";
import RenewalOfferDialog from "@/components/RenewalOfferDialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAiAgent } from "@/hooks/useAiAgent";
import { Card, CardContent } from "@/components/ui/card";
const dataSources = [
  "Salesforce",
  "Teams",
  "SharePoint",
  "Payments System",
  "Data Warehouse",
];

const Index = () => {
  const [isLeaseQuoteOpen, setIsLeaseQuoteOpen] = useState(false);
  const [isRenewalOfferOpen, setIsRenewalOfferOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [showResponse, setShowResponse] = useState(false);
  const sessionIdRef = useRef(`index-session-${Date.now()}`);
  const { sendMessage, isLoading, lastMessage, isConnected } = useAiAgent(sessionIdRef.current);

  const toggleSource = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  // Handle AI responses
  useEffect(() => {
    if (lastMessage) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: lastMessage.text }]);
      setShowResponse(true);
    }
  }, [lastMessage]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    const message = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: message }]);
    setChatInput("");
    setShowResponse(true);
    
    try {
      await sendMessage(message, {
        source: 'index-chat',
        selectedSources: selectedSources
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return <div className="min-h-screen bg-background flex">
      {/* Left Sidebar Menu */}
      <div className="w-64 border-r border-border bg-white flex flex-col">
        <div className="p-4">
          <Button variant="ghost" className="w-full justify-start gap-2 border border-transparent bg-gradient-to-r from-gradient-start to-gradient-end bg-origin-border p-[1px] hover:shadow-glow transition-all">
            <span className="w-full flex items-center gap-2 bg-background px-3 py-2 rounded-[calc(0.5rem-1px)]">
              <Plus className="w-4 h-4 text-gradient-start" />
              New Chat
            </span>
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <nav className="px-2 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors">
              <Home className="w-4 h-4 flex-shrink-0" />
              <span>Home</span>
            </button>
            
            
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-lg transition-colors">
              <History className="w-4 h-4 flex-shrink-0" />
              <span>History</span>
            </button>
          </nav>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">{/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl mx-auto space-y-12">
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
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${showResponse && chatMessages.length > 0 ? 'scale-90 opacity-60' : ''}`}>
            <div onClick={() => setIsRenewalOfferOpen(true)}>
              <QuickActionCard icon={<RefreshCw className="w-6 h-6 text-gradient-start" />} title="Generate a renewal / EoT quote" description="for existing leases and end-of-term options" />
            </div>
            <QuickActionCard icon={<FileSearch className="w-6 h-6 text-gradient-blue" />} title="Review a lease contract" description="analyze terms, conditions, and obligations" />
            <QuickActionCard icon={<History className="w-6 h-6 text-gradient-purple" />} title="Search asset history" description="track equipment lifecycle and maintenance" />
            <div onClick={() => setIsLeaseQuoteOpen(true)}>
              <QuickActionCard icon={<FilePlus className="w-6 h-6 text-gradient-end" />} title="Generate a new lease quote" description="for any equipment within seconds" />
            </div>
          </div>

          {/* Universal Chat Input */}
          <div className="w-full max-w-3xl mx-auto space-y-4">
            {/* Chat Response Display */}
            {showResponse && chatMessages.length > 0 && (
              <Card className="bg-white border border-border shadow-float">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-base text-foreground">Chat Response</h3>
                    <button
                      onClick={() => {
                        setShowResponse(false);
                        setChatMessages([]);
                      }}
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  <ScrollArea className="max-h-[500px] min-h-[400px]">
                    <div className="space-y-4 pr-4">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg p-4 ${
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            <p className="text-base whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg p-4">
                            <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <div className="w-3 h-3 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <div className="w-3 h-3 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            <div className="relative">
              <div className="flex items-center gap-3 p-2 bg-white rounded-full border border-border shadow-float-lg hover:shadow-float transition-all duration-300">
                <button className="p-3 hover:bg-muted/50 rounded-full transition-colors">
                  <Paperclip className="w-5 h-5 text-muted-foreground" />
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-1.5 px-3 py-2 hover:bg-muted/50 rounded-full transition-colors">
                      <Plus className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-medium">
                        Sources {selectedSources.length > 0 && `(${selectedSources.length})`}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 bg-white z-50" align="start">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-foreground">Select Data Sources</h4>
                      <div className="space-y-3">
                        {dataSources.map((source) => (
                          <div key={source} className="flex items-center space-x-2">
                            <Checkbox
                              id={source}
                              checked={selectedSources.includes(source)}
                              onCheckedChange={() => toggleSource(source)}
                            />
                            <Label
                              htmlFor={source}
                              className="text-sm cursor-pointer flex-1"
                            >
                              {source}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything about equipment financing, risk, contracts, or assets…" 
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
        </div>
      </main>

      <LeaseQuoteDialog open={isLeaseQuoteOpen} onOpenChange={setIsLeaseQuoteOpen} />
      <RenewalOfferDialog open={isRenewalOfferOpen} onOpenChange={setIsRenewalOfferOpen} />
      </div>
    </div>;
};
export default Index;