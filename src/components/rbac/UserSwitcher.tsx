import { Check, ChevronsUpDown, RotateCcw, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRBAC } from "@/contexts/RBACContext";
import { useToast } from "@/hooks/use-toast";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  ops_manager: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  credit_analyst: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  vendor_portal: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  readonly_auditor: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
};

export default function UserSwitcher() {
  const { state, currentUser, currentRole, switchUser, resetToDefaults } = useRBAC();
  const { toast } = useToast();
  const { open } = useSidebar();
  const navigate = useNavigate();

  const handleSwitch = (userId: string) => {
    if (userId === currentUser.id) return;
    const user = state.users.find((u) => u.id === userId);
    const role = state.roles.find((r) => r.id === user?.roleId);
    switchUser(userId);
    toast({
      title: `Switched to ${user?.name}`,
      description: `Now viewing as ${role?.name ?? "Unknown Role"}`,
    });
  };

  return (
    <div className={`${open ? "px-3 py-4" : "px-2 py-4 flex justify-center"}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={`flex items-center ${open ? "gap-3 w-full" : ""} hover:bg-accent rounded-lg p-1.5 transition-colors`}>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-foreground font-medium text-xs">{currentUser.initials}</span>
            </div>
            {open && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-foreground font-medium text-xs truncate">{currentUser.name}</div>
                  <div className="text-muted-foreground text-xs truncate">{currentRole.name}</div>
                </div>
                <ChevronsUpDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72" side="top" sideOffset={8}>
          <div className="px-2 py-1.5">
            <p className="text-xs font-medium text-muted-foreground">Switch Demo User</p>
          </div>
          {state.users.map((user) => {
            const role = state.roles.find((r) => r.id === user.roleId);
            const isActive = user.id === currentUser.id;
            const colorClass = ROLE_COLORS[user.roleId] ?? "bg-gray-100 text-gray-700";
            return (
              <DropdownMenuItem
                key={user.id}
                onClick={() => handleSwitch(user.id)}
                className="flex items-center gap-3 py-2.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-foreground font-medium text-xs">{user.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user.name}</div>
                  <Badge variant="secondary" className={`text-[10px] font-normal px-1.5 py-0 mt-0.5 ${colorClass} border-0`}>
                    {role?.name ?? "Unknown"}
                  </Badge>
                </div>
                {isActive && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/account")} className="cursor-pointer">
            <UserCog className="w-4 h-4 mr-2" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={resetToDefaults} className="text-muted-foreground cursor-pointer">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to defaults
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
