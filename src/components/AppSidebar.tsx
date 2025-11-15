import { NavLink } from "@/components/NavLink";
import { MessageSquare, LayoutDashboard, Building2, ShoppingCart, FileText, CreditCard, Package, Sun } from "lucide-react";
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
  { name: "Inventory", path: "/inventory", icon: Package },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-sharpei flex items-center justify-center shadow-float overflow-hidden flex-shrink-0">
              <img 
                src={sharpeiLogo} 
                alt="Sharpei AI" 
                className="w-full h-full object-cover"
              />
            </div>
            {open && <span className="font-semibold text-foreground text-xl">Sharpei AI</span>}
          </div>
          {open && (
            <button className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <Sun className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
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
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
                      activeClassName="bg-gradient-to-r from-gradient-start/10 to-gradient-purple/10 text-primary font-medium shadow-float"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full gradient-sharpei flex items-center justify-center shadow-float flex-shrink-0">
              <span className="text-white font-semibold text-sm">LC</span>
            </div>
            {open && (
              <div className="flex-1 min-w-0">
                <div className="text-foreground font-medium text-sm truncate">Lucia Clifford</div>
                <div className="text-muted-foreground text-xs truncate">Administrator</div>
              </div>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
