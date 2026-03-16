import { ChevronsUpDown, LogOut, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRBAC } from "@/contexts/RBACContext";
import { useAuth } from "@/contexts/AuthContext";
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
  const { currentUser, currentRole } = useRBAC();
  const { logout } = useAuth();
  const { open } = useSidebar();
  const navigate = useNavigate();

  const colorClass = ROLE_COLORS[currentUser.roleId] ?? "bg-gray-100 text-gray-700";

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
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            <Badge variant="secondary" className={`text-[10px] font-normal px-1.5 py-0 mt-1 ${colorClass} border-0`}>
              {currentRole.name}
            </Badge>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/account")} className="cursor-pointer">
            <UserCog className="w-4 h-4 mr-2" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
