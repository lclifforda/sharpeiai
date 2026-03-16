import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CompletionSectionProps {
  selectedOffer: any;
}

export default function CompletionSection({ selectedOffer }: CompletionSectionProps) {
  return (
    <Card>
      <CardContent className="p-8 space-y-6 text-center">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-foreground">Thank You for Your Application!</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Your application has been successfully submitted and your financing is approved.
          </p>
        </div>

        <div className="bg-accent/50 rounded-lg p-6 space-y-3 text-left">
          <h3 className="font-semibold text-lg">What happens next</h3>
          <ul className="space-y-2 text-muted-foreground mt-4">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">{"\u2713"}</span>
              <span>Confirmation email sent to your inbox</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">{"\u2713"}</span>
              <span>Our team will review your documents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">{"\u2713"}</span>
              <span>Your first payment will be due in 30 days</span>
            </li>
          </ul>
        </div>

        {selectedOffer && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold">Your Selected Offer:</p>
              <p>{selectedOffer.type === "financing" ? "Financing" : "Lease"} - {selectedOffer.termMonths} months</p>
              <p className="text-xl font-bold text-primary mt-1">${selectedOffer.monthlyPayment.toFixed(2)}/month</p>
            </div>
          </div>
        )}

        <Button
          onClick={() => window.location.href = "/"}
          className="w-full bg-foreground hover:bg-foreground/90 text-background"
          size="lg"
        >
          Return to Home
        </Button>
      </CardContent>
    </Card>
  );
}
