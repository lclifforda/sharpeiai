import React from "react";
import { Bot } from "lucide-react";
import ContractCard from "@/components/ContractCard";
import { MarkdownText } from "@/components/MarkdownText";
import { generateCryptoId } from "@/lib/idGenerator";
import type { ChatMessage } from "./helpers";

interface ContractMessageProps {
  message: ChatMessage;
  onSendMessage: (content: string) => void;
}

const ContractMessage = React.memo(({ message, onSendMessage }: ContractMessageProps) => {
  if (message.type !== 'contract' || !message.contractData) return null;

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
      <ContractCard
        offer={{
          id: generateCryptoId(),
          type: message.contractData.offerType || 'financing',
          lender: message.contractData.lender,
          apr: message.contractData.apr,
          termMonths: message.contractData.termMonths,
          downPayment: message.contractData.downPayment,
          monthlyPayment: message.contractData.monthlyPayment,
          totalAmount: message.contractData.totalFinanced
        }}
        onSign={() => onSendMessage('Sign contract')}
      />
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

ContractMessage.displayName = "ContractMessage";

interface CompletionMessageProps {
  message: ChatMessage;
}

const CompletionMessage = React.memo(({ message }: CompletionMessageProps) => {
  if (message.type !== 'completion' || !message.data) return null;

  return (
    <div className="mb-3">
      <div className="rounded-xl overflow-hidden border-2 shadow-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="p-4 md:p-6 space-y-4 text-center bg-card">
          <div className="space-y-2">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-foreground">Thank You for Your Application!</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your application has been successfully submitted and your financing is approved.
            </p>
          </div>

          <div className="bg-accent/50 rounded-lg p-4 space-y-2 text-left">
            <h3 className="font-semibold text-sm">Delivery Information</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-3">
              <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
                {"\ud83d\ude9a"} You should receive your products in 5-7 business days
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground mt-3">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">{"\u2713"}</span>
                <span>Confirmation email sent to your inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">{"\u2713"}</span>
                <span>Tracking information will be provided once shipped</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">{"\u2713"}</span>
                <span>Your first payment will be due in 30 days</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold">Your Selected Offer:</p>
              <p>{message.data.offerType === 'financing' ? 'Financing' : 'Lease'} - {message.data.term} months</p>
              <p className="text-lg font-bold text-primary mt-1">${message.data.monthlyPayment}/month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CompletionMessage.displayName = "CompletionMessage";

export { ContractMessage, CompletionMessage };
