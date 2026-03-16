import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, FileCheck, X, File, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  US_STATES,
  FIELD_CATEGORY_LABELS,
  getEnabledDocuments,
  getEnabledFields,
  getEnabledApplicationTypes,
  type EnabledField,
} from "@/services/platformConfigMockData";
import CompanyRecognitionCard from "@/components/CompanyRecognitionCard";
import { findCompanyByName, findCompanyByRepEmail } from "@/data/mockCompanies";

const ENTITY_TYPE_OPTIONS = ["LLC", "Corporation", "S-Corporation", "Sole Proprietor", "Partnership", "Non-Profit"];

const ApplicationCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const applicationTypes = useMemo(() => getEnabledApplicationTypes(), []);
  const [selectedType, setSelectedType] = useState(applicationTypes[0]?.id ?? "equipment-financing");

  const enabledFields = useMemo(() => getEnabledFields(selectedType), [selectedType]);
  const requiredDocuments = useMemo(() => getEnabledDocuments(selectedType), [selectedType]);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");

  // Equipment items — only relevant for types that have the equipmentCost field
  const hasEquipment = useMemo(
    () => enabledFields.some((f) => f.id === "equipmentCost"),
    [enabledFields]
  );

  interface EquipmentItem {
    description: string;
    vendor: string;
    quantity: string;
    unitCost: string;
  }

  const emptyItem: EquipmentItem = { description: "", vendor: "", quantity: "1", unitCost: "" };
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>([{ ...emptyItem }]);

  const addEquipmentItem = () => setEquipmentItems((prev) => [...prev, { ...emptyItem }]);

  const removeEquipmentItem = (idx: number) =>
    setEquipmentItems((prev) => prev.filter((_, i) => i !== idx));

  const updateEquipmentItem = (idx: number, key: keyof EquipmentItem, value: string) =>
    setEquipmentItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));

  const equipmentTotal = useMemo(
    () =>
      equipmentItems.reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const cost = parseFloat(item.unitCost) || 0;
        return sum + qty * cost;
      }, 0),
    [equipmentItems]
  );

  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File | null>>({});
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  const [authState, setAuthState] = useState<{
    status: 'none' | 'recognized' | 'verified';
    companyId?: string;
    repId?: string;
  }>({ status: 'none' });

  const stateOptions = useMemo(
    () => US_STATES.filter((s) => s !== "Nationwide"),
    []
  );

  const updateField = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleCompanyBlur = () => {
    if (authState.status === 'verified') return;
    const match = findCompanyByName(formData.companyName || "");
    if (match) {
      setAuthState({ status: 'recognized' });
    } else {
      setAuthState({ status: 'none' });
    }
  };

  const handleEmailBlur = () => {
    if (authState.status === 'verified') return;
    if (authState.status === 'recognized') return;
    const match = findCompanyByRepEmail(formData.contactEmail || "");
    if (match) {
      setAuthState({ status: 'recognized' });
    }
  };

  const handleVerified = (data: { companyId: string; company: any; representative: any }) => {
    const { company, representative } = data;
    const addressParts = company.address.split(',').map((s: string) => s.trim());
    const streetAddress = addressParts[0] || '';
    const cityPart = addressParts[1] || '';
    const lastPart = addressParts[addressParts.length - 1] || '';
    const stateMatch = lastPart.match(/^([A-Z]{2})\s/);
    const statePart = stateMatch ? stateMatch[1] : '';
    const zipMatch = lastPart.match(/\d{5}(-\d{4})?$/);
    const zip = zipMatch ? zipMatch[0] : '';

    const stateFullName = stateOptions.find(s =>
      s === statePart || s.startsWith(statePart)
    ) || '';

    setFormData(prev => ({
      ...prev,
      companyName: company.name,
      contactName: representative.name,
      contactEmail: representative.email,
      contactPhone: representative.phone,
      streetAddress,
      city: cityPart,
      state: stateFullName,
      zipCode: zip,
    }));
    setAuthState({ status: 'verified', companyId: data.companyId, repId: representative.id });
  };

  const handleDismissRecognition = () => {
    setAuthState({ status: 'none' });
  };

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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of enabledFields) {
      // Skip equipmentCost — we calculate it from items
      if (field.id === "equipmentCost" && hasEquipment) continue;
      if (field.required && !(formData[field.id] || "").trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
      if (field.type === "email" && formData[field.id] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[field.id])) {
        newErrors[field.id] = "Invalid email format";
      }
    }
    // Validate equipment items
    if (hasEquipment) {
      const hasAnyDescription = equipmentItems.some((item) => item.description.trim());
      if (!hasAnyDescription) {
        newErrors["equipment"] = "At least one equipment item is required";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    toast({
      title: "Application created successfully",
      description: `Application for ${formData.companyName || "new customer"} has been created.`,
    });
    navigate("/applications");
  };

  // Group fields by category
  const fieldsByCategory = useMemo(() => {
    const grouped: Record<string, EnabledField[]> = {};
    for (const field of enabledFields) {
      if (!grouped[field.category]) grouped[field.category] = [];
      grouped[field.category].push(field);
    }
    return grouped;
  }, [enabledFields]);

  const renderField = (field: EnabledField) => {
    if (field.type === "select") {
      let options: string[] = [];
      if (field.id === "state" || field.id === "stateOfIncorporation") {
        options = stateOptions;
      } else if (field.id === "entityType") {
        options = ENTITY_TYPE_OPTIONS;
      } else if (field.id === "country") {
        options = ["United States", "Canada"];
      }

      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label} {field.required && "*"}
          </Label>
          <Select
            value={formData[field.id] || ""}
            onValueChange={(value) => updateField(field.id, value)}
          >
            <SelectTrigger id={field.id}>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors[field.id] && (
            <p className="text-sm text-destructive">{errors[field.id]}</p>
          )}
        </div>
      );
    }

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id}>
          {field.label} {field.required && "*"}
        </Label>
        <Input
          id={field.id}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type}
          placeholder={field.aiNote || `Enter ${field.label.toLowerCase()}`}
          value={formData[field.id] || ""}
          onChange={(e) => updateField(field.id, e.target.value)}
          onBlur={
            field.id === "companyName" ? handleCompanyBlur :
            field.id === "contactEmail" ? handleEmailBlur :
            undefined
          }
          min={field.minThreshold}
          max={field.maxThreshold}
        />
        {errors[field.id] && (
          <p className="text-sm text-destructive">{errors[field.id]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <Link
        to="/applications"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Applications
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Create Application</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the customer details to create a new application
        </p>
      </div>

      {/* Application Type Selector */}
      {applicationTypes.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Application Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {applicationTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                    setFormData({});
                    setErrors({});
                    setUploadedDocs({});
                    setEquipmentItems([{ ...emptyItem }]);
                  }}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    selectedType === type.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent/50"
                  }`}
                >
                  <p className="font-medium text-sm">{type.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dynamic Field Sections by Category */}
      {Object.entries(fieldsByCategory).map(([category, fields]) => {
        // Skip equipmentCost from inline rendering when we show the equipment section
        const visibleFields = hasEquipment
          ? fields.filter((f) => f.id !== "equipmentCost")
          : fields;
        if (visibleFields.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{FIELD_CATEGORY_LABELS[category] || category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleFields.map(renderField)}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Equipment Details — only for equipment-based application types */}
      {hasEquipment && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Equipment Details</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addEquipmentItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipmentItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Item {idx + 1}</span>
                  {equipmentItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeEquipmentItem(idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description *</Label>
                    <Input
                      placeholder="e.g. CNC Milling Machine Model X200"
                      value={item.description}
                      onChange={(e) => updateEquipmentItem(idx, "description", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vendor / Dealer</Label>
                    <Input
                      placeholder="e.g. Industrial Supply Co."
                      value={item.vendor}
                      onChange={(e) => updateEquipmentItem(idx, "vendor", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Qty</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateEquipmentItem(idx, "quantity", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Cost ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0.00"
                        value={item.unitCost}
                        onChange={(e) => updateEquipmentItem(idx, "unitCost", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-sm font-medium text-muted-foreground">Total Equipment Cost</span>
              <span className="text-lg font-semibold">
                ${equipmentTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Recognition Card */}
      {(authState.status === 'recognized' || authState.status === 'verified') && (
        <CompanyRecognitionCard
          companyName={formData.companyName || ""}
          email={formData.contactEmail || ""}
          onVerified={handleVerified}
          onDismiss={handleDismissRecognition}
        />
      )}

      {/* Required Documents */}
      {requiredDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Upload the required documents for this application</p>

            <div className="space-y-3">
              {requiredDocuments.map((doc, index) => {
                const isUploaded = !!uploadedDocs[doc.id];
                const isDragging = draggedOver === doc.id;

                return (
                  <div
                    key={doc.id}
                    onDragOver={(e) => handleDragOver(e, doc.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, doc.id)}
                    className={`group relative rounded-lg border-2 border-dashed transition-all duration-300 ${
                      isUploaded
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : isDragging
                        ? 'border-primary bg-primary/10 scale-[1.02]'
                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isUploaded
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                        }`}>
                          {isUploaded ? (
                            <FileCheck className="w-5 h-5" />
                          ) : (
                            <File className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-muted-foreground">
                              {index + 1} / {requiredDocuments.length}
                            </span>
                            <h3 className="font-medium text-sm text-foreground">{doc.name}</h3>
                            {doc.required && (
                              <span className="text-xs text-destructive">Required</span>
                            )}
                          </div>
                          {doc.description && (
                            <p className="text-xs text-muted-foreground">{doc.description}</p>
                          )}

                          {isUploaded && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-background rounded-md border border-border">
                                <File className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                <span className="text-xs text-foreground truncate">{uploadedDocs[doc.id]?.name}</span>
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                  {uploadedDocs[doc.id] && (uploadedDocs[doc.id]!.size / 1024).toFixed(1)} KB
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveFile(doc.id)}
                                className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}

                          {!isUploaded && (
                            <p className="text-xs text-muted-foreground mt-1">
                              PDF, DOC, DOCX, JPG, PNG &middot; Max 10MB
                            </p>
                          )}
                        </div>

                        {!isUploaded ? (
                          <label htmlFor={`file-${doc.id}`} className="cursor-pointer flex-shrink-0">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                              <Upload className="w-4 h-4" />
                              Upload
                            </div>
                            <input
                              id={`file-${doc.id}`}
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload(doc.id, e.target.files?.[0] || null)}
                            />
                          </label>
                        ) : (
                          <label htmlFor={`file-${doc.id}`} className="cursor-pointer flex-shrink-0">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors text-sm font-medium">
                              <Upload className="w-4 h-4 text-muted-foreground" />
                              Replace
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

                    {isDragging && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg backdrop-blur-sm">
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

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">
                {Object.values(uploadedDocs).filter(Boolean).length} of {requiredDocuments.length} documents uploaded
              </span>
              {Object.values(uploadedDocs).filter(Boolean).length === requiredDocuments.length && (
                <div className="flex items-center gap-2 text-primary">
                  <FileCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">All documents uploaded</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any internal notes about this application..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
        <Button variant="outline" onClick={() => navigate("/applications")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Create Application</Button>
      </div>
    </div>
  );
};

export default ApplicationCreate;
