import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";

const Dashboard = () => {
  // Mock Data
  const vintageData = [
    { month: "Jan", vintage2023: 2.1, vintage2024: 1.8 },
    { month: "Feb", vintage2023: 2.3, vintage2024: 1.9 },
    { month: "Mar", vintage2023: 2.8, vintage2024: 2.1 },
    { month: "Apr", vintage2023: 3.2, vintage2024: 2.3 },
    { month: "May", vintage2023: 3.5, vintage2024: 2.5 },
    { month: "Jun", vintage2023: 3.8, vintage2024: 2.7 },
  ];

  const delinquencyData = [
    { name: "0-30 days", value: 2.1, color: "#171717" },
    { name: "31-60 days", value: 1.2, color: "#525252" },
    { name: "60+ days", value: 0.8, color: "#a3a3a3" },
  ];

  const creditRiskData = [
    { risk: "Low", count: 124, color: "#171717" },
    { risk: "Medium", count: 48, color: "#525252" },
    { risk: "High", count: 12, color: "#a3a3a3" },
  ];

  const underwritingFunnel = [
    { stage: "Applications", count: 450 },
    { stage: "Pre-approved", count: 315 },
    { stage: "Approved", count: 252 },
    { stage: "Funded", count: 184 },
  ];

  const cashflowData = [
    { month: "Jan", scheduled: 98, actual: 102 },
    { month: "Feb", scheduled: 105, actual: 98 },
    { month: "Mar", scheduled: 112, actual: 115 },
    { month: "Apr", scheduled: 108, actual: 110 },
    { month: "May", scheduled: 120, actual: 118 },
    { month: "Jun", scheduled: 125, actual: 128 },
  ];

  const residualValueData = [
    { month: "M1", expected: 100, actual: 100 },
    { month: "M6", expected: 92, actual: 94 },
    { month: "M12", expected: 82, actual: 85 },
    { month: "M18", expected: 72, actual: 76 },
    { month: "M24", expected: 62, actual: 68 },
    { month: "M36", expected: 48, actual: 52 },
  ];

  const topMerchants = [
    { name: "TechCorp Solutions", volume: 285000, approval: 78, delinquency: 1.2, score: 94 },
    { name: "MedEquip Pro", volume: 218000, approval: 85, delinquency: 0.8, score: 96 },
    { name: "BuildMaster Inc", volume: 195000, approval: 72, delinquency: 2.1, score: 89 },
    { name: "IT Solutions Hub", volume: 168000, approval: 81, delinquency: 1.5, score: 92 },
    { name: "Manufacturing Plus", volume: 142000, approval: 69, delinquency: 2.8, score: 85 },
  ];

  const alerts = [
    { type: "warning", message: "BuildMaster Inc delinquency increased 45% (1.5% → 2.8%)" },
    { type: "alert", message: "Medical Equipment residual value dropped 8% below forecast" },
    { type: "info", message: "AI detected unusual repayment pattern in Segment B" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <h1 className="text-2xl font-semibold text-foreground">Portfolio Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time equipment financing intelligence</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* 1. TOP-LEVEL PORTFOLIO OVERVIEW */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Portfolio Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[
              { label: "Total Leases", value: "$1.25M", subvalue: "184 leases", change: "+12%" },
              { label: "Active Merchants", value: "26", subvalue: "9 categories", change: "+3" },
              { label: "Portfolio Yield", value: "14.2%", subvalue: "Net: 12.8%", change: "+0.8%" },
              { label: "ROI (12M)", value: "13.9%", subvalue: "Target: 14%", change: "-0.1%" },
              { label: "Default Rate", value: "1.8%", subvalue: "Delinq: 2.3%", change: "+0.2%" },
            ].map((item, idx) => (
              <Card key={idx} className="p-4 border-border hover:shadow-minimal transition-shadow">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.subvalue}</span>
                    <span className={item.change.startsWith('+') ? "text-foreground" : "text-muted-foreground"}>
                      {item.change}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ALERTS */}
        <section>
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <div key={idx} className="p-3 bg-muted/30 border border-border rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. CREDIT & RISK MANAGEMENT */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card className="p-5 border-border">
            <h3 className="text-sm font-medium text-foreground mb-4">Credit Risk Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={creditRiskData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="risk" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="count" fill="hsl(var(--foreground))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 border-border">
            <h3 className="text-sm font-medium text-foreground mb-4">Delinquency Buckets</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={delinquencyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {delinquencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: '12px' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 border-border md:col-span-2">
            <h3 className="text-sm font-medium text-foreground mb-4">Vintage Curves</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vintageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Line type="monotone" dataKey="vintage2023" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="vintage2024" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* 3. UNDERWRITING PERFORMANCE */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Underwriting Performance</h2>
          <div className="grid md:grid-cols-4 gap-3">
            {underwritingFunnel.map((stage, idx) => (
              <Card key={idx} className="p-4 border-border">
                <p className="text-xs text-muted-foreground mb-2">{stage.stage}</p>
                <p className="text-2xl font-semibold text-foreground">{stage.count}</p>
              </Card>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-3 mt-3">
            <Card className="p-4 border-border">
              <p className="text-xs text-muted-foreground mb-1">Approval Rate</p>
              <p className="text-xl font-semibold text-foreground">56%</p>
            </Card>
            <Card className="p-4 border-border">
              <p className="text-xs text-muted-foreground mb-1">Decision Time</p>
              <p className="text-xl font-semibold text-foreground">2.3 min</p>
            </Card>
            <Card className="p-4 border-border">
              <p className="text-xs text-muted-foreground mb-1">Auto Approvals</p>
              <p className="text-xl font-semibold text-foreground">78%</p>
            </Card>
          </div>
        </section>

        {/* 4. MERCHANT PERFORMANCE */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Top Merchants</h2>
          <Card className="border-border">
            <div className="divide-y divide-border">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 p-4 text-xs font-medium text-muted-foreground">
                <div>Merchant</div>
                <div className="text-right">Volume</div>
                <div className="text-right">Approval %</div>
                <div className="text-right">Delinquency</div>
                <div className="text-right">Score</div>
              </div>
              {topMerchants.map((merchant, idx) => (
                <div key={idx} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 p-4 text-sm hover:bg-accent transition-colors cursor-pointer">
                  <div className="font-medium text-foreground">{merchant.name}</div>
                  <div className="text-right text-foreground">${(merchant.volume / 1000).toFixed(0)}K</div>
                  <div className="text-right text-muted-foreground">{merchant.approval}%</div>
                  <div className="text-right text-muted-foreground">{merchant.delinquency}%</div>
                  <div className="text-right text-foreground font-medium">{merchant.score}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* 5. ASSET LIFECYCLE */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Asset Lifecycle Intelligence</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-5 border-border">
              <h3 className="text-sm font-medium text-foreground mb-4">Residual Value Curves</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={residualValueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Area type="monotone" dataKey="expected" stackId="1" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" />
                    <Area type="monotone" dataKey="actual" stackId="2" stroke="hsl(var(--foreground))" fill="hsl(var(--accent))" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5 border-border">
              <h3 className="text-sm font-medium text-foreground mb-4">Asset Distribution</h3>
              <div className="space-y-3">
                {[
                  { label: "Leased Units", value: 184, total: 250 },
                  { label: "Idle Units", value: 28, total: 250 },
                  { label: "Refurbishing", value: 18, total: 250 },
                  { label: "Resold", value: 20, total: 250 },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className="text-xs font-medium text-foreground">{item.value}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-foreground h-1.5 rounded-full" 
                        style={{ width: `${(item.value / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* 6. CASH FLOW */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Cash Flow & Financial Predictability</h2>
          <Card className="p-5 border-border">
            <h3 className="text-sm font-medium text-foreground mb-4">Projected vs Actual Income</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="scheduled" fill="hsl(var(--muted))" />
                  <Bar dataKey="actual" fill="hsl(var(--foreground))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* 7. DOCUMENTATION */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Documentation & Integrations</h2>
          <div className="grid md:grid-cols-4 gap-3">
            {[
              { label: "Active Agreements", value: "184" },
              { label: "Lease Contracts", value: "184" },
              { label: "Merchant KYCs", value: "26" },
              { label: "Data Quality", value: "98.2%" },
            ].map((item, idx) => (
              <Card key={idx} className="p-4 border-border">
                <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
                <p className="text-2xl font-semibold text-foreground">{item.value}</p>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
