import React from "react";

const DELAY_STYLES = [
  { animationDelay: "0ms" },
  { animationDelay: "150ms" },
  { animationDelay: "300ms" },
] as const;

const TypingIndicator = React.memo(() => (
  <div className="flex justify-start">
    <div className="bg-muted rounded-lg px-2.5 py-1.5">
      <div className="flex gap-1">
        {DELAY_STYLES.map((style, i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full bg-foreground/40 animate-bounce"
            style={style}
          />
        ))}
      </div>
    </div>
  </div>
));

TypingIndicator.displayName = "TypingIndicator";

export default TypingIndicator;
