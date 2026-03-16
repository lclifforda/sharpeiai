import React from "react";

interface SuggestionButtonsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const SuggestionButtons = React.memo(({ suggestions, onSelect }: SuggestionButtonsProps) => {
  if (!suggestions.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm border border-border rounded-lg hover:bg-accent transition-colors bg-background"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
});

SuggestionButtons.displayName = "SuggestionButtons";

export default SuggestionButtons;
