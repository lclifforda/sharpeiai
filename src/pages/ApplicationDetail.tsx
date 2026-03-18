import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, User, DollarSign, FileText, CheckCircle, Clock,
  Edit2, Printer, CheckCircle2, XCircle, Loader2, FolderOpen, Building2,
  MapPin, Package, Mail, Phone, ExternalLink, Sparkles, TrendingUp,
  Plus, Trash2, Upload, ScanSearch, UserCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UploadedDocument, DOCUMENT_LABELS, DOCUMENT_CATEGORIES, type DocumentType } from "@/types/documents";
import {
  FIELD_CATEGORY_LABELS,
  US_STATES,
  getEnabledFields,
  getEnabledDocuments,
  DEFAULT_PLATFORM_CONFIG,
} from "@/services/platformConfigMockData";
import { processAdminDocumentOCR, type AdminOCRResult } from "@/services/documentOCR";
import { getApplicationById, updateApplication, type StoredApplication } from "@/lib/applicationStorage";
import { useRBAC } from "@/contexts/RBACContext";
import DocumentPreviewDialog from "@/components/DocumentPreviewDialog";
import { getSampleDocumentUrl, getSampleDocumentByFilename } from "@/lib/sampleDocuments";

interface Timeline {
  id: string;
  date: string;
  status: string;
  description: string;
  user: string;
}

interface EquipmentItem {
  description: string;
  vendor: string;
  quantity: number;
  unitCost: number;
}

const ENTITY_TYPE_OPTIONS = ["LLC", "Corporation", "S-Corporation", "Sole Proprietor", "Partnership", "Non-Profit"];
const STATUS_OPTIONS = [
  { value: "unqualified", label: "Unqualified" },
  { value: "incomplete", label: "Incomplete (NIGO)" },
  { value: "completed", label: "Completed" },
  { value: "declined", label: "Declined" },
  { value: "funded", label: "Funded" },
];

