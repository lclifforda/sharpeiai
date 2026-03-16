import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { AssistantProvider } from "./contexts/AssistantContext";
import { RBACProvider } from "./contexts/RBACContext";
import { BrandingProvider } from "./contexts/BrandingContext";
import { ProtectedRoute as AuthProtectedRoute } from "./components/ProtectedRoute";
import RBACProtectedRoute from "./components/rbac/ProtectedRoute";

// Lazy-loaded page components for code splitting
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
const Settings = lazy(() => import("./pages/Settings"));
const Account = lazy(() => import("./pages/Account"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AcceptInvite = lazy(() => import("./pages/AcceptInvite"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

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
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
        <RBACProvider>
        <BrandingProvider>
        <AssistantProvider>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
        <Routes>
          {/* Public routes (no auth required) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes (auth required) */}
          <Route element={<AuthProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<PageLayout><RBACProtectedRoute resource="dashboard"><Dashboard /></RBACProtectedRoute></PageLayout>} path="/dashboard" />
            <Route element={<PageLayout><RBACProtectedRoute resource="customers"><Companies /></RBACProtectedRoute></PageLayout>} path="/customers" />
            <Route element={<PageLayout><RBACProtectedRoute resource="customers"><CompanyCreate /></RBACProtectedRoute></PageLayout>} path="/customers/new" />
            <Route element={<PageLayout><RBACProtectedRoute resource="customers"><CompanyDetail /></RBACProtectedRoute></PageLayout>} path="/customers/:id" />
            <Route element={<PageLayout><RBACProtectedRoute resource="applications"><Applications /></RBACProtectedRoute></PageLayout>} path="/applications" />
            <Route element={<PageLayout><RBACProtectedRoute resource="applications"><ApplicationCreate /></RBACProtectedRoute></PageLayout>} path="/applications/new" />
            <Route element={<PageLayout><RBACProtectedRoute resource="applications"><ApplicationDetail /></RBACProtectedRoute></PageLayout>} path="/applications/:id" />
            <Route element={<PageLayout><RBACProtectedRoute resource="contracts"><Contracts /></RBACProtectedRoute></PageLayout>} path="/contracts" />
            <Route element={<PageLayout><RBACProtectedRoute resource="contracts"><ContractCreate /></RBACProtectedRoute></PageLayout>} path="/contracts/new" />
            <Route element={<PageLayout><RBACProtectedRoute resource="contracts"><ContractDetail /></RBACProtectedRoute></PageLayout>} path="/contracts/:id" />
            <Route element={<PageLayout><RBACProtectedRoute resource="payments"><Payments /></RBACProtectedRoute></PageLayout>} path="/payments" />
            <Route element={<PageLayout><RBACProtectedRoute resource="payments"><PaymentDetail /></RBACProtectedRoute></PageLayout>} path="/payments/:id" />
            <Route element={<PageLayout><RBACProtectedRoute resource="assets"><Inventory /></RBACProtectedRoute></PageLayout>} path="/assets" />
            <Route element={<PageLayout><RBACProtectedRoute resource="assets"><AssetDetail /></RBACProtectedRoute></PageLayout>} path="/assets/:id" />
            <Route element={<PageLayout><RBACProtectedRoute resource="assets"><InventoryDetail /></RBACProtectedRoute></PageLayout>} path="/inventory/:id" />
            <Route element={<PageLayout><RBACProtectedRoute resource="merchants"><Merchants /></RBACProtectedRoute></PageLayout>} path="/merchants" />
            <Route element={<PageLayout><RBACProtectedRoute resource="merchants"><MerchantDetail /></RBACProtectedRoute></PageLayout>} path="/merchants/:id" />
            <Route element={<PageLayout><RBACProtectedRoute resource="checkout"><Checkout /></RBACProtectedRoute></PageLayout>} path="/checkout" />
            <Route element={<PageLayout><RBACProtectedRoute resource="checkout"><CheckoutV2 /></RBACProtectedRoute></PageLayout>} path="/checkout-v2" />
            <Route element={<PageLayout><RBACProtectedRoute resource="applications"><ApplicationForm /></RBACProtectedRoute></PageLayout>} path="/application" />
            <Route element={<PageLayout><RBACProtectedRoute resource="automations"><Automations /></RBACProtectedRoute></PageLayout>} path="/automations" />
            <Route element={<PageLayout><RBACProtectedRoute resource="automations"><AutomationCreate /></RBACProtectedRoute></PageLayout>} path="/automations/new" />
            <Route element={<PageLayout><RBACProtectedRoute resource="automations"><AutomationEdit /></RBACProtectedRoute></PageLayout>} path="/automations/:id/edit" />
            <Route element={<PageLayout><RBACProtectedRoute resource="automations"><AutomationDetail /></RBACProtectedRoute></PageLayout>} path="/automations/:id" />
            <Route element={<PageLayout><RBACProtectedRoute resource="settings"><Settings /></RBACProtectedRoute></PageLayout>} path="/settings" />
            <Route element={<PageLayout><RBACProtectedRoute resource="team"><Account /></RBACProtectedRoute></PageLayout>} path="/account" />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </AssistantProvider>
        </BrandingProvider>
        </RBACProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
