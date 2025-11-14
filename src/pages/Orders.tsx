import { Card } from "@/components/ui/card";
import { ShoppingCart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Orders = () => {
  const orders = [
    { id: "ORD-1234", company: "TechCorp Industries", equipment: "CNC Machine", amount: "$125,000", status: "Processing", date: "2025-11-10" },
    { id: "ORD-1235", company: "MedEquip Solutions", equipment: "MRI Scanner", amount: "$890,000", status: "Approved", date: "2025-11-09" },
    { id: "ORD-1236", company: "BuildPro Construction", equipment: "Excavator", amount: "$75,000", status: "Delivered", date: "2025-11-08" },
    { id: "ORD-1237", company: "AgriTech Farms", equipment: "Tractor Fleet", amount: "$450,000", status: "Pending", date: "2025-11-07" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-gradient-start/10 text-gradient-start";
      case "Processing": return "bg-gradient-coral/10 text-gradient-coral";
      case "Delivered": return "bg-gradient-pink/10 text-gradient-pink";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-semibold text-foreground">Orders</h1>
              </div>
              <p className="text-muted-foreground">Track equipment orders and lease applications</p>
            </div>
            <Button variant="outline" className="border-border">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6 hover:shadow-float transition-all duration-300 border-border">
              <div className="grid grid-cols-6 gap-6 items-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                  <p className="font-mono font-semibold text-foreground">{order.id}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Company & Equipment</p>
                  <p className="font-semibold text-foreground">{order.company}</p>
                  <p className="text-sm text-muted-foreground">{order.equipment}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="text-xl font-bold text-foreground">{order.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="text-foreground">{order.date}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
