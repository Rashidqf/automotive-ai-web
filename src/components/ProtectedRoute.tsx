import { ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  allowedAccess?: string[];
  requireDealershipMatch?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  allowedAccess,
  requireDealershipMatch,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const params = useParams();
  const id = params.id;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const defaultRedirect = user.dealershipId ? `/dealerships/${user.dealershipId}` : "/";
  if (allowedRoles && allowedRoles.length > 0) {
    const roleOk = allowedRoles.includes(user.userType);
    const employeeAccessOk =
      user.userType === "employee" && allowedAccess && allowedAccess.length > 0 && user.access?.some((a) => allowedAccess.includes(a));
    if (!roleOk && !employeeAccessOk) {
      return <Navigate to={defaultRedirect} replace />;
    }
  }
  if (allowedAccess && allowedAccess.length > 0 && user.userType === "employee") {
    const hasAccess = user.access?.some((a) => allowedAccess.includes(a));
    if (!hasAccess) {
      return <Navigate to={defaultRedirect} replace />;
    }
  }

  if (requireDealershipMatch && id) {
    const isAdmin = user.userType === "admin";
    const canAccessDealership = isAdmin || (user.dealershipId && String(user.dealershipId) === id);
    if (!canAccessDealership) {
      return <Navigate to={user.dealershipId ? `/dealerships/${user.dealershipId}` : "/"} replace />;
    }
  }

  return <>{children}</>;
}
