import React from 'react';

interface OfferCardProps {
  lender: string;
  apr: number;
  termMonths: number;
  downPayment: number;
  monthlyPayment: number;
  totalAmount: number;
  residuals?: {
    name: string;
    percentage: number;
    value: number;
  }[];
}

const OfferCard: React.FC<OfferCardProps> = ({
  lender,
  apr,
  termMonths,
  downPayment,
  monthlyPayment,
  totalAmount,
  residuals = [],
}) => {
  const isLease = apr === 0 && downPayment === 0;

  return (
    <div className="rounded-xl overflow-hidden border-2 shadow-xl bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-bold">Your Personalized Offer</h3>
            <p className="text-primary-foreground/80 text-sm">{lender}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-white text-xs font-semibold">✓ Approved</span>
          </div>
        </div>
      </div>

      {/* Main Offer Details */}
      <div className="p-6 bg-card">
        {/* Big Monthly Payment */}
        <div className="text-center mb-6">
          <div className="text-sm mb-2 text-muted-foreground">
            Your monthly payment
          </div>
          <div className="text-5xl font-bold mb-2 text-foreground">
            ${monthlyPayment}
            <span className="text-2xl">/mo</span>
          </div>
          <div className="text-sm text-muted-foreground">
            for {termMonths} months
          </div>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg mb-4 bg-muted/50">
          <div className="text-center">
            <div className="text-xs mb-1 text-muted-foreground">
              {isLease ? 'Type' : 'APR'}
            </div>
            <div className={`text-xl font-bold ${
              isLease ? 'text-purple-500' : apr < 8 ? 'text-green-500' : apr < 12 ? 'text-primary' : 'text-amber-500'
            }`}>
              {isLease ? 'Lease' : `${apr}%`}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs mb-1 text-muted-foreground">
              Down Payment
            </div>
            <div className="text-xl font-bold text-foreground">
              ${downPayment}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs mb-1 text-muted-foreground">
              Total
            </div>
            <div className="text-xl font-bold text-foreground">
              ${totalAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Residual Values */}
        {residuals.length > 0 && (
          <div className="p-4 rounded-lg mb-4 border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                Residual Value Protection
              </span>
            </div>
            <div className="space-y-2">
              {residuals.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.name}
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ~{item.percentage}% value (${item.value})
                  </span>
                </div>
              ))}
            </div>
            <div className="text-xs mt-2 italic text-gray-600 dark:text-gray-400">
              Estimated resale value after {termMonths} months — not an insurance product
            </div>
          </div>
        )}

        {/* Why this offer */}
        <div className="p-3 rounded-lg mb-4 bg-primary/10">
          <div className="text-xs font-semibold mb-2 text-primary">
            💡 {isLease ? 'Lease Benefits' : 'Why this rate?'}
          </div>
          <ul className="space-y-1">
            {isLease ? (
              <>
                <li className="text-xs flex items-start gap-2 text-foreground">
                  <span className="text-green-500">✓</span>
                  <span>No down payment required</span>
                </li>
                <li className="text-xs flex items-start gap-2 text-foreground">
                  <span className="text-green-500">✓</span>
                  <span>Flexible upgrade options at end of term</span>
                </li>
                <li className="text-xs flex items-start gap-2 text-foreground">
                  <span className="text-green-500">✓</span>
                  <span>Predictable monthly payments</span>
                </li>
              </>
            ) : (
              <>
                {apr < 8 && (
                  <li className="text-xs flex items-start gap-2 text-foreground">
                    <span className="text-green-500">✓</span>
                    <span>Excellent credit profile qualifies you for premium rates</span>
                  </li>
                )}
                {downPayment > 0 && (
                  <li className="text-xs flex items-start gap-2 text-foreground">
                    <span className="text-green-500">✓</span>
                    <span>Down payment reduces your monthly cost</span>
                  </li>
                )}
                <li className="text-xs flex items-start gap-2 text-foreground">
                  <span className="text-green-500">✓</span>
                  <span>You own the equipment after final payment</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Total Cost Breakdown */}
        <div className="text-xs space-y-1 pb-3 border-b text-muted-foreground">
          <div className="flex justify-between">
            <span>Down payment today</span>
            <span className="font-semibold">${downPayment}</span>
          </div>
          <div className="flex justify-between">
            <span>{termMonths} payments × ${monthlyPayment}</span>
            <span className="font-semibold">${monthlyPayment * termMonths}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 text-foreground">
            <span>Total cost</span>
            <span>${downPayment + (monthlyPayment * termMonths)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
