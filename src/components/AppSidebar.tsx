import { NavLink } from "@/components/NavLink";
import { MessageSquare, LayoutDashboard, Building2, ShoppingCart, FileText, CreditCard, Package, Settings, LogOut, Headphones, Store, BookOpen, HelpCircle, Mail, Smartphone } from "lucide-react";
import ilsLogo from "@/assets/ils-logo.png";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

const getNavigationItems = (t: (key: string) => string) => [
  { name: t("nav.aiAssistant"), path: "/", icon: MessageSquare },
  { name: t("nav.dashboard"), path: "/dashboard", icon: LayoutDashboard },
  { name: t("nav.companies"), path: "/companies", icon: Building2 },
  { name: t("nav.merchants"), path: "/merchants", icon: Store },
  { name: t("nav.orders"), path: "/orders", icon: ShoppingCart },
  { name: t("nav.contracts"), path: "/contracts", icon: FileText },
  { name: t("nav.payments"), path: "/payments", icon: CreditCard },
  { name: t("nav.assets"), path: "/assets", icon: Package },
];
export function AppSidebar() {
  const { open } = useSidebar();
  const { t } = useTranslation();
  
  const previewItem = {
    name: t("nav.checkoutPreview"),
    path: "/checkout",
    icon: Smartphone
  };
  
  const navigationItems = getNavigationItems(t);
  return <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader>
        <div className={`flex items-center py-6 ${open ? 'px-4' : 'px-3 justify-center'}`}>
          <div className={`flex items-center ${open ? 'gap-3 w-full' : 'justify-center'}`}>
            {open ? (
              <>
                <div className="flex-shrink-0 h-10">
                  <img 
                    src={ilsLogo} 
                    alt="Innovative Lease Services" 
                    className="h-full object-contain"
                  />
                </div>
                <div className="border-l border-border/50 h-8 ml-1" />
              </>
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
                <img 
                  src={ilsLogo} 
                  alt="ILS" 
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
              <span>{t("nav.howDoesSharpeiWork")}</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span>{t("nav.feedback")}</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <span>{t("nav.helpDocs")}</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>{t("nav.contactSupport")}</span>
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
                  <div className="text-muted-foreground text-xs truncate">{t("nav.administrator")}</div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-accent transition-colors" title={t("nav.settings")}>
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-accent transition-colors" title={t("nav.logout")}>
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                </button>
              </>}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>;
}