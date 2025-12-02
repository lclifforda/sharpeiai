import React from 'react';

interface ContractCardProps {
  lender: string;
  customerName: string;
  customerEmail: string;
  totalFinanced: number;
  downPayment: number;
  apr: number;
  termMonths: number;
  monthlyPayment: number;
  docusignLink: string;
}

const ContractCard: React.FC<ContractCardProps> = ({
  lender,
  customerName,
  customerEmail,
  totalFinanced,
  downPayment,
  apr,
  termMonths,
  monthlyPayment,
  docusignLink,
}) => {
  return (
    <div className="rounded-xl overflow-hidden border-2 shadow-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-bold">Equipment Financing Agreement</h3>
            <p className="text-purple-100 text-sm">{lender}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-white text-xs font-semibold">📝 Ready to Sign</span>
          </div>
        </div>
      </div>

      {/* DocuSign Section */}
      <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-cyan-500/10 border-border">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1 text-primary">
              📧 Contract sent to {customerEmail}
            </p>
            <p className="text-xs text-muted-foreground">
              Please check your email and click the link below
            </p>
          </div>
        </div>
        
        <button
          onClick={() => alert('Demo mode: In production, this would open DocuSign for e-signature. For now, click "Sign contract" in the chat to continue.')}
          className="block w-full bg-gradient-to-r from-primary to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] text-center"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
            DocuSign (Demo Mode - Not Active)
          </span>
        </button>
        <p className="text-xs mt-2 text-center text-muted-foreground">
          💡 Demo: Use "Sign contract" button in chat to proceed
        </p>
      </div>

      {/* Contract Summary */}
      <div className="p-6 bg-card">
        <h4 className="text-sm font-semibold mb-4 text-foreground">
          📄 Contract Summary
        </h4>

        {/* Parties */}
        <div className="p-3 rounded-lg mb-4 bg-muted/50">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-muted-foreground">Between:</span>
            <span className="font-semibold text-foreground">
              {lender}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">And:</span>
            <span className="font-semibold text-foreground">
              {customerName}
            </span>
          </div>
        </div>

        {/* Key Terms Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-lg mb-4 bg-muted/50">
          <div>
            <div className="text-xs mb-1 text-muted-foreground">
              Total Financed
            </div>
            <div className="text-lg font-bold text-foreground">
              ${totalFinanced.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-muted-foreground">
              Down Payment
            </div>
            <div className="text-lg font-bold text-foreground">
              ${downPayment}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-muted-foreground">
              APR
            </div>
            <div className={`text-lg font-bold ${
              apr < 8 ? 'text-green-500' : apr < 12 ? 'text-primary' : 'text-amber-500'
            }`}>
              {apr}%
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-muted-foreground">
              Term
            </div>
            <div className="text-lg font-bold text-foreground">
              {termMonths} months
            </div>
          </div>
        </div>

        {/* Monthly Payment Highlight */}
        <div className="p-4 rounded-lg mb-4 border-2 bg-primary/10 border-primary">
          <div className="text-center">
            <div className="text-xs mb-2 text-primary">
              Your Monthly Payment
            </div>
            <div className="text-3xl font-bold text-foreground">
              ${monthlyPayment}
              <span className="text-xl">/mo</span>
            </div>
            <div className="text-xs mt-1 text-muted-foreground">
              for {termMonths} months
            </div>
          </div>
        </div>

        {/* Important Clauses */}
        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
          <h5 className="text-sm font-semibold mb-3 text-purple-700 dark:text-purple-300">
            📋 Key Clauses
          </h5>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-purple-500 text-xs mt-0.5">1.</span>
              <p className="text-xs text-foreground">
                <strong>Payment Obligation:</strong> Fixed ${monthlyPayment}/month for {termMonths} months
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500 text-xs mt-0.5">2.</span>
              <p className="text-xs text-foreground">
                <strong>Interest Rate:</strong> Fixed APR of {apr}% for entire term
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500 text-xs mt-0.5">3.</span>
              <p className="text-xs text-foreground">
                <strong>Ownership:</strong> Equipment delivered immediately, title transfers after final payment
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500 text-xs mt-0.5">4.</span>
              <p className="text-xs text-foreground">
                <strong>Default:</strong> 15-day grace period, late fees after 30 days
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-center mt-4 text-muted-foreground">
          Ask me to explain any section in detail before signing
        </p>
      </div>
    </div>
  );
};

export default ContractCard;
