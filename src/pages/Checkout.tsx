import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Building2, MessageSquare, FileText, ArrowLeft, Phone, Mail, Clock, Shield, Zap, Users, Sparkles, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, RotateCcw, ArrowUpCircle, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import robotImage from "@/assets/humanoid-robot.png";
import robotAngle1 from "@/assets/robot-angle-1.png";
import robotAngle2 from "@/assets/robot-angle-2.png";
import ilsLogo from "@/assets/ils-logo.png";
import ibercajaLogo from "@/assets/ibercaja-logo.png";
import AIApplicationChat from "@/components/AIApplicationChat";
const Checkout = () => {
  const navigate = useNavigate();
  const {
    i18n
  } = useTranslation();
  const [downPayment, setDownPayment] = useState(299);
  const [term, setTerm] = useState("24");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [maintenance, setMaintenance] = useState(false);
  const [insurance, setInsurance] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bankApplicationMethod, setBankApplicationMethod] = useState<"select" | "ai" | "traditional">("select");
  const productImages = [robotImage, robotAngle1, robotAngle2];
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
  const productPrice = 28800; // $800/mo * 36 months
  const monthlyRate = 800;
  const maintenanceCost = 150;
  const insuranceCost = 200;
  const calculateMonthlyPayment = () => {
    const principal = productPrice - downPayment;
    const months = parseInt(term);
    const monthlyRate = 0.039 / 12; // 3.9% APR
    const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return payment.toFixed(2);
  };
  const calculateTotal = () => {
    let total = monthlyRate * quantity;
    if (maintenance) total += maintenanceCost;
    if (insurance) total += insuranceCost;
    return total;
  };
  const paymentOptions = [{
    term: "12 months",
    monthly: "$1,200",
    apr: "3.5%",
    total: "$14,400"
  }, {
    term: "24 months",
    monthly: "$800",
    apr: "3.9%",
    total: "$19,200"
  }, {
    term: "36 months",
    monthly: "$650",
    apr: "4.2%",
    total: "$23,400"
  }];
  const currentLogo = i18n.language === 'es' ? ibercajaLogo : ilsLogo;
  const logoAlt = i18n.language === 'es' ? 'Ibercaja' : 'Innovative Lease Services';
  return <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Checkout Preview</h1>
          <p className="text-muted-foreground mt-2">Preview how the checkout experience appears to end users</p>
        </div>

        {/* Preview Type Tabs */}
        <Tabs defaultValue="merchant" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="merchant" className="gap-2">
              <Store className="h-4 w-4" />
              Merchant Preview
            </TabsTrigger>
            <TabsTrigger value="bank" className="gap-2">
              <Building2 className="h-4 w-4" />
              Bank Landing Preview
            </TabsTrigger>
          </TabsList>

          {/* Merchant Preview Tab */}
          <TabsContent value="merchant">
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
                      <img src={productImages[selectedImage]} alt="Humanoid Robot" className="w-full h-full object-cover" />
                    </div>
                    {/* Thumbnail Gallery */}
                    <div className="grid grid-cols-3 gap-2">
                      {productImages.map((image, index) => <button key={index} onClick={() => setSelectedImage(index)} className={`bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center border-2 transition-all ${selectedImage === index ? 'border-primary' : 'border-transparent hover:border-border'}`}>
                          <img src={image} alt={`Robot view ${index + 1}`} className="w-full h-full object-cover" />
                        </button>)}
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
                            <span className="text-foreground">Humanoid Robot F-02</span>
                            <span className="text-foreground font-semibold">${monthlyRate}/mo</span>
                          </div>
                          
                          {/* Quantity Selector */}
                          <div className="flex justify-between items-center py-2">
                            <span className="text-muted-foreground">Units</span>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-foreground font-semibold w-8 text-center">{quantity}</span>
                              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQuantity(quantity + 1)}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Add-ons */}
                          <div className="space-y-2 pt-2 border-t border-border">
                            <p className="text-sm font-medium text-foreground">Add-ons</p>
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2">
                                <Checkbox id="maintenance" checked={maintenance} onCheckedChange={checked => setMaintenance(checked as boolean)} />
                                <label htmlFor="maintenance" className="text-sm text-muted-foreground cursor-pointer">
                                  Maintenance Package
                                </label>
                              </div>
                              <span className="text-sm text-foreground">+${maintenanceCost}/mo</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2">
                                <Checkbox id="insurance" checked={insurance} onCheckedChange={checked => setInsurance(checked as boolean)} />
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
                              <Input type="number" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="pl-7" />
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
                                How does this work? →
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>How Leasing Works</DialogTitle>
                                <DialogDescription>
                                  Simple, flexible equipment access for your business
                                </DialogDescription>
                              </DialogHeader>
                              
                              {/* Payment Summary Box */}
                              <div className="bg-muted rounded-lg p-4 space-y-3 mt-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-foreground font-medium">Today's Payment</span>
                                    <p className="text-xs text-muted-foreground">Down payment + first month</p>
                                  </div>
                                  <span className="font-semibold text-foreground">${downPayment + calculateTotal()}</span>
                                </div>
                                <div className="border-t border-border pt-3">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <span className="text-foreground font-medium">Then Monthly</span>
                                      <p className="text-xs text-muted-foreground">Fixed for remaining {parseInt(term) - 1} months</p>
                                    </div>
                                    <span className="font-semibold text-foreground">${calculateTotal()}/mo</span>
                                  </div>
                                </div>
                              </div>

                              {/* Step-by-step Explanation */}
                              <div className="space-y-4 mt-4">
                                <div className="flex gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                                    1
                                  </div>
                                  <div>
                                    <p className="font-semibold text-foreground">Start Leasing</p>
                                    <p className="text-sm text-muted-foreground">
                                      Pay ${downPayment + calculateTotal()} today (${downPayment} down payment + ${calculateTotal()} first month). Equipment ships immediately after approval.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                                    2
                                  </div>
                                  <div>
                                    <p className="font-semibold text-foreground">Fixed Monthly Payments</p>
                                    <p className="text-sm text-muted-foreground">
                                      Pay ${calculateTotal()}/mo for the remaining {parseInt(term) - 1} months. Your rate is locked—no surprises or hidden fees.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                                    3
                                  </div>
                                  <div>
                                    <p className="font-semibold text-foreground">End-of-Lease Options</p>
                                    <p className="text-sm text-muted-foreground">
                                      When your term ends: keep it at a pre-agreed price, return it at no extra cost, or upgrade to the latest model.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Payment Options */}
                              <div className="border-t border-border pt-4 mt-4">
                                <p className="text-sm font-semibold text-foreground mb-3">Available Terms</p>
                                <div className="space-y-2">
                                  {paymentOptions.map((option, index) => <div key={index} className="flex justify-between items-center py-2 px-3 rounded-md hover:bg-muted transition-colors">
                                      <span className="text-sm text-foreground">{option.term}</span>
                                      <div className="text-right">
                                        <span className="text-sm font-semibold text-primary">{option.monthly}/mo</span>
                                        <span className="text-xs text-muted-foreground ml-2">({option.apr} APR)</span>
                                      </div>
                                    </div>)}
                                </div>
                              </div>

                              <p className="text-xs text-muted-foreground mt-4">
                                *Actual terms may vary based on credit approval. Not all applicants will qualify.
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
                        <Button onClick={handleApplyNow} className="w-full bg-foreground hover:bg-foreground/90 text-background" size="lg">
                          Apply Now
                        </Button>

                        {/* Powered By */}
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <span className="text-xs text-muted-foreground">Powered by</span>
                          <img src={i18n.language === 'es' ? ibercajaLogo : ilsLogo} alt={i18n.language === 'es' ? 'Ibercaja' : 'ILS'} className="h-4" />
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
          </TabsContent>

          {/* Bank Landing Preview Tab */}
          <TabsContent value="bank">
            <div className="max-w-6xl mx-auto">
              {/* Premium Header */}
              <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-primary via-primary/95 to-primary/90 p-6 mb-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                <div className="relative flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-white rounded-xl p-2 shadow-lg">
                      <img src={currentLogo} alt={logoAlt} className="h-8" />
                    </div>
                    <div className="hidden md:block">
                      <p className="text-primary-foreground/80 text-sm">Business Financing Solutions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-4 text-primary-foreground/90 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        <span>800-438-1470</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4" />
                        <span>apply@ils.com</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-0 backdrop-blur-sm">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Fast Approval
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className="relative bg-gradient-to-br from-muted via-background to-muted/50 border-x border-border p-8 md:p-12">
                <div className="max-w-3xl mx-auto text-center">
                  <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                    <Clock className="h-3 w-3 mr-1" />
                    Apply in under 5 minutes
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Get Fast, Flexible Business Financing
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Secure working capital or finance equipment with our streamlined application process. 
                    Get decisions in as little as 24 hours.
                  </p>
                  
                  {/* Trust Indicators */}
                  <div className="flex flex-wrap justify-center gap-6 mt-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <span>Bank-Level Security</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <span>24hr Decisions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span>10,000+ Businesses Served</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="bg-background border border-t-0 border-border rounded-b-2xl overflow-hidden">
                {/* Application Method Selection */}
                {bankApplicationMethod === "select" && (
                  <div className="p-8 md:p-12">
                    <div className="max-w-4xl mx-auto">
                      {/* Header Section */}
                      <div className="text-center mb-10">
                        <Badge className="mb-4 bg-primary/10 text-primary border-0">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Quick & Easy Application
                        </Badge>
                        <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                          How Would You Like to Apply?
                        </h3>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                          Choose the method that works best for you. Both options are secure and take just minutes to complete.
                        </p>
                      </div>

                      {/* Application Method Cards */}
                      <div className="grid md:grid-cols-2 gap-6 mb-10">
                        {/* AI Chat Option */}
                        <Card 
                          className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:border-primary hover:-translate-y-1" 
                          onClick={() => setBankApplicationMethod("ai")}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 shadow-lg">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Recommended
                            </Badge>
                          </div>
                          <CardContent className="relative p-8 h-full flex flex-col">
                            <div className="w-20 h-20 rounded-3xl gradient-sharpei flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                              <MessageSquare className="w-10 h-10 text-white" />
                            </div>
                            
                            <h4 className="text-2xl font-bold text-foreground mb-3">AI Chat Assistant</h4>
                            <p className="text-muted-foreground mb-6 flex-grow text-base leading-relaxed">
                              Have a conversation with our AI assistant. It guides you through each step and answers questions in real-time.
                            </p>
                            
                            <div className="space-y-3 mb-6">
                              {[
                                { icon: Zap, text: "Complete in under 5 minutes" },
                                { icon: MessageSquare, text: "Get instant answers to questions" },
                                { icon: Sparkles, text: "Personalized guidance" }
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <item.icon className="h-4 w-4 text-primary" />
                                  </div>
                                  <p className="text-sm text-foreground font-medium">{item.text}</p>
                                </div>
                              ))}
                            </div>

                            <Button className="w-full h-12 text-base font-semibold group-hover:shadow-lg transition-all" size="lg">
                              <MessageSquare className="h-5 w-5 mr-2" />
                              Start AI Chat
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Traditional Form Option */}
                        <Card 
                          className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:border-primary hover:-translate-y-1" 
                          onClick={() => setBankApplicationMethod("traditional")}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-transparent to-muted/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <CardContent className="relative p-8 h-full flex flex-col">
                            <div className="w-20 h-20 rounded-3xl bg-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl border border-border">
                              <FileText className="w-10 h-10 text-foreground" />
                            </div>
                            
                            <h4 className="text-2xl font-bold text-foreground mb-3">Traditional Form</h4>
                            <p className="text-muted-foreground mb-6 flex-grow text-base leading-relaxed">
                              Prefer a classic approach? Fill out our structured form at your own pace with all fields visible.
                            </p>
                            
                            <div className="space-y-3 mb-6">
                              {[
                                { icon: FileText, text: "See all fields upfront" },
                                { icon: Clock, text: "Save and continue later" },
                                { icon: Shield, text: "Familiar form experience" }
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center border border-border">
                                    <item.icon className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <p className="text-sm text-foreground font-medium">{item.text}</p>
                                </div>
                              ))}
                            </div>

                            <Button variant="outline" className="w-full h-12 text-base font-semibold group-hover:shadow-lg transition-all" size="lg">
                              <FileText className="h-5 w-5 mr-2" />
                              Use Traditional Form
                            </Button>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Trust Indicators */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Shield className="h-5 w-5 text-primary" />
                          <span>Bank-level encryption</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Zap className="h-5 w-5 text-primary" />
                          <span>No impact on credit score</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BadgeCheck className="h-5 w-5 text-primary" />
                          <span>Decisions in 24 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Chat Application */}
                {bankApplicationMethod === "ai" && (
                  <div className="p-6 md:p-10">
                    <div className="max-w-4xl mx-auto">
                      <Button 
                        variant="ghost" 
                        onClick={() => setBankApplicationMethod("select")} 
                        className="gap-2 mb-6 hover:bg-primary/10"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to options
                      </Button>
                      <AIApplicationChat />
                    </div>
                  </div>
                )}

                {/* Traditional Form Application */}
                {bankApplicationMethod === "traditional" && (
                  <div className="p-6 md:p-10">
                    <div className="max-w-6xl mx-auto">
                      <Button 
                        variant="ghost" 
                        onClick={() => setBankApplicationMethod("select")} 
                        className="gap-2 mb-6 hover:bg-primary/10"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to options
                      </Button>

                      <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Sidebar - Info */}
                        <div className="lg:col-span-1 space-y-5">
                          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-primary to-primary/50" />
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                  <BadgeCheck className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-bold text-lg text-foreground">Why Choose {i18n.language === 'es' ? 'Ibercaja' : 'ILS'}?</h3>
                              </div>
                              <ul className="space-y-4">
                                {[
                                  "Approvals in as little as 24 hours",
                                  "Lease as little as $1,500",
                                  "Simple, secure online application",
                                  "We work with nearly all industries"
                                ].map((text, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-muted-foreground">{text}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>

                          <Card className="border-border/50">
                            <CardContent className="p-6">
                              <h3 className="font-bold text-lg text-foreground mb-5">Application Process</h3>
                              <div className="space-y-4">
                                {[
                                  { step: "1", title: "Fill out the form", desc: "Complete your information" },
                                  { step: "2", title: "Speak with specialist", desc: "Quick consultation call" },
                                  { step: "3", title: "Get your funding", desc: "Fast approval process" }
                                ].map((item, idx) => (
                                  <div key={idx} className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                                      {item.step}
                                    </div>
                                    <div>
                                      <p className="font-medium text-foreground text-sm">{item.title}</p>
                                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-border/50 bg-muted/30">
                            <CardContent className="p-6 text-center">
                              <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                              <p className="text-sm text-muted-foreground mb-1">Need help?</p>
                              <p className="font-bold text-xl text-foreground">800-438-1470</p>
                              <p className="text-xs text-muted-foreground mt-2">Mon-Fri 8am-6pm EST</p>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Right Side - Application Form */}
                        <div className="lg:col-span-2">
                          <Card className="shadow-lg border-border/50">
                            <div className="h-1 bg-gradient-to-r from-primary via-primary/70 to-primary/40" />
                            <CardContent className="p-6 md:p-8">
                              <div className="mb-8">
                                <h3 className="text-2xl font-bold text-foreground mb-2">Business Information</h3>
                                <p className="text-muted-foreground">Complete the form below to start your application</p>
                              </div>
                              
                              <div className="space-y-8">
                                {/* Product & Amount */}
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                      <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-foreground">Product Interest</h4>
                                  </div>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">Product Type *</label>
                                      <Select>
                                        <SelectTrigger className="h-12">
                                          <SelectValue placeholder="Select product type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="equipment">Equipment Lease</SelectItem>
                                          <SelectItem value="working-capital">Working Capital</SelectItem>
                                          <SelectItem value="vehicle">Vehicle Lease</SelectItem>
                                          <SelectItem value="technology">Technology</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">Amount Needed</label>
                                      <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                                        <Input className="h-12 pl-8" placeholder="Enter amount" />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Company Info */}
                                <div className="space-y-4 pt-6 border-t border-border">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                      <Building2 className="h-4 w-4 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-foreground">Company Details</h4>
                                  </div>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">Company Name *</label>
                                      <Input className="h-12" placeholder="Your company name" />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">DBA (if different)</label>
                                      <Input className="h-12" placeholder="Doing business as" />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Business Address *</label>
                                    <Input className="h-12" placeholder="Street address, City, State, ZIP" />
                                  </div>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">Business Phone *</label>
                                      <Input className="h-12" placeholder="(555) 555-5555" />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">Email *</label>
                                      <Input className="h-12" type="email" placeholder="you@company.com" />
                                    </div>
                                  </div>
                                </div>

                                {/* Business Details */}
                                <div className="space-y-4 pt-6 border-t border-border">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                      <Zap className="h-4 w-4 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-foreground">Business Details</h4>
                                  </div>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">Years in Business *</label>
                                      <Input className="h-12" placeholder="e.g., 5" />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">Annual Revenue</label>
                                      <Select>
                                        <SelectTrigger className="h-12">
                                          <SelectValue placeholder="Select range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="under-100k">Under $100K</SelectItem>
                                          <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                                          <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                                          <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                                          <SelectItem value="over-5m">Over $5M</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">State of Incorporation</label>
                                      <Input className="h-12" placeholder="e.g., California" />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">Federal Tax ID (EIN)</label>
                                      <Input className="h-12" placeholder="XX-XXXXXXX" />
                                    </div>
                                  </div>
                                </div>

                                {/* Owner Information */}
                                <div className="space-y-4 pt-6 border-t border-border">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                      <Users className="h-4 w-4 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-foreground">Owner Information</h4>
                                  </div>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">Are you an Owner? *</label>
                                      <Select>
                                        <SelectTrigger className="h-12">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="yes">Yes</SelectItem>
                                          <SelectItem value="no">No</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">Social Security # *</label>
                                      <Input className="h-12" placeholder="XXX-XX-XXXX" type="password" />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Number of Business Owners</label>
                                    <Select>
                                      <SelectTrigger className="h-12 w-full md:w-1/2">
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4+">4 or more</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                {/* Authorizations */}
                                <div className="space-y-4 pt-6 border-t border-border">
                                  <div className="flex items-start gap-4 p-5 rounded-xl bg-primary/5 border border-primary/20">
                                    <Checkbox id="authorize" className="mt-1" />
                                    <label htmlFor="authorize" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                                      <span className="font-semibold text-foreground block mb-1">Authorize Soft Credit Inquiry *</span>
                                      By clicking submit I authorize {i18n.language === 'es' ? 'Ibercaja' : 'Innovative Lease Services, Inc.'} to perform a soft credit inquiry. This will not affect your credit score.
                                    </label>
                                  </div>

                                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      <span className="font-semibold text-foreground">SMS Consent:</span> By submitting this application, you agree to receive SMS text message notifications from {i18n.language === 'es' ? 'Ibercaja' : 'Innovative Lease Services, Inc.'} regarding your application status. Reply "STOP" to opt-out at any time.
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                                    <Checkbox id="recaptcha" />
                                    <label htmlFor="recaptcha" className="text-sm text-muted-foreground cursor-pointer">I'm not a robot</label>
                                    <div className="ml-auto text-xs text-muted-foreground px-3 py-1 bg-background rounded border border-border">reCAPTCHA</div>
                                  </div>
                                </div>

                                <Button className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all" size="lg">
                                  Submit Application
                                </Button>

                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                  <Shield className="h-4 w-4 text-primary" />
                                  <span>Your information is encrypted and secure</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default Checkout;