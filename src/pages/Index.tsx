import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Send, Paperclip, Sparkles, FileText, Calculator, FolderKanban } from "lucide-react";
import SharpeiOrb from "@/components/SharpeiOrb";
import QuickActionCard from "@/components/QuickActionCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-sharpei flex items-center justify-center shadow-float">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-semibold text-foreground">Sharpei AI</span>
            </div>
            
            {/* Model selector */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <span className="text-sm text-foreground">AI Model</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            
            {/* Private session tag */}
            <div className="px-3 py-1.5 rounded-full bg-muted/50 border border-border">
              <span className="text-xs text-muted-foreground font-medium">Private session</span>
            </div>
          </div>
          
          {/* Contact button */}
          <Button className="rounded-full px-6 gradient-sharpei text-white hover:opacity-90 transition-opacity shadow-float">
            Contact Sharpei Expert →
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl mx-auto space-y-12">
          {/* Hero Section with Orb */}
          <div className="text-center space-y-6">
            <SharpeiOrb />
            
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-foreground">
                Hey! I'm Sharpei AI, your equipment-financing copilot
                <span className="inline-block w-0.5 h-8 bg-gradient-start ml-1 animate-pulse" />
              </h1>
              <p className="text-muted-foreground text-lg">
                I help banks, lenders, and leasing companies manage workflows with AI precision
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionCard
              icon={<Sparkles className="w-6 h-6 text-gradient-start" />}
              title="Generate a lease quote"
              description="for any product within seconds"
            />
            <QuickActionCard
              icon={<FileText className="w-6 h-6 text-gradient-pink" />}
              title="Run underwriting"
              description="document extraction + credit analysis"
            />
            <QuickActionCard
              icon={<Calculator className="w-6 h-6 text-gradient-coral" />}
              title="Calculate asset value"
              description="depreciation, residual value, lifecycle"
            />
            <QuickActionCard
              icon={<FolderKanban className="w-6 h-6 text-gradient-end" />}
              title="Manage applications"
              description="upload docs, verify assets, check status"
            />
          </div>

          {/* Universal Chat Input */}
          <div className="w-full max-w-3xl mx-auto">
            <div className="relative">
              <div className="flex items-center gap-3 p-2 bg-white rounded-full border border-border shadow-float-lg hover:shadow-float transition-all duration-300">
                <button className="p-3 hover:bg-muted/50 rounded-full transition-colors">
                  <Paperclip className="w-5 h-5 text-muted-foreground" />
                </button>
                <Input
                  placeholder="Ask anything about equipment financing…"
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
                />
                <button className="p-3 rounded-full gradient-sharpei text-white hover:opacity-90 transition-opacity shadow-float">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Sharpei AI may make mistakes. Always verify financial data. Your conversation stays private.
            </p>
            <div className="flex items-center gap-4">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Technical issue
              </button>
              <span className="text-muted-foreground">·</span>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Feedback
              </button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground/70">
              Sharpei — AI for Equipment Financing
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
