import { Outlet, useParams, useSearchParams } from "react-router-dom";
import { DealershipLayout } from "./DealershipLayout";
import { useDealershipById } from "@/hooks/useDealerships";

/**
 * Wraps dealer/employee route (/dealerships/:id) with DealershipLayout and sidebar.
 * Fetches dealership name and syncs tab with URL (?tab=employees).
 */
export function DealerLayoutWrapper() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "service-bulletins";

  const { data, isLoading } = useDealershipById(id ?? null);
  const dealership = data?.data;
  const title = dealership?.name ?? "Dealership";
  const dealershipName = dealership?.name ?? "Loading...";

  const onTabChange = (newTab: string) => {
    setSearchParams({ tab: newTab });
  };

  if (isLoading || !dealership) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <DealershipLayout
      title={title}
      subtitle="Dealership Management Portal"
      dealershipName={dealershipName}
      activeTab={tab}
      onTabChange={onTabChange}
    >
      <Outlet />
    </DealershipLayout>
  );
}
