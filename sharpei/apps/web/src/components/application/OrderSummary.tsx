import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import robotImage from "@/assets/humanoid-robot.webp";
import sharpeiLogo from "@/assets/sharpei-logo.webp";
import type { OrderDetails } from "./types";

const monthlyRate = 800;
const maintenanceCost = 150;
const insuranceCost = 200;

interface OrderSummaryProps {
  orderDetails: OrderDetails;
}

export default function OrderSummary({ orderDetails }: OrderSummaryProps) {
  const calculateTotal = () => {
    let total = monthlyRate * orderDetails.quantity;
    if (orderDetails.maintenance) total += maintenanceCost;
    if (orderDetails.insurance) total += insuranceCost;
    return total;
  };

  return (
    <Card className="sticky top-6">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Application Summary</h2>

        <div className="flex gap-4 pb-4 border-b border-border">
          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <img src={robotImage} alt="Product" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">Humanoid Robot F-02</h3>
            <p className="text-sm text-muted-foreground">${monthlyRate}/mo per unit</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Quantity</span>
            <span className="text-foreground font-semibold">{orderDetails.quantity}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Term</span>
            <span className="text-foreground font-semibold">{orderDetails.term} months</span>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Leasing total:</span>
            <span className="text-primary font-bold">${monthlyRate * orderDetails.quantity}/mo</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Purchase option at end of lease
          </p>
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <h3 className="font-semibold text-foreground">Services</h3>
          <div className={`p-3 rounded-lg border-2 transition-all ${orderDetails.maintenance ? "border-primary bg-primary/5" : "border-border"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">Maintenance Pack</p>
                <p className="text-xs text-muted-foreground mt-1">${maintenanceCost}/mo</p>
              </div>
              <Switch checked={orderDetails.maintenance} disabled />
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <h3 className="font-semibold text-foreground">Equipment Extras</h3>
          <div className={`p-3 rounded-lg border-2 transition-all ${orderDetails.insurance ? "border-primary bg-primary/5" : "border-border"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">Insurance Coverage</p>
                <p className="text-xs text-muted-foreground mt-1">Comprehensive protection plan</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Switch checked={orderDetails.insurance} disabled />
                <span className="text-xs text-foreground">${insuranceCost}/mo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly payment</span>
            <span className="text-foreground font-semibold">${monthlyRate * orderDetails.quantity}.00</span>
          </div>
          {orderDetails.maintenance && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Maintenance Pack</span>
              <span className="text-foreground font-semibold">${maintenanceCost}.00</span>
            </div>
          )}
          {orderDetails.insurance && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Insurance</span>
              <span className="text-foreground font-semibold">${insuranceCost}.00</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-muted-foreground">Calculated at checkout</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="text-muted-foreground">Calculated at checkout</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border">
          <span className="font-bold text-foreground">Total</span>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">${calculateTotal()}.00</p>
            <p className="text-xs text-muted-foreground">Monthly, plus shipping & tax</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">Powered by</span>
          <img src={sharpeiLogo} alt="Sharpei AI" className="h-4 w-4 object-contain" />
          <span className="text-xs text-muted-foreground font-medium">Sharpei AI</span>
        </div>
      </CardContent>
    </Card>
  );
}
