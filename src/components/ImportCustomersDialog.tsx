import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";

// ── CSV template columns ────────────────────────────────────────────────

const TEMPLATE_COLUMNS = [
  "Company Name",
  "Industry",
  "Location",
  "Contact Name",
  "Contact Email",
  "Contact Phone",
  "Status",
] as const;

const SAMPLE_ROWS = [
  ["Acme Corp", "Manufacturing", "Dallas, TX", "John Smith", "john@acme.com", "(555) 123-4567", "active"],
  ["GlobalTech Solutions", "Technology", "San Jose, CA", "Sarah Lee", "sarah@globaltech.com", "(555) 987-6543", "active"],
];

export interface ImportedCompany {
  name: string;
  industry: string;
  location: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
}

interface ParsedRow {
  data: ImportedCompany;
  errors: string[];
  rowNumber: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function downloadTemplate() {
  const header = TEMPLATE_COLUMNS.join(",");
  const rows = SAMPLE_ROWS.map((r) =>
    r.map((v) => (v.includes(",") ? `"${v}"` : v)).join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "companies_import_template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(current.trim());
        current = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(current.trim());
        if (row.some((c) => c.length > 0)) rows.push(row);
        row = [];
        current = "";
      } else {
        current += ch;
      }
    }
  }
  row.push(current.trim());
  if (row.some((c) => c.length > 0)) rows.push(row);
  return rows;
}

function validateRow(cells: string[], rowNumber: number): ParsedRow {
  const errors: string[] = [];
  const name = cells[0] ?? "";
  const industry = cells[1] ?? "";
  const location = cells[2] ?? "";
  const contactName = cells[3] ?? "";
  const contactEmail = cells[4] ?? "";
  const contactPhone = cells[5] ?? "";
  const status = (cells[6] ?? "active").toLowerCase();

  if (!name) errors.push("Company Name is required");
  if (!industry) errors.push("Industry is required");
  if (!location) errors.push("Location is required");
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    errors.push("Invalid email format");
  }
  if (status && !["active", "inactive"].includes(status)) {
    errors.push('Status must be "active" or "inactive"');
  }

  return {
    data: { name, industry, location, contactName, contactEmail, contactPhone, status: status || "active" },
    errors,
    rowNumber,
  };
}

// ── Component ────────────────────────────────────────────────────────────

type Step = "upload" | "preview" | "importing" | "done";

interface ImportCustomersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (companies: ImportedCompany[]) => void;
}

