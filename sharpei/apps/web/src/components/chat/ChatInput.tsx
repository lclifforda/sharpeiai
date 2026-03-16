import React, { useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const ChatInput = React.memo(({ value, onChange, onSend, disabled, placeholder = "Ask a question...", className }: ChatInputProps) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }, [onSend]);

  return (
    <div className={`flex gap-1.5 ${className ?? ""}`}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 text-xs h-7 rounded-md border border-input bg-background px-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Button
        onClick={onSend}
        size="icon"
        className="gradient-sharpei hover:opacity-90 transition-opacity h-7 w-7"
        disabled={!value.trim() || disabled}
      >
        <Send className="w-3 h-3" />
      </Button>
    </div>
  );
});

ChatInput.displayName = "ChatInput";

export default ChatInput;
