import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import { AssistantProvider } from "./contexts/AssistantContext";
import { RBACProvider } from "./contexts/RBACContext";
import { BrandingProvider } from "./contexts/BrandingContext";
import ProtectedRoute from "./components/rbac/ProtectedRoute";

// Lazy-loaded page components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Companies = lazy(() => import("./pages/Companies"));
const CompanyDetail = lazy(() => import("./pages/CompanyDetail"));
const Applications = lazy(() => import("./pages/Applications"));
const ApplicationDetail = lazy(() => import("./pages/ApplicationDetail"));
const Contracts = lazy(() => import("./pages/Contracts"));
const ContractDetail = lazy(() => import("./pages/ContractDetail"));
const ContractCreate = lazy(() => import("./pages/ContractCreate"));
const CompanyCreate = lazy(() => import("./pages/CompanyCreate"));
const ApplicationCreate = lazy(() => import("./pages/ApplicationCreate"));
const Payments = lazy(() => import("./pages/Payments"));
const PaymentDetail = lazy(() => import("./pages/PaymentDetail"));
const Inventory = lazy(() => import("./pages/Inventory"));
const AssetDetail = lazy(() => import("./pages/AssetDetail"));
const InventoryDetail = lazy(() => import("./pages/InventoryDetail"));
const Merchants = lazy(() => import("./pages/Merchants"));
const MerchantDetail = lazy(() => import("./pages/MerchantDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutV2 = lazy(() => import("./pages/CheckoutV2"));
const ApplicationForm = lazy(() => import("./pages/UnifiedApplicationForm"));
const Automations = lazy(() => import("./pages/Automations"));
const AutomationCreate = lazy(() => import("./pages/AutomationCreate"));
const AutomationDetail = lazy(() => import("./pages/AutomationDetail"));
const AutomationEdit = lazy(() => import("./pages/AutomationEdit"));
const InboxPage = lazy(() => import("./pages/Inbox"));
const InboxExtract = lazy(() => import("./pages/InboxExtract"));
const InboxApplicationPage = lazy(() => import("./pages/InboxApplication"));
const InboxUploadPortal = lazy(() => import("./pages/InboxUploadPortal"));
const Settings = lazy(() => import("./pages/Settings"));
const Account = lazy(() => import("./pages/Account"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RBACProvider>
        <BrandingProvider>
        <AssistantProvider>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
        <Routes>
          <Route element={<PageLayout><ProtectedRoute resource="ai_assistant"><Index /></ProtectedRoute></PageLayout>} path="/" />
          <Route element={<PageLayout><ProtectedRoute resource="dashboard"><Dashboard /></ProtectedRoute></PageLayout>} path="/dashboard" />
          <Route element={<PageLayout><ProtectedRoute resource="customers"><Companies /></ProtectedRoute></PageLayout>} path="/customers" />
          <Route element={<PageLayout><ProtectedRoute resource="customers"><CompanyCreate /></ProtectedRoute></PageLayout>} path="/customers/new" />
          <Route element={<PageLayout><ProtectedRoute resource="customers"><CompanyDetail /></ProtectedRoute></PageLayout>} path="/customers/:id" />
          <Route element={<PageLayout><ProtectedRoute resource="applications"><Applications /></ProtectedRoute></PageLayout>} path="/applications" />
          <Route element={<PageLayout><ProtectedRoute resource="applications"><ApplicationCreate /></ProtectedRoute></PageLayout>} path="/applications/new" />
          <Route element={<PageLayout><ProtectedRoute resource="applications"><ApplicationDetail /></ProtectedRoute></PageLayout>} path="/applications/:id" />
          <Route element={<PageLayout><ProtectedRoute resource="contracts"><Contracts /></ProtectedRoute></PageLayout>} path="/contracts" />
          <Route element={<PageLayout><ProtectedRoute resource="contracts"><ContractCreate /></ProtectedRoute></PageLayout>} path="/contracts/new" />
          <Route element={<PageLayout><ProtectedRoute resource="contracts"><ContractDetail /></ProtectedRoute></PageLayout>} path="/contracts/:id" />
          <Route element={<PageLayout><ProtectedRoute resource="payments"><Payments /></ProtectedRoute></PageLayout>} path="/payments" />
          <Route element={<PageLayout><ProtectedRoute resource="payments"><PaymentDetail /></ProtectedRoute></PageLayout>} path="/payments/:id" />
          <Route element={<PageLayout><ProtectedRoute resource="assets"><Inventory /></ProtectedRoute></PageLayout>} path="/assets" />
          <Route element={<PageLayout><ProtectedRoute resource="assets"><AssetDetail /></ProtectedRoute></PageLayout>} path="/assets/:id" />
          <Route element={<PageLayout><ProtectedRoute resource="assets"><InventoryDetail /></ProtectedRoute></PageLayout>} path="/inventory/:id" />
          <Route element={<PageLayout><ProtectedRoute resource="merchants"><Merchants /></ProtectedRoute></PageLayout>} path="/merchants" />
          <Route element={<PageLayout><ProtectedRoute resource="merchants"><MerchantDetail /></ProtectedRoute></PageLayout>} path="/merchants/:id" />
          <Route element={<PageLayout><ProtectedRoute resource="checkout"><Checkout /></ProtectedRoute></PageLayout>} path="/checkout" />
          <Route element={<PageLayout><ProtectedRoute resource="checkout"><CheckoutV2 /></ProtectedRoute></PageLayout>} path="/checkout-v2" />
          <Route element={<PageLayout><ProtectedRoute resource="applications"><ApplicationForm /></ProtectedRoute></PageLayout>} path="/application" />
          <Route element={<PageLayout><ProtectedRoute resource="automations"><Automations /></ProtectedRoute></PageLayout>} path="/automations" />
          <Route element={<PageLayout><ProtectedRoute resource="automations"><AutomationCreate /></ProtectedRoute></PageLayout>} path="/automations/new" />
          <Route element={<PageLayout><ProtectedRoute resource="automations"><AutomationEdit /></ProtectedRoute></PageLayout>} path="/automations/:id/edit" />
          <Route element={<PageLayout><ProtectedRoute resource="automations"><AutomationDetail /></ProtectedRoute></PageLayout>} path="/automations/:id" />
          <Route element={<PageLayout><ProtectedRoute resource="inbox"><InboxPage /></ProtectedRoute></PageLayout>} path="/inbox" />
          <Route element={<PageLayout><ProtectedRoute resource="inbox"><InboxExtract /></ProtectedRoute></PageLayout>} path="/inbox/:emailId/extract" />
          <Route element={<PageLayout><ProtectedRoute resource="inbox"><InboxApplicationPage /></ProtectedRoute></PageLayout>} path="/inbox/application/:applicationId" />
          <Route element={<InboxUploadPortal />} path="/inbox/upload/:applicationId" />
          <Route element={<PageLayout><ProtectedRoute resource="settings"><Settings /></ProtectedRoute></PageLayout>} path="/settings" />
          <Route element={<PageLayout><ProtectedRoute resource="team"><Account /></ProtectedRoute></PageLayout>} path="/account" />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </AssistantProvider>
        </BrandingProvider>
        </RBACProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
