import { Card } from "@/components/ui/card";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contracts = () => {
  const contracts = [
    { id: "CNT-2025-001", company: "TechCorp Industries", type: "Equipment Lease", term: "36 months", value: "$1.2M", signed: "2025-10-15", expires: "2028-10-15" },
    { id: "CNT-2025-002", company: "MedEquip Solutions", type: "Finance Agreement", term: "48 months", value: "$890K", signed: "2025-09-20", expires: "2029-09-20" },
    { id: "CNT-2025-003", company: "BuildPro Construction", type: "Equipment Lease", term: "24 months", value: "$2.1M", signed: "2025-08-10", expires: "2027-08-10" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">Contracts</h1>
          </div>
          <p className="text-muted-foreground">Manage lease agreements and financing contracts</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="space-y-4">
          {contracts.map((contract) => (
            <Card key={contract.id} className="p-6 hover:shadow-float transition-all duration-300 border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gradient-start/20 to-gradient-pink/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gradient-start" />
                  </div>
                  <div className="grid grid-cols-5 gap-6 flex-1">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Contract ID</p>
                      <p className="font-mono font-semibold text-foreground">{contract.id}</p>
                      <p className="text-xs text-muted-foreground mt-1">{contract.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Company</p>
                      <p className="font-semibold text-foreground">{contract.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Term / Value</p>
                      <p className="font-semibold text-foreground">{contract.term}</p>
                      <p className="text-sm gradient-sharpei-text font-semibold">{contract.value}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Signed</p>
                      <p className="text-foreground">{contract.signed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Expires</p>
                      <p className="text-foreground">{contract.expires}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="border-border">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-border">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contracts;
