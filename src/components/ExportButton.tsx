import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { exportToCSV, exportToExcel } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  data: any[];
  filename: string;
  sheetName?: string;
}

export const ExportButton = ({ data, filename, sheetName }: ExportButtonProps) => {
  const { toast } = useToast();

  const handleExportCSV = () => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no records to export.",
        variant: "destructive",
      });
      return;
    }
    
    exportToCSV(data, filename);
    toast({
      title: "Export successful",
      description: `${data.length} records exported to CSV.`,
    });
  };

  const handleExportExcel = () => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no records to export.",
        variant: "destructive",
      });
      return;
    }
    
    exportToExcel(data, filename, sheetName);
    toast({
      title: "Export successful",
      description: `${data.length} records exported to Excel.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileText className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
