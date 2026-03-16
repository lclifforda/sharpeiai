import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Search, Plus, MapPin, Users, FileText, TrendingUp, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TableFilters from "@/components/TableFilters";
import { ExportButton } from "@/components/ExportButton";
import { ImportCompaniesDialog, type ImportedCompany } from "@/components/ImportCompaniesDialog";
import { getStoredCustomers } from "@/lib/customerStorage";
import techcorpLogo from "@/assets/techcorp-logo.webp";

const DEFAULT_CUSTOMERS = [
  {
    id: "1",
    name: "TechCorp Industries",
    industry: "Manufacturing",
    location: "San Francisco, CA",
    representatives: 2,
    activeContracts: 3,
    revenue: "$45,000",
    status: "active",
    logo: techcorpLogo as string | undefined,
  },
  {
    id: "2",
    name: "DataFlow Systems",
    industry: "Logistics",
    location: "Austin, TX",
    representatives: 1,
    activeContracts: 2,
    revenue: "$28,500",
    status: "active",
    logo: undefined,
  },
  {
    id: "3",
    name: "SmartFactory Inc",
    industry: "Manufacturing",
    location: "Detroit, MI",
    representatives: 3,
    activeContracts: 4,
    revenue: "$62,000",
    status: "active",
    logo: undefined,
  },
  {
    id: "4",
    name: "AutoMotive Solutions",
    industry: "Automotive",
    location: "Chicago, IL",
    representatives: 1,
    activeContracts: 1,
    revenue: "$18,000",
    status: "inactive",
    logo: undefined,
  },
  {
    id: "5",
    name: "AgriTech Farms",
    industry: "Agriculture",
    location: "Des Moines, IA",
    representatives: 2,
    activeContracts: 2,
    revenue: "$35,000",
    status: "active",
    logo: undefined,
  },
];

const Companies = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const storedCustomers = useMemo(() => getStoredCustomers(), []);
  const defaultCustomers = useMemo(
    () =>
      DEFAULT_CUSTOMERS.filter(
        (c) =>
          !storedCustomers.some(
            (s) => s.id === c.id || s.name.toLowerCase() === c.name.toLowerCase()
          )
      ),
    [storedCustomers]
  );
  const [allCompanies, setAllCompanies] = useState(() => [
    ...storedCustomers.map((s) => ({
      id: s.id,
      name: s.name,
      industry: s.industry,
      location: s.location,
      representatives: s.representatives,
      activeContracts: s.activeContracts,
      revenue: s.revenue,
      status: s.status,
      logo: s.logo as string | undefined,
    })),
    ...defaultCustomers,
  ]);
  const [filters, setFilters] = useState({
    industry: [] as string[],
    status: [] as string[],
  });

  const handleImport = (imported: ImportedCompany[]) => {
    const nextId = allCompanies.length + 1;
    const newCompanies = imported.map((c, i) => ({
      id: String(nextId + i),
      name: c.name,
      industry: c.industry,
      location: c.location,
      representatives: c.contactName ? 1 : 0,
      activeContracts: 0,
      revenue: "$0",
      status: c.status || "active",
      logo: undefined,
    }));
    setAllCompanies((prev) => [...prev, ...newCompanies]);
  };

  const uniqueIndustries = useMemo(
    () => [...new Set(allCompanies.map((c) => c.industry))].sort(),
    [allCompanies]
  );

  const filterGroups = [
    {
      label: "Industry",
      options: uniqueIndustries.map((ind) => ({
        label: ind,
        value: ind,
        checked: filters.industry.includes(ind),
      })),
    },
    {
      label: "Status",
      options: [
        { label: "Active", value: "active", checked: filters.status.includes("active") },
        { label: "Inactive", value: "inactive", checked: filters.status.includes("inactive") },
      ]
    }
  ];

  const handleFilterChange = (groupLabel: string, value: string, checked: boolean) => {
    const key = groupLabel.toLowerCase() as keyof typeof filters;
    setFilters(prev => ({
      ...prev,
      [key]: checked 
        ? [...prev[key], value]
        : prev[key].filter(v => v !== value)
    }));
  };

  const handleClearFilters = () => {
    setFilters({ industry: [], status: [] });
  };

  const activeFilterCount = filters.industry.length + filters.status.length;

  const totalCompanies = allCompanies.length;
  const activeCompanies = allCompanies.filter((c) => c.status === "active").length;
  const totalMonthlyRevenue = allCompanies.reduce((sum, company) => {
    const numeric = parseInt(company.revenue.replace(/[^0-9]/g, ""), 10) || 0;
    return sum + numeric;
  }, 0);
  const formattedMonthlyRevenue = `$${totalMonthlyRevenue.toLocaleString()}`;
  const companiesWithContracts = allCompanies.filter((c) => c.activeContracts > 0).length;

  const companies = useMemo(() => {
    return allCompanies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           company.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = filters.industry.length === 0 || filters.industry.includes(company.industry);
      const matchesStatus = filters.status.length === 0 || filters.status.includes(company.status);
      
      return matchesSearch && matchesIndustry && matchesStatus;
    });
  }, [searchQuery, filters, allCompanies]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Customers</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your customers and their representatives</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <ExportButton
                data={companies}
                filename="companies"
                sheetName="Companies"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate("/customers/new")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Customers</span>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold text-foreground">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground mt-1">In your portfolio</p>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active</span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold text-foreground">{activeCompanies}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active customers</p>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Monthly Revenue</span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold text-foreground">{formattedMonthlyRevenue}</div>
            <p className="text-xs text-muted-foreground mt-1">Total from active contracts</p>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">With Contracts</span>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold text-foreground">{companiesWithContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">Customers with active deals</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
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

        {/* Companies Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-float">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.2fr_1.8fr_1fr_1.2fr_1fr_0.8fr] gap-6 px-6 py-4 border-b border-border bg-muted/50">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Industry</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reps</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contracts</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {companies.map((company) => (
              <div 
                key={company.id} 
                onClick={() => navigate(`/customers/${company.id}`)}
                className="grid grid-cols-[2fr_1.2fr_1.8fr_1fr_1.2fr_1fr_0.8fr] gap-6 px-6 py-5 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-purple/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-card flex items-center justify-center border border-border overflow-hidden">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">
                        {company.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold gradient-sharpei-text text-base">{company.name}</p>
                </div>
                <div className="flex items-center">
                  <p className="text-foreground text-sm">{company.industry}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-foreground text-sm">{company.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-foreground text-sm">{company.representatives}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-foreground text-sm">{company.activeContracts}</p>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold gradient-sharpei-text text-sm">{company.revenue}</p>
                </div>
                <div>
                  <Badge className={
                    company.status === "active" 
                      ? "bg-success text-success-foreground hover:bg-success/90 border-0 capitalize text-xs"
                      : "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-0 capitalize text-xs"
                  }>
                    {company.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ImportCompaniesDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImport}
      />
    </div>
  );
};

export default Companies;
