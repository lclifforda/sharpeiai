import { NavLink } from "@/components/NavLink";
import { MessageSquare, LayoutDashboard, Building2, ShoppingCart, FileText, CreditCard, Layers, Settings, LogOut } from "lucide-react";
import sharpeiLogo from "@/assets/sharpei-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { name: "AI Assistant", path: "/", icon: MessageSquare },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Companies", path: "/companies", icon: Building2 },
  { name: "Orders", path: "/orders", icon: ShoppingCart },
  { name: "Contracts", path: "/contracts", icon: FileText },
  { name: "Payments", path: "/payments", icon: CreditCard },
  { name: "Assets", path: "/assets", icon: Layers },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-3 py-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-primary/90 flex items-center justify-center flex-shrink-0 p-1 overflow-visible">
              <img 
                src={sharpeiLogo} 
                alt="Sharpei AI" 
                className="block w-full h-full object-contain"
              />
            </div>
            {open && <span className="font-medium text-foreground">Sharpei AI</span>}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      activeClassName="bg-accent text-foreground font-medium"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-foreground font-medium text-xs">LC</span>
            </div>
            {open && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-foreground font-medium text-xs truncate">Lucia Clifford</div>
                  <div className="text-muted-foreground text-xs truncate">Administrator</div>
                </div>
                <button 
                  className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </button>
                <button 
                  className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                </button>
              </>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
