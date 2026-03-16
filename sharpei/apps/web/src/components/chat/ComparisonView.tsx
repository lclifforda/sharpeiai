import SuggestionButtons from "./SuggestionButtons";

interface ComparisonData {
  financing: {
    lender: string;
    apr: number;
    monthlyPayment: number;
    downPayment: number;
    totalCost: number;
  };
  lease: {
    lender: string;
    monthlyPayment: number;
    downPayment: number;
    totalCost: number;
  };
  difference: string;
  term: number;
}

interface ComparisonViewProps {
  data: ComparisonData;
  suggestions?: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

const ComparisonView = ({ data, suggestions, onSelectSuggestion }: ComparisonViewProps) => (
  <>
    <div className="grid md:grid-cols-2 gap-3 mb-3">
      {/* Financing Column */}
      <div className="rounded-xl overflow-hidden border-2 shadow-lg bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary">
        <div className="bg-gradient-to-r from-primary to-blue-600 px-4 py-3">
          <h3 className="text-white text-sm font-bold">Equipment Financing</h3>
          <p className="text-primary-foreground/80 text-xs">{data.financing.lender}</p>
        </div>
        <div className="p-4 bg-card">
          <div className="space-y-3">
            <div>
              <p className="text-xl font-bold text-foreground">${data.financing.monthlyPayment.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
            <div className="space-y-1.5 pt-3 border-t border-border">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Down Payment</span>
                <span className="font-medium text-foreground">${data.financing.downPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">APR</span>
                <span className="font-medium text-foreground">{data.financing.apr}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Term</span>
                <span className="font-medium text-foreground">{data.term} months</span>
              </div>
              <div className="flex justify-between text-xs pt-1.5 border-t border-border">
                <span className="font-semibold text-foreground">Total Cost</span>
                <span className="font-bold text-primary">${data.financing.totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lease Column */}
      <div className="rounded-xl overflow-hidden border-2 shadow-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3">
          <h3 className="text-white text-sm font-bold">Equipment Lease</h3>
          <p className="text-white/80 text-xs">{data.lease.lender}</p>
        </div>
        <div className="p-4 bg-card">
          <div className="space-y-3">
            <div>
              <p className="text-xl font-bold text-foreground">${data.lease.monthlyPayment.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
            <div className="space-y-1.5 pt-3 border-t border-border">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Down Payment</span>
                <span className="font-medium text-foreground">${data.lease.downPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">APR</span>
                <span className="font-medium text-foreground">N/A</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Term</span>
                <span className="font-medium text-foreground">{data.term} months</span>
              </div>
              <div className="flex justify-between text-xs pt-1.5 border-t border-border">
                <span className="font-semibold text-foreground">Total Cost</span>
                <span className="font-bold text-green-600">${data.lease.totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Difference Summary */}
    <div className="bg-muted/50 rounded-lg p-3 mb-3">
      <p className="text-xs font-semibold text-foreground text-center">{data.difference}</p>
    </div>

    {suggestions && suggestions.length > 0 && (
      <SuggestionButtons suggestions={suggestions} onSelect={onSelectSuggestion} />
    )}
  </>
);

export default ComparisonView;
