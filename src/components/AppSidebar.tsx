import { NavLink } from "@/components/NavLink";
import { MessageSquare, LayoutDashboard, Building2, ShoppingCart, FileText, CreditCard, Package, Settings, LogOut, Headphones, Store, BookOpen, HelpCircle, Mail, Smartphone } from "lucide-react";
import bbvaLogo from "@/assets/bbva-logo.png";
import sharpeiLogo from "@/assets/sharpei-logo.png";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
const previewItem = {
  name: "Checkout Preview",
  path: "/checkout",
  icon: Smartphone
};

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
  return <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader>
        <div className={`flex items-center py-6 ${open ? 'px-4' : 'px-3 justify-center'}`}>
          <div className={`flex items-center ${open ? 'gap-3 w-full' : 'justify-center'}`}>
            {open ? (
              <>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-16 h-8">
                    <img 
                      src={bbvaLogo} 
                      alt="BBVA" 
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
              
              {/* Separator */}
              <div className="py-2">
                <Separator />
              </div>

              {/* Regular Navigation Items */}
              {navigationItems.map(item => <SidebarMenuItem key={item.path}>
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
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>Contact Support</span>
            </button>
          </div>
        )}
        
        <div className={`${open ? 'px-3 py-4' : 'px-2 py-4 flex justify-center'}`}>
          <div className={`flex items-center ${open ? 'gap-3' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-muted/80 transition-colors">
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