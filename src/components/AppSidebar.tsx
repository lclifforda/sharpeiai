import { NavLink } from "@/components/NavLink";
import { MessageSquare, LayoutDashboard, Building2, FileCheck, Settings, Store, BookOpen, HelpCircle, Smartphone, Zap } from "lucide-react";
import sharpeiLogo from "@/assets/sharpei-logo.webp";
import { useBranding } from "@/contexts/BrandingContext";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useRBAC } from "@/contexts/RBACContext";
import UserSwitcher from "@/components/rbac/UserSwitcher";
import type { Resource } from "@/types/rbac";

const previewItem = { name: "Checkout Preview", path: "/checkout", icon: Smartphone, resource: "checkout" as Resource };

const navigationItems: { name: string; path: string; icon: React.FC<{ className?: string }>; resource: Resource }[] = [{
  name: "AI Assistant",
  path: "/",
  icon: MessageSquare,
  resource: "ai_assistant",
}, {
  name: "Dashboard",
  path: "/dashboard",
  icon: LayoutDashboard,
  resource: "dashboard",
}, {
  name: "Applications",
  path: "/applications",
  icon: FileCheck,
  resource: "applications",
}, {
  name: "Customers",
  path: "/customers",
  icon: Building2,
  resource: "customers",
}, {
  name: "Vendors",
  path: "/merchants",
  icon: Store,
  resource: "merchants",
}, {
  name: "Automations",
  path: "/automations",
  icon: Zap,
  resource: "automations",
}, {
  name: "AI Setup",
  path: "/settings",
  icon: Settings,
  resource: "settings",
}];

export function AppSidebar() {
  const { open } = useSidebar();
  const { can } = useRBAC();
  const { logoSrc, branding } = useBranding();

  const visibleItems = navigationItems.filter((item) => can(item.resource, "view"));
  const showCheckout = can(previewItem.resource, "view");

  return <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader>
        <div className={`flex items-center py-6 ${open ? 'px-4' : 'px-3 justify-center'}`}>
          <div className={`flex items-center ${open ? 'gap-3 w-full' : 'justify-center'}`}>
            {open ? (
              <>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-16 h-8">
                    <img
                      src={logoSrc}
                      alt={branding.companyName || "Company logo"}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="border-l border-border/50 h-8" />
                  <div className="w-9 h-9 rounded-xl gradient-sharpei flex items-center justify-center overflow-hidden">
                    <img
                      src={sharpeiLogo}
                      alt="Sharpei AI"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
                <img
                  src={bbvaLogo}
                  alt="BBVA"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Preview Item - Visually Distinct */}
              {showCheckout && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={!open ? previewItem.name : undefined}>
                    <NavLink
                      to={previewItem.path}
                      className={`flex items-center gap-3 ${open ? 'px-3' : 'px-2 justify-center'} py-2.5 text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/20`}
                      activeClassName="bg-primary/15 text-primary font-medium border-primary/30"
                    >
                      <previewItem.icon className="w-5 h-5 flex-shrink-0" />
                      {open && <span className="text-sm font-medium">{previewItem.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Separator */}
              {showCheckout && (
                <div className="py-2">
                  <Separator />
                </div>
              )}

              {/* Regular Navigation Items */}
              {visibleItems.map(item => <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild tooltip={!open ? item.name : undefined}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className={`flex items-center gap-3 ${open ? 'px-3' : 'px-2 justify-center'} py-2.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors`}
                      activeClassName="bg-accent text-foreground font-medium"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {open && <span className="text-sm">{item.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {open && (
          <div className="px-3 py-2 space-y-1 border-b border-border pb-4">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              <span>How does Sharpei work?</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span>Feedback</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <span>Help & Docs</span>
            </button>
          </div>
        )}

        <UserSwitcher />
      </SidebarFooter>
    </Sidebar>;
}
