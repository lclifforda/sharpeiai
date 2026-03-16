import React from "react";
import { Bot, User } from "lucide-react";
import { MarkdownText } from "@/components/MarkdownText";
import type { ChatMessage } from "./helpers";

interface ChatMessagesProps {
  message: ChatMessage;
  onSendMessage: (content: string) => void;
}

const ChatMessages = React.memo(({ message, onSendMessage }: ChatMessagesProps) => {
  // Skip types rendered by dedicated components
  if (
    message.type === 'offer' ||
    message.type === 'contract' ||
    message.type === 'comparison' ||
    message.type === 'completion' ||
    message.type === 'document_upload' ||
    message.type === 'form_section' ||
    message.type === 'submitted' ||
    message.type === 'disqualified'
  ) {
    return null;
  }

  return (
    <div className={`flex gap-2 ${message.type === "user" ? "justify-end" : ""}`}>
      {message.type === "ai" && (
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
        </div>
      )}
      <div
        className={`max-w-[90%] sm:max-w-[85%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] rounded-2xl p-3 md:p-4 ${
          message.type === "ai"
            ? "bg-muted text-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        <MarkdownText
          content={message.content}
          className="text-xs md:text-sm"
        />

        {/* Suggestion buttons for AI messages */}
        {message.type === "ai" && message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(suggestion)}
                className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm border border-border rounded-lg hover:bg-accent transition-colors bg-background"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      {message.type === "user" && (
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        </div>
      )}
    </div>
  );
});

ChatMessages.displayName = "ChatMessages";

export default ChatMessages;
