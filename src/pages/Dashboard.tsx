import { Card } from "@/components/ui/card";
import { 
  TrendingUp, TrendingDown, Building2, DollarSign, FileText, 
  AlertTriangle, CheckCircle2, Clock, Target, Users, Package,
  Activity, BarChart3, PieChart, RefreshCw, FileCheck, Shield,
  Wallet, Calendar, Zap, AlertCircle
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
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
    { name: "0-30 days", value: 2.1, color: "hsl(var(--gradient-start))" },
    { name: "31-60 days", value: 1.2, color: "hsl(var(--gradient-purple))" },
    { name: "60+ days", value: 0.8, color: "hsl(var(--destructive))" },
  ];

  const creditRiskData = [
    { risk: "Low", count: 124, color: "hsl(var(--gradient-start))" },
    { risk: "Medium", count: 48, color: "hsl(var(--gradient-purple))" },
    { risk: "High", count: 12, color: "hsl(var(--destructive))" },
  ];

  const underwritingFunnel = [
    { stage: "Applications", count: 450, rate: 100 },
    { stage: "Pre-approved", count: 315, rate: 70 },
    { stage: "Approved", count: 252, rate: 56 },
    { stage: "Funded", count: 184, rate: 41 },
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
      <div className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">Portfolio Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Real-time equipment financing intelligence</p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        
        {/* 1. TOP-LEVEL PORTFOLIO OVERVIEW */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Portfolio Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Financed", value: "$1.25M", sub: "184 leases", icon: DollarSign, color: "text-gradient-start" },
              { label: "Active Merchants", value: "26", sub: "9 categories", icon: Building2, color: "text-gradient-blue" },
              { label: "Portfolio Yield", value: "14.2%", sub: "Net: 12.8%", icon: TrendingUp, color: "text-gradient-purple" },
              { label: "ROI (12M)", value: "14.1%", sub: "Target: 14%", icon: Activity, color: "text-gradient-end" },
              { label: "Default Rate", value: "1.8%", sub: "Delinq: 2.3%", icon: AlertTriangle, color: "text-destructive" },
            ].map((stat) => (
              <Card key={stat.label} className="p-4 hover:shadow-float transition-all duration-300 border-border bg-card group cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-muted/50 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground truncate">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 2. CREDIT & RISK MANAGEMENT (MOST IMPORTANT) */}
        <section className="border-2 border-primary/20 rounded-2xl p-6 bg-card/80 backdrop-blur">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Credit & Risk Management</h2>
            <span className="ml-auto px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">AI Powered</span>
          </div>

          {/* Alerts */}
          <div className="space-y-2 mb-6">
            {alerts.map((alert, i) => (
              <div 
                key={i}
                className={`p-4 rounded-lg border flex items-start gap-3 cursor-pointer hover:shadow-float transition-all ${
                  alert.type === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' :
                  alert.type === 'alert' ? 'border-destructive/30 bg-destructive/5' :
                  'border-primary/30 bg-primary/5'
                }`}
              >
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  alert.type === 'warning' ? 'text-yellow-500' :
                  alert.type === 'alert' ? 'text-destructive' :
                  'text-primary'
                }`} />
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Credit Risk Breakdown */}
            <Card className="p-4 border-border bg-card/50">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Credit Risk Distribution
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={creditRiskData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="risk" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Delinquency Breakdown */}
            <Card className="p-4 border-border bg-card/50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Delinquency Buckets</h3>
              <ResponsiveContainer width="100%" height={180}>
                <RePieChart>
                  <Pie
                    data={delinquencyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {delinquencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 mt-2">
                {delinquencyData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Vintage Curves */}
            <Card className="p-4 border-border bg-card/50">
              <h3 className="text-sm font-semibold text-foreground mb-4">Vintage Performance</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={vintageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line type="monotone" dataKey="vintage2023" stroke="hsl(var(--gradient-purple))" strokeWidth={2} />
                  <Line type="monotone" dataKey="vintage2024" stroke="hsl(var(--gradient-start))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Risk Metrics Row */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { label: "PD (Probability of Default)", value: "2.1%", icon: Target },
              { label: "LGD (Loss Given Default)", value: "38%", icon: TrendingDown },
              { label: "Expected Loss", value: "$28,400", icon: DollarSign },
            ].map((metric) => (
              <Card key={metric.label} className="p-4 border-border bg-card/50">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
                <p className="text-xl font-bold text-foreground">{metric.value}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. UNDERWRITING PERFORMANCE */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Underwriting Performance
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border-border">
              <h3 className="text-sm font-semibold text-foreground mb-4">Application Funnel</h3>
              <div className="space-y-4">
                {underwritingFunnel.map((stage, i) => (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">{stage.stage}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-foreground">{stage.count}</span>
                        <span className="text-xs text-muted-foreground">({stage.rate}%)</span>
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full gradient-sharpei transition-all duration-500"
                        style={{ width: `${stage.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Approval Rate", value: "70%", icon: CheckCircle2, trend: "+5.2%" },
                { label: "Avg Decision Time", value: "2.3h", icon: Clock, trend: "-18%" },
                { label: "Auto-Approval", value: "68%", icon: Zap, trend: "+12%" },
                { label: "AI Alignment", value: "94%", icon: Target, trend: "+3%" },
              ].map((stat) => (
                <Card key={stat.label} className="p-4 border-border hover:shadow-float transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-xs text-gradient-start font-medium">{stat.trend}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 4. MERCHANT PERFORMANCE */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Merchant Performance
          </h2>
          <Card className="border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-left border-b border-border">
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Rank</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Merchant</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase text-right">Volume</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase text-right">Approval</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase text-right">Delinquency</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase text-right">Health Score</th>
                  </tr>
                </thead>
                <tbody>
                  {topMerchants.map((merchant, i) => (
                    <tr key={merchant.name} className="border-b border-border hover:bg-muted/20 cursor-pointer transition-colors">
                      <td className="px-6 py-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          i === 0 ? 'bg-gradient-start/20 text-gradient-start' :
                          i === 1 ? 'bg-gradient-purple/20 text-gradient-purple' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {i + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-foreground">{merchant.name}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-semibold text-foreground">${(merchant.volume / 1000).toFixed(0)}K</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm text-foreground">{merchant.approval}%</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-medium ${
                          merchant.delinquency < 1.5 ? 'text-gradient-start' :
                          merchant.delinquency < 2.5 ? 'text-yellow-500' :
                          'text-destructive'
                        }`}>
                          {merchant.delinquency}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full gradient-sharpei"
                              style={{ width: `${merchant.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-foreground w-8">{merchant.score}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* 5. ASSET LIFECYCLE INTELLIGENCE */}
        <section className="border border-primary/20 rounded-2xl p-6 bg-card/50">
          <div className="flex items-center gap-2 mb-6">
            <RefreshCw className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Asset Lifecycle Intelligence</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: "Leased", value: "184", icon: FileText, color: "text-gradient-start" },
              { label: "Idle", value: "12", icon: Clock, color: "text-muted-foreground" },
              { label: "Returned", value: "28", icon: Package, color: "text-gradient-purple" },
              { label: "Refurbished", value: "18", icon: CheckCircle2, color: "text-gradient-blue" },
              { label: "Resold", value: "22", icon: TrendingUp, color: "text-gradient-end" },
            ].map((stat) => (
              <Card key={stat.label} className="p-4 border-border hover:shadow-float transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border-border">
              <h3 className="text-sm font-semibold text-foreground mb-4">Residual Value Tracking</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={residualValueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Area type="monotone" dataKey="expected" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="actual" stroke="hsl(var(--gradient-start))" fill="hsl(var(--gradient-start))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Avg Lease Duration", value: "18.2mo", sub: "Target: 18mo" },
                { label: "Refurbish Time", value: "8.5d", sub: "-2.3 days" },
                { label: "Resale vs Forecast", value: "+4.2%", sub: "$142K total" },
                { label: "Reuse Rate", value: "76%", sub: "CO₂: -142t" },
              ].map((metric) => (
                <Card key={metric.label} className="p-4 border-border">
                  <p className="text-xs text-muted-foreground mb-2">{metric.label}</p>
                  <p className="text-xl font-bold text-foreground mb-1">{metric.value}</p>
                  <p className="text-xs text-gradient-start">{metric.sub}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 6. CASH FLOW & FINANCIAL PREDICTABILITY */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Cash Flow & Financial Predictability
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 border-border">
              <h3 className="text-sm font-semibold text-foreground mb-4">Projected vs Actual Income</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Bar dataKey="scheduled" fill="hsl(var(--muted))" radius={[8, 8, 0, 0]} name="Scheduled" />
                  <Bar dataKey="actual" fill="hsl(var(--gradient-start))" radius={[8, 8, 0, 0]} name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div className="space-y-4">
              {[
                { label: "Incoming (This Month)", value: "$128K", sub: "vs $125K sched", icon: Calendar },
                { label: "12M Variance", value: "+2.4%", sub: "Ahead of schedule", icon: TrendingUp },
                { label: "Avg Lease IRR", value: "14.8%", sub: "Portfolio avg", icon: Activity },
                { label: "Forward Exposure", value: "$342K", sub: "Next 90 days", icon: Calendar },
              ].map((stat) => (
                <Card key={stat.label} className="p-4 border-border hover:shadow-float transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                  <p className="text-xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 7. DOCUMENTATION & INTEGRATIONS */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            Documentation & Integrations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Agreements", value: "184", icon: FileText },
              { label: "Lease Contracts", value: "184", icon: FileCheck },
              { label: "Merchant KYCs", value: "26/26", icon: CheckCircle2 },
              { label: "Missing Docs", value: "3", icon: AlertTriangle },
              { label: "API Sync Status", value: "Healthy", icon: Activity },
              { label: "Last Sync", value: "2m ago", icon: Clock },
              { label: "Data Quality", value: "98.2%", icon: Target },
              { label: "Uptime", value: "99.9%", icon: TrendingUp },
            ].map((stat) => (
              <Card key={stat.label} className="p-4 border-border hover:shadow-float transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
                <p className="text-lg font-semibold text-foreground">{stat.value}</p>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
