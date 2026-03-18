import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload, CheckCircle2, FileText, X, Shield, Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadItem {
  id: string;
  name: string;
  required: boolean;
  uploaded: boolean;
  uploading: boolean;
  fileName?: string;
}

export default function InboxUploadPortal() {
  const { applicationId } = useParams();
  const { toast } = useToast();

  const [items, setItems] = useState<UploadItem[]>([
    { id: "1", name: "Personal ID (Guarantor)", required: true, uploaded: false, uploading: false },
    { id: "2", name: "Bank Statements (6 months)", required: true, uploaded: false, uploading: false },
  ]);

  const uploaded = items.filter((i) => i.uploaded).length;
  const total = items.length;
  const progress = Math.round((uploaded / total) * 100);
  const allDone = uploaded === total;

  const handleUpload = (itemId: string) => {
    // Simulate file upload
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, uploading: true } : item
      )
    );

    setTimeout(() => {
      const fakeNames: Record<string, string> = {
        "1": "Juan_Perez_DNI.pdf",
        "2": "Constructora_XYZ_Bank_Statements_Jul-Dec_2024.pdf",
      };

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, uploading: false, uploaded: true, fileName: fakeNames[item.id] || "document.pdf" }
            : item
        )
      );

      toast({ title: "Document uploaded", description: "Your document has been received and is being verified." });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-semibold">Secure Document Upload</h1>
          <p className="text-sm text-muted-foreground">
            Upload the required documents for your leasing application
          </p>
          <Badge variant="secondary" className="text-xs">
            Application #{applicationId?.slice(-6).toUpperCase()}
          </Badge>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Upload Progress</p>
              <p className="text-sm text-muted-foreground">{uploaded} of {total}</p>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Upload Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className={item.uploaded ? "border-emerald-200 bg-emerald-50/30" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.uploaded ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      {item.fileName && (
                        <p className="text-xs text-muted-foreground">{item.fileName}</p>
                      )}
                    </div>
                  </div>
                  {item.uploaded ? (
                    <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-300">
                      Uploaded
                    </Badge>
                  ) : item.uploading ? (
                    <Button size="sm" disabled className="gap-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => handleUpload(item.id)}>
                      <Upload className="w-4 h-4" />
                      Upload
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Completion */}
        {allDone && (
          <Card className="border-emerald-300 bg-emerald-50">
            <CardContent className="py-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-medium text-emerald-800">All Documents Uploaded!</h3>
              <p className="text-sm text-emerald-700 mt-1">
                Your documents are being verified. We'll notify you once your application is ready for review.
              </p>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Your documents are encrypted and securely stored. By uploading, you agree to our privacy policy.
        </p>
      </div>
    </div>
  );
}
