import { NavLink } from "@/components/NavLink";
import { MessageSquare, LayoutDashboard, Building2, ShoppingCart, FileText, CreditCard, Package, Sun } from "lucide-react";

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
    <aside className="w-64 bg-[#1a1d2e] border-r border-[#2a2d3e] flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between border-b border-[#2a2d3e]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-sharpei flex items-center justify-center shadow-float">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-[#5b7cff] font-semibold text-xl">Sharpei AI</span>
        </div>
        <button className="p-2 rounded-lg bg-[#2a2d3e] hover:bg-[#3a3d4e] transition-colors">
          <Sun className="w-5 h-5 text-[#5b7cff]" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#8b92b0] hover:bg-[#2a2d3e] transition-all duration-200"
            activeClassName="bg-gradient-to-r from-[#5b7cff]/20 to-[#7c3aed]/20 text-[#5b7cff] font-medium"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[#2a2d3e]">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#2a2d3e] transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5b7cff] to-[#7c3aed] flex items-center justify-center shadow-float">
            <span className="text-white font-semibold text-lg">LC</span>
          </div>
          <div className="flex-1">
            <div className="text-white font-medium text-sm">Lucia Clifford</div>
            <div className="text-[#8b92b0] text-xs">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
