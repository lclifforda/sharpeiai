import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { MessageSquare, Paperclip, RefreshCw, FileSearch, History, FilePlus, Plus, Home, ChevronDown, Sparkles, User } from "lucide-react";
import SharpeiOrb from "@/components/SharpeiOrb";
import QuickActionCard from "@/components/QuickActionCard";
import LeaseQuoteDialog from "@/components/LeaseQuoteDialog";
import RenewalOfferDialog from "@/components/RenewalOfferDialog";
import sharpeiLogo from "@/assets/sharpei-logo.png";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const dataSources = [
  "Salesforce",
  "Teams",
  "SharePoint",
  "Payments System",
  "Data Warehouse",
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const { t } = useTranslation();
  const [isLeaseQuoteOpen, setIsLeaseQuoteOpen] = useState(false);
  const [isRenewalOfferOpen, setIsRenewalOfferOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasStartedChat = messages.length > 0;

  const toggleSource = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    const query = inputValue.trim().toLowerCase();
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response based on query
    setTimeout(() => {
      let responseContent = t("index.aiResponse");

      // Mock response for contracts ending this month
      if (query.includes('contract') && (query.includes('ending') || query.includes('expir'))) {
        responseContent = `Here are the contracts ending this month:

**1. Acme Manufacturing Co.**
• Contract ID: LC-2024-0892
• Equipment: CNC Milling Machine X500
• End Date: December 15, 2024
• Monthly Payment: €4,250
• Status: Renewal pending

**2. TechFlow Industries**
• Contract ID: LC-2024-0756
• Equipment: Industrial Robot Arm R-200
• End Date: December 22, 2024
• Monthly Payment: €6,800
• Status: Customer contacted

**3. GreenEnergy Solutions**
• Contract ID: LC-2024-0634
• Equipment: Solar Panel Array (50 units)
• End Date: December 28, 2024
• Monthly Payment: €12,500
• Status: Buyout requested

**4. Metro Logistics Ltd.**
• Contract ID: LC-2024-0589
• Equipment: Fleet Tracking System
• End Date: December 31, 2024
• Monthly Payment: €1,850
• Status: Pending review

Would you like me to generate renewal offers for any of these contracts?`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'renewal':
        setIsRenewalOfferOpen(true);
        break;
      case 'review':
        setInputValue(t("index.quickActions.review") + " - " + t("index.quickActions.reviewDesc"));
        inputRef.current?.focus();
        break;
      case 'history':
        setInputValue(t("index.quickActions.history") + " - " + t("index.quickActions.historyDesc"));
        inputRef.current?.focus();
        break;
      case 'quote':
        setIsLeaseQuoteOpen(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar Menu */}
      <div className="w-64 border-r border-border bg-white flex flex-col">
        <div className="p-4">
          <Button variant="ghost" className="w-full justify-start gap-2 border border-transparent bg-gradient-to-r from-gradient-start to-gradient-end bg-origin-border p-[1px] hover:shadow-glow transition-all">
            <span className="w-full flex items-center gap-2 bg-background px-3 py-2 rounded-[calc(0.5rem-1px)]">
              <Plus className="w-4 h-4 text-gradient-start" />
              {t("index.newChat")}
            </span>
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <nav className="px-2 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors">
              <Home className="w-4 h-4 flex-shrink-0" />
              <span>{t("index.home")}</span>
            </button>
            
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-lg transition-colors">
              <History className="w-4 h-4 flex-shrink-0" />
              <span>{t("index.history")}</span>
            </button>
          </nav>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 flex flex-col px-6 py-8">
          <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
            
            {/* Initial State - Orb and Quick Actions */}
            {!hasStartedChat ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                {/* Hero Section with Orb */}
                <div className="text-center space-y-8">
                  <SharpeiOrb />
                  
                  <div className="space-y-2">
                    <h1 className="text-3xl font-semibold text-foreground">
                      {t("index.greeting")}
                      <span className="inline-block w-0.5 h-8 bg-gradient-start ml-1 animate-pulse" />
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      {t("index.description")}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div onClick={() => handleQuickAction('renewal')}>
                    <QuickActionCard icon={<RefreshCw className="w-6 h-6 text-gradient-start" />} title={t("index.quickActions.renewal")} description={t("index.quickActions.renewalDesc")} />
                  </div>
                  <div onClick={() => handleQuickAction('review')}>
                    <QuickActionCard icon={<FileSearch className="w-6 h-6 text-gradient-blue" />} title={t("index.quickActions.review")} description={t("index.quickActions.reviewDesc")} />
                  </div>
                  <div onClick={() => handleQuickAction('history')}>
                    <QuickActionCard icon={<History className="w-6 h-6 text-gradient-purple" />} title={t("index.quickActions.history")} description={t("index.quickActions.historyDesc")} />
                  </div>
                  <div onClick={() => handleQuickAction('quote')}>
                    <QuickActionCard icon={<FilePlus className="w-6 h-6 text-gradient-end" />} title={t("index.quickActions.quote")} description={t("index.quickActions.quoteDesc")} />
                  </div>
                </div>
              </div>
            ) : (
              /* Chat State - Messages with integrated orb */
              <div className="flex-1 flex flex-col">
                {/* Chat Header with Mini Orb */}
                <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-full gradient-sharpei opacity-30 blur-md" />
                    <div className="relative w-full h-full rounded-full gradient-sharpei shadow-lg flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-medium text-foreground">{t("index.chatHeader")}</h2>
                    <p className="text-xs text-muted-foreground">{t("index.chatSubheader")}</p>
                  </div>
                  
                  {/* Collapsed Quick Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        {t("index.quickActionsBtn")}
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuItem onClick={() => handleQuickAction('renewal')} className="gap-3 py-3">
                        <RefreshCw className="w-4 h-4 text-gradient-start" />
                        <div>
                          <p className="font-medium text-sm">{t("index.renewalEot")}</p>
                          <p className="text-xs text-muted-foreground">{t("index.endOfTermOptions")}</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickAction('review')} className="gap-3 py-3">
                        <FileSearch className="w-4 h-4 text-gradient-blue" />
                        <div>
                          <p className="font-medium text-sm">{t("index.reviewContract")}</p>
                          <p className="text-xs text-muted-foreground">{t("index.analyzeTerms")}</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickAction('history')} className="gap-3 py-3">
                        <History className="w-4 h-4 text-gradient-purple" />
                        <div>
                          <p className="font-medium text-sm">{t("index.searchAssetHistory")}</p>
                          <p className="text-xs text-muted-foreground">{t("index.trackLifecycle")}</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickAction('quote')} className="gap-3 py-3">
                        <FilePlus className="w-4 h-4 text-gradient-end" />
                        <div>
                          <p className="font-medium text-sm">{t("index.newLeaseQuote")}</p>
                          <p className="text-xs text-muted-foreground">{t("index.generateQuickly")}</p>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 pr-4 -mr-4">
                  <div className="space-y-6 pb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'assistant' 
                            ? 'gradient-sharpei' 
                            : 'bg-muted'
                        }`}>
                          {message.role === 'assistant' ? (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                          ) : (
                            <User className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div className={`max-w-[75%] ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-md' 
                            : 'bg-muted rounded-2xl rounded-tl-md'
                        } px-4 py-3`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-sharpei flex items-center justify-center">
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Universal Chat Input - Always at bottom */}
            <div className="w-full max-w-3xl mx-auto mt-6">
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
                          {t("index.sources")} {selectedSources.length > 0 && `(${selectedSources.length})`}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 bg-white z-50" align="start">
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-foreground">{t("index.selectDataSources")}</h4>
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
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t("index.inputPlaceholder")} 
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground" 
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
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

        {/* Footer */}
        <footer className="border-t border-border bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="mt-4 flex items-center justify-center gap-2">
              <p className="text-xs text-muted-foreground/70">
                Powered by
              </p>
              <img src={sharpeiLogo} alt="Sharpei AI" className="h-4 w-4 object-contain" />
              <p className="text-xs text-muted-foreground/70 font-medium">
                Sharpei AI
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
