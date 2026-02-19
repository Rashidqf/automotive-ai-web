import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCog,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ArrowLeft,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tab: string;
}

const dealershipNavItems: NavItem[] = [
  { icon: ClipboardList, label: "Car Service Bulletins", tab: "service-bulletins" },
  { icon: UserCog, label: "Team", tab: "employees" },
];

interface DealershipSidebarProps {
  dealershipName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function DealershipSidebar({ dealershipName, activeTab, onTabChange, onCollapsedChange }: DealershipSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  const handleLogout = () => {
    navigate("/auth");
  };

  const handleBackToDealerships = () => {
    navigate("/dealerships");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
          <img 
            src={logo} 
            alt="AppAutoAI Logo" 
            className="h-10 w-10 object-contain"
          />
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-foreground">Appauto<span className="text-accent">.ai</span></h1>
              <p className="text-xs text-muted-foreground truncate max-w-[140px]">{dealershipName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="p-3 border-b border-border">
        <button
          onClick={handleBackToDealerships}
          className={cn(
            "nav-item w-full text-muted-foreground hover:bg-secondary hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Back to Dealerships" : undefined}
        >
          <ArrowLeft className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="animate-fade-in">Back to Admin</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        <ul className="space-y-1">
          {dealershipNavItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <li key={item.tab}>
                <button
                  onClick={() => onTabChange(item.tab)}
                  className={cn(
                    "nav-item w-full",
                    isActive && "active",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-foreground")} />
                  {!collapsed && (
                    <span className="truncate animate-fade-in">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <button
          onClick={handleLogout}
          className={cn(
            "nav-item w-full text-destructive hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="animate-fade-in">Logout</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-2 flex w-full items-center justify-center rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-2 text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
