import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreditCard, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Payments = () => {
  const transactions = [
    { id: "PAY-5678", company: "TechCorp Industries", type: "Incoming", amount: "$12,500", status: "Completed", date: "2025-11-13" },
    { id: "PAY-5679", company: "MedEquip Solutions", type: "Incoming", amount: "$18,900", status: "Completed", date: "2025-11-12" },
    { id: "PAY-5680", company: "BuildPro Construction", type: "Incoming", amount: "$35,000", status: "Pending", date: "2025-11-11" },
    { id: "PAY-5681", company: "Equipment Vendor", type: "Outgoing", amount: "$8,500", status: "Completed", date: "2025-11-10" },
  ];

  const getStatusColor = (status: string) => {
    return status === "Completed" 
      ? "bg-green-100 text-green-700" 
      : "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">Payments</h1>
          </div>
          <p className="text-muted-foreground">Track lease payments and financial transactions</p>
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

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-10 bg-white border-border"
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
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <ArrowDownRight className="w-4 h-4 text-green-700" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-red-700" />
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
                  <Badge className={`${getStatusColor(transaction.status)} hover:${getStatusColor(transaction.status)} border-0 text-xs`}>
                    {transaction.status}
                  </Badge>
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
