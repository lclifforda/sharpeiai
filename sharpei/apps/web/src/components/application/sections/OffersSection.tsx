import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OfferCard from "@/components/OfferCard";

interface OffersSectionProps {
  generatedOffers: any[];
  selectedOffer: any | null;
  isGeneratingOffers: boolean;
  offerTypeFilter: "financing" | "lease";
  onSelectOffer: (offer: any) => void;
  onSetOfferTypeFilter: (filter: "financing" | "lease") => void;
  onContinue: () => void;
}

export default function OffersSection({
  generatedOffers,
  selectedOffer,
  isGeneratingOffers,
  offerTypeFilter,
  onSelectOffer,
  onSetOfferTypeFilter,
  onContinue,
}: OffersSectionProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Your Personalized Offers</h2>
          <p className="text-muted-foreground">Choose the financing option that works best for your business</p>

          <div className="flex items-center justify-center gap-2 p-1 bg-muted rounded-lg inline-flex">
            <button
              onClick={() => onSetOfferTypeFilter("financing")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                offerTypeFilter === "financing"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Financing
            </button>
            <button
              onClick={() => onSetOfferTypeFilter("lease")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                offerTypeFilter === "lease"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Leasing
            </button>
          </div>
        </div>

        {isGeneratingOffers ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
            <p className="text-lg font-medium text-foreground">Analyzing your information...</p>
            <p className="text-sm text-muted-foreground">Generating personalized offers</p>
          </div>
        ) : generatedOffers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No offers available. Please try again.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {generatedOffers
              .filter((offer) => offer.type === offerTypeFilter)
              .map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  selected={selectedOffer?.id === offer.id}
                  onSelect={() => onSelectOffer(offer)}
                />
              ))}
          </div>
        )}

        <Button
          onClick={onContinue}
          disabled={!selectedOffer}
          className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
          size="lg"
        >
          Continue to Contract
        </Button>
      </CardContent>
    </Card>
  );
}
