import { useRBAC } from "@/contexts/RBACContext";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export default function UserSwitcherBadge() {
  const { currentUser, currentRole } = useRBAC();

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border">
      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <span className="text-foreground font-medium text-[10px]">{currentUser.initials}</span>
      </div>
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="text-xs font-medium text-foreground">{currentUser.name}</span>
        <Badge variant="outline" className="text-[10px] font-normal px-1.5 py-0 gap-1">
          <Shield className="w-2.5 h-2.5" />
          {currentRole.name}
        </Badge>
      </div>
    </div>
  );
}