function transformStoredToDetail(stored: StoredApplication) {
  const appType = DEFAULT_PLATFORM_CONFIG.applicationTypes.find((t) => t.id === stored.type);
  const customerDocuments: UploadedDocument[] = (stored.documents || []).map((d, i) => ({
    id: `cd-${i + 1}`,
    type: d.type as DocumentType,
    fileName: d.fileName,
    uploadDate: new Date(stored.date),
    status: d.status as "verified" | "pending" | "rejected",
    extractedData: {},
    verificationNotes: d.status === "verified" ? ["✓ Document validated successfully"] : ["Pending review"],
  }));
  return {
    id: stored.id,
    status: stored.status,
    applicationTypeId: stored.type,
    applicationType: appType?.name ?? stored.type,
    createdDate: stored.date,
    companyId: stored.companyId || "",
    vendor: stored.vendor,
    vendorId: "",

    aiSummary: stored.aiSummary ?? {
      recommendation: "moderate",
      text: `Application submitted by ${stored.contact || "applicant"}. ${stored.company} — ${stored.equipment} (${stored.amount}). Documents: ${customerDocuments.filter((d) => d.status === "verified").length}/${customerDocuments.length} verified.`,
      highlights: [
        { label: "Company", value: stored.company, positive: true },
        { label: "Amount", value: stored.amount, positive: true },
        { label: "Documents", value: `${customerDocuments.filter((d) => d.status === "verified").length}/${customerDocuments.length}`, positive: customerDocuments.every((d) => d.status === "verified") },
      ],
    },

    fields: stored.formData as Record<string, string>,

    equipmentItems: (stored.equipmentItems || []).map((i) => ({
      description: i.description,
      vendor: i.vendor || "—",
      quantity: i.quantity,
      unitCost: i.unitCost,
    })) as EquipmentItem[],

    timeline: [
      { id: "1", date: `${stored.date}T12:00:00`, status: "completed", description: "Application submitted by customer", user: stored.contact },
    ] as Timeline[],

    documents: [] as { id: string; name: string; type: string; size: string; date: string }[],

    customerDocuments,

    notes: "",
  };
}

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const storedApp = id ? getApplicationById(id) : undefined;

  // Mock application data (used when not from localStorage)
  const initialData = {
    id: 'APP-001',
    status: 'funded',
    applicationTypeId: 'equipment-financing',
    applicationType: 'Equipment Financing',
    createdDate: '2025-01-10',
    companyId: '1',
    vendor: 'SensorHub Direct',
    vendorId: 'V001',

    aiSummary: {
      recommendation: 'strong',
      text: 'This application aligns well with your equipment financing preferences in the technology sector. TechCorp Industries has been in business for over 7 years with $2.5M in annual revenue, showing stable growth. The requested amount of $22,500 represents less than 1% of annual revenue, indicating strong repayment capacity. The company has 85 employees and 100% ownership clarity. All 6 submitted documents have been verified successfully via OCR.',
      highlights: [
        { label: 'Time in Business', value: '7+ years', positive: true },
        { label: 'Revenue-to-Loan Ratio', value: '111:1', positive: true },
        { label: 'Document Verification', value: '6/6 passed', positive: true },
        { label: 'Down Payment', value: '22% offered', positive: true },
      ],
    },

    fields: {
      companyName: 'TechCorp Industries',
      dba: 'TechCorp',
      ein: '12-3456789',
      entityType: 'Corporation',
      dateEstablished: '2018-06-15',
      industry: 'Technology / SIC 7372',
      numberOfEmployees: '85',
      ownershipPercentage: '100',
      contactEmail: 'john.martinez@techcorp.com',
      contactPhone: '(415) 555-0123',
      contactName: 'John Martinez',
      annualRevenue: '2500000',
      requestedAmount: '22500',
      equipmentCost: '22500',
      downPayment: '5000',
      streetAddress: '1234 Innovation Drive',
      suite: 'Suite 400',
      city: 'San Francisco',
      state: 'California',
      zipCode: '94105',
      country: 'United States',
      fiscalYearEnd: 'December 2024',
      guarantorName: 'John A. Martinez',
      guarantorIdNumber: 'D7842951',
      guarantorSSN: '***-**-4567',
      guarantorDOB: '1985-03-22',
    } as Record<string, string>,

    equipmentItems: [
      { description: 'IoT Sensor Kit S-400', vendor: 'SensorTech Inc', quantity: 15, unitCost: 1500 },
    ] as EquipmentItem[],

    timeline: [
      { id: '1', date: '2025-01-10T10:00:00', status: 'completed', description: 'Application submitted by customer', user: 'John Martinez' },
      { id: '2', date: '2025-01-10T10:02:00', status: 'completed', description: 'AI pre-qualification started', user: 'System' },
      { id: '3', date: '2025-01-10T10:05:00', status: 'completed', description: 'Documents verified via OCR — 6/6 passed', user: 'AI Agent' },
      { id: '4', date: '2025-01-11T14:30:00', status: 'completed', description: 'Underwriting review completed', user: 'Lucia Clifford' },
      { id: '5', date: '2025-01-12T09:00:00', status: 'funded', description: 'Application funded — active', user: 'Lucia Clifford' },
    ] as Timeline[],

    documents: [
      { id: '1', name: 'Equipment Finance Agreement', type: 'PDF', size: '245 KB', date: '2025-01-12' },
      { id: '2', name: 'Payment Schedule', type: 'PDF', size: '120 KB', date: '2025-01-12' },
    ],

    customerDocuments: [
      { id: 'cd-1', type: 'business_license', fileName: 'TechCorp_Business_License.pdf', uploadDate: new Date('2025-01-08'), status: 'verified', extractedData: { licenseNumber: 'BL-CA-789456', state: 'California', expiryDate: '2026-12-31' }, verificationNotes: ['OCR confidence: 95%', '✓ Document validated successfully', 'Extracted: 3 fields'] },
      { id: 'cd-2', type: 'articles_of_incorporation', fileName: 'Articles_of_Incorporation_2020.pdf', uploadDate: new Date('2025-01-08'), status: 'verified', extractedData: { incorporationDate: '2020-03-15', entityType: 'Corporation', state: 'Delaware' }, verificationNotes: ['OCR confidence: 92%', '✓ Document validated successfully'] },
      { id: 'cd-3', type: 'tax_return_year1', fileName: 'TechCorp_2024_Tax_Return.pdf', uploadDate: new Date('2025-01-08'), status: 'verified', extractedData: { taxYear: '2024', grossRevenue: 2500000, netIncome: 450000 }, verificationNotes: ['OCR confidence: 89%', '✓ Document validated successfully'] },
      { id: 'cd-4', type: 'bank_statement', fileName: 'TechCorp_Bank_Statements_Jul-Dec2024.pdf', uploadDate: new Date('2025-01-09'), status: 'verified', extractedData: { avgMonthlyBalance: 340000, bank: 'Chase Business' }, verificationNotes: ['OCR confidence: 91%', '✓ Document validated successfully'] },
      { id: 'cd-5', type: 'equipment_quote', fileName: 'IoT_Sensor_Kit_Quote.pdf', uploadDate: new Date('2025-01-08'), status: 'verified', extractedData: { vendor: 'SensorTech Inc', totalAmount: 22500, items: '15x IoT Sensor Kit S-400' }, verificationNotes: ['OCR confidence: 97%', '✓ Document validated successfully'] },
      { id: 'cd-6', type: 'personal_id', fileName: 'JMartinez_DriversLicense.jpg', uploadDate: new Date('2025-01-08'), status: 'verified', extractedData: { name: 'John A. Martinez', state: 'California', expiryDate: '2027-03-22' }, verificationNotes: ['OCR confidence: 94%', '✓ Document validated successfully'] },
    ] as UploadedDocument[],

    notes: 'Customer pre-qualified via AI agent. Consistent revenue growth over last 3 years.',
  };

  const [application, setApplication] = useState(() =>
    storedApp ? transformStoredToDetail(storedApp) : initialData
  );

  // Sync when navigating to a different application
  useEffect(() => {
    const stored = id ? getApplicationById(id) : undefined;
    setApplication(stored ? transformStoredToDetail(stored) : initialData);
  }, [id]);

  // ── Officer assignment ──
  const { state: rbacState, currentUser } = useRBAC();
  const officers = useMemo(
    () => rbacState.users.filter((u) => {
      const role = rbacState.roles.find((r) => r.id === u.roleId);
      if (!role) return false;
      // Only internal users who can edit applications
      const appPerm = role.permissions.find((p) => p.resource === "applications");
      return appPerm && appPerm.actions.includes("edit") && appPerm.scope === "all";
    }),
    [rbacState]
  );

  const [assignedOfficerId, setAssignedOfficerId] = useState<string>(
    storedApp?.assignedOfficerId || (id === "APP-001" ? "user_sarah" : id === "APP-002" ? "user_carlos" : "")
  );

  const handleAssignOfficer = (rawValue: string) => {
    const officerId = rawValue === "unassigned" ? "" : rawValue;
    const officer = rbacState.users.find((u) => u.id === officerId);
    const prevOfficer = rbacState.users.find((u) => u.id === assignedOfficerId);
    setAssignedOfficerId(officerId);

    // Persist to localStorage if stored
    if (id) {
      updateApplication(id, {
        assignedOfficerId: officerId || undefined,
        assignedOfficerName: officer?.name || undefined,
        assignedAt: officerId ? new Date().toISOString() : undefined,
      });
    }

    // Add to timeline
    const timelineEntry = {
      id: `tl-assign-${Date.now()}`,
      date: new Date().toISOString(),
      status: "completed",
      description: officerId
        ? `Application assigned to ${officer?.name}${prevOfficer ? ` (was: ${prevOfficer.name})` : ""}`
        : `Application unassigned${prevOfficer ? ` (was: ${prevOfficer.name})` : ""}`,
      user: currentUser.name,
    };
    setApplication((prev) => ({
      ...prev,
      timeline: [timelineEntry, ...prev.timeline],
    }));

    toast({
      title: officerId ? "Officer assigned" : "Officer unassigned",
      description: officerId
        ? `${officer?.name} is now responsible for this application.`
        : "This application is no longer assigned to an officer.",
    });
  };

  // ── Edit mode ──
  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState<Record<string, string>>({});
  const [editStatus, setEditStatus] = useState('');
  const [editEquipment, setEditEquipment] = useState<EquipmentItem[]>([]);
  const [editNotes, setEditNotes] = useState('');
  const [newDocs, setNewDocs] = useState<Record<string, File | null>>({});

  // Moved here so manual doc helpers can reference it
  const enabledDocs = useMemo(() => getEnabledDocuments(application.applicationTypeId), [application.applicationTypeId]);

  // Manual document uploads (not tied to config — user can add any file)
  interface ManualDoc {
    id: string;
    name: string;
    docType: string;       // document type id, e.g. "business_license" or "other"
    docTypeLabel: string;  // human-readable label
    fileName: string;
    size: string;
    date: string;
    ocrStatus: 'none' | 'processing' | 'verified' | 'rejected';
    extractedData?: Record<string, any>;
    verificationNotes?: string[];
    crossValidation?: { field: string; extracted: string; application: string; match: boolean }[];
  }
  const [manualDocs, setManualDocs] = useState<ManualDoc[]>([]);

  // OCR dialog state
  const [ocrDialogOpen, setOcrDialogOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [selectedDocType, setSelectedDocType] = useState('other');

  // Document preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState('');

  const openDocPreview = (title: string, url: string | null, fileName?: string) => {
    if (!url) return;
    setPreviewTitle(title);
    setPreviewUrl(url);
    setPreviewFileName(fileName || '');
    setPreviewOpen(true);
  };

  // Auto-detect document type from filename
  const detectDocType = (fileName: string): string => {
    const fn = fileName.toLowerCase();
    if (fn.includes('license') || fn.includes('permit')) return 'business_license';
    if (fn.includes('incorporation') || fn.includes('articles') || fn.includes('formation')) return 'articles_of_incorporation';
    if (fn.includes('1120') || fn.includes('1065') || (fn.includes('tax') && fn.includes('return'))) return 'tax_return_year1';
    if (fn.includes('balance') && fn.includes('sheet')) return 'balance_sheet';
    if (fn.includes('p&l') || fn.includes('profit') || fn.includes('loss')) return 'profit_loss';
    if (fn.includes('bank') || fn.includes('statement')) return 'bank_statement';
    if (fn.includes('quote') || fn.includes('invoice')) return 'equipment_quote';
    if (fn.includes('spec') || fn.includes('datasheet') || fn.includes('brochure')) return 'equipment_spec_sheet';
    if (fn.includes('guarantee') || fn.includes('guarantor')) return 'personal_guarantee';
    if (fn.includes('1040') || (fn.includes('personal') && fn.includes('tax'))) return 'personal_tax_return';
    if (fn.includes('insurance') || fn.includes('certificate') || fn.includes('coverage')) return 'insurance_cert';
    if (fn.includes('id') || fn.includes('passport') || fn.includes('driver') || fn.includes('license')) return 'personal_id';
    if (fn.includes('ucc')) return 'ucc_filing';
    return 'other';
  };

  const handleManualDocUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0]; // one file at a time for type selection
    setPendingFile(file);
    setSelectedDocType(detectDocType(file.name));
    setOcrDialogOpen(true);
  };

  const buildApplicationContext = () => ({
    companyName: application.fields.companyName,
    entityType: application.fields.entityType,
    state: application.fields.state,
    ein: application.fields.ein,
    annualRevenue: application.fields.annualRevenue,
    requestedAmount: application.fields.requestedAmount,
    equipmentCost: application.fields.equipmentCost,
    guarantorName: application.fields.guarantorName,
    contactName: application.fields.contactName,
  });

  const getDocTypeLabel = (typeId: string): string => {
    const doc = enabledDocs.find(d => d.id === typeId);
    if (doc) return doc.name;
    if (typeId === 'other') return 'Other / Unclassified';
    return typeId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const handleOcrDialogChoice = async (runOcr: boolean) => {
    if (!pendingFile) return;
    setOcrDialogOpen(false);
    const file = pendingFile;
    const docType = selectedDocType;
    const docTypeLabel = getDocTypeLabel(docType);
    setPendingFile(null);

    const docId = `manual-${Date.now()}`;
    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');

    if (!runOcr) {
      setManualDocs(prev => [...prev, {
        id: docId, name: baseName, docType, docTypeLabel, fileName: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`, date: new Date().toISOString().split('T')[0],
        ocrStatus: 'none',
      }]);
      toast({ title: "Document added", description: `${file.name} uploaded without analysis.` });
      return;
    }

    // Add in processing state
    setManualDocs(prev => [...prev, {
      id: docId, name: baseName, docType, docTypeLabel, fileName: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`, date: new Date().toISOString().split('T')[0],
      ocrStatus: 'processing',
    }]);
    toast({ title: "Analyzing document", description: `Running AI analysis as "${docTypeLabel}"...` });

    const result = await processAdminDocumentOCR(file, docType, buildApplicationContext());
    const ocrStatus = result.status === 'rejected' ? 'rejected' : 'verified';
    setManualDocs(prev => prev.map(d =>
      d.id === docId
        ? { ...d, ocrStatus, extractedData: result.extractedData, verificationNotes: result.verificationNotes, crossValidation: result.crossValidation }
        : d
    ));
    if (result.status === 'rejected') {
      toast({ title: "Document type mismatch", description: result.verificationNotes?.[1] ?? "Filename doesn't match selected document type.", variant: "destructive" });
    } else {
      toast({ title: "Analysis complete", description: `${docTypeLabel} verified with ${Object.keys(result.extractedData || {}).length} extracted fields.` });
    }
  };

  const removeManualDoc = (docId: string) => setManualDocs(prev => prev.filter(d => d.id !== docId));

  const startEditing = () => {
    setEditFields({ ...application.fields });
    setEditStatus(application.status);
    setEditEquipment(application.equipmentItems.map(i => ({ ...i })));
    setEditNotes(application.notes);
    setNewDocs({});
    setEditing(true);
  };

  const cancelEditing = () => setEditing(false);

  const saveEditing = () => {
    setApplication(prev => ({
      ...prev,
      status: editStatus,
      fields: { ...editFields },
      equipmentItems: [...editEquipment],
      notes: editNotes,
    }));
    setEditing(false);
    toast({ title: "Application updated", description: "All changes have been saved." });
  };

  // Edit helpers
  const updateEdit = (key: string, value: string) => setEditFields(p => ({ ...p, [key]: value }));

  const addEquipmentRow = () => setEditEquipment(p => [...p, { description: '', vendor: '', quantity: 1, unitCost: 0 }]);
  const removeEquipmentRow = (idx: number) => setEditEquipment(p => p.filter((_, i) => i !== idx));
  const updateEquipmentRow = (idx: number, key: keyof EquipmentItem, value: string) => {
    setEditEquipment(p => p.map((item, i) => {
      if (i !== idx) return item;
      if (key === 'quantity' || key === 'unitCost') return { ...item, [key]: parseFloat(value) || 0 };
      return { ...item, [key]: value };
    }));
  };

  const handleDocUpload = (docId: string, file: File | null) => setNewDocs(p => ({ ...p, [docId]: file }));

  // ── Config-driven field info ──
  const enabledFields = useMemo(() => getEnabledFields(application.applicationTypeId), [application.applicationTypeId]);
  const hasEquipment = useMemo(() => enabledFields.some(f => f.id === "equipmentCost"), [enabledFields]);
  const stateOptions = useMemo(() => US_STATES.filter(s => s !== "Nationwide"), []);

  const fieldsByCategory = useMemo(() => {
    const grouped: Record<string, typeof enabledFields> = {};
    for (const field of enabledFields) {
      if (field.category === 'contact') continue;
      if (field.id === "equipmentCost" && hasEquipment && application.equipmentItems?.length) continue;
      if (!grouped[field.category]) grouped[field.category] = [];
      grouped[field.category].push(field);
    }
    return grouped;
  }, [enabledFields, hasEquipment, application.equipmentItems]);

  // ── Formatting helpers ──
  const formatFieldValue = (fieldId: string, value: string) => {
    if (!value) return '—';
    const currencyFields = ['annualRevenue', 'requestedAmount', 'equipmentCost', 'downPayment'];
    if (currencyFields.includes(fieldId)) { const n = parseFloat(value); if (!isNaN(n)) return `$${n.toLocaleString()}`; }
    if (fieldId === 'ownershipPercentage') return `${value}%`;
    if (fieldId.includes('Date') || fieldId === 'dateEstablished' || fieldId === 'guarantorDOB') { const d = new Date(value); if (!isNaN(d.getTime())) return d.toLocaleDateString(); }
    return value;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unqualified': return <Badge className="bg-muted text-muted-foreground">Unqualified</Badge>;
      case 'incomplete': return <Badge className="bg-amber-500/10 text-amber-700 border border-amber-200">Incomplete (NIGO)</Badge>;
      case 'completed': return <Badge className="bg-blue-500/10 text-blue-700 border border-blue-200">Completed</Badge>;
      case 'declined': return <Badge variant="destructive">Declined</Badge>;
      case 'funded': return <Badge className="bg-success text-success-foreground">Funded</Badge>;
      case 'closed': return <Badge className="bg-muted text-muted-foreground">Unqualified</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    const cfg: Record<string, { label: string; icon: any; variant: any }> = {
      verified: { label: 'Verified', icon: <CheckCircle2 className="w-3 h-3" />, variant: 'default' },
      processing: { label: 'Processing', icon: <Loader2 className="w-3 h-3 animate-spin" />, variant: 'secondary' },
      rejected: { label: 'Rejected', icon: <XCircle className="w-3 h-3" />, variant: 'destructive' },
      pending: { label: 'Pending', icon: <Clock className="w-3 h-3" />, variant: 'outline' },
    };
    const c = cfg[status] || cfg.pending;
    return <Badge variant={c.variant} className="flex items-center gap-1">{c.icon}{c.label}</Badge>;
  };

  const groupDocumentsByCategory = (docs: UploadedDocument[]) => {
    const grouped: Record<string, UploadedDocument[]> = {};
    docs.forEach(doc => {
      const cat: Record<string, string> = {
        business_license: 'business_info', articles_of_incorporation: 'business_info',
        tax_return_year1: 'financial', tax_return_year2: 'financial', balance_sheet: 'financial',
        profit_loss: 'financial', bank_statement: 'financial', equipment_quote: 'equipment',
        personal_guarantee: 'personal', personal_tax_return: 'personal', personal_id: 'personal',
        insurance_cert: 'security', ucc_filing: 'security',
      };
      const category = cat[doc.type] || 'business_info';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(doc);
    });
    return grouped;
  };

  const getTimelineIcon = (status: string) => {
    const m: Record<string, JSX.Element> = {
      unqualified: <XCircle className="w-4 h-4" />,
      incomplete: <Clock className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      declined: <XCircle className="w-4 h-4" />,
      funded: <DollarSign className="w-4 h-4" />,
    };
    return m[status] || <Clock className="w-4 h-4" />;
  };

  const equipmentTotal = (editing ? editEquipment : application.equipmentItems).reduce(
    (sum, item) => sum + item.quantity * item.unitCost, 0
  );

  const recommendationColors: Record<string, string> = {
    strong: 'border-green-500/30 bg-green-500/5',
    moderate: 'border-yellow-500/30 bg-yellow-500/5',
    weak: 'border-red-500/30 bg-red-500/5',
  };

  // ── Select field renderer for edit mode ──
  const renderEditField = (field: typeof enabledFields[0]) => {
    const value = editFields[field.id] || '';
    if (field.type === 'select') {
      let options: string[] = [];
      if (field.id === 'state' || field.id === 'stateOfIncorporation') options = stateOptions;
      else if (field.id === 'entityType') options = ENTITY_TYPE_OPTIONS;
      else if (field.id === 'country') options = ['United States', 'Canada'];
      return (
        <Select value={value} onValueChange={v => updateEdit(field.id, v)}>
          <SelectTrigger><SelectValue placeholder={`Select ${field.label}`} /></SelectTrigger>
          <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
      );
    }
    return (
      <Input
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
        value={value}
        onChange={e => updateEdit(field.id, e.target.value)}
      />
    );
  };

  // Which docs haven't been uploaded by the customer yet
  const missingDocs = useMemo(() => {
    const uploadedTypes = new Set(application.customerDocuments.map(d => d.type));
    return enabledDocs.filter(d => !uploadedTypes.has(d.id));
  }, [application.customerDocuments, enabledDocs]);

  const fields = editing ? editFields : application.fields;
  const currentStatus = editing ? editStatus : application.status;
  const currentEquipment = editing ? editEquipment : application.equipmentItems;
  const currentNotes = editing ? editNotes : application.notes;

  return (
    <div className={`container mx-auto p-6 max-w-7xl ${editing ? 'pb-24' : ''}`}>
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link to="/applications" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </Link>
          <div className="flex gap-2">
            {!editing ? (
              <>
                <Button variant="outline" size="sm" onClick={startEditing}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={saveEditing}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" size="sm" onClick={cancelEditing}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{fields.companyName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-muted-foreground font-mono text-sm">{application.id}</span>
                {editing ? (
                  <Select value={currentStatus} onValueChange={setEditStatus}>
                    <SelectTrigger className="h-7 w-auto text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  getStatusBadge(currentStatus)
                )}
                <Badge variant="outline">{application.applicationType}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary — hidden in edit mode */}
        {!editing && application.aiSummary && (
          <Card className={`${recommendationColors[application.aiSummary.recommendation]} border`}>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-sm">AI Assessment</p>
                    <Badge variant="outline" className="text-xs capitalize">{application.aiSummary.recommendation} fit</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{application.aiSummary.text}</p>
                  {application.aiSummary.highlights?.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {application.aiSummary.highlights.map((h: any, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs">
                          {h.positive ? <TrendingUp className="w-3.5 h-3.5 text-green-600" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />}
                          <span className="text-muted-foreground">{h.label}:</span>
                          <span className="font-medium">{h.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key financials */}
        {!editing && (
          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Requested</p>
                  <p className="text-xl font-bold mt-1">${parseFloat(fields.requestedAmount || '0').toLocaleString()}</p>
                </div>
                {fields.equipmentCost && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Equipment Cost</p>
                    <p className="text-xl font-bold mt-1">${parseFloat(fields.equipmentCost || '0').toLocaleString()}</p>
                  </div>
                )}
                {fields.downPayment && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Down Payment</p>
                    <p className="text-xl font-bold mt-1">${parseFloat(fields.downPayment || '0').toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Annual Revenue</p>
                  <p className="text-xl font-bold mt-1">${parseFloat(fields.annualRevenue || '0').toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* ── Left column ── */}
          <div className="space-y-5">
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="documents">
                  Documents ({application.documents.length + application.customerDocuments.length})
                </TabsTrigger>
              </TabsList>

              {/* Details tab */}
              <TabsContent value="details" className="mt-4 space-y-4">
                {Object.entries(fieldsByCategory).map(([category, catFields]) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {FIELD_CATEGORY_LABELS[category] || category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {catFields.map(field => (
                            <div key={field.id} className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground">{field.label}</Label>
                              {renderEditField(field)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                          {catFields.map(field => {
                            const value = fields[field.id];
                            if (!value && !field.required) return null;
                            return (
                              <div key={field.id} className="flex items-baseline justify-between py-1 border-b border-border/50 last:border-0">
                                <span className="text-sm text-muted-foreground">{field.label}</span>
                                <span className={`text-sm font-medium text-right ${field.id === 'ein' || field.id === 'guarantorSSN' ? 'font-mono' : ''}`}>
                                  {formatFieldValue(field.id, value || '')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Notes */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Internal Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <Textarea
                        value={editNotes}
                        onChange={e => setEditNotes(e.target.value)}
                        rows={3}
                        placeholder="Add internal notes..."
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{currentNotes || 'No notes.'}</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Equipment tab */}
              <TabsContent value="equipment" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Equipment Items</CardTitle>
                      {editing && (
                        <Button type="button" variant="outline" size="sm" onClick={addEquipmentRow}>
                          <Plus className="w-4 h-4 mr-1" /> Add Item
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <div className="space-y-4">
                        {editEquipment.map((item, idx) => (
                          <div key={idx} className="p-4 rounded-lg border space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Item {idx + 1}</span>
                              {editEquipment.length > 1 && (
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeEquipmentRow(idx)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1.5 md:col-span-2">
                                <Label className="text-xs">Description</Label>
                                <Input value={item.description} onChange={e => updateEquipmentRow(idx, 'description', e.target.value)} placeholder="e.g. CNC Milling Machine" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">Vendor / Dealer</Label>
                                <Input value={item.vendor} onChange={e => updateEquipmentRow(idx, 'vendor', e.target.value)} placeholder="e.g. Industrial Supply Co." />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Qty</Label>
                                  <Input type="number" min="1" value={item.quantity} onChange={e => updateEquipmentRow(idx, 'quantity', e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Unit Cost ($)</Label>
                                  <Input type="number" min="0" value={item.unitCost} onChange={e => updateEquipmentRow(idx, 'unitCost', e.target.value)} />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <span className="text-sm font-medium text-muted-foreground">Total Equipment Cost</span>
                          <span className="text-lg font-semibold">${equipmentTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    ) : hasEquipment && currentEquipment.length > 0 ? (
                      <>
                        <div className="rounded-lg border overflow-hidden">
                          <div className="grid grid-cols-[2fr_1.5fr_0.5fr_1fr_1fr] gap-4 px-4 py-3 bg-muted/50 border-b text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <div>Description</div><div>Vendor / Dealer</div><div className="text-right">Qty</div><div className="text-right">Unit Cost</div><div className="text-right">Total</div>
                          </div>
                          {currentEquipment.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-[2fr_1.5fr_0.5fr_1fr_1fr] gap-4 px-4 py-3 border-b last:border-b-0">
                              <div className="font-medium text-sm">{item.description}</div>
                              <div className="text-sm text-muted-foreground">{item.vendor || '—'}</div>
                              <div className="text-sm text-right">{item.quantity}</div>
                              <div className="text-sm text-right">${item.unitCost.toLocaleString()}</div>
                              <div className="text-sm font-medium text-right">${(item.quantity * item.unitCost).toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-4">
                          <span className="text-sm font-medium text-muted-foreground">Total Equipment Cost</span>
                          <span className="text-lg font-semibold">${equipmentTotal.toLocaleString()}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-6">No equipment items for this application type.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents tab */}
              <TabsContent value="documents" className="mt-4 space-y-4">
                {/* Upload missing docs — only in edit mode */}
                {editing && missingDocs.length > 0 && (
                  <Card className="border-dashed">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Upload Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {missingDocs.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            {doc.description && <p className="text-xs text-muted-foreground">{doc.description}</p>}
                          </div>
                          {newDocs[doc.id] ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{newDocs[doc.id]!.name}</span>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDocUpload(doc.id, null)}>
                                <XCircle className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </div>
                          ) : (
                            <label className="cursor-pointer">
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                                <Upload className="w-4 h-4" /> Upload
                              </div>
                              <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => handleDocUpload(doc.id, e.target.files?.[0] || null)} />
                            </label>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Existing docs — always visible */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">System Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {application.documents.map((doc: any) => {
                      const docUrl = getSampleDocumentByFilename(doc.name);
                      return (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.type} · {doc.size} · {new Date(doc.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => openDocPreview(doc.name, docUrl || getSampleDocumentUrl('business_license'), doc.name)}>View</Button>
                            <Button variant="outline" size="sm" onClick={() => {
                              const url = docUrl || getSampleDocumentUrl('business_license');
                              if (url) { const a = document.createElement('a'); a.href = url; a.download = doc.name.replace(/\s+/g, '_') + '.pdf'; a.click(); }
                            }}>Download</Button>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Customer Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {Object.entries(groupDocumentsByCategory(application.customerDocuments)).map(([category, docs]) => (
                      <div key={category}>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">{DOCUMENT_CATEGORIES[category]}</h4>
                        <div className="space-y-3">
                          {(docs as UploadedDocument[]).map(doc => (
                            <div key={doc.id} className="border rounded-lg p-3 space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-2 flex-1">
                                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{DOCUMENT_LABELS[doc.type]}</p>
                                    <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getDocumentStatusBadge(doc.status)}
                                  <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => openDocPreview(DOCUMENT_LABELS[doc.type], getSampleDocumentUrl(doc.type), doc.fileName)}>View</Button>
                                </div>
                              </div>
                              {doc.extractedData && Object.keys(doc.extractedData).length > 0 && (
                                <div className="bg-muted/50 p-2.5 rounded-md">
                                  <p className="text-xs font-semibold mb-1.5">Extracted Data (OCR):</p>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    {Object.entries(doc.extractedData).map(([key, value]) => (
                                      <div key={key} className="text-xs">
                                        <span className="text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                        <span className="ml-1 font-medium">{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {doc.verificationNotes && doc.verificationNotes.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {doc.verificationNotes.map((note, idx) => (
                                    <span key={idx} className={`text-xs px-2 py-0.5 rounded ${note.includes('✓') ? 'bg-green-500/10 text-green-700' : note.includes('OCR') ? 'bg-blue-500/10 text-blue-700' : 'bg-muted text-muted-foreground'}`}>
                                      {note}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Manually uploaded documents */}
                {manualDocs.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Uploaded by You</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {manualDocs.map(doc => (
                          <div key={doc.id} className="border rounded-lg p-3 space-y-2">
                            {/* Header row */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm">{doc.docTypeLabel}</p>
                                  <p className="text-xs text-muted-foreground">{doc.fileName} · {doc.size} · {doc.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {doc.ocrStatus === 'processing' && (
                                  <Badge className="bg-blue-500/10 text-blue-700 border-blue-200 gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Analyzing
                                  </Badge>
                                )}
                                {doc.ocrStatus === 'verified' && (
                                  <Badge className="bg-success text-success-foreground">Verified</Badge>
                                )}
                                {doc.ocrStatus === 'rejected' && (
                                  <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Type mismatch</Badge>
                                )}
                                {doc.ocrStatus === 'none' && (
                                  <Badge variant="outline" className="text-muted-foreground">No OCR</Badge>
                                )}
                                <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => openDocPreview(doc.docTypeLabel, getSampleDocumentUrl(doc.docType) || getSampleDocumentByFilename(doc.fileName), doc.fileName)}>View</Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeManualDoc(doc.id)}>
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>

                            {/* Processing indicator */}
                            {doc.ocrStatus === 'processing' && (
                              <div className="bg-blue-500/5 border border-blue-200 p-3 rounded-md flex items-center gap-3">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                <div>
                                  <p className="text-xs font-medium text-blue-700">Analyzing as "{doc.docTypeLabel}"</p>
                                  <p className="text-xs text-blue-600/70">Matching document patterns, extracting fields, and cross-referencing with application data...</p>
                                </div>
                              </div>
                            )}

                            {/* Rejection reason */}
                            {doc.ocrStatus === 'rejected' && doc.verificationNotes && doc.verificationNotes.length > 0 && (
                              <div className="bg-destructive/5 border border-destructive/20 p-2.5 rounded-md">
                                <p className="text-xs font-semibold text-destructive mb-1">Document type mismatch</p>
                                <ul className="text-xs text-muted-foreground space-y-0.5">
                                  {doc.verificationNotes.map((note, i) => (
                                    <li key={i}>{note}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Extracted data */}
                            {doc.extractedData && Object.keys(doc.extractedData).length > 0 && (
                              <div className="bg-muted/50 p-2.5 rounded-md">
                                <p className="text-xs font-semibold mb-1.5">Extracted Data (OCR):</p>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {Object.entries(doc.extractedData).map(([key, value]) => (
                                    <div key={key} className="text-xs">
                                      <span className="text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                      <span className="ml-1 font-medium">{String(value)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Cross-validation against application */}
                            {doc.crossValidation && doc.crossValidation.length > 0 && (
                              <div className="bg-muted/50 p-2.5 rounded-md">
                                <p className="text-xs font-semibold mb-1.5">Cross-Validation with Application:</p>
                                <div className="space-y-1">
                                  {doc.crossValidation.map((cv, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs">
                                      {cv.match ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                                      ) : (
                                        <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                                      )}
                                      <span className="text-muted-foreground">{cv.field}:</span>
                                      <span className="font-medium">{cv.extracted}</span>
                                      {!cv.match && (
                                        <span className="text-red-600">(application: {cv.application})</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Verification notes */}
                            {doc.verificationNotes && doc.verificationNotes.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {doc.verificationNotes.map((note, idx) => (
                                  <span key={idx} className={`text-xs px-2 py-0.5 rounded ${note.includes('✓') ? 'bg-green-500/10 text-green-700' : note.includes('⚠') ? 'bg-amber-500/10 text-amber-700' : note.includes('OCR') ? 'bg-blue-500/10 text-blue-700' : 'bg-muted text-muted-foreground'}`}>
                                    {note}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Add document — always available */}
                <Card className="border-dashed">
                  <CardContent className="py-6">
                    <label className="cursor-pointer flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Add Document</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Upload any supporting document — PDF, Word, or images</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.csv"
                        onChange={e => { handleManualDocUpload(e.target.files); e.target.value = ''; }}
                      />
                    </label>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-5">
            {/* Client */}
            <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate(`/customers/${application.companyId}`)}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{fields.companyName}</p>
                    {fields.dba && <p className="text-xs text-muted-foreground">DBA: {fields.dba}</p>}
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            {/* Assigned Officer */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Assigned Officer</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const assignedOfficer = rbacState.users.find((u) => u.id === assignedOfficerId);
                  return (
                    <div className="space-y-3">
                      {assignedOfficer && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {assignedOfficer.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{assignedOfficer.name}</p>
                            <p className="text-xs text-muted-foreground">{rbacState.roles.find((r) => r.id === assignedOfficer.roleId)?.name}</p>
                          </div>
                        </div>
                      )}
                      <Select value={assignedOfficerId} onValueChange={handleAssignOfficer}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select officer..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">
                            <span className="text-muted-foreground">Unassigned</span>
                          </SelectItem>
                          {officers.map((o) => (
                            <SelectItem key={o.id} value={o.id}>
                              <span className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                  {o.initials}
                                </span>
                                {o.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Primary Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm">{fields.contactName}</p>
                </div>
                <div className="space-y-2">
                  <a href={`mailto:${fields.contactEmail}`} onClick={e => e.stopPropagation()} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-muted/50 border hover:bg-accent transition-colors w-full">
                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{fields.contactEmail}</span>
                  </a>
                  <a href={`tel:${fields.contactPhone}`} onClick={e => e.stopPropagation()} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-muted/50 border hover:bg-accent transition-colors w-full">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    {fields.contactPhone}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Vendor */}
            {application.vendor && (
              <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate(`/merchants/${application.vendorId}`)}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Referring Vendor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{application.vendor}</p>
                      <p className="text-xs text-muted-foreground">Click to view vendor</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Address */}
            {fields.streetAddress && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Business Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p>{fields.streetAddress}{fields.suite && `, ${fields.suite}`}</p>
                      <p>{fields.city}, {fields.state} {fields.zipCode}</p>
                      {fields.country && <p className="text-muted-foreground">{fields.country}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key dates */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Key Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Submitted</span>
                  <span className="font-medium">{new Date(application.createdDate).toLocaleDateString()}</span>
                </div>
                {fields.dateEstablished && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Business Est.</span>
                    <span className="font-medium">{new Date(fields.dateEstablished).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          {getTimelineIcon(event.status)}
                        </div>
                        {index < application.timeline.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                      </div>
                      <div className="flex-1 pb-4 min-w-0">
                        <p className="font-medium text-sm leading-tight">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {event.user} · {new Date(event.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky save bar */}
      {editing && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
          <div className="container mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">You have unsaved changes</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={cancelEditing}>Discard</Button>
              <Button onClick={saveEditing}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* OCR confirmation dialog */}
      <Dialog open={ocrDialogOpen} onOpenChange={setOcrDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScanSearch className="w-5 h-5 text-primary" />
              Upload Document
            </DialogTitle>
            <DialogDescription>
              Select the document type so we can validate it against the expected pattern and cross-reference with the application data.
            </DialogDescription>
          </DialogHeader>

          {pendingFile && (
            <div className="space-y-4">
              {/* File info */}
              <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{pendingFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(pendingFile.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>

              {/* Document type selector */}
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {enabledDocs.map(doc => (
                      <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                    ))}
                    <SelectItem value="other">Other / Let AI detect</SelectItem>
                  </SelectContent>
                </Select>
                {selectedDocType !== 'other' && (
                  <p className="text-xs text-muted-foreground">
                    OCR will look for {getDocTypeLabel(selectedDocType).toLowerCase()} patterns, extract relevant fields, and compare against the application.
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => handleOcrDialogChoice(false)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Only
            </Button>
            <Button className="flex-1" onClick={() => handleOcrDialogChoice(true)}>
              <ScanSearch className="w-4 h-4 mr-2" />
              Upload & Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document preview dialog */}
      <DocumentPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title={previewTitle}
        fileUrl={previewUrl}
        fileName={previewFileName}
      />
    </div>
  );
};

export default ApplicationDetail;
