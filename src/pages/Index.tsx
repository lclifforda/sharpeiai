import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, RefreshCw, FileSearch, History, FilePlus, Plus, Home, FileText } from "lucide-react";
import SharpeiOrb from "@/components/SharpeiOrb";
import QuickActionCard from "@/components/QuickActionCard";
import LeaseQuoteDialog from "@/components/LeaseQuoteDialog";
import RenewalOfferDialog from "@/components/RenewalOfferDialog";
import sharpeiLogo from "@/assets/sharpei-logo.png";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
const Index = () => {
  const [isLeaseQuoteOpen, setIsLeaseQuoteOpen] = useState(false);
  const [isRenewalOfferOpen, setIsRenewalOfferOpen] = useState(false);
  return <div className="min-h-screen bg-background flex">
      {/* Left Sidebar Menu */}
      <div className="w-64 border-r border-border bg-white flex flex-col">
        <div className="p-4">
          <Button variant="default" className="w-full justify-start gap-2 gradient-sharpei text-white shadow-elegant">
            <Plus className="w-4 h-4" />
            New Chat
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="w-full max-w-3xl mx-auto">
            <div className="relative">
              <div className="flex items-center gap-3 p-2 bg-white rounded-full border border-border shadow-float-lg hover:shadow-float transition-all duration-300">
                <button className="p-3 hover:bg-muted/50 rounded-full transition-colors">
                  <Paperclip className="w-5 h-5 text-muted-foreground" />
                </button>
                <Input placeholder="Ask me anything about equipment financing, risk, contracts, or assets…" className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground" />
                <button className="p-3 rounded-full gradient-sharpei text-white hover:opacity-90 transition-opacity shadow-float">
                  <Send className="w-5 h-5" />
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
    </div>;
};
export default Index;