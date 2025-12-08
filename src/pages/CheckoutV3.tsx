import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Minus, Info, Check, Circle } from "lucide-react";
import robotImage from "@/assets/humanoid-robot.png";
import robotAngle1 from "@/assets/robot-angle-1.png";
import robotAngle2 from "@/assets/robot-angle-2.png";
import bbvaLogo from "@/assets/bbva-logo.png";

const CheckoutV3 = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [maintenance, setMaintenance] = useState(false);
  const [insurance, setInsurance] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("standard");

  const productImages = [robotImage, robotAngle1, robotAngle2];

  const plans = {
    basic: { name: "Basic", monthly: 450, features: ["Standard support", "Basic analytics"] },
    standard: { name: "Standard", monthly: 600, features: ["Priority support", "Advanced analytics", "API access"] },
    premium: { name: "Premium", monthly: 850, features: ["24/7 support", "Full analytics suite", "API access", "Custom integrations"] },
  };

  const setupFee = 500;
  const maintenanceCost = 100;
  const insuranceCost = 100;
  const originalPrice = 24000;

  const calculateMonthly = () => {
    let total = plans[selectedPlan as keyof typeof plans].monthly * quantity;
    if (maintenance) total += maintenanceCost;
    if (insurance) total += insuranceCost;
    return total;
  };

  const handleApplyNow = () => {
    navigate("/application", {
      state: {
        product: "Humanoid Robot F-02",
        quantity,
        plan: selectedPlan,
        setupFee,
        monthlyPayment: calculateMonthly(),
        maintenance,
        insurance,
        paymentType: "subscription",
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={bbvaLogo} alt="BBVA" className="h-8" />
          <span className="text-sm text-muted-foreground">Secure Checkout</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-xl overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt="Humanoid Robot F-02"
                className="w-full h-full object-contain p-8"
              />
            </div>
            <div className="flex gap-3">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx
                      ? "border-primary"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-contain p-2 bg-muted"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details & Checkout */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Humanoid Robot F-02
              </h1>
              <p className="text-muted-foreground mt-2">
                Advanced AI-powered humanoid robot for enterprise automation.
              </p>
            </div>

            <Tabs defaultValue="subscribe" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cash">Cash</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
                <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
              </TabsList>

              <TabsContent value="cash" className="space-y-6 mt-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-foreground">Full Price</span>
                    <span className="text-3xl font-bold text-foreground">
                      $24,000
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    One-time payment, immediate ownership
                  </p>
                </div>
                <Button className="w-full" size="lg">
                  Buy Now
                </Button>
              </TabsContent>

              <TabsContent value="finance" className="space-y-6 mt-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg text-foreground">From</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-foreground">
                        $875
                      </span>
                      <span className="text-muted-foreground">/mo</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    36-month financing at 4.2% APR
                  </p>
                </div>
                <Button className="w-full" size="lg">
                  Apply for Financing
                </Button>
              </TabsContent>

              <TabsContent value="subscribe" className="space-y-6 mt-6">
                {/* Price Display */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">
                    ${calculateMonthly().toLocaleString()}
                  </span>
                  <span className="text-lg text-muted-foreground">/month</span>
                  <span className="text-lg text-muted-foreground line-through ml-2">
                    ${originalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Subscription Option Card */}
                <div className="border-2 border-primary rounded-xl p-5 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="w-4 h-4 mt-1 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <Label htmlFor="monthly" className="text-lg font-semibold text-foreground cursor-pointer">
                          Monthly Subscription
                        </Label>
                        <div className="text-right">
                          <span className="text-xl font-bold text-foreground">
                            ${calculateMonthly().toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">/every month</span>
                        </div>
                      </div>
                      
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <button className="text-sm text-primary hover:underline">
                            + ${setupFee} Setup / Security Fee
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>How Subscriptions Work</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 pt-4">
                            {/* Payment Summary */}
                            <div className="bg-muted rounded-lg p-4 space-y-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="text-foreground font-medium">Today's Payment</span>
                                  <p className="text-xs text-muted-foreground">Setup fee + first month</p>
                                </div>
                                <span className="font-semibold text-foreground">${(setupFee + calculateMonthly()).toLocaleString()}</span>
                              </div>
                              <div className="border-t border-border pt-3">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-foreground font-medium">Then Monthly</span>
                                    <p className="text-xs text-muted-foreground">Cancel anytime</p>
                                  </div>
                                  <span className="font-semibold text-foreground">${calculateMonthly().toLocaleString()}/mo</span>
                                </div>
                              </div>
                            </div>

                            {/* Steps */}
                            <div className="space-y-4">
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                                  1
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">Start Your Subscription</p>
                                  <p className="text-sm text-muted-foreground">
                                    Pay ${(setupFee + calculateMonthly()).toLocaleString()} today (${setupFee} setup fee + ${calculateMonthly().toLocaleString()} first month). Equipment ships immediately after approval.
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                                  2
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">Monthly Billing</p>
                                  <p className="text-sm text-muted-foreground">
                                    Pay ${calculateMonthly().toLocaleString()}/mo billed automatically. Your rate stays the same—no surprises or hidden fees.
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                                  3
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">Cancel Anytime</p>
                                  <p className="text-sm text-muted-foreground">
                                    No long-term commitment. Cancel your subscription anytime after the first payment—simply return the equipment.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Benefits */}
                            <div className="bg-muted/50 rounded-lg p-4">
                              <p className="text-sm font-medium text-foreground mb-3">Subscription Benefits</p>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Check className="h-4 w-4 text-green-500" />
                                  <span>No long-term contracts</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Check className="h-4 w-4 text-green-500" />
                                  <span>Free upgrades to newer models</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Check className="h-4 w-4 text-green-500" />
                                  <span>Includes software updates</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Check className="h-4 w-4 text-green-500" />
                                  <span>Cancel with 30-day notice</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <p className="text-sm text-muted-foreground">
                        Pay monthly, enjoy the product, and return it when you're done.
                      </p>

                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="text-sm font-medium text-foreground underline underline-offset-2 hover:text-primary transition-colors">
                              Learn More
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>About Monthly Subscriptions</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <p className="text-muted-foreground">
                                Our subscription model gives you flexibility without commitment. Get enterprise-grade robotics without the upfront cost.
                              </p>
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-foreground">No Ownership Hassle</p>
                                    <p className="text-sm text-muted-foreground">We handle maintenance, repairs, and end-of-life disposal.</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-foreground">Always Up-to-Date</p>
                                    <p className="text-sm text-muted-foreground">Swap for the latest model when upgrades are available.</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-foreground">Flexible Cancellation</p>
                                    <p className="text-sm text-muted-foreground">Cancel anytime after your first payment with 30-day notice.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">Cancel anytime after first payment. Equipment must be returned in working condition.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Plan Selection Dropdown */}
                      <div className="border-t border-border pt-4 mt-4">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Select Plan</p>
                        <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                          <SelectTrigger className="w-full h-12 bg-background">
                            <SelectValue>
                              <span className="font-medium">
                                {plans[selectedPlan as keyof typeof plans].name} - ${plans[selectedPlan as keyof typeof plans].monthly}/mo
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(plans).map(([key, plan]) => (
                              <SelectItem key={key} value={key} className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">{plan.name} - ${plan.monthly}/mo</span>
                                  <span className="text-xs text-muted-foreground">{plan.features.join(" • ")}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantity & Add-ons */}
                <div className="space-y-4 border border-border rounded-xl p-5 bg-card">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">Quantity</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <span className="text-sm font-medium text-muted-foreground">Optional Add-ons</span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="maintenance"
                          checked={maintenance}
                          onCheckedChange={(checked) => setMaintenance(checked as boolean)}
                        />
                        <Label htmlFor="maintenance" className="cursor-pointer">
                          <span className="font-medium">Maintenance Package</span>
                          <p className="text-xs text-muted-foreground">Priority repairs & annual servicing</p>
                        </Label>
                      </div>
                      <span className="text-sm font-medium">+${maintenanceCost}/mo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="insurance"
                          checked={insurance}
                          onCheckedChange={(checked) => setInsurance(checked as boolean)}
                        />
                        <Label htmlFor="insurance" className="cursor-pointer">
                          <span className="font-medium">Equipment Insurance</span>
                          <p className="text-xs text-muted-foreground">Full coverage against damage & theft</p>
                        </Label>
                      </div>
                      <span className="text-sm font-medium">+${insuranceCost}/mo</span>
                    </div>
                  </div>
                </div>

                {/* Summary & CTA */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-medium text-foreground">Due Today</span>
                    <span className="font-bold text-foreground">${(setupFee + calculateMonthly()).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Includes ${setupFee} setup fee + ${calculateMonthly().toLocaleString()} first month. Then ${calculateMonthly().toLocaleString()}/mo going forward.
                  </p>
                  
                  <Button className="w-full h-14 text-lg" size="lg" onClick={handleApplyNow}>
                    Subscribe Now
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Subject to credit approval. Equipment remains property of lessor during subscription.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutV3;
