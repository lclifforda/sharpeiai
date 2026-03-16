import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Pencil, X, Plus, Bot } from "lucide-react";
import { generateCryptoId } from "@/lib/idGenerator";
import { ChatBubble, SuggestionButtons, TypingIndicator } from "@/components/chat";
import { agentAPI } from "@/services/ai/agentAPI";

// ── Data Model ──────────────────────────────────────────────────────────

export interface EquipmentItem {
  id: string;
  name: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  year: string;
  condition: 'new' | 'used' | 'refurbished';
}

interface EquipmentChatProps {
  onEquipmentChange: (items: EquipmentItem[], totalValue: number) => void;
}

// ── Chat types ──────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  suggestions?: string[];
}

// ── Shared: condition badge colors ──────────────────────────────────────

const conditionColors: Record<string, string> = {
  new: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  used: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  refurbished: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

// ── Component ───────────────────────────────────────────────────────────

const EquipmentChat = ({ onEquipmentChange }: EquipmentChatProps) => {
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // ── Manual form state ──────────────────────────────────────
  const [manualName, setManualName] = useState("");
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualUnitValue, setManualUnitValue] = useState<number | "">("");
  const [manualYear, setManualYear] = useState("2025");
  const [manualCondition, setManualCondition] = useState<'new' | 'used' | 'refurbished'>('new');
  const [editingId, setEditingId] = useState<string | null>(null);

  // ── Chat state ─────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // Pending equipment from Claude, awaiting user confirmation
  const pendingEquipmentRef = useRef<{
    name: string;
    quantity: number;
    unitValue: number;
    year: string;
    condition: 'new' | 'used' | 'refurbished';
  } | null>(null);

  // ── Notify parent ──────────────────────────────────────────

  useEffect(() => {
    const total = items.reduce((sum, i) => sum + i.totalValue, 0);
    onEquipmentChange(items, total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // ── Manual form handlers ───────────────────────────────────

  const resetManualForm = () => {
    setManualName("");
    setManualQuantity(1);
    setManualUnitValue("");
    setManualYear("2025");
    setManualCondition('new');
    setEditingId(null);
  };

  const handleManualAdd = () => {
    if (!manualName.trim() || !manualUnitValue) return;
    const uv = typeof manualUnitValue === 'number' ? manualUnitValue : 0;
    const item: EquipmentItem = {
      id: editingId || generateCryptoId(),
      name: manualName.trim(),
      quantity: manualQuantity,
      unitValue: uv,
      totalValue: manualQuantity * uv,
      year: manualYear,
      condition: manualCondition,
    };
    setItems(prev => {
      if (editingId) return prev.map(i => i.id === editingId ? item : i);
      return [...prev, item];
    });
    resetManualForm();
  };

  const handleManualEdit = (item: EquipmentItem) => {
    setManualName(item.name);
    setManualQuantity(item.quantity);
    setManualUnitValue(item.unitValue);
    setManualYear(item.year);
    setManualCondition(item.condition);
    setEditingId(item.id);
    setChatOpen(false);
  };

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (editingId === id) resetManualForm();
  };

  // ── Chat helpers ───────────────────────────────────────────

  const pushAI = (content: string, suggestions?: string[]) => {
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last && last.content === content) return prev;
      return [...prev, { id: generateCryptoId(), role: 'ai' as const, content, suggestions }];
    });
  };

  const pushUser = (content: string) => {
    setMessages(prev => [...prev, { id: generateCryptoId(), role: 'user' as const, content }]);
  };

  // Init chat on first open
  const initChat = () => {
    if (messages.length === 0) {
      pushAI(
        "What equipment are you looking to finance? Describe it naturally — I'll help identify the details.",
        ["Laptops for the office", "Manufacturing equipment", "Vehicles"]
      );
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const el = chatContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }, [messages, isTyping]);

  const addEquipmentFromClaude = (eq: { name: string; quantity: number; unitValue: number; year: string; condition: 'new' | 'used' | 'refurbished' }) => {
    const item: EquipmentItem = {
      id: generateCryptoId(),
      name: eq.name,
      quantity: eq.quantity,
      unitValue: eq.unitValue,
      totalValue: eq.quantity * eq.unitValue,
      year: eq.year,
      condition: eq.condition,
    };
    setItems(prev => [...prev, item]);
    pendingEquipmentRef.current = null;
  };

  // ── Claude-powered chat ────────────────────────────────────

  const handleSend = async (content: string) => {
    if (!content.trim() || isTyping) return;
    const text = content.trim();
    const lower = text.toLowerCase();
    pushUser(text);
    setInputValue('');

    // Handle confirm/reject of pending equipment locally
    if (pendingEquipmentRef.current) {
      if (lower.includes('confirm') || lower.includes('yes') || lower.includes('add') || lower.includes('looks good') || lower.includes('correct')) {
        addEquipmentFromClaude(pendingEquipmentRef.current);
        pushAI(
          `Added! Would you like to add more equipment?`,
          ["Yes, add more", "No, I'm done"]
        );
        return;
      }
      if (lower.includes('no') || lower.includes('done') || lower.includes('finish') || lower.includes("that's all")) {
        pendingEquipmentRef.current = null;
        pushAI("All set! Your equipment list is ready.");
        return;
      }
      // If they say edit or something else, clear pending and let Claude handle it
      pendingEquipmentRef.current = null;
    }

    // Quick local handling for "done"
    if (items.length > 0 && (lower === 'no' || lower === "no, i'm done" || lower === "i'm done" || lower === 'done')) {
      pushAI("All set! Your equipment list is ready.");
      return;
    }

    // Send to Claude
    setIsTyping(true);
    try {
      // Build conversation history for Claude (just the text, not the full objects)
      const history = messages.map(m => ({
        role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
        content: m.content,
      }));

      const result = await agentAPI.askClaudeEquipment(
        text,
        history,
        items.map(i => ({ name: i.name, quantity: i.quantity, totalValue: i.totalValue }))
      );

      setIsTyping(false);

      if (result.equipment) {
        // Claude extracted full equipment data — ask for confirmation
        pendingEquipmentRef.current = result.equipment;
        const eq = result.equipment;
        const total = eq.quantity * eq.unitValue;
        pushAI(
          result.message || `Here's what I found:\n\n**${eq.quantity}x ${eq.name}**\nYear: ${eq.year} · Condition: ${eq.condition}\n$${eq.unitValue.toLocaleString()} each = **$${total.toLocaleString()} total**\n\nShall I add this?`,
          result.suggestions || ['Confirm', 'Edit', 'Start over']
        );
      } else {
        // Claude needs more info — show its conversational response
        pushAI(result.message, result.suggestions);
      }
    } catch (error) {
      console.error('Equipment chat error:', error);
      setIsTyping(false);
      pushAI("Sorry, I had trouble processing that. You can try again or use the manual form.", ['Try again']);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) handleSend(inputValue);
    }
  };

  const grandTotal = items.reduce((sum, i) => sum + i.totalValue, 0);

  // ── Render ──────────────────────────────────────────────────

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Equipment Details</h2>
          <button
            type="button"
            onClick={() => { setChatOpen(!chatOpen); if (!chatOpen) initChat(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              chatOpen
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            AI Assistant
          </button>
        </div>

        {/* Equipment item cards */}
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                className="group flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg flex-shrink-0">
                    {item.condition === 'new' ? '\u{1F4BB}' : item.condition === 'refurbished' ? '\u{1F504}' : '\u{1F5A5}\uFE0F'}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground truncate">{item.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${conditionColors[item.condition]}`}>
                        {item.condition}
                      </span>
                      <span className="font-semibold text-foreground">${item.totalValue.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity}x @ ${item.unitValue.toLocaleString()} &middot; {item.year}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleManualEdit(item)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleRemove(item.id)}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm pt-1">
              <span className="text-muted-foreground">{items.length} item{items.length !== 1 ? 's' : ''}</span>
              <span className="font-semibold text-foreground">Total: ${grandTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* AI Chat (collapsible) */}
        {chatOpen && (
          <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div ref={chatContainerRef} className="max-h-[280px] overflow-y-auto">
              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg.id}>
                    <ChatBubble role={msg.role === 'ai' ? 'ai' : 'user'} content={msg.content}>
                      {msg.role === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                        <SuggestionButtons suggestions={msg.suggestions} onSelect={(s) => setInputValue(s)} />
                      )}
                    </ChatBubble>
                  </div>
                ))}
                {isTyping && <TypingIndicator />}

              </div>
            </div>
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe your equipment..."
                className="flex-1 text-sm"
                disabled={isTyping}
              />
              <Button
                onClick={() => { if (inputValue.trim()) handleSend(inputValue); }}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="h-9 w-9"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Manual form (always visible when chat is closed) */}
        {!chatOpen && (
          <div className="space-y-3 rounded-lg border border-border p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="eq-name" className="text-sm">Equipment Name *</Label>
                <Input
                  id="eq-name"
                  placeholder="e.g. MacBook Pro, Standing Desk..."
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eq-qty" className="text-sm">Quantity</Label>
                <Input
                  id="eq-qty"
                  type="number"
                  min={1}
                  value={manualQuantity}
                  onChange={(e) => setManualQuantity(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eq-unit" className="text-sm">Unit Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="eq-unit"
                    type="number"
                    placeholder="0"
                    value={manualUnitValue}
                    onChange={(e) => setManualUnitValue(e.target.value ? Number(e.target.value) : "")}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eq-year" className="text-sm">Year</Label>
                <Input
                  id="eq-year"
                  placeholder="2025"
                  value={manualYear}
                  onChange={(e) => setManualYear(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eq-cond" className="text-sm">Condition</Label>
                <Select value={manualCondition} onValueChange={(v) => setManualCondition(v as 'new' | 'used' | 'refurbished')}>
                  <SelectTrigger id="eq-cond"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="refurbished">Refurbished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Click to add this item to your list</p>
            <Button
              onClick={handleManualAdd}
              disabled={!manualName.trim() || !manualUnitValue}
              className="w-full shadow-sm"
              variant="default"
            >
              {editingId ? (
                <>Save Changes</>
              ) : (
                <><Plus className="w-4 h-4 mr-1.5" />Add Equipment</>
              )}
            </Button>
            {editingId && (
              <Button variant="ghost" onClick={resetManualForm} className="w-full text-muted-foreground">
                Cancel Edit
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EquipmentChat;
