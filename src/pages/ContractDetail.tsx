import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, DollarSign, Building2, AlertCircle, Package, CheckCircle, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PaymentSchedule {
  id: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
}

interface Equipment {
  id: string;
  name: string;
  model: string;
  quantity: number;
  monthlyRate: number;
}

const ContractDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  // Mock contract data
  const contractData: any = {
    'CNT-2025-001': {
      id: 'CNT-2025-001',
      type: 'Annual Equipment Lease',
      company: {
        id: '1',
        name: 'TechCorp Industries',
        contact: 'John Martinez',
        email: 'john.martinez@techcorp.com',
      },
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      value: 125000,
      terms: {
        paymentFrequency: 'Monthly',
        paymentAmount: 10416.67,
        securityDeposit: 25000,
        lateFeePercentage: 5,
        autoRenew: true,
        renewalTerms: '1 year',
      },
      equipment: [
        {
          id: '1',
          name: 'IoT Sensor Kit',
          model: 'S-400',
          quantity: 15,
          monthlyRate: 2250,
        },
        {
          id: '2',
          name: 'Edge Computing Device',
          model: 'EC-Pro',
          quantity: 12,
          monthlyRate: 2800,
        },
        {
          id: '3',
          name: 'Industrial Camera System',
          model: 'CAM-4K-PRO',
          quantity: 8,
          monthlyRate: 2000,
        },
      ],
      paymentSchedule: [
        { id: '1', dueDate: '2025-01-15', amount: 10416.67, status: 'paid', paidDate: '2025-01-14' },
        { id: '2', dueDate: '2025-02-15', amount: 10416.67, status: 'paid', paidDate: '2025-02-13' },
        { id: '3', dueDate: '2025-03-15', amount: 10416.67, status: 'pending' },
        { id: '4', dueDate: '2025-04-15', amount: 10416.67, status: 'pending' },
        { id: '5', dueDate: '2025-05-15', amount: 10416.67, status: 'pending' },
        { id: '6', dueDate: '2025-06-15', amount: 10416.67, status: 'pending' },
      ],
      documents: [
        { id: '1', name: 'Signed Contract Agreement', date: '2024-12-20' },
        { id: '2', name: 'Equipment Schedule', date: '2024-12-20' },
        { id: '3', name: 'Insurance Certificate', date: '2024-12-22' },
      ],
      notes: 'Auto-renewal enabled. Customer has been notified of upcoming renewal 60 days in advance.',
    },
  };

  const contract = contractData[id || 'CNT-2025-001'] || contractData['CNT-2025-001'];

  const handleCopySigningLink = async () => {
    try {
      const signingLink = `https://docusign.com/sign/${encodeURIComponent(contract.id)}`;
      await navigator.clipboard.writeText(signingLink);
      toast({
        title: "Signing link copied",
        description: "Share this link with the customer to complete and sign the contract.",
      });
    } catch (error) {
      toast({
        title: "Unable to copy link",
        description: "Your browser may not support clipboard access. Please try copying the URL manually.",
        variant: "destructive",
      });
    }
  };

  const daysRemaining = Math.ceil(
    (new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const paidPayments = contract.paymentSchedule.filter((p: PaymentSchedule) => p.status === 'paid').length;
  const totalPayments = contract.paymentSchedule.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link to="/contracts" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Contracts
      </Link>

      {/* Contract Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{contract.type}</h1>
                <p className="text-muted-foreground">{contract.id}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={contract.status === 'active' ? 'default' : contract.status === 'expiring' ? 'secondary' : 'destructive'}>
                    {contract.status}
                  </Badge>
                  {contract.terms.autoRenew && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Auto-Renew
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                View Contract
              </Button>
              <Button size="sm" onClick={handleCopySigningLink}>
                <Link2 className="w-4 h-4 mr-2" />
                Copy Signing Link
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <Link to={`/companies/${contract.company.id}`} className="font-medium hover:underline">
                  {contract.company.name}
                </Link>
                <p className="text-xs text-muted-foreground">{contract.company.contact}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Contract Period</p>
                <p className="font-medium">{new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground">{daysRemaining} days remaining</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Contract Value</p>
                <p className="font-medium">${contract.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">${contract.terms.paymentAmount.toLocaleString()}/month</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Payment Progress</p>
                <p className="font-medium">{paidPayments} of {totalPayments}</p>
                <p className="text-xs text-muted-foreground">{Math.round((paidPayments / totalPayments) * 100)}% complete</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Terms */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Frequency</p>
                  <p className="font-medium">{contract.terms.paymentFrequency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Amount</p>
                  <p className="font-medium">${contract.terms.paymentAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Security Deposit</p>
                  <p className="font-medium">${contract.terms.securityDeposit.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Late Fee</p>
                  <p className="font-medium">{contract.terms.lateFeePercentage}% of payment amount</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Auto-Renewal</p>
                  <p className="font-medium">{contract.terms.autoRenew ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Renewal Terms</p>
                  <p className="font-medium">{contract.terms.renewalTerms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Equipment</th>
                      <th className="text-left py-3 px-4">Model</th>
                      <th className="text-left py-3 px-4">Quantity</th>
                      <th className="text-right py-3 px-4">Monthly Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.equipment.map((item: Equipment) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{item.model}</td>
                        <td className="py-3 px-4">{item.quantity} units</td>
                        <td className="py-3 px-4 text-right font-medium">${item.monthlyRate.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td colSpan={3} className="py-3 px-4 text-right">Total Monthly Rate:</td>
                      <td className="py-3 px-4 text-right">${contract.terms.paymentAmount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Payment Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contract.paymentSchedule.map((payment: PaymentSchedule) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        payment.status === 'paid' ? 'bg-green-500' :
                        payment.status === 'overdue' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium">Due: {new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        {payment.paidDate && (
                          <p className="text-sm text-muted-foreground">Paid: {new Date(payment.paidDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">${payment.amount.toLocaleString()}</p>
                      <Badge variant={
                        payment.status === 'paid' ? 'default' :
                        payment.status === 'overdue' ? 'destructive' :
                        'secondary'
                      }>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Related Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contract.documents.map((doc: any) => (
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

          {/* Notes */}
          {contract.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">{contract.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