export function ImportCustomersDialog({ open, onOpenChange, onImport }: ImportCustomersDialogProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("upload");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);

  const validRows = parsedRows.filter((r) => r.errors.length === 0);
  const errorRows = parsedRows.filter((r) => r.errors.length > 0);

  const reset = useCallback(() => {
    setStep("upload");
    setFileName("");
    setParsedRows([]);
    setDragging(false);
  }, []);

  const handleClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) reset();
      onOpenChange(isOpen);
    },
    [onOpenChange, reset]
  );

  const processFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      const rows = parseCSV(text);
      if (rows.length < 2) {
        toast({ title: "Empty file", description: "The CSV file doesn't contain any data rows.", variant: "destructive" });
        return;
      }
      // Skip header row
      const dataRows = rows.slice(1);
      const parsed = dataRows.map((cells, idx) => validateRow(cells, idx + 2));
      setParsedRows(parsed);
      setStep("preview");
    };
    reader.readAsText(file);
  }, [toast]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      if (!file.name.endsWith(".csv")) {
        toast({ title: "Invalid file type", description: "Please upload a CSV file.", variant: "destructive" });
        return;
      }
      processFile(file);
    },
    [processFile, toast]
  );

  const handleImport = useCallback(() => {
    setStep("importing");
    // Simulate processing delay
    setTimeout(() => {
      onImport(validRows.map((r) => r.data));
      setStep("done");
    }, 1500 + Math.random() * 1000);
  }, [validRows, onImport]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === "upload" && "Import Customers"}
            {step === "preview" && "Review Import"}
            {step === "importing" && "Importing..."}
            {step === "done" && "Import Complete"}
          </DialogTitle>
          <DialogDescription>
            {step === "upload" && "Upload a CSV file to bulk import customers. Download the template first to get the right format."}
            {step === "preview" && `${parsedRows.length} rows found in ${fileName}`}
            {step === "importing" && "Processing your import, this will just take a moment."}
            {step === "done" && `Successfully imported ${validRows.length} customers.`}
          </DialogDescription>
        </DialogHeader>

        {/* ── Step: Upload ─────────────────────────────────────── */}
        {step === "upload" && (
          <div className="space-y-4 py-2">
            {/* Download template */}
            <button
              onClick={downloadTemplate}
              className="w-full flex items-center gap-4 p-4 rounded-xl border hover:border-foreground/20 hover:bg-muted/30 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Download CSV Template</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Get the template with the correct columns and 2 example rows
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
            </button>

            {/* Upload area */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
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
              className={`w-full border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer group ${
                dragging ? "border-foreground/40 bg-muted/50" : "hover:border-foreground/20"
              }`}
            >
              <Upload className={`w-8 h-8 mx-auto transition-colors mb-2 ${dragging ? "text-foreground/60" : "text-muted-foreground group-hover:text-foreground/50"}`} />
              <p className={`text-sm font-medium transition-colors ${dragging ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/70"}`}>
                {dragging ? "Drop your CSV here..." : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">CSV files only</p>
            </button>

            {/* Column reference */}
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Expected columns:</p>
              <div className="flex flex-wrap gap-1.5">
                {TEMPLATE_COLUMNS.map((col) => (
                  <Badge key={col} variant="outline" className="text-[10px] font-normal px-1.5">
                    {col}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step: Preview ────────────────────────────────────── */}
        {step === "preview" && (
          <div className="space-y-4 py-2">
            {/* Summary badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-medium text-foreground">{validRows.length}</span>
                <span className="text-muted-foreground">ready to import</span>
              </div>
              {errorRows.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-foreground">{errorRows.length}</span>
                  <span className="text-muted-foreground">with errors (will be skipped)</span>
                </div>
              )}
            </div>

            {/* Preview table */}
            <div className="border rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Row</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Company Name</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Industry</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Location</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {parsedRows.map((row) => {
                    const hasError = row.errors.length > 0;
                    return (
                      <tr
                        key={row.rowNumber}
                        className={hasError ? "bg-red-50/50 dark:bg-red-950/20" : ""}
                      >
                        <td className="px-3 py-2 text-xs text-muted-foreground">{row.rowNumber}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            {hasError && <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />}
                            <span className={`truncate max-w-[160px] ${hasError ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
                              {row.data.name || "—"}
                            </span>
                          </div>
                          {hasError && (
                            <p className="text-[10px] text-red-500 mt-0.5">{row.errors.join(", ")}</p>
                          )}
                        </td>
                        <td className="px-3 py-2 text-foreground">{row.data.industry || "—"}</td>
                        <td className="px-3 py-2 text-foreground">{row.data.location || "—"}</td>
                        <td className="px-3 py-2">
                          {hasError ? (
                            <Badge variant="outline" className="text-[10px] border-red-300/50 text-red-500">
                              Error
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] border-green-300/50 text-green-600 dark:text-green-400 capitalize">
                              {row.data.status}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Step: Importing ─────────────────────────────────── */}
        {step === "importing" && (
          <div className="py-12 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            <p className="text-sm text-muted-foreground">Importing {validRows.length} companies...</p>
          </div>
        )}

        {/* ── Step: Done ──────────────────────────────────────── */}
        {step === "done" && (
          <div className="py-12 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{validRows.length} companies imported successfully</p>
              {errorRows.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">{errorRows.length} rows skipped due to errors</p>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          {step === "preview" && (
            <div className="flex items-center gap-2 w-full justify-between">
              <Button variant="outline" onClick={() => { reset(); }}>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back
              </Button>
              <Button
                onClick={handleImport}
                disabled={validRows.length === 0}
              >
                Import {validRows.length} {validRows.length === 1 ? "Customer" : "Customers"}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          )}
          {step === "done" && (
            <Button onClick={() => handleClose(false)} className="w-full">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
