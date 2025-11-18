import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TableFilters from "@/components/TableFilters";

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: [] as string[],
    availability: [] as string[],
  });
  const allEquipment = [
    { name: "CNC Milling Machine", category: "Manufacturing", quantity: 5, available: 3, value: "$125K/unit", location: "Warehouse A" },
    { name: "MRI Scanner", category: "Medical", quantity: 2, available: 1, value: "$890K/unit", location: "Medical Depot" },
    { name: "Excavator CAT 320", category: "Construction", quantity: 8, available: 6, value: "$75K/unit", location: "Warehouse B" },
    { name: "Server Rack Dell", category: "IT Hardware", quantity: 15, available: 12, value: "$25K/unit", location: "Tech Center" },
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
      <div className="border-b border-border bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-semibold text-foreground">Inventory</h1>
              </div>
              <p className="text-muted-foreground">Track equipment availability and asset management</p>
            </div>
            <Button className="gradient-sharpei text-white hover:opacity-90 shadow-float">
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Search & Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search equipment..." 
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

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-float">
          {/* Table Header */}
          <div className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1.2fr_1.5fr] gap-6 px-6 py-4 border-b border-border bg-background/50">
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
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-xs">
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
