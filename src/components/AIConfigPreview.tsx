import { Bot, User, Sparkles } from "lucide-react";
import type { PlatformBranding } from "@/services/platformConfigMockData";

interface AIConfigPreviewProps {
  branding: PlatformBranding;
}

export default function AIConfigPreview({ branding }: AIConfigPreviewProps) {
  return (
    <div className="border rounded-2xl bg-card overflow-hidden shadow-minimal">
      {/* Header bar with gradient */}
      <div
        className="flex items-center gap-2.5 px-4 py-3 relative overflow-hidden"
        style={{ backgroundColor: branding.primaryColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/10" />
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm relative z-10 overflow-hidden">
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt={branding.companyName || "Logo"} className="w-full h-full object-contain p-0.5" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-white" />
          )}
        </div>
        <div className="relative z-10">
          <span className="text-sm font-semibold text-white">
            {branding.companyName || "AI Assistant"}
          </span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-white/70">Online</span>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="p-4 space-y-4 bg-gradient-to-b from-muted/20 to-transparent">
        {/* AI message */}
        <div className="flex gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm"
            style={{ backgroundColor: branding.accentColor }}
          >
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="bg-card border rounded-2xl rounded-tl-md px-3.5 py-2.5 text-sm text-foreground max-w-[280px] shadow-subtle">
              {branding.welcomeMessage || "Welcome! How can I help you today?"}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 ml-1 block">Just now</span>
          </div>
        </div>

        {/* User message */}
        <div className="flex gap-2.5 justify-end">
          <div>
            <div
              className="rounded-2xl rounded-tr-md px-3.5 py-2.5 text-sm text-white max-w-[240px] shadow-sm"
              style={{ backgroundColor: branding.primaryColor }}
            >
              I'd like to apply for equipment financing.
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 mr-1 block text-right">Just now</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>

        {/* AI reply with typing indicator style */}
        <div className="flex gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm"
            style={{ backgroundColor: branding.accentColor }}
          >
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="bg-card border rounded-2xl rounded-tl-md px-3.5 py-2.5 text-sm text-foreground max-w-[280px] shadow-subtle">
            Great! Let's get started. Can you tell me your company's legal name?
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-muted/30">
          <span className="text-sm text-muted-foreground flex-1">Type your message...</span>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform hover:scale-105"
            style={{ backgroundColor: branding.primaryColor }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
