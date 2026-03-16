import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useOrg, useUpdateOrg, usePlatformConfig, useUpdatePlatformConfig } from "@/hooks/queries";
import AIConfigPreview from "@/components/AIConfigPreview";
import {
  Building2,
  ListChecks,
  FileText,
  Palette,
  Save,
  Plus,
  Truck,
  DollarSign,
  X,
  Upload,
  Bot,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Globe,
  Target,
  Users,
  Briefcase,
  MapPin,
  CircleDollarSign,
  BookOpen,
  FileUp,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  INDUSTRY_OPTIONS,
  CUSTOMER_TYPE_OPTIONS,
  ASSET_TYPE_OPTIONS,
  US_STATES,
  FIELD_CATEGORY_LABELS,
  DOC_CATEGORY_LABELS,
  KB_CATEGORY_LABELS,
  type PlatformConfiguration,
  type ApplicationTypeConfig,
  type ApplicationFieldConfig,
  type DocumentConfig,
  type KnowledgeDocument,
} from "@/services/platformConfigMockData";

// ── Extracted sub-components ────────────────────────────────────────────
import {
  APP_TYPE_ICONS,
  FIELD_CATEGORY_ICONS,
  DOC_CATEGORY_ICONS,
  APP_TYPE_GRADIENTS,
  NAV_ITEMS,
  groupBy,
  type SectionId,
} from "@/components/settings/settingsConstants";
import ProgressRing from "@/components/settings/ProgressRing";
import TagSelect from "@/components/settings/TagSelect";
import SectionHeader from "@/components/settings/SectionHeader";
import AppTypeSelector from "@/components/settings/AppTypeSelector";
import FieldRow from "@/components/settings/FieldRow";
import DocRow from "@/components/settings/DocRow";
import CurrencyInput from "@/components/settings/CurrencyInput";
import ColorPicker from "@/components/settings/ColorPicker";
import { useBranding } from "@/contexts/BrandingContext";

// ── Helpers ─────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

// ── Knowledge Base sub-components ───────────────────────────────────────

