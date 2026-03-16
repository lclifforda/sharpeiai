import React from "react";
import { Bot, User } from "lucide-react";
import { MarkdownText } from "@/components/MarkdownText";

interface ChatBubbleProps {
  role: "ai" | "user";
  content: string;
  children?: React.ReactNode;
}

const ChatBubble = React.memo(({ role, content, children }: ChatBubbleProps) => (
  <div className={`flex gap-2 ${role === "user" ? "justify-end" : ""}`}>
    {role === "ai" && (
      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
      </div>
    )}
    <div
      className={`max-w-[90%] sm:max-w-[85%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] rounded-2xl p-3 md:p-4 ${
        role === "ai"
          ? "bg-muted text-foreground"
          : "bg-primary text-primary-foreground"
      }`}
    >
      <MarkdownText content={content} className="text-xs md:text-sm" />
      {children}
    </div>
    {role === "user" && (
      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
        <User className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
      </div>
    )}
  </div>
));

ChatBubble.displayName = "ChatBubble";

export default ChatBubble;
