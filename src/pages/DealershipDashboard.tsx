import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DealershipLayout } from "@/components/layout/DealershipLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Mail,
  Calendar,
} from "lucide-react";
import { mockDealerships, Dealership } from "@/data/mockData";

// Import tab components
import { CarServiceBulletinsTab } from "@/components/dealership/CarServiceBulletinsTab";
import { EmployeesTab } from "@/components/dealership/EmployeesTab";

const DealershipDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dealership, setDealership] = useState<Dealership | null>(null);
  const [activeTab, setActiveTab] = useState("service-bulletins");

  useEffect(() => {
    const foundDealership = mockDealerships.find((d) => d.id === id);
    if (foundDealership) {
      setDealership(foundDealership);
    } else {
      navigate("/dealerships");
    }
  }, [id, navigate]);

  if (!dealership) {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "service-bulletins":
        return <CarServiceBulletinsTab dealershipId={dealership.id} />;
      case "employees":
        return <EmployeesTab dealershipId={dealership.id} />;
      default:
        return <CarServiceBulletinsTab dealershipId={dealership.id} />;
    }
  };

  return (
    <DealershipLayout
      title={dealership.name}
      subtitle="Dealership Management Portal"
      dealershipName={dealership.name}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
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
                <span>Created: {dealership.createdAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </DealershipLayout>
  );
};

export default DealershipDashboard;
