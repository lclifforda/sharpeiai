import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import FloatingAIChat from "@/components/FloatingAIChat";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full">
          <header className="h-14 flex items-center border-b border-border bg-white sticky top-0 z-10">
            <SidebarTrigger className="ml-4" />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        <FloatingAIChat />
      </div>
    </SidebarProvider>
  );
};

export default PageLayout;
