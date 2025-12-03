import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, Calendar, MapPin, AlertCircle, CheckCircle, Clock, Building2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Assignment {
  id: string;
  orderId: string;
  company: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
}

interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  technician: string;
  cost: number;
}

const InventoryDetail = () => {
  const { id } = useParams();

  // Mock inventory data
  const inventoryData: any = {
    'INV-001': {
      id: 'INV-001',
      name: 'IoT Sensor Kit',
      category: 'Sensors',
      model: 'S-400',
      manufacturer: 'IoT Solutions Inc',
      serialNumber: 'SN-400-12345',
      purchaseDate: '2024-06-15',
      purchasePrice: 2500,
      currentValue: 2100,
      condition: 'excellent',
      status: 'assigned',
      location: 'TechCorp Industries - San Francisco, CA',
      specifications: {
        weight: '2.5 kg',
        dimensions: '15cm x 10cm x 5cm',
        powerSource: 'Battery + USB-C',
        connectivity: 'WiFi, Bluetooth, LoRaWAN',
        warranty: '2 years manufacturer warranty',
      },
      currentAssignment: {
        orderId: 'ORD-001',
        company: 'TechCorp Industries',
        companyId: '1',
        startDate: '2025-01-15',
        endDate: '2025-07-15',
        monthlyRate: 150,
      },
      assignments: [
        {
          id: '1',
          orderId: 'ORD-001',
          company: 'TechCorp Industries',
          startDate: '2025-01-15',
          endDate: '2025-07-15',
          status: 'active',
        },
        {
          id: '2',
          orderId: 'ORD-015',
          company: 'DataFlow Systems',
          startDate: '2024-08-01',
          endDate: '2024-12-31',
          status: 'completed',
        },
        {
          id: '3',
          orderId: 'ORD-008',
          company: 'SmartFactory Inc',
          startDate: '2024-03-15',
          endDate: '2024-07-15',
          status: 'completed',
        },
      ],
      maintenance: [
        {
          id: '1',
          date: '2025-01-10',
          type: 'Inspection',
          description: 'Pre-deployment inspection and calibration',
          technician: 'Mike Johnson',
          cost: 75,
        },
        {
          id: '2',
          date: '2024-12-20',
          type: 'Repair',
          description: 'Replaced battery module',
          technician: 'Sarah Chen',
          cost: 120,
        },
        {
          id: '3',
          date: '2024-07-30',
          type: 'Inspection',
          description: 'Post-return inspection and cleaning',
          technician: 'Mike Johnson',
          cost: 50,
        },
      ],
      documents: [
        { id: '1', name: 'Purchase Invoice', date: '2024-06-15' },
        { id: '2', name: 'Warranty Certificate', date: '2024-06-15' },
        { id: '3', name: 'User Manual', date: '2024-06-15' },
        { id: '4', name: 'Calibration Certificate', date: '2025-01-10' },
      ],
    },
  };

  const item = inventoryData[id || 'INV-001'] || inventoryData['INV-001'];

  const utilizationRate = 85; // Calculate from assignment history
  const totalRevenue = item.assignments.reduce((sum: number, a: Assignment) => {
    if (a.status === 'completed') {
      const months = Math.ceil((new Date(a.endDate).getTime() - new Date(a.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30));
      return sum + (months * (item.currentAssignment?.monthlyRate || 0));
    }
    return sum;
  }, 0);

  const getStatusColor = (status: string) => {
    const colors: any = {
      available: 'default',
      assigned: 'default',
      maintenance: 'secondary',
      retired: 'destructive',
    };
    return colors[status] || 'outline';
  };

  const getConditionColor = (condition: string) => {
    const colors: any = {
      excellent: 'default',
      good: 'default',
      fair: 'secondary',
      poor: 'destructive',
    };
    return colors[condition] || 'outline';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link to="/assets" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Inventory
      </Link>

      {/* Item Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{item.name}</h1>
                <p className="text-muted-foreground">{item.id} • {item.model}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                  <Badge variant={getConditionColor(item.condition)}>{item.condition} condition</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <p className="font-medium">{item.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Serial Number</p>
              <p className="font-medium font-mono text-sm">{item.serialNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Manufacturer</p>
              <p className="font-medium">{item.manufacturer}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Purchase Date</p>
              <p className="font-medium">{new Date(item.purchaseDate).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Purchase Price</p>
              <p className="text-2xl font-bold">${item.purchasePrice.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-2xl font-bold">${item.currentValue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {Math.round((item.currentValue / item.purchasePrice) * 100)}% of purchase price
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {Math.round((totalRevenue / item.purchasePrice) * 100)}% ROI
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Utilization Rate</p>
              <p className="text-2xl font-bold">{utilizationRate}%</p>
              <p className="text-xs text-muted-foreground">Last 12 months</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Assignment */}
          {item.status === 'assigned' && item.currentAssignment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Current Assignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Assigned To</p>
                    <Link to={`/companies/${item.currentAssignment.companyId}`} className="font-semibold text-lg hover:underline">
                      {item.currentAssignment.company}
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                      <Link to={`/orders/${item.currentAssignment.orderId}`} className="font-medium hover:underline">
                        {item.currentAssignment.orderId}
                      </Link>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Monthly Rate</p>
                      <p className="font-medium">${item.currentAssignment.monthlyRate.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                      <p className="font-medium">{new Date(item.currentAssignment.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">End Date</p>
                      <p className="font-medium">{new Date(item.currentAssignment.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Current Location</p>
                      <p className="text-sm text-muted-foreground">{item.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assignment History */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {item.assignments.map((assignment: Assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link to={`/companies/${assignment.id}`} className="font-medium hover:underline">
                          {assignment.company}
                        </Link>
                        <Badge variant={
                          assignment.status === 'active' ? 'default' :
                          assignment.status === 'upcoming' ? 'secondary' :
                          'outline'
                        }>
                          {assignment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}</span>
                        </div>
                        <Link to={`/orders/${assignment.orderId}`} className="hover:underline">
                          {assignment.orderId}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance History */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-left py-3 px-4">Technician</th>
                      <th className="text-right py-3 px-4">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.maintenance.map((record: MaintenanceRecord) => (
                      <tr key={record.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{record.type}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">{record.description}</td>
                        <td className="py-3 px-4 text-sm">{record.technician}</td>
                        <td className="py-3 px-4 text-right">${record.cost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(item.specifications).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-muted-foreground mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="font-medium text-sm">{value as string}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {item.documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(doc.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Schedule Maintenance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="w-4 h-4 mr-2" />
                Assign to Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetail;
