import React from "react";
import { Bot } from "lucide-react";
import OfferCard from "@/components/OfferCard";
import { MarkdownText } from "@/components/MarkdownText";
import type { ChatMessage, PromptKind } from "./helpers";

interface OfferMessageProps {
  message: ChatMessage;
  onSendMessage: (content: string) => void;
}

const OfferMessage = React.memo(({ message, onSendMessage }: OfferMessageProps) => {
  if (message.type !== 'offer' || !message.offerData) return null;

  return (
    <div className="mb-3">
      <div className="flex gap-2 mb-2">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
        </div>
        <div className="bg-muted text-foreground rounded-2xl p-3 md:p-4 max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[65%]">
          <MarkdownText
            content={message.content}
            className="text-xs md:text-sm"
          />
        </div>
      </div>
      <OfferCard offer={message.offerData} />
      {message.suggestions && message.suggestions.length > 0 && (
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
  );
});

OfferMessage.displayName = "OfferMessage";

interface ComparisonMessageProps {
  message: ChatMessage;
  onSendMessage: (content: string) => void;
  onChooseFinancing: () => void;
  onChooseLease: () => void;
}

const ComparisonMessage = React.memo(({ message, onSendMessage, onChooseFinancing, onChooseLease }: ComparisonMessageProps) => {
  if (message.type !== 'comparison' || !message.comparisonData) return null;

  return (
    <div className="mb-3">
      <div className="flex gap-2 mb-3">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
        </div>
        <div className="bg-muted text-foreground rounded-2xl p-3 md:p-4 max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[65%]">
          <MarkdownText
            content={message.content}
            className="text-xs md:text-sm"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        {/* Financing Column */}
        <div className="rounded-xl overflow-hidden border-2 shadow-lg bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary">
          <div className="bg-gradient-to-r from-primary to-blue-600 px-4 py-3">
            <h3 className="text-white text-sm font-bold">Equipment Financing</h3>
            <p className="text-primary-foreground/80 text-xs">{message.comparisonData.financing.lender}</p>
          </div>
          <div className="p-4 bg-card">
            <div className="space-y-3">
              <div>
                <p className="text-xl font-bold text-foreground">${message.comparisonData.financing.monthlyPayment.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
              <div className="space-y-1.5 pt-3 border-t border-border">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Down Payment</span>
                  <span className="font-medium text-foreground">${message.comparisonData.financing.downPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">APR</span>
                  <span className="font-medium text-foreground">{message.comparisonData.financing.apr}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Term</span>
                  <span className="font-medium text-foreground">{message.comparisonData.term} months</span>
                </div>
                <div className="flex justify-between text-xs pt-1.5 border-t border-border">
                  <span className="font-semibold text-foreground">Total Cost</span>
                  <span className="font-bold text-primary">${message.comparisonData.financing.totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lease Column */}
        <div className="rounded-xl overflow-hidden border-2 shadow-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3">
            <h3 className="text-white text-sm font-bold">Equipment Lease</h3>
            <p className="text-white/80 text-xs">{message.comparisonData.lease.lender}</p>
          </div>
          <div className="p-4 bg-card">
            <div className="space-y-3">
              <div>
                <p className="text-xl font-bold text-foreground">${message.comparisonData.lease.monthlyPayment.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
              <div className="space-y-1.5 pt-3 border-t border-border">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Down Payment</span>
                  <span className="font-medium text-foreground">${message.comparisonData.lease.downPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">APR</span>
                  <span className="font-medium text-foreground">N/A</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Term</span>
                  <span className="font-medium text-foreground">{message.comparisonData.term} months</span>
                </div>
                <div className="flex justify-between text-xs pt-1.5 border-t border-border">
                  <span className="font-semibold text-foreground">Total Cost</span>
                  <span className="font-bold text-green-600">${message.comparisonData.lease.totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Difference Summary */}
      <div className="bg-muted/50 rounded-lg p-3 mb-3">
        <p className="text-xs font-semibold text-foreground text-center">{message.comparisonData.difference}</p>
      </div>

      {message.suggestions && message.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {message.suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (suggestion === 'Choose Financing') {
                  onChooseFinancing();
                } else if (suggestion === 'Choose Lease') {
                  onChooseLease();
                } else {
                  onSendMessage(suggestion);
                }
              }}
              className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm border border-border rounded-lg hover:bg-accent transition-colors bg-background"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

ComparisonMessage.displayName = "ComparisonMessage";

export { OfferMessage, ComparisonMessage };
