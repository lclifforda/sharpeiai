import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, CheckCircle2, RotateCcw, ArrowUpCircle, Info, Plus, Minus } from "lucide-react";
import robotImage from "@/assets/humanoid-robot.png";
import robotAngle1 from "@/assets/robot-angle-1.png";
import robotAngle2 from "@/assets/robot-angle-2.png";
import sharpeiLogo from "@/assets/sharpei-logo.png";

const Checkout = () => {
  const navigate = useNavigate();
  
  // Lease state
  const [leaseDownPayment, setLeaseDownPayment] = useState(299);
  const [leaseTerm, setLeaseTerm] = useState("24");
  const [leaseQuantity, setLeaseQuantity] = useState(1);
  const [leaseMaintenance, setLeaseMaintenance] = useState(false);
  const [leaseInsurance, setLeaseInsurance] = useState(false);
  
  // Financing state
  const [financeDownPayment, setFinanceDownPayment] = useState(500);
  const [financeTerm, setFinanceTerm] = useState("36");
  const [financeQuantity, setFinanceQuantity] = useState(1);
  const [financeMaintenance, setFinanceMaintenance] = useState(false);
  const [financeInsurance, setFinanceInsurance] = useState(false);
  
  // Shared state
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const productImages = [robotImage, robotAngle1, robotAngle2];

  const handleApplyNow = (type: 'lease' | 'finance') => {
    const state = type === 'lease' 
      ? {
          quantity: leaseQuantity,
          maintenance: leaseMaintenance,
          insurance: leaseInsurance,
          term: leaseTerm,
          downPayment: leaseDownPayment,
          type: 'lease'
        }
      : {
          quantity: financeQuantity,
          maintenance: financeMaintenance,
          insurance: financeInsurance,
          term: financeTerm,
          downPayment: financeDownPayment,
          type: 'finance'
        };
    
    navigate("/application", { state });
  };

  const productPrice = 28800; // $800/mo * 36 months
  const monthlyRate = 800;
  const maintenanceCost = 150;
  const insuranceCost = 200;

  const calculateFinanceMonthlyPayment = () => {
    const principal = (productPrice * financeQuantity) - financeDownPayment;
    const months = parseInt(financeTerm);
    const monthlyRate = 0.039 / 12; // 3.9% APR
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return payment.toFixed(2);
  };

  const calculateLeaseTotal = () => {
    // Calculate base monthly payment: (monthlyRate * quantity) - (downPayment amortized over term)
    const months = parseInt(leaseTerm);
    const baseMonthly = monthlyRate * leaseQuantity;
    const downPaymentAmortized = leaseDownPayment / months;
    let total = baseMonthly - downPaymentAmortized;
    
    // Add optional services
    if (leaseMaintenance) total += maintenanceCost;
    if (leaseInsurance) total += insuranceCost;
    
    // Ensure total doesn't go negative and format to 2 decimal places
    return Math.max(0, parseFloat(total.toFixed(2)));
  };

  const calculateFinanceTotal = () => {
    const basePayment = parseFloat(calculateFinanceMonthlyPayment());
    let total = basePayment;
    if (financeMaintenance) total += maintenanceCost;
    if (financeInsurance) total += insuranceCost;
    return total.toFixed(2);
  };

  const leasePaymentOptions = [
    { term: "12 months", monthly: "$2,450", total: "$29,400" },
    { term: "24 months", monthly: "$1,275", total: "$30,600" },
    { term: "36 months", monthly: "$875", total: "$31,500" },
  ];

  const financePaymentOptions = [
    { term: "12 months", monthly: "$2,450", apr: "3.5%", total: "$29,400" },
    { term: "24 months", monthly: "$1,275", apr: "3.9%", total: "$30,600" },
    { term: "36 months", monthly: "$875", apr: "4.2%", total: "$31,500" },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Merchant Checkout Preview</h1>
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
                        src={productImages[selectedImage]} 
                        alt="Humanoid Robot" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Thumbnail Gallery */}
                    <div className="grid grid-cols-3 gap-2">
                      {productImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center border-2 transition-all ${
                            selectedImage === index 
                              ? 'border-primary' 
                              : 'border-transparent hover:border-border'
                          }`}
                        >
                          <img 
                            src={image} 
                            alt={`Robot view ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Humanoid Robot F-02</h2>
                      <p className="text-muted-foreground mt-1">Advanced AI-powered humanoid robot for commercial and industrial applications</p>
                    </div>

                    {/* Payment Tabs */}
                    <Tabs defaultValue="lease" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="buy">Buy</TabsTrigger>
                        <TabsTrigger value="lease">Lease</TabsTrigger>
                        <TabsTrigger value="finance">Financing</TabsTrigger>
                      </TabsList>

                      {/* Buy Tab */}
                      <TabsContent value="buy" className="space-y-4 mt-4">
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="text-foreground font-medium">One-time payment</span>
                          <span className="text-2xl font-bold text-foreground">${productPrice.toLocaleString()}</span>
                        </div>
                        <Button className="w-full" size="lg">Pay ${productPrice.toLocaleString()}</Button>
                      </TabsContent>

                      {/* Lease Tab */}

                      <TabsContent value="lease" className="space-y-4 mt-4">
                        {/* Product Summary */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-foreground">Humanoid Robot F-02</span>
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
                                onClick={() => setLeaseQuantity(Math.max(1, leaseQuantity - 1))}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-foreground font-semibold w-8 text-center">{leaseQuantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setLeaseQuantity(leaseQuantity + 1)}
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
                                  id="lease-maintenance" 
                                  checked={leaseMaintenance}
                                  onCheckedChange={(checked) => setLeaseMaintenance(checked as boolean)}
                                />
                                <label htmlFor="lease-maintenance" className="text-sm text-muted-foreground cursor-pointer">
                                  Maintenance Package
                                </label>
                              </div>
                              <span className="text-sm text-foreground">+${maintenanceCost}/mo</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  id="lease-insurance" 
                                  checked={leaseInsurance}
                                  onCheckedChange={(checked) => setLeaseInsurance(checked as boolean)}
                                />
                                <label htmlFor="lease-insurance" className="text-sm text-muted-foreground cursor-pointer">
                                  Insurance Coverage
                                </label>
                              </div>
                              <span className="text-sm text-foreground">+${insuranceCost}/mo</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 text-sm border-t border-border pt-3">
                            <span className="text-foreground font-medium">Total Monthly Payment</span>
                            <span className="text-foreground font-bold text-lg">${calculateLeaseTotal()}/mo</span>
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
                                value={leaseDownPayment}
                                onChange={(e) => setLeaseDownPayment(Number(e.target.value))}
                                className="pl-7"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Term</label>
                            <Select value={leaseTerm} onValueChange={setLeaseTerm}>
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
                            <span className="text-3xl font-bold text-foreground">${calculateLeaseTotal()}</span>
                            <span className="text-muted-foreground">/mo</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ${leaseDownPayment} down, {leaseTerm} months
                          </p>
                          <Dialog open={isLeaseModalOpen} onOpenChange={setIsLeaseModalOpen}>
                            <DialogTrigger asChild>
                              <Button variant="link" className="p-0 h-auto text-xs text-primary">
                                Learn More →
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>What is a Lease?</DialogTitle>
                                <DialogDescription>
                                  Learn about leasing and choose your payment term
                                </DialogDescription>
                              </DialogHeader>
                              
                              {/* Educational Content */}
                              <div className="space-y-4 mt-4">
                                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                                  <h4 className="font-semibold text-foreground">Understanding Equipment Leasing</h4>
                                  <p className="text-sm text-muted-foreground">
                                    A lease is a rental agreement that allows you to use equipment for a fixed period in exchange for monthly payments. Unlike financing, you don't own the equipment during the lease term, which typically results in lower monthly payments.
                                  </p>
                                  <div className="space-y-2 pt-2 border-t border-border">
                                    <div className="flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-success flex-shrink-0" />
                                      <p className="text-sm text-foreground"><strong>Lower Monthly Payments:</strong> Typically lower than financing because you're paying for use, not ownership</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-success flex-shrink-0" />
                                      <p className="text-sm text-foreground"><strong>Flexible End Options:</strong> Return, purchase, or upgrade at lease end</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-success flex-shrink-0" />
                                      <p className="text-sm text-foreground"><strong>Preserve Capital:</strong> Keep cash available for other business needs</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-success flex-shrink-0" />
                                      <p className="text-sm text-foreground"><strong>Technology Updates:</strong> Easier to upgrade to newer equipment</p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-foreground mb-3">Available Lease Terms</h4>
                                  <div className="space-y-3">
                                    {leasePaymentOptions.map((option, index) => (
                                      <Card key={index} className="hover:border-primary cursor-pointer transition-colors">
                                        <CardContent className="p-4">
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <p className="font-semibold text-foreground">{option.term}</p>
                                              <p className="text-2xl font-bold text-primary mt-1">{option.monthly}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
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
                                </div>
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

                        {/* Apply Button */}
                        <Button 
                          onClick={() => handleApplyNow('lease')}
                          className="w-full bg-foreground hover:bg-foreground/90 text-background" 
                          size="lg"
                        >
                          Apply for Lease
                        </Button>

                        {/* Powered By */}
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <span className="text-xs text-muted-foreground">Powered by</span>
                          <img 
                            src={sharpeiLogo} 
                            alt="Sharpei AI" 
                            className="h-4 w-4 object-contain"
                          />
                          <span className="text-xs text-muted-foreground font-medium">Sharpei AI</span>
                        </div>

                        <p className="text-xs text-muted-foreground text-center">
                          *Actual terms may vary based on credit approval and available rates at the time of application. Not all applicants will qualify.
                        </p>
                      </TabsContent>

                      {/* Financing Tab */}
                      <TabsContent value="finance" className="space-y-4 mt-4">
                        {/* Product Summary */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-foreground">Humanoid Robot F-02</span>
                            <span className="text-foreground font-semibold">${productPrice.toLocaleString()}</span>
                          </div>
                          
                          {/* Quantity Selector */}
                          <div className="flex justify-between items-center py-2">
                            <span className="text-muted-foreground">Units</span>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setFinanceQuantity(Math.max(1, financeQuantity - 1))}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-foreground font-semibold w-8 text-center">{financeQuantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setFinanceQuantity(financeQuantity + 1)}
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
                                  id="finance-maintenance" 
                                  checked={financeMaintenance}
                                  onCheckedChange={(checked) => setFinanceMaintenance(checked as boolean)}
                                />
                                <label htmlFor="finance-maintenance" className="text-sm text-muted-foreground cursor-pointer">
                                  Maintenance Package
                                </label>
                              </div>
                              <span className="text-sm text-foreground">+${maintenanceCost}/mo</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  id="finance-insurance" 
                                  checked={financeInsurance}
                                  onCheckedChange={(checked) => setFinanceInsurance(checked as boolean)}
                                />
                                <label htmlFor="finance-insurance" className="text-sm text-muted-foreground cursor-pointer">
                                  Insurance Coverage
                                </label>
                              </div>
                              <span className="text-sm text-foreground">+${insuranceCost}/mo</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 text-sm border-t border-border pt-3">
                            <span className="text-foreground font-medium">Total Monthly Payment</span>
                            <span className="text-foreground font-bold text-lg">${calculateFinanceTotal()}/mo</span>
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
                                value={financeDownPayment}
                                onChange={(e) => setFinanceDownPayment(Number(e.target.value))}
                                className="pl-7"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Term</label>
                            <Select value={financeTerm} onValueChange={setFinanceTerm}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="12">12 months</SelectItem>
                                <SelectItem value="24">24 months</SelectItem>
                                <SelectItem value="36">36 months</SelectItem>
                                <SelectItem value="48">48 months</SelectItem>
                                <SelectItem value="60">60 months</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Monthly Payment Display */}
                        <div className="bg-accent rounded-lg p-4 space-y-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-muted-foreground">from</span>
                            <span className="text-3xl font-bold text-foreground">${calculateFinanceTotal()}</span>
                            <span className="text-muted-foreground">/mo</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            3.9% APR, ${financeDownPayment} down, {financeTerm} months
                          </p>
                          <Dialog open={isFinanceModalOpen} onOpenChange={setIsFinanceModalOpen}>
                            <DialogTrigger asChild>
                              <Button variant="link" className="p-0 h-auto text-xs text-primary">
                                Learn More →
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>What is Financing?</DialogTitle>
                                <DialogDescription>
                                  Learn about equipment financing and choose your payment term
                                </DialogDescription>
                              </DialogHeader>
                              
                              {/* Educational Content */}
                              <div className="space-y-4 mt-4">
                                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                                  <h4 className="font-semibold text-foreground">Understanding Equipment Financing</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Equipment financing is a loan that allows you to purchase equipment and own it over time. You make monthly payments that include principal and interest (APR), and once the loan is paid off, you own the equipment outright.
                                  </p>
                                  <div className="space-y-2 pt-2 border-t border-border">
                                    <div className="flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-success flex-shrink-0" />
                                      <p className="text-sm text-foreground"><strong>Ownership:</strong> You own the equipment from day one and fully after the loan term</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-success flex-shrink-0" />
                                      <p className="text-sm text-foreground"><strong>Tax Benefits:</strong> May qualify for depreciation and interest deductions</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-success flex-shrink-0" />
                                      <p className="text-sm text-foreground"><strong>Asset Value:</strong> Equipment becomes a business asset on your balance sheet</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-success flex-shrink-0" />
                                      <p className="text-sm text-foreground"><strong>Flexible Terms:</strong> Choose from 12 to 60 month repayment periods</p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-foreground mb-3">Available Financing Terms</h4>
                                  <div className="space-y-3">
                                    {financePaymentOptions.map((option, index) => (
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
                                </div>
                              </div>
                              
                              <p className="text-xs text-muted-foreground mt-4">
                                *Actual terms may vary based on credit approval and available rates at the time of application. Not all applicants will qualify.
                              </p>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {/* Financing Benefits */}
                        <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                          <p className="text-sm font-semibold text-foreground">Financing Benefits:</p>
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-success flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Ownership</p>
                                <p className="text-xs text-muted-foreground">You own the equipment at the end of the term</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-success flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Tax Benefits</p>
                                <p className="text-xs text-muted-foreground">Potential tax deductions on interest payments</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-success flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Flexible Terms</p>
                                <p className="text-xs text-muted-foreground">Choose from 12 to 60 month terms</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Apply Button */}
                        <Button 
                          onClick={() => handleApplyNow('finance')}
                          className="w-full bg-foreground hover:bg-foreground/90 text-background" 
                          size="lg"
                        >
                          Apply for Financing
                        </Button>

                        {/* Powered By */}
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <span className="text-xs text-muted-foreground">Powered by</span>
                          <img 
                            src={sharpeiLogo} 
                            alt="Sharpei AI" 
                            className="h-4 w-4 object-contain"
                          />
                          <span className="text-xs text-muted-foreground font-medium">Sharpei AI</span>
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
        </div>
      </div>
    </div>
  );
};

export default Checkout;
