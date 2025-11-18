import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Store, Search, Plus, TrendingUp, Shield, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TableFilters from "@/components/TableFilters";

const Merchants = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    businessType: [] as string[],
    status: [] as string[],
    riskLevel: [] as string[],
  });

  const allMerchants = [
    {
      name: "TechMart Electronics",
      businessType: "Retail",
      accountNumber: "ACC-2024-001",
      enrolledDate: "Jan 15, 2024",
      status: "active",
      monthlyVolume: "$125,000",
      riskLevel: "low",
      contactEmail: "contact@techmart.com"
    },
    {
      name: "Green Valley Grocers",
      businessType: "Grocery",
      accountNumber: "ACC-2024-002",
      enrolledDate: "Feb 3, 2024",
      status: "active",
      monthlyVolume: "$89,500",
      riskLevel: "low",
      contactEmail: "info@greenvalley.com"
    },
    {
      name: "Urban Fashion Hub",
      businessType: "Fashion",
      accountNumber: "ACC-2024-003",
      enrolledDate: "Feb 20, 2024",
      status: "active",
      monthlyVolume: "$210,000",
      riskLevel: "medium",
      contactEmail: "sales@urbanfashion.com"
    },
    {
      name: "HomeFix Hardware",
      businessType: "Hardware",
      accountNumber: "ACC-2024-004",
      enrolledDate: "Mar 8, 2024",
      status: "pending",
      monthlyVolume: "$45,000",
      riskLevel: "low",
      contactEmail: "admin@homefix.com"
    },
    {
      name: "Digital Services Pro",
      businessType: "Services",
      accountNumber: "ACC-2024-005",
      enrolledDate: "Mar 15, 2024",
      status: "active",
      monthlyVolume: "$178,000",
      riskLevel: "medium",
      contactEmail: "contact@digitalpro.com"
    },
    {
      name: "QuickBite Restaurants",
      businessType: "Food & Beverage",
      accountNumber: "ACC-2024-006",
      enrolledDate: "Apr 2, 2024",
      status: "active",
      monthlyVolume: "$95,000",
      riskLevel: "low",
      contactEmail: "info@quickbite.com"
    },
    {
      name: "Luxury Auto Dealers",
      businessType: "Automotive",
      accountNumber: "ACC-2024-007",
      enrolledDate: "Apr 18, 2024",
      status: "inactive",
      monthlyVolume: "$0",
      riskLevel: "high",
      contactEmail: "sales@luxuryauto.com"
    },
    {
      name: "FitZone Wellness",
      businessType: "Health & Fitness",
      accountNumber: "ACC-2024-008",
      enrolledDate: "May 5, 2024",
      status: "active",
      monthlyVolume: "$62,000",
      riskLevel: "low",
      contactEmail: "hello@fitzone.com"
    },
  ];

  const filterGroups = [
    {
      label: "BusinessType",
      options: [
        { label: "Retail", value: "Retail", checked: filters.businessType.includes("Retail") },
        { label: "Grocery", value: "Grocery", checked: filters.businessType.includes("Grocery") },
        { label: "Fashion", value: "Fashion", checked: filters.businessType.includes("Fashion") },
        { label: "Hardware", value: "Hardware", checked: filters.businessType.includes("Hardware") },
        { label: "Services", value: "Services", checked: filters.businessType.includes("Services") },
        { label: "Food & Beverage", value: "Food & Beverage", checked: filters.businessType.includes("Food & Beverage") },
        { label: "Automotive", value: "Automotive", checked: filters.businessType.includes("Automotive") },
        { label: "Health & Fitness", value: "Health & Fitness", checked: filters.businessType.includes("Health & Fitness") },
      ]
    },
    {
      label: "Status",
      options: [
        { label: "Active", value: "active", checked: filters.status.includes("active") },
        { label: "Pending", value: "pending", checked: filters.status.includes("pending") },
        { label: "Inactive", value: "inactive", checked: filters.status.includes("inactive") },
      ]
    },
    {
      label: "RiskLevel",
      options: [
        { label: "Low", value: "low", checked: filters.riskLevel.includes("low") },
        { label: "Medium", value: "medium", checked: filters.riskLevel.includes("medium") },
        { label: "High", value: "high", checked: filters.riskLevel.includes("high") },
      ]
    }
  ];

  const handleFilterChange = (groupLabel: string, value: string, checked: boolean) => {
    const key = groupLabel.toLowerCase().replace(/\s+/g, '') as keyof typeof filters;
    setFilters(prev => ({
      ...prev,
      [key]: checked 
        ? [...prev[key], value]
        : prev[key].filter(v => v !== value)
    }));
  };

  const handleClearFilters = () => {
    setFilters({ businessType: [], status: [], riskLevel: [] });
  };

  const activeFilterCount = filters.businessType.length + filters.status.length + filters.riskLevel.length;

  const merchants = useMemo(() => {
    return allMerchants.filter(merchant => {
      const matchesSearch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           merchant.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           merchant.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBusinessType = filters.businessType.length === 0 || filters.businessType.includes(merchant.businessType);
      const matchesStatus = filters.status.length === 0 || filters.status.includes(merchant.status);
      const matchesRiskLevel = filters.riskLevel.length === 0 || filters.riskLevel.includes(merchant.riskLevel);
      
      return matchesSearch && matchesBusinessType && matchesStatus && matchesRiskLevel;
    });
  }, [searchQuery, filters]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      pending: "secondary",
      inactive: "destructive"
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      low: "default",
      medium: "secondary",
      high: "destructive"
    };
    return (
      <Badge variant={variants[risk] || "outline"}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Merchants</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage enrolled merchants and their banking accounts</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Enroll Merchant
            </Button>
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
            <Input
              placeholder="Search merchants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <TableFilters
            filters={filterGroups}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearFilters}
            activeCount={activeFilterCount}
          />
        </div>

        {/* Table */}
        <div className="border rounded-lg bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Merchant Name</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Business Type</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Account Number</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Enrolled Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Monthly Volume</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {merchants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No merchants found
                    </td>
                  </tr>
                ) : (
                  merchants.map((merchant, index) => (
                    <tr 
                      key={index} 
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Store className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{merchant.name}</div>
                            <div className="text-sm text-muted-foreground">{merchant.contactEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-foreground">{merchant.businessType}</td>
                      <td className="p-4 text-sm text-muted-foreground font-mono">{merchant.accountNumber}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          {merchant.enrolledDate}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-foreground">{merchant.monthlyVolume}</td>
                      <td className="p-4">{getStatusBadge(merchant.status)}</td>
                      <td className="p-4">{getRiskBadge(merchant.riskLevel)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merchants;
