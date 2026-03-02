import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ServiceCenterChart } from "@/components/dashboard/ServiceCenterChart";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { Users, Car, Gift, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.userType === "dealership" || user?.userType === "employee") {
      if (user?.dealershipId) {
        navigate(`/dealerships/${user.dealershipId}`, { replace: true });
      }
    }
  }, [user?.userType, user?.dealershipId, navigate]);

  const handleAddUser = () => {
    navigate("/users");
    toast.success("Redirecting to User Management");
  };

  const handleCreateOffer = () => {
    navigate("/offers");
    toast.success("Redirecting to Offers & Engagement");
  };

  const handleVehicleReport = () => {
    navigate("/vehicles");
    toast.success("Redirecting to Vehicle Records");
  };

  const handleActivityLog = () => {
    navigate("/activity");
    toast.success("Redirecting to Activity Tracking");
  };

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back, Admin. Here's what's happening today."
    >
      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="12,847"
          change="+12% from last month"
          changeType="positive"
          icon={Users}
          iconColor="primary"
        />
        <StatCard
          title="Active Users"
          value="8,432"
          change="+8% from last week"
          changeType="positive"
          icon={Activity}
          iconColor="success"
        />
        <StatCard
          title="Vehicles Tracked"
          value="15,290"
          change="+156 new this week"
          changeType="positive"
          icon={Car}
          iconColor="accent"
        />
        <StatCard
          title="Active Offers"
          value="24"
          change="3 expiring soon"
          changeType="neutral"
          icon={Gift}
          iconColor="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EngagementChart />
        </div>
        <ServiceCenterChart />
      </div>

      {/* Activity Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        
        {/* Quick Actions */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <button 
              onClick={handleAddUser}
              className="flex items-center gap-3 rounded-lg border border-border p-4 text-left transition-all hover:border-primary hover:bg-primary/5 cursor-pointer"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Add New User</p>
                <p className="text-sm text-muted-foreground">Register a new user</p>
              </div>
            </button>
            <button 
              onClick={handleCreateOffer}
              className="flex items-center gap-3 rounded-lg border border-border p-4 text-left transition-all hover:border-accent hover:bg-accent/5 cursor-pointer"
            >
              <div className="rounded-lg bg-accent/10 p-2">
                <Gift className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">Create Offer</p>
                <p className="text-sm text-muted-foreground">Launch a new campaign</p>
              </div>
            </button>
            <button 
              onClick={handleVehicleReport}
              className="flex items-center gap-3 rounded-lg border border-border p-4 text-left transition-all hover:border-success hover:bg-success/5 cursor-pointer"
            >
              <div className="rounded-lg bg-success/10 p-2">
                <Car className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">Vehicle Report</p>
                <p className="text-sm text-muted-foreground">Generate service report</p>
              </div>
            </button>
            <button 
              onClick={handleActivityLog}
              className="flex items-center gap-3 rounded-lg border border-border p-4 text-left transition-all hover:border-warning hover:bg-warning/5 cursor-pointer"
            >
              <div className="rounded-lg bg-warning/10 p-2">
                <Activity className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-foreground">Activity Log</p>
                <p className="text-sm text-muted-foreground">View detailed logs</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
