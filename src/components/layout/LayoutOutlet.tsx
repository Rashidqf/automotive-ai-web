import { Outlet, useLocation } from "react-router-dom";
import { DealerLayoutWrapper } from "./DealerLayoutWrapper";

/**
 * Renders the correct layout based on path:
 * - /dealerships/:id → DealerLayoutWrapper (dealership sidebar + outlet) for both admin and dealer
 * - All other routes → Outlet (admin pages use their own DashboardLayout)
 */
export function LayoutOutlet() {
  const location = useLocation();
  const pathname = location.pathname;
  const isDealerRoute = /^\/dealerships\/[^/]+$/.test(pathname);

  if (isDealerRoute) {
    return <DealerLayoutWrapper />;
  }

  return <Outlet />;
}
