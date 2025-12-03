import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Search, Plus, List, LayoutGrid, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TableFilters from "@/components/TableFilters";
import { ExportButton } from "@/components/ExportButton";

const Companies = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    industry: [] as string[],
    status: [] as string[],
  });
  const allCompanies = [
    { 
      id: "1",
      name: "TechCorp Industries", 
      industry: "Manufacturing", 
      location: "San Francisco, CA",
      representatives: 2,
      activeContracts: 3,
      revenue: "$45,000",
      status: "active" 
    },
    { 
      id: "2",
      name: "DataFlow Systems", 
      industry: "Logistics", 
      location: "Austin, TX",
      representatives: 1,
      activeContracts: 2,
      revenue: "$28,500",
      status: "active" 
    },
    { 
      id: "3",
      name: "SmartFactory Inc", 
      industry: "Manufacturing", 
      location: "Detroit, MI",
      representatives: 3,
      activeContracts: 4,
      revenue: "$62,000",
      status: "active" 
    },
    { 
      id: "4",
      name: "AutoMotive Solutions", 
      industry: "Automotive", 
      location: "Chicago, IL",
      representatives: 1,
      activeContracts: 1,
      revenue: "$18,000",
      status: "inactive" 
    },
    { 
      id: "5",
      name: "AgriTech Farms", 
      industry: "Agriculture", 
      location: "Des Moines, IA",
      representatives: 2,
      activeContracts: 2,
      revenue: "$35,000",
      status: "active" 
    },
  ];

  const filterGroups = [
    {
      label: "Industry",
      options: [
        { label: "Manufacturing", value: "Manufacturing", checked: filters.industry.includes("Manufacturing") },
        { label: "Logistics", value: "Logistics", checked: filters.industry.includes("Logistics") },
        { label: "Automotive", value: "Automotive", checked: filters.industry.includes("Automotive") },
        { label: "Agriculture", value: "Agriculture", checked: filters.industry.includes("Agriculture") },
      ]
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

  const companies = useMemo(() => {
    return allCompanies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           company.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = filters.industry.length === 0 || filters.industry.includes(company.industry);
      const matchesStatus = filters.status.length === 0 || filters.status.includes(company.status);
      
      return matchesSearch && matchesIndustry && matchesStatus;
    });
  }, [searchQuery, filters]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Companies</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your clients and their representatives</p>
            </div>
            <div className="flex gap-2">
              <ExportButton 
                data={companies} 
                filename="companies" 
                sheetName="Companies"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Company
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
              placeholder="Search companies..." 
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
          
          <div className="flex gap-2 ml-auto">
            <Button variant="default" size="icon" className="gradient-sharpei text-white hover:opacity-90">
              <List className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon">
              <LayoutGrid className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-float">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.2fr_1.8fr_1fr_1.2fr_1fr_0.8fr] gap-6 px-6 py-4 border-b border-border bg-muted/50">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</div>
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
                onClick={() => navigate(`/companies/${company.id}`)}
                className="grid grid-cols-[2fr_1.2fr_1.8fr_1fr_1.2fr_1fr_0.8fr] gap-6 px-6 py-5 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-purple/5 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-semibold gradient-sharpei-text text-base">{company.name}</p>
                </div>
                <div>
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
                <div>
                  <p className="text-foreground text-sm">{company.activeContracts}</p>
                </div>
                <div>
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
    </div>
  );
};

export default Companies;
