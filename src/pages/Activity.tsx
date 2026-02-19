import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Car,
} from "lucide-react";
import { mockActivityLogs } from "@/data/mockData";
import { cn } from "@/lib/utils";

const Activity = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [centerFilter, setCenterFilter] = useState("all");

  const filteredLogs = mockActivityLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCenter =
      centerFilter === "all" ||
      (centerFilter === "preferred" && log.isPreferredCenter) ||
      (centerFilter === "non-preferred" && !log.isPreferredCenter);

    return matchesSearch && matchesCenter;
  });

  const preferredCount = mockActivityLogs.filter((l) => l.isPreferredCenter).length;
  const nonPreferredCount = mockActivityLogs.filter((l) => !l.isPreferredCenter).length;

  return (
    <DashboardLayout
      title="User Activity Tracking"
      subtitle="Monitor real-time user actions and service center selections"
    >
      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mockActivityLogs.length}</p>
              <p className="text-sm text-muted-foreground">Total Activities</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{preferredCount}</p>
              <p className="text-sm text-muted-foreground">Preferred Center Visits</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <XCircle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{nonPreferredCount}</p>
              <p className="text-sm text-muted-foreground">Non-Preferred Visits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by user, vehicle, or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={centerFilter} onValueChange={setCenterFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by Center" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="preferred">Preferred Centers</SelectItem>
            <SelectItem value="non-preferred">Non-Preferred</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {filteredLogs.map((log, index) => (
          <div
            key={log.id}
            className={cn(
              "relative flex gap-4 rounded-xl bg-card p-4 shadow-card transition-all hover:shadow-elevated",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Timeline Indicator */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  log.isPreferredCenter ? "bg-success/10" : "bg-warning/10"
                )}
              >
                {log.isPreferredCenter ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-warning" />
                )}
              </div>
              {index < filteredLogs.length - 1 && (
                <div className="mt-2 h-full w-px bg-border" />
              )}
            </div>

            {/* Activity Content */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-foreground">{log.action}</h4>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {log.timestamp}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{log.userName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{log.vehicleNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{log.serviceCenter}</span>
                  {log.isPreferredCenter ? (
                    <span className="badge badge-success">Preferred</span>
                  ) : (
                    <span className="badge badge-warning">Non-Preferred</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-6 text-center">
        <Button variant="outline" className="gap-2">
          Load More Activities
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Activity;
