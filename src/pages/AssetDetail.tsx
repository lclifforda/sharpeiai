import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, FileText, Shield, DollarSign, MapPin, Calendar, Hash, Building2, AlertCircle, Search, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/* TODO: Remove asset research section after demo */
const assetResearchData: Record<string, {
  originalPrice: number;
  currentEstimate: number;
  depreciationRate: number;
  conditionAdjustedResidual: number;
  projections: { months: number; value: number }[];
  depreciationCurve: { month: string; value: number }[];
  marketTrend: "up" | "down" | "stable";
  averageMarketPrice: number;
  priceRange: { low: number; high: number };
  listings: { source: string; title: string; price: number; date: string; condition: string }[];
}> = {
  "cnc-milling-machine": {
    originalPrice: 125000,
    currentEstimate: 98500,
    depreciationRate: 12.4,
    conditionAdjustedResidual: 78.8,
    projections: [
      { months: 12, value: 88650 },
      { months: 24, value: 79750 },
      { months: 36, value: 72200 },
    ],
    depreciationCurve: [
      { month: "Purchase", value: 125000 },
      { month: "6 mo", value: 115000 },
      { month: "12 mo", value: 106000 },
      { month: "18 mo", value: 98500 },
      { month: "24 mo", value: 91000 },
      { month: "30 mo", value: 85000 },
      { month: "36 mo", value: 79000 },
      { month: "42 mo", value: 74500 },
      { month: "48 mo", value: 72200 },
    ],
    marketTrend: "stable",
    averageMarketPrice: 101200,
    priceRange: { low: 82000, high: 118000 },
    listings: [
      { source: "MachineryTrader", title: "Haas VF-2SS CNC Mill — 5-Axis", price: 112000, date: "2025-12-10", condition: "Excellent" },
      { source: "eBay Industrial", title: "CNC Milling Machine 5-Axis VMC", price: 95000, date: "2025-11-28", condition: "Good" },
      { source: "Surplus Record", title: "5-Axis CNC Mill w/ Tooling Package", price: 104500, date: "2025-12-02", condition: "Excellent" },
      { source: "BidSpotter", title: "Auction: CNC Vertical Milling Center", price: 82000, date: "2025-11-15", condition: "Fair" },
    ],
  },
  "mri-scanner": {
    originalPrice: 890000,
    currentEstimate: 685000,
    depreciationRate: 9.2,
    conditionAdjustedResidual: 77.0,
    projections: [
      { months: 12, value: 622000 },
      { months: 24, value: 565000 },
      { months: 36, value: 515000 },
    ],
    depreciationCurve: [
      { month: "Purchase", value: 890000 },
      { month: "6 mo", value: 835000 },
      { month: "12 mo", value: 780000 },
      { month: "18 mo", value: 730000 },
      { month: "24 mo", value: 685000 },
      { month: "30 mo", value: 645000 },
      { month: "36 mo", value: 610000 },
      { month: "42 mo", value: 580000 },
      { month: "48 mo", value: 555000 },
    ],
    marketTrend: "down",
    averageMarketPrice: 710000,
    priceRange: { low: 520000, high: 850000 },
    listings: [
      { source: "DOTmed", title: "Siemens 1.5T MRI System — Refurbished", price: 750000, date: "2025-12-05", condition: "Excellent" },
      { source: "BlockImaging", title: "GE Signa 1.5T MRI Scanner", price: 680000, date: "2025-11-20", condition: "Good" },
      { source: "MedAssets Auction", title: "Philips Achieva 1.5T MRI", price: 620000, date: "2025-11-30", condition: "Good" },
      { source: "UsedMedEquip", title: "1.5T MRI — Needs Coil Replacement", price: 520000, date: "2025-12-08", condition: "Fair" },
    ],
  },
  "excavator-cat-320": {
    originalPrice: 75000,
    currentEstimate: 61500,
    depreciationRate: 15.8,
    conditionAdjustedResidual: 82.0,
    projections: [
      { months: 12, value: 53200 },
      { months: 24, value: 46100 },
      { months: 36, value: 40800 },
    ],
    depreciationCurve: [
      { month: "Purchase", value: 75000 },
      { month: "6 mo", value: 69500 },
      { month: "12 mo", value: 65000 },
      { month: "18 mo", value: 61500 },
      { month: "24 mo", value: 57000 },
      { month: "30 mo", value: 52000 },
      { month: "36 mo", value: 48000 },
      { month: "42 mo", value: 44500 },
      { month: "48 mo", value: 40800 },
    ],
    marketTrend: "up",
    averageMarketPrice: 68000,
    priceRange: { low: 48000, high: 82000 },
    listings: [
      { source: "MachineryTrader", title: "2024 CAT 320 GC Excavator", price: 79500, date: "2025-12-12", condition: "Excellent" },
      { source: "IronPlanet", title: "Caterpillar 320 — Low Hours", price: 72000, date: "2025-12-01", condition: "Good" },
      { source: "Ritchie Bros", title: "CAT 320 Hydraulic Excavator", price: 64000, date: "2025-11-22", condition: "Fair" },
      { source: "EquipmentWatch", title: "2023 CAT 320 w/ Thumb", price: 58000, date: "2025-11-18", condition: "Fair" },
    ],
  },
  "server-rack-dell": {
    originalPrice: 25000,
    currentEstimate: 18200,
    depreciationRate: 22.5,
    conditionAdjustedResidual: 72.8,
    projections: [
      { months: 12, value: 14100 },
      { months: 24, value: 10900 },
      { months: 36, value: 8500 },
    ],
    depreciationCurve: [
      { month: "Purchase", value: 25000 },
      { month: "6 mo", value: 22000 },
      { month: "12 mo", value: 19500 },
      { month: "18 mo", value: 18200 },
      { month: "24 mo", value: 16000 },
      { month: "30 mo", value: 13500 },
      { month: "36 mo", value: 11500 },
      { month: "42 mo", value: 9800 },
      { month: "48 mo", value: 8500 },
    ],
    marketTrend: "down",
    averageMarketPrice: 17500,
    priceRange: { low: 10000, high: 22000 },
    listings: [
      { source: "ServerMonkey", title: "Dell PowerEdge R750 42U Rack", price: 21500, date: "2025-12-06", condition: "Excellent" },
      { source: "eBay Enterprise", title: "Dell 42U Server Rack — Complete", price: 17800, date: "2025-11-25", condition: "Good" },
      { source: "IT Asset Exchange", title: "Dell PowerEdge Rack + UPS", price: 15200, date: "2025-12-09", condition: "Good" },
      { source: "GovPlanet", title: "Surplus Dell Server Rack 42U", price: 10500, date: "2025-11-14", condition: "Fair" },
    ],
  },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-600" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-yellow-500" />;
};
/* END TODO: Remove asset research section after demo */

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showResearch, setShowResearch] = useState(false);

  // Mock data - in a real app, this would come from an API/database
  const assets = [
    {
      id: "cnc-milling-machine",
      name: "CNC Milling Machine",
      category: "Manufacturing",
      quantity: 5,
      available: 3,
      value: "$125K/unit",
      location: "Warehouse A",
      serialNumber: "CNC-2024-001",
      vendor: "Industrial Equipment Corp",
      condition: "Excellent",
      purchaseDate: "2024-01-15",
      warrantyExpiry: "2027-01-15",
      insurancePolicy: "INS-MFG-2024-001",
      insuranceProvider: "Global Asset Insurance",
      contract: "CONTRACT-IND-2024-045",
      lastMaintenance: "2024-10-15",
      nextMaintenance: "2025-01-15",
      description: "High-precision CNC milling machine with 5-axis capability, suitable for complex manufacturing operations.",
    },
    {
      id: "mri-scanner",
      name: "MRI Scanner",
      category: "Medical",
      quantity: 2,
      available: 1,
      value: "$890K/unit",
      location: "Medical Depot",
      serialNumber: "MRI-2023-002",
      vendor: "MedTech Solutions Inc",
      condition: "Good",
      purchaseDate: "2023-06-20",
      warrantyExpiry: "2026-06-20",
      insurancePolicy: "INS-MED-2023-089",
      insuranceProvider: "HealthCare Asset Protection",
      contract: "CONTRACT-MED-2023-112",
      lastMaintenance: "2024-09-01",
      nextMaintenance: "2024-12-01",
      description: "1.5 Tesla MRI scanner with advanced imaging capabilities for diagnostic purposes.",
    },
    {
      id: "excavator-cat-320",
      name: "Excavator CAT 320",
      category: "Construction",
      quantity: 8,
      available: 6,
      value: "$75K/unit",
      location: "Warehouse B",
      serialNumber: "EXC-CAT-2024-008",
      vendor: "Heavy Machinery Direct",
      condition: "Fair",
      purchaseDate: "2024-03-10",
      warrantyExpiry: "2026-03-10",
      insurancePolicy: "INS-CON-2024-234",
      insuranceProvider: "Construction Equipment Insurance",
      contract: "CONTRACT-CON-2024-078",
      lastMaintenance: "2024-10-20",
      nextMaintenance: "2025-02-20",
      description: "CAT 320 excavator with 20-ton operating weight, ideal for medium to large construction projects.",
    },
    {
      id: "server-rack-dell",
      name: "Server Rack Dell",
      category: "IT Hardware",
      quantity: 15,
      available: 12,
      value: "$25K/unit",
      location: "Tech Center",
      serialNumber: "SRV-DELL-2024-015",
      vendor: "Dell Enterprise Solutions",
      condition: "Excellent",
      purchaseDate: "2024-07-01",
      warrantyExpiry: "2027-07-01",
      insurancePolicy: "INS-IT-2024-456",
      insuranceProvider: "Tech Asset Insurance Group",
      contract: "CONTRACT-IT-2024-223",
      lastMaintenance: "2024-11-01",
      nextMaintenance: "2025-02-01",
      description: "Dell PowerEdge server rack with 42U capacity, redundant power supplies, and advanced cooling system.",
    },
  ];

  const asset = assets.find(a => a.id === id);

  if (!asset) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Asset Not Found</h2>
            <p className="text-muted-foreground mb-4">The asset you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/assets")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getConditionBadge = (condition: string) => {
    if (condition === "Excellent") {
      return <Badge className="bg-success text-success-foreground hover:bg-success/90">Excellent</Badge>;
    }
    if (condition === "Good") {
      return <Badge className="bg-success text-success-foreground hover:bg-success/90">Good</Badge>;
    }
    if (condition === "Fair") {
      return <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">Fair</Badge>;
    }
    return <Badge variant="outline">{condition}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-6 py-5">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/assets")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assets
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{asset.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">Complete asset information and tracking</p>
            </div>
            <div className="flex items-center gap-3">
              {/* TODO: Remove asset research button after demo */}
              <Button
                variant={showResearch ? "default" : "outline"}
                size="sm"
                onClick={() => setShowResearch(!showResearch)}
              >
                <Search className="w-4 h-4 mr-2" />
                Research Asset
              </Button>
              {getConditionBadge(asset.condition)}
            </div>
          </div>
        </div>
      </div>

      {/* TODO: Remove asset research section after demo */}
      {showResearch && (() => {
        const research = assetResearchData[id ?? ""];
        if (!research) return (
          <div className="px-6 pt-6">
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No research data available for this asset.
              </CardContent>
            </Card>
          </div>
        );
        return (
          <div className="px-6 pt-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Search className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Asset Research</h2>
              <Badge variant="outline" className="ml-2 text-xs">Demo</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Residual Value Analysis Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <DollarSign className="w-5 h-5" />
                    Residual Value Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={research.depreciationCurve}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                        <Tooltip formatter={(value: number) => [formatCurrency(value), "Value"]} />
                        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Original Price</p>
                      <p className="font-semibold text-base">{formatCurrency(research.originalPrice)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Estimate</p>
                      <p className="font-semibold text-base text-primary">{formatCurrency(research.currentEstimate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Depreciation Rate</p>
                      <p className="font-semibold">{research.depreciationRate}% / year</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Condition-Adj. Residual</p>
                      <p className="font-semibold">{research.conditionAdjustedResidual}%</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Projected Value</p>
                    <div className="space-y-1.5">
                      {research.projections.map((p) => (
                        <div key={p.months} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{p.months} months</span>
                          <span className="font-medium">{formatCurrency(p.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Online Market Intelligence Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ExternalLink className="w-5 h-5" />
                    Online Market Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Avg. Market Price</p>
                      <p className="font-semibold text-base">{formatCurrency(research.averageMarketPrice)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price Range</p>
                      <p className="font-semibold text-base">{formatCurrency(research.priceRange.low)} – {formatCurrency(research.priceRange.high)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Market Trend</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <TrendIcon trend={research.marketTrend} />
                        <span className="font-semibold capitalize">{research.marketTrend}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-3">Recent Listings</p>
                    <div className="space-y-3">
                      {research.listings.map((listing, i) => (
                        <div key={i} className="border rounded-lg p-3 space-y-1.5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 mr-3">
                              <p className="font-medium text-sm truncate">{listing.title}</p>
                              <p className="text-xs text-muted-foreground">{listing.source} &middot; {new Date(listing.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-semibold text-sm">{formatCurrency(listing.price)}</p>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {listing.condition}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      })()}
      {/* END TODO: Remove asset research section after demo */}

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Quantity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{asset.quantity}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{asset.available}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{asset.quantity - asset.available}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unit Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{asset.value}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asset Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Asset Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="w-4 h-4" />
                    Serial Number
                  </div>
                  <span className="font-medium text-sm">{asset.serialNumber}</span>
                </div>
                <Separator />
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    Category
                  </div>
                  <Badge variant="outline">{asset.category}</Badge>
                </div>
                <Separator />
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    Location
                  </div>
                  <span className="font-medium text-sm">{asset.location}</span>
                </div>
                <Separator />
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    Vendor
                  </div>
                  <span className="font-medium text-sm">{asset.vendor}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates & Warranty */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Dates & Warranty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">Purchase Date</span>
                  <span className="font-medium text-sm">{new Date(asset.purchaseDate).toLocaleDateString()}</span>
                </div>
                <Separator />
                
                <div className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">Warranty Expiry</span>
                  <span className="font-medium text-sm">{new Date(asset.warrantyExpiry).toLocaleDateString()}</span>
                </div>
                <Separator />
                
                <div className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">Last Maintenance</span>
                  <span className="font-medium text-sm">{new Date(asset.lastMaintenance).toLocaleDateString()}</span>
                </div>
                <Separator />
                
                <div className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">Next Maintenance</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {new Date(asset.nextMaintenance).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Insurance Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">Policy Number</span>
                  <span className="font-medium text-sm">{asset.insurancePolicy}</span>
                </div>
                <Separator />
                
                <div className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">Provider</span>
                  <span className="font-medium text-sm">{asset.insuranceProvider}</span>
                </div>
                <Separator />
                
                <div className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">Coverage Status</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Contract Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">Contract Number</span>
                  <span className="font-medium text-sm">{asset.contract}</span>
                </div>
                <Separator />
                
                <div className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">Contract Type</span>
                  <span className="font-medium text-sm">Purchase Agreement</span>
                </div>
                <Separator />
                
                <div className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{asset.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssetDetail;
