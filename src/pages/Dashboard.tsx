import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { getEnabledApplicationTypes } from "@/services/platformConfigMockData";

// Static data moved outside component to prevent re-creation on every render
const vintageData = [
  { month: "Jan", vintage2023: 2.1, vintage2024: 1.8 },
  { month: "Feb", vintage2023: 2.3, vintage2024: 1.9 },
  { month: "Mar", vintage2023: 2.8, vintage2024: 2.1 },
  { month: "Apr", vintage2023: 3.2, vintage2024: 2.3 },
  { month: "May", vintage2023: 3.5, vintage2024: 2.5 },
  { month: "Jun", vintage2023: 3.8, vintage2024: 2.7 },
];

const delinquencyData = [
  { name: "0-30 days", value: 2.1, color: "hsl(185, 85%, 50%)" },
  { name: "31-60 days", value: 1.2, color: "hsl(220, 90%, 55%)" },
  { name: "60+ days", value: 0.8, color: "hsl(260, 85%, 60%)" },
];

const creditRiskData = [
  { risk: "↓", count: 124, color: "hsl(185, 85%, 50%)" },
  { risk: "→", count: 48, color: "hsl(220, 90%, 55%)" },
  { risk: "↑", count: 12, color: "hsl(260, 85%, 60%)" },
];

