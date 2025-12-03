import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TableFilters from "@/components/TableFilters";
import { ExportButton } from "@/components/ExportButton";

const Orders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: [] as string[],
  });
  const allOrders = [
    { id: "ORD-001", company: "TechCorp Industries", equipment: "IoT Sensor Kit", amount: "$22,500", status: "active", date: "2025-01-15" },
    { id: "ORD-002", company: "DataFlow Systems", equipment: "Edge Computing Device", amount: "$16,000", status: "active", date: "2025-02-01" },
    { id: "ORD-003", company: "SmartFactory Inc", equipment: "Industrial Camera", amount: "$28,000", status: "pending", date: "2025-11-08" },
    { id: "ORD-004", company: "AgriTech Farms", equipment: "GPS Tracking Module", amount: "$12,000", status: "completed", date: "2024-11-07" },
  ];

  const filterGroups = [
    {
      label: "Status",
      options: [
        { label: "Active", value: "active", checked: filters.status.includes("active") },
        { label: "Pending", value: "pending", checked: filters.status.includes("pending") },
        { label: "Completed", value: "completed", checked: filters.status.includes("completed") },
      ]
    }
  ];

  const handleFilterChange = (groupLabel: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      status: checked 
        ? [...prev.status, value]
        : prev.status.filter(v => v !== value)
    }));
  };

  const handleClearFilters = () => {
    setFilters({ status: [] });
  };

  const activeFilterCount = filters.status.length;

  const orders = useMemo(() => {
    return allOrders.filter(order => {
      const matchesSearch = order.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status.length === 0 || filters.status.includes(order.status);
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filters]);

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-success text-success-foreground hover:bg-success/90">Active</Badge>;
    }
    if (status === "pending") {
      return <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">Pending</Badge>;
    }
    if (status === "completed") {
      return <Badge variant="outline">Completed</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
              <p className="text-sm text-muted-foreground mt-1">Track equipment orders and lease applications</p>
            </div>
            <div className="flex gap-2">
              <ExportButton 
                data={orders} 
                filename="orders" 
                sheetName="Orders"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Order
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
              placeholder="Search orders..." 
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

        {/* Orders Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-float">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_2fr_2fr_1.2fr_1fr_1fr] gap-6 px-6 py-4 border-b border-border bg-muted/50">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Equipment</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <div 
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="grid grid-cols-[1fr_2fr_2fr_1.2fr_1fr_1fr] gap-6 px-6 py-5 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-purple/5 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-mono font-semibold gradient-sharpei-text text-sm">{order.id}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{order.company}</p>
                </div>
                <div>
                  <p className="text-foreground text-sm">{order.equipment}</p>
                </div>
                <div>
                  <p className="font-semibold gradient-sharpei-text text-sm">{order.amount}</p>
                </div>
                <div>
                  {getStatusBadge(order.status)}
                </div>
                <div>
                  <p className="text-foreground text-sm">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
