import { useState } from "react";
import { Users, Shield } from "lucide-react";
import TeamManagement from "@/components/rbac/TeamManagement";
import RoleManagement from "@/components/rbac/RoleManagement";

type SectionId = "team" | "roles";

const NAV_ITEMS: { id: SectionId; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
  { id: "team", label: "Team Members", icon: Users, description: "Manage user accounts & roles" },
  { id: "roles", label: "Roles", icon: Shield, description: "Predefined access levels" },
];

const Account = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("team");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero header */}
      <div className="border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(185,85%,50%)]/5 via-[hsl(220,90%,55%)]/5 to-[hsl(260,85%,60%)]/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[hsl(260,85%,60%)]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

        <div className="px-6 py-6 relative z-10">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Account</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your team and access controls
            </p>
          </div>
        </div>
      </div>

      {/* Body: sidebar nav + content */}
      <div className="flex">
        <nav className="w-60 flex-shrink-0 border-r bg-muted/30 min-h-[calc(100vh-200px)]">
          <div className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    active
                      ? "bg-card border shadow-subtle text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-foreground" : ""}`} />
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${active ? "font-medium" : ""}`}>{item.label}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="flex-1 p-6 max-w-4xl">
          {activeSection === "team" && <TeamManagement />}
          {activeSection === "roles" && <RoleManagement />}
        </div>
      </div>
    </div>
  );
};

export default Account;
