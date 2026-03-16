import { Button } from "@/components/ui/button";
import { Upload, FileCheck, File, X } from "lucide-react";

interface DocumentDef {
  id: string;
  name: string;
  description: string;
}

interface VerificationState {
  status: 'pending' | 'processing' | 'verified' | 'rejected';
  extractedData?: Record<string, any>;
  verificationNotes?: string[];
}

interface DocumentUploadCardsProps {
  documents: DocumentDef[];
  uploadedDocs: Record<string, File | null>;
  documentVerification: Record<string, VerificationState>;
  onUpload: (docId: string, file: File | null) => void;
  onRemove: (docId: string) => void;
}

const DocumentUploadCards = ({
  documents,
  uploadedDocs,
  documentVerification,
  onUpload,
  onRemove,
}: DocumentUploadCardsProps) => (
  <div className="space-y-2 mb-3">
    {documents.map((doc, index) => {
      const isUploaded = !!uploadedDocs[doc.id];
      const verification = documentVerification[doc.id];
      const isProcessing = verification?.status === 'processing';
      const isVerified = verification?.status === 'verified';
      const isRejected = verification?.status === 'rejected';

      return (
        <div
          key={doc.id}
          className={`rounded-lg border-2 transition-all duration-300 ${
            isVerified
              ? 'border-green-500 bg-green-500/5 shadow-sm'
              : isRejected
              ? 'border-red-500 bg-red-500/5 shadow-sm'
              : isProcessing
              ? 'border-blue-500 bg-blue-500/5 shadow-sm'
              : isUploaded
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
          }`}
        >
          <div className="p-3">
            <div className="flex items-start gap-3">
              {/* Icon/Status */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isVerified
                  ? 'bg-green-500 text-white'
                  : isRejected
                  ? 'bg-red-500 text-white'
                  : isProcessing
                  ? 'bg-blue-500 text-white animate-pulse'
                  : isUploaded
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isVerified ? (
                  <FileCheck className="w-4 h-4" />
                ) : isRejected ? (
                  <X className="w-4 h-4" />
                ) : isUploaded ? (
                  <FileCheck className="w-4 h-4" />
                ) : (
                  <File className="w-4 h-4" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {index + 1} / {documents.length}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">{doc.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{doc.description}</p>

                {isUploaded ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
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
                        onClick={() => onRemove(doc.id)}
                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Verification Status */}
                    {verification && (
                      <div className="space-y-2">
                        {isProcessing && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            🔄 Processing document with OCR...
                          </div>
                        )}

                        {isVerified && (
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                              ✓ Document verified
                            </div>
                            {verification.extractedData && Object.keys(verification.extractedData).length > 0 && (
                              <div className="bg-muted/50 p-3 rounded-md">
                                <p className="text-xs font-semibold mb-2">Extracted Data (OCR):</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(verification.extractedData).map(([key, value]) => (
                                    <div key={key} className="text-xs">
                                      <span className="text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                      <span className="ml-1 font-medium text-foreground">{String(value)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {verification.verificationNotes && verification.verificationNotes.length > 0 && (
                              <div className="space-y-1">
                                {verification.verificationNotes.map((note, idx) => (
                                  <div
                                    key={idx}
                                    className={`text-xs p-2 rounded ${
                                      note.includes('✓') ? 'bg-green-500/10 text-green-700 dark:text-green-400' :
                                      note.includes('OCR') ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400' :
                                      'bg-muted'
                                    }`}
                                  >
                                    {note}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {isRejected && (
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-red-600 dark:text-red-400">
                              ⚠ Document verification failed
                            </div>
                            {verification.verificationNotes && verification.verificationNotes.map((note, idx) => (
                              <div key={idx} className="text-xs p-2 rounded bg-red-500/10 text-red-700 dark:text-red-400">
                                {note}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX, JPG, PNG • Max 10MB
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label htmlFor={`file-${doc.id}`} className="cursor-pointer">
                {!isUploaded ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Upload</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-accent transition-colors">
                    <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">Replace</span>
                  </div>
                )}
                <input
                  id={`file-${doc.id}`}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => onUpload(doc.id, e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default DocumentUploadCards;
