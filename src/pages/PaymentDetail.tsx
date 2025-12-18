import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Building2, DollarSign, Calendar, AlertCircle, CheckCircle, Clock, Mail, Send, FileText, Printer, ArrowDownRight, ArrowUpRight, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Timeline {
  id: string;
  date: string;
  status: string;
  description: string;
  user: string;
}

const PaymentDetail = () => {
  const { id } = useParams();

  // Mock payment data with both ACH and Card examples
  const paymentData: any = {
    'PAY-5678': {
      id: 'PAY-5678',
      type: 'Incoming',
      status: 'Completed',
      amount: 12500,
      company: {
        id: '1',
        name: 'TechCorp Industries',
        contact: 'John Martinez',
        email: 'john.martinez@techcorp.com',
        phone: '(415) 555-0123',
      },
      paymentMethod: 'ACH',
      achDetails: {
        bankName: 'Chase Bank',
        accountType: 'Checking',
        accountLast4: '7890',
        routingLast4: '0210',
      },
      transactionId: 'TXN-2025-0113-5678',
      processingFee: 0,
      dueDate: '2025-11-15',
      paidDate: '2025-11-13',
      relatedContract: {
        id: 'CNT-2025-001',
        name: 'Annual Equipment Lease',
      },
      relatedOrder: {
        id: 'ORD-001',
        name: 'IoT Sensor Kit Order',
      },
      timeline: [
        {
          id: '1',
          date: '2025-11-10T10:00:00',
          status: 'scheduled',
          description: 'Payment scheduled for November 15, 2025',
          user: 'System',
        },
        {
          id: '2',
          date: '2025-11-13T08:30:00',
          status: 'processed',
          description: 'ACH payment processed successfully',
          user: 'Payment Processor',
        },
        {
          id: '3',
          date: '2025-11-13T08:35:00',
          status: 'completed',
          description: 'Payment completed and confirmed',
          user: 'System',
        },
      ],
    },
    'PAY-5679': {
      id: 'PAY-5679',
      type: 'Incoming',
      status: 'Completed',
      amount: 18900,
      company: {
        id: '2',
        name: 'MedEquip Solutions',
        contact: 'Sarah Chen',
        email: 'sarah.chen@medequip.com',
        phone: '(512) 555-0456',
      },
      paymentMethod: 'Card',
      cardDetails: {
        type: 'Visa',
        last4: '4242',
        expiry: '12/26',
      },
      transactionId: 'TXN-2025-0112-5679',
      processingFee: 567,
      dueDate: '2025-11-12',
      paidDate: '2025-11-12',
      relatedContract: {
        id: 'CNT-2025-002',
        name: 'Medical Equipment Lease',
      },
      timeline: [
        {
          id: '1',
          date: '2025-11-12T09:15:00',
          status: 'initiated',
          description: 'Card payment initiated',
          user: 'Customer',
        },
        {
          id: '2',
          date: '2025-11-12T09:16:00',
          status: 'processed',
          description: 'Card payment processed successfully',
          user: 'Payment Processor',
        },
        {
          id: '3',
          date: '2025-11-12T09:16:00',
          status: 'completed',
          description: 'Payment completed and confirmed',
          user: 'System',
        },
      ],
    },
    'PAY-5680': {
      id: 'PAY-5680',
      type: 'Incoming',
      status: 'Pending',
      amount: 35000,
      company: {
        id: '3',
        name: 'BuildPro Construction',
        contact: 'Mike Rodriguez',
        email: 'mike.rodriguez@buildpro.com',
        phone: '(312) 555-0789',
      },
      paymentMethod: 'ACH',
      achDetails: {
        bankName: 'Bank of America',
        accountType: 'Checking',
        accountLast4: '4567',
        routingLast4: '0260',
      },
      transactionId: 'TXN-2025-0111-5680',
      processingFee: 0,
      dueDate: '2025-11-11',
      relatedContract: {
        id: 'CNT-2025-003',
        name: 'Construction Equipment Lease',
      },
      timeline: [
        {
          id: '1',
          date: '2025-11-08T10:00:00',
          status: 'scheduled',
          description: 'Payment scheduled for November 11, 2025',
          user: 'System',
        },
        {
          id: '2',
          date: '2025-11-11T08:00:00',
          status: 'pending',
          description: 'ACH payment initiated, awaiting processing',
          user: 'Payment Processor',
        },
      ],
    },
    'PAY-5681': {
      id: 'PAY-5681',
      type: 'Outgoing',
      status: 'Completed',
      amount: 8500,
      company: {
        id: '4',
        name: 'Equipment Vendor',
        contact: 'Vendor Support',
        email: 'support@equipmentvendor.com',
        phone: '(800) 555-0000',
      },
      paymentMethod: 'ACH',
      achDetails: {
        bankName: 'Wells Fargo',
        accountType: 'Business Checking',
        accountLast4: '1234',
        routingLast4: '1210',
      },
      transactionId: 'TXN-2025-0110-5681',
      processingFee: 0,
      dueDate: '2025-11-10',
      paidDate: '2025-11-10',
      relatedOrder: {
        id: 'ORD-002',
        name: 'Vendor Payment',
      },
      timeline: [
        {
          id: '1',
          date: '2025-11-10T14:00:00',
          status: 'initiated',
          description: 'Outgoing payment initiated',
          user: 'Finance Team',
        },
        {
          id: '2',
          date: '2025-11-10T14:05:00',
          status: 'processed',
          description: 'ACH payment processed successfully',
          user: 'Payment Processor',
        },
        {
          id: '3',
          date: '2025-11-10T14:05:00',
          status: 'completed',
          description: 'Payment completed and confirmed',
          user: 'System',
        },
      ],
    },
  };

  const payment = paymentData[id || 'PAY-5678'] || paymentData['PAY-5678'];

  // Calculate days overdue if payment is pending/overdue
  const daysOverdue = payment.status === 'Pending' || payment.status === 'Overdue'
    ? Math.max(0, Math.ceil((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const isUnpaid = payment.status === 'Pending' || payment.status === 'Overdue' || payment.status === 'Failed';

  const getStatusBadge = () => {
    if (payment.status === 'Completed') {
      return (
        <Badge className="bg-success text-success-foreground hover:bg-success/90 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Completed
        </Badge>
      );
    }
    if (payment.status === 'Pending') {
      return (
        <Badge className="bg-warning text-warning-foreground hover:bg-warning/90 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>
      );
    }
    if (payment.status === 'Overdue') {
      return (
        <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Overdue
        </Badge>
      );
    }
    if (payment.status === 'Failed') {
      return (
        <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Failed
        </Badge>
      );
    }
    return <Badge variant="outline">{payment.status}</Badge>;
  };

  const getTimelineIcon = (status: string) => {
    const iconMap: any = {
      scheduled: <Calendar className="w-4 h-4" />,
      initiated: <Clock className="w-4 h-4" />,
      processed: <CheckCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      failed: <AlertCircle className="w-4 h-4" />,
    };
    return iconMap[status] || <Clock className="w-4 h-4" />;
  };

  const handleMarkAsPaid = () => {
    // TODO: Implement mark as paid functionality
    console.log('Mark as paid:', payment.id);
  };

  const handleSendReminder = () => {
    // TODO: Implement send reminder functionality
    console.log('Send reminder:', payment.id);
  };

  const handleContactCustomer = () => {
    // TODO: Implement contact customer functionality
    window.location.href = `mailto:${payment.company.email}?subject=Payment Reminder - ${payment.id}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link to="/payments" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Payments
      </Link>

      {/* Unpaid Payment Banner */}
      {isUnpaid && (
        <Alert variant="destructive" className="border-destructive bg-destructive/10">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-destructive font-semibold">
            {payment.status === 'Overdue' ? 'Payment Overdue' : 'Payment Pending'}
          </AlertTitle>
          <AlertDescription className="text-destructive/90">
            {daysOverdue > 0 ? (
              <>
                This payment is <strong>{daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue</strong>. 
                The payment of <strong>${payment.amount.toLocaleString()}</strong> was due on{' '}
                <strong>{new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
                Please take action to resolve this payment.
              </>
            ) : (
              <>
                This payment of <strong>${payment.amount.toLocaleString()}</strong> is currently pending. 
                It was due on <strong>{new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${
                payment.type === 'Incoming' 
                  ? 'bg-gradient-to-br from-success to-success/60' 
                  : 'bg-gradient-to-br from-destructive to-destructive/60'
              }`}>
                {payment.type === 'Incoming' ? (
                  <ArrowDownRight className="w-6 h-6" />
                ) : (
                  <ArrowUpRight className="w-6 h-6" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {payment.type} Payment
                </h1>
                <p className="text-muted-foreground font-mono">{payment.id}</p>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge()}
                  {isUnpaid && (
                    <Badge variant="outline" className="border-destructive text-destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Unpaid
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <Link to={`/companies/${payment.company.id}`} className="font-medium hover:underline">
                  {payment.company.name}
                </Link>
                <p className="text-xs text-muted-foreground">{payment.company.contact}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium text-lg gradient-sharpei-text">${payment.amount.toLocaleString()}</p>
                {payment.processingFee > 0 && (
                  <p className="text-xs text-muted-foreground">Fee: ${payment.processingFee.toLocaleString()}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{new Date(payment.dueDate).toLocaleDateString()}</p>
                {payment.paidDate && (
                  <p className="text-xs text-muted-foreground">Paid: {new Date(payment.paidDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              {payment.paymentMethod === 'ACH' ? (
                <Banknote className="w-5 h-5 text-muted-foreground mt-0.5" />
              ) : (
                <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{payment.paymentMethod}</p>
                {payment.paymentMethod === 'ACH' && payment.achDetails && (
                  <p className="text-xs text-muted-foreground">Account: ••••{payment.achDetails.accountLast4}</p>
                )}
                {payment.paymentMethod === 'Card' && payment.cardDetails && (
                  <p className="text-xs text-muted-foreground">{payment.cardDetails.type} ••••{payment.cardDetails.last4}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                    <p className="font-mono font-medium">{payment.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                    <div className="flex items-center gap-2">
                      {payment.paymentMethod === 'ACH' ? (
                        <Banknote className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                      )}
                      <p className="font-medium">{payment.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {payment.paymentMethod === 'ACH' && payment.achDetails && (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <p className="text-sm font-semibold mb-3">ACH Details</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
                        <p className="font-medium">{payment.achDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Account Type</p>
                        <p className="font-medium">{payment.achDetails.accountType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                        <p className="font-mono font-medium">••••{payment.achDetails.accountLast4}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Routing Number</p>
                        <p className="font-mono font-medium">••••{payment.achDetails.routingLast4}</p>
                      </div>
                    </div>
                  </div>
                )}

                {payment.paymentMethod === 'Card' && payment.cardDetails && (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <p className="text-sm font-semibold mb-3">Card Details</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Card Type</p>
                        <p className="font-medium">{payment.cardDetails.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Card Number</p>
                        <p className="font-mono font-medium">•••• •••• •••• {payment.cardDetails.last4}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Expiration Date</p>
                        <p className="font-medium">{payment.cardDetails.expiry}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Processing Fee</p>
                    <p className="font-medium">${payment.processingFee?.toLocaleString() || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Net Amount</p>
                    <p className="font-medium">${(payment.amount - (payment.processingFee || 0)).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Information */}
          {(payment.relatedContract || payment.relatedOrder) && (
            <Card>
              <CardHeader>
                <CardTitle>Related Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payment.relatedContract && (
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Related Contract</p>
                          <p className="text-xs text-muted-foreground">{payment.relatedContract.name}</p>
                        </div>
                      </div>
                      <Link to={`/contracts/${payment.relatedContract.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </div>
                  )}
                  {payment.relatedOrder && (
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Related Order</p>
                          <p className="text-xs text-muted-foreground">{payment.relatedOrder.name}</p>
                        </div>
                      </div>
                      <Link to={`/orders/${payment.relatedOrder.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {payment.timeline.map((event: Timeline, index: number) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.status === 'completed' ? 'bg-success/10 text-success' :
                        event.status === 'failed' ? 'bg-destructive/10 text-destructive' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {getTimelineIcon(event.status)}
                      </div>
                      {index < payment.timeline.length - 1 && (
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isUnpaid && (
                <Button 
                  onClick={handleMarkAsPaid}
                  className="w-full gradient-sharpei hover:opacity-90"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Paid
                </Button>
              )}
              {isUnpaid && (
                <Button 
                  onClick={handleSendReminder}
                  variant="outline"
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Payment Reminder
                </Button>
              )}
              <Button 
                onClick={handleContactCustomer}
                variant="outline"
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Customer
              </Button>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{payment.company.contact}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${payment.company.email}`} className="font-medium hover:underline text-sm">
                    {payment.company.email}
                  </a>
                </div>
                {payment.company.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{payment.company.phone}</p>
                  </div>
                )}
                <Link to={`/companies/${payment.company.id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Company Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;


