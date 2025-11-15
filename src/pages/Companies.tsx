import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Search, Plus, List, LayoutGrid, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Companies = () => {
  const companies = [
    { 
      name: "TechCorp Industries", 
      industry: "Manufacturing", 
      location: "San Francisco, CA",
      representatives: 2,
      activeContracts: 3,
      revenue: "$45,000",
      status: "active" 
    },
    { 
      name: "DataFlow Systems", 
      industry: "Logistics", 
      location: "Austin, TX",
      representatives: 1,
      activeContracts: 2,
      revenue: "$28,500",
      status: "active" 
    },
    { 
      name: "SmartFactory Inc", 
      industry: "Manufacturing", 
      location: "Detroit, MI",
      representatives: 3,
      activeContracts: 4,
      revenue: "$62,000",
      status: "active" 
    },
    { 
      name: "AutoMotive Solutions", 
      industry: "Automotive", 
      location: "Chicago, IL",
      representatives: 1,
      activeContracts: 1,
      revenue: "$18,000",
      status: "active" 
    },
    { 
      name: "AgriTech Farms", 
      industry: "Agriculture", 
      location: "Des Moines, IA",
      representatives: 2,
      activeContracts: 2,
      revenue: "$35,000",
      status: "active" 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-semibold text-foreground">Companies</h1>
              </div>
              <p className="text-muted-foreground">Manage your clients and their representatives</p>
            </div>
            <Button className="gradient-sharpei text-white hover:opacity-90 shadow-float">
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Search & Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search companies..." 
              className="pl-10 bg-white border-border"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="default" size="icon" className="gradient-sharpei text-white hover:opacity-90">
              <List className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon">
              <LayoutGrid className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-float">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.5fr_2fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 px-6 py-4 border-b border-border bg-background/50">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Industry</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Representatives</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Contracts</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {companies.map((company) => (
              <div 
                key={company.name} 
                className="grid grid-cols-[2fr_1.5fr_2fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 px-6 py-5 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-purple/5 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-semibold gradient-sharpei-text text-base">{company.name}</p>
                </div>
                <div>
                  <p className="text-foreground">{company.industry}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-foreground">{company.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-foreground">{company.representatives}</p>
                </div>
                <div>
                  <p className="text-foreground">{company.activeContracts}</p>
                </div>
                <div>
                  <p className="font-semibold gradient-sharpei-text">{company.revenue}</p>
                </div>
                <div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 capitalize">
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
