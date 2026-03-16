interface CompletionCardProps {
  offerType: string;
  term: number;
  monthlyPayment: number;
  showDeliveryInfo?: boolean;
}

const CompletionCard = ({ offerType, term, monthlyPayment, showDeliveryInfo = false }: CompletionCardProps) => (
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
            {showDeliveryInfo
              ? 'Your application has been successfully submitted and your financing is approved.'
              : 'Your application has been successfully submitted and is now under review.'}
          </p>
        </div>

        {showDeliveryInfo ? (
          <div className="bg-accent/50 rounded-lg p-4 space-y-2 text-left">
            <h3 className="font-semibold text-sm">Delivery Information</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-3">
              <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
                🚚 You should receive your products in 5-7 business days
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground mt-3">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Confirmation email sent to your inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Tracking information will be provided once shipped</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Your first payment will be due in 30 days</span>
              </li>
            </ul>
          </div>
        ) : (
          <div className="bg-accent/50 rounded-lg p-4 space-y-2 text-left">
            <h3 className="font-semibold text-sm">What Happens Next</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground mt-3">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Confirmation email sent to your inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Our team will review your application within 1-2 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Your first payment will be due in 30 days after approval</span>
              </li>
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold">Your Selected Offer:</p>
            <p>{offerType === 'financing' ? 'Financing' : 'Lease'} - {term} months</p>
            <p className="text-lg font-bold text-primary mt-1">${monthlyPayment}/month</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CompletionCard;
