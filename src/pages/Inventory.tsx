import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Inventory = () => {
  const equipment = [
    { name: "CNC Milling Machine", category: "Manufacturing", quantity: 5, available: 3, value: "$125K/unit", location: "Warehouse A" },
    { name: "MRI Scanner", category: "Medical", quantity: 2, available: 1, value: "$890K/unit", location: "Medical Depot" },
    { name: "Excavator CAT 320", category: "Construction", quantity: 8, available: 6, value: "$75K/unit", location: "Warehouse B" },
    { name: "Server Rack Dell", category: "IT Hardware", quantity: 15, available: 12, value: "$25K/unit", location: "Tech Center" },
  ];

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
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search equipment..." 
            className="pl-10 bg-white border-border"
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
