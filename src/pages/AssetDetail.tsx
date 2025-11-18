import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, FileText, Shield, DollarSign, MapPin, Calendar, Hash, Building2, AlertCircle } from "lucide-react";

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
      merchant: "Industrial Equipment Corp",
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
      merchant: "MedTech Solutions Inc",
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
      merchant: "Heavy Machinery Direct",
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
      merchant: "Dell Enterprise Solutions",
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

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Good":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Fair":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      default:
        return "bg-muted text-muted-foreground";
    }
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
            <Badge className={getConditionColor(asset.condition)}>
              {asset.condition}
            </Badge>
          </div>
        </div>
      </div>

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
              <div className="text-2xl font-bold text-green-600">{asset.available}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{asset.quantity - asset.available}</div>
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
                    Merchant
                  </div>
                  <span className="font-medium text-sm">{asset.merchant}</span>
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
