import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, Calendar, ChevronDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { US_STATES } from "@/services/platformConfigMockData";

const KNOWN_INDUSTRIES = [
  "Agriculture",
  "Automotive",
  "Construction",
  "Education",
  "Energy",
  "Financial Services",
  "Healthcare",
  "Hospitality",
  "Logistics",
  "Manufacturing",
  "Real Estate",
  "Retail",
  "Technology",
  "Telecommunications",
  "Transportation",
];

interface CompanyFormData {
  companyName: string;
  industry: string;
  website: string;
  dateEstablished: Date | undefined;
  numberOfEmployees: string;
  streetAddress: string;
  suite: string;
  city: string;
  state: string;
  zip: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;
  notes: string;
}

const CustomerCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: "",
    industry: "",
    website: "",
    dateEstablished: undefined,
    numberOfEmployees: "",
    streetAddress: "",
    suite: "",
    city: "",
    state: "",
    zip: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactRole: "",
    notes: "",
  });

  const [industrySearch, setIndustrySearch] = useState("");
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);

  const stateOptions = useMemo(
    () => US_STATES.filter((s) => s !== "Nationwide"),
    []
  );

  const filteredIndustries = useMemo(() => {
    const q = industrySearch.toLowerCase().trim();
    if (!q) return KNOWN_INDUSTRIES;
    return KNOWN_INDUSTRIES.filter((ind) => ind.toLowerCase().includes(q));
  }, [industrySearch]);

  const updateField = <K extends keyof CompanyFormData>(
    field: K,
    value: CompanyFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.industry.trim()) newErrors.industry = "Industry is required";
    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zip.trim()) newErrors.zip = "ZIP code is required";
    if (!formData.contactName.trim()) newErrors.contactName = "Contact name is required";
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    toast({
      title: "Client created successfully",
      description: `${formData.companyName} has been added.`,
    });
    navigate("/customers");
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <Link
        to="/customers"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Customers
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Add Client</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details to add a new customer
        </p>
      </div>

      {/* Card 1: Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              placeholder="e.g. Acme Corporation"
              value={formData.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
            />
            {errors.companyName && (
              <p className="text-sm text-destructive">{errors.companyName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Industry *</Label>
            <Popover open={isIndustryOpen} onOpenChange={setIsIndustryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isIndustryOpen}
                  className="w-full justify-between"
                >
                  {formData.industry || (
                    <span className="text-muted-foreground">
                      Select or type an industry...
                    </span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <Input
                    placeholder="Search or type custom industry..."
                    value={industrySearch}
                    onChange={(e) => setIndustrySearch(e.target.value)}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    autoFocus
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto p-1">
                  {filteredIndustries.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => {
                        updateField("industry", ind);
                        setIsIndustryOpen(false);
                        setIndustrySearch("");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                        formData.industry === ind ? "bg-accent" : ""
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                  {industrySearch.trim() &&
                    !KNOWN_INDUSTRIES.some(
                      (ind) =>
                        ind.toLowerCase() === industrySearch.trim().toLowerCase()
                    ) && (
                      <button
                        onClick={() => {
                          updateField("industry", industrySearch.trim());
                          setIsIndustryOpen(false);
                          setIndustrySearch("");
                        }}
                        className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-primary"
                      >
                        Use "{industrySearch.trim()}"
                      </button>
                    )}
                </div>
              </PopoverContent>
            </Popover>
            {errors.industry && (
              <p className="text-sm text-destructive">{errors.industry}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => updateField("website", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateEstablished">Date Established</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !formData.dateEstablished && "text-muted-foreground"
                    }`}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.dateEstablished
                      ? format(formData.dateEstablished, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.dateEstablished}
                    onSelect={(date) => updateField("dateEstablished", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfEmployees">Number of Employees</Label>
            <Input
              id="numberOfEmployees"
              type="number"
              min="0"
              placeholder="e.g. 50"
              value={formData.numberOfEmployees}
              onChange={(e) => updateField("numberOfEmployees", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address *</Label>
            <Input
              id="streetAddress"
              placeholder="123 Main St"
              value={formData.streetAddress}
              onChange={(e) => updateField("streetAddress", e.target.value)}
            />
            {errors.streetAddress && (
              <p className="text-sm text-destructive">{errors.streetAddress}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="suite">Suite / Unit</Label>
            <Input
              id="suite"
              placeholder="Suite 100"
              value={formData.suite}
              onChange={(e) => updateField("suite", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="San Francisco"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select
                value={formData.state}
                onValueChange={(value) => updateField("state", value)}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code *</Label>
              <Input
                id="zip"
                placeholder="94105"
                value={formData.zip}
                onChange={(e) => updateField("zip", e.target.value)}
              />
              {errors.zip && (
                <p className="text-sm text-destructive">{errors.zip}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Primary Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Full Name *</Label>
              <Input
                id="contactName"
                placeholder="Jane Doe"
                value={formData.contactName}
                onChange={(e) => updateField("contactName", e.target.value)}
              />
              {errors.contactName && (
                <p className="text-sm text-destructive">
                  {errors.contactName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="jane@example.com"
                value={formData.contactEmail}
                onChange={(e) => updateField("contactEmail", e.target.value)}
              />
              {errors.contactEmail && (
                <p className="text-sm text-destructive">
                  {errors.contactEmail}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.contactPhone}
                onChange={(e) => updateField("contactPhone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactRole">Role / Title</Label>
              <Input
                id="contactRole"
                placeholder="e.g. CEO, Operations Manager"
                value={formData.contactRole}
                onChange={(e) => updateField("contactRole", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any internal notes about this company..."
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              These notes are internal only and will not be shown to the customer.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/customers")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Create Client</Button>
      </div>
    </div>
  );
};

export default CustomerCreate;
