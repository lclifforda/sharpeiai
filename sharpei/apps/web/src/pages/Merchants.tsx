import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Store, Search, Calendar, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TableFilters from "@/components/TableFilters";
import { EnrollMerchantDialog } from "@/components/EnrollMerchantDialog";
import { ExportButton } from "@/components/ExportButton";
import { useVendors } from "@/hooks/queries";

interface ApiVendor {
  id: string;
  org_id: string;
  name: string;
  contact_email: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const Merchants = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: [] as string[],
  });

  const { data: rawVendors = [], isLoading } = useVendors();

  const allVendors = useMemo(
    () =>
      (rawVendors as ApiVendor[]).map((v) => ({
        id: v.id,
        name: v.name,
        contactEmail: v.contact_email,
        enrolledDate: formatDate(v.created_at),
        status: v.status,
      })),
    [rawVendors]
  );

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
  }];

  const handleFilterChange = (_groupLabel: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      status: checked ? [...prev.status, value] : prev.status.filter(v => v !== value)
    }));
  };

  const handleClearFilters = () => {
    setFilters({ status: [] });
  };

  const activeFilterCount = filters.status.length;

  const vendors = useMemo(() => {
    return allVendors.filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || vendor.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status.length === 0 || filters.status.includes(vendor.status);
      return matchesSearch && matchesStatus;
    });
  }, [allVendors, searchQuery, filters]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-6 px-6 py-4 border-b border-border bg-muted/50">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vendor Name</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact Email</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Enrolled</div>
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
                  className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-6 px-6 py-5 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-purple/5 transition-colors cursor-pointer"
                  onClick={() => navigate(`/merchants/${vendor.id}`)}
                >
                  <div>
                    <p className="font-semibold gradient-sharpei-text text-base">{vendor.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{vendor.contactEmail}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">{vendor.enrolledDate}</p>
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
