import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Minus, Upload, FileCheck, X, File } from "lucide-react";
// Original product image (commented for rollback)
// import robotImage from "@/assets/humanoid-robot.png";
// LG Monitor product image
import monitorImage from "@/assets/lg-ultragear-monitors.png";
import { z } from "zod";
import ApplicationMethodSelector from "@/components/ApplicationMethodSelector";
import AIApplicationChat from "@/components/AIApplicationChat";
import FormAIAssistant from "@/components/FormAIAssistant";
import OfferCard from "@/components/OfferCard";
import ContractCard from "@/components/ContractCard";
import { simulateResiduals } from "@/services/ai/offerEngine";
import { generateCryptoId } from "@/lib/idGenerator";

// Validation schema
const applicationSchema = z.object({
  applicantType: z.enum(["company", "individual"]),
  companyName: z.string().min(1, "Company name is required").max(100),
  representativeName: z.string().min(1, "Representative name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  mobile: z.string().min(10, "Invalid mobile number").max(20),
  vatNumber: z.string().optional(),
  addressLine1: z.string().min(1, "Address is required").max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, "City is required").max(100),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required").max(20),
});

const ApplicationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state || {
    quantity: 1,
    maintenance: false,
    insurance: false,
    term: "24",
    downPayment: 299
  };

  const [selectedMethod, setSelectedMethod] = useState<"ai" | "traditional" | null>(
    location.state?.formType === "application" ? "traditional" : null
  );
  const [applicantType, setApplicantType] = useState<"company" | "individual">("company");
  const [formData, setFormData] = useState({
    companyName: "",
    representativeName: "",
    email: "",
    mobile: "",
    vatNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "United States",
    postalCode: "",
    billingMatchesShipping: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File | null>>({
    businessLicense: null,
    articlesOfIncorporation: null,
    taxReturn: null,
    profitLoss: null,
    bankStatements: null,
    equipmentQuote: null,
    personalGuarantee: null,
    insuranceCertificate: null,
  });
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  
  // Workflow state
  // Revenue step removed (commented for rollback)
  // const [currentStep, setCurrentStep] = useState<'info' | 'documents' | 'revenue' | 'offers' | 'contract' | 'complete'>('info');
  const [currentStep, setCurrentStep] = useState<'info' | 'documents' | 'offers' | 'contract' | 'complete'>('info');
  // Set default revenue to skip revenue step
  const [revenue, setRevenue] = useState<number | null>(500000); // Default to $500K
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [generatedOffers, setGeneratedOffers] = useState<any[]>([]);
  const [isGeneratingOffers, setIsGeneratingOffers] = useState(false);
  const [offerTypeFilter, setOfferTypeFilter] = useState<'financing' | 'lease'>('lease');

  const requiredDocuments = [
    { id: "businessLicense", name: "Business License", description: "State or local business license" },
    { id: "articlesOfIncorporation", name: "Articles of Incorporation", description: "Operating agreement or incorporation documents" },
    { id: "taxReturn", name: "Business Tax Return (Most Recent)", description: "Complete business tax return from last year" },
    { id: "profitLoss", name: "Profit & Loss Statement", description: "Year-to-date P&L statement" },
    { id: "bankStatements", name: "Bank Statements (6 months)", description: "Recent business bank statements" },
    { id: "equipmentQuote", name: "Equipment Quote/Invoice", description: "Vendor quote or purchase agreement" },
    { id: "personalGuarantee", name: "Personal Guarantee Form", description: "Signed personal guarantee from owner(s)" },
    { id: "insuranceCertificate", name: "Insurance Certificate", description: "Proof of equipment and liability insurance" },
  ];

  const handleFileUpload = (docId: string, file: File | null) => {
    setUploadedDocs(prev => ({ ...prev, [docId]: file }));
  };

  const handleRemoveFile = (docId: string) => {
    setUploadedDocs(prev => ({ ...prev, [docId]: null }));
  };

  const handleDragOver = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDraggedOver(docId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDraggedOver(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(docId, file);
    }
  };

  // Original product pricing (commented for rollback)
  // const monthlyRate = 800;
  // const maintenanceCost = 150;
  // const insuranceCost = 200;
  
  // LG Monitor product pricing from checkout-v2
  const monthlyRate = 60;
  const maintenanceCost = 10;
  const insuranceCost = 15;
  
  // Equipment purchase price (for financing/lease calculations)
  const equipmentPurchasePrice = 350; // $350 per monitor (retail price)

  const calculateTotal = () => {
    let total = monthlyRate * orderDetails.quantity;
    if (orderDetails.maintenance) total += maintenanceCost;
    if (orderDetails.insurance) total += insuranceCost;
    return total;
  };
  
  // For display in order summary (monthly)
  const cartTotal = calculateTotal();
  
  // For financing calculations (total purchase price)
  const equipmentTotal = equipmentPurchasePrice * orderDetails.quantity;
  
  // Helper: Calculate monthly payment
  const computeMonthly = (principal: number, apr: number, months: number) => {
    if (!apr || apr <= 0) return Math.ceil(principal / months);
    const r = apr / 100 / 12;
    const n = months;
    return Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };
  
  // Helper: Generate offers based on revenue
  const generateOffers = () => {
    // Use default revenue if not set (revenue step skipped)
    const revenueToUse = revenue || 500000;
    console.log('🎯 Generating offers with revenue:', revenueToUse);
    console.log('📊 Equipment total:', equipmentTotal, '($' + equipmentPurchasePrice + ' × ' + orderDetails.quantity + ')');
    
    setIsGeneratingOffers(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Calculate rate based on revenue (same logic as AIApplicationChat)
      let rate = 10.99;
      let lender = 'Standard Lender';
      
      if (revenueToUse > 250000) {
        rate = 0;
        lender = 'Premium Elite Lender';
      } else if (revenueToUse >= 120000) {
        rate = 7.99;
        lender = 'Preferred Lender';
      } else if (revenueToUse < 50000) {
        rate = 15.99;
        lender = 'Alt Lender';
      }
      
      const offers = [];
      const terms = [12, 24, 36];
      
      // Generate financing offers for each term
      terms.forEach(term => {
        const down = Math.min(equipmentTotal * 0.1, 500);
        const monthlyPayment = computeMonthly(Math.max(0, equipmentTotal - down), rate, term);
        const residuals = simulateResiduals([{ name: "24\" FHD 3-Side Borderless IPS Monitor", price: equipmentTotal }], term);
        
        offers.push({
          id: generateCryptoId(),
          type: 'financing',
          lender,
          apr: rate,
          termMonths: term,
          downPayment: down,
          monthlyPayment,
          totalAmount: equipmentTotal,
          residuals: residuals.residuals.map(r => ({
            name: r.name,
            percentage: Math.round(r.residualPct * 100),
            value: r.residualValue
          }))
        });
      });
      
      // Generate lease offers
      terms.forEach(term => {
        const depreciationFactor = 1.15;
        const monthlyPayment = Math.round((equipmentTotal * depreciationFactor) / term);
        const residuals = simulateResiduals([{ name: "24\" FHD 3-Side Borderless IPS Monitor", price: equipmentTotal }], term);
        
        offers.push({
          id: generateCryptoId(),
          type: 'lease',
          lender: 'Commercial Lease Co.',
          apr: 0,
          termMonths: term,
          downPayment: 0,
          monthlyPayment,
          totalAmount: equipmentTotal,
          residuals: residuals.residuals.map(r => ({
            name: r.name,
            percentage: Math.round(r.residualPct * 100),
            value: r.residualValue
          }))
        });
      });
      
      console.log('✅ Generated', offers.length, 'offers:', offers);
      setGeneratedOffers(offers);
      setIsGeneratingOffers(false);
      console.log('🔄 Setting currentStep to: offers');
      setCurrentStep('offers');
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = () => {
    console.log('🚀 handleSubmit called, currentStep:', currentStep);
    // Check if at least one document is uploaded
    const atLeastOneDocUploaded = Object.values(uploadedDocs).some(doc => doc !== null);
    console.log('📄 At least one doc uploaded:', atLeastOneDocUploaded);
    
    if (currentStep === 'info' || currentStep === 'documents') {
      // Validate form first
      try {
        const dataToValidate = {
          applicantType,
          ...formData,
        };
        applicationSchema.parse(dataToValidate);
        
        // Check if at least one document uploaded
        if (!atLeastOneDocUploaded) {
          alert('Please upload at least one document before continuing.');
          return;
        }
        
        // Revenue step skipped - go directly to offers
        // Set default revenue and generate offers directly
        if (!revenue) {
          setRevenue(500000); // Default to $500K
        }
        // Don't set step here - let generateOffers() do it after generating
        generateOffers();
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0].toString()] = err.message;
            }
          });
          setErrors(newErrors);
        }
      }
    }
  };

  // Show method selector if no method chosen
  if (!selectedMethod) {
    return <ApplicationMethodSelector onSelectMethod={setSelectedMethod} />;
  }

  // Show AI chat if AI method chosen
  if (selectedMethod === "ai") {
    return <AIApplicationChat />;
  }

  // Show traditional form
  console.log('🎨 Rendering with currentStep:', currentStep, 'generatedOffers:', generatedOffers.length, 'isGeneratingOffers:', isGeneratingOffers);
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/checkout")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Checkout
        </Button>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Leasing Application</h1>
          <p className="text-muted-foreground">Complete your information to finalize your lease</p>
        </div>

        {/* Progress Indicator */}
        {currentStep !== 'complete' && (
          <div className="mb-8 bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === 'info' || currentStep === 'documents' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  1
                </div>
                <span className={`text-sm font-medium ${
                  currentStep === 'info' || currentStep === 'documents' ? 'text-foreground' : 'text-muted-foreground'
                }`}>Info & Docs</span>
              </div>
              <div className="h-px flex-1 bg-border" />
              
              {/* Revenue step removed (commented for rollback) */}
              {/* <div className="h-px flex-1 bg-border" />
              <div className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === 'revenue' ? 'bg-primary text-primary-foreground' : 
                  ['offers', 'contract'].includes(currentStep) ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {['offers', 'contract'].includes(currentStep) ? '✓' : '2'}
                </div>
                <span className={`text-sm font-medium ${
                  currentStep === 'revenue' ? 'text-foreground' : 'text-muted-foreground'
                }`}>Revenue</span>
              </div> */}
              <div className="h-px flex-1 bg-border" />
              
              {/* Step 2 (was Step 3) */}
              <div className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === 'offers' ? 'bg-primary text-primary-foreground' : 
                  currentStep === 'contract' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep === 'contract' ? '✓' : '2'}
                </div>
                <span className={`text-sm font-medium ${
                  currentStep === 'offers' ? 'text-foreground' : 'text-muted-foreground'
                }`}>Offers</span>
              </div>
              <div className="h-px flex-1 bg-border" />
              
              {/* Step 3 (was Step 4) */}
              <div className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === 'contract' ? 'bg-primary text-primary-foreground' : 
                  currentStep === 'complete' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep === 'complete' ? '✓' : '3'}
                </div>
                <span className={`text-sm font-medium ${
                  currentStep === 'contract' || currentStep === 'complete' ? 'text-foreground' : 'text-muted-foreground'
                }`}>Sign</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info and Documents Steps */}
            {(currentStep === 'info' || currentStep === 'documents') && (
              <>
            {/* Applicant Type */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-4 block">I am a:</Label>
                <RadioGroup value={applicantType} onValueChange={(value) => setApplicantType(value as "company" | "individual")}>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company" className="cursor-pointer">Company</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="cursor-pointer">Individual</Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input 
                      id="companyName"
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      className={errors.companyName ? "border-destructive" : ""}
                    />
                    {errors.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="representativeName">Representative Name *</Label>
                    <Input 
                      id="representativeName"
                      placeholder="Full name of representative"
                      value={formData.representativeName}
                      onChange={(e) => handleInputChange("representativeName", e.target.value)}
                      className={errors.representativeName ? "border-destructive" : ""}
                    />
                    {errors.representativeName && <p className="text-xs text-destructive">{errors.representativeName}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="email@company.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile *</Label>
                    <Input 
                      id="mobile"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      className={errors.mobile ? "border-destructive" : ""}
                    />
                    {errors.mobile && <p className="text-xs text-destructive">{errors.mobile}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Details / Individual Details */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {applicantType === 'company' ? 'Company Details' : 'Individual Details'}
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">
                    {applicantType === 'company' 
                      ? 'EIN (Employer Identification Number)' 
                      : 'SSN (Social Security Number)'}
                  </Label>
                  <Input 
                    id="vatNumber"
                    placeholder={applicantType === 'company' ? 'XX-XXXXXXX' : 'XXX-XX-XXXX'}
                    value={formData.vatNumber}
                    onChange={(e) => handleInputChange("vatNumber", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input 
                      id="addressLine1"
                      placeholder="Street address, P.O. box"
                      value={formData.addressLine1}
                      onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                      className={errors.addressLine1 ? "border-destructive" : ""}
                    />
                    {errors.addressLine1 && <p className="text-xs text-destructive">{errors.addressLine1}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input 
                      id="addressLine2"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      value={formData.addressLine2}
                      onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                        <SelectTrigger id="country">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Mexico">Mexico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal/ZIP Code *</Label>
                      <Input 
                        id="postalCode"
                        placeholder="Postal or ZIP code"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        className={errors.postalCode ? "border-destructive" : ""}
                      />
                      {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                      id="billingMatch" 
                      checked={formData.billingMatchesShipping}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, billingMatchesShipping: checked as boolean }))}
                    />
                    <label htmlFor="billingMatch" className="text-sm text-muted-foreground cursor-pointer">
                      The billing address matches the shipping address.
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">Required Documents for Lease</h2>
                  <p className="text-sm text-muted-foreground">Upload the following documents to complete your application</p>
                </div>
                
                <div className="space-y-4">
                  {requiredDocuments.map((doc, index) => {
                    const isUploaded = !!uploadedDocs[doc.id];
                    const isDragging = draggedOver === doc.id;
                    const uploadedCount = Object.values(uploadedDocs).filter(Boolean).length;
                    const shouldShow = index <= uploadedCount;
                    
                    if (!shouldShow) return null;
                    
                    return (
                      <div
                        key={doc.id}
                        onDragOver={(e) => handleDragOver(e, doc.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, doc.id)}
                        className={`group relative rounded-lg border-2 border-dashed transition-all duration-300 animate-fade-in ${
                          isUploaded 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : isDragging
                            ? 'border-primary bg-primary/10 scale-[1.02]'
                            : 'border-border hover:border-primary/50 hover:bg-accent/50'
                        }`}
                      >
                        <div className="p-5">
                          <div className="flex items-start gap-4">
                            {/* Icon/Status */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                              isUploaded 
                                ? 'bg-primary text-primary-foreground scale-110' 
                                : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                            }`}>
                              {isUploaded ? (
                                <FileCheck className="w-6 h-6 animate-scale-in" />
                              ) : (
                                <File className="w-6 h-6" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-muted-foreground">
                                  {index + 1} / {requiredDocuments.length}
                                </span>
                                <h3 className="font-semibold text-foreground">{doc.name}</h3>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                              
                              {isUploaded ? (
                                <div className="flex items-center gap-2 animate-fade-in">
                                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-background rounded-md border border-border">
                                    <File className="w-4 h-4 text-primary flex-shrink-0" />
                                    <span className="text-sm text-foreground truncate">{uploadedDocs[doc.id]?.name}</span>
                                    <span className="text-xs text-muted-foreground flex-shrink-0">
                                      {uploadedDocs[doc.id] && (uploadedDocs[doc.id]!.size / 1024).toFixed(1)} KB
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveFile(doc.id)}
                                    className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground">
                                  PDF, DOC, DOCX, JPG, PNG • Max 10MB
                                </div>
                              )}
                            </div>

                            {/* Upload Button */}
                            {!isUploaded && (
                              <label htmlFor={`file-${doc.id}`} className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-sm">
                                  <Upload className="w-4 h-4" />
                                  <span className="text-sm font-medium">Upload</span>
                                </div>
                                <input
                                  id={`file-${doc.id}`}
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  onChange={(e) => handleFileUpload(doc.id, e.target.files?.[0] || null)}
                                />
                              </label>
                            )}
                            
                            {isUploaded && (
                              <label htmlFor={`file-${doc.id}`} className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-accent transition-colors">
                                  <Upload className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-medium text-foreground">Replace</span>
                                </div>
                                <input
                                  id={`file-${doc.id}`}
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  onChange={(e) => handleFileUpload(doc.id, e.target.files?.[0] || null)}
                                />
                              </label>
                            )}
                          </div>
                        </div>

                        {/* Drag overlay */}
                        {isDragging && (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg backdrop-blur-sm animate-fade-in">
                            <div className="text-center">
                              <Upload className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
                              <p className="text-sm font-medium text-primary">Drop file here</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Upload Summary */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm text-muted-foreground">
                      {Object.values(uploadedDocs).filter(Boolean).length} of {requiredDocuments.length} documents uploaded
                    </span>
                  </div>
                  {Object.values(uploadedDocs).filter(Boolean).length === requiredDocuments.length && (
                    <div className="flex items-center gap-2 text-primary animate-fade-in">
                      <FileCheck className="w-4 h-4" />
                      <span className="text-sm font-medium">All documents uploaded</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button (only show on info/documents steps) */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-foreground hover:bg-foreground/90 text-background" 
              size="lg"
            >
              Continue
            </Button>
              </>
            )}
            
            {/* Offers Selection Step */}
            {currentStep === 'offers' && (
              <Card>
                <CardContent className="p-6 space-y-6">
                  {console.log('🎯 OFFERS SECTION RENDERING! generatedOffers:', generatedOffers)}
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Your Personalized Offers</h2>
                    <p className="text-muted-foreground">Choose the financing option that works best for your business</p>
                    
                    {/* Financing/Leasing Toggle */}
                    <div className="flex items-center justify-center gap-2 p-1 bg-muted rounded-lg inline-flex">
                      <button
                        onClick={() => setOfferTypeFilter('financing')}
                        className={`px-6 py-2 rounded-md font-medium transition-all ${
                          offerTypeFilter === 'financing'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Financing
                      </button>
                      <button
                        onClick={() => setOfferTypeFilter('lease')}
                        className={`px-6 py-2 rounded-md font-medium transition-all ${
                          offerTypeFilter === 'lease'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Leasing
                      </button>
                    </div>
                  </div>

                  {isGeneratingOffers ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                      <p className="text-lg font-medium text-foreground">Analyzing your information...</p>
                      <p className="text-sm text-muted-foreground">Generating personalized offers</p>
                    </div>
                  ) : generatedOffers.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-lg text-muted-foreground">No offers available. Please try again.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {generatedOffers
                        .filter(offer => offer.type === offerTypeFilter)
                        .map((offer) => (
                          <OfferCard
                            key={offer.id}
                            offer={offer}
                            selected={selectedOffer?.id === offer.id}
                            onSelect={() => setSelectedOffer(offer)}
                          />
                        ))}
                    </div>
                  )}

                  <Button
                    onClick={() => setCurrentStep('contract')}
                    disabled={!selectedOffer}
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
                    size="lg"
                  >
                    Continue to Contract
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Contract Signature Step */}
            {currentStep === 'contract' && selectedOffer && (
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">Review & Sign Contract</h2>
                    <p className="text-muted-foreground">Please review your financing agreement and sign below</p>
                  </div>

                  <ContractCard
                    offer={selectedOffer}
                    onSign={() => setCurrentStep('complete')}
                  />
                </CardContent>
              </Card>
            )}

            {/* Completion Step */}
            {currentStep === 'complete' && selectedOffer && (
              <Card>
                <CardContent className="p-8 space-y-6 text-center">
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-foreground">Thank You for Your Order!</h2>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                      Your order has been successfully placed and your financing is approved.
                    </p>
                  </div>

                  <div className="bg-accent/50 rounded-lg p-6 space-y-3 text-left">
                    <h3 className="font-semibold text-lg">Delivery Information</h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4">
                      <p className="text-lg font-bold text-blue-800 dark:text-blue-300">
                        🚚 You should receive your products in 5-7 business days
                      </p>
                    </div>
                    <ul className="space-y-2 text-muted-foreground mt-4">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Confirmation email sent to your inbox</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Tracking information will be provided once shipped</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Your first payment will be due in 30 days</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <p className="font-semibold">Your Selected Offer:</p>
                      <p>{selectedOffer.type === 'financing' ? 'Financing' : 'Lease'} - {selectedOffer.term} months</p>
                      <p className="text-xl font-bold text-primary mt-1">${selectedOffer.monthlyPayment.toFixed(2)}/month</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-foreground hover:bg-foreground/90 text-background"
                    size="lg"
                  >
                    Return to Home
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Order Summary</h2>
                
                {/* Product */}
                <div className="flex gap-4 pb-4 border-b border-border">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {/* Original product image (commented for rollback) */}
                    {/* <img src={robotImage} alt="Robot" className="w-full h-full object-cover" /> */}
                    {/* LG Monitor product image */}
                    <img src={monitorImage} alt="LG Monitor" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    {/* Original product name (commented for rollback) */}
                    {/* <h3 className="font-medium text-foreground">Humanoid Robot F-02</h3> */}
                    {/* LG Monitor product name */}
                    <h3 className="font-medium text-foreground">24" FHD 3-Side Borderless IPS Monitor</h3>
                    <p className="text-sm text-muted-foreground">${monthlyRate}/mo per unit</p>
                  </div>
                </div>

                {/* Quantity and Term */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Quantity</span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-semibold">{orderDetails.quantity}</span>
                    </div>
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

                {/* Services */}
                <div className="space-y-3 border-t border-border pt-4">
                  <h3 className="font-semibold text-foreground">Services</h3>
                  <div className={`p-3 rounded-lg border-2 transition-all ${orderDetails.maintenance ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">Maintenance Pack</p>
                        <p className="text-xs text-muted-foreground mt-1">${maintenanceCost}/mo</p>
                      </div>
                      <Switch checked={orderDetails.maintenance} disabled />
                    </div>
                  </div>
                </div>

                {/* Add-ons */}
                <div className="space-y-3 border-t border-border pt-4">
                  {/* Original section title (commented for rollback) */}
                  {/* <h3 className="font-semibold text-foreground">Robot Extras</h3> */}
                  {/* Updated section title */}
                  <h3 className="font-semibold text-foreground">Equipment Extras</h3>
                  <div className={`p-3 rounded-lg border-2 transition-all ${orderDetails.insurance ? 'border-primary bg-primary/5' : 'border-border'}`}>
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

                {/* Totals */}
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

                {/* Grand Total */}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="font-bold text-foreground">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">${calculateTotal()}.00</p>
                    <p className="text-xs text-muted-foreground">Monthly, Annual Insurance, plus shipping & tax</p>
                  </div>
                </div>

                {/* Powered By */}
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">Powered by</span>
                  <img 
                    src="/bbva-logo.png" 
                    alt="BBVA" 
                    className="h-4"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* AI Assistant - Always visible */}
      <FormAIAssistant
        currentStep={currentStep}
        formContext={{
          companyName: formData.companyName,
          revenue: revenue || undefined,
          documentsUploaded: Object.values(uploadedDocs).filter(Boolean).length,
          selectedOffer: selectedOffer || undefined
        }}
      />
    </div>
  );
};

export default ApplicationForm;
