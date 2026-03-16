import { useState } from "react";
import { Input } from "@/components/ui/input";

export function formatCurrency(val: number): string {
  if (val >= 1_000_000) {
    const m = val / 1_000_000;
    return m % 1 === 0 ? `${m}M` : `${parseFloat(m.toFixed(2))}M`;
  }
  if (val >= 1_000) {
    const k = val / 1_000;
    return k % 1 === 0 ? `${k}K` : `${parseFloat(k.toFixed(1))}K`;
  }
  return String(val);
}

export function parseCurrencyInput(raw: string): number | null {
  const cleaned = raw.replace(/[\s,$]/g, "").toUpperCase();
  if (!cleaned) return null;
  const match = cleaned.match(/^(\d+\.?\d*)\s*(K|M)?$/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return null;
  if (match[2] === "M") return num * 1_000_000;
  if (match[2] === "K") return num * 1_000;
  return num;
}

function CurrencyInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const startEditing = () => {
    setDraft(formatCurrency(value));
    setEditing(true);
  };

  const commit = () => {
    const parsed = parseCurrencyInput(draft);
    if (parsed !== null && parsed >= 0) onChange(parsed);
    setEditing(false);
  };

  return (
    <div className="flex-1">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
        {editing ? (
          <Input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
            className="pl-7 font-mono"
            placeholder="e.g. 25K, 1.5M"
          />
        ) : (
          <div
            onClick={startEditing}
            className="flex items-center h-10 w-full rounded-md border border-input bg-background pl-7 pr-3 text-sm cursor-text hover:border-foreground/30 transition-colors"
          >
            <span className="font-semibold text-foreground">{formatCurrency(value)}</span>
            <span className="text-muted-foreground text-xs ml-1.5">
              ({value.toLocaleString()})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CurrencyInput;
