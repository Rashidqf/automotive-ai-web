import { Car, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  vehicleNumber: string;
  action: string;
  serviceCenter: string;
  isPreferred: boolean;
  timestamp: string;
}

const recentActivities: Activity[] = [
  {
    id: "1",
    vehicleNumber: "KA-01-AB-1234",
    action: "Oil Change",
    serviceCenter: "AutoCare Plus",
    isPreferred: true,
    timestamp: "2 min ago",
  },
  {
    id: "2",
    vehicleNumber: "MH-12-CD-5678",
    action: "Service Booking",
    serviceCenter: "Quick Lube Center",
    isPreferred: false,
    timestamp: "15 min ago",
  },
  {
    id: "3",
    vehicleNumber: "DL-05-EF-9012",
    action: "Oil Change",
    serviceCenter: "Premium Motors",
    isPreferred: true,
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    vehicleNumber: "TN-07-GH-3456",
    action: "Service Completed",
    serviceCenter: "City Auto Workshop",
    isPreferred: false,
    timestamp: "2 hours ago",
  },
  {
    id: "5",
    vehicleNumber: "GJ-01-IJ-7890",
    action: "Oil Change",
    serviceCenter: "AutoCare Plus",
    isPreferred: true,
    timestamp: "3 hours ago",
  },
];

export function RecentActivity() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <button className="text-sm font-medium text-primary hover:underline">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate">{activity.vehicleNumber}</p>
                {activity.isPreferred ? (
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-warning shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{activity.action}</span>
                <span>•</span>
                <MapPin className="h-3 w-3" />
                <span className="truncate">{activity.serviceCenter}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" />
              <span>{activity.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
