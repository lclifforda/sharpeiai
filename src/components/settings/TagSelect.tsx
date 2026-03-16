import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

function TagSelect({
  options,
  selected,
  onChange,
  allowCustom = false,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  allowCustom?: boolean;
}) {
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);

  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);

  const addCustom = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !selected.includes(trimmed) && !options.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setInputValue("");
    setShowInput(false);
  };

  // Show preset options + any custom values already selected
  const allOptions = [...options, ...selected.filter((s) => !options.includes(s))];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {allOptions.map((opt) => {
          const active = selected.includes(opt);
          const isCustom = !options.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                active
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
              } ${isCustom && active ? "border-dashed" : ""}`}
            >
              {opt}
              {active && <X className="w-3 h-3" />}
            </button>
          );
        })}
        {allowCustom && !showInput && (
          <button
            onClick={() => setShowInput(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border border-dashed border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        )}
      </div>
      {allowCustom && showInput && (
        <div className="flex items-center gap-2">
          <Input
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addCustom(); }
              if (e.key === "Escape") { setInputValue(""); setShowInput(false); }
            }}
            placeholder="Type and press Enter..."
            className="text-sm h-8 max-w-[200px]"
          />
          <Button size="sm" variant="outline" className="h-8 px-2.5" onClick={addCustom}>
            Add
          </Button>
          <button
            onClick={() => { setInputValue(""); setShowInput(false); }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default TagSelect;
