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
  // Removed bankApplicationMethod state - now using AI Copilot only
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
            <div className="max-w-5xl mx-auto">
              {/* Immersive Hero with Orb */}
              <div className="relative overflow-hidden rounded-t-2xl">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                
                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>
                
                {/* Gradient Orbs Background */}
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl" />
                
                {/* Content */}
                <div className="relative z-10 px-6 py-8 md:px-12 md:py-12">
                  {/* Top Bar */}
                  <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
                        <img src={currentLogo} alt={logoAlt} className="h-7 brightness-0 invert" />
                      </div>
                      <div className="hidden md:block">
                        <p className="text-white/60 text-sm font-medium">Business Financing</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex items-center gap-4 text-white/70 text-sm">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                          <Phone className="h-3.5 w-3.5" />
                          <span>800-438-1470</span>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI-Powered
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Hero Content with Orb */}
                  <div className="text-center max-w-3xl mx-auto">
                    {/* Floating Orb */}
                    <div className="relative w-28 h-28 mx-auto mb-8 animate-float">
                      {/* Outer glow rings */}
                      <div className="absolute inset-0 rounded-full gradient-sharpei opacity-30 blur-3xl animate-pulse-glow" />
                      <div className="absolute inset-4 rounded-full gradient-sharpei opacity-40 blur-2xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
                      
                      {/* Main orb */}
                      <div className="relative w-full h-full rounded-full gradient-sharpei shadow-glow">
                        {/* Inner highlight */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
                        {/* Shine effect */}
                        <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/50 blur-md" />
                        {/* Center icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MessageSquare className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">
                        Your AI Financing
                      </span>
                      <br />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
                        Copilot
                      </span>
                    </h1>
                    
                    <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto leading-relaxed">
                      Complete your business financing application in minutes with our AI-powered assistant. Fast, secure, and effortless.
                    </p>
                    
                    {/* Trust Pills */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                      {[
                        { icon: Shield, text: "Bank-Grade Security" },
                        { icon: Zap, text: "24hr Decisions" },
                        { icon: Clock, text: "5 Min Application" },
                        { icon: Users, text: "10,000+ Approved" }
                      ].map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm text-white/80"
                        >
                          <item.icon className="h-4 w-4 text-blue-400" />
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Pulsing indicator */}
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="bg-background border border-t-0 border-border rounded-b-2xl overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="max-w-3xl mx-auto">
                    {/* Copilot Status Bar */}
                    <div className="flex items-center justify-between p-4 mb-6 rounded-xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 border border-border">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl gradient-sharpei flex items-center justify-center shadow-lg">
                            <MessageSquare className="w-5 h-5 text-white" />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">Application Copilot</p>
                          <p className="text-xs text-muted-foreground">Ready to assist you</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground">
                          <Shield className="h-3 w-3" />
                          <span>Encrypted</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-xs text-green-600 dark:text-green-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span>Online</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Application Chat */}
                    <AIApplicationChat />
                    
                    {/* Bottom Trust Bar */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Shield className="h-3.5 w-3.5 text-primary" />
                          <span>256-bit SSL encryption</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                        <div className="flex items-center gap-1.5">
                          <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                          <span>SOC 2 Compliant</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                        <div className="flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-primary" />
                          <span>Soft credit check only</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default Checkout;