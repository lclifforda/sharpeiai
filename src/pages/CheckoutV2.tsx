import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, RotateCcw, ArrowUpCircle, Plus, Minus } from "lucide-react";
import monitorImage from "@/assets/lg-ultragear-monitors.png";
import lgLogo from "@/assets/lg-logo.png";

const CheckoutV2 = () => {
  const navigate = useNavigate();
  const [downPayment, setDownPayment] = useState(100);
  const [term, setTerm] = useState("24");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [maintenance, setMaintenance] = useState(false);
  const [insurance, setInsurance] = useState(false);

  const handleApplyNow = () => {
    navigate("/application", {
      state: {
        quantity,
        maintenance,
        insurance,
        term,
        downPayment
      }
    });
  };

  const productPrice = 2160; // $60/mo * 36 months
  const monthlyRate = 60;
  const maintenanceCost = 10;
  const insuranceCost = 15;

  const calculateMonthlyPayment = () => {
    const principal = productPrice - downPayment;
    const months = parseInt(term);
    const monthlyRate = 0.039 / 12; // 3.9% APR
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return payment.toFixed(2);
  };

  const calculateTotal = () => {
    let total = monthlyRate * quantity;
    if (maintenance) total += maintenanceCost;
    if (insurance) total += insuranceCost;
    return total;
  };

  const paymentOptions = [
    { term: "12 months", monthly: "$185", apr: "3.5%", total: "$2,220" },
    { term: "24 months", monthly: "$95", apr: "3.9%", total: "$2,280" },
    { term: "36 months", monthly: "$65", apr: "4.2%", total: "$2,340" },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <img 
            src={lgLogo} 
            alt="LG" 
            className="h-10"
          />
          <p className="text-muted-foreground mt-2">See how BBVA Commercial Leasing appears in your checkout</p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Checkout Area */}
          <div className="space-y-6">
            {/* Product Card */}
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Image Gallery */}
                  <div className="space-y-3">
                    <div className="bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                      <img 
                        src={monitorImage} 
                        alt="LG Monitor" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2">
                        <img 
                          src={lgLogo} 
                          alt="LG" 
                          className="h-8"
                        />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">24" FHD 3-Side Borderless IPS Monitor</h2>
                      <p className="text-muted-foreground mt-1">Professional-grade display with stunning clarity and ultra-slim bezels</p>
                    </div>

                    {/* Payment Tabs */}
                    <Tabs defaultValue="lease" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="cash">Cash</TabsTrigger>
                        <TabsTrigger value="finance">Finance</TabsTrigger>
                        <TabsTrigger value="lease">Lease</TabsTrigger>
                      </TabsList>

                      <TabsContent value="cash" className="space-y-4 mt-4">
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="text-foreground font-medium">One-time payment</span>
                          <span className="text-2xl font-bold text-foreground">${productPrice.toLocaleString()}</span>
                        </div>
                        <Button className="w-full" size="lg">Pay ${productPrice.toLocaleString()}</Button>
                      </TabsContent>

                      <TabsContent value="finance" className="space-y-4 mt-4">
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="text-foreground font-medium">Finance monthly</span>
                          <span className="text-2xl font-bold text-foreground">from ${calculateMonthlyPayment()}/mo</span>
                        </div>
                        <Button className="w-full" size="lg" variant="secondary">Apply for Financing</Button>
                      </TabsContent>

                      <TabsContent value="lease" className="space-y-4 mt-4">
                        {/* Product Summary */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-foreground">24" LG Monitor</span>
                            <span className="text-foreground font-semibold">${monthlyRate}/mo</span>
                          </div>
                          
                          {/* Quantity Selector */}
                          <div className="flex justify-between items-center py-2">
                            <span className="text-muted-foreground">Units</span>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-foreground font-semibold w-8 text-center">{quantity}</span>
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

                          {/* Add-ons */}
                          <div className="space-y-2 pt-2 border-t border-border">
                            <p className="text-sm font-medium text-foreground">Add-ons</p>
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  id="maintenance" 
                                  checked={maintenance}
                                  onCheckedChange={(checked) => setMaintenance(checked as boolean)}
                                />
                                <label htmlFor="maintenance" className="text-sm text-muted-foreground cursor-pointer">
                                  Maintenance Package
                                </label>
                              </div>
                              <span className="text-sm text-foreground">+${maintenanceCost}/mo</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  id="insurance" 
                                  checked={insurance}
                                  onCheckedChange={(checked) => setInsurance(checked as boolean)}
                                />
                                <label htmlFor="insurance" className="text-sm text-muted-foreground cursor-pointer">
                                  Insurance Coverage
                                </label>
                              </div>
                              <span className="text-sm text-foreground">+${insuranceCost}/mo</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 text-sm border-t border-border pt-3">
                            <span className="text-foreground font-medium">Total Monthly Payment</span>
                            <span className="text-foreground font-bold text-lg">${calculateTotal()}/mo</span>
                          </div>
                        </div>

                        {/* Down Payment & Term */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Down Payment</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                              <Input
                                type="number"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                className="pl-7"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Term</label>
                            <Select value={term} onValueChange={setTerm}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="12">12 months</SelectItem>
                                <SelectItem value="24">24 months</SelectItem>
                                <SelectItem value="36">36 months</SelectItem>
                                <SelectItem value="48">48 months</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Monthly Payment Display */}
                        <div className="bg-accent rounded-lg p-4 space-y-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-muted-foreground">from</span>
                            <span className="text-3xl font-bold text-foreground">${calculateTotal()}</span>
                            <span className="text-muted-foreground">/mo</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            3.9% APR, ${downPayment} down, {term} months
                          </p>
                          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                              <Button variant="link" className="p-0 h-auto text-xs text-primary">
                                Learn More →
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Choose Your Payment Term</DialogTitle>
                                <DialogDescription>
                                  Select the monthly payment plan that works best for your business
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-3 mt-4">
                                {paymentOptions.map((option, index) => (
                                  <Card key={index} className="hover:border-primary cursor-pointer transition-colors">
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-semibold text-foreground">{option.term}</p>
                                          <p className="text-2xl font-bold text-primary mt-1">{option.monthly}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                                          <p className="text-xs text-muted-foreground mt-1">{option.apr} APR</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-xs text-muted-foreground">Total</p>
                                          <p className="text-sm font-semibold text-foreground">{option.total}</p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground mt-4">
                                *Actual terms may vary based on credit approval and available rates at the time of application. Not all applicants will qualify.
                              </p>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {/* End of Lease Options */}
                        <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                          <p className="text-sm font-semibold text-foreground">At the end of your lease, you can:</p>
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-success flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Keep it</p>
                                <p className="text-xs text-muted-foreground">Purchase at pre-agreed price</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <RotateCcw className="w-4 h-4 mt-0.5 text-destructive flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Return it</p>
                                <p className="text-xs text-muted-foreground">No further obligation</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <ArrowUpCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Upgrade</p>
                                <p className="text-xs text-muted-foreground">Swap for a newer model</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* BBVA Branded Button */}
                        <Button 
                          onClick={handleApplyNow}
                          className="w-full bg-foreground hover:bg-foreground/90 text-background" 
                          size="lg"
                        >
                          Apply Now
                        </Button>

                        {/* Powered By */}
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <span className="text-xs text-muted-foreground">Powered by</span>
                          <img 
                            src="/src/assets/bbva-logo.png" 
                            alt="BBVA" 
                            className="h-4"
                          />
                          <span className="text-xs text-muted-foreground">Commercial Leasing</span>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutV2;
