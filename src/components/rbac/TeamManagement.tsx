import { useState } from "react";
import { useRBAC } from "@/contexts/RBACContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import type { UserAccount } from "@/types/rbac";

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700 border-purple-200",
  ops_manager: "bg-blue-100 text-blue-700 border-blue-200",
  credit_analyst: "bg-amber-100 text-amber-700 border-amber-200",
  vendor_portal: "bg-green-100 text-green-700 border-green-200",
  readonly_auditor: "bg-gray-100 text-gray-700 border-gray-200",
};

interface FormData {
  name: string;
  email: string;
  initials: string;
  roleId: string;
  vendorIds: string;
}

const EMPTY_FORM: FormData = { name: "", email: "", initials: "", roleId: "", vendorIds: "" };

export default function TeamManagement() {
  const { state, addUser, updateUser, removeUser } = useRBAC();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (user: UserAccount) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      initials: user.initials,
      roleId: user.roleId,
      vendorIds: user.vendorIds.join(", "),
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.roleId) {
      toast({ title: "Missing fields", description: "Name, email, and role are required.", variant: "destructive" });
      return;
    }
    const vendorIds = form.vendorIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const initials =
      form.initials ||
      form.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    if (editingId) {
      updateUser(editingId, { name: form.name, email: form.email, initials, roleId: form.roleId, vendorIds });
      toast({ title: "User updated", description: `${form.name} has been updated.` });
    } else {
      const id = `user_${Date.now()}`;
      addUser({ id, name: form.name, email: form.email, initials, roleId: form.roleId, vendorIds, isSystem: false });
      toast({ title: "User added", description: `${form.name} has been added.` });
    }
    setDialogOpen(false);
  };

  const handleDelete = (user: UserAccount) => {
    if (user.isSystem) {
      toast({ title: "Cannot delete", description: "System demo users cannot be removed.", variant: "destructive" });
      return;
    }
    removeUser(user.id);
    toast({ title: "User removed", description: `${user.name} has been removed.` });
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
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Member
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
            {state.users.map((user, idx) => {
              const role = state.roles.find((r) => r.id === user.roleId);
              const colorClass = ROLE_COLORS[user.roleId] ?? "bg-gray-100 text-gray-700 border-gray-200";
              return (
                <tr key={user.id} className={idx % 2 === 1 ? "bg-muted/10" : ""}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <span className="text-foreground font-medium text-xs">{user.initials}</span>
                      </div>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs font-normal px-2 py-0.5 ${colorClass}`}>
                      {role?.name ?? "Unknown"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {user.vendorIds.length > 0 ? user.vendorIds.join(", ") : "All"}
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
                        disabled={user.isSystem}
                      >
                        <Trash2 className={`w-3.5 h-3.5 ${user.isSystem ? "opacity-30" : ""}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@company.com"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label>Initials</Label>
              <Input
                value={form.initials}
                onChange={(e) => setForm({ ...form, initials: e.target.value.toUpperCase().slice(0, 2) })}
                placeholder="Auto-generated from name"
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.roleId} onValueChange={(v) => setForm({ ...form, roleId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {state.roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vendor Scope IDs</Label>
              <Input
                value={form.vendorIds}
                onChange={(e) => setForm({ ...form, vendorIds: e.target.value })}
                placeholder="Comma-separated vendor IDs (leave empty for all)"
              />
              <p className="text-xs text-muted-foreground">Only relevant for Vendor Portal role. Limits data access to these vendors.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingId ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
