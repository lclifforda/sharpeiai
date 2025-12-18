import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Building2, Package, Calendar, DollarSign, CheckCircle2, Plus, Minus, X, Search, ChevronDown } from "lucide-react";
import { z } from "zod";
import { generateCryptoId } from "@/lib/idGenerator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

// Mock data - in production, fetch from API
const allCompanies = [
  { 
    id: "1",
    name: "TechCorp Industries", 
    industry: "Manufacturing", 
    location: "San Francisco, CA",
    representatives: 2,
    activeContracts: 3,
    revenue: "$45,000",
    status: "active" 
  },
  { 
    id: "2",
    name: "DataFlow Systems", 
    industry: "Logistics", 
    location: "Austin, TX",
    representatives: 1,
    activeContracts: 2,
    revenue: "$28,500",
    status: "active" 
  },
  { 
    id: "3",
    name: "SmartFactory Inc", 
    industry: "Manufacturing", 
    location: "Detroit, MI",
    representatives: 3,
    activeContracts: 4,
    revenue: "$62,000",
    status: "active" 
  },
  { 
    id: "4",
    name: "AutoMotive Solutions", 
    industry: "Automotive", 
    location: "Chicago, IL",
    representatives: 1,
    activeContracts: 1,
    revenue: "$18,000",
    status: "inactive" 
  },
  { 
    id: "5",
    name: "AgriTech Farms", 
    industry: "Agriculture", 
    location: "Des Moines, IA",
    representatives: 2,
    activeContracts: 2,
    revenue: "$35,000",
    status: "active" 
  },
];

const allEquipment = [
  { id: "cnc-milling-machine", name: "CNC Milling Machine", category: "Manufacturing", quantity: 5, available: 3, value: "$125K/unit", location: "Warehouse A" },
  { id: "mri-scanner", name: "MRI Scanner", category: "Medical", quantity: 2, available: 1, value: "$890K/unit", location: "Medical Depot" },
  { id: "excavator-cat-320", name: "Excavator CAT 320", category: "Construction", quantity: 8, available: 6, value: "$75K/unit", location: "Warehouse B" },
  { id: "server-rack-dell", name: "Server Rack Dell", category: "IT Hardware", quantity: 15, available: 12, value: "$25K/unit", location: "Tech Center" },
  { id: "iot-sensor-kit", name: "IoT Sensor Kit", category: "IT Hardware", quantity: 20, available: 15, value: "$1.5K/unit", location: "Tech Center" },
  { id: "edge-computing", name: "Edge Computing Device", category: "IT Hardware", quantity: 10, available: 8, value: "$2.5K/unit", location: "Tech Center" },
];

interface EquipmentItem {
  id: string;
  name: string;
  model?: string;
  quantity: number;
  monthlyRate: number;
}

