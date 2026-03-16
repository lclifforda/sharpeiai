import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers, useInviteUser, useUpdateUser, useDeleteUser } from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Users, Loader2 } from "lucide-react";

interface ApiUser {
  id: string;
  org_id: string;
  email: string;
  name: string;
  role: string;
  vendor_id: string | null;
  created_at: string;
}

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  manager: "bg-blue-100 text-blue-700 border-blue-200",
  viewer: "bg-amber-100 text-amber-700 border-amber-200",
  vendor: "bg-green-100 text-green-700 border-green-200",
};

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "viewer", label: "Viewer" },
  { value: "vendor", label: "Vendor" },
];

interface InviteFormData {
  email: string;
  role: string;
  vendor_id: string;
}

interface EditFormData {
  name: string;
  email: string;
  role: string;
  vendor_id: string;
}

const EMPTY_INVITE: InviteFormData = { email: "", role: "", vendor_id: "" };
const EMPTY_EDIT: EditFormData = { name: "", email: "", role: "", vendor_id: "" };

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TeamManagement() {
  const { user: currentUser } = useAuth();
  const { data: users = [], isLoading } = useUsers();
  const inviteUser = useInviteUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const { toast } = useToast();

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inviteForm, setInviteForm] = useState<InviteFormData>(EMPTY_INVITE);
  const [editForm, setEditForm] = useState<EditFormData>(EMPTY_EDIT);

  const openInvite = () => {
    setInviteForm(EMPTY_INVITE);
    setInviteDialogOpen(true);
  };

  const openEdit = (user: ApiUser) => {
    setEditingId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      vendor_id: user.vendor_id ?? "",
    });
    setEditDialogOpen(true);
  };

  const handleInvite = () => {
    if (!inviteForm.email || !inviteForm.role) {
      toast({ title: "Missing fields", description: "Email and role are required.", variant: "destructive" });
      return;
    }
    inviteUser.mutate(
      {
        email: inviteForm.email,
        role: inviteForm.role,
        ...(inviteForm.vendor_id ? { vendor_id: inviteForm.vendor_id } : {}),
      },
      {
        onSuccess: () => {
          toast({ title: "Invite sent", description: `Invitation sent to ${inviteForm.email}.` });
          setInviteDialogOpen(false);
        },
        onError: (err: any) => {
          toast({ title: "Invite failed", description: err?.response?.data?.error ?? err.message, variant: "destructive" });
        },
      }
    );
  };

  const handleUpdate = () => {
    if (!editingId || !editForm.name || !editForm.role) {
      toast({ title: "Missing fields", description: "Name and role are required.", variant: "destructive" });
      return;
    }
    updateUser.mutate(
      {
        id: editingId,
        name: editForm.name,
        role: editForm.role,
        ...(editForm.vendor_id ? { vendor_id: editForm.vendor_id } : { vendor_id: null }),
      },
      {
        onSuccess: () => {
          toast({ title: "User updated", description: `${editForm.name} has been updated.` });
          setEditDialogOpen(false);
        },
        onError: (err: any) => {
          toast({ title: "Update failed", description: err?.response?.data?.error ?? err.message, variant: "destructive" });
        },
      }
    );
  };

  const handleDelete = (user: ApiUser) => {
    if (user.id === currentUser?.id) {
      toast({ title: "Cannot delete", description: "You cannot remove your own account.", variant: "destructive" });
      return;
    }
    deleteUser.mutate(user.id, {
      onSuccess: () => {
        toast({ title: "User removed", description: `${user.name} has been removed.` });
      },
      onError: (err: any) => {
        toast({ title: "Delete failed", description: err?.response?.data?.error ?? err.message, variant: "destructive" });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            Team Members
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Manage user accounts and assign roles.</p>
        </div>
        <Button onClick={openInvite} className="gap-2">
          <Plus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Vendor Scope</th>
              <th className="px-4 py-3 font-medium text-muted-foreground w-24"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Loading team members...</p>
                </td>
              </tr>
            ) : (users as ApiUser[]).length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No team members found. Invite someone to get started.
                </td>
              </tr>
            ) : (
              (users as ApiUser[]).map((user, idx) => {
                const colorClass = ROLE_COLORS[user.role] ?? "bg-gray-100 text-gray-700 border-gray-200";
                const isSelf = user.id === currentUser?.id;
                return (
                  <tr key={user.id} className={idx % 2 === 1 ? "bg-muted/10" : ""}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <span className="text-foreground font-medium text-xs">{getInitials(user.name)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{user.name}</span>
                          {isSelf && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">you</Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs font-normal px-2 py-0.5 capitalize ${colorClass}`}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {user.vendor_id ?? "All"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                          disabled={isSelf}
                        >
                          <Trash2 className={`w-3.5 h-3.5 ${isSelf ? "opacity-30" : ""}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Invite dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                placeholder="email@company.com"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteForm.role} onValueChange={(v) => setInviteForm({ ...inviteForm, role: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vendor ID</Label>
              <Input
                value={inviteForm.vendor_id}
                onChange={(e) => setInviteForm({ ...inviteForm, vendor_id: e.target.value })}
                placeholder="Optional - leave empty for all vendors"
              />
              <p className="text-xs text-muted-foreground">Only relevant for Vendor role. Limits data access to this vendor.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={inviteUser.isPending}>
              {inviteUser.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Send Invite"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={editForm.email}
                disabled
                className="opacity-60"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={editForm.role} onValueChange={(v) => setEditForm({ ...editForm, role: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vendor ID</Label>
              <Input
                value={editForm.vendor_id}
                onChange={(e) => setEditForm({ ...editForm, vendor_id: e.target.value })}
                placeholder="Optional - leave empty for all vendors"
              />
              <p className="text-xs text-muted-foreground">Only relevant for Vendor role. Limits data access to this vendor.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateUser.isPending}>
              {updateUser.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
