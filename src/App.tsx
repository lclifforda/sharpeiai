import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Contracts from "./pages/Contracts";
import ContractDetail from "./pages/ContractDetail";
import ContractCreate from "./pages/ContractCreate";
import Payments from "./pages/Payments";
import Inventory from "./pages/Inventory";
import AssetDetail from "./pages/AssetDetail";
import InventoryDetail from "./pages/InventoryDetail";
import Merchants from "./pages/Merchants";
import MerchantDetail from "./pages/MerchantDetail";
import Checkout from "./pages/Checkout";
import CheckoutV2 from "./pages/CheckoutV2";
import ApplicationForm from "./pages/ApplicationForm";
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
          <Route element={<PageLayout><CompanyDetail /></PageLayout>} path="/companies/:id" />
          <Route element={<PageLayout><Orders /></PageLayout>} path="/orders" />
          <Route element={<PageLayout><OrderDetail /></PageLayout>} path="/orders/:id" />
          <Route element={<PageLayout><Contracts /></PageLayout>} path="/contracts" />
          <Route element={<PageLayout><ContractCreate /></PageLayout>} path="/contracts/new" />
          <Route element={<PageLayout><ContractDetail /></PageLayout>} path="/contracts/:id" />
          <Route element={<PageLayout><Payments /></PageLayout>} path="/payments" />
          <Route element={<PageLayout><Inventory /></PageLayout>} path="/assets" />
          <Route element={<PageLayout><AssetDetail /></PageLayout>} path="/assets/:id" />
          <Route element={<PageLayout><InventoryDetail /></PageLayout>} path="/inventory/:id" />
          <Route element={<PageLayout><Merchants /></PageLayout>} path="/merchants" />
          <Route element={<PageLayout><MerchantDetail /></PageLayout>} path="/merchants/:id" />
          <Route element={<PageLayout><Checkout /></PageLayout>} path="/checkout" />
          <Route element={<PageLayout><CheckoutV2 /></PageLayout>} path="/checkout-v2" />
          <Route element={<PageLayout><ApplicationForm /></PageLayout>} path="/application" />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