// Validation schema
const contractSchema = z.object({
  companyId: z.string().min(1, "Company selection is required"),
  contractType: z.enum(["Equipment Lease", "Finance Agreement"], {
    required_error: "Contract type is required",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  termMonths: z.number().min(1, "Term is required"),
  equipment: z.array(z.object({
    id: z.string(),
    name: z.string(),
    model: z.string().optional(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    monthlyRate: z.number().min(0.01, "Monthly rate must be greater than 0"),
  })).min(1, "At least one equipment item is required"),
  paymentFrequency: z.enum(["Monthly", "Quarterly", "Annually"]),
  paymentAmount: z.number().min(0.01, "Payment amount must be greater than 0"),
  securityDeposit: z.number().min(0).optional(),
  lateFeePercentage: z.number().min(0).max(100).optional(),
  autoRenew: z.boolean(),
  renewalTerms: z.string().optional(),
  notes: z.string().optional(),
  contractValue: z.number().min(0.01, "Contract value must be greater than 0"),
});

type ContractFormData = z.infer<typeof contractSchema>;

const ContractCreate = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<ContractFormData>>({
    companyId: "",
    contractType: "Equipment Lease",
    startDate: undefined,
    termMonths: 12,
    equipment: [],
    paymentFrequency: "Monthly",
    paymentAmount: 0,
    securityDeposit: 0,
    lateFeePercentage: 5,
    autoRenew: false,
    renewalTerms: "",
    notes: "",
    contractValue: 0,
  });

  const [companySearchQuery, setCompanySearchQuery] = useState("");
  const [isCompanyPopoverOpen, setIsCompanyPopoverOpen] = useState(false);

  // Filter companies based on search query
  const filteredCompanies = useMemo(() => {
    if (!companySearchQuery.trim()) return allCompanies;
    const query = companySearchQuery.toLowerCase();
    return allCompanies.filter(
      company =>
        company.name.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query) ||
        company.location.toLowerCase().includes(query)
    );
  }, [companySearchQuery]);

  // Calculate end date from start date and term
  const endDate = useMemo(() => {
    if (!formData.startDate || !formData.termMonths) return undefined;
    const end = new Date(formData.startDate);
    end.setMonth(end.getMonth() + formData.termMonths);
    return end;
  }, [formData.startDate, formData.termMonths]);

  const selectedCompany = useMemo(() => {
    return allCompanies.find(c => c.id === formData.companyId);
  }, [formData.companyId]);

  const totalMonthlyRate = useMemo(() => {
    if (!formData.equipment || formData.equipment.length === 0) return 0;
    return formData.equipment.reduce((sum, item) => sum + (item.quantity * item.monthlyRate), 0);
  }, [formData.equipment]);

  // Auto-calculate payment amount and contract value when equipment changes
  useMemo(() => {
    if (formData.equipment && formData.equipment.length > 0) {
      const monthly = totalMonthlyRate;
      let paymentAmount = monthly;
      
      if (formData.paymentFrequency === "Quarterly") {
        paymentAmount = monthly * 3;
      } else if (formData.paymentFrequency === "Annually") {
        paymentAmount = monthly * 12;
      }

      const termMonths = formData.termMonths || 12;
      setFormData(prev => ({
        ...prev,
        paymentAmount,
        contractValue: monthly * termMonths,
      }));
    }
  }, [totalMonthlyRate, formData.paymentFrequency, formData.termMonths]);

  const handleAddEquipment = (equipmentId: string) => {
    const equipment = allEquipment.find(e => e.id === equipmentId);
    if (!equipment) return;

    const existingIndex = formData.equipment?.findIndex(e => e.id === equipmentId) ?? -1;
    
    if (existingIndex >= 0) {
      // Update quantity if already exists
      const updated = [...(formData.equipment || [])];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
      };
      setFormData(prev => ({ ...prev, equipment: updated }));
    } else {
      // Add new equipment
      const newItem: EquipmentItem = {
        id: equipment.id,
        name: equipment.name,
        model: equipment.category,
        quantity: 1,
        monthlyRate: 0,
      };
      setFormData(prev => ({
        ...prev,
        equipment: [...(prev.equipment || []), newItem],
      }));
    }
  };

  const handleRemoveEquipment = (equipmentId: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment?.filter(e => e.id !== equipmentId) || [],
    }));
  };

  const handleUpdateEquipment = (equipmentId: string, field: 'quantity' | 'monthlyRate', value: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment?.map(e => 
        e.id === equipmentId ? { ...e, [field]: value } : e
      ) || [],
    }));
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.companyId) stepErrors.companyId = "Company selection is required";
      if (!formData.contractType) stepErrors.contractType = "Contract type is required";
      if (!formData.startDate) stepErrors.startDate = "Start date is required";
      if (!formData.termMonths || formData.termMonths <= 0) stepErrors.termMonths = "Term is required";
    }

    if (step === 2) {
      if (!formData.equipment || formData.equipment.length === 0) {
        stepErrors.equipment = "At least one equipment item is required";
      } else {
        formData.equipment.forEach((item, index) => {
          if (item.quantity < 1) {
            stepErrors[`equipment.${index}.quantity`] = "Quantity must be at least 1";
          }
          if (item.monthlyRate <= 0) {
            stepErrors[`equipment.${index}.monthlyRate`] = "Monthly rate must be greater than 0";
          }
        });
      }
    }

    if (step === 3) {
      if (!formData.paymentAmount || formData.paymentAmount <= 0) {
        stepErrors.paymentAmount = "Payment amount must be greater than 0";
      }
      if (formData.lateFeePercentage !== undefined && (formData.lateFeePercentage < 0 || formData.lateFeePercentage > 100)) {
        stepErrors.lateFeePercentage = "Late fee percentage must be between 0 and 100";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const generateContractId = (): string => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CNT-${year}-${random}`;
  };

  const generatePaymentSchedule = (startDate: Date, endDate: Date, frequency: string, amount: number) => {
    const schedule: Array<{ id: string; dueDate: string; amount: number; status: 'pending' }> = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    const dayOfMonth = startDate.getDate();
    let paymentId = 1;

    // Set first payment date (typically 15 days after start, or same day of month)
    // For simplicity, we'll use the 15th of each month
    currentDate.setDate(15);
    if (currentDate < startDate) {
      // If 15th is before start date, move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    while (currentDate <= end) {
      schedule.push({
        id: paymentId.toString(),
        dueDate: format(currentDate, 'yyyy-MM-dd'),
        amount,
        status: 'pending',
      });

      // Move to next payment date
      if (frequency === "Monthly") {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else if (frequency === "Quarterly") {
        currentDate.setMonth(currentDate.getMonth() + 3);
      } else if (frequency === "Annually") {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
      paymentId++;
    }

    return schedule;
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    try {
      // Calculate end date before validation
      if (!formData.startDate || !formData.termMonths) {
        setErrors({ submit: "Start date and term are required" });
        return;
      }

      const calculatedEndDate = new Date(formData.startDate);
      calculatedEndDate.setMonth(calculatedEndDate.getMonth() + formData.termMonths);

      // Validate the form data
      const validatedData = contractSchema.parse(formData);
      setIsSubmitting(true);

      // Generate contract ID
      const contractId = generateContractId();

      // Generate payment schedule
      const paymentSchedule = generatePaymentSchedule(
        validatedData.startDate,
        calculatedEndDate,
        validatedData.paymentFrequency,
        validatedData.paymentAmount
      );

      // In a real app, this would be an API call
      // For now, we'll just navigate to the contract detail page
      // The contract detail page will need to handle the new contract data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to contract detail page
      navigate(`/contracts/${contractId}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            zodErrors[err.path.join('.')] = err.message;
          }
        });
        setErrors(zodErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <Link to="/contracts" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Contracts
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Create New Contract</h1>
        <p className="text-muted-foreground mt-1">Fill in the details to create a new contract</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === step
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
              </div>
              <div className="ml-2 hidden sm:block">
                <p className={`text-sm font-medium ${currentStep >= step ? "text-foreground" : "text-muted-foreground"}`}>
                  {step === 1 && "Company & Type"}
                  {step === 2 && "Equipment"}
                  {step === 3 && "Terms"}
                  {step === 4 && "Review"}
                </p>
              </div>
            </div>
            {step < 4 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step ? "bg-success" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Company & Type */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Company & Contract Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Popover open={isCompanyPopoverOpen} onOpenChange={setIsCompanyPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isCompanyPopoverOpen}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {selectedCompany ? (
                        <>
                          <Building2 className="w-4 h-4 shrink-0" />
                          <span className="truncate">{selectedCompany.name}</span>
                          <span className="text-muted-foreground shrink-0">({selectedCompany.industry})</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Search and select a company...</span>
                      )}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Search companies..."
                      value={companySearchQuery}
                      onChange={(e) => setCompanySearchQuery(e.target.value)}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredCompanies.length === 0 ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        No companies found.
                      </div>
                    ) : (
                      <div className="p-1">
                        {filteredCompanies.map((company) => (
                          <button
                            key={company.id}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, companyId: company.id }));
                              setErrors(prev => ({ ...prev, companyId: "" }));
                              setIsCompanyPopoverOpen(false);
                              setCompanySearchQuery("");
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                              formData.companyId === company.id ? "bg-accent" : ""
                            }`}
                          >
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <div className="flex-1 text-left">
                              <p className="font-medium">{company.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {company.industry} • {company.location}
                              </p>
                            </div>
                            {formData.companyId === company.id && (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              {errors.companyId && <p className="text-sm text-destructive">{errors.companyId}</p>}
              {selectedCompany && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{selectedCompany.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedCompany.location} • {selectedCompany.industry}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Contract Type *</Label>
              <RadioGroup
                value={formData.contractType}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, contractType: value as "Equipment Lease" | "Finance Agreement" }));
                  setErrors(prev => ({ ...prev, contractType: "" }));
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Equipment Lease" id="lease" />
                  <Label htmlFor="lease" className="font-normal cursor-pointer">Equipment Lease</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Finance Agreement" id="finance" />
                  <Label htmlFor="finance" className="font-normal cursor-pointer">Finance Agreement</Label>
                </div>
              </RadioGroup>
              {errors.contractType && <p className="text-sm text-destructive">{errors.contractType}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!formData.startDate && "text-muted-foreground"}`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, startDate: date }));
                        setErrors(prev => ({ ...prev, startDate: "" }));
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="termMonths">Term (Months) *</Label>
                <Select
                  value={formData.termMonths?.toString()}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, termMonths: parseInt(value) }));
                    setErrors(prev => ({ ...prev, termMonths: "" }));
                  }}
                >
                  <SelectTrigger id="termMonths">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                  </SelectContent>
                </Select>
                {errors.termMonths && <p className="text-sm text-destructive">{errors.termMonths}</p>}
              </div>
            </div>

            {formData.startDate && endDate && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">End Date (Calculated)</p>
                    <p className="text-sm text-muted-foreground">
                      {format(endDate, "PPP")} ({formData.termMonths} months from start)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Equipment */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Equipment Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Add Equipment</Label>
              <Select onValueChange={handleAddEquipment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment to add" />
                </SelectTrigger>
                <SelectContent>
                  {allEquipment.map((equipment) => {
                    const isAdded = formData.equipment?.some(e => e.id === equipment.id);
                    return (
                      <SelectItem 
                        key={equipment.id} 
                        value={equipment.id}
                        disabled={isAdded}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <p className="font-medium">{equipment.name}</p>
                            <p className="text-xs text-muted-foreground">{equipment.category} • {equipment.available} available</p>
                          </div>
                          {isAdded && <Badge variant="outline">Added</Badge>}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.equipment && <p className="text-sm text-destructive">{errors.equipment}</p>}
            </div>

            {formData.equipment && formData.equipment.length > 0 && (
              <div className="space-y-4">
                <Label>Selected Equipment</Label>
                {formData.equipment.map((item) => {
                  const equipment = allEquipment.find(e => e.id === item.id);
                  return (
                    <Card key={item.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="w-4 h-4 text-muted-foreground" />
                              <h4 className="font-semibold">{item.name}</h4>
                            </div>
                            {equipment && (
                              <p className="text-sm text-muted-foreground">
                                {equipment.category} • {equipment.available} available
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveEquipment(item.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`qty-${item.id}`}>Quantity</Label>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    handleUpdateEquipment(item.id, 'quantity', item.quantity - 1);
                                  }
                                }}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <Input
                                id={`qty-${item.id}`}
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 1;
                                  handleUpdateEquipment(item.id, 'quantity', Math.max(1, value));
                                }}
                                className="text-center"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  handleUpdateEquipment(item.id, 'quantity', item.quantity + 1);
                                }}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`rate-${item.id}`}>Monthly Rate ($)</Label>
                            <Input
                              id={`rate-${item.id}`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.monthlyRate}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                handleUpdateEquipment(item.id, 'monthlyRate', value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground">
                            Subtotal: <span className="font-semibold text-foreground">
                              ${(item.quantity * item.monthlyRate).toLocaleString()}/month
                            </span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Monthly Rate:</span>
                    <span className="text-xl font-bold gradient-sharpei-text">
                      ${totalMonthlyRate.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Terms */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Contract Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="paymentFrequency">Payment Frequency *</Label>
              <Select
                value={formData.paymentFrequency}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, paymentFrequency: value as "Monthly" | "Quarterly" | "Annually" }));
                }}
              >
                <SelectTrigger id="paymentFrequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Payment Amount ($) *</Label>
              <Input
                id="paymentAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.paymentAmount || 0}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFormData(prev => ({ ...prev, paymentAmount: value }));
                  setErrors(prev => ({ ...prev, paymentAmount: "" }));
                }}
              />
              {errors.paymentAmount && <p className="text-sm text-destructive">{errors.paymentAmount}</p>}
              <p className="text-xs text-muted-foreground">
                Auto-calculated from equipment. You can adjust manually.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
                <Input
                  id="securityDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.securityDeposit || 0}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setFormData(prev => ({ ...prev, securityDeposit: value }));
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lateFeePercentage">Late Fee Percentage (%)</Label>
                <Input
                  id="lateFeePercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.lateFeePercentage || 0}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setFormData(prev => ({ ...prev, lateFeePercentage: value }));
                    setErrors(prev => ({ ...prev, lateFeePercentage: "" }));
                  }}
                />
                {errors.lateFeePercentage && <p className="text-sm text-destructive">{errors.lateFeePercentage}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoRenew">Auto-Renewal</Label>
                  <p className="text-sm text-muted-foreground">Automatically renew contract at end of term</p>
                </div>
                <Switch
                  id="autoRenew"
                  checked={formData.autoRenew}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({ ...prev, autoRenew: checked }));
                  }}
                />
              </div>

              {formData.autoRenew && (
                <div className="space-y-2">
                  <Label htmlFor="renewalTerms">Renewal Terms</Label>
                  <Input
                    id="renewalTerms"
                    placeholder="e.g., 1 year, 6 months"
                    value={formData.renewalTerms || ""}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, renewalTerms: e.target.value }));
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractValue">Contract Value ($) *</Label>
              <Input
                id="contractValue"
                type="number"
                min="0"
                step="0.01"
                value={formData.contractValue || 0}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFormData(prev => ({ ...prev, contractValue: value }));
                  setErrors(prev => ({ ...prev, contractValue: "" }));
                }}
              />
              {errors.contractValue && <p className="text-sm text-destructive">{errors.contractValue}</p>}
              <p className="text-xs text-muted-foreground">
                Auto-calculated from equipment and term length.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes or comments..."
                value={formData.notes || ""}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, notes: e.target.value }));
                }}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Contract Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Company Information
                </h3>
                <div className="pl-6 space-y-1">
                  <p><span className="text-muted-foreground">Company:</span> {selectedCompany?.name}</p>
                  <p><span className="text-muted-foreground">Industry:</span> {selectedCompany?.industry}</p>
                  <p><span className="text-muted-foreground">Location:</span> {selectedCompany?.location}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Contract Details
                </h3>
                <div className="pl-6 space-y-1">
                  <p><span className="text-muted-foreground">Type:</span> {formData.contractType}</p>
                  <p><span className="text-muted-foreground">Start Date:</span> {formData.startDate ? format(formData.startDate, "PPP") : "N/A"}</p>
                  <p><span className="text-muted-foreground">Term:</span> {formData.termMonths} months</p>
                  {formData.startDate && endDate && (
                    <p><span className="text-muted-foreground">End Date:</span> {format(endDate, "PPP")}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Equipment ({formData.equipment?.length || 0} items)
                </h3>
                <div className="pl-6 space-y-2">
                  {formData.equipment?.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-medium">${(item.quantity * item.monthlyRate).toLocaleString()}/month</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t font-semibold flex justify-between">
                    <span>Total Monthly Rate:</span>
                    <span>${totalMonthlyRate.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Payment Terms
                </h3>
                <div className="pl-6 space-y-1">
                  <p><span className="text-muted-foreground">Frequency:</span> {formData.paymentFrequency}</p>
                  <p><span className="text-muted-foreground">Amount:</span> ${(formData.paymentAmount || 0).toLocaleString()}</p>
                  <p><span className="text-muted-foreground">Security Deposit:</span> ${(formData.securityDeposit || 0).toLocaleString()}</p>
                  <p><span className="text-muted-foreground">Late Fee:</span> {formData.lateFeePercentage || 0}%</p>
                  <p><span className="text-muted-foreground">Auto-Renewal:</span> {formData.autoRenew ? "Yes" : "No"}</p>
                  {formData.autoRenew && formData.renewalTerms && (
                    <p><span className="text-muted-foreground">Renewal Terms:</span> {formData.renewalTerms}</p>
                  )}
                  <p><span className="text-muted-foreground">Contract Value:</span> ${(formData.contractValue || 0).toLocaleString()}</p>
                </div>
              </div>

              {formData.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="pl-6 text-muted-foreground">{formData.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          {currentStep < 4 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Contract"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractCreate;


