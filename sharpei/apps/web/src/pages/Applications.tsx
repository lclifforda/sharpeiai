import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TableFilters from "@/components/TableFilters";
import { ExportButton } from "@/components/ExportButton";
import { getEnabledApplicationTypes } from "@/services/platformConfigMockData";
import { useApplications, useUsers } from "@/hooks/queries";
import { useRBAC } from "@/contexts/RBACContext";

const applicationTypes = getEnabledApplicationTypes();

interface ApiApplication {
  id: string;
  org_id: string;
  customer_id: string;
  vendor_id: string;
  application_type: string;
  status: string;
  form_data: Record<string, any>;
  amount: string;
  assigned_to: string | null;
  ai_assessment: any;
  created_at: string;
  updated_at: string;
}

interface MappedApplication {
  id: string;
  company: string;
  contact: string;
  type: string;
  equipment: string;
  amount: string;
  vendor: string;
  status: string;
  date: string;
  assignedOfficerId: string;
  assignedOfficerName: string;
}

function formatCurrency(value: string | number | undefined): string {
  if (!value) return "$0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "$0";
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function mapApiApplication(app: ApiApplication): MappedApplication {
  const fd = app.form_data || {};
  return {
    id: app.id,
    company: fd.company_name || fd.companyName || fd.company || "—",
    contact: fd.contact_name || fd.contactName || fd.contact || "—",
    type: app.application_type || fd.type || "—",
    equipment: fd.equipment_description || fd.equipment || fd.equipmentDescription || "—",
    amount: formatCurrency(app.amount || fd.amount),
    vendor: fd.vendor_name || fd.vendorName || fd.vendor || "—",
    status: app.status || "submitted",
    date: app.created_at ? app.created_at.slice(0, 10) : "—",
    assignedOfficerId: app.assigned_to || "",
    assignedOfficerName: fd.assigned_officer_name || fd.assignedOfficerName || "",
  };
}

const Applications = () => {
  const navigate = useNavigate();
  const { currentUser } = useRBAC();
  const { data: rawApplications, isLoading, isError } = useApplications();
  const { data: teamUsers } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: [] as string[],
    type: [] as string[],
    assignee: [] as string[],
  });

  // Internal users who can be assigned applications (admins + managers)
  const assignableOfficers = useMemo(
    () => (teamUsers ?? []).filter((u: any) => u.role === "admin" || u.role === "manager"),
    [teamUsers]
  );

  const filterGroups = [
    {
      label: "Status",
      options: [
        { label: "Submitted", value: "submitted", checked: filters.status.includes("submitted") },
        { label: "Unqualified", value: "unqualified", checked: filters.status.includes("unqualified") },
        { label: "Incomplete (NIGO)", value: "incomplete", checked: filters.status.includes("incomplete") },
        { label: "Completed", value: "completed", checked: filters.status.includes("completed") },
        { label: "Declined", value: "declined", checked: filters.status.includes("declined") },
        { label: "Funded", value: "funded", checked: filters.status.includes("funded") },
      ],
    },
    {
      label: "Type",
      options: applicationTypes.map((t) => ({
        label: t.name,
        value: t.id,
        checked: filters.type.includes(t.id),
      })),
    },
    {
      label: "Assigned To",
      options: [
        { label: "Assigned to me", value: "__me__", checked: filters.assignee.includes("__me__") },
        { label: "Unassigned", value: "__unassigned__", checked: filters.assignee.includes("__unassigned__") },
        ...assignableOfficers.map((o) => ({
          label: o.name,
          value: o.id,
          checked: filters.assignee.includes(o.id),
        })),
      ],
    },
  ];

  const handleFilterChange = (groupLabel: string, value: string, checked: boolean) => {
    const key = groupLabel === "Status" ? "status" : groupLabel === "Type" ? "type" : "assignee";
    setFilters((prev) => ({
      ...prev,
      [key]: checked ? [...prev[key], value] : prev[key].filter((v) => v !== value),
    }));
  };

  const handleClearFilters = () => {
    setFilters({ status: [], type: [], assignee: [] });
  };

  const activeFilterCount = filters.status.length + filters.type.length + filters.assignee.length;

  const mappedApplications = useMemo(() => {
    if (!rawApplications) return [];
    return (rawApplications as ApiApplication[]).map(mapApiApplication);
  }, [rawApplications]);

  const applications = useMemo(() => {
    return mappedApplications.filter((app) => {
      const matchesSearch =
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status.length === 0 || filters.status.includes(app.status);
      const matchesType = filters.type.length === 0 || filters.type.includes(app.type);

      let matchesAssignee = true;
      if (filters.assignee.length > 0) {
        matchesAssignee = filters.assignee.some((f) => {
          if (f === "__me__") return app.assignedOfficerId === currentUser.id;
          if (f === "__unassigned__") return !app.assignedOfficerId;
          return app.assignedOfficerId === f;
        });
      }

      return matchesSearch && matchesStatus && matchesType && matchesAssignee;
    });
  }, [mappedApplications, searchQuery, filters, currentUser.id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-primary/10 text-primary border border-primary/20">Submitted</Badge>;
      case "unqualified":
        return <Badge className="bg-muted text-muted-foreground">Unqualified</Badge>;
      case "incomplete":
        return <Badge className="bg-amber-500/10 text-amber-700 border border-amber-200">Incomplete (NIGO)</Badge>;
      case "completed":
        return <Badge className="bg-blue-500/10 text-blue-700 border border-blue-200">Completed</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      case "funded":
        return <Badge className="bg-success text-success-foreground hover:bg-success/90">Funded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (typeId: string) => {
    const appType = applicationTypes.find((t) => t.id === typeId);
    const label = appType?.name ?? typeId;
    switch (typeId) {
      case "equipment-financing":
        return <Badge className="bg-blue-500/10 text-blue-700 border border-blue-200 hover:bg-blue-500/15 text-xs font-medium">{label}</Badge>;
      case "equipment-leasing":
        return <Badge className="bg-violet-500/10 text-violet-700 border border-violet-200 hover:bg-violet-500/15 text-xs font-medium">{label}</Badge>;
      case "working-capital":
        return <Badge className="bg-amber-500/10 text-amber-700 border border-amber-200 hover:bg-amber-500/15 text-xs font-medium">{label}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs font-medium">{label}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Applications</h1>
              <p className="text-sm text-muted-foreground mt-1">Track applications across equipment financing, leasing, and working capital</p>
            </div>
            <div className="flex gap-2">
              <ExportButton data={applications} filename="applications" sheetName="Applications" />
              <Button onClick={() => navigate("/applications/new")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
            </div>
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
              placeholder="Search applications..."
              className="pl-10 bg-card border-border"
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

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
            <span className="text-muted-foreground">Loading applications...</span>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-destructive">Failed to load applications. Please try again later.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-float">
            {/* Table Header */}
            <div className="grid grid-cols-[0.8fr_1.8fr_1.2fr_1.5fr_1fr_1fr_1fr_0.8fr_0.8fr] gap-4 px-6 py-4 border-b border-border bg-muted/50">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Equipment / Details</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vendor</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned To</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              {applications.length === 0 ? (
                <div className="px-6 py-12 text-center text-muted-foreground">
                  No applications found.
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="grid grid-cols-[0.8fr_1.8fr_1.2fr_1.5fr_1fr_1fr_1fr_0.8fr_0.8fr] gap-4 px-6 py-5 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-purple/5 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-mono font-semibold gradient-sharpei-text text-sm">{app.id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{app.company}</p>
                      <p className="text-xs text-muted-foreground">{app.contact}</p>
                    </div>
                    <div>
                      {getTypeBadge(app.type)}
                    </div>
                    <div>
                      <p className="text-foreground text-sm">
                        {app.type === "working-capital" ? app.amount : app.equipment}
                      </p>
                    </div>
                    <div>
                      <p className="text-foreground text-sm">{app.vendor}</p>
                    </div>
                    <div>
                      <p className="font-semibold gradient-sharpei-text text-sm">{app.amount}</p>
                    </div>
                    <div>
                      {app.assignedOfficerName ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">
                            {app.assignedOfficerName.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-sm text-foreground truncate">{app.assignedOfficerName.split(" ")[0]}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
                    </div>
                    <div>{getStatusBadge(app.status)}</div>
                    <div>
                      <p className="text-foreground text-sm">{app.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
