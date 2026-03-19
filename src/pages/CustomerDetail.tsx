import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Mail, Phone, MapPin, Building2, Calendar, Package,
  CreditCard, Briefcase, Landmark, FileText, CheckCircle2, Clock,
  XCircle, User, DollarSign, Shield, Sparkles, TrendingUp,
  Download, Eye, ChevronDown, ScanSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { AddRepresentativeDialog } from "@/components/AddRepresentativeDialog";
import {
  COMPANY_DETAILS,
  type Representative,
  type Application,
  type CompanyDocument,
  type AIHighlight,
} from "@/data/mockCustomers";
import { getCustomerById } from "@/lib/customerStorage";

const CustomerDetail = () => {
  const { id } = useParams();
  const storedCustomer = id ? getCustomerById(id) : undefined;

  const initialCompanyData: Record<string, any> = { ...COMPANY_DETAILS };
  const [companyData, setCompanyData] = useState(initialCompanyData);

  const company = storedCustomer
    ? {
        name: storedCustomer.name,
        industry: storedCustomer.industry,
        status: storedCustomer.status,
        businessInfo: {
          dba: storedCustomer.formData?.dba,
          ein: storedCustomer.formData?.ein || "—",
          entityType: storedCustomer.formData?.entityType || storedCustomer.industry,
          dateEstablished: storedCustomer.formData?.dateEstablished || "—",
          industryCode: storedCustomer.industry,
          numberOfEmployees: parseInt(storedCustomer.formData?.numberOfEmployees || "0", 10) || 0,
          ownershipPercentage: parseInt(storedCustomer.formData?.ownershipPercentage || "0", 10) || 0,
          annualRevenue: parseInt(storedCustomer.formData?.annualRevenue || "0", 10) || 0,
          fiscalYearEnd: storedCustomer.formData?.fiscalYearEnd || "—",
          streetAddress: storedCustomer.formData?.streetAddress || "—",
          city: storedCustomer.formData?.city || "—",
          state: storedCustomer.formData?.state || "—",
          zipCode: storedCustomer.formData?.zipCode || "—",
          country: storedCustomer.formData?.country || "United States",
        },
        guarantor: {
          name: storedCustomer.formData?.guarantorName || "—",
          idNumber: storedCustomer.formData?.guarantorIdNumber || "—",
          dob: storedCustomer.formData?.guarantorDOB || "—",
        },
        aiAssessment: {
          riskLevel: "medium" as const,
          summary: `Customer from application. ${storedCustomer.name} — ${storedCustomer.industry}.`,
          highlights: [],
          lastUpdated: new Date().toISOString(),
        },
        kpis: {
          totalRevenue: 0,
          activeApplications: 0,
          totalEquipment: 0,
          paymentStatus: "—",
          customerSince: "—",
          totalFunded: 0,
        },
        representatives: storedCustomer.formData?.contactName
          ? [{ id: "1", name: storedCustomer.formData.contactName, email: storedCustomer.formData.contactEmail || "", phone: storedCustomer.formData.contactPhone || "", role: "Primary Contact", joinDate: new Date().toISOString().split("T")[0] }]
          : [],
        applications: [],
        contracts: [],
        documents: [],
      }
    : companyData[id || "1"] || companyData["1"];

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

  const info = company.businessInfo;
  const guarantor = company.guarantor;
  const ai = company.aiAssessment;

  const getAppStatusBadge = (status: string) => {
    const map: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      unqualified: { variant: 'outline', label: 'Unqualified' },
      incomplete: { variant: 'secondary', label: 'Incomplete (NIGO)' },
      completed: { variant: 'secondary', label: 'Completed' },
      declined: { variant: 'destructive', label: 'Declined' },
      funded: { variant: 'default', label: 'Funded' },
    };
    const s = map[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  const getDocStatusIcon = (status: string) => {
    if (status === 'verified') return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (status === 'pending') return <Clock className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const riskColors: Record<string, string> = {
    low: 'text-green-700 bg-green-500/10 border-green-200',
    medium: 'text-amber-700 bg-amber-500/10 border-amber-200',
    high: 'text-red-700 bg-red-500/10 border-red-200',
  };

  const verifiedDocs = company.documents.filter((d: CompanyDocument) => d.status === 'verified').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link to="/customers" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Customers
      </Link>

      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xl font-bold">
                {company.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{company.name}</h1>
                <p className="text-muted-foreground">
                  {info.dba && `DBA: ${info.dba} · `}{info.entityType} · {company.industry}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={company.status === 'active' ? 'default' : 'destructive'}>
                    {company.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{info.ein}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium text-sm">{info.streetAddress}{info.suite && `, ${info.suite}`}</p>
                <p className="text-sm text-muted-foreground">{info.city}, {info.state} {info.zipCode}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Established</p>
                <p className="font-medium">{new Date(info.dateEstablished).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                <p className="text-xs text-muted-foreground">Client since {new Date(company.kpis.customerSince).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Annual Revenue</p>
                <p className="font-medium">${info.annualRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">FY ending {info.fiscalYearEnd}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="font-medium">{info.numberOfEmployees}</p>
                <p className="text-xs text-muted-foreground">{info.ownershipPercentage}% ownership</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[hsl(185,85%,50%)]/10">
                <Landmark className="w-6 h-6" style={{ color: 'hsl(185, 85%, 50%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Funded</p>
                <p className="text-2xl font-bold">${company.kpis.totalFunded.toLocaleString()}</p>
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
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">{company.applications.length}</p>
                <p className="text-xs text-muted-foreground">{company.kpis.activeApplications} active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[hsl(260,85%,60%)]/10">
                <FileText className="w-6 h-6" style={{ color: 'hsl(260, 85%, 60%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documents on File</p>
                <p className="text-2xl font-bold">{company.documents.length}</p>
                <p className="text-xs text-muted-foreground">{verifiedDocs} verified</p>
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

      {/* Accordion sections */}
      <Card>
        <CardContent className="pt-2 pb-2">
          <Accordion type="multiple" defaultValue={["applications"]}>

            {/* AI Assessment */}
            <AccordionItem value="ai-assessment">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>AI Client Assessment</span>
                  <Badge variant="outline" className={`text-[10px] capitalize ml-1 ${riskColors[ai.riskLevel]}`}>
                    {ai.riskLevel} risk
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{ai.summary}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {ai.highlights.map((h: AIHighlight) => (
                      <div key={h.label} className="flex items-center gap-2 text-sm">
                        {h.positive ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        )}
                        <span className="text-muted-foreground">{h.label}:</span>
                        <span className="font-medium">{h.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Last updated {new Date(ai.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Business Info */}
            <AccordionItem value="business-info">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span>Identity & Business Info</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    { label: 'Company Legal Name', value: company.name },
                    { label: 'DBA / Trade Name', value: info.dba },
                    { label: 'EIN / Tax ID', value: info.ein, mono: true },
                    { label: 'Entity Type', value: info.entityType },
                    { label: 'Date Established', value: new Date(info.dateEstablished).toLocaleDateString() },
                    { label: 'Industry / SIC Code', value: info.industryCode },
                    { label: 'Number of Employees', value: String(info.numberOfEmployees) },
                    { label: 'Ownership %', value: `${info.ownershipPercentage}%` },
                    { label: 'Street Address', value: `${info.streetAddress}${info.suite ? `, ${info.suite}` : ''}` },
                    { label: 'City / State / ZIP', value: `${info.city}, ${info.state} ${info.zipCode}` },
                  ].filter(f => f.value).map(f => (
                    <div key={f.label} className="flex items-baseline justify-between py-1 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">{f.label}</span>
                      <span className={`text-sm font-medium text-right ${f.mono ? 'font-mono' : ''}`}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Financials */}
            <AccordionItem value="financials">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span>Financial Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    { label: 'Annual Revenue (FY 2024)', value: `$${info.annualRevenue.toLocaleString()}` },
                    { label: 'Fiscal Year End', value: info.fiscalYearEnd },
                    { label: 'Total Revenue to Date', value: `$${company.kpis.totalRevenue.toLocaleString()}` },
                    { label: 'Total Funded', value: `$${company.kpis.totalFunded.toLocaleString()}` },
                  ].map(f => (
                    <div key={f.label} className="flex items-baseline justify-between py-1 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">{f.label}</span>
                      <span className="text-sm font-medium text-right">{f.value}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Guarantor */}
            <AccordionItem value="guarantor">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span>Guarantor</span>
                  <span className="text-muted-foreground font-normal text-sm ml-1">— {guarantor.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
                  {[
                    { label: 'Full Name', value: guarantor.name },
                    { label: 'ID Number', value: guarantor.idNumber, mono: true },
                    { label: 'Date of Birth', value: new Date(guarantor.dob).toLocaleDateString() },
                  ].map(f => (
                    <div key={f.label} className="flex items-baseline justify-between py-1 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">{f.label}</span>
                      <span className={`text-sm font-medium text-right ${f.mono ? 'font-mono' : ''}`}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Representatives */}
            <AccordionItem value="representatives">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>Representatives ({company.representatives.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center justify-end mb-3">
                  <AddRepresentativeDialog onAdd={handleAddRepresentative} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.representatives.map((rep: Representative) => (
                    <div key={rep.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {rep.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{rep.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{rep.role}</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                            <a href={`mailto:${rep.email}`} className="hover:underline truncate">{rep.email}</a>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                            <span>{rep.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Applications */}
            <AccordionItem value="applications">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span>Applications ({company.applications.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">ID</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Type</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Equipment</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Duration</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {company.applications.map((app: Application) => (
                        <tr key={app.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <Link to={`/applications/${app.id}`} className="font-medium text-sm hover:underline">{app.id}</Link>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-xs font-normal">{app.type}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{app.equipment}</span>
                            </div>
                            <span className="text-xs text-muted-foreground ml-6">{app.quantity} units</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {new Date(app.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                                {new Date(app.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {getAppStatusBadge(app.status)}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-sm">${app.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Documents */}
            <AccordionItem value="documents" className="border-b-0">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span>Documents ({company.documents.length})</span>
                  <span className="text-muted-foreground font-normal text-sm ml-1">— {verifiedDocs}/{company.documents.length} verified</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple">
                  {company.documents.map((doc: CompanyDocument, idx: number) => (
                    <AccordionItem key={doc.id} value={doc.id} className={idx === company.documents.length - 1 ? 'border-b-0' : ''}>
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                          {getDocStatusIcon(doc.status)}
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{doc.label}</span>
                              {doc.ocrConfidence && (
                                <Badge variant="outline" className="text-[10px] font-normal px-1.5 flex-shrink-0">
                                  <ScanSearch className="w-3 h-3 mr-0.5" />
                                  {doc.ocrConfidence}%
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                              <span>{doc.fileName}</span>
                              <span>{doc.fileSize}</span>
                              <span>via <Link to={`/applications/${doc.source}`} className="hover:underline" onClick={e => e.stopPropagation()}>{doc.source}</Link></span>
                              <span>{new Date(doc.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              <Download className="w-3.5 h-3.5 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-7 space-y-3">
                          {/* Extracted data */}
                          {doc.extractedData && Object.keys(doc.extractedData).length > 0 && (
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                                <ScanSearch className="w-3.5 h-3.5" />
                                Extracted Data (OCR)
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5">
                                {Object.entries(doc.extractedData).map(([key, value]) => (
                                  <div key={key} className="text-xs">
                                    <span className="text-muted-foreground">{key}:</span>
                                    <span className="ml-1 font-medium">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Verification notes */}
                          {doc.verificationNotes && doc.verificationNotes.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {doc.verificationNotes.map((note, nIdx) => (
                                <span key={nIdx} className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {note}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetail;
