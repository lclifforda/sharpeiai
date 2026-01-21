import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, UserPlus, MapPin, Building2, Calendar, Package, DollarSign, CreditCard, FileText, Briefcase, AlertCircle, Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddRepresentativeDialog } from "@/components/AddRepresentativeDialog";

interface Representative {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
}

interface Order {
  id: string;
  equipment: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'completed';
  amount: number;
}

interface Contract {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired';
  value: number;
}

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in production, fetch from API
  const initialCompanyData: any = {
    '1': {
      name: 'TechCorp Industries',
      industry: 'Manufacturing',
      location: 'San Francisco, CA',
      address: '1234 Innovation Drive, San Francisco, CA 94105',
      founded: '2018',
      status: 'active',
      kpis: {
        totalRevenue: 67500,
        activeOrders: 3,
        totalEquipment: 35,
        contractValue: 125000,
        paymentStatus: 'current',
        customerSince: '2023-01-15',
      },
      representatives: [
        {
          id: '1',
          name: 'John Martinez',
          email: 'john.martinez@techcorp.com',
          phone: '(415) 555-0123',
          role: 'Operations Manager',
          joinDate: '2021-03-15',
        },
        {
          id: '2',
          name: 'Sarah Chen',
          email: 'sarah.chen@techcorp.com',
          phone: '(415) 555-0124',
          role: 'Technical Lead',
          joinDate: '2022-01-10',
        },
      ],
      orders: [
        {
          id: 'ORD-001',
          equipment: 'IoT Sensor Kit (Model S-400)',
          quantity: 15,
          startDate: '2025-01-15',
          endDate: '2025-07-15',
          status: 'active',
          amount: 22500,
        },
        {
          id: 'ORD-008',
          equipment: 'Edge Computing Device (EC-Pro)',
          quantity: 12,
          startDate: '2025-02-01',
          endDate: '2025-08-01',
          status: 'active',
          amount: 28000,
        },
        {
          id: 'ORD-015',
          equipment: 'Industrial Camera System',
          quantity: 8,
          startDate: '2024-11-01',
          endDate: '2025-05-01',
          status: 'completed',
          amount: 17000,
        },
      ],
      contracts: [
        {
          id: 'CNT-2025-001',
          type: 'Annual Equipment Lease',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          status: 'active',
          value: 125000,
        },
      ],
    },
    '2': {
      name: 'DataFlow Systems',
      industry: 'Logistics',
      location: 'Austin, TX',
      address: '5678 Tech Boulevard, Austin, TX 78701',
      founded: '2019',
      status: 'active',
      kpis: {
        totalRevenue: 44500,
        activeOrders: 2,
        totalEquipment: 18,
        contractValue: 55000,
        paymentStatus: 'pending',
        customerSince: '2023-06-20',
      },
      representatives: [
        {
          id: '3',
          name: 'Michael Johnson',
          email: 'mjohnson@dataflow.com',
          phone: '(512) 555-0198',
          role: 'Logistics Director',
          joinDate: '2020-06-20',
        },
      ],
      orders: [
        {
          id: 'ORD-002',
          equipment: 'Edge Computing Device (EC-Pro)',
          quantity: 8,
          startDate: '2025-02-01',
          endDate: '2025-08-01',
          status: 'active',
          amount: 16000,
        },
        {
          id: 'ORD-009',
          equipment: 'GPS Tracking Module',
          quantity: 10,
          startDate: '2025-01-15',
          endDate: '2025-07-15',
          status: 'active',
          amount: 9000,
        },
      ],
      contracts: [
        {
          id: 'CNT-2025-002',
          type: '6-Month Rental Agreement',
          startDate: '2025-02-01',
          endDate: '2025-08-01',
          status: 'active',
          value: 55000,
        },
      ],
    },
  };

  // State to manage representatives for the current company
  const [companyData, setCompanyData] = useState(initialCompanyData);
  const company = companyData[id || '1'] || companyData['1'];

  // Handle adding a new representative
  const handleAddRepresentative = (newRepresentative: Representative) => {
    const companyId = id || '1';
    setCompanyData((prev: any) => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        representatives: [...(prev[companyId]?.representatives || []), newRepresentative],
      },
    }));
  };

  const handleCreateContract = () => {
    const companyId = id || '1';
    navigate(`/contracts/new?companyId=${companyId}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link to="/companies" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Companies
      </Link>

      {/* Company Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xl font-bold">
                {company.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{company.name}</h1>
                <p className="text-muted-foreground">{company.industry}</p>
                <Badge variant={company.status === 'active' ? 'default' : 'destructive'} className="mt-2">
                  {company.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{company.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium">{company.industry}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Customer Since</p>
                <p className="font-medium">
                  {new Date(company.kpis.customerSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[hsl(185,85%,50%)]/10">
                <Landmark className="w-6 h-6" style={{ color: 'hsl(185, 85%, 50%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${company.kpis.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[hsl(220,90%,55%)]/10">
                <Briefcase className="w-6 h-6" style={{ color: 'hsl(220, 90%, 55%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold">{company.kpis.activeOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[hsl(260,85%,60%)]/10">
                <Package className="w-6 h-6" style={{ color: 'hsl(260, 85%, 60%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equipment in Use</p>
                <p className="text-2xl font-bold">{company.kpis.totalEquipment} units</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[hsl(275,80%,65%)]/10">
                <FileText className="w-6 h-6" style={{ color: 'hsl(275, 80%, 65%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contract Value</p>
                <p className="text-2xl font-bold">${company.kpis.contractValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${company.kpis.paymentStatus === 'current' ? 'bg-[hsl(185,85%,50%)]/10' : 'bg-amber-500/10'}`}>
                <CreditCard 
                  className="w-6 h-6" 
                  style={{ color: company.kpis.paymentStatus === 'current' ? 'hsl(185, 85%, 50%)' : 'hsl(38, 92%, 50%)' }} 
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <Badge variant={company.kpis.paymentStatus === 'current' ? 'default' : 'secondary'}>
                  {company.kpis.paymentStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">
            <Building2 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders">
            <Briefcase className="w-4 h-4 mr-2" />
            Orders ({company.orders.length})
          </TabsTrigger>
          <TabsTrigger value="contracts">
            <FileText className="w-4 h-4 mr-2" />
            Contracts ({company.contracts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Representatives</CardTitle>
                <AddRepresentativeDialog onAdd={handleAddRepresentative} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.representatives.map((rep: Representative) => (
                  <Card key={rep.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
                          {rep.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{rep.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{rep.role}</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <a href={`mailto:${rep.email}`} className="hover:underline">{rep.email}</a>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{rep.phone}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-3">
                            Joined {new Date(rep.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Equipment</th>
                      <th className="text-left py-3 px-4">Quantity</th>
                      <th className="text-left py-3 px-4">Duration</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-right py-3 px-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {company.orders.map((order: Order) => (
                      <tr key={order.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <Link to={`/orders/${order.id}`} className="font-medium hover:underline">{order.id}</Link>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span>{order.equipment}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{order.quantity} units</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(order.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                              {new Date(order.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={order.status === 'active' ? 'default' : order.status === 'pending' ? 'secondary' : 'outline'}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">${order.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="mt-6">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <CardTitle>Contracts</CardTitle>
              <Button onClick={handleCreateContract}>
                <FileText className="w-4 h-4 mr-2" />
                Create New Contract
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Contract ID</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Start Date</th>
                      <th className="text-left py-3 px-4">End Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-right py-3 px-4">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {company.contracts.map((contract: Contract) => (
                      <tr key={contract.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <Link to={`/contracts/${contract.id}`} className="font-medium hover:underline">{contract.id}</Link>
                        </td>
                        <td className="py-3 px-4">{contract.type}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{new Date(contract.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-sm">
                            {contract.status === 'expiring' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                            {contract.status !== 'expiring' && <Calendar className="w-4 h-4 text-muted-foreground" />}
                            <span>{new Date(contract.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={contract.status === 'active' ? 'default' : contract.status === 'expiring' ? 'secondary' : 'destructive'}>
                            {contract.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">${contract.value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDetail;
