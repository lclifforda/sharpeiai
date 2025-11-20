import { NavLink } from "@/components/NavLink";
import { MessageSquare, LayoutDashboard, Building2, ShoppingCart, FileText, CreditCard, Package, Settings, LogOut, Headphones, Store } from "lucide-react";
import bbvaLogo from "@/assets/bbva-logo.png";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
const navigationItems = [{
  name: "AI Assistant",
  path: "/",
  icon: MessageSquare
}, {
  name: "Dashboard",
  path: "/dashboard",
  icon: LayoutDashboard
}, {
  name: "Companies",
  path: "/companies",
  icon: Building2
}, {
  name: "Merchants",
  path: "/merchants",
  icon: Store
}, {
  name: "Orders",
  path: "/orders",
  icon: ShoppingCart
}, {
  name: "Contracts",
  path: "/contracts",
  icon: FileText
}, {
  name: "Payments",
  path: "/payments",
  icon: CreditCard
}, {
  name: "Assets",
  path: "/assets",
  icon: Package
}];
export function AppSidebar() {
  const {
    open
  } = useSidebar();
  return <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-3 py-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={bbvaLogo} alt="BBVA" className="block w-full h-full object-contain" />
            </div>
            {open}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(item => <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.path} end={item.path === "/"} className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" activeClassName="bg-accent text-foreground font-medium">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {open && <div className="mx-3 mb-4">
            <div className="border border-border rounded-xl p-4 bg-muted/30 hover:bg-muted/50 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-foreground font-semibold text-sm">Need assistance?</h4>
                  <p className="text-muted-foreground text-xs">We're here to help</p>
                </div>
              </div>
              <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium py-2.5 px-3 rounded-lg transition-all duration-200 group-hover:shadow-minimal">
                Contact Support
              </button>
            </div>
          </div>}
        
        <div className="px-3 py-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-foreground font-medium text-xs">LC</span>
            </div>
            {open && <>
                <div className="flex-1 min-w-0">
                  <div className="text-foreground font-medium text-xs truncate">Lucia Clifford</div>
                  <div className="text-muted-foreground text-xs truncate">Administrator</div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-accent transition-colors" title="Settings">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-accent transition-colors" title="Logout">
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                </button>
              </>}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>;
}