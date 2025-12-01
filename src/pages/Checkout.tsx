import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, CheckCircle2, RotateCcw, ArrowUpCircle, Info } from "lucide-react";

const Checkout = () => {
  const [downPayment, setDownPayment] = useState(299);
  const [term, setTerm] = useState("24");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productPrice = 1299;
  const dailyRate = 1.25;

  const calculateMonthlyPayment = () => {
    const principal = productPrice - downPayment;
    const months = parseInt(term);
    const monthlyRate = 0.039 / 12; // 3.9% APR
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return payment.toFixed(2);
  };

  const paymentOptions = [
    { term: "12 months", monthly: "$112.50", apr: "3.5%", total: "$1,350" },
    { term: "24 months", monthly: "$58.75", apr: "3.9%", total: "$1,410" },
    { term: "36 months", monthly: "$41.20", apr: "4.2%", total: "$1,483" },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Merchant Checkout Preview</h1>
          <p className="text-muted-foreground mt-2">See how BBVA Commercial Leasing appears in your checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Checkout Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Image */}
                  <div className="bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-muted to-accent flex items-center justify-center">
                      <ShoppingCart className="w-32 h-32 text-muted-foreground/30" />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Commercial Equipment</h2>
                      <p className="text-muted-foreground mt-1">Transform your business operations with professional-grade equipment</p>
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
                          <span className="text-2xl font-bold text-foreground">${productPrice}</span>
                        </div>
                        <Button className="w-full" size="lg">Pay ${productPrice}</Button>
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
                            <span className="text-foreground">Commercial Equipment</span>
                            <span className="text-foreground font-semibold">from ${dailyRate}/day</span>
                          </div>
                          <div className="flex justify-between items-center py-2 text-sm">
                            <span className="text-muted-foreground">One Year Warranty</span>
                            <span className="text-muted-foreground">Included</span>
                          </div>
                          <div className="flex justify-between items-center py-2 text-sm border-b border-border pb-3">
                            <span className="text-muted-foreground">Maintenance Package</span>
                            <span className="text-muted-foreground">Included</span>
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
                            <span className="text-3xl font-bold text-foreground">${dailyRate}</span>
                            <span className="text-muted-foreground">/day</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            3.9% APR, ${downPayment} down, {term} mo
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
                        <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                          <img 
                            src="/src/assets/bbva-logo.png" 
                            alt="BBVA" 
                            className="h-5 mr-2 brightness-0 invert"
                          />
                          Lease with BBVA Commercial
                        </Button>

                        {/* Powered By */}
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <span className="text-xs text-muted-foreground">Powered by</span>
                          <img 
                            src="/src/assets/sharpei-logo.png" 
                            alt="Sharpei" 
                            className="h-4"
                          />
                        </div>

                        <p className="text-xs text-muted-foreground text-center">
                          *Actual terms may vary based on credit approval and available rates at the time of application. Not all applicants will qualify.
                        </p>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Merchant Experience
                </CardTitle>
                <CardDescription>How leasing appears on your checkout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Seamless Integration</p>
                      <p className="text-xs text-muted-foreground mt-1">Leasing option appears naturally alongside cash and financing</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Clear Pricing</p>
                      <p className="text-xs text-muted-foreground mt-1">Customers see daily rates and flexible terms upfront</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">BBVA Trust</p>
                      <p className="text-xs text-muted-foreground mt-1">Backed by a recognized financial institution</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">4</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Flexible Options</p>
                      <p className="text-xs text-muted-foreground mt-1">Keep, return, or upgrade at end of lease</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">Why Offer Leasing?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <p className="text-muted-foreground">Increase average order value by 30-40%</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <p className="text-muted-foreground">Convert more browsers into buyers</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <p className="text-muted-foreground">Get paid upfront while customers pay over time</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <p className="text-muted-foreground">Zero risk - BBVA handles all credit checks</p>
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
