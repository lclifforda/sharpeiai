import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, Calendar, MapPin, User, DollarSign, FileText, Truck, CheckCircle, Clock, AlertCircle, Edit2, Printer, CheckCircle2, XCircle, Loader2, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadedDocument, DOCUMENT_LABELS, DOCUMENT_CATEGORIES } from "@/types/documents";

interface OrderItem {
  id: string;
  equipment: string;
  model: string;
  serialNumber: string;
  quantity: number;
  unitPrice: number;
  condition: string;
}

interface Timeline {
  id: string;
  date: string;
  status: string;
  description: string;
  user: string;
}

const OrderDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');

  // Mock order data
  const orderData: any = {
    'ORD-001': {
      id: 'ORD-001',
      status: 'active',
      company: {
        id: '1',
        name: 'TechCorp Industries',
        contact: 'John Martinez',
        email: 'john.martinez@techcorp.com',
        phone: '(415) 555-0123',
        address: '1234 Innovation Drive, San Francisco, CA 94105',
      },
      dates: {
        ordered: '2025-01-10',
        startDate: '2025-01-15',
        endDate: '2025-07-15',
      },
      contractType: 'Lease',
      shipping: {
        method: 'Standard Ground',
        trackingNumber: 'TRK-1234567890',
        deliveredDate: '2025-01-14',
      },
      items: [
        {
          id: '1',
          equipment: 'IoT Sensor Kit',
          model: 'S-400',
          serialNumber: 'SN-400-12345',
          quantity: 10,
          unitPrice: 1500,
          condition: 'New',
        },
        {
          id: '2',
          equipment: 'IoT Sensor Kit',
          model: 'S-400',
          serialNumber: 'SN-400-12346',
          quantity: 5,
          unitPrice: 1500,
          condition: 'New',
        },
      ],
      pricing: {
        subtotal: 22500,
        tax: 0,
        shipping: 0,
        total: 22500,
        deposit: 5000,
        monthlyRate: 3750,
      },
      timeline: [
        {
          id: '1',
          date: '2025-01-10T10:00:00',
          status: 'created',
          description: 'Order created',
          user: 'Lucia Clifford',
        },
        {
          id: '2',
          date: '2025-01-10T14:30:00',
          status: 'approved',
          description: 'Order approved and equipment reserved',
          user: 'System',
        },
        {
          id: '3',
          date: '2025-01-12T09:00:00',
          status: 'shipped',
          description: 'Equipment shipped via Standard Ground',
          user: 'Warehouse Team',
        },
        {
          id: '4',
          date: '2025-01-14T15:45:00',
          status: 'delivered',
          description: 'Equipment delivered and signed for',
          user: 'John Martinez',
        },
        {
          id: '5',
          date: '2025-01-15T08:00:00',
          status: 'active',
          description: 'Contract period started',
          user: 'System',
        },
      ],
      documents: [
        { id: '1', name: 'Equipment Lease Agreement', type: 'PDF', size: '245 KB', date: '2025-01-10' },
        { id: '2', name: 'Equipment Inspection Report', type: 'PDF', size: '1.2 MB', date: '2025-01-14' },
        { id: '3', name: 'Delivery Confirmation', type: 'PDF', size: '180 KB', date: '2025-01-14' },
      ],
      customerDocuments: [
        {
          id: 'cd-1',
          type: 'business_license',
          fileName: 'TechCorp_Business_License.pdf',
          uploadDate: new Date('2025-01-08'),
          status: 'verified',
          extractedData: { licenseNumber: 'BL-CA-789456', state: 'California', expiryDate: '2026-12-31' },
          verificationNotes: ['OCR confidence: 95%', '✓ Document validated successfully', 'Extracted: 3 fields'],
        },
        {
          id: 'cd-2',
          type: 'articles_of_incorporation',
          fileName: 'Articles_of_Incorporation_2020.pdf',
          uploadDate: new Date('2025-01-08'),
          status: 'verified',
          extractedData: { incorporationDate: '2020-03-15', entityType: 'Corporation', state: 'Delaware' },
          verificationNotes: ['OCR confidence: 92%', '✓ Document validated successfully'],
        },
        {
          id: 'cd-3',
          type: 'tax_return_year1',
          fileName: 'TechCorp_2024_Tax_Return.pdf',
          uploadDate: new Date('2025-01-08'),
          status: 'verified',
          extractedData: { taxYear: '2024', grossRevenue: 2500000, netIncome: 450000 },
          verificationNotes: ['OCR confidence: 89%', '✓ Document validated successfully'],
        },
      ] as UploadedDocument[],
      notes: 'Customer requested early delivery. Equipment inspected and in excellent condition.',
    },
  };

  const order = orderData[id || 'ORD-001'] || orderData['ORD-001'];

  const daysRemaining = Math.ceil(
    (new Date(order.dates.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getDocumentStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; icon: any; variant: any }> = {
      verified: { label: 'Verified', icon: <CheckCircle2 className="w-3 h-3" />, variant: 'default' },
      processing: { label: 'Processing', icon: <Loader2 className="w-3 h-3 animate-spin" />, variant: 'secondary' },
      rejected: { label: 'Rejected', icon: <XCircle className="w-3 h-3" />, variant: 'destructive' },
      pending: { label: 'Pending', icon: <Clock className="w-3 h-3" />, variant: 'outline' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const groupDocumentsByCategory = (docs: UploadedDocument[]) => {
    const grouped: Record<string, UploadedDocument[]> = {};
    docs.forEach(doc => {
      const category = getCategoryForDocType(doc.type);
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(doc);
    });
    return grouped;
  };

  const getCategoryForDocType = (type: string): string => {
    const categoryMap: Record<string, string> = {
      business_license: 'business_info',
      articles_of_incorporation: 'business_info',
      tax_return_year1: 'financial',
      tax_return_year2: 'financial',
      balance_sheet: 'financial',
      profit_loss: 'financial',
      bank_statement: 'financial',
      equipment_quote: 'equipment',
      personal_guarantee: 'personal',
      personal_tax_return: 'personal',
      personal_id: 'personal',
      insurance_cert: 'security',
      ucc_filing: 'security',
    };
    return categoryMap[type] || 'business_info';
  };

  const getTimelineIcon = (status: string) => {
    const iconMap: any = {
      created: <FileText className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      delivered: <Package className="w-4 h-4" />,
      active: <CheckCircle className="w-4 h-4" />,
    };
    return iconMap[status] || <Clock className="w-4 h-4" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link to="/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Link>

      {/* Order Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{order.company.name}</h1>
                <p className="text-muted-foreground">{order.id}</p>
                <Badge variant="default" className="mt-2">{order.status}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Contract Period</p>
                <p className="font-medium">{new Date(order.dates.startDate).toLocaleDateString()} - {new Date(order.dates.endDate).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground">{order.contractType} • {daysRemaining} days remaining</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="font-medium">${order.pricing.total.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">${order.pricing.monthlyRate.toLocaleString()}/month</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Equipment</p>
                <p className="font-medium">{order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} units</p>
                <p className="text-xs text-muted-foreground">{order.items.length} items</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Delivery Status</p>
                <p className="font-medium">Delivered</p>
                <p className="text-xs text-muted-foreground">{new Date(order.shipping.deliveredDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">
            <FileText className="w-4 h-4 mr-2" />
            Order Details
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Clock className="w-4 h-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Documents ({order.documents.length + order.customerDocuments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6 space-y-4">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Person</p>
                    <p className="font-medium">{order.company.contact}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href={`mailto:${order.company.email}`} className="font-medium hover:underline">{order.company.email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{order.company.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                    <p className="font-medium">{order.company.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment List */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Equipment</th>
                      <th className="text-left py-3 px-4">Model</th>
                      <th className="text-left py-3 px-4">Serial Number</th>
                      <th className="text-left py-3 px-4">Condition</th>
                      <th className="text-left py-3 px-4">Quantity</th>
                      <th className="text-right py-3 px-4">Unit Price</th>
                      <th className="text-right py-3 px-4">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item: OrderItem) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span>{item.equipment}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{item.model}</td>
                        <td className="py-3 px-4 font-mono text-sm">{item.serialNumber}</td>
                        <td className="py-3 px-4">
                          <Badge variant="default">{item.condition}</Badge>
                        </td>
                        <td className="py-3 px-4">{item.quantity}</td>
                        <td className="py-3 px-4 text-right">${item.unitPrice.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-medium">${(item.quantity * item.unitPrice).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Deposit Paid</span>
                  <span>-${order.pricing.deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.pricing.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.pricing.shipping === 0 ? 'Free' : `$${order.pricing.shipping}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${order.pricing.total.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Monthly rate: ${order.pricing.monthlyRate.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {order.timeline.map((event: Timeline, index: number) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {getTimelineIcon(event.status)}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold">{event.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">by {event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6 space-y-6">
          {/* System Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <div>
                  <CardTitle>System Documents</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Generated lease agreements and internal documents</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size} • {new Date(doc.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Documents with OCR */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                <div>
                  <CardTitle>Customer Documents</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Documents submitted during checkout with OCR verification</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(groupDocumentsByCategory(order.customerDocuments)).map(([category, docs]) => (
                <div key={category}>
                  <h4 className="font-semibold mb-3">{DOCUMENT_CATEGORIES[category]}</h4>
                  <div className="space-y-4">
                    {(docs as UploadedDocument[]).map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium">{DOCUMENT_LABELS[doc.type]}</p>
                              <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Uploaded: {doc.uploadDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getDocumentStatusBadge(doc.status)}
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </div>

                        {/* Extracted Data */}
                        {doc.extractedData && Object.keys(doc.extractedData).length > 0 && (
                          <div className="bg-muted/50 p-3 rounded-md">
                            <p className="text-xs font-semibold mb-2">Extracted Data (OCR):</p>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(doc.extractedData).map(([key, value]) => (
                                <div key={key} className="text-xs">
                                  <span className="text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                  <span className="ml-1 font-medium">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Verification Notes */}
                        {doc.verificationNotes && doc.verificationNotes.length > 0 && (
                          <div className="space-y-1">
                            {doc.verificationNotes.map((note, idx) => (
                              <div
                                key={idx}
                                className={`text-xs p-2 rounded ${
                                  note.includes('✓') ? 'bg-green-500/10 text-green-700' :
                                  note.includes('OCR') ? 'bg-blue-500/10 text-blue-700' :
                                  'bg-muted'
                                }`}
                              >
                                {note}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderDetail;
