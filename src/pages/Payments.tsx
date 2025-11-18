import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreditCard, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TableFilters from "@/components/TableFilters";

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: [] as string[],
    status: [] as string[],
  });
  const allTransactions = [
    { id: "PAY-5678", company: "TechCorp Industries", type: "Incoming", amount: "$12,500", status: "Completed", date: "2025-11-13" },
    { id: "PAY-5679", company: "MedEquip Solutions", type: "Incoming", amount: "$18,900", status: "Completed", date: "2025-11-12" },
    { id: "PAY-5680", company: "BuildPro Construction", type: "Incoming", amount: "$35,000", status: "Pending", date: "2025-11-11" },
    { id: "PAY-5681", company: "Equipment Vendor", type: "Outgoing", amount: "$8,500", status: "Completed", date: "2025-11-10" },
  ];

  const filterGroups = [
    {
      label: "Type",
      options: [
        { label: "Incoming", value: "Incoming", checked: filters.type.includes("Incoming") },
        { label: "Outgoing", value: "Outgoing", checked: filters.type.includes("Outgoing") },
      ]
    },
    {
      label: "Status",
      options: [
        { label: "Completed", value: "Completed", checked: filters.status.includes("Completed") },
        { label: "Pending", value: "Pending", checked: filters.status.includes("Pending") },
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
    setFilters({ type: [], status: [] });
  };

  const activeFilterCount = filters.type.length + filters.status.length;

  const transactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      const matchesSearch = transaction.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filters.type.length === 0 || filters.type.includes(transaction.type);
      const matchesStatus = filters.status.length === 0 || filters.status.includes(transaction.status);
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, filters]);

  const getStatusBadge = (status: string) => {
    if (status === "Completed") {
      return <Badge className="bg-success text-success-foreground hover:bg-success/90">Completed</Badge>;
    }
    if (status === "Pending") {
      return <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">Pending</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <h1 className="text-2xl font-semibold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">Track lease payments and financial transactions</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-border">
            <p className="text-sm text-muted-foreground mb-2">Total Received (This Month)</p>
            <p className="text-3xl font-bold gradient-sharpei-text">$156,400</p>
            <p className="text-sm text-gradient-start mt-2">+12.5% from last month</p>
          </Card>
          <Card className="p-6 border-border">
            <p className="text-sm text-muted-foreground mb-2">Pending Payments</p>
            <p className="text-3xl font-bold text-foreground">$35,000</p>
            <p className="text-sm text-muted-foreground mt-2">2 transactions</p>
          </Card>
          <Card className="p-6 border-border">
            <p className="text-sm text-muted-foreground mb-2">Total Disbursed</p>
            <p className="text-3xl font-bold text-foreground">$28,500</p>
            <p className="text-sm text-muted-foreground mt-2">To vendors & partners</p>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search transactions..." 
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

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-float">
          {/* Table Header */}
          <div className="grid grid-cols-[0.6fr_1fr_2fr_1fr_1fr_1fr] gap-6 px-6 py-4 border-b border-border bg-background/50">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="grid grid-cols-[0.6fr_1fr_2fr_1fr_1fr_1fr] gap-6 px-6 py-5 hover:bg-gradient-to-r hover:from-gradient-start/5 hover:to-gradient-purple/5 transition-colors cursor-pointer"
              >
                <div>
                  {transaction.type === "Incoming" ? (
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <ArrowDownRight className="w-4 h-4 text-success" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-destructive" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-mono font-semibold gradient-sharpei-text text-sm">{transaction.id}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{transaction.company}</p>
                </div>
                <div>
                  <p className="font-semibold gradient-sharpei-text text-sm">{transaction.amount}</p>
                </div>
                <div>
                  {getStatusBadge(transaction.status)}
                </div>
                <div>
                  <p className="text-foreground text-sm">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
