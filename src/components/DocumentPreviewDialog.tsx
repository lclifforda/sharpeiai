import { Download, ExternalLink, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fileUrl: string | null;
  fileName?: string;
}

export default function DocumentPreviewDialog({
  open,
  onOpenChange,
  title,
  fileUrl,
  fileName,
}: DocumentPreviewDialogProps) {
  if (!fileUrl) return null;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName || title.replace(/\s+/g, "_") + ".pdf";
    a.click();
  };

  const handleOpenTab = () => {
    window.open(fileUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold pr-8">
              {title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={handleOpenTab}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Open in Tab
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={handleDownload}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 min-h-0 bg-muted/30">
          <iframe
            src={fileUrl}
            className="w-full h-full border-0"
            title={title}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
