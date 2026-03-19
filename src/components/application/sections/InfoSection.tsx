import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck, X, File } from "lucide-react";
import FieldRenderer from "../FieldRenderer";
import CustomerRecognitionCard from "@/components/CustomerRecognitionCard";
import { FIELD_CATEGORY_LABELS, type EnabledField } from "@/services/platformConfigMockData";
import type { AuthState } from "../types";

interface InfoSectionProps {
  formData: Record<string, string>;
  errors: Record<string, string>;
  authState: AuthState;
  fieldsByCategory: Record<string, EnabledField[]>;
  requiredDocuments: Array<{ id: string; name: string; description?: string }>;
  uploadedDocs: Record<string, File | null>;
  draggedOver: string | null;
  onFieldChange: (fieldId: string, value: string) => void;
  onCompanyBlur: () => void;
  onEmailBlur: () => void;
  onVerified: (data: { companyId: string; company: any; representative: any }) => void;
  onDismissRecognition: () => void;
  onChangeCompany: () => void;
  onFileUpload: (docId: string, file: File | null) => void;
  onRemoveFile: (docId: string) => void;
  onDragOver: (e: React.DragEvent, docId: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, docId: string) => void;
  onSubmit: () => void;
}

export default function InfoSection({
  formData,
  errors,
  authState,
  fieldsByCategory,
  requiredDocuments,
  uploadedDocs,
  draggedOver,
  onFieldChange,
  onCompanyBlur,
  onEmailBlur,
  onVerified,
  onDismissRecognition,
  onChangeCompany,
  onFileUpload,
  onRemoveFile,
  onDragOver,
  onDragLeave,
  onDrop,
  onSubmit,
}: InfoSectionProps) {
  return (
    <>
      {/* Dynamic Field Sections by Category */}
      {Object.entries(fieldsByCategory).map(([category, fields]) => (
        <Card key={category}>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              {FIELD_CATEGORY_LABELS[category] || category}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <FieldRenderer
                  key={field.id}
                  field={field}
                  value={formData[field.id] || ""}
                  error={errors[field.id]}
                  onChange={onFieldChange}
                  onBlur={
                    field.id === "companyName" ? onCompanyBlur :
                    field.id === "contactEmail" ? onEmailBlur :
                    undefined
                  }
                  authState={authState}
                  onChangeCompany={onChangeCompany}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Company Recognition Card — only show when recognized but not yet verified */}
      {authState.status === "recognized" && (
        <CustomerRecognitionCard
          companyName={formData.companyName || ""}
          email={formData.contactEmail || ""}
          onVerified={onVerified}
          onDismiss={onDismissRecognition}
        />
      )}

      {/* Required Documents */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Required Documents</h2>
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
                  onDragOver={(e) => onDragOver(e, doc.id)}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(e, doc.id)}
                  className={`group relative rounded-lg border-2 border-dashed transition-all duration-300 animate-fade-in ${
                    isUploaded
                      ? "border-primary bg-primary/5 shadow-sm"
                      : isDragging
                      ? "border-primary bg-primary/10 scale-[1.02]"
                      : "border-border hover:border-primary/50 hover:bg-accent/50"
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isUploaded
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}>
                        {isUploaded ? <FileCheck className="w-6 h-6 animate-scale-in" /> : <File className="w-6 h-6" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-muted-foreground">{index + 1} / {requiredDocuments.length}</span>
                          <h3 className="font-semibold text-foreground">{doc.name}</h3>
                        </div>
                        {doc.description && <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>}

                        {isUploaded ? (
                          <div className="flex items-center gap-2 animate-fade-in">
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
                        ) : (
                          <div className="text-xs text-muted-foreground">PDF, DOC, DOCX, JPG, PNG &middot; Max 10MB</div>
                        )}
                      </div>

                      {!isUploaded ? (
                        <label htmlFor={`file-${doc.id}`} className="cursor-pointer">
                          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-sm">
                            <Upload className="w-4 h-4" /><span className="text-sm font-medium">Upload</span>
                          </div>
                          <input id={`file-${doc.id}`} type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => onFileUpload(doc.id, e.target.files?.[0] || null)} />
                        </label>
                      ) : (
                        <label htmlFor={`file-${doc.id}`} className="cursor-pointer">
                          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-accent transition-colors">
                            <Upload className="w-4 h-4 text-muted-foreground" /><span className="text-sm font-medium text-foreground">Replace</span>
                          </div>
                          <input id={`file-${doc.id}`} type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => onFileUpload(doc.id, e.target.files?.[0] || null)} />
                        </label>
                      )}
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
        onClick={onSubmit}
        className="w-full bg-foreground hover:bg-foreground/90 text-background"
        size="lg"
      >
        Continue
      </Button>
    </>
  );
}
