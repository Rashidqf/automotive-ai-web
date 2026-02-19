import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Car,
  Users,
  Wrench,
  MessageSquare,
  X
} from "lucide-react";

interface Alert {
  id: string;
  type: "inventory" | "follow_up" | "service" | "system";
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
  timestamp: string;
  read: boolean;
  actionLabel?: string;
}

const alerts: Alert[] = [
  { id: "1", type: "inventory", title: "Low Inventory Alert", message: "SUV inventory is running low. Only 3 units remaining in stock.", priority: "high", timestamp: "5 minutes ago", read: false, actionLabel: "View Inventory" },
  { id: "2", type: "follow_up", title: "Follow-up Reminder", message: "John Smith - Toyota Camry inquiry needs a callback today at 3:00 PM.", priority: "high", timestamp: "10 minutes ago", read: false, actionLabel: "Call Now" },
  { id: "3", type: "service", title: "Service Completed", message: "2022 Honda Accord - Oil change completed. Customer notified for pickup.", priority: "low", timestamp: "30 minutes ago", read: false, actionLabel: "View Details" },
  { id: "4", type: "follow_up", title: "Follow-up Reminder", message: "Sarah Johnson is waiting for financing approval update.", priority: "medium", timestamp: "1 hour ago", read: false, actionLabel: "Update Customer" },
  { id: "5", type: "inventory", title: "Stock Aging Notice", message: "2024 Tesla Model 3 (White) has been in stock for 60+ days.", priority: "medium", timestamp: "2 hours ago", read: true },
  { id: "6", type: "service", title: "Parts Arrived", message: "Transmission parts for 2021 Toyota RAV4 have arrived at the service center.", priority: "low", timestamp: "3 hours ago", read: true, actionLabel: "Start Repair" },
  { id: "7", type: "system", title: "Weekly Report Ready", message: "Your weekly sales and service report is ready for review.", priority: "low", timestamp: "5 hours ago", read: true, actionLabel: "View Report" },
  { id: "8", type: "follow_up", title: "Missed Follow-up", message: "Mike Wilson - Ford F-150 test drive follow-up was due yesterday.", priority: "high", timestamp: "Yesterday", read: true, actionLabel: "Contact Now" },
];

const typeIcons = {
  inventory: Car,
  follow_up: Users,
  service: Wrench,
  system: Bell,
};

const typeColors = {
  inventory: "bg-blue-500/10 text-blue-500",
  follow_up: "bg-purple-500/10 text-purple-500",
  service: "bg-green-500/10 text-green-500",
  system: "bg-gray-500/10 text-gray-500",
};

const priorityStyles = {
  high: "border-l-4 border-l-red-500 bg-red-500/5",
  medium: "border-l-4 border-l-yellow-500 bg-yellow-500/5",
  low: "border-l-4 border-l-green-500 bg-green-500/5",
};

export function AlertsTab() {
  const unreadCount = alerts.filter((a) => !a.read).length;
  const highPriorityCount = alerts.filter((a) => a.priority === "high" && !a.read).length;

  const stats = {
    total: alerts.length,
    unread: unreadCount,
    highPriority: highPriorityCount,
    followUps: alerts.filter((a) => a.type === "follow_up").length,
  };

  const unreadAlerts = alerts.filter((a) => !a.read);
  const readAlerts = alerts.filter((a) => a.read);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.unread}</p>
                <p className="text-xs text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
                <p className="text-xs text-muted-foreground">Needs Attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.followUps}</p>
                <p className="text-xs text-muted-foreground">Follow-ups Due</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unread Alerts */}
      {unreadAlerts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                New Notifications
                <Badge variant="destructive" className="ml-2">{unreadAlerts.length}</Badge>
              </CardTitle>
              <Button variant="ghost" size="sm">Mark all as read</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unreadAlerts.map((alert) => {
                const Icon = typeIcons[alert.type];
                return (
                  <div key={alert.id} className={`flex items-start gap-4 p-4 rounded-lg ${priorityStyles[alert.priority]}`}>
                    <div className={`p-2 rounded-lg ${typeColors[alert.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                        {alert.actionLabel && (
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            {alert.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earlier Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Earlier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {readAlerts.map((alert) => {
              const Icon = typeIcons[alert.type];
              return (
                <div key={alert.id} className="flex items-start gap-4 p-4 rounded-lg border bg-muted/20">
                  <div className={`p-2 rounded-lg ${typeColors[alert.type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm text-muted-foreground">{alert.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      {alert.actionLabel && (
                        <Button size="sm" variant="ghost" className="h-7 text-xs">
                          {alert.actionLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
