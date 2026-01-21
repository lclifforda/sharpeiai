import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, CheckCircle2, RotateCcw, ArrowUpCircle, Info, Plus, Minus } from "lucide-react";
import robotImage from "@/assets/humanoid-robot.png";
import robotAngle1 from "@/assets/robot-angle-1.png";
import robotAngle2 from "@/assets/robot-angle-2.png";
import ilsLogo from "@/assets/ils-logo.png";
import ibercajaLogo from "@/assets/ibercaja-logo.png";

const Checkout = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [downPayment, setDownPayment] = useState(299);
  const [term, setTerm] = useState("24");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [maintenance, setMaintenance] = useState(false);
  const [insurance, setInsurance] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

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
    { term: "12 months", monthly: "$1,200", apr: "3.5%", total: "$14,400" },
    { term: "24 months", monthly: "$800", apr: "3.9%", total: "$19,200" },
    { term: "36 months", monthly: "$650", apr: "4.2%", total: "$23,400" },
  ];

  const currentLogo = i18n.language === 'es' ? ibercajaLogo : ilsLogo;
  const logoAlt = i18n.language === 'es' ? 'Ibercaja' : 'Innovative Lease Services';

  return (
    <div className="min-h-screen p-6 space-y-6">
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
                                  {paymentOptions.map((option, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 px-3 rounded-md hover:bg-muted transition-colors">
                                      <span className="text-sm text-foreground">{option.term}</span>
                                      <div className="text-right">
                                        <span className="text-sm font-semibold text-primary">{option.monthly}/mo</span>
                                        <span className="text-xs text-muted-foreground ml-2">({option.apr} APR)</span>
                                      </div>
                                    </div>
                                  ))}
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
                            src={i18n.language === 'es' ? ibercajaLogo : ilsLogo} 
                            alt={i18n.language === 'es' ? 'Ibercaja' : 'ILS'} 
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
            </div>
          </TabsContent>

          {/* Bank Landing Preview Tab */}
          <TabsContent value="bank">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-start mb-6 bg-card rounded-t-lg p-4 border border-border">
                <img 
                  src={currentLogo} 
                  alt={logoAlt} 
                  className="h-10"
                />
                <div className="text-right">
                  <p className="text-primary font-bold text-lg">Apply Now!</p>
                  <p className="text-sm text-muted-foreground">Questions?</p>
                  <p className="text-sm">Call: <span className="text-primary">800-438-1470</span></p>
                  <p className="text-sm">Text: <span className="text-primary">562-236-1470</span></p>
                </div>
              </div>

              {/* Hero Banner */}
              <div className="w-full h-48 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground">Get Fast, Flexible Business Financing!</h2>
                  <p className="text-muted-foreground mt-2">Secure working capital or finance equipment with a quick, simple application</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Left Sidebar - Info */}
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-primary mb-3">Why Choose ILS?</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          Approvals in as little as 24 hours
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          Lease as little as $1,500
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          Simple, secure online application
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          We work with nearly all industries
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-primary mb-3">Application Process:</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>1. Fill out the form</li>
                        <li>2. Speak with your dedicated Finance Specialist</li>
                        <li>3. Get your funding</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Side - Application Form */}
                <div className="md:col-span-2">
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Product Interest *</label>
                          <Select>
                            <SelectTrigger>
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
                          <Input placeholder="Numbers only (no symbols or characters)" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Company *</label>
                          <Input />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">DBA</label>
                          <Input />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Business Address *</label>
                        <Input placeholder="Include City, State & Zip" />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Business Phone *</label>
                          <Input placeholder="Enter numbers only (no spaces, dashes or periods)" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Email *</label>
                          <Input type="email" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Time in Business *</label>
                          <Input placeholder="Years under Current Ownership (enter numbers only)" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Annual Revenue</label>
                          <Input />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">State of Incorporation</label>
                          <Input />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Federal Tax ID #</label>
                          <Input />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Number of Business Owners</label>
                        <Input />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Are you an Owner? *</label>
                          <Select>
                            <SelectTrigger>
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
                          <Input placeholder="Enter numbers only (no spaces, symbols or letters)" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Is there a Secondary Owner? *</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-border">
                        <div className="flex items-start gap-2">
                          <Checkbox id="authorize" />
                          <label htmlFor="authorize" className="text-sm text-muted-foreground">
                            <span className="font-medium">Authorize Soft Credit Inquiry *</span><br />
                            By clicking submit I authorize Innovative Lease Services, Inc. to perform a soft credit inquiry.
                          </label>
                        </div>
                      </div>

                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">SMS:</span> By submitting this application, you agree to receive SMS text message notifications from Innovative Lease Services, Inc. to the number provided at the time of enrollment purposes, lease application status, document requests and approval updates. Reply "STOP" to opt-out at any time or "HELP" for more information. Message frequency may vary. Msg & data rates may apply.
                        </p>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-muted rounded-md">
                        <Checkbox id="recaptcha" />
                        <label htmlFor="recaptcha" className="text-sm text-muted-foreground">I'm not a robot</label>
                        <div className="ml-auto text-xs text-muted-foreground">reCAPTCHA</div>
                      </div>

                      <Button className="w-full" size="lg">
                        Submit
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Checkout;
