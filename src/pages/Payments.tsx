import { Card } from "@/components/ui/card";
import { CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";

const Payments = () => {
  const transactions = [
    { id: "PAY-5678", company: "TechCorp Industries", type: "Incoming", amount: "$12,500", status: "Completed", date: "2025-11-13" },
    { id: "PAY-5679", company: "MedEquip Solutions", type: "Incoming", amount: "$18,900", status: "Completed", date: "2025-11-12" },
    { id: "PAY-5680", company: "BuildPro Construction", type: "Incoming", amount: "$35,000", status: "Pending", date: "2025-11-11" },
    { id: "PAY-5681", company: "Equipment Vendor", type: "Outgoing", amount: "$8,500", status: "Completed", date: "2025-11-10" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white/80 backdrop-blur-lg sticky top-0 z-10">
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

        {/* Transactions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Transactions</h2>
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="p-6 hover:shadow-float transition-all duration-300 border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    transaction.type === "Incoming" 
                      ? "bg-gradient-start/10" 
                      : "bg-gradient-coral/10"
                  }`}>
                    {transaction.type === "Incoming" ? (
                      <ArrowDownRight className="w-6 h-6 text-gradient-start" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6 text-gradient-coral" />
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-6 flex-1">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                      <p className="font-mono font-semibold text-foreground">{transaction.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{transaction.type === "Incoming" ? "From" : "To"}</p>
                      <p className="font-semibold text-foreground">{transaction.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Amount</p>
                      <p className="text-xl font-bold text-foreground">{transaction.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.status === "Completed" 
                          ? "bg-gradient-start/10 text-gradient-start" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payments;
