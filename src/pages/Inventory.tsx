import { Card } from "@/components/ui/card";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
      <div className="border-b border-border bg-white/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">Inventory</h1>
          </div>
          <p className="text-muted-foreground">Track equipment availability and asset management</p>
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

        {/* Equipment List */}
        <div className="space-y-4">
          {equipment.map((item) => (
            <Card key={item.name} className="p-6 hover:shadow-float transition-all duration-300 border-border">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl gradient-sharpei flex items-center justify-center shadow-float">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div className="grid grid-cols-5 gap-6 flex-1">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Equipment</p>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total / Available</p>
                    <p className="text-2xl font-bold text-foreground">{item.quantity}</p>
                    <p className="text-sm text-gradient-start font-medium">{item.available} available</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Unit Value</p>
                    <p className="text-xl font-bold gradient-sharpei-text">{item.value}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="text-foreground">{item.location}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full space-y-2">
                      <p className="text-sm text-muted-foreground">Utilization</p>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full gradient-sharpei rounded-full"
                          style={{ width: `${((item.quantity - item.available) / item.quantity) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(((item.quantity - item.available) / item.quantity) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
