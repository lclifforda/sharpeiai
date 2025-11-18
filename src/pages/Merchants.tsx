import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Store, Search, TrendingUp, Shield, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TableFilters from "@/components/TableFilters";
import { EnrollMerchantDialog } from "@/components/EnrollMerchantDialog";
import { ExportButton } from "@/components/ExportButton";
const Merchants = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    businessType: [] as string[],
    status: [] as string[],
    riskLevel: [] as string[]
  });
  const allMerchants = [{
    id: "M001",
    name: "TechMart Electronics",
    legalName: "TechMart Electronics LLC",
    category: "Retail",
    website: "www.techmart.com",
    accountNumber: "ACC-2024-001",
    enrolledDate: "Jan 15, 2024",
    status: "active",
    monthlyVolume: "$125,000",
    riskLevel: "low"
  }, {
    id: "M002",
    name: "Green Valley Grocers",
    legalName: "Green Valley Grocers Inc",
    category: "Grocery",
    website: "www.greenvalley.com",
    accountNumber: "ACC-2024-002",
    enrolledDate: "Feb 3, 2024",
    status: "active",
    monthlyVolume: "$89,500",
    riskLevel: "low"
  }, {
    id: "M003",
    name: "Urban Fashion Hub",
    legalName: "Urban Fashion Hub Ltd",
    category: "Fashion",
    website: "www.urbanfashion.com",
    accountNumber: "ACC-2024-003",
    enrolledDate: "Feb 20, 2024",
    status: "active",
    monthlyVolume: "$210,000",
    riskLevel: "medium"
  }, {
    id: "M004",
    name: "HomeFix Hardware",
    legalName: "HomeFix Hardware Corp",
    category: "Hardware",
    website: "www.homefix.com",
    accountNumber: "ACC-2024-004",
    enrolledDate: "Mar 8, 2024",
    status: "pending",
    monthlyVolume: "$45,000",
    riskLevel: "low"
  }, {
    id: "M005",
    name: "Digital Services Pro",
    legalName: "Digital Services Pro Inc",
    category: "Services",
    website: "www.digitalpro.com",
    accountNumber: "ACC-2024-005",
    enrolledDate: "Mar 15, 2024",
    status: "active",
    monthlyVolume: "$178,000",
    riskLevel: "medium"
  }, {
    id: "M006",
    name: "QuickBite Restaurants",
    legalName: "QuickBite Restaurants LLC",
    category: "Food & Beverage",
    website: "www.quickbite.com",
    accountNumber: "ACC-2024-006",
    enrolledDate: "Apr 2, 2024",
    status: "active",
    monthlyVolume: "$95,000",
    riskLevel: "low"
  }, {
    id: "M007",
    name: "Luxury Auto Dealers",
    legalName: "Luxury Auto Dealers Corp",
    category: "Automotive",
    website: "www.luxuryauto.com",
    accountNumber: "ACC-2024-007",
    enrolledDate: "Apr 18, 2024",
    status: "inactive",
    monthlyVolume: "$0",
    riskLevel: "high"
  }, {
    id: "M008",
    name: "FitZone Wellness",
    legalName: "FitZone Wellness Inc",
    category: "Health & Fitness",
    website: "www.fitzone.com",
    accountNumber: "ACC-2024-008",
    enrolledDate: "May 5, 2024",
    status: "active",
    monthlyVolume: "$62,000",
    riskLevel: "low"
  }];
  const filterGroups = [{
    label: "Category",
    options: [{
      label: "Retail",
      value: "Retail",
      checked: filters.businessType.includes("Retail")
    }, {
      label: "Grocery",
      value: "Grocery",
      checked: filters.businessType.includes("Grocery")
    }, {
      label: "Fashion",
      value: "Fashion",
      checked: filters.businessType.includes("Fashion")
    }, {
      label: "Hardware",
      value: "Hardware",
      checked: filters.businessType.includes("Hardware")
    }, {
      label: "Services",
      value: "Services",
      checked: filters.businessType.includes("Services")
    }, {
      label: "Food & Beverage",
      value: "Food & Beverage",
      checked: filters.businessType.includes("Food & Beverage")
    }, {
      label: "Automotive",
      value: "Automotive",
      checked: filters.businessType.includes("Automotive")
    }, {
      label: "Health & Fitness",
      value: "Health & Fitness",
      checked: filters.businessType.includes("Health & Fitness")
    }]
  }, {
    label: "Status",
    options: [{
      label: "Active",
      value: "active",
      checked: filters.status.includes("active")
    }, {
      label: "Pending",
      value: "pending",
      checked: filters.status.includes("pending")
    }, {
      label: "Inactive",
      value: "inactive",
      checked: filters.status.includes("inactive")
    }]
  }, {
    label: "RiskLevel",
    options: [{
      label: "Low",
      value: "low",
      checked: filters.riskLevel.includes("low")
    }, {
      label: "Medium",
      value: "medium",
      checked: filters.riskLevel.includes("medium")
    }, {
      label: "High",
      value: "high",
      checked: filters.riskLevel.includes("high")
    }]
  }];
  const handleFilterChange = (groupLabel: string, value: string, checked: boolean) => {
    const key = groupLabel.toLowerCase().replace(/\s+/g, '') as keyof typeof filters;
    setFilters(prev => ({
      ...prev,
      [key]: checked ? [...prev[key], value] : prev[key].filter(v => v !== value)
    }));
  };
  const handleClearFilters = () => {
    setFilters({
      businessType: [],
      status: [],
      riskLevel: []
    });
  };
  const activeFilterCount = filters.businessType.length + filters.status.length + filters.riskLevel.length;
  const merchants = useMemo(() => {
    return allMerchants.filter(merchant => {
      const matchesSearch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) || merchant.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) || merchant.website.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBusinessType = filters.businessType.length === 0 || filters.businessType.includes(merchant.category);
      const matchesStatus = filters.status.length === 0 || filters.status.includes(merchant.status);
      const matchesRiskLevel = filters.riskLevel.length === 0 || filters.riskLevel.includes(merchant.riskLevel);
      return matchesSearch && matchesBusinessType && matchesStatus && matchesRiskLevel;
    });
  }, [searchQuery, filters]);
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };
  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-success text-success-foreground hover:bg-success/90">
          Active
        </Badge>;
    }
    if (status === "pending") {
      return <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">
          Pending
        </Badge>;
    }
    if (status === "inactive") {
      return <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
          Inactive
        </Badge>;
    }
    return <Badge variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>;
  };
  const getRiskBadge = (risk: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      low: "default",
      medium: "secondary",
      high: "destructive"
    };
    return <Badge variant={variants[risk] || "outline"}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)}
      </Badge>;
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Merchants</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage enrolled merchants and their banking accounts</p>
            </div>
            <div className="flex gap-2">
              <ExportButton 
                data={merchants} 
                filename="merchants" 
                sheetName="Merchants"
              />
              <EnrollMerchantDialog />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Merchants</span>
              <Store className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold text-foreground">{allMerchants.length}</div>
            <p className="text-xs text-muted-foreground mt-1">8 enrolled</p>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active</span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {allMerchants.filter(m => m.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Monthly Volume</span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold text-foreground">$804.5K</div>
            <p className="text-xs text-muted-foreground mt-1">Total transactions</p>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">High Risk</span>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {allMerchants.filter(m => m.riskLevel === "high").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Require attention</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search merchants..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-card border-border" />
          </div>
          <TableFilters filters={filterGroups} onFilterChange={handleFilterChange} onClearAll={handleClearFilters} activeCount={activeFilterCount} />
        </div>

        {/* Merchants Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-float">
          {/* Table Header */}
          <div className="grid grid-cols-[1.8fr_1.8fr_1fr_1.5fr_1.2fr_1fr_1fr_0.8fr_0.8fr] gap-6 px-6 py-4 border-b border-border bg-muted/50">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Merchant Name</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Legal Name</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Website</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Enrolled</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Volume</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {merchants.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No merchants found
              </div>
            ) : (
              merchants.map((merchant) => (
                <div 
                  key={merchant.id} 
                  className="grid grid-cols-[1.8fr_1.8fr_1fr_1.5fr_1.2fr_1fr_1fr_0.8fr_0.8fr] gap-6 px-6 py-5 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-purple/5 transition-colors cursor-pointer"
                  onClick={() => navigate(`/merchants/${merchant.id}`)}
                >
                  <div>
                    <p className="font-semibold gradient-sharpei-text text-base">{merchant.name}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-sm">{merchant.legalName}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-sm">{merchant.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{merchant.website}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-mono">{merchant.accountNumber}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">{merchant.enrolledDate}</p>
                  </div>
                  <div>
                    <p className="font-semibold gradient-sharpei-text text-sm">{merchant.monthlyVolume}</p>
                  </div>
                  <div>
                    {getStatusBadge(merchant.status)}
                  </div>
                  <div>
                    {getRiskBadge(merchant.riskLevel)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>;
};
export default Merchants;