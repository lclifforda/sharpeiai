import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TableFilters from "@/components/TableFilters";

const Inventory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: [] as string[],
    availability: [] as string[],
  });
  const allEquipment = [
    { id: "cnc-milling-machine", name: "CNC Milling Machine", category: "Manufacturing", quantity: 5, available: 3, value: "$125K/unit", location: "Warehouse A" },
    { id: "mri-scanner", name: "MRI Scanner", category: "Medical", quantity: 2, available: 1, value: "$890K/unit", location: "Medical Depot" },
    { id: "excavator-cat-320", name: "Excavator CAT 320", category: "Construction", quantity: 8, available: 6, value: "$75K/unit", location: "Warehouse B" },
    { id: "server-rack-dell", name: "Server Rack Dell", category: "IT Hardware", quantity: 15, available: 12, value: "$25K/unit", location: "Tech Center" },
  ];

  const filterGroups = [
    {
      label: "Category",
      options: [
        { label: "Manufacturing", value: "Manufacturing", checked: filters.category.includes("Manufacturing") },
        { label: "Medical", value: "Medical", checked: filters.category.includes("Medical") },
        { label: "Construction", value: "Construction", checked: filters.category.includes("Construction") },
        { label: "IT Hardware", value: "IT Hardware", checked: filters.category.includes("IT Hardware") },
      ]
    },
    {
      label: "Availability",
      options: [
        { label: "In Stock", value: "in_stock", checked: filters.availability.includes("in_stock") },
        { label: "Low Stock", value: "low_stock", checked: filters.availability.includes("low_stock") },
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
    setFilters({ category: [], availability: [] });
  };

  const activeFilterCount = filters.category.length + filters.availability.length;

  const equipment = useMemo(() => {
    return allEquipment.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filters.category.length === 0 || filters.category.includes(item.category);
      
      let matchesAvailability = true;
      if (filters.availability.length > 0) {
        const isLowStock = item.available <= 2;
        matchesAvailability = filters.availability.some(filter => {
          if (filter === "in_stock") return item.available > 2;
          if (filter === "low_stock") return isLowStock;
          return true;
        });
      }
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [searchQuery, filters]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <h1 className="text-2xl font-semibold text-foreground">Assets</h1>
          <p className="text-sm text-muted-foreground mt-1">Track equipment availability and asset management</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Search & Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search equipment..." 
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

        {/* Inventory Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-float">
          {/* Table Header */}
          <div className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1.2fr_1.5fr] gap-6 px-6 py-4 border-b border-border bg-muted/50">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Equipment</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Available</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Unit Value</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {equipment.map((item) => (
              <div 
                key={item.name} 
                onClick={() => navigate(`/assets/${item.id}`)}
                className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1.2fr_1.5fr] gap-6 px-6 py-5 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-purple/5 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-semibold gradient-sharpei-text text-base">{item.name}</p>
                </div>
                <div>
                  <p className="text-foreground text-sm">{item.category}</p>
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">{item.quantity}</p>
                </div>
                <div>
                  <Badge className="bg-success text-success-foreground hover:bg-success/90 border-0 text-xs">
                    {item.available}
                  </Badge>
                </div>
                <div>
                  <p className="font-semibold gradient-sharpei-text text-sm">{item.value}</p>
                </div>
                <div>
                  <p className="text-foreground text-sm">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
