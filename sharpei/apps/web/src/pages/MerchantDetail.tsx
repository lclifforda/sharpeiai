import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, MoreVertical, Edit, Mail, Check, X, Loader2 } from "lucide-react";
import { useVendor } from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

const MerchantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: vendorData, isLoading, isError } = useVendor(id!);

  const vendor = {
    id: vendorData?.id ?? id,
    name: vendorData?.name ?? "",
    website: "",
    status: vendorData?.status ?? "pending",
    enrolledDate: vendorData?.created_at
      ? new Date(vendorData.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "---",
    contactName: "---",
    contactRole: "---",
    contactPhone: "---",
    contactEmail: vendorData?.contact_email ?? "---",
    address: "---",
    referralLink: "",
    integrationMethod: "---",
    applications: [] as { id: string; customer: string; amount: string; status: string; date: string }[],
  };

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: vendor.name,
    website: vendor.website,
    status: vendor.status,
    contactName: vendor.contactName,
    contactRole: vendor.contactRole,
    contactPhone: vendor.contactPhone,
    contactEmail: vendor.contactEmail,
    address: vendor.address,
    integrationMethod: vendor.integrationMethod,
  });

  const openEdit = () => {
    setEditForm({
      name: vendor.name,
      website: vendor.website,
      status: vendor.status,
      contactName: vendor.contactName,
      contactRole: vendor.contactRole,
      contactPhone: vendor.contactPhone,
      contactEmail: vendor.contactEmail,
      address: vendor.address,
      integrationMethod: vendor.integrationMethod,
    });
    setEditOpen(true);
  };

  const handleSave = () => {
    // TODO: integrate useUpdateVendor mutation
    setEditOpen(false);
    toast({
      title: "Vendor updated",
      description: "Changes have been saved successfully.",
    });
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

  const getAppStatusBadge = (status: string) => {
    switch (status) {
      case "unqualified":
        return <Badge className="bg-muted text-muted-foreground">Unqualified</Badge>;
      case "incomplete":
        return <Badge className="bg-amber-500/10 text-amber-700 border border-amber-200">Incomplete (NIGO)</Badge>;
      case "completed":
        return <Badge className="bg-blue-500/10 text-blue-700 border border-blue-200">Completed</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      case "funded":
        return <Badge className="bg-success text-success-foreground">Funded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSendMessage = () => {
    toast({
      title: "Send Message",
      description: "Opening message composer...",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !vendorData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">Failed to load vendor details.</p>
          <Button variant="outline" onClick={() => navigate("/merchants")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/merchants")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate("/merchants")} className="cursor-pointer">
                  Vendors
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">{vendor.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={openEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSendMessage} className="cursor-pointer">
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Vendor Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {vendor.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{vendor.name}</h2>
                {getStatusBadge(vendor.status)}
              </div>
              <a
                href={`https://${vendor.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                {vendor.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Details */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Contact Name</p>
              <p className="font-medium">{vendor.contactName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium">{vendor.contactRole}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{vendor.contactEmail}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{vendor.contactPhone}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">{vendor.address}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Enrolled Date</p>
              <p className="font-medium">{vendor.enrolledDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Integration Method</p>
              <p className="font-medium">{vendor.integrationMethod}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Referral Link</p>
              <p className="font-medium font-mono text-sm">{vendor.referralLink}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Related Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {vendor.applications.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No applications yet</p>
          ) : (
            <div className="space-y-3">
              {vendor.applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{app.customer}</p>
                      <p className="text-sm text-muted-foreground font-mono">{app.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">{app.amount}</p>
                    <p className="text-sm text-muted-foreground">{app.date}</p>
                    {getAppStatusBadge(app.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Vendor</SheetTitle>
            <SheetDescription>Update vendor information. Click save when you're done.</SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* General */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">General</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Vendor Name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-website">Website</Label>
                  <Input
                    id="edit-website"
                    value={editForm.website}
                    onChange={(e) => setEditForm((p) => ({ ...p, website: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(val) => setEditForm((p) => ({ ...p, status: val }))}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Contact</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-contact-name">Contact Name</Label>
                  <Input
                    id="edit-contact-name"
                    value={editForm.contactName}
                    onChange={(e) => setEditForm((p) => ({ ...p, contactName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contact-role">Role</Label>
                  <Input
                    id="edit-contact-role"
                    value={editForm.contactRole}
                    onChange={(e) => setEditForm((p) => ({ ...p, contactRole: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editForm.contactEmail}
                      onChange={(e) => setEditForm((p) => ({ ...p, contactEmail: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      type="tel"
                      value={editForm.contactPhone}
                      onChange={(e) => setEditForm((p) => ({ ...p, contactPhone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input
                    id="edit-address"
                    value={editForm.address}
                    onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Integration */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Integration</h4>
              <div className="space-y-2">
                <Label htmlFor="edit-integration">Integration Method</Label>
                <Select
                  value={editForm.integrationMethod}
                  onValueChange={(val) => setEditForm((p) => ({ ...p, integrationMethod: val }))}
                >
                  <SelectTrigger id="edit-integration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website embed">Website embed</SelectItem>
                    <SelectItem value="API integration">API integration</SelectItem>
                    <SelectItem value="Referral link">Referral link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MerchantDetail;
