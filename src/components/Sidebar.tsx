import { NavLink } from "@/components/NavLink";
import { MessageSquare, LayoutDashboard, Building2, ShoppingCart, FileText, CreditCard, Package, Sun } from "lucide-react";
import sharpeiLogo from "@/assets/sharpei-logo.png";

const navigationItems = [
  { name: "AI Assistant", path: "/", icon: MessageSquare },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Companies", path: "/companies", icon: Building2 },
  { name: "Orders", path: "/orders", icon: ShoppingCart },
  { name: "Contracts", path: "/contracts", icon: FileText },
  { name: "Payments", path: "/payments", icon: CreditCard },
  { name: "Inventory", path: "/inventory", icon: Package },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-sharpei flex items-center justify-center shadow-float overflow-hidden">
            <img 
              src={sharpeiLogo} 
              alt="Sharpei AI" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-semibold text-foreground text-xl">Sharpei AI</span>
        </div>
        <button className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
          <Sun className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
            activeClassName="bg-gradient-to-r from-gradient-start/10 to-gradient-pink/10 text-primary font-medium shadow-float"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full gradient-sharpei flex items-center justify-center shadow-float">
            <span className="text-white font-semibold text-lg">LC</span>
          </div>
          <div className="flex-1">
            <div className="text-foreground font-medium text-sm">Lucia Clifford</div>
            <div className="text-muted-foreground text-xs">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
