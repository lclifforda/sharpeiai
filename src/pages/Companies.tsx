import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Search, Plus, MoreVertical } from "lucide-react";

const Companies = () => {
  const companies = [
    { name: "TechCorp Industries", type: "Technology", leases: 23, value: "$1.2M", status: "Active" },
    { name: "MedEquip Solutions", type: "Healthcare", leases: 15, value: "$890K", status: "Active" },
    { name: "BuildPro Construction", type: "Construction", leases: 31, value: "$2.1M", status: "Active" },
    { name: "AgriTech Farms", type: "Agriculture", leases: 8, value: "$450K", status: "Pending" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-semibold text-foreground">Companies</h1>
              </div>
              <p className="text-muted-foreground">Manage your client companies and their leases</p>
            </div>
            <Button className="gradient-sharpei text-white hover:opacity-90 shadow-float">
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search companies..." 
            className="pl-10 bg-white border-border"
          />
        </div>

        {/* Companies List */}
        <div className="grid gap-4">
          {companies.map((company) => (
            <Card key={company.name} className="p-6 hover:shadow-float transition-all duration-300 border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-12 h-12 rounded-xl gradient-sharpei flex items-center justify-center shadow-float">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 grid grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Company</p>
                      <p className="font-semibold text-foreground">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Active Leases</p>
                      <p className="text-2xl font-bold text-foreground">{company.leases}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                      <p className="text-2xl font-bold text-foreground">{company.value}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        company.status === "Active" 
                          ? "bg-gradient-start/10 text-gradient-start" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {company.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
