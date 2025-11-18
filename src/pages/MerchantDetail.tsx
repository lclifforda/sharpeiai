import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, MoreVertical, Edit, Download, Mail, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import techcorpLogo from "@/assets/techcorp-logo.png";

const MerchantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data - in production, fetch from API
  const merchant = {
    id: id,
    name: "TechCorp Solutions",
    legalName: "TechCorp Solutions LLC",
    category: "Technology",
    website: "www.techcorp.com",
    logo: techcorpLogo,
    status: "active",
    
    // Section 1: Contact Data
    registeredAddress: "123 Tech Street, San Francisco, CA 94105",
    contactPerson: {
      name: "John Smith",
      role: "CFO",
      phone: "+1 (555) 123-4567",
      email: "john.smith@techcorp.com"
    },
    taxId: "12-3456789",
    
    // Section 2: Business Overview
    businessModel: "Premium e-mobility brand selling high-end e-bikes with optional leasing and trade-in.",
    geography: "U.S., EU",
    channels: ["E-commerce", "Retail stores", "Marketplaces"],
    
    // Section 3: Financial Data
    annualRevenue: 45000000,
    quarterlyGrowthRate: 12.5,
    avgTransactionSize: 2500,
    monthlyTransactionVolume: 1800,
    defaultRate: 2.3,
    netMargin: "15-18%",
    
    // Section 4: Sharpei Engagement
    onboardingDate: "2023-01-15",
    contractDate: "2023-01-20",
    expectedVolume: 2450000,
    leasingCheckoutShare: 35,
    leasingVsPurchaseSplit: "35% / 65%",
    integratedServices: [
      "Lease-to-Own",
      "Asset Lifecycle Management",
      "Buy-Back / Trade-in",
      "Remarketing"
    ],
    
    // Section 5: Risk & Credit
    creditStatus: "low",
    paymentPerformance: {
      pastDueInvoices: 0,
      paymentHistory: "100% on time"
    },
    returnPolicy: "30-day return policy with 95% acceptance rate",
    residualValue: "Category-based: 70% for premium models, 60% for standard",
    
    // Section 6: Documents
    documents: [
      { name: "Master Agreement", date: "2023-01-20", type: "PDF" },
      { name: "Pricing Addendum", date: "2023-01-20", type: "PDF" },
      { name: "Buy-Back Agreement", date: "2023-02-15", type: "PDF" }
    ]
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCreditBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-success text-success-foreground">Green</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Amber</Badge>;
      case "high":
        return <Badge variant="destructive">Red</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const handleEditMerchant = () => {
    toast({
      title: "Edit Merchant",
      description: "Opening merchant editor...",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Data",
      description: "Preparing merchant data export...",
    });
  };

  const handleSendMessage = () => {
    toast({
      title: "Send Message",
      description: "Opening message composer...",
    });
  };

  const handleViewAnalytics = () => {
    toast({
      title: "View Analytics",
      description: "Loading merchant analytics...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/merchants")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => navigate("/merchants")}
                  className="cursor-pointer"
                >
                  Merchants
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">{merchant.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEditMerchant} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit Merchant
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportData} className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSendMessage} className="cursor-pointer">
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleViewAnalytics} className="cursor-pointer">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sidebar Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <img
              src={merchant.logo}
              alt={merchant.name}
              className="w-20 h-20 rounded-lg border"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{merchant.name}</h2>
                {getStatusBadge(merchant.status)}
              </div>
              <p className="text-muted-foreground mb-2">{merchant.category}</p>
              <a
                href={`https://${merchant.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                {merchant.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="sharpei">Sharpei Services</TabsTrigger>
          <TabsTrigger value="risk">Risk & Credit</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Merchant Identification & Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Merchant Name</p>
                  <p className="font-medium">{merchant.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Legal Entity Name</p>
                  <p className="font-medium">{merchant.legalName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{merchant.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax ID</p>
                  <p className="font-medium">{merchant.taxId}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground">Registered Address</p>
                <p className="font-medium">{merchant.registeredAddress}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold mb-3">Contact Person</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{merchant.contactPerson.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">{merchant.contactPerson.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{merchant.contactPerson.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{merchant.contactPerson.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business & Operational Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Business Model</p>
                <p className="font-medium">{merchant.businessModel}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Geography</p>
                  <p className="font-medium">{merchant.geography}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Channels</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {merchant.channels.map((channel) => (
                      <Badge key={channel} variant="outline">{channel}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financials Tab */}
        <TabsContent value="financials" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Annual Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${(merchant.annualRevenue / 1000000).toFixed(1)}M</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quarterly Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-success">{merchant.quarterlyGrowthRate}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Net Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{merchant.netMargin}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Average Transaction Size</p>
                  <p className="text-xl font-bold">${merchant.avgTransactionSize.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Transaction Volume</p>
                  <p className="text-xl font-bold">{merchant.monthlyTransactionVolume.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Default Rate</p>
                  <p className="text-xl font-bold">{merchant.defaultRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sharpei Services Tab */}
        <TabsContent value="sharpei" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Onboarding Date</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{new Date(merchant.onboardingDate).toLocaleDateString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Contract Date</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{new Date(merchant.contractDate).toLocaleDateString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Expected Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">${(merchant.expectedVolume / 1000000).toFixed(2)}M</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Leasing Checkout Share</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{merchant.leasingCheckoutShare}%</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integrated Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {merchant.integratedServices.map((service) => (
                  <Badge key={service} className="bg-primary text-primary-foreground">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Split Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-muted-foreground">Leasing vs One-time Purchase</p>
                <p className="text-lg font-semibold">{merchant.leasingVsPurchaseSplit}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk & Credit Tab */}
        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credit Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <p className="text-lg">Merchant Credit Status:</p>
                {getCreditBadge(merchant.creditStatus)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Past-Due Invoices</p>
                <p className="text-lg font-semibold">{merchant.paymentPerformance.pastDueInvoices}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment History</p>
                <p className="text-lg font-semibold text-success">{merchant.paymentPerformance.paymentHistory}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Return & Recovery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Return Policy</p>
                <p className="font-medium">{merchant.returnPolicy}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Residual Value Structure</p>
                <p className="font-medium">{merchant.residualValue}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {merchant.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{doc.type}</span>
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(doc.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MerchantDetail;
