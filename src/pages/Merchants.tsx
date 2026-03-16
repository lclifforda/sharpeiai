import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Store, Search, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TableFilters from "@/components/TableFilters";
import { EnrollMerchantDialog } from "@/components/EnrollMerchantDialog";
import { ExportButton } from "@/components/ExportButton";

const Merchants = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: [] as string[],
    industry: [] as string[],
  });

  const allVendors = [{
    id: "V001",
    name: "TechMart Electronics",
    industry: "Technology",
    contactName: "Sarah Johnson",
    contactEmail: "sarah@techmart.com",
    website: "www.techmart.com",
    enrolledDate: "Jan 15, 2024",
    status: "active",
    applications: 12
  }, {
    id: "V002",
    name: "Green Valley Grocers",
    industry: "Agriculture",
    contactName: "Mike Chen",
    contactEmail: "mike@greenvalley.com",
    website: "www.greenvalley.com",
    enrolledDate: "Feb 3, 2024",
    status: "active",
    applications: 8
  }, {
    id: "V003",
    name: "Urban Fashion Hub",
    industry: "Retail",
    contactName: "Lisa Park",
    contactEmail: "lisa@urbanfashion.com",
    website: "www.urbanfashion.com",
    enrolledDate: "Feb 20, 2024",
    status: "active",
    applications: 23
  }, {
    id: "V004",
    name: "HomeFix Hardware",
    industry: "Construction",
    contactName: "James Wilson",
    contactEmail: "james@homefix.com",
    website: "www.homefix.com",
    enrolledDate: "Mar 8, 2024",
    status: "pending",
    applications: 0
  }, {
    id: "V005",
    name: "Digital Services Pro",
    industry: "Technology",
    contactName: "Anna Roberts",
    contactEmail: "anna@digitalpro.com",
    website: "www.digitalpro.com",
    enrolledDate: "Mar 15, 2024",
    status: "active",
    applications: 15
  }, {
    id: "V006",
    name: "QuickBite Restaurants",
    industry: "Hospitality",
    contactName: "Tom Davis",
    contactEmail: "tom@quickbite.com",
    website: "www.quickbite.com",
    enrolledDate: "Apr 2, 2024",
    status: "active",
    applications: 6
  }, {
    id: "V007",
    name: "Luxury Auto Dealers",
    industry: "Transportation",
    contactName: "Robert Martinez",
    contactEmail: "robert@luxuryauto.com",
    website: "www.luxuryauto.com",
    enrolledDate: "Apr 18, 2024",
    status: "inactive",
    applications: 3
  }, {
    id: "V008",
    name: "FitZone Wellness",
    industry: "Healthcare",
    contactName: "Emily Brown",
    contactEmail: "emily@fitzone.com",
    website: "www.fitzone.com",
    enrolledDate: "May 5, 2024",
    status: "active",
    applications: 9
  }];

  const industries = [...new Set(allVendors.map(v => v.industry))].sort();

  const filterGroups = [{
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
    label: "Industry",
    options: industries.map(ind => ({
      label: ind,
      value: ind,
      checked: filters.industry.includes(ind)
    }))
  }];

  const handleFilterChange = (groupLabel: string, value: string, checked: boolean) => {
    const key = groupLabel === "Industry" ? "industry" : "status";
    setFilters(prev => ({
      ...prev,
      [key]: checked ? [...prev[key], value] : prev[key].filter(v => v !== value)
    }));
  };

  const handleClearFilters = () => {
    setFilters({ status: [], industry: [] });
  };

  const activeFilterCount = filters.status.length + filters.industry.length;

  const vendors = useMemo(() => {
    return allVendors.filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || vendor.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) || vendor.website.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status.length === 0 || filters.status.includes(vendor.status);
      const matchesIndustry = filters.industry.length === 0 || filters.industry.includes(vendor.industry);
      return matchesSearch && matchesStatus && matchesIndustry;
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

  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Vendors</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage vendors and brokers referring customers through Sharpei</p>
            </div>
            <div className="flex gap-2">
              <ExportButton
                data={vendors}
                filename="vendors"
                sheetName="Vendors"
              />
              <EnrollMerchantDialog />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Vendors</span>
              <Store className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold text-foreground">{allVendors.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{allVendors.length} enrolled</p>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active</span>
              <Store className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {allVendors.filter(v => v.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Applications</span>
              <Store className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {allVendors.reduce((sum, v) => sum + v.applications, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Via vendor referrals</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search vendors..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-card border-border" />
          </div>
          <TableFilters filters={filterGroups} onFilterChange={handleFilterChange} onClearAll={handleClearFilters} activeCount={activeFilterCount} />
        </div>

        {/* Vendors Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-float">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_0.8fr_0.8fr] gap-6 px-6 py-4 border-b border-border bg-muted/50">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vendor Name</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Industry</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Website</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Enrolled</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Applications</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {vendors.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No vendors found
              </div>
            ) : (
              vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_0.8fr_0.8fr] gap-6 px-6 py-5 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-purple/5 transition-colors cursor-pointer"
                  onClick={() => navigate(`/merchants/${vendor.id}`)}
                >
                  <div>
                    <p className="font-semibold gradient-sharpei-text text-base">{vendor.name}</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs font-normal">{vendor.industry}</Badge>
                  </div>
                  <div>
                    <p className="text-foreground text-sm">{vendor.contactName}</p>
                    <p className="text-muted-foreground text-xs">{vendor.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{vendor.website}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">{vendor.enrolledDate}</p>
                  </div>
                  <div>
                    <p className="font-semibold gradient-sharpei-text text-sm">{vendor.applications}</p>
                  </div>
                  <div>
                    {getStatusBadge(vendor.status)}
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
