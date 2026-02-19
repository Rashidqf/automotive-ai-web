import { ReactNode, useState } from "react";
import { DealershipSidebar } from "./DealershipSidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

interface DealershipLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  dealershipName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DealershipLayout({ 
  children, 
  title, 
  subtitle, 
  dealershipName,
  activeTab,
  onTabChange 
}: DealershipLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DealershipSidebar 
        dealershipName={dealershipName} 
        activeTab={activeTab}
        onTabChange={onTabChange}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "pl-[72px]" : "pl-64"
      )}>
        <Header title={title} subtitle={subtitle} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
