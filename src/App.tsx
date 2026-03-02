import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LayoutOutlet } from "@/components/layout/LayoutOutlet";
import Index from "./pages/Index";
import Users from "./pages/Users";
import Offers from "./pages/Offers";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Dealerships from "./pages/Dealerships";
import DealershipDashboard from "./pages/DealershipDashboard";
import Employees from "./pages/Employees";
import Notifications from "./pages/Notifications";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            {/* Protected routes: LayoutOutlet shows Admin layout (per-page) or Dealer layout (sidebar) for /dealerships/:id */}
            <Route element={<ProtectedRoute><LayoutOutlet /></ProtectedRoute>}>
              <Route path="/" element={<Index />} />
              <Route path="/users" element={<ProtectedRoute allowedRoles={["admin"]}><Users /></ProtectedRoute>} />
              <Route path="/dealerships" element={<Dealerships />} />
              <Route path="/dealerships/:id" element={<ProtectedRoute requireDealershipMatch><DealershipDashboard /></ProtectedRoute>} />
              <Route path="/employees" element={<ProtectedRoute allowedRoles={["admin"]}><Employees /></ProtectedRoute>} />
              <Route path="/offers" element={<ProtectedRoute allowedRoles={["admin", "employee"]} allowedAccess={["offers"]}><Offers /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute allowedRoles={["admin", "employee"]} allowedAccess={["analytics"]}><Analytics /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute allowedRoles={["admin"]}><Settings /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute allowedRoles={["admin", "employee"]} allowedAccess={["notifications"]}><Notifications /></ProtectedRoute>} />
              <Route path="/account" element={<Account />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
