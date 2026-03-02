import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Calendar } from "lucide-react";
import { useDealershipById } from "@/hooks/useDealerships";
import { CarServiceBulletinsTab } from "@/components/dealership/CarServiceBulletinsTab";
import { EmployeesTab } from "@/components/dealership/EmployeesTab";
import { WorkshopsTab } from "@/components/dealership/WorkshopsTab";

/**
 * Dealership dashboard content. Rendered inside DealerLayoutWrapper when on /dealerships/:id.
 * Tab is driven by URL ?tab= (sidebar lives in the layout).
 */
const DealershipDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "service-bulletins";

  const { data, isLoading, isError } = useDealershipById(id ?? null);
  const dealership = data?.data;

  if (isLoading || !id) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (isError || !dealership) {
    navigate("/dealerships", { replace: true });
    return null;
  }
  const createdAt = dealership.createdAt ? new Date(dealership.createdAt).toLocaleDateString() : "";

  const renderTabContent = () => {
    switch (activeTab) {
      case "service-bulletins":
        return <CarServiceBulletinsTab dealershipId={dealership.id} />;
      case "employees":
        return <EmployeesTab dealershipId={dealership.id} />;
      case "workshops":
        return <WorkshopsTab dealershipId={dealership.id} />;
      default:
        return <CarServiceBulletinsTab dealershipId={dealership.id} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dealership Details Card */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant={dealership.status === "active" ? "default" : "secondary"}>
              {dealership.status}
            </Badge>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {dealership.address}, {dealership.city}, {dealership.state}{" "}
                {dealership.zipCode}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>Login ID: {dealership.username}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Created: {createdAt}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default DealershipDashboard;
