import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck, X, File, Loader2 } from "lucide-react";
import type { DocumentVerificationState } from "../types";

interface DocumentsSectionProps {
  documents: Array<{ id: string; name: string; description?: string }>;
  uploadedDocs: Record<string, File | null>;
  documentVerification: Record<string, DocumentVerificationState>;
  draggedOver: string | null;
  enableOCR: boolean;
  isLastSection: boolean;
  isSubmitting: boolean;
  title?: string;
  subtitle?: string;
  onFileUpload: (docId: string, file: File | null) => void;
  onRemoveFile: (docId: string) => void;
  onDragOver: (e: React.DragEvent, docId: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, docId: string) => void;
  onContinue: () => void;
  onSubmit: () => void;
}

export default function DocumentsSection({
  documents,
  uploadedDocs,
  documentVerification,
  draggedOver,
  enableOCR,
  isLastSection,
  isSubmitting,
  title = "Required Documents",
  subtitle = "Upload the following documents to complete your application",
  onFileUpload,
  onRemoveFile,
  onDragOver,
  onDragLeave,
  onDrop,
  onContinue,
  onSubmit,
}: DocumentsSectionProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="space-y-4">
          {documents.map((doc, index) => {
            const isUploaded = !!uploadedDocs[doc.id];
            const isDragging = draggedOver === doc.id;
            const verification = documentVerification[doc.id];
            const isProcessing = enableOCR && verification?.status === "processing";
            const isVerified = enableOCR && verification?.status === "verified";
            const isRejected = enableOCR && verification?.status === "rejected";

            return (
              <div
                key={doc.id}
                onDragOver={(e) => onDragOver(e, doc.id)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, doc.id)}
                className={`group relative rounded-lg border-2 border-dashed transition-all duration-300 animate-fade-in ${
                  isVerified ? "border-green-500 bg-green-500/5 shadow-sm"
                  : isRejected ? "border-red-500 bg-red-500/5 shadow-sm"
                  : isProcessing ? "border-blue-500 bg-blue-500/5 shadow-sm"
                  : isUploaded ? "border-primary bg-primary/5 shadow-sm"
                  : isDragging ? "border-primary bg-primary/10 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isVerified ? "bg-green-500 text-white scale-110"
                      : isRejected ? "bg-red-500 text-white scale-110"
                      : isProcessing ? "bg-blue-500 text-white animate-pulse"
                      : isUploaded ? "bg-primary text-primary-foreground scale-110"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}>
                      {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" />
                      : isVerified ? <FileCheck className="w-6 h-6 animate-scale-in" />
                      : isRejected ? <X className="w-6 h-6" />
                      : isUploaded ? <FileCheck className="w-6 h-6 animate-scale-in" />
                      : <File className="w-6 h-6" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-muted-foreground">{index + 1} / {documents.length}</span>
                        <h3 className="font-semibold text-foreground">{doc.name}</h3>
                      </div>
                      {doc.description && <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>}

                      {isUploaded ? (
                        <div className="space-y-2 animate-fade-in">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-background rounded-md border border-border">
                              <File className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm text-foreground truncate">{uploadedDocs[doc.id]?.name}</span>
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                {uploadedDocs[doc.id] && (uploadedDocs[doc.id]!.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveFile(doc.id)} className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          {enableOCR && isProcessing && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                              <Loader2 className="w-3 h-3 animate-spin" /> Processing document with OCR...
                            </div>
                          )}
                          {enableOCR && isVerified && (
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-green-600 dark:text-green-400">{"\u2713"} Document verified</div>
                              {verification?.extractedData && Object.keys(verification.extractedData).length > 0 && (
                                <div className="bg-muted/50 p-3 rounded-md">
                                  <p className="text-xs font-semibold mb-2">Extracted Data (OCR):</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(verification.extractedData).map(([key, value]) => (
                                      <div key={key} className="text-xs">
                                        <span className="text-muted-foreground">{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</span>
                                        <span className="ml-1 font-medium text-foreground">{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {verification?.verificationNotes && verification.verificationNotes.length > 0 && (
                                <div className="space-y-1">
                                  {verification.verificationNotes.map((note, idx) => (
                                    <div key={idx} className={`text-xs p-2 rounded ${
                                      note.includes("\u2713") ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                      : note.includes("OCR") ? "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                      : "bg-muted"
                                    }`}>{note}</div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          {enableOCR && isRejected && (
                            <div className="space-y-1">
                              <div className="text-xs font-semibold text-red-600 dark:text-red-400">{"\u26A0"} Document verification failed</div>
                              {verification?.verificationNotes?.map((note, idx) => (
                                <div key={idx} className="text-xs p-2 rounded bg-red-500/10 text-red-700 dark:text-red-400">{note}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">PDF, DOC, DOCX, JPG, PNG {"\u2022"} Max 10MB</div>
                      )}
                    </div>

                    {!isUploaded ? (
                      <label htmlFor={`file-${doc.id}`} className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-sm">
                          <Upload className="w-4 h-4" /><span className="text-sm font-medium">Upload</span>
                        </div>
                        <input id={`file-${doc.id}`} type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => onFileUpload(doc.id, e.target.files?.[0] || null)} />
                      </label>
                    ) : !isProcessing ? (
                      <label htmlFor={`file-replace-${doc.id}`} className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-accent transition-colors">
                          <Upload className="w-4 h-4 text-muted-foreground" /><span className="text-sm font-medium text-foreground">Replace</span>
                        </div>
                        <input id={`file-replace-${doc.id}`} type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => onFileUpload(doc.id, e.target.files?.[0] || null)} />
                      </label>
                    ) : null}
                  </div>
                </div>

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
              {documents.filter((d) => uploadedDocs[d.id]).length} of {documents.length} documents uploaded
            </span>
          </div>
          {documents.every((d) => uploadedDocs[d.id]) && (
            <div className="flex items-center gap-2 text-primary animate-fade-in">
              <FileCheck className="w-4 h-4" /><span className="text-sm font-medium">All documents uploaded</span>
            </div>
          )}
        </div>

        <Button
          onClick={isLastSection ? onSubmit : onContinue}
          disabled={isSubmitting}
          className="w-full bg-foreground hover:bg-foreground/90 text-background"
          size="lg"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Assessing...</>
          ) : isLastSection ? "Submit Application" : "Continue"}
        </Button>
      </CardContent>
    </Card>
  );
}
