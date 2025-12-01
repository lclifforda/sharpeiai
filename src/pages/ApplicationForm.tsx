import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Minus, Upload, FileCheck, X, File } from "lucide-react";
import robotImage from "@/assets/humanoid-robot.png";
import { z } from "zod";
import ApplicationMethodSelector from "@/components/ApplicationMethodSelector";
import AIApplicationChat from "@/components/AIApplicationChat";

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

  const [selectedMethod, setSelectedMethod] = useState<"ai" | "traditional" | null>(null);
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

  const monthlyRate = 800;
  const maintenanceCost = 150;
  const insuranceCost = 200;

  const calculateTotal = () => {
    let total = monthlyRate * orderDetails.quantity;
    if (orderDetails.maintenance) total += maintenanceCost;
    if (orderDetails.insurance) total += insuranceCost;
    return total;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = () => {
    try {
      const dataToValidate = {
        applicantType,
        ...formData,
      };
      applicationSchema.parse(dataToValidate);
      // Form is valid - proceed with submission
      console.log("Form submitted successfully", dataToValidate);
      // Here you would typically send to backend
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side - Form */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* Company Details */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Company Details</h2>
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">VAT ID</Label>
                  <Input 
                    id="vatNumber"
                    placeholder="VAT number if applicable"
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

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-foreground hover:bg-foreground/90 text-background" 
              size="lg"
            >
              Continue
            </Button>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Order Summary</h2>
                
                {/* Product */}
                <div className="flex gap-4 pb-4 border-b border-border">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img src={robotImage} alt="Robot" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Humanoid Robot F-02</h3>
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
                  <h3 className="font-semibold text-foreground">Robot Extras</h3>
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
                    src="/src/assets/bbva-logo.png" 
                    alt="BBVA" 
                    className="h-4"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
