import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, CheckCircle2, RotateCcw, ArrowUpCircle, Info, Plus, Minus } from "lucide-react";
import robotImage from "@/assets/humanoid-robot.png";

const Checkout = () => {
  const [downPayment, setDownPayment] = useState(299);
  const [term, setTerm] = useState("24");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [maintenance, setMaintenance] = useState(false);
  const [insurance, setInsurance] = useState(false);

  const productPrice = 28800; // $800/mo * 36 months
  const monthlyRate = 800;
  const maintenanceCost = 150;
  const insuranceCost = 200;

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
    { term: "12 months", monthly: "$2,450", apr: "3.5%", total: "$29,400" },
    { term: "24 months", monthly: "$1,275", apr: "3.9%", total: "$30,600" },
    { term: "36 months", monthly: "$875", apr: "4.2%", total: "$31,500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3 tracking-tight">
            Merchant Checkout
          </h1>
          <p className="text-muted-foreground text-lg">Experience seamless equipment financing at checkout</p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Main Checkout Area */}
          <div className="space-y-6">
            {/* Product Card */}
            <Card className="shadow-product border-border/50 overflow-hidden backdrop-blur-sm bg-card/95">
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Image */}
                  <div className="bg-gradient-to-br from-muted via-background to-muted/50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center shadow-inner relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img 
                      src={robotImage} 
                      alt="Humanoid Robot" 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">
                        Humanoid Robot F-02
                      </h2>
                      <p className="text-muted-foreground mt-2 text-base leading-relaxed">
                        Advanced AI-powered humanoid robot for commercial and industrial applications
                      </p>
                    </div>

                    {/* Payment Tabs */}
                    <Tabs defaultValue="lease" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/60 p-1">
                        <TabsTrigger value="cash" className="font-medium data-[state=active]:shadow-sm">Cash</TabsTrigger>
                        <TabsTrigger value="finance" className="font-medium data-[state=active]:shadow-sm">Finance</TabsTrigger>
                        <TabsTrigger value="lease" className="font-medium data-[state=active]:shadow-sm">Lease</TabsTrigger>
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

                      <TabsContent value="lease" className="space-y-5 mt-6">
                        {/* Product Summary */}
                        <div className="space-y-3 bg-muted/30 rounded-xl p-5 border border-border/50">
                          <div className="flex justify-between items-center py-1">
                            <span className="text-foreground font-medium">Humanoid Robot F-02</span>
                            <span className="text-foreground font-bold text-lg">${monthlyRate}/mo</span>
                          </div>
                          
                          {/* Quantity Selector */}
                          <div className="flex justify-between items-center py-2 border-t border-border/30 pt-3">
                            <span className="text-muted-foreground font-medium">Units</span>
                            <div className="flex items-center gap-3">
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-9 w-9 hover:bg-accent transition-colors"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-foreground font-bold text-lg w-10 text-center">{quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-9 w-9 hover:bg-accent transition-colors"
                                onClick={() => setQuantity(quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Add-ons */}
                        <div className="space-y-3 bg-accent/40 rounded-xl p-5 border border-border/50">
                          <p className="text-base font-semibold text-foreground mb-2">Add-ons</p>
                          <div className="flex items-center justify-between py-2.5 hover:bg-background/50 -mx-2 px-2 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <Checkbox 
                                id="maintenance" 
                                checked={maintenance}
                                onCheckedChange={(checked) => setMaintenance(checked as boolean)}
                                className="h-5 w-5"
                              />
                              <label htmlFor="maintenance" className="text-sm font-medium text-foreground cursor-pointer">
                                Maintenance Package
                              </label>
                            </div>
                            <span className="text-sm font-semibold text-foreground">+${maintenanceCost}/mo</span>
                          </div>
                          <div className="flex items-center justify-between py-2.5 hover:bg-background/50 -mx-2 px-2 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <Checkbox 
                                id="insurance" 
                                checked={insurance}
                                onCheckedChange={(checked) => setInsurance(checked as boolean)}
                                className="h-5 w-5"
                              />
                              <label htmlFor="insurance" className="text-sm font-medium text-foreground cursor-pointer">
                                Insurance Coverage
                              </label>
                            </div>
                            <span className="text-sm font-semibold text-foreground">+${insuranceCost}/mo</span>
                          </div>
                        </div>
                        
                        {/* Total */}
                        <div className="flex justify-between items-center py-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl px-5 border border-primary/20">
                          <span className="text-foreground font-semibold text-base">Total Monthly Payment</span>
                          <span className="text-foreground font-display font-bold text-2xl">${calculateTotal()}/mo</span>
                        </div>

                        {/* Down Payment & Term */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2.5">
                            <label className="text-sm font-medium text-foreground">Down Payment</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                              <Input
                                type="number"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                className="pl-8 h-11 text-base font-medium border-border/60 focus:border-primary transition-colors"
                              />
                            </div>
                          </div>
                          <div className="space-y-2.5">
                            <label className="text-sm font-medium text-foreground">Term</label>
                            <Select value={term} onValueChange={setTerm}>
                              <SelectTrigger className="h-11 text-base font-medium border-border/60 focus:border-primary transition-colors">
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
                        <div className="bg-gradient-to-br from-accent via-accent/80 to-muted/60 rounded-2xl p-6 space-y-3 border border-border/40">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-muted-foreground font-medium">from</span>
                            <span className="text-4xl font-display font-bold text-foreground tracking-tight">${calculateTotal()}</span>
                            <span className="text-lg text-muted-foreground font-medium">/mo</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            3.9% APR · ${downPayment} down · {term} months
                          </p>
                          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                              <Button variant="link" className="p-0 h-auto text-sm font-semibold text-primary hover:underline">
                                View all payment options →
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-display">Choose Your Payment Term</DialogTitle>
                                <DialogDescription className="text-base">
                                  Select the monthly payment plan that works best for your business
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-3 mt-6">
                                {paymentOptions.map((option, index) => (
                                  <Card key={index} className="hover:border-primary hover:shadow-lg cursor-pointer transition-all duration-300 group">
                                    <CardContent className="p-5">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-semibold text-foreground text-base">{option.term}</p>
                                          <p className="text-3xl font-display font-bold text-primary mt-2 group-hover:scale-105 transition-transform">
                                            {option.monthly}
                                            <span className="text-base font-normal text-muted-foreground">/mo</span>
                                          </p>
                                          <p className="text-sm text-muted-foreground mt-1.5">{option.apr} APR</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-xs text-muted-foreground font-medium">Total Cost</p>
                                          <p className="text-lg font-bold text-foreground mt-1">{option.total}</p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
                                *Actual terms may vary based on credit approval and available rates at the time of application. Not all applicants will qualify.
                              </p>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {/* End of Lease Options */}
                        <div className="bg-gradient-to-br from-primary/8 via-primary/5 to-transparent rounded-2xl p-6 space-y-4 border border-primary/15">
                          <p className="text-base font-semibold text-foreground">End of lease options:</p>
                          <div className="space-y-3">
                            <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-background/50 transition-colors">
                              <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-success" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">Keep it</p>
                                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">Purchase at pre-agreed price</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-background/50 transition-colors">
                              <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                                <RotateCcw className="w-5 h-5 text-destructive" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">Return it</p>
                                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">No further obligation</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-background/50 transition-colors">
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <ArrowUpCircle className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">Upgrade</p>
                                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">Swap for a newer model</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* BBVA Branded Button */}
                        <Button className="w-full bg-foreground hover:bg-foreground/90 text-background h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" size="lg">
                          Apply Now
                        </Button>

                        {/* Powered By */}
                        <div className="flex items-center justify-center gap-2 pt-3">
                          <span className="text-sm text-muted-foreground font-medium">Powered by</span>
                          <img 
                            src="/src/assets/bbva-logo.png" 
                            alt="BBVA" 
                            className="h-5 opacity-80"
                          />
                        </div>

                        <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">
                          *Actual terms may vary based on credit approval and available rates at the time of application. Not all applicants will qualify.
                        </p>
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

export default Checkout;
