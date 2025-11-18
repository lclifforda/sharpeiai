import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Eye, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "New":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Excellent":
        return "bg-green-100 text-green-800 border-green-200";
      case "Good":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Fair":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
        {/* Search & Filters */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by asset name, serial number, contract, or merchant..."
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
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-border p-4">
            <div className="text-sm text-muted-foreground">Total Assets</div>
            <div className="text-2xl font-semibold text-foreground mt-1">{allAssets.length}</div>
          </div>
          <div className="bg-white rounded-lg border border-border p-4">
            <div className="text-sm text-muted-foreground">Active Contracts</div>
            <div className="text-2xl font-semibold text-foreground mt-1">
              {allAssets.filter((a) => a.status === "Active").length}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-border p-4">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-2xl font-semibold text-foreground mt-1">$1.74M</div>
          </div>
          <div className="bg-white rounded-lg border border-border p-4">
            <div className="text-sm text-muted-foreground">Under Maintenance</div>
            <div className="text-2xl font-semibold text-foreground mt-1">
              {allAssets.filter((a) => a.status === "Maintenance").length}
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Asset ID</TableHead>
                  <TableHead className="font-semibold">Asset Name</TableHead>
                  <TableHead className="font-semibold">Serial Number</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Condition</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Contract</TableHead>
                  <TableHead className="font-semibold">Insurance Policy</TableHead>
                  <TableHead className="font-semibold">Merchant</TableHead>
                  <TableHead className="font-semibold">Purchase Date</TableHead>
                  <TableHead className="font-semibold">Current Value</TableHead>
                  <TableHead className="font-semibold">Location</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                      No assets found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{asset.id}</TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">{asset.name}</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{asset.serialNumber}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border">
                          {asset.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getConditionColor(asset.condition)}>{asset.condition}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{asset.contractId}</div>
                          <div className="text-xs text-muted-foreground">{asset.contractName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{asset.insurancePolicy}</div>
                          <div className="text-xs text-muted-foreground">{asset.insuranceProvider}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{asset.merchant}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{asset.purchaseDate}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{asset.currentValue}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{asset.location}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
        </div>

        {/* Results Count */}
        {filteredAssets.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            Showing {filteredAssets.length} of {allAssets.length} assets
          </div>
        )}
      </div>
    </div>
  );
};

export default Assets;
