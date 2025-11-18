import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import Orders from "./pages/Orders";
import Contracts from "./pages/Contracts";
import Payments from "./pages/Payments";
import Inventory from "./pages/Inventory";
import AssetDetail from "./pages/AssetDetail";
import Merchants from "./pages/Merchants";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<PageLayout><Index /></PageLayout>} path="/" />
          <Route element={<PageLayout><Dashboard /></PageLayout>} path="/dashboard" />
          <Route element={<PageLayout><Companies /></PageLayout>} path="/companies" />
          <Route element={<PageLayout><Orders /></PageLayout>} path="/orders" />
          <Route element={<PageLayout><Contracts /></PageLayout>} path="/contracts" />
          <Route element={<PageLayout><Payments /></PageLayout>} path="/payments" />
          <Route element={<PageLayout><Inventory /></PageLayout>} path="/assets" />
          <Route element={<PageLayout><AssetDetail /></PageLayout>} path="/assets/:id" />
          <Route element={<PageLayout><Merchants /></PageLayout>} path="/merchants" />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
