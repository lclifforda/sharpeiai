import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import robotFront from "@/assets/robot-front.png";
import robotScene1 from "@/assets/robot-scene-1.png";
import robotScene2 from "@/assets/robot-scene-2.png";
import bbvaLogo from "@/assets/bbva-logo.png";

const Checkout = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [downPayment, setDownPayment] = useState(5000);
  const [term, setTerm] = useState("24");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [insurance, setInsurance] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [warranty, setWarranty] = useState(false);

  const productImages = [robotFront, robotScene1, robotScene2];
  const monthlyPrice = 800;
  const totalPrice = 28999;

  const paymentOptions = [
    { term: "12 months", monthly: "$2,100", total: "$30,200" },
    { term: "24 months", monthly: "$800", total: "$31,200" },
    { term: "36 months", monthly: "$670", total: "$31,120" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Optimus</h1>
          <div className="flex items-center gap-6">
            <button className="text-sm text-muted-foreground hover:text-foreground">Support</button>
            <button className="text-sm text-muted-foreground hover:text-foreground">Account</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left - Product Images */}
            <div className="space-y-6">
              <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                <img 
                  src={productImages[selectedImage]} 
                  alt="Optimus Humanoid Robot" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Thumbnails */}
              <div className="grid grid-cols-3 gap-4">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? 'border-primary' 
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`View ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Product Features */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-foreground">Advanced Capabilities</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Autonomous Navigation</p>
                      <p className="text-xs text-muted-foreground">AI-powered movement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Object Recognition</p>
                      <p className="text-xs text-muted-foreground">Advanced computer vision</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Natural Language</p>
                      <p className="text-xs text-muted-foreground">Voice interaction</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Task Learning</p>
                      <p className="text-xs text-muted-foreground">Adaptive behavior</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Configuration */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-semibold text-foreground mb-2">Optimus</h2>
                
                {/* Product Specs */}
                <div className="flex items-center gap-8 mt-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-foreground">5.6 <span className="text-lg">ft</span></p>
                    <p className="text-xs text-muted-foreground">Height</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-foreground">160 <span className="text-lg">lbs</span></p>
                    <p className="text-xs text-muted-foreground">Weight</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-foreground">28 <span className="text-lg">DoF</span></p>
                    <p className="text-xs text-muted-foreground">Degrees of Freedom</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-semibold text-foreground">${monthlyPrice}</span>
                  <span className="text-lg text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${totalPrice.toLocaleString()} total price · Lease starting at ${monthlyPrice}/mo
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3 border-t border-border pt-8">
                <label className="text-sm font-medium text-foreground">Units</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="h-12 text-center text-lg font-semibold"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add-ons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Add-Ons</h3>
                
                <button
                  onClick={() => setInsurance(!insurance)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    insurance ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">Commercial Insurance</p>
                      <p className="text-sm text-muted-foreground">Full coverage protection</p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">+$150/mo</p>
                  </div>
                </button>

                <button
                  onClick={() => setMaintenance(!maintenance)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    maintenance ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">Maintenance Plan</p>
                      <p className="text-sm text-muted-foreground">Annual service & repairs</p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">+$200/mo</p>
                  </div>
                </button>

                <button
                  onClick={() => setWarranty(!warranty)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    warranty ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">Extended Warranty</p>
                      <p className="text-sm text-muted-foreground">5-year extended coverage</p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">+$100/mo</p>
                  </div>
                </button>
              </div>

              {/* Configuration Options */}
              <div className="space-y-6 border-t border-border pt-8">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Down Payment</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="pl-8 h-12 text-base"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Lease Term</label>
                  <Select value={term} onValueChange={setTerm}>
                    <SelectTrigger className="h-12 text-base">
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

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Edit Leasing Options →
                </button>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Payment Options</DialogTitle>
                      <DialogDescription>
                        Choose the term that works best for you
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                      {paymentOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setTerm(option.term.split(' ')[0]);
                            setIsModalOpen(false);
                          }}
                          className="w-full text-left p-4 rounded-lg border border-border hover:border-primary transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-foreground">{option.term}</p>
                              <p className="text-2xl font-bold text-primary mt-1">
                                {option.monthly}
                                <span className="text-sm font-normal text-muted-foreground">/mo</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Total</p>
                              <p className="text-sm font-semibold text-foreground">{option.total}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Estimated monthly payment based on ${downPayment.toLocaleString()} down. Final terms subject to credit approval.
                    </p>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Estimated Monthly Payment */}
              <div className="border border-border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Monthly Payment</p>
                    <p className="text-3xl font-semibold text-foreground mt-1">
                      ${monthlyPrice + (insurance ? 150 : 0) + (maintenance ? 200 : 0) + (warranty ? 100 : 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${downPayment.toLocaleString()} down · {term} months · 3.99% APR
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="space-y-2 pt-4">
                <Button className="w-full h-14 text-base font-semibold bg-foreground text-background hover:bg-foreground/90">
                  Apply Now
                </Button>
                <div className="flex items-center justify-center gap-2 py-2">
                  <img 
                    src={bbvaLogo} 
                    alt="BBVA" 
                    className="h-4"
                  />
                  <span className="text-xs text-muted-foreground">Powered by BBVA Commercial Leasing</span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-xs text-muted-foreground pt-4">
                <p>• Fully refundable order deposit</p>
                <p>• Estimated delivery: 6-12 months</p>
                <p>• All features subject to regulatory approval</p>
                <p className="pt-2 text-xs">
                  Monthly payment calculated with ${downPayment.toLocaleString()} down payment and {term}-month term at 3.99% APR. 
                  Final terms may vary based on creditworthiness and available financing at time of purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
