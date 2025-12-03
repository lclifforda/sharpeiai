import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import FloatingAIChat from "@/components/FloatingAIChat";
import sharpeiLogo from "@/assets/sharpei-logo.png";

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
          {/* Footer */}
          <footer className="border-t border-border bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center justify-center gap-2">
                <p className="text-xs text-muted-foreground/70">
                  Powered by
                </p>
                <img src={sharpeiLogo} alt="Sharpei AI" className="h-4 w-4 object-contain" />
                <p className="text-xs text-muted-foreground/70 font-medium">
                  Sharpei AI
                </p>
              </div>
            </div>
          </footer>
        </div>
        <FloatingAIChat />
      </div>
    </SidebarProvider>
  );
};

export default PageLayout;
