import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Search, Plus, Download } from "lucide-react";
import TableFilters from "@/components/TableFilters";

const Contracts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: [] as string[],
  });
  const allContracts = [
    { id: "CNT-2025-001", company: "TechCorp Industries", type: "Equipment Lease", term: "36 months", value: "$1.2M", signed: "2025-10-15", expires: "2028-10-15" },
    { id: "CNT-2025-002", company: "MedEquip Solutions", type: "Finance Agreement", term: "48 months", value: "$890K", signed: "2025-09-20", expires: "2029-09-20" },
    { id: "CNT-2025-003", company: "BuildPro Construction", type: "Equipment Lease", term: "24 months", value: "$2.1M", signed: "2025-08-10", expires: "2027-08-10" },
  ];

  const filterGroups = [
    {
      label: "Type",
      options: [
        { label: "Equipment Lease", value: "Equipment Lease", checked: filters.type.includes("Equipment Lease") },
        { label: "Finance Agreement", value: "Finance Agreement", checked: filters.type.includes("Finance Agreement") },
      ]
    }
  ];

  const handleFilterChange = (groupLabel: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      type: checked 
        ? [...prev.type, value]
        : prev.type.filter(v => v !== value)
    }));
  };

  const handleClearFilters = () => {
    setFilters({ type: [] });
  };

  const activeFilterCount = filters.type.length;

  const contracts = useMemo(() => {
    return allContracts.filter(contract => {
      const matchesSearch = contract.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contract.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filters.type.length === 0 || filters.type.includes(contract.type);
      
      return matchesSearch && matchesType;
    });
  }, [searchQuery, filters]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Contracts</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage lease agreements and financing contracts</p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Contract
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Search & Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search contracts..." 
              className="pl-10 bg-white border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <TableFilters 
            filters={filterGroups}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearFilters}
            activeCount={activeFilterCount}
          />
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-float">
          {/* Table Header */}
          <div className="grid grid-cols-[1.2fr_2fr_1.5fr_1fr_1fr_1fr_1fr_0.8fr] gap-6 px-6 py-4 border-b border-border bg-background/50">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contract ID</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Term</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Signed</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expires</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {contracts.map((contract) => (
              <div 
                key={contract.id} 
                className="grid grid-cols-[1.2fr_2fr_1.5fr_1fr_1fr_1fr_1fr_0.8fr] gap-6 px-6 py-5 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-purple/5 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-mono font-semibold gradient-sharpei-text text-sm">{contract.id}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{contract.company}</p>
                </div>
                <div>
                  <p className="text-foreground text-sm">{contract.type}</p>
                </div>
                <div>
                  <p className="text-foreground text-sm">{contract.term}</p>
                </div>
                <div>
                  <p className="font-semibold gradient-sharpei-text text-sm">{contract.value}</p>
                </div>
                <div>
                  <p className="text-foreground text-sm">{contract.signed}</p>
                </div>
                <div>
                  <p className="text-foreground text-sm">{contract.expires}</p>
                </div>
                <div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contracts;
