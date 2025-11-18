import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Eye, FileText, TrendingUp, Package, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableFilters from "@/components/TableFilters";

const Assets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    condition: [] as string[],
    status: [] as string[],
    category: [] as string[],
  });

  const allAssets = [
    {
      id: "AST-001",
      name: "CNC Milling Machine Pro X500",
      serialNumber: "CNC-2024-X500-1234",
      category: "Manufacturing",
      condition: "New",
      status: "Active",
      contractId: "CNT-2024-001",
      contractName: "TechManu Corp Lease",
      insurancePolicy: "INS-2024-MFG-789",
      insuranceProvider: "Industrial Shield Insurance",
      merchant: "Advanced Manufacturing Equipment Ltd.",
      purchaseDate: "2024-01-15",
      currentValue: "$125,000",
      location: "Warehouse A - Bay 12",
    },
    {
      id: "AST-002",
      name: "MRI Scanner Siemens Magnetom",
      serialNumber: "MRI-SIE-2023-7890",
      category: "Medical",
      condition: "Excellent",
      status: "Active",
      contractId: "CNT-2023-087",
      contractName: "Metro Health Systems",
      insurancePolicy: "INS-2023-MED-456",
      insuranceProvider: "MedEquip Assurance Co.",
      merchant: "Medical Imaging Solutions Inc.",
      purchaseDate: "2023-08-22",
      currentValue: "$890,000",
      location: "Medical Depot - Room 3",
    },
    {
      id: "AST-003",
      name: "Excavator CAT 320 GC",
      serialNumber: "CAT-320-2024-4567",
      category: "Construction",
      condition: "Good",
      status: "Active",
      contractId: "CNT-2024-034",
      contractName: "BuildRight Construction",
      insurancePolicy: "INS-2024-CNS-123",
      insuranceProvider: "Heavy Equipment Insurance Corp",
      merchant: "Caterpillar Equipment Dealers",
      purchaseDate: "2024-03-10",
      currentValue: "$75,000",
      location: "Warehouse B - Yard 5",
    },
    {
      id: "AST-004",
      name: "Dell PowerEdge Server Rack R750",
      serialNumber: "DELL-R750-2024-8901",
      category: "IT Hardware",
      condition: "New",
      status: "Active",
      contractId: "CNT-2024-112",
      contractName: "CloudTech Solutions Lease",
      insurancePolicy: "INS-2024-IT-234",
      insuranceProvider: "Tech Asset Protection Inc.",
      merchant: "Dell Technologies Enterprise",
      purchaseDate: "2024-02-28",
      currentValue: "$25,000",
      location: "Tech Center - Rack A3",
    },
    {
      id: "AST-005",
      name: "Ultrasound Machine GE Voluson",
      serialNumber: "GE-VOL-2023-3456",
      category: "Medical",
      condition: "Good",
      status: "Maintenance",
      contractId: "CNT-2023-156",
      contractName: "Women's Health Clinic",
      insurancePolicy: "INS-2023-MED-567",
      insuranceProvider: "MedEquip Assurance Co.",
      merchant: "GE Healthcare Systems",
      purchaseDate: "2023-11-05",
      currentValue: "$145,000",
      location: "Medical Depot - Room 7",
    },
    {
      id: "AST-006",
      name: "Laser Cutting Machine Trumpf TruLaser",
      serialNumber: "TRU-LASER-2024-2345",
      category: "Manufacturing",
      condition: "Excellent",
      status: "Active",
      contractId: "CNT-2024-078",
      contractName: "Precision Metal Works",
      insurancePolicy: "INS-2024-MFG-890",
      insuranceProvider: "Industrial Shield Insurance",
      merchant: "Trumpf Industrial Equipment",
      purchaseDate: "2024-04-18",
      currentValue: "$285,000",
      location: "Warehouse A - Bay 8",
    },
    {
      id: "AST-007",
      name: "Bulldozer Komatsu D65EX",
      serialNumber: "KOM-D65-2023-6789",
      category: "Construction",
      condition: "Fair",
      status: "Active",
      contractId: "CNT-2023-234",
      contractName: "Highway Construction Ltd",
      insurancePolicy: "INS-2023-CNS-678",
      insuranceProvider: "Heavy Equipment Insurance Corp",
      merchant: "Komatsu Equipment Dealers",
      purchaseDate: "2023-06-12",
      currentValue: "$165,000",
      location: "Warehouse B - Yard 2",
    },
    {
      id: "AST-008",
      name: "HPE ProLiant Server DL380",
      serialNumber: "HPE-DL380-2024-5678",
      category: "IT Hardware",
      condition: "New",
      status: "Active",
      contractId: "CNT-2024-145",
      contractName: "DataCore Analytics",
      insurancePolicy: "INS-2024-IT-345",
      insuranceProvider: "Tech Asset Protection Inc.",
      merchant: "HPE Enterprise Solutions",
      purchaseDate: "2024-05-20",
      currentValue: "$32,000",
      location: "Tech Center - Rack B7",
    },
  ];

  const filterGroups = [
    {
      label: "Condition",
      options: [
        { label: "New", value: "New", checked: filters.condition.includes("New") },
        { label: "Excellent", value: "Excellent", checked: filters.condition.includes("Excellent") },
        { label: "Good", value: "Good", checked: filters.condition.includes("Good") },
        { label: "Fair", value: "Fair", checked: filters.condition.includes("Fair") },
      ],
    },
    {
      label: "Status",
      options: [
        { label: "Active", value: "Active", checked: filters.status.includes("Active") },
        { label: "Maintenance", value: "Maintenance", checked: filters.status.includes("Maintenance") },
        { label: "Inactive", value: "Inactive", checked: filters.status.includes("Inactive") },
      ],
    },
    {
      label: "Category",
      options: [
        { label: "Manufacturing", value: "Manufacturing", checked: filters.category.includes("Manufacturing") },
        { label: "Medical", value: "Medical", checked: filters.category.includes("Medical") },
        { label: "Construction", value: "Construction", checked: filters.category.includes("Construction") },
        { label: "IT Hardware", value: "IT Hardware", checked: filters.category.includes("IT Hardware") },
      ],
    },
  ];

  const handleFilterChange = (groupLabel: string, value: string, checked: boolean) => {
    const key = groupLabel.toLowerCase() as keyof typeof filters;
    setFilters((prev) => ({
      ...prev,
      [key]: checked ? [...prev[key], value] : prev[key].filter((v) => v !== value),
    }));
  };

  const handleClearFilters = () => {
    setFilters({ condition: [], status: [], category: [] });
  };

  const activeFilterCount = filters.condition.length + filters.status.length + filters.category.length;

  const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.contractName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.merchant.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCondition = filters.condition.length === 0 || filters.condition.includes(asset.condition);
      const matchesStatus = filters.status.length === 0 || filters.status.includes(asset.status);
      const matchesCategory = filters.category.length === 0 || filters.category.includes(asset.category);

      return matchesSearch && matchesCondition && matchesStatus && matchesCategory;
    });
  }, [searchQuery, filters]);

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case "Active":
        return "default";
      case "Maintenance":
        return "secondary";
      case "Inactive":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <h1 className="text-2xl font-semibold text-foreground">Asset Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive view of all bank-owned assets with detailed tracking information
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Asset Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="p-4 hover:shadow-minimal transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Assets</p>
                  <p className="text-2xl font-semibold text-foreground mt-2">{allAssets.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Across 4 categories</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Package className="w-5 h-5 text-foreground" />
                </div>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-minimal transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Contracts</p>
                  <p className="text-2xl font-semibold text-foreground mt-2">
                    {allAssets.filter((a) => a.status === "Active").length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">In operation</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-foreground" />
                </div>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-minimal transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Value</p>
                  <p className="text-2xl font-semibold text-foreground mt-2">$1.74M</p>
                  <p className="text-xs text-muted-foreground mt-1">Current valuation</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <FileText className="w-5 h-5 text-foreground" />
                </div>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-minimal transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Maintenance</p>
                  <p className="text-2xl font-semibold text-foreground mt-2">
                    {allAssets.filter((a) => a.status === "Maintenance").length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Under service</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-foreground" />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Search & Filters */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Asset Registry</h2>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  className="pl-10 bg-white border-border h-10"
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
            <Button variant="outline" size="sm" className="gap-2 h-10">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </section>

        {/* Assets Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-medium text-xs uppercase tracking-wide">ID</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Asset</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Serial</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Category</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Condition</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Contract</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Insurance</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Merchant</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Purchase Date</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Value</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide">Location</TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wide text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="w-8 h-8 text-muted-foreground/50" />
                        <p>No assets found matching your criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground">{asset.id}</TableCell>
                      <TableCell>
                        <div className="font-medium text-sm text-foreground max-w-[200px]">{asset.name}</div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                          {asset.serialNumber}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {asset.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-foreground">{asset.condition}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(asset.status)} className="text-xs">
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[180px]">
                          <div className="font-mono text-xs text-foreground">{asset.contractId}</div>
                          <div className="text-xs text-muted-foreground truncate">{asset.contractName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[180px]">
                          <div className="font-mono text-xs text-foreground">{asset.insurancePolicy}</div>
                          <div className="text-xs text-muted-foreground truncate">{asset.insuranceProvider}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground max-w-[160px] truncate">{asset.merchant}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">{asset.purchaseDate}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-sm text-foreground">{asset.currentValue}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-[140px] truncate">{asset.location}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-accent"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-accent"
                            title="View documents"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Results Footer */}
          {filteredAssets.length > 0 && (
            <div className="border-t bg-muted/20 px-6 py-3">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredAssets.length}</span> of{" "}
                <span className="font-medium text-foreground">{allAssets.length}</span> assets
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Assets;