function KBDocRow({
  doc,
  striped,
  appTypes,
  onDelete,
  onUpdate,
}: {
  doc: KnowledgeDocument;
  striped: boolean;
  appTypes: ApplicationTypeConfig[];
  onDelete: () => void;
  onUpdate: (patch: Partial<KnowledgeDocument>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasNote = doc.aiNote.length > 0;
  const scopeLabel =
    doc.applicableTypes.length === 0
      ? "All types"
      : doc.applicableTypes.map((id) => appTypes.find((a) => a.id === id)?.name ?? id).join(", ");

  return (
    <div className={`${striped ? "bg-muted/20" : ""}`}>
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
            {hasNote && <Bot className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground">
            {doc.size} &middot; {new Date(doc.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            {" "}&middot; {scopeLabel}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {doc.status === "processed" ? (
            <Badge variant="outline" className="text-[10px] font-normal px-1.5 border-green-300/50 text-green-600 dark:text-green-400">
              <CheckCircle className="w-3 h-3 mr-1" />
              Processed
            </Badge>
          ) : doc.status === "processing" ? (
            <Badge variant="outline" className="text-[10px] font-normal px-1.5 border-amber-300/50 text-amber-600 dark:text-amber-400">
              Processing...
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] font-normal px-1.5 border-red-300/50 text-red-600 dark:text-red-400">
              Error
            </Badge>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
              expanded ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {expanded ? "Close" : "Edit"}
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Delete document"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-3 pt-0 ml-12 space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Bot className="w-3 h-3" /> AI Note
            </Label>
            <Input
              placeholder="Tell the AI how to use this document..."
              value={doc.aiNote}
              onChange={(e) => onUpdate({ aiNote: e.target.value })}
              className="text-sm h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Applies to
            </Label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onUpdate({ applicableTypes: [] })}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  doc.applicableTypes.length === 0
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                All types
                {doc.applicableTypes.length === 0 && <X className="w-3 h-3" />}
              </button>
              {appTypes.map((at) => {
                const active = doc.applicableTypes.includes(at.id);
                const gradient = APP_TYPE_GRADIENTS[at.id] || "from-gray-500 to-gray-400";
                return (
                  <button
                    key={at.id}
                    onClick={() => {
                      if (active) {
                        const next = doc.applicableTypes.filter((id) => id !== at.id);
                        onUpdate({ applicableTypes: next });
                      } else {
                        onUpdate({ applicableTypes: [...doc.applicableTypes, at.id] });
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      active
                        ? "bg-foreground text-background border-foreground shadow-sm"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient} flex-shrink-0`} />
                    {at.name}
                    {active && <X className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              {doc.applicableTypes.length === 0
                ? "This document is available to the AI for all application types."
                : "The AI will only reference this document for the selected application types."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function KBCategorySection({
  category,
  label,
  docs,
  appTypes,
  onUpload,
  onDelete,
  onUpdate,
}: {
  category: KnowledgeDocument["category"];
  label: string;
  docs: KnowledgeDocument[];
  appTypes: ApplicationTypeConfig[];
  onUpload: (doc: KnowledgeDocument) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<KnowledgeDocument>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((file) => {
        onUpload({
          id: `kb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          category,
          size: formatFileSize(file.size),
          uploadedAt: new Date().toISOString(),
          status: "processing",
          aiNote: "",
          applicableTypes: [],
        });
      });
    },
    [category, onUpload]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          <Badge variant="outline" className="text-[10px] font-normal px-1.5">
            {docs.length} {docs.length === 1 ? "file" : "files"}
          </Badge>
        </div>
      </div>

      {docs.length > 0 && (
        <div className="border rounded-xl overflow-hidden divide-y">
          {docs.map((doc, idx) => (
            <KBDocRow
              key={doc.id}
              doc={doc}
              striped={idx % 2 === 1}
              appTypes={appTypes}
              onDelete={() => onDelete(doc.id)}
              onUpdate={(patch) => onUpdate(doc.id, patch)}
            />
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.xlsx,.xls,.docx,.doc,.csv,.txt"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`w-full border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer group ${
          dragging
            ? "border-foreground/40 bg-muted/50"
            : "hover:border-foreground/20"
        }`}
      >
        <FileUp className={`w-5 h-5 mx-auto transition-colors mb-1 ${dragging ? "text-foreground/60" : "text-muted-foreground group-hover:text-foreground/50"}`} />
        <p className={`text-xs transition-colors ${dragging ? "text-foreground/70" : "text-muted-foreground group-hover:text-foreground/70"}`}>
          {dragging ? "Drop files here..." : "Click to upload or drag and drop"}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">PDF, XLSX, DOCX up to 10MB</p>
      </button>
    </div>
  );
}

// ── Main Settings page ─────────────────────────────────────────────────

const Settings = () => {
  const { toast } = useToast();
  const brandingCtx = useBranding();
  const logoFileRef = useRef<HTMLInputElement>(null);

  // ── API queries ────────────────────────────────────────────────────
  const { data: orgData, isLoading: orgLoading, isError: orgError } = useOrg();
  const { data: platformData, isLoading: platformLoading, isError: platformError } = usePlatformConfig();
  const updateOrgMutation = useUpdateOrg();
  const updatePlatformConfigMutation = useUpdatePlatformConfig();

  const isLoading = orgLoading || platformLoading;
  const isError = orgError || platformError;

  // ── Local config state seeded from API data ────────────────────────
  const [config, setConfig] = useState<PlatformConfiguration | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("profile");
  const [selectedAppType, setSelectedAppType] = useState("");

  // Seed local state when API data arrives
  useEffect(() => {
    if (!platformData) return;
    setConfig((prev) => {
      // Only seed once, or when platform data changes after a mutation
      if (prev && prev.lastUpdated === platformData.lastUpdated) return prev;
      const merged: PlatformConfiguration = {
        ...platformData,
        branding: {
          ...platformData.branding,
          // Overlay org-level branding fields when available
          ...(orgData?.branding ?? {}),
          companyName: orgData?.name ?? platformData.branding?.companyName ?? "",
        },
      };
      return merged;
    });
  }, [platformData, orgData]);

  // Set initial selected app type once config is ready
  useEffect(() => {
    if (config && !selectedAppType && config.applicationTypes.length > 0) {
      setSelectedAppType(config.applicationTypes[0].id);
    }
  }, [config, selectedAppType]);

  // Simulate initial "processing" docs completing on mount
  useEffect(() => {
    if (!config) return;
    const processingIds = config.knowledgeBase
      .filter((d) => d.status === "processing")
      .map((d) => d.id);
    if (processingIds.length === 0) return;
    const timer = setTimeout(() => {
      setConfig((prev) => prev ? ({
        ...prev,
        knowledgeBase: prev.knowledgeBase.map((d) =>
          processingIds.includes(d.id) ? { ...d, status: "processed" as const } : d
        ),
      }) : prev);
    }, 3000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Loading & error states ─────────────────────────────────────────

  if (isLoading || !config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-destructive font-medium">Failed to load settings</p>
          <p className="text-xs text-muted-foreground">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────

  const isSaving = updateOrgMutation.isPending || updatePlatformConfigMutation.isPending;

  const handleSave = () => {
    // Extract org-level fields (name, branding)
    const orgPayload: Record<string, unknown> = {
      name: config.branding.companyName,
      branding: {
        primaryColor: config.branding.primaryColor,
        accentColor: config.branding.accentColor,
        logo: config.branding.logoUrl,
      },
    };

    // Extract platform config fields (profile, applicationTypes, knowledgeBase, branding details)
    const platformPayload: PlatformConfiguration = {
      ...config,
      lastUpdated: new Date().toISOString(),
    };

    // Fire both mutations
    updateOrgMutation.mutate(orgPayload, {
      onError: () => {
        toast({ title: "Error saving org settings", description: "Please try again.", variant: "destructive" });
      },
    });

    updatePlatformConfigMutation.mutate(platformPayload, {
      onSuccess: () => {
        setConfig((prev) => prev ? ({ ...prev, lastUpdated: new Date().toISOString() }) : prev);
        toast({ title: "Configuration saved", description: "Your platform settings have been updated." });
      },
      onError: () => {
        toast({ title: "Error saving configuration", description: "Please try again.", variant: "destructive" });
      },
    });
  };

  const updateProfile = (patch: Partial<typeof config.profile>) =>
    setConfig((prev) => prev ? ({ ...prev, profile: { ...prev.profile, ...patch } }) : prev);

  const updateBranding = (patch: Partial<typeof config.branding>) => {
    setConfig((prev) => prev ? ({ ...prev, branding: { ...prev.branding, ...patch } }) : prev);
    brandingCtx.updateBranding(patch);
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Logo must be under 2 MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateBranding({ logoUrl: dataUrl });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const updateAppType = (id: string, patch: Partial<ApplicationTypeConfig>) =>
    setConfig((prev) => prev ? ({
      ...prev,
      applicationTypes: prev.applicationTypes.map((at) => (at.id === id ? { ...at, ...patch } : at)),
    }) : prev);

  const updateField = (appTypeId: string, fieldId: string, patch: Partial<ApplicationFieldConfig>) =>
    setConfig((prev) => prev ? ({
      ...prev,
      applicationTypes: prev.applicationTypes.map((at) =>
        at.id === appTypeId
          ? { ...at, fields: at.fields.map((f) => (f.fieldId === fieldId ? { ...f, ...patch } : f)) }
          : at
      ),
    }) : prev);

  const updateDoc = (appTypeId: string, docType: string, patch: Partial<DocumentConfig>) =>
    setConfig((prev) => prev ? ({
      ...prev,
      applicationTypes: prev.applicationTypes.map((at) =>
        at.id === appTypeId
          ? { ...at, documents: at.documents.map((d) => (d.documentType === docType ? { ...d, ...patch } : d)) }
          : at
      ),
    }) : prev);

  const selectedApp = config.applicationTypes.find((at) => at.id === selectedAppType);

  // ── Summary stats ──────────────────────────────────────────────────

  const stats = useMemo(() => {
    const totalFields = config.applicationTypes.reduce((a, t) => a + t.fields.length, 0);
    const enabledFields = config.applicationTypes.reduce((a, t) => a + t.fields.filter((f) => f.enabled).length, 0);
    const totalDocs = config.applicationTypes.reduce((a, t) => a + t.documents.length, 0);
    const enabledDocs = config.applicationTypes.reduce((a, t) => a + t.documents.filter((d) => d.enabled).length, 0);
    const enabledTypes = config.applicationTypes.filter((t) => t.enabled).length;
    const profileComplete =
      (config.profile.companyDescription ? 1 : 0) +
      (config.profile.minTimeInBusiness != null && config.profile.minTimeInBusiness > 0 ? 1 : 0) +
      (config.profile.industries.length > 0 ? 1 : 0) +
      (config.profile.customerTypes.length > 0 ? 1 : 0) +
      (config.profile.assetTypes.length > 0 ? 1 : 0) +
      (config.profile.geographicFocus.length > 0 ? 1 : 0);
    const kbTotal = config.knowledgeBase.length;
    const kbProcessed = config.knowledgeBase.filter((d) => d.status === "processed").length;
    return { totalFields, enabledFields, totalDocs, enabledDocs, enabledTypes, profileComplete, kbTotal, kbProcessed };
  }, [config]);

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero header ──────────────────────────────────────────── */}
      <div className="border-b relative overflow-hidden">
        {/* Gradient background accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(185,85%,50%)]/5 via-[hsl(220,90%,55%)]/5 to-[hsl(260,85%,60%)]/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[hsl(260,85%,60%)]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

        <div className="px-6 py-6 relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">AI Agent Configuration</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your AI's playbook — define how it collects data, reviews documents, and greets applicants
              </p>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Profile", value: `${stats.profileComplete}/6`, sub: "sections filled", pct: (stats.profileComplete / 6) * 100, icon: Building2 },
              { label: "Fields", value: `${stats.enabledFields}`, sub: `of ${stats.totalFields} active across ${stats.enabledTypes} app types`, pct: (stats.enabledFields / stats.totalFields) * 100, icon: ListChecks },
              { label: "Documents", value: `${stats.enabledDocs}`, sub: `of ${stats.totalDocs} active`, pct: (stats.enabledDocs / stats.totalDocs) * 100, icon: FileText },
              { label: "Knowledge", value: `${stats.kbProcessed}`, sub: `of ${stats.kbTotal} docs processed`, pct: stats.kbTotal > 0 ? (stats.kbProcessed / stats.kbTotal) * 100 : 0, icon: BookOpen },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 bg-card border rounded-xl px-4 py-3">
                <ProgressRing value={s.pct} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body: sidebar nav + content ──────────────────────────── */}
      <div className="flex">
        {/* Vertical nav */}
        <nav className="w-60 flex-shrink-0 border-r bg-muted/30 min-h-[calc(100vh-200px)]">
          <div className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    active
                      ? "bg-card border shadow-subtle text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-foreground" : ""}`} />
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${active ? "font-medium" : ""}`}>{item.label}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content area */}
        <div className="flex-1 p-6 max-w-4xl">
          {/* ── Profile ──────────────────────────────────────────── */}
          {activeSection === "profile" && (
            <div className="space-y-8">
              <SectionHeader
                icon={Building2}
                title="Company Profile"
                description="This context is injected into every AI conversation so it knows who it represents."
              />

              {/* Company description */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                  Company Description
                </Label>
                <Textarea
                  value={config.profile.companyDescription}
                  onChange={(e) => updateProfile({ companyDescription: e.target.value })}
                  rows={4}
                  placeholder="Describe your lending business..."
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">The AI will paraphrase this when introducing itself to applicants.</p>
              </div>

              {/* Minimum time in business */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  Minimum Time in Business
                </Label>
                <div className="flex items-center gap-2 max-w-[280px]">
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g. 6 or 2"
                    value={config.profile.minTimeInBusiness ?? ""}
                    onChange={(e) => {
                      const v = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                      updateProfile({ minTimeInBusiness: v != null && !isNaN(v) ? v : undefined });
                    }}
                  />
                  <Select
                    value={config.profile.minTimeInBusinessUnit ?? "months"}
                    onValueChange={(v: "months" | "years") => updateProfile({ minTimeInBusinessUnit: v })}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="months">months</SelectItem>
                      <SelectItem value="years">years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">Most lenders require a minimum. Leave empty if you have no requirement.</p>
              </div>

              {/* Tag sections with icons */}
              <div className="space-y-6">
                <div className="space-y-2.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-muted-foreground" />
                    Industries Served
                  </Label>
                  <TagSelect options={INDUSTRY_OPTIONS} selected={config.profile.industries} onChange={(v) => updateProfile({ industries: v })} allowCustom />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    Customer Types
                  </Label>
                  <TagSelect options={CUSTOMER_TYPE_OPTIONS} selected={config.profile.customerTypes} onChange={(v) => updateProfile({ customerTypes: v })} allowCustom />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-muted-foreground" />
                    Asset Types Financed
                  </Label>
                  <TagSelect options={ASSET_TYPE_OPTIONS} selected={config.profile.assetTypes} onChange={(v) => updateProfile({ assetTypes: v })} allowCustom />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    Geographic Focus
                  </Label>
                  {(() => {
                    const isNationwide = config.profile.geographicFocus.includes("Nationwide");
                    const handleGeoChange = (v: string[]) => {
                      const wasNationwide = config.profile.geographicFocus.includes("Nationwide");
                      const nowNationwide = v.includes("Nationwide");
                      if (nowNationwide && !wasNationwide) {
                        updateProfile({ geographicFocus: ["Nationwide"] });
                      } else if (wasNationwide && v.length > 1) {
                        updateProfile({ geographicFocus: v.filter((s) => s !== "Nationwide") });
                      } else {
                        updateProfile({ geographicFocus: v });
                      }
                    };
                    return (
                      <div className="space-y-2">
                        <TagSelect
                          options={isNationwide ? ["Nationwide"] : US_STATES}
                          selected={config.profile.geographicFocus}
                          onChange={handleGeoChange}
                        />
                        {isNationwide && (
                          <p className="text-xs text-muted-foreground">All US states included. Deselect to pick specific states.</p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Lending range */}
              <div className="space-y-2.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <CircleDollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                  Lending Range
                </Label>
                <div className="flex items-center gap-3">
                  <CurrencyInput
                    value={config.profile.lendingRangeMin}
                    onChange={(v) => updateProfile({ lendingRangeMin: v })}
                  />
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <CurrencyInput
                    value={config.profile.lendingRangeMax}
                    onChange={(v) => updateProfile({ lendingRangeMax: v })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Applications & Fields ────────────────────────────── */}
          {activeSection === "fields" && (
            <div className="space-y-6">
              <SectionHeader
                icon={ListChecks}
                title="Applications & Fields"
                description="Manage your financing products and configure what data the AI collects for each."
              />

              {/* App type cards as selector */}
              <div className="grid grid-cols-1 gap-3">
                {config.applicationTypes.map((appType) => {
                  const Icon = APP_TYPE_ICONS[appType.icon] || FileText;
                  const gradient = APP_TYPE_GRADIENTS[appType.id] || "from-gray-500 to-gray-400";
                  const isSelected = selectedAppType === appType.id;
                  const enabledFields = appType.fields.filter((f) => f.enabled).length;
                  const requiredFields = appType.fields.filter((f) => f.enabled && f.required).length;
                  const enabledDocs = appType.documents.filter((d) => d.enabled).length;
                  const requiredDocs = appType.documents.filter((d) => d.enabled && d.required).length;

                  return (
                    <button
                      key={appType.id}
                      onClick={() => setSelectedAppType(appType.id)}
                      className={`w-full text-left transition-all rounded-xl border overflow-hidden ${
                        isSelected
                          ? "ring-2 ring-foreground/20 border-foreground/20"
                          : "hover:border-foreground/10"
                      } ${!appType.enabled ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-stretch">
                        <div className={`w-1 bg-gradient-to-b ${gradient} flex-shrink-0 ${isSelected ? "w-1.5" : ""}`} />
                        <div className="flex-1 px-4 py-3 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-sm text-foreground">{appType.name}</span>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{appType.description}</p>
                          </div>
                          <div className="flex items-center gap-5 flex-shrink-0 text-xs text-muted-foreground">
                            <div className="text-center">
                              <p className="font-semibold text-foreground text-sm">{enabledFields}</p>
                              <p className="text-[10px]">fields ({requiredFields} req.)</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-foreground text-sm">{enabledDocs}</p>
                              <p className="text-[10px]">docs ({requiredDocs} req.)</p>
                            </div>
                          </div>
                          <div className="flex items-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <Switch
                              checked={appType.enabled}
                              onCheckedChange={(checked) => updateAppType(appType.id, { enabled: checked })}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedApp && (
                <Accordion type="multiple" defaultValue={Object.keys(FIELD_CATEGORY_LABELS)} className="space-y-3">
                  {Object.entries(groupBy(selectedApp.fields)).map(([category, fields]) => {
                    const CatIcon = FIELD_CATEGORY_ICONS[category] || ListChecks;
                    const enabled = fields.filter((f) => f.enabled).length;
                    const required = fields.filter((f) => f.enabled && f.required).length;

                    return (
                      <AccordionItem key={category} value={category} className="border rounded-xl overflow-hidden">
                        <AccordionTrigger className="hover:no-underline px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <CatIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm">
                              {FIELD_CATEGORY_LABELS[category] ?? category}
                            </span>
                            <div className="flex items-center gap-1.5 ml-auto mr-3">
                              <Badge variant="outline" className="text-[10px] font-normal px-1.5">
                                {enabled} active
                              </Badge>
                              <Badge variant="outline" className="text-[10px] font-normal px-1.5 border-amber-300/50 text-amber-600 dark:text-amber-400">
                                {required} required
                              </Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                          <div className="divide-y">
                            {fields.map((field, idx) => (
                              <FieldRow
                                key={field.fieldId}
                                field={field}
                                striped={idx % 2 === 1}
                                onUpdate={(patch) => updateField(selectedApp.id, field.fieldId, patch)}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          )}

          {/* ── Document Requirements ────────────────────────────── */}
          {activeSection === "documents" && (
            <div className="space-y-6">
              <SectionHeader
                icon={FileText}
                title="Document Requirements"
                description="Define which documents the AI should request. AI notes guide what the assistant looks for when reviewing uploads."
              />

              <AppTypeSelector
                appTypes={config.applicationTypes}
                selected={selectedAppType}
                onSelect={setSelectedAppType}
              />

              {selectedApp && (
                <Accordion type="multiple" defaultValue={Object.keys(DOC_CATEGORY_LABELS)} className="space-y-3">
                  {Object.entries(groupBy(selectedApp.documents)).map(([category, docs]) => {
                    const CatIcon = DOC_CATEGORY_ICONS[category] || FileText;
                    const enabled = docs.filter((d) => d.enabled).length;
                    const required = docs.filter((d) => d.enabled && d.required).length;

                    return (
                      <AccordionItem key={category} value={category} className="border rounded-xl overflow-hidden">
                        <AccordionTrigger className="hover:no-underline px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <CatIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm">
                              {DOC_CATEGORY_LABELS[category] ?? category}
                            </span>
                            <div className="flex items-center gap-1.5 ml-auto mr-3">
                              <Badge variant="outline" className="text-[10px] font-normal px-1.5">
                                {enabled} active
                              </Badge>
                              <Badge variant="outline" className="text-[10px] font-normal px-1.5 border-amber-300/50 text-amber-600 dark:text-amber-400">
                                {required} required
                              </Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                          <div className="divide-y">
                            {docs.map((doc, idx) => (
                              <DocRow
                                key={doc.documentType}
                                doc={doc}
                                striped={idx % 2 === 1}
                                onUpdate={(patch) => updateDoc(selectedApp.id, doc.documentType, patch)}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          )}

          {/* ── Knowledge Base ────────────────────────────────── */}
          {activeSection === "knowledge" && (
            <div className="space-y-6">
              <SectionHeader
                icon={BookOpen}
                title="Knowledge Base"
                description="Upload contract templates, rate sheets, and guidelines. The AI uses these to answer applicant questions accurately."
              />

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200">How the AI uses these documents</p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      Uploaded documents are processed and indexed so the AI can reference specific terms, rates, and policies when speaking with applicants.
                      For example, if a borrower asks "what's the early termination fee?", the AI will find and cite the relevant clause from your contract templates.
                    </p>
                  </div>
                </div>
              </div>

              {Object.entries(KB_CATEGORY_LABELS).map(([category, label]) => {
                const docs = config.knowledgeBase.filter((d) => d.category === category);
                return (
                  <KBCategorySection
                    key={category}
                    category={category as KnowledgeDocument["category"]}
                    label={label}
                    docs={docs}
                    appTypes={config.applicationTypes}
                    onUpload={(newDoc) => {
                      setConfig((prev) => prev ? ({
                        ...prev,
                        knowledgeBase: [...prev.knowledgeBase, newDoc],
                      }) : prev);
                      const delay = 2000 + Math.random() * 1500;
                      setTimeout(() => {
                        setConfig((prev) => prev ? ({
                          ...prev,
                          knowledgeBase: prev.knowledgeBase.map((d) =>
                            d.id === newDoc.id ? { ...d, status: "processed" as const } : d
                          ),
                        }) : prev);
                        toast({ title: "Document processed", description: `${newDoc.name} is ready for AI use.` });
                      }, delay);
                    }}
                    onDelete={(id) =>
                      setConfig((prev) => prev ? ({
                        ...prev,
                        knowledgeBase: prev.knowledgeBase.filter((d) => d.id !== id),
                      }) : prev)
                    }
                    onUpdate={(id, patch) =>
                      setConfig((prev) => prev ? ({
                        ...prev,
                        knowledgeBase: prev.knowledgeBase.map((d) =>
                          d.id === id ? { ...d, ...patch } : d
                        ),
                      }) : prev)
                    }
                  />
                );
              })}
            </div>
          )}

          {/* ── Branding ─────────────────────────────────────────── */}
          {activeSection === "branding" && (
            <div className="space-y-6">
              <SectionHeader
                icon={Palette}
                title="Branding"
                description="Customize how the AI assistant looks and greets your applicants."
              />

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Controls */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Company Name</Label>
                    <Input
                      value={config.branding.companyName}
                      onChange={(e) => updateBranding({ companyName: e.target.value })}
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Logo</Label>
                    <input
                      ref={logoFileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleLogoSelect}
                    />
                    {config.branding.logoUrl ? (
                      <div className="border-2 border-dashed rounded-xl p-4 text-center space-y-2">
                        <img
                          src={config.branding.logoUrl}
                          alt="Uploaded logo"
                          className="h-12 mx-auto object-contain"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => logoFileRef.current?.click()}
                          >
                            Replace
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateBranding({ logoUrl: "" })}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed rounded-xl p-6 text-center hover:border-foreground/20 transition-colors cursor-pointer group"
                        onClick={() => logoFileRef.current?.click()}
                      >
                        <Upload className="w-6 h-6 mx-auto text-muted-foreground group-hover:text-foreground/50 transition-colors mb-1.5" />
                        <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, WebP up to 2MB</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Colors</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <ColorPicker
                        label="Primary"
                        value={config.branding.primaryColor}
                        onChange={(v) => updateBranding({ primaryColor: v })}
                      />
                      <ColorPicker
                        label="Accent"
                        value={config.branding.accentColor}
                        onChange={(v) => updateBranding({ accentColor: v })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Welcome Message</Label>
                    <Textarea
                      value={config.branding.welcomeMessage}
                      onChange={(e) => updateBranding({ welcomeMessage: e.target.value })}
                      rows={4}
                      placeholder="The first message the AI shows to applicants..."
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">This is the first thing applicants see when the AI chat opens.</p>
                  </div>
                </div>

                {/* Live preview */}
                <div className="lg:col-span-2">
                  <div className="sticky top-6 space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Live Preview</p>
                    <AIConfigPreview branding={config.branding} />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
