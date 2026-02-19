import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Search, Check, Clock, AlertTriangle, Info, Trash2, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "reminder";
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Service Due Reminder",
    message: "John Smith's vehicle CA-1234-ABC is due for oil change in 3 days.",
    type: "reminder",
    timestamp: "2024-01-22 10:30 AM",
    read: false,
  },
  {
    id: "2",
    title: "New User Registration",
    message: "A new user Emily Johnson has registered with vehicle TX-5678-DEF.",
    type: "info",
    timestamp: "2024-01-22 09:15 AM",
    read: false,
  },
  {
    id: "3",
    title: "Non-Preferred Center Visit",
    message: "Michael Davis visited a non-preferred service center. Consider sending an offer.",
    type: "warning",
    timestamp: "2024-01-21 03:45 PM",
    read: true,
  },
  {
    id: "4",
    title: "Offer Redeemed",
    message: "15% discount offer was redeemed by Sarah Williams at AutoCare Plus.",
    type: "success",
    timestamp: "2024-01-21 11:00 AM",
    read: true,
  },
  {
    id: "5",
    title: "Maintenance Reminder",
    message: "5 vehicles are due for maintenance this week. Review and send reminders.",
    type: "reminder",
    timestamp: "2024-01-20 08:00 AM",
    read: false,
  },
  {
    id: "6",
    title: "System Update",
    message: "New features have been added to the dashboard. Check the changelog.",
    type: "info",
    timestamp: "2024-01-19 02:30 PM",
    read: true,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || notification.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-primary" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "success":
        return <Check className="h-5 w-5 text-success" />;
      case "reminder":
        return <Clock className="h-5 w-5 text-accent" />;
    }
  };

  const getTypeBadgeClass = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return "bg-primary/10 text-primary";
      case "warning":
        return "bg-warning/10 text-warning";
      case "success":
        return "bg-success/10 text-success";
      case "reminder":
        return "bg-accent/10 text-accent";
    }
  };

  return (
    <DashboardLayout
      title="Notifications & Reminders"
      subtitle="View and manage important updates and alerts"
    >
      {/* Summary Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <Bell className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{unreadCount}</p>
              <p className="text-sm text-muted-foreground">Unread</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">
                {notifications.filter((n) => n.type === "reminder").length}
              </p>
              <p className="text-sm text-muted-foreground">Reminders</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">
                {notifications.filter((n) => n.type === "warning").length}
              </p>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="reminder">Reminder</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2" onClick={markAllAsRead}>
          <CheckCheck className="h-4 w-4" />
          Mark All Read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "rounded-xl bg-card p-4 shadow-card transition-all hover:shadow-elevated",
              !notification.read && "border-l-4 border-l-primary"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                getTypeBadgeClass(notification.type)
              )}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs capitalize",
                      getTypeBadgeClass(notification.type)
                    )}>
                      {notification.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3" /> Mark Read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs text-destructive"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No notifications found</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;
