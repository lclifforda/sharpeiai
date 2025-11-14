import { Card } from "@/components/ui/card";
import { LayoutDashboard, TrendingUp, Users, DollarSign, FileText } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { label: "Total Revenue", value: "$2.4M", change: "+12.5%", icon: DollarSign, color: "text-gradient-start" },
    { label: "Active Leases", value: "1,234", change: "+8.2%", icon: FileText, color: "text-gradient-pink" },
    { label: "Companies", value: "456", change: "+5.1%", icon: Users, color: "text-gradient-coral" },
    { label: "Growth Rate", value: "23.5%", change: "+2.3%", icon: TrendingUp, color: "text-gradient-end" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Overview of your equipment financing operations</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 hover:shadow-float transition-all duration-300 border-border">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-gradient-start font-medium">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl bg-muted/50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Placeholder for charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 rounded-full bg-gradient-start" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">New lease application received</p>
                    <p className="text-xs text-muted-foreground">{i} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Equipment Categories</h3>
            <div className="space-y-4">
              {["Construction Equipment", "Medical Devices", "IT Hardware", "Manufacturing"].map((category, i) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{category}</span>
                    <span className="text-muted-foreground">{85 - i * 15}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-sharpei rounded-full transition-all duration-500"
                      style={{ width: `${85 - i * 15}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