const underwritingFunnel = [
  { stage: "Applications", count: 450, color: "hsl(185, 85%, 50%)" },
  { stage: "Pre-approved", count: 315, color: "hsl(220, 90%, 55%)" },
  { stage: "Approved", count: 252, color: "hsl(260, 85%, 60%)" },
  { stage: "Funded", count: 184, color: "hsl(280, 80%, 55%)" },
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

const topVendors = [
  { name: "TechCorp Solutions", volume: 285000, approval: 78, delinquency: 1.2, score: 94 },
  { name: "MedEquip Pro", volume: 218000, approval: 85, delinquency: 0.8, score: 96 },
  { name: "BuildMaster Inc", volume: 195000, approval: 72, delinquency: 2.1, score: 89 },
  { name: "IT Solutions Hub", volume: 168000, approval: 81, delinquency: 1.5, score: 92 },
  { name: "Manufacturing Plus", volume: 142000, approval: 69, delinquency: 2.8, score: 85 },
];

const alerts = [
  { id: "alert-1", type: "warning", message: "BuildMaster Inc delinquency increased 45% (1.5% → 2.8%)" },
  { id: "alert-2", type: "alert", message: "Medical Equipment residual value dropped 8% below forecast" },
  { id: "alert-3", type: "info", message: "AI detected unusual repayment pattern in Segment B" },
];

const portfolioOverview = [
  { label: "Total Portfolio", value: "$1.25M", subvalue: "184 funded", change: "+12%" },
  { label: "Active Vendors", value: "26", subvalue: "9 categories", change: "+3" },
  { label: "Portfolio Yield", value: "14.2%", subvalue: "Net: 12.8%", change: "+0.8%" },
  { label: "ROI (12M)", value: "13.9%", subvalue: "Target: 14%", change: "-0.1%" },
  { label: "Default Rate", value: "1.8%", subvalue: "Delinq: 2.3%", change: "+0.2%" },
];

const portfolioByType = [
  { name: "Equipment Financing", count: 142, volume: "$892K", volumeNum: 892, color: "hsl(185, 85%, 50%)" },
  { name: "Equipment Leasing", count: 28, volume: "$218K", volumeNum: 218, color: "hsl(220, 90%, 55%)" },
  { name: "Working Capital", count: 14, volume: "$140K", volumeNum: 140, color: "hsl(260, 85%, 60%)" },
];

const portfolioTimelineData = [
  { month: "Jul", equipmentFinancing: 720, equipmentLeasing: 165, workingCapital: 95 },
  { month: "Aug", equipmentFinancing: 758, equipmentLeasing: 178, workingCapital: 102 },
  { month: "Sep", equipmentFinancing: 798, equipmentLeasing: 188, workingCapital: 108 },
  { month: "Oct", equipmentFinancing: 825, equipmentLeasing: 198, workingCapital: 118 },
  { month: "Nov", equipmentFinancing: 855, equipmentLeasing: 208, workingCapital: 128 },
  { month: "Dec", equipmentFinancing: 892, equipmentLeasing: 218, workingCapital: 140 },
];

const assetDistribution = [
  { label: "Leased Units", value: 184, total: 250 },
  { label: "Idle Units", value: 28, total: 250 },
  { label: "Refurbishing", value: 18, total: 250 },
  { label: "Resold", value: 20, total: 250 },
];

const documentationStats = [
  { label: "Active Agreements", value: "184" },
  { label: "Funded Contracts", value: "184" },
  { label: "Vendor KYCs", value: "26" },
  { label: "Data Quality", value: "98.2%" },
];

const PROGRESS_BAR_STYLE = {
  background: 'linear-gradient(90deg, hsl(185, 85%, 50%) 0%, hsl(220, 90%, 55%) 50%, hsl(260, 85%, 60%) 100%)'
};

const TOOLTIP_STYLE = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' };

const applicationTypes = getEnabledApplicationTypes();
const TYPE_FILTER_ALL = "all";
const TYPE_FILTER_NONE = "";

const Dashboard = () => {
  const [typeFilter, setTypeFilter] = useState<string>(TYPE_FILTER_NONE);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const hasProductFilter = typeFilter !== TYPE_FILTER_NONE;
  const showEquipmentSections = hasProductFilter && (typeFilter === TYPE_FILTER_ALL || typeFilter === "equipment-financing" || typeFilter === "equipment-leasing");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <h1 className="text-2xl font-semibold text-foreground">Portfolio Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time lending intelligence across all products</p>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* 1. TOP-LEVEL PORTFOLIO OVERVIEW */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Portfolio Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {portfolioOverview.map((item) => (
              <Card key={item.label} className="p-4 border-border hover:shadow-minimal transition-shadow">
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

        {/* PORTFOLIO BY TYPE */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Portfolio by Type</h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="p-5 border-border lg:col-span-7">
              <h3 className="text-sm font-medium text-foreground mb-4">Volume by Product</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portfolioByType} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} tickFormatter={(v) => `$${v}K`} />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} width={140} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`$${v}K`, 'Volume']} />
                    <Bar dataKey="volumeNum" fill="url(#portfolioBarGradient)" radius={[0, 4, 4, 0]} />
                    <defs>
                      <linearGradient id="portfolioBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(185, 85%, 50%)" stopOpacity={0.9} />
                        <stop offset="50%" stopColor="hsl(220, 90%, 55%)" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="hsl(260, 85%, 60%)" stopOpacity={0.9} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-5 border-border lg:col-span-5">
              <h3 className="text-sm font-medium text-foreground mb-4">Volume Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolioTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} tickFormatter={(v) => `$${v}K`} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number, name: string) => [`$${v}K`, name]} />
                    <defs>
                      <linearGradient id="volumeTimelineTeal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(185, 85%, 50%)" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="hsl(185, 85%, 50%)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="volumeTimelineBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(220, 90%, 55%)" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="hsl(220, 90%, 55%)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="volumeTimelinePurple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(260, 85%, 60%)" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="hsl(260, 85%, 60%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="equipmentFinancing" name="Equipment Financing" stroke="hsl(185, 85%, 50%)" fill="url(#volumeTimelineTeal)" strokeWidth={2} />
                    <Area type="monotone" dataKey="equipmentLeasing" name="Equipment Leasing" stroke="hsl(220, 90%, 55%)" fill="url(#volumeTimelineBlue)" strokeWidth={2} />
                    <Area type="monotone" dataKey="workingCapital" name="Working Capital" stroke="hsl(260, 85%, 60%)" fill="url(#volumeTimelinePurple)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:col-span-12">
              {portfolioByType.map((item) => (
                <Card key={item.name} className="p-4 border-border hover:shadow-minimal transition-shadow">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                    <p className="text-xl font-semibold text-foreground">{item.volume}</p>
                    <p className="text-xs text-muted-foreground">{item.count} funded</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ALERTS */}
        <section>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 bg-muted/30 border border-border rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. CREDIT & RISK + CASH FLOW — deferred until expanded */}
        <Collapsible open={showAnalytics} onOpenChange={setShowAnalytics}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors text-left">
              <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">
                Risk & cash flow analytics
              </h2>
              {showAnalytics ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
        <section className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="p-5 border-border">
            <h3 className="text-sm font-medium text-foreground mb-4">Credit Risk Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={creditRiskData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="risk" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="count" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(185, 85%, 50%)" stopOpacity={0.9} />
                      <stop offset="50%" stopColor="hsl(220, 90%, 55%)" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="hsl(260, 85%, 60%)" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
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
                    {delinquencyData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ ...TOOLTIP_STYLE, fontSize: '12px' }} />
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
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="vintage2023" stroke="hsl(185, 85%, 50%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="vintage2024" stroke="hsl(260, 85%, 60%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <section className="mt-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Cash Flow & Financial Predictability</h3>
          <Card className="p-5 border-border">
            <h3 className="text-sm font-medium text-foreground mb-4">Projected vs Actual Income</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="scheduled" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" fill="url(#cashflowGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="cashflowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(185, 85%, 50%)" stopOpacity={0.9} />
                      <stop offset="50%" stopColor="hsl(220, 90%, 55%)" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="hsl(260, 85%, 60%)" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
          </CollapsibleContent>
        </Collapsible>

        {/* 3. UNDERWRITING PERFORMANCE */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Underwriting Performance</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-5 border-border lg:col-span-2">
              <h3 className="text-sm font-medium text-foreground mb-4">Application Funnel</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={underwritingFunnel} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                    <YAxis type="category" dataKey="stage" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} width={100} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="count" fill="url(#funnelBarGradient)" radius={[0, 4, 4, 0]} />
                    <defs>
                      <linearGradient id="funnelBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(185, 85%, 50%)" stopOpacity={0.9} />
                        <stop offset="50%" stopColor="hsl(220, 90%, 55%)" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="hsl(260, 85%, 60%)" stopOpacity={0.9} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-5 border-border">
              <h3 className="text-sm font-medium text-foreground mb-4">Funnel Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={underwritingFunnel}
                      cx="50%"
                      cy="50%"
                      dataKey="count"
                      nameKey="stage"
                      labelLine={false}
                      label={({ stage, count }) => `${stage}: ${count}`}
                      outerRadius={80}
                    >
                      {underwritingFunnel.map((entry) => (
                        <Cell key={entry.stage} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ ...TOOLTIP_STYLE, fontSize: '12px' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </Card>
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

        {/* PRODUCT-SPECIFIC METRICS — filter controls content below */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">Product-specific metrics</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTypeFilter(TYPE_FILTER_NONE)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === TYPE_FILTER_NONE
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                Clear
              </button>
              <button
                onClick={() => setTypeFilter(TYPE_FILTER_ALL)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === TYPE_FILTER_ALL
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                All
              </button>
              {applicationTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTypeFilter(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    typeFilter === t.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product-specific content — only rendered when filter selected */}
        {!hasProductFilter ? (
          <Card className="p-8 border-border border-dashed">
            <p className="text-center text-muted-foreground text-sm">
              Select a product above to view product-specific metrics (Top Vendors, Working Capital, Asset Lifecycle).
            </p>
          </Card>
        ) : (
        <>
        {/* 4. VENDOR PERFORMANCE (equipment-only) */}
        {showEquipmentSections && (
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Top Vendors</h2>
          <Card className="border-border">
            <div className="divide-y divide-border">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 p-4 text-xs font-medium text-muted-foreground">
                <div>Vendor</div>
                <div className="text-right">Volume</div>
                <div className="text-right">Approval %</div>
                <div className="text-right">Delinquency</div>
                <div className="text-right">Score</div>
              </div>
              {topVendors.map((vendor) => (
                <div key={vendor.name} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 p-4 text-sm hover:bg-accent transition-colors cursor-pointer">
                  <div className="font-medium text-foreground">{vendor.name}</div>
                  <div className="text-right text-foreground">${(vendor.volume / 1000).toFixed(0)}K</div>
                  <div className="text-right text-muted-foreground">{vendor.approval}%</div>
                  <div className="text-right text-muted-foreground">{vendor.delinquency}%</div>
                  <div className="text-right text-foreground font-medium">{vendor.score}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>
        )}

        {/* 4b. WORKING CAPITAL SUMMARY (when viewing all or working capital) */}
        {hasProductFilter && (typeFilter === TYPE_FILTER_ALL || typeFilter === "working-capital") && (
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Working Capital</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-4 border-border">
              <p className="text-xs text-muted-foreground mb-1">Funded Volume</p>
              <p className="text-xl font-semibold text-foreground">$140K</p>
            </Card>
            <Card className="p-4 border-border">
              <p className="text-xs text-muted-foreground mb-1">Active Deals</p>
              <p className="text-xl font-semibold text-foreground">14</p>
            </Card>
            <Card className="p-4 border-border">
              <p className="text-xs text-muted-foreground mb-1">Approval Rate</p>
              <p className="text-xl font-semibold text-foreground">52%</p>
            </Card>
            <Card className="p-4 border-border">
              <p className="text-xs text-muted-foreground mb-1">Avg. Ticket</p>
              <p className="text-xl font-semibold text-foreground">$10K</p>
            </Card>
          </div>
        </section>
        )}

        {/* 5. ASSET LIFECYCLE (equipment-only) */}
        {showEquipmentSections && (
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
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <defs>
                      <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(185, 85%, 50%)" stopOpacity={0.5}/>
                        <stop offset="50%" stopColor="hsl(220, 90%, 55%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(260, 85%, 60%)" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="expected" stroke="#94a3b8" fill="url(#colorExpected)" />
                    <Area type="monotone" dataKey="actual" stroke="hsl(185, 85%, 50%)" fill="url(#colorActual)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5 border-border">
              <h3 className="text-sm font-medium text-foreground mb-4">Asset Distribution</h3>
              <div className="space-y-3">
                {assetDistribution.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className="text-xs font-medium text-foreground">{item.value}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${(item.value / item.total) * 100}%`,
                          ...PROGRESS_BAR_STYLE
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
        )}
        </>
        )}

        {/* 7. DOCUMENTATION */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">Documentation & Integrations</h2>
          <div className="grid md:grid-cols-4 gap-3">
            {documentationStats.map((item) => (
              <Card key={item.label} className="p-4 border-border">
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
